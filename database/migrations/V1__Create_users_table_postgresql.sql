-- Create database
CREATE DATABASE autoserve;

-- Connect to the database
\c autoserve;

-- Users table will be created automatically by Hibernate
-- But you can run this if you want to create it manually:

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_token_expiry BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_verification_code ON users(verification_code);
CREATE INDEX idx_users_reset_token ON users(reset_password_token);
