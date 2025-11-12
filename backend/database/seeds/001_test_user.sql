-- =====================================================
-- Test User Seed Data
-- Creates a test user for development
-- =====================================================

-- Insert test user with known UUID
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'test@kadong.com',
    '$2a$10$dummyhashfordevonly', -- Not a real bcrypt hash, for dev only
    'Test User',
    'user'
)
ON CONFLICT (email) DO UPDATE SET
    id = '00000000-0000-0000-0000-000000000001'::UUID,
    name = 'Test User',
    role = 'user',
    updated_at = NOW();

-- Verify insertion
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'test@kadong.com';

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '✅ Test user created with UUID: a0000000-0000-4000-8000-000000000001';
    RAISE NOTICE '📧 Email: test@kadong.com';
    RAISE NOTICE '👤 Name: Test User';
END $$;
