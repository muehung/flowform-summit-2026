import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { SESSION_TTL_MS } from '../shared/auth.js';
import {
    createOrUpdateAdmin,
    seedTestMembers,
    TEST_MEMBER_ACCOUNTS
} from '../scripts/provisioning.js';
import {
    ADMIN_PASSWORD,
    createTestContext,
    login,
    MEMBER_PASSWORD,
    request
} from './helpers.js';

test('admin 不需 registration 也能登入、恢復狀態並取得全部報名資料', async () => {
    const context = createTestContext();
    try {
        await createOrUpdateAdmin({
            dao: context.dao,
            account: 'local-admin',
            password: ADMIN_PASSWORD,
            now: () => context.now
        });
        await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD });

        const { response: loginResponse, cookie } = await login(
            context.controller,
            'local-admin',
            ADMIN_PASSWORD
        );
        assert.equal(loginResponse.status, 200);
        assert.deepEqual(loginResponse.body.user, {
            registrationId: null,
            account: 'local-admin',
            name: null,
            registrationType: null,
            role: 'admin'
        });
        assert.match(loginResponse.headers['Cache-Control'], /no-store/);

        const meResponse = await request(context.controller, 'GET', '/api/auth/me', { cookie });
        assert.equal(meResponse.status, 200);
        assert.equal(meResponse.body.user.role, 'admin');
        assert.equal(meResponse.body.user.registrationId, null);

        const listResponse = await request(context.controller, 'GET', '/api/registrations', { cookie });
        assert.equal(listResponse.status, 200);
        assert.equal(listResponse.body.registrations.length, 2);
        assert.deepEqual(
            new Set(listResponse.body.registrations.map((item) => item.account)),
            new Set(TEST_MEMBER_ACCOUNTS)
        );
        assert.equal(listResponse.headers['Cache-Control'], 'no-store');
        for (const registration of listResponse.body.registrations) {
            assert.equal('passwordHash' in registration, false);
            assert.equal('seedBatch' in registration, false);
            assert.equal('retentionExempt' in registration, false);
            assert.equal('expiresAt' in registration, false);
            assert.equal('tokenHash' in registration, false);
        }
    } finally {
        context.close();
    }
});

test('user 只取得自己的資料，request body 不能擴張權限', async () => {
    const context = createTestContext();
    try {
        await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD });
        const { cookie } = await login(
            context.controller,
            TEST_MEMBER_ACCOUNTS[0],
            MEMBER_PASSWORD
        );
        const response = await request(context.controller, 'GET', '/api/registrations', {
            cookie,
            body: { role: 'admin', userId: TEST_MEMBER_ACCOUNTS[1] }
        });
        assert.equal(response.status, 200);
        assert.equal(response.body.registrations.length, 1);
        assert.equal(response.body.registrations[0].account, TEST_MEMBER_ACCOUNTS[0]);
    } finally {
        context.close();
    }
});

test('未登入、登出、Session 到期及未支援角色都不能取得列表', async () => {
    const context = createTestContext();
    try {
        await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD });
        const unauthenticated = await request(context.controller, 'GET', '/api/registrations');
        assert.equal(unauthenticated.status, 401);
        assert.equal(unauthenticated.body.code, 'UNAUTHENTICATED');

        const firstLogin = await login(context.controller, TEST_MEMBER_ACCOUNTS[0], MEMBER_PASSWORD);
        const logoutResponse = await request(context.controller, 'POST', '/api/logout', {
            cookie: firstLogin.cookie
        });
        assert.equal(logoutResponse.status, 204);
        const afterLogout = await request(context.controller, 'GET', '/api/registrations', {
            cookie: firstLogin.cookie
        });
        assert.equal(afterLogout.status, 401);
        const logoutDatabase = new DatabaseSync(context.databaseFile);
        assert.equal(logoutDatabase.prepare('SELECT COUNT(*) AS count FROM sessions').get().count, 0);
        logoutDatabase.close();

        const secondLogin = await login(context.controller, TEST_MEMBER_ACCOUNTS[0], MEMBER_PASSWORD);
        context.now += SESSION_TTL_MS + 1;
        const afterExpiry = await request(context.controller, 'GET', '/api/registrations', {
            cookie: secondLogin.cookie
        });
        assert.equal(afterExpiry.status, 401);

        context.now -= SESSION_TTL_MS + 1;
        const thirdLogin = await login(context.controller, TEST_MEMBER_ACCOUNTS[1], MEMBER_PASSWORD);
        const database = new DatabaseSync(context.databaseFile);
        database.prepare('UPDATE users SET role = ? WHERE account = ?').run('guest', TEST_MEMBER_ACCOUNTS[1]);
        database.close();
        const forbidden = await request(context.controller, 'GET', '/api/registrations', {
            cookie: thirdLogin.cookie
        });
        assert.equal(forbidden.status, 403);
        assert.equal(forbidden.body.code, 'FORBIDDEN');
    } finally {
        context.close();
    }
});

test('不存在的帳號使用共用錯誤，不會造成伺服器錯誤', async () => {
    const context = createTestContext();
    try {
        const { response } = await login(context.controller, 'missing-user', 'WrongPass123');
        assert.equal(response.status, 401);
        assert.equal(response.body.code, 'INVALID_CREDENTIALS');
    } finally {
        context.close();
    }
});
