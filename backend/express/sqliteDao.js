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
        createdAt: row.created_at,
        expiresAt: row.expires_at
    };
}

export function createSqliteDao(databaseFile) {
    mkdirSync(path.dirname(databaseFile), { recursive: true });
    const database = new DatabaseSync(databaseFile, {
        enableForeignKeyConstraints: true
    });
    database.exec(schema);

    return {
        cleanupExpired(now) {
            database.prepare('DELETE FROM sessions WHERE expires_at <= ? OR revoked_at IS NOT NULL').run(now);
            database.prepare('DELETE FROM registrations WHERE expires_at <= ?').run(now);
            database.prepare('DELETE FROM users WHERE expires_at <= ?').run(now);
        },

        findUserByAccount(account) {
            return database.prepare('SELECT * FROM users WHERE account = ?').get(account) ?? null;
        },

        findAuthenticatedUserByTokenHash(tokenHash, now) {
            return database.prepare(`
                SELECT u.* FROM sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token_hash = ? AND s.revoked_at IS NULL
                  AND s.expires_at > ? AND u.expires_at > ?
            `).get(tokenHash, now, now) ?? null;
        },

        findRegistrationByUserId(userId) {
            return mapRegistration(
                database.prepare('SELECT * FROM registrations WHERE user_id = ?').get(userId)
            );
        },

        createUserWithRegistration({ user, registration }) {
            database.exec('BEGIN');
            try {
                database.prepare(`
                    INSERT INTO users (
                        id, account, password_algorithm, password_iterations,
                        password_salt, password_hash, role, created_at, expires_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    user.id, user.account, user.passwordAlgorithm,
                    user.passwordIterations, user.passwordSalt,
                    user.passwordHash, user.role, user.createdAt, user.expiresAt
                );
                database.prepare(`
                    INSERT INTO registrations (
                        id, user_id, status, registration_type, name, email,
                        phone, identity, company, department, job_title,
                        interests_json, created_at, expires_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `).run(
                    registration.id, registration.userId, registration.status,
                    registration.registrationType, registration.name,
                    registration.email, registration.phone, registration.identity,
                    registration.company, registration.department,
                    registration.jobTitle, registration.interestsJson,
                    registration.createdAt, registration.expiresAt
                );
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

        close() {
            database.close();
        }
    };
}
