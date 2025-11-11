-- =====================================================
-- ROLLBACK: KaDong Tools Database Schema
-- DROP all tables in reverse order (respect foreign keys)
-- =====================================================

-- Drop triggers first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_notes_updated_at ON notes;
DROP TRIGGER IF EXISTS update_countdown_events_updated_at ON countdown_events;
DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (reverse order of creation)
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS currency_rates CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS countdown_events CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Remove migration record
DELETE FROM migrations WHERE name = '001_initial_schema';

-- Optionally drop migrations table (only if this is the last migration)
-- DROP TABLE IF EXISTS migrations CASCADE;

-- Optionally drop UUID extension (only if no other databases use it)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
