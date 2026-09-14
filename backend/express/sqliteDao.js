import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        account TEXT NOT NULL UNIQUE COLLATE NOCASE,
        password_algorithm TEXT NOT NULL,
        password_iterations INTEGER NOT NULL,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        retention_exempt INTEGER NOT NULL DEFAULT 0,
        seed_batch TEXT,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL,
        registration_type TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        identity TEXT NOT NULL,
        company TEXT NOT NULL DEFAULT '',
        department TEXT NOT NULL DEFAULT '',
        job_title TEXT NOT NULL DEFAULT '',
        interests_json TEXT NOT NULL DEFAULT '[]',
        retention_exempt INTEGER NOT NULL DEFAULT 0,
        seed_batch TEXT,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL UNIQUE,
        created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,
        revoked_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
`;

function ensureColumn(database, table, column, definition) {
    const columns = database.prepare(`PRAGMA table_info(${table})`).all();
    if (!columns.some((item) => item.name === column)) {
        database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
}

function ensureCurrentSchema(database) {
    ensureColumn(database, 'users', 'retention_exempt', 'INTEGER NOT NULL DEFAULT 0');
    ensureColumn(database, 'users', 'seed_batch', 'TEXT');
    ensureColumn(database, 'registrations', 'retention_exempt', 'INTEGER NOT NULL DEFAULT 0');
    ensureColumn(database, 'registrations', 'seed_batch', 'TEXT');
    database.exec('CREATE INDEX IF NOT EXISTS idx_users_seed_batch ON users(seed_batch)');
}

function insertUserWithRegistration(database, { user, registration }) {
    database.prepare(`
        INSERT INTO users (
            id, account, password_algorithm, password_iterations,
            password_salt, password_hash, role, retention_exempt,
            seed_batch, created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        user.id, user.account, user.passwordAlgorithm,
        user.passwordIterations, user.passwordSalt,
        user.passwordHash, user.role, user.retentionExempt,
        user.seedBatch, user.createdAt, user.expiresAt
    );
    database.prepare(`
        INSERT INTO registrations (
            id, user_id, status, registration_type, name, email,
            phone, identity, company, department, job_title,
            interests_json, retention_exempt, seed_batch,
            created_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        registration.id, registration.userId, registration.status,
        registration.registrationType, registration.name,
        registration.email, registration.phone, registration.identity,
        registration.company, registration.department,
        registration.jobTitle, registration.interestsJson,
        registration.retentionExempt, registration.seedBatch,
        registration.createdAt, registration.expiresAt
    );
}

function mapRegistration(row) {
    if (!row) return null;
    return {
        registrationId: row.id,
        status: row.status,
        registrationType: row.registration_type,
        name: row.name,
        email: row.email,
        phone: row.phone,
        identity: row.identity,
        company: row.company,
        department: row.department,
        jobTitle: row.job_title,
        interests: JSON.parse(row.interests_json),
        ...(row.account === undefined ? {} : { account: row.account }),
        createdAt: row.created_at,
        expiresAt: row.expires_at
    };
}

function mapRegistrationListItem(row) {
    const { expiresAt, ...registration } = mapRegistration(row);
    return registration;
}

export function createSqliteDao(databaseFile) {
    mkdirSync(path.dirname(databaseFile), { recursive: true });
    const database = new DatabaseSync(databaseFile, {
        enableForeignKeyConstraints: true
    });
    database.exec(schema);
    ensureCurrentSchema(database);

    return {
        cleanupExpired(now) {
            database.exec('BEGIN');
            try {
                database.prepare('DELETE FROM sessions WHERE expires_at <= ? OR revoked_at IS NOT NULL').run(now);
                database.prepare('DELETE FROM registrations WHERE retention_exempt = 0 AND expires_at <= ?').run(now);
                database.prepare('DELETE FROM users WHERE retention_exempt = 0 AND expires_at <= ?').run(now);
                database.exec('COMMIT');
            } catch (error) {
                database.exec('ROLLBACK');
                throw error;
            }
        },

        findUserByAccount(account) {
            return database.prepare('SELECT * FROM users WHERE account = ?').get(account) ?? null;
        },

        findAuthenticatedUserByTokenHash(tokenHash, now) {
            return database.prepare(`
                SELECT u.* FROM sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token_hash = ? AND s.revoked_at IS NULL
                  AND s.expires_at > ?
                  AND (u.retention_exempt = 1 OR u.expires_at > ?)
            `).get(tokenHash, now, now) ?? null;
        },

        findRegistrationByUserId(userId) {
            return mapRegistration(
                database.prepare('SELECT * FROM registrations WHERE user_id = ?').get(userId)
            );
        },

        findAllRegistrations() {
            return database.prepare(`
                SELECT r.*, u.account
                FROM registrations r
                JOIN users u ON u.id = r.user_id
                ORDER BY r.created_at DESC, r.id ASC
            `).all().map(mapRegistrationListItem);
        },

        findRegistrationsByUserId(userId) {
            return database.prepare(`
                SELECT r.*, u.account
                FROM registrations r
                JOIN users u ON u.id = r.user_id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC, r.id ASC
            `).all(userId).map(mapRegistrationListItem);
        },

        createUserWithRegistration({ user, registration }) {
            database.exec('BEGIN');
            try {
                insertUserWithRegistration(database, { user, registration });
                database.exec('COMMIT');
            } catch (error) {
                database.exec('ROLLBACK');
                if (String(error.code).includes('CONSTRAINT') || String(error.message).includes('UNIQUE')) {
                    error.code = 'ACCOUNT_TAKEN';
                }
                throw error;
            }
        },

        createSession(session) {
            database.prepare(`
                INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `).run(session.id, session.userId, session.tokenHash, session.createdAt, session.expiresAt);
        },

        revokeSession(tokenHash, revokedAt) {
            database.prepare('UPDATE sessions SET revoked_at = ? WHERE token_hash = ?').run(revokedAt, tokenHash);
        },

        upsertAdmin(user) {
            const existing = database.prepare('SELECT * FROM users WHERE account = ?').get(user.account);
            if (existing && existing.role !== 'admin') {
                const error = new Error('此帳號已存在且不是管理員');
                error.code = 'ACCOUNT_ROLE_CONFLICT';
                throw error;
            }
            database.exec('BEGIN');
            try {
                database.prepare(`
                    INSERT INTO users (
                        id, account, password_algorithm, password_iterations,
                        password_salt, password_hash, role, retention_exempt,
                        seed_batch, created_at, expires_at
                    ) VALUES (?, ?, ?, ?, ?, ?, 'admin', 1, NULL, ?, ?)
                    ON CONFLICT(account) DO UPDATE SET
                        password_algorithm = excluded.password_algorithm,
                        password_iterations = excluded.password_iterations,
                        password_salt = excluded.password_salt,
                        password_hash = excluded.password_hash,
                        role = 'admin',
                        retention_exempt = 1,
                        seed_batch = NULL
                `).run(
                    user.id, user.account, user.passwordAlgorithm,
                    user.passwordIterations, user.passwordSalt, user.passwordHash,
                    user.createdAt, user.expiresAt
                );
                if (existing) {
                    database.prepare('DELETE FROM sessions WHERE user_id = ?').run(existing.id);
                }
                database.exec('COMMIT');
            } catch (error) {
                database.exec('ROLLBACK');
                throw error;
            }
        },

        replaceSeedBatch(seedBatch, entries) {
            database.exec('BEGIN');
            try {
                database.prepare('DELETE FROM users WHERE seed_batch = ?').run(seedBatch);
                for (const entry of entries) {
                    insertUserWithRegistration(database, entry);
                }
                database.exec('COMMIT');
            } catch (error) {
                database.exec('ROLLBACK');
                throw error;
            }
        },

        resetSeedBatch(seedBatch) {
            return database.prepare('DELETE FROM users WHERE seed_batch = ?').run(seedBatch).changes;
        },

        countUsersBySeedBatch(seedBatch) {
            return database.prepare('SELECT COUNT(*) AS count FROM users WHERE seed_batch = ?').get(seedBatch).count;
        },

        countRegistrationsBySeedBatch(seedBatch) {
            return database.prepare('SELECT COUNT(*) AS count FROM registrations WHERE seed_batch = ?').get(seedBatch).count;
        },

        close() {
            database.close();
        }
    };
}
