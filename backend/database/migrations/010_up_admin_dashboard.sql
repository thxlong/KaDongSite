/**
 * Migration: Admin Dashboard & Management System
 * Version: 010_up
 * Description: Create tables for RBAC, security management, audit logging
 * Date: 2025-11-15
 */

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ROLES TABLE (RBAC)
-- ============================================================================
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb, -- Array of permission strings
  is_system BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'Role-Based Access Control (RBAC) roles';
COMMENT ON COLUMN roles.permissions IS 'Array of permission strings like ["users.create", "users.read"]';
COMMENT ON COLUMN roles.is_system IS 'System roles (admin, user, guest) cannot be deleted';

-- ============================================================================
-- USER_ROLES TABLE (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

COMMENT ON TABLE user_roles IS 'User-Role mapping (Many-to-Many relationship)';
COMMENT ON COLUMN user_roles.assigned_by IS 'Admin who assigned this role';

-- ============================================================================
-- BLOCKED_IPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET UNIQUE NOT NULL,
  reason TEXT,
  blocked_by UUID REFERENCES users(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE blocked_ips IS 'IP addresses blocked for security reasons';
COMMENT ON COLUMN blocked_ips.expires_at IS 'Auto-unblock after this time (NULL = permanent)';

-- ============================================================================
-- ADMIN_AUDIT_LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- create_user, delete_user, assign_role, etc.
  target_type VARCHAR(50), -- user, role, ip, session
  target_id UUID,
  changes JSONB, -- { before: {...}, after: {...} }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE admin_audit_logs IS 'Audit trail for all admin actions';
COMMENT ON COLUMN admin_audit_logs.action IS 'Action type: create_user, delete_user, assign_role, lock_account, etc.';
COMMENT ON COLUMN admin_audit_logs.changes IS 'Before/After state for accountability';

-- ============================================================================
-- SECURITY_ALERTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) NOT NULL, -- brute_force, suspicious_login, multiple_sessions
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB, -- Additional context
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE security_alerts IS 'Security alerts for admin monitoring';
COMMENT ON COLUMN security_alerts.type IS 'Alert type: brute_force, suspicious_login, etc.';
COMMENT ON COLUMN security_alerts.severity IS 'Severity level: low, medium, high, critical';

-- ============================================================================
-- ALTER EXISTING USERS TABLE
-- ============================================================================
-- Add columns for account locking and last login tracking
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS lock_reason TEXT,
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

COMMENT ON COLUMN users.locked_at IS 'Timestamp when account was locked (NULL = not locked)';
COMMENT ON COLUMN users.lock_reason IS 'Reason for account lock (shown to user)';
COMMENT ON COLUMN users.last_login_at IS 'Last successful login timestamp';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Blocked IPs indexes
CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_expires_at ON blocked_ips(expires_at) WHERE expires_at IS NOT NULL;

-- Admin audit logs indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target ON admin_audit_logs(target_type, target_id);

-- Security alerts indexes
CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_alerts_reviewed ON security_alerts(reviewed_at) WHERE reviewed_at IS NULL;

-- Users table new indexes
CREATE INDEX IF NOT EXISTS idx_users_locked_at ON users(locked_at) WHERE locked_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at DESC);

-- ============================================================================
-- SEED PREDEFINED ROLES
-- ============================================================================

-- Insert predefined system roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
('admin', 'Full system access', 
 '["users.create","users.read","users.update","users.delete","roles.manage","security.view_logs","security.reset_attempts","security.block_ips","system.view_dashboard","system.export_data","content.manage_all"]'::jsonb, 
 true),
('moderator', 'Content and user moderation', 
 '["users.read","users.update","security.view_logs","content.manage_all"]'::jsonb, 
 true),
('user', 'Standard user access', 
 '["content.manage_own"]'::jsonb, 
 true),
('guest', 'Guest access (limited)', 
 '["content.view"]'::jsonb, 
 true)
ON CONFLICT (name) DO NOTHING; -- Skip if already exists

-- Assign admin role to existing admin user
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 
  u.id, 
  r.id,
  u.id -- Self-assigned
FROM users u, roles r
WHERE u.email = 'admin@kadong.com' AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for roles table
DROP TRIGGER IF EXISTS trigger_roles_updated_at ON roles;
CREATE TRIGGER trigger_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETE
-- ============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 010_up_admin_dashboard completed successfully';
  RAISE NOTICE 'Created tables: roles, user_roles, blocked_ips, admin_audit_logs, security_alerts';
  RAISE NOTICE 'Modified table: users (added locked_at, lock_reason, last_login_at)';
  RAISE NOTICE 'Created indexes for performance optimization';
  RAISE NOTICE 'Seeded 4 predefined roles: admin, moderator, user, guest';
END $$;
