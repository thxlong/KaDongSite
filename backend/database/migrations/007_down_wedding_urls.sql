-- =====================================================
-- Migration DOWN: 007 - Drop wedding_urls table
-- Description: Rollback wedding_urls table creation
-- Author: KaDong Team
-- Date: 2025-11-12
-- WARNING: This will permanently delete all wedding URL data
-- =====================================================

-- Drop trigger first (depends on table)
DROP TRIGGER IF EXISTS update_wedding_urls_updated_at ON wedding_urls;

-- Drop table (CASCADE removes dependent objects)
DROP TABLE IF EXISTS wedding_urls CASCADE;

-- Verify table dropped
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'wedding_urls'
  ) THEN
    RAISE EXCEPTION 'wedding_urls table drop failed';
  END IF;
  
  RAISE NOTICE 'wedding_urls table dropped successfully';
END $$;
