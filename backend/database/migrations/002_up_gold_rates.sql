-- ========================================
-- Migration: 002_up_gold_rates.sql
-- Description: Create gold_rates table for storing gold prices
-- Author: KaDong Team
-- Created: 2025-11-11
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gold_rates table
CREATE TABLE gold_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,           -- e.g., 'SJC_9999', 'SJC_24K', 'PNJ', 'DOJI', 'XAU_USD'
    source VARCHAR(100) NOT NULL,         -- Data provider name: 'mock', 'sjc', 'pnj', 'doji', 'international'
    buy_price DECIMAL(15, 2),             -- Giá mua vào (VNĐ or USD)
    sell_price DECIMAL(15, 2),            -- Giá bán ra (VNĐ or USD)
    mid_price DECIMAL(15, 2),             -- Giá trung bình (calculated or provided)
    currency VARCHAR(10) NOT NULL DEFAULT 'VND', -- 'VND' or 'USD'
    fetched_at TIMESTAMPTZ NOT NULL,      -- Timestamp when data was fetched
    meta JSONB DEFAULT '{}',              -- Additional metadata (unit, location, provider_url, etc.)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_gold_rates_type ON gold_rates(type);
CREATE INDEX idx_gold_rates_source ON gold_rates(source);
CREATE INDEX idx_gold_rates_fetched_at ON gold_rates(fetched_at DESC);
CREATE INDEX idx_gold_rates_type_fetched ON gold_rates(type, fetched_at DESC); -- For latest queries
CREATE INDEX idx_gold_rates_type_source_fetched ON gold_rates(type, source, fetched_at DESC); -- For filtered queries

-- GIN index for JSONB meta field
CREATE INDEX idx_gold_rates_meta ON gold_rates USING GIN (meta);

-- Create trigger for auto-update updated_at
CREATE OR REPLACE FUNCTION update_gold_rates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gold_rates_timestamp 
    BEFORE UPDATE ON gold_rates
    FOR EACH ROW 
    EXECUTE FUNCTION update_gold_rates_updated_at();

-- Comments for documentation
COMMENT ON TABLE gold_rates IS 'Stores historical gold prices from various sources';
COMMENT ON COLUMN gold_rates.type IS 'Gold type identifier (e.g., SJC_9999, XAU_USD)';
COMMENT ON COLUMN gold_rates.source IS 'Data provider/source name';
COMMENT ON COLUMN gold_rates.buy_price IS 'Buy-in price (customer sells to shop)';
COMMENT ON COLUMN gold_rates.sell_price IS 'Sell-out price (customer buys from shop)';
COMMENT ON COLUMN gold_rates.mid_price IS 'Mid-market price or average';
COMMENT ON COLUMN gold_rates.currency IS 'Price currency (VND or USD)';
COMMENT ON COLUMN gold_rates.fetched_at IS 'Timestamp when data was fetched from source';
COMMENT ON COLUMN gold_rates.meta IS 'Additional metadata in JSON format';

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Migration 002_up_gold_rates.sql completed successfully';
    RAISE NOTICE '📊 Created table: gold_rates';
    RAISE NOTICE '📇 Created indexes: 6 indexes including GIN for JSONB';
END $$;
