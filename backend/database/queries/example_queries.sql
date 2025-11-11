-- =====================================================
-- EXAMPLE SQL QUERIES for Controllers
-- Common operations with best practices
-- =====================================================

-- =====================================================
-- USERS QUERIES
-- =====================================================

-- 1. Create new user with unique email check
INSERT INTO users (email, password_hash, name, role)
VALUES ($1, $2, $3, 'user')
RETURNING id, email, name, role, created_at;
-- Error handling: ON CONFLICT will throw UNIQUE constraint error

-- 2. Find user by email (for login)
SELECT id, email, password_hash, name, role, created_at
FROM users
WHERE email = $1 AND deleted_at IS NULL;

-- 3. Update user profile
UPDATE users
SET name = $1, updated_at = NOW()
WHERE id = $2 AND deleted_at IS NULL
RETURNING id, email, name, updated_at;

-- 4. Soft delete user
UPDATE users
SET deleted_at = NOW()
WHERE id = $1
RETURNING id;

-- =====================================================
-- NOTES QUERIES
-- =====================================================

-- 5. Create new note
INSERT INTO notes (user_id, title, content, color, pinned)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, user_id, title, content, color, pinned, created_at, updated_at;

-- 6. List notes by user with pagination (10 per page)
-- Pinned notes first, then by created_at DESC
SELECT id, title, content, color, pinned, created_at, updated_at
FROM notes
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY pinned DESC, created_at DESC
LIMIT $2 OFFSET $3;

-- 7. Count total notes for user (for pagination)
SELECT COUNT(*) as total
FROM notes
WHERE user_id = $1 AND deleted_at IS NULL;

-- 8. Get single note by ID
SELECT id, user_id, title, content, color, pinned, created_at, updated_at
FROM notes
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;

-- 9. Update note
UPDATE notes
SET title = $1, content = $2, color = $3, pinned = $4, updated_at = NOW()
WHERE id = $5 AND user_id = $6 AND deleted_at IS NULL
RETURNING id, title, content, color, pinned, updated_at;

-- 10. Soft delete note
UPDATE notes
SET deleted_at = NOW()
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
RETURNING id;

-- 11. Toggle pin status
UPDATE notes
SET pinned = NOT pinned, updated_at = NOW()
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
RETURNING id, pinned;

-- 12. Search notes by text (full-text search)
SELECT id, title, content, color, created_at
FROM notes
WHERE user_id = $1 
  AND deleted_at IS NULL
  AND (title ILIKE $2 OR content ILIKE $2)
ORDER BY created_at DESC
LIMIT 20;
-- Usage: $2 = '%keyword%'

-- =====================================================
-- COUNTDOWN EVENTS QUERIES
-- =====================================================

-- 13. Create countdown event
INSERT INTO countdown_events (user_id, title, event_date, recurring, timezone, color)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, user_id, title, event_date, recurring, timezone, color, created_at;

-- 14. List all events for user
SELECT id, title, event_date, recurring, color, created_at
FROM countdown_events
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY event_date ASC;

-- 15. Get upcoming events (within next 30 days)
SELECT id, title, event_date, recurring, color,
       (event_date - CURRENT_DATE) as days_until
FROM countdown_events
WHERE user_id = $1 
  AND deleted_at IS NULL
  AND event_date >= CURRENT_DATE
  AND event_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY event_date ASC;

-- 16. Update countdown event
UPDATE countdown_events
SET title = $1, event_date = $2, recurring = $3, color = $4, updated_at = NOW()
WHERE id = $5 AND user_id = $6 AND deleted_at IS NULL
RETURNING id, title, event_date, recurring, color, updated_at;

-- 17. Delete countdown event
UPDATE countdown_events
SET deleted_at = NOW()
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
RETURNING id;

-- =====================================================
-- TOOLS QUERIES
-- =====================================================

-- 18. Get all active tools
SELECT id, key, name, description, icon, color, path, config, display_order
FROM tools
WHERE is_active = TRUE
ORDER BY display_order ASC;

-- 19. Get tool by key
SELECT id, key, name, description, config
FROM tools
WHERE key = $1 AND is_active = TRUE;

-- 20. Update tool config (JSONB merge)
UPDATE tools
SET config = config || $1::jsonb, updated_at = NOW()
WHERE key = $2
RETURNING id, key, config;
-- Usage: $1 = '{"new_setting": "value"}'

-- =====================================================
-- FEEDBACK QUERIES
-- =====================================================

