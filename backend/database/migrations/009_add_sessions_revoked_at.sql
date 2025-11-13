-- Migration: Add revoked_at column to sessions table
-- Created: 2025-01-14
-- Description: Add revoked_at column for soft delete of sessions (logout)

-- Add revoked_at column to sessions table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='sessions' AND column_name='revoked_at') THEN
    ALTER TABLE sessions ADD COLUMN revoked_at TIMESTAMP;
    
    -- Add index for revoked_at
    CREATE INDEX idx_sessions_revoked_at ON sessions(revoked_at);
    
    -- Update existing indexes to exclude revoked sessions
    DROP INDEX IF EXISTS idx_sessions_user_id;
    CREATE INDEX idx_sessions_user_id ON sessions(user_id) WHERE revoked_at IS NULL;
    
    DROP INDEX IF EXISTS idx_sessions_token_hash;
    CREATE INDEX idx_sessions_token_hash ON sessions(token_hash) WHERE revoked_at IS NULL;
    
    RAISE NOTICE '✅ Added revoked_at column to sessions table';
  ELSE
    RAISE NOTICE '⚠️ Column revoked_at already exists in sessions table';
  END IF;
END $$;

COMMENT ON COLUMN sessions.revoked_at IS 'Timestamp when session was revoked (soft delete for logout)';

-- Success message
DO $$ 
BEGIN
  RAISE NOTICE '✅ Session revocation migration completed successfully';
END $$;
