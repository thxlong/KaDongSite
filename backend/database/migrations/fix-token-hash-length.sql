-- Extend token_hash column to support full JWT tokens
ALTER TABLE sessions ALTER COLUMN token_hash TYPE TEXT;
