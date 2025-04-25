CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    bio TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',

    role TEXT NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT 1,

    email_verified BOOLEAN NOT NULL DEFAULT 0,
    verification_token TEXT,

    session_token TEXT UNIQUE,
    session_expires_at TIMESTAMP,

    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
