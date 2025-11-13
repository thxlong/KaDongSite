-- Migration 008 Rollback: Drop Authentication System Tables
-- Created: 2025-11-13
-- Purpose: Rollback authentication system migration

-- Drop triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables in reverse order (respecting foreign key constraints)
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS login_attempts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Drop indexes (will be dropped automatically with tables, but explicit for clarity)
-- Users indexes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_created_at;

-- Sessions indexes
DROP INDEX IF EXISTS idx_sessions_user_id;
DROP INDEX IF EXISTS idx_sessions_token;
DROP INDEX IF EXISTS idx_sessions_expires_at;

-- Login attempts indexes
DROP INDEX IF EXISTS idx_login_attempts_email;
DROP INDEX IF EXISTS idx_login_attempts_ip;
DROP INDEX IF EXISTS idx_login_attempts_created_at;

-- Password reset tokens indexes
DROP INDEX IF EXISTS idx_password_reset_user_id;
DROP INDEX IF EXISTS idx_password_reset_token;
DROP INDEX IF EXISTS idx_password_reset_expires;
