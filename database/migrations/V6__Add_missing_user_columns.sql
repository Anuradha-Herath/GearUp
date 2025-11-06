-- Add missing columns to users table
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20),
ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL,
ADD COLUMN verification_code VARCHAR(255),
ADD COLUMN enabled BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_token_expiry BIGINT;

-- Update existing role column to have proper default
ALTER TABLE users 
MODIFY COLUMN role VARCHAR(50) DEFAULT 'CUSTOMER';
