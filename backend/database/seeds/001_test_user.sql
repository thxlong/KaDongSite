-- =====================================================
-- User Seed Data
-- Creates admin and guest users for the system
-- =====================================================

-- Clean up: Delete all existing users first
DELETE FROM users;

-- Insert ADMIN user with full permissions
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440000'::UUID,
    'admin@kadong.com',
    '$2b$10$xJpQVMwES/GwvLT11MomIuAF/LaZies1izaYpURRaDypR7wT4uFSi', -- Password: Admin123!@#
    'Administrator',
    'admin'
);

-- Insert GUEST user with read-only permissions
INSERT INTO users (id, email, password_hash, name, role)
VALUES (
    '550e8400-e29b-41d4-a716-446655440099'::UUID,
    'guest@kadong.com',
    '$2b$10$rqZvN.xRqKLqJQPxXGZBKuN4J8P9xJ5gvKHrqvC8HWJ8xHWJ8xHWJ', -- Password: guest123
    'Guest User',
    'user'
);

-- Verify insertion
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY role DESC;

-- Print success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Users created successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '👑 ADMIN USER (Full permissions):';
    RAISE NOTICE '   UUID: 550e8400-e29b-41d4-a716-446655440000';
    RAISE NOTICE '   Email: admin@kadong.com';
    RAISE NOTICE '   Password: Admin123!@#';
    RAISE NOTICE '   Role: admin';
    RAISE NOTICE '';
    RAISE NOTICE '👤 GUEST USER (Read-only):';
    RAISE NOTICE '   UUID: 550e8400-e29b-41d4-a716-446655440099';
    RAISE NOTICE '   Email: guest@kadong.com';
    RAISE NOTICE '   Password: guest123';
    RAISE NOTICE '   Role: user';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Default user is: admin@kadong.com';
    RAISE NOTICE '========================================';
END $$;
