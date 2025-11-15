-- Migration: Create audit logs table
-- Date: 2025-11-15
-- Description: Track all admin actions for security and compliance

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(255),
    changes JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_type ON audit_logs(target_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target_id ON audit_logs(target_id);

COMMENT ON TABLE audit_logs IS 'Audit trail for admin actions';
COMMENT ON COLUMN audit_logs.action IS 'Action performed (e.g., user.create, role.delete)';
COMMENT ON COLUMN audit_logs.target_type IS 'Type of resource affected (e.g., user, role)';
COMMENT ON COLUMN audit_logs.target_id IS 'ID of the affected resource';
COMMENT ON COLUMN audit_logs.changes IS 'JSON object containing before/after values';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional context data';
