-- ========================================
-- Migration: 004_up_wishlist.sql
-- Description: Create wishlist tables for product management with hearts and comments
-- Author: KaDong Team
-- Created: 2025-11-12
-- Spec: specs/specs/03_wishlist_management.spec
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Table: wishlist_items
-- Description: Main table for storing wishlist products
-- ========================================
CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_url TEXT NOT NULL,
    product_image_url TEXT,
    price NUMERIC(12, 2),
    currency VARCHAR(3) DEFAULT 'VND',
    origin VARCHAR(100),
    description TEXT,
    category VARCHAR(50),
    heart_count INTEGER DEFAULT 0, -- Denormalized for performance (synced via triggers)
    is_purchased BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT chk_wishlist_price_positive CHECK (price IS NULL OR price >= 0),
    CONSTRAINT chk_wishlist_heart_count_nonnegative CHECK (heart_count >= 0),
    CONSTRAINT chk_wishlist_currency_valid CHECK (currency IN ('VND', 'USD', 'EUR', 'JPY'))
);

-- ========================================
-- Table: wishlist_hearts
-- Description: Tracks which users hearted which items (many-to-many)
-- ========================================
CREATE TABLE wishlist_hearts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_item_id UUID NOT NULL REFERENCES wishlist_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(wishlist_item_id, user_id) -- Prevent duplicate hearts
);

-- ========================================
-- Table: wishlist_comments
-- Description: Comments/notes on wishlist items
-- ========================================
CREATE TABLE wishlist_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wishlist_item_id UUID NOT NULL REFERENCES wishlist_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT chk_comment_not_empty CHECK (LENGTH(TRIM(comment_text)) > 0)
);

-- ========================================
-- Indexes for Performance
-- ========================================

-- wishlist_items indexes
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_user_not_deleted ON wishlist_items(user_id, deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlist_items_heart_count ON wishlist_items(heart_count DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlist_items_created_at ON wishlist_items(created_at DESC);
CREATE INDEX idx_wishlist_items_price ON wishlist_items(price DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlist_items_category ON wishlist_items(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlist_items_purchased ON wishlist_items(is_purchased, purchased_at DESC);

-- Full-text search index for product_name and description
CREATE INDEX idx_wishlist_items_search ON wishlist_items USING GIN(
    to_tsvector('english', COALESCE(product_name, '') || ' ' || COALESCE(description, ''))
) WHERE deleted_at IS NULL;

-- wishlist_hearts indexes
CREATE INDEX idx_wishlist_hearts_item_id ON wishlist_hearts(wishlist_item_id);
CREATE INDEX idx_wishlist_hearts_user_id ON wishlist_hearts(user_id);
CREATE INDEX idx_wishlist_hearts_item_user ON wishlist_hearts(wishlist_item_id, user_id);

-- wishlist_comments indexes
CREATE INDEX idx_wishlist_comments_item_id ON wishlist_comments(wishlist_item_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_wishlist_comments_user_id ON wishlist_comments(user_id);

-- ========================================
-- Triggers
-- ========================================

-- Trigger 1: Auto-update updated_at for wishlist_items
CREATE OR REPLACE FUNCTION update_wishlist_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_update_wishlist_items_timestamp
    BEFORE UPDATE ON wishlist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_wishlist_items_updated_at();

-- Trigger 2: Auto-update updated_at for wishlist_comments
CREATE OR REPLACE FUNCTION update_wishlist_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_update_wishlist_comments_timestamp
    BEFORE UPDATE ON wishlist_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_wishlist_comments_updated_at();

-- Trigger 3: Sync heart_count when heart added (INSERT)
CREATE OR REPLACE FUNCTION sync_wishlist_heart_count_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE wishlist_items
    SET heart_count = heart_count + 1
    WHERE id = NEW.wishlist_item_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_sync_heart_count_insert
    AFTER INSERT ON wishlist_hearts
    FOR EACH ROW
    EXECUTE FUNCTION sync_wishlist_heart_count_insert();

-- Trigger 4: Sync heart_count when heart removed (DELETE)
CREATE OR REPLACE FUNCTION sync_wishlist_heart_count_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE wishlist_items
    SET heart_count = GREATEST(0, heart_count - 1)
    WHERE id = OLD.wishlist_item_id;
    RETURN OLD;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_sync_heart_count_delete
    AFTER DELETE ON wishlist_hearts
    FOR EACH ROW
    EXECUTE FUNCTION sync_wishlist_heart_count_delete();

-- ========================================
-- Comments for Documentation
-- ========================================

COMMENT ON TABLE wishlist_items IS 'Stores wishlist products with metadata, hearts, and purchase status';
COMMENT ON COLUMN wishlist_items.heart_count IS 'Cached count of hearts (denormalized for performance, synced via triggers)';
COMMENT ON COLUMN wishlist_items.is_purchased IS 'Indicates if the item has been purchased';
COMMENT ON COLUMN wishlist_items.deleted_at IS 'Soft delete timestamp (NULL = active)';

COMMENT ON TABLE wishlist_hearts IS 'Tracks heart votes on wishlist items (many-to-many relationship)';
COMMENT ON TABLE wishlist_comments IS 'Comments and notes on wishlist items for collaboration';

-- ========================================
-- Success Message
-- ========================================

DO $$ 
BEGIN 
    RAISE NOTICE '✅ Migration 004_up_wishlist.sql completed successfully';
    RAISE NOTICE '📊 Created tables: wishlist_items, wishlist_hearts, wishlist_comments';
    RAISE NOTICE '📇 Created indexes: 12 indexes (including full-text search)';
    RAISE NOTICE '⚡ Created triggers: 4 triggers (updated_at, heart_count sync)';
END $$;
