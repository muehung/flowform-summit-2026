import assert from 'node:assert/strict';
import test from 'node:test';
import { getRegistrationType } from '../shared/validation.js';
import {
    createOrUpdateAdmin,
    DASHBOARD_SEED_BATCH,
    seedDashboard,
    seedTestMembers,
    TEST_MEMBER_ACCOUNTS,
    TEST_MEMBER_SEED_BATCH
} from '../scripts/provisioning.js';
import {
    ADMIN_PASSWORD,
    createTestContext,
    MEMBER_PASSWORD,
    request,
    validRegistration
} from './helpers.js';

test('dashboard seed 重複執行固定為 100 筆，reset 不影響 admin 或測試會員', async () => {
    const context = createTestContext();
    try {
        await createOrUpdateAdmin({
            dao: context.dao,
            account: 'local-admin',
            password: ADMIN_PASSWORD,
            now: () => context.now
        });
        await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD });
        await request(context.controller, 'POST', '/api/registrations', {
            body: validRegistration()
        });
        assert.equal(await seedDashboard({ dao: context.dao }), 100);
        assert.equal(await seedDashboard({ dao: context.dao }), 100);
        assert.equal(context.dao.countUsersBySeedBatch(DASHBOARD_SEED_BATCH), 100);
        assert.equal(context.dao.countRegistrationsBySeedBatch(DASHBOARD_SEED_BATCH), 100);
        const seedUser = context.dao.findUserByAccount('dashboard-seed-001');
        assert.equal(seedUser.password_algorithm, 'PBKDF2-HMAC-SHA-256');
        assert.equal(seedUser.password_iterations, 100000);
        assert.ok(seedUser.password_salt);
        assert.ok(seedUser.password_hash);
        const registrations = context.dao.findAllRegistrations()
            .filter((item) => item.account.startsWith('dashboard-seed-'));
        assert.ok(registrations.some((item) => item.company === ''));
        assert.ok(registrations.some((item) => item.company !== ''));
        assert.ok(new Set(registrations.map((item) => item.createdAt)).size > 1);
        for (const registration of registrations) {
            assert.equal(registration.registrationType, getRegistrationType(registration.identity));
        }

        assert.equal(context.dao.resetSeedBatch(DASHBOARD_SEED_BATCH), 100);
        assert.equal(context.dao.countUsersBySeedBatch(DASHBOARD_SEED_BATCH), 0);
        assert.equal(context.dao.countRegistrationsBySeedBatch(DASHBOARD_SEED_BATCH), 0);
        assert.equal(context.dao.findUserByAccount('local-admin').role, 'admin');
        assert.equal(context.dao.countUsersBySeedBatch(TEST_MEMBER_SEED_BATCH), 2);
        assert.equal(context.dao.findUserByAccount('regular-member').role, 'user');
    } finally {
        context.close();
    }
});

test('測試會員重複執行固定為 2 筆，reset 不影響 dashboard seed', async () => {
    const context = createTestContext();
    try {
        await seedDashboard({ dao: context.dao });
        assert.equal(await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD }), 2);
        assert.equal(await seedTestMembers({ dao: context.dao, password: MEMBER_PASSWORD }), 2);
        assert.equal(context.dao.countUsersBySeedBatch(TEST_MEMBER_SEED_BATCH), 2);
        assert.deepEqual(
            TEST_MEMBER_ACCOUNTS.map((account) => context.dao.findUserByAccount(account).role),
            ['user', 'user']
        );

        assert.equal(context.dao.resetSeedBatch(TEST_MEMBER_SEED_BATCH), 2);
        assert.equal(context.dao.countUsersBySeedBatch(TEST_MEMBER_SEED_BATCH), 0);
        assert.equal(context.dao.countRegistrationsBySeedBatch(TEST_MEMBER_SEED_BATCH), 0);
        assert.equal(context.dao.countUsersBySeedBatch(DASHBOARD_SEED_BATCH), 100);
    } finally {
        context.close();
    }
});

test('相同 admin 帳號重複執行只更新原紀錄', async () => {
    const context = createTestContext();
    try {
        await createOrUpdateAdmin({
            dao: context.dao,
            account: 'local-admin',
            password: ADMIN_PASSWORD,
            now: () => context.now
        });
        const firstId = context.dao.findUserByAccount('local-admin').id;
        await createOrUpdateAdmin({
            dao: context.dao,
            account: 'LOCAL-ADMIN',
            password: MEMBER_PASSWORD,
            now: () => context.now + 1
        });
        const updated = context.dao.findUserByAccount('local-admin');
        assert.equal(updated.id, firstId);
        assert.equal(updated.role, 'admin');
        assert.equal(updated.retention_exempt, 1);
    } finally {
        context.close();
    }
});

test('管理員工具不會把既有一般會員直接提升成 admin', async () => {
    const context = createTestContext();
    try {
        await request(context.controller, 'POST', '/api/registrations', {
            body: validRegistration()
        });
        await assert.rejects(
            createOrUpdateAdmin({
                dao: context.dao,
                account: 'regular-member',
                password: ADMIN_PASSWORD,
                now: () => context.now
            }),
            (error) => error.code === 'ACCOUNT_ROLE_CONFLICT'
        );
        assert.equal(context.dao.findUserByAccount('regular-member').role, 'user');
    } finally {
        context.close();
    }
});