-- 21. Create feedback (anonymous or authenticated)
INSERT INTO feedback (user_id, message, type, rating)
VALUES ($1, $2, $3, $4)
RETURNING id, message, type, created_at;

-- 22. List all feedback (admin view)
SELECT f.id, f.message, f.type, f.status, f.rating, f.created_at,
       u.name as user_name, u.email as user_email
FROM feedback f
LEFT JOIN users u ON f.user_id = u.id
ORDER BY f.created_at DESC
LIMIT $1 OFFSET $2;

-- 23. Update feedback status
UPDATE feedback
SET status = $1
WHERE id = $2
RETURNING id, status;

-- =====================================================
-- CURRENCY RATES QUERIES
-- =====================================================

-- 24. Get latest currency rates
SELECT base_currency, rates, fetched_at
FROM currency_rates
WHERE is_current = TRUE
ORDER BY fetched_at DESC
LIMIT 1;

-- 25. Insert new currency rates (with transaction)
BEGIN;
-- Mark all as not current
UPDATE currency_rates SET is_current = FALSE WHERE is_current = TRUE;
-- Insert new rates
INSERT INTO currency_rates (base_currency, rates, is_current)
VALUES ($1, $2, TRUE)
RETURNING id, fetched_at;
COMMIT;

-- 26. Get historical rates for date range
SELECT base_currency, rates, fetched_at
FROM currency_rates
WHERE fetched_at BETWEEN $1 AND $2
ORDER BY fetched_at DESC;

-- =====================================================
-- SESSIONS QUERIES (Authentication)
-- =====================================================

-- 27. Create session
INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
VALUES ($1, $2, NOW() + INTERVAL '7 days', $3, $4)
RETURNING id, token_hash, expires_at;

-- 28. Validate session
SELECT s.id, s.user_id, s.expires_at,
       u.email, u.name, u.role
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.token_hash = $1 
  AND s.expires_at > NOW()
  AND u.deleted_at IS NULL;

-- 29. Delete session (logout)
DELETE FROM sessions
WHERE token_hash = $1
RETURNING id;

-- 30. Clean expired sessions (run periodically)
DELETE FROM sessions
WHERE expires_at < NOW();

-- =====================================================
-- COMPLEX QUERIES & TRANSACTIONS
-- =====================================================

-- 31. User dashboard stats (single query)
SELECT 
    (SELECT COUNT(*) FROM notes WHERE user_id = $1 AND deleted_at IS NULL) as notes_count,
    (SELECT COUNT(*) FROM countdown_events WHERE user_id = $1 AND deleted_at IS NULL) as events_count,
    (SELECT COUNT(*) FROM notes WHERE user_id = $1 AND pinned = TRUE AND deleted_at IS NULL) as pinned_notes,
    (SELECT COUNT(*) FROM countdown_events 
     WHERE user_id = $1 
       AND deleted_at IS NULL 
       AND event_date >= CURRENT_DATE 
       AND event_date <= CURRENT_DATE + INTERVAL '7 days') as upcoming_events;

-- 32. Transaction example: Create user with initial notes
BEGIN;
-- Create user
INSERT INTO users (email, password_hash, name)
VALUES ($1, $2, $3)
RETURNING id INTO user_id;

-- Create welcome note
INSERT INTO notes (user_id, title, content, color, pinned)
VALUES (user_id, 'Welcome!', 'Chào mừng bạn đến với KaDong Tools! 🎉', 'pink', TRUE);

-- Create default countdown event
INSERT INTO countdown_events (user_id, title, event_date, color)
VALUES (user_id, 'Ngày tham gia', CURRENT_DATE, 'from-pastel-purple to-pastel-blue');

COMMIT;

-- 33. Bulk operations: Delete old soft-deleted records (cleanup)
-- Run monthly via cron job
DELETE FROM notes
WHERE deleted_at < NOW() - INTERVAL '90 days';

DELETE FROM countdown_events
WHERE deleted_at < NOW() - INTERVAL '90 days';

-- =====================================================
-- PERFORMANCE TIPS
-- =====================================================

-- Use EXPLAIN ANALYZE to check query performance:
-- EXPLAIN ANALYZE SELECT * FROM notes WHERE user_id = '...' AND deleted_at IS NULL;

-- For pagination, use LIMIT/OFFSET or cursor-based:
-- Cursor-based (better for large datasets):
-- SELECT * FROM notes WHERE user_id = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT 10;

-- Always filter by deleted_at IS NULL for soft-deleted tables
-- Use prepared statements ($1, $2) to prevent SQL injection
-- Use transactions for multi-step operations
-- Add indexes for frequently queried columns
