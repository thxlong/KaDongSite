-- =====================================================
-- Fashion Outfits Table Rollback
-- Removes fashion_outfits table
-- Created: 2025-11-11
-- =====================================================

-- Drop trigger first
DROP TRIGGER IF EXISTS update_fashion_outfits_updated_at ON fashion_outfits;

-- Drop indexes
DROP INDEX IF EXISTS idx_fashion_outfits_user_id;
DROP INDEX IF EXISTS idx_fashion_outfits_user_created;
DROP INDEX IF EXISTS idx_fashion_outfits_created_at;

-- Drop table
DROP TABLE IF EXISTS fashion_outfits CASCADE;

-- Remove migration record
DELETE FROM migrations WHERE name = '002_up_fashion_outfits';

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Fashion Outfits table rolled back successfully';
END $$;
