-- Seed: Initial currency rates (will be updated by API)
-- These are fallback values if API fails

DELETE FROM currency_rates;

INSERT INTO currency_rates (base_currency, target_currency, rate, source, last_updated) VALUES
  ('USD', 'USD', 1.000000, 'fixed', CURRENT_TIMESTAMP),
  ('USD', 'VND', 26345.00, 'exchangerate-api', CURRENT_TIMESTAMP),
  ('USD', 'EUR', 0.92, 'exchangerate-api', CURRENT_TIMESTAMP),
  ('USD', 'GBP', 0.79, 'exchangerate-api', CURRENT_TIMESTAMP),
  ('USD', 'JPY', 149.50, 'exchangerate-api', CURRENT_TIMESTAMP),
  ('USD', 'KRW', 1320.00, 'exchangerate-api', CURRENT_TIMESTAMP),
  ('USD', 'CNY', 7.24, 'exchangerate-api', CURRENT_TIMESTAMP),
  ('USD', 'THB', 35.50, 'exchangerate-api', CURRENT_TIMESTAMP);
