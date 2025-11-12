-- Migration: Create currency_rates table
-- Description: Store exchange rates with caching to reduce API calls

CREATE TABLE IF NOT EXISTS currency_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  target_currency VARCHAR(3) NOT NULL,
  rate NUMERIC(15, 6) NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(50) DEFAULT 'exchangerate-api',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure unique currency pair
  UNIQUE(base_currency, target_currency)
);

-- Index for fast lookups
CREATE INDEX idx_currency_rates_base_target ON currency_rates(base_currency, target_currency);
CREATE INDEX idx_currency_rates_last_updated ON currency_rates(last_updated DESC);

-- Comments
COMMENT ON TABLE currency_rates IS 'Exchange rates cache with automatic refresh';
COMMENT ON COLUMN currency_rates.base_currency IS 'Base currency code (usually USD)';
COMMENT ON COLUMN currency_rates.target_currency IS 'Target currency code';
COMMENT ON COLUMN currency_rates.rate IS 'Exchange rate from base to target';
COMMENT ON COLUMN currency_rates.last_updated IS 'Last time rate was updated from API';
COMMENT ON COLUMN currency_rates.source IS 'API source (exchangerate-api, fixer.io, etc)';
