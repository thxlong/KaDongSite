-- Migration 008: Authentication System Tables
-- Created: 2025-11-13
-- Purpose: Create tables for user authentication, session management, and security tracking

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
-- Main users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' NOT NULL CHECK (role IN ('admin', 'user', 'guest')),
  email_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- 2. SESSIONS TABLE
-- ============================================
-- Track active user sessions and JWT tokens
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP
);

-- Indexes for sessions table
CREATE INDEX idx_sessions_user_id ON sessions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_sessions_token ON sessions(token) WHERE revoked_at IS NULL;
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ============================================
-- 3. LOGIN_ATTEMPTS TABLE
-- ============================================
-- Track login attempts for security monitoring
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for login_attempts table
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_created_at ON login_attempts(created_at DESC);

-- ============================================
-- 4. PASSWORD_RESET_TOKENS TABLE
-- ============================================
-- Store password reset tokens
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for password_reset_tokens table
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token) WHERE used_at IS NULL;
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);

-- ============================================
-- 5. TRIGGERS
-- ============================================
-- Trigger to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. COMMENTS
-- ============================================
COMMENT ON TABLE users IS 'User accounts for authentication';
COMMENT ON TABLE sessions IS 'Active user sessions with JWT tokens';
COMMENT ON TABLE login_attempts IS 'Login attempt history for security monitoring';
COMMENT ON TABLE password_reset_tokens IS 'Password reset tokens with expiry';

COMMENT ON COLUMN users.password_hash IS 'bcrypt hashed password (never store plain text)';
COMMENT ON COLUMN users.role IS 'User role: admin, user, or guest';
COMMENT ON COLUMN users.email_verified IS 'Email verification status';
COMMENT ON COLUMN users.preferences IS 'User preferences stored as JSON';

COMMENT ON COLUMN sessions.token IS 'JWT token string';
COMMENT ON COLUMN sessions.expires_at IS 'Token expiration timestamp';
COMMENT ON COLUMN sessions.revoked_at IS 'Token revocation timestamp (for logout)';

COMMENT ON COLUMN login_attempts.success IS 'Whether login attempt was successful';
COMMENT ON COLUMN login_attempts.failure_reason IS 'Reason for failed login';

COMMENT ON COLUMN password_reset_tokens.used_at IS 'Timestamp when token was used';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Token expiration (1 hour from creation)';
