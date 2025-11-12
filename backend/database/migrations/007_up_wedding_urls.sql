-- =====================================================
-- Migration: 007 - Create wedding_urls table
-- Description: Add wedding invitation URL storage
-- Author: KaDong Team
-- Date: 2025-11-12
-- =====================================================

-- Create wedding_urls table
CREATE TABLE IF NOT EXISTS wedding_urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  base_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Add comment to table
COMMENT ON TABLE wedding_urls IS 'Stores base URLs for wedding invitation links';

-- Add comments to columns
COMMENT ON COLUMN wedding_urls.id IS 'Primary key (UUID)';
COMMENT ON COLUMN wedding_urls.user_id IS 'Foreign key to users table (owner)';
COMMENT ON COLUMN wedding_urls.base_url IS 'Base URL for invitation (e.g., https://invitations.jmiiwedding.com/longnhiwedding)';
COMMENT ON COLUMN wedding_urls.created_at IS 'Record creation timestamp';
COMMENT ON COLUMN wedding_urls.updated_at IS 'Last update timestamp (auto-updated by trigger)';
COMMENT ON COLUMN wedding_urls.deleted_at IS 'Soft delete timestamp (NULL = active, NOT NULL = deleted)';

-- Create index on user_id for fast user lookup
CREATE INDEX IF NOT EXISTS idx_wedding_urls_user_id 
  ON wedding_urls(user_id);

COMMENT ON INDEX idx_wedding_urls_user_id IS 'Index for querying URLs by user';

-- Create index on deleted_at for filtering active records
CREATE INDEX IF NOT EXISTS idx_wedding_urls_deleted_at 
  ON wedding_urls(deleted_at);

COMMENT ON INDEX idx_wedding_urls_deleted_at IS 'Index for filtering active (deleted_at IS NULL) records';

-- Create trigger to auto-update updated_at column
-- Note: update_updated_at_column() function must exist (created in earlier migration)
DROP TRIGGER IF EXISTS update_wedding_urls_updated_at ON wedding_urls;

CREATE TRIGGER update_wedding_urls_updated_at
  BEFORE UPDATE ON wedding_urls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TRIGGER update_wedding_urls_updated_at ON wedding_urls IS 'Auto-update updated_at on row modification';

-- Verify table created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'wedding_urls'
  ) THEN
    RAISE EXCEPTION 'wedding_urls table creation failed';
  END IF;
  
  RAISE NOTICE 'wedding_urls table created successfully';
END $$;
