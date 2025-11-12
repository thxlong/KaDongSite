-- ========================================
-- Migration Rollback: 002_down_gold_rates.sql
-- Description: Drop gold_rates table and related objects
-- Author: KaDong Team
-- Created: 2025-11-11
-- ========================================

-- Drop trigger first
DROP TRIGGER IF EXISTS update_gold_rates_timestamp ON gold_rates;

-- Drop function
DROP FUNCTION IF EXISTS update_gold_rates_updated_at();

-- Drop indexes (will be dropped automatically with table, but explicit for clarity)
DROP INDEX IF EXISTS idx_gold_rates_type;
DROP INDEX IF EXISTS idx_gold_rates_source;
DROP INDEX IF EXISTS idx_gold_rates_fetched_at;
DROP INDEX IF EXISTS idx_gold_rates_type_fetched;
DROP INDEX IF EXISTS idx_gold_rates_type_source_fetched;
DROP INDEX IF EXISTS idx_gold_rates_meta;

-- Drop table
DROP TABLE IF EXISTS gold_rates;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Rollback 002_down_gold_rates.sql completed successfully';
    RAISE NOTICE '🗑️  Dropped table: gold_rates';
    RAISE NOTICE '🗑️  Dropped all indexes and triggers';
END $$;
