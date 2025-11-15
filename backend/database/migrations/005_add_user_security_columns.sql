-- Migration: Add security columns to users table
-- Date: 2025-11-15
-- Description: Add columns for account locking and login tracking

-- Add locked_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP WITH TIME ZONE;

-- Add lock_reason column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS lock_reason TEXT;

-- Add last_login_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Add failed_login_attempts column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0;

-- Add last_failed_login column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP WITH TIME ZONE;

-- Create index for locked accounts
CREATE INDEX IF NOT EXISTS idx_users_locked_at ON users(locked_at) WHERE locked_at IS NOT NULL;

-- Create index for last login
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at DESC);

COMMENT ON COLUMN users.locked_at IS 'Timestamp when account was locked';
COMMENT ON COLUMN users.lock_reason IS 'Reason for account lock';
COMMENT ON COLUMN users.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN users.failed_login_attempts IS 'Counter for failed login attempts';
COMMENT ON COLUMN users.last_failed_login IS 'Timestamp of last failed login';
