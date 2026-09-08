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

export function createD1Dao(database) {
    return {
        async cleanupExpired(now) {
            await database.batch([
                database.prepare('DELETE FROM sessions WHERE expires_at <= ? OR revoked_at IS NOT NULL').bind(now),
                database.prepare('DELETE FROM registrations WHERE expires_at <= ?').bind(now),
                database.prepare('DELETE FROM users WHERE expires_at <= ?').bind(now)
            ]);
        },

        findUserByAccount(account) {
            return database.prepare('SELECT * FROM users WHERE account = ?').bind(account).first();
        },

        findAuthenticatedUserByTokenHash(tokenHash, now) {
            return database.prepare(`
                SELECT u.* FROM sessions s
                JOIN users u ON u.id = s.user_id
                WHERE s.token_hash = ? AND s.revoked_at IS NULL
                  AND s.expires_at > ? AND u.expires_at > ?
            `).bind(tokenHash, now, now).first();
        },

        async findRegistrationByUserId(userId) {
            const row = await database.prepare(
                'SELECT * FROM registrations WHERE user_id = ?'
            ).bind(userId).first();
            return mapRegistration(row);
        },

        async createUserWithRegistration({ user, registration }) {
            try {
                await database.batch([
                    database.prepare(`
                        INSERT INTO users (
                            id, account, password_algorithm, password_iterations,
                            password_salt, password_hash, role, created_at, expires_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        user.id, user.account, user.passwordAlgorithm,
                        user.passwordIterations, user.passwordSalt,
                        user.passwordHash, user.role, user.createdAt, user.expiresAt
                    ),
                    database.prepare(`
                        INSERT INTO registrations (
                            id, user_id, status, registration_type, name, email,
                            phone, identity, company, department, job_title,
                            interests_json, created_at, expires_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        registration.id, registration.userId, registration.status,
                        registration.registrationType, registration.name,
                        registration.email, registration.phone, registration.identity,
                        registration.company, registration.department,
                        registration.jobTitle, registration.interestsJson,
                        registration.createdAt, registration.expiresAt
                    )
                ]);
            } catch (error) {
                if (String(error.message).includes('UNIQUE')) error.code = 'ACCOUNT_TAKEN';
                throw error;
            }
        },

        createSession(session) {
            return database.prepare(`
                INSERT INTO sessions (id, user_id, token_hash, created_at, expires_at)
                VALUES (?, ?, ?, ?, ?)
            `).bind(
                session.id, session.userId, session.tokenHash,
                session.createdAt, session.expiresAt
            ).run();
        },

        revokeSession(tokenHash, revokedAt) {
            return database.prepare(
                'UPDATE sessions SET revoked_at = ? WHERE token_hash = ?'
            ).bind(revokedAt, tokenHash).run();
        }
    };
}
