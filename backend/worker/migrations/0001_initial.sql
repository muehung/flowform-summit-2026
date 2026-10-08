PRAGMA foreign_keys = ON;

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

CREATE INDEX IF NOT EXISTS idx_sessions_token_hash
    ON sessions(token_hash);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at
    ON sessions(expires_at);
