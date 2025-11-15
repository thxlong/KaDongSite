/**
 * Migration Rollback: Admin Dashboard & Management System
 * Version: 010_down
 * Description: Rollback admin dashboard tables and columns
 * Date: 2025-11-15
 */

-- ============================================================================
-- DROP TRIGGERS & FUNCTIONS
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_roles_updated_at ON roles;

-- ============================================================================
-- DROP INDEXES
-- ============================================================================

-- User roles indexes
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_role_id;

-- Blocked IPs indexes
DROP INDEX IF EXISTS idx_blocked_ips_ip_address;
DROP INDEX IF EXISTS idx_blocked_ips_expires_at;

-- Admin audit logs indexes
DROP INDEX IF EXISTS idx_admin_audit_logs_admin_id;
DROP INDEX IF EXISTS idx_admin_audit_logs_action;
DROP INDEX IF EXISTS idx_admin_audit_logs_created_at;
DROP INDEX IF EXISTS idx_admin_audit_logs_target;

-- Security alerts indexes
DROP INDEX IF EXISTS idx_security_alerts_type;
DROP INDEX IF EXISTS idx_security_alerts_severity;
DROP INDEX IF EXISTS idx_security_alerts_created_at;
DROP INDEX IF EXISTS idx_security_alerts_reviewed;

-- Users table indexes
DROP INDEX IF EXISTS idx_users_locked_at;
DROP INDEX IF EXISTS idx_users_last_login_at;

-- ============================================================================
-- REMOVE COLUMNS FROM USERS TABLE
-- ============================================================================

ALTER TABLE users 
  DROP COLUMN IF EXISTS locked_at,
  DROP COLUMN IF EXISTS lock_reason,
  DROP COLUMN IF EXISTS last_login_at;

-- ============================================================================
-- DROP TABLES (in reverse order due to foreign keys)
-- ============================================================================

DROP TABLE IF EXISTS security_alerts;
DROP TABLE IF EXISTS admin_audit_logs;
DROP TABLE IF EXISTS blocked_ips;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;

-- ============================================================================
-- COMPLETE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 010_down_admin_dashboard completed successfully';
  RAISE NOTICE 'Dropped tables: security_alerts, admin_audit_logs, blocked_ips, user_roles, roles';
  RAISE NOTICE 'Removed columns from users: locked_at, lock_reason, last_login_at';
  RAISE NOTICE 'Dropped all related indexes and triggers';
END $$;
