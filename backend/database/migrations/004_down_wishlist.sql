-- ========================================
-- Migration: 004_down_wishlist.sql
-- Description: Rollback wishlist tables and related objects
-- Author: KaDong Team
-- Created: 2025-11-12
-- ========================================

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_sync_heart_count_delete ON wishlist_hearts;
DROP TRIGGER IF EXISTS trigger_sync_heart_count_insert ON wishlist_hearts;
DROP TRIGGER IF EXISTS trigger_update_wishlist_comments_timestamp ON wishlist_comments;
DROP TRIGGER IF EXISTS trigger_update_wishlist_items_timestamp ON wishlist_items;

-- Drop functions
DROP FUNCTION IF EXISTS sync_wishlist_heart_count_delete();
DROP FUNCTION IF EXISTS sync_wishlist_heart_count_insert();
DROP FUNCTION IF EXISTS update_wishlist_comments_updated_at();
DROP FUNCTION IF EXISTS update_wishlist_items_updated_at();

-- Drop tables (CASCADE removes dependent objects)
DROP TABLE IF EXISTS wishlist_comments CASCADE;
DROP TABLE IF EXISTS wishlist_hearts CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Rollback 004_down_wishlist.sql completed successfully';
    RAISE NOTICE '🗑️ Dropped tables: wishlist_items, wishlist_hearts, wishlist_comments';
    RAISE NOTICE '🗑️ Dropped triggers and functions';
END $$;
