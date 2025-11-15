-- Migration: Create RBAC (Role-Based Access Control) tables
-- Date: 2025-11-15
-- Description: Creates roles and user_roles tables for granular permission management

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, role_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Insert default system roles
INSERT INTO roles (name, description, is_system) VALUES
    ('admin', 'Full system administrator access', true),
    ('moderator', 'Content moderation and user management', true),
    ('user', 'Standard user access', true)
ON CONFLICT (name) DO NOTHING;

-- Migrate existing users to role system
-- Users with role='admin' or role='moderator' get corresponding role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.role = r.name
ON CONFLICT (user_id, role_id) DO NOTHING;

COMMENT ON TABLE roles IS 'System roles for RBAC';
COMMENT ON TABLE user_roles IS 'User role assignments';
