import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';
import { createSqliteDao } from '../express/sqliteDao.js';
import {
    REGISTRATION_DATA_TTL_MS,
    SESSION_TTL_MS
} from '../shared/auth.js';
import {
    createOrUpdateAdmin,
    DASHBOARD_SEED_BATCH,
    seedDashboard
} from '../scripts/provisioning.js';
import {
    ADMIN_PASSWORD,
    createTestContext,
    login,
    request,
    validRegistration
} from './helpers.js';

test('新公開報名保存 12 小時，且不能由 request 指定 admin 或清理豁免', async () => {
    const context = createTestContext();
    try {
        const response = await request(context.controller, 'POST', '/api/registrations', {
            body: validRegistration({
                role: 'admin',
                retentionExempt: 1,
                seedBatch: DASHBOARD_SEED_BATCH
            })
        });
        assert.equal(response.status, 201);

        const database = new DatabaseSync(context.databaseFile);
        const user = database.prepare('SELECT * FROM users WHERE account = ?').get('regular-member');
        const registration = database.prepare('SELECT * FROM registrations WHERE user_id = ?').get(user.id);
        assert.equal(user.role, 'user');
        assert.equal(user.retention_exempt, 0);
        assert.equal(user.seed_batch, null);
        assert.equal(registration.retention_exempt, 0);
        assert.equal(registration.seed_batch, null);
        assert.equal(user.expires_at - user.created_at, REGISTRATION_DATA_TTL_MS);
        assert.equal(registration.expires_at - registration.created_at, REGISTRATION_DATA_TTL_MS);
        database.close();
    } finally {
        context.close();
    }
});

test('Session 與 Cookie 都使用 2 小時期限', async () => {
    const context = createTestContext();
    try {
        await request(context.controller, 'POST', '/api/registrations', {
            body: validRegistration()
        });
        const { response } = await login(context.controller, 'regular-member', 'Regular123');
        assert.equal(response.status, 200);
        assert.match(response.headers['Set-Cookie'], new RegExp(`Max-Age=${SESSION_TTL_MS / 1000}`));

        const database = new DatabaseSync(context.databaseFile);
        const session = database.prepare('SELECT * FROM sessions').get();
        assert.equal(session.expires_at - session.created_at, SESSION_TTL_MS);
        database.close();
    } finally {
        context.close();
    }
});

test('一般資料到期會連同 Session 清除，admin 與 dashboard seed 保留', async () => {
    const context = createTestContext();
    try {
        await request(context.controller, 'POST', '/api/registrations', {
            body: validRegistration()
        });
        const regularLogin = await login(context.controller, 'regular-member', 'Regular123');
        const sessionDatabase = new DatabaseSync(context.databaseFile);
        sessionDatabase.prepare('UPDATE sessions SET expires_at = ?').run(
            context.now + REGISTRATION_DATA_TTL_MS * 2
        );
        sessionDatabase.close();
        await createOrUpdateAdmin({
            dao: context.dao,
            account: 'local-admin',
            password: ADMIN_PASSWORD,
            now: () => context.now
        });
        await seedDashboard({ dao: context.dao });

        context.now += REGISTRATION_DATA_TTL_MS + 1;
        const expiredUserResponse = await request(context.controller, 'GET', '/api/auth/me', {
            cookie: regularLogin.cookie
        });
        assert.equal(expiredUserResponse.status, 401);

        const database = new DatabaseSync(context.databaseFile);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM users WHERE account = ?').get('regular-member').count, 0);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM sessions').get().count, 0);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM users WHERE role = ?').get('admin').count, 1);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM users WHERE seed_batch = ?').get(DASHBOARD_SEED_BATCH).count, 100);
        assert.equal(database.prepare('SELECT COUNT(*) AS count FROM registrations WHERE seed_batch = ?').get(DASHBOARD_SEED_BATCH).count, 100);
        database.close();
    } finally {
        context.close();
    }
});

test('SQLite schema 升級只補欄位，不改既有 expires_at', () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'flowform-legacy-test-'));
    const databaseFile = path.join(directory, 'legacy.db');
    const originalExpiry = 123456789;
    const legacyDatabase = new DatabaseSync(databaseFile);
    legacyDatabase.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            account TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_algorithm TEXT NOT NULL,
            password_iterations INTEGER NOT NULL,
            password_salt TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        );
    `);
    legacyDatabase.prepare(`
        INSERT INTO users (
            id, account, password_algorithm, password_iterations,
            password_salt, password_hash, role, created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('legacy-user', 'legacy', 'PBKDF2-HMAC-SHA-256', 100000, 'salt', 'hash', 'user', 1, originalExpiry);
    legacyDatabase.close();

    const dao = createSqliteDao(databaseFile);
    try {
        const database = new DatabaseSync(databaseFile);
        const row = database.prepare('SELECT * FROM users WHERE id = ?').get('legacy-user');
        assert.equal(row.expires_at, originalExpiry);
        assert.equal(row.retention_exempt, 0);
        assert.equal(row.seed_batch, null);
        database.close();
    } finally {
        dao.close();
        rmSync(directory, { recursive: true, force: true });
    }
});
