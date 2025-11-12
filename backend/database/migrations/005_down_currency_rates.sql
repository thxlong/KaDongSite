-- Migration Rollback: Drop currency_rates table

DROP INDEX IF EXISTS idx_currency_rates_last_updated;
DROP INDEX IF EXISTS idx_currency_rates_base_target;
DROP TABLE IF EXISTS currency_rates;
