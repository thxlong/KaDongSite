-- ========================================
-- Seed Data: 002_seed_gold_rates.sql
-- Description: Insert sample gold price data for testing
-- Author: KaDong Team
-- Created: 2025-11-11
-- ========================================

-- Insert sample gold rates for various types
-- Prices are approximate and for testing purposes only

-- SJC 9999 (24K pure gold)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('SJC_9999', 'mock', 78500000, 79000000, 78750000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM", "provider_url": "https://sjc.com.vn"}'),
('SJC_9999', 'mock', 78400000, 78900000, 78650000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM", "provider_url": "https://sjc.com.vn"}'),
('SJC_9999', 'mock', 78300000, 78800000, 78550000, 'VND', NOW() - INTERVAL '3 hours', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM", "provider_url": "https://sjc.com.vn"}');

-- SJC 24K coins
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('SJC_24K', 'mock', 78200000, 78700000, 78450000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM", "note": "Vàng miếng SJC"}'),
('SJC_24K', 'mock', 78100000, 78600000, 78350000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM", "note": "Vàng miếng SJC"}');

-- PNJ Gold
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('PNJ_24K', 'mock', 78000000, 78500000, 78250000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 chỉ (3.75g)", "location": "Toàn quốc", "provider_url": "https://pnj.com.vn", "brand": "PNJ"}'),
('PNJ_24K', 'mock', 77900000, 78400000, 78150000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 chỉ (3.75g)", "location": "Toàn quốc", "provider_url": "https://pnj.com.vn", "brand": "PNJ"}');

-- PNJ 18K Gold (75% gold)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('PNJ_18K', 'mock', 58500000, 59000000, 58750000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 chỉ (3.75g)", "location": "Toàn quốc", "purity": "75%", "brand": "PNJ"}'),
('PNJ_18K', 'mock', 58400000, 58900000, 58650000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 chỉ (3.75g)", "location": "Toàn quốc", "purity": "75%", "brand": "PNJ"}');

-- DOJI Gold
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('DOJI_24K', 'mock', 78100000, 78600000, 78350000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 lượng (37.5g)", "location": "Hà Nội", "provider_url": "https://doji.vn", "brand": "DOJI"}'),
('DOJI_24K', 'mock', 78000000, 78500000, 78250000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 lượng (37.5g)", "location": "Hà Nội", "provider_url": "https://doji.vn", "brand": "DOJI"}');

-- International Gold (XAU/USD)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('XAU_USD', 'mock', 2025.50, 2026.50, 2026.00, 'USD', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 troy oz (31.1g)", "market": "International", "provider": "Kitco", "provider_url": "https://kitco.com"}'),
('XAU_USD', 'mock', 2024.00, 2025.00, 2024.50, 'USD', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 troy oz (31.1g)", "market": "International", "provider": "Kitco", "provider_url": "https://kitco.com"}'),
('XAU_USD', 'mock', 2023.50, 2024.50, 2024.00, 'USD', NOW() - INTERVAL '3 hours', 
 '{"unit": "1 troy oz (31.1g)", "market": "International", "provider": "Kitco", "provider_url": "https://kitco.com"}');

-- 10K Gold (41.7% gold)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('GOLD_10K', 'mock', 32500000, 33000000, 32750000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 chỉ (3.75g)", "location": "TP.HCM", "purity": "41.7%", "note": "Vàng trang sức phổ thông"}'),
('GOLD_10K', 'mock', 32400000, 32900000, 32650000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 chỉ (3.75g)", "location": "TP.HCM", "purity": "41.7%", "note": "Vàng trang sức phổ thông"}');

-- 14K Gold (58.5% gold)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('GOLD_14K', 'mock', 45600000, 46100000, 45850000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 chỉ (3.75g)", "location": "TP.HCM", "purity": "58.5%", "note": "Vàng trang sức"}'),
('GOLD_14K', 'mock', 45500000, 46000000, 45750000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 chỉ (3.75g)", "location": "TP.HCM", "purity": "58.5%", "note": "Vàng trang sức"}');

-- Historical data for charts (1 day ago)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('SJC_9999', 'mock', 78000000, 78500000, 78250000, 'VND', NOW() - INTERVAL '1 day', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM"}'),
('XAU_USD', 'mock', 2020.00, 2021.00, 2020.50, 'USD', NOW() - INTERVAL '1 day', 
 '{"unit": "1 troy oz (31.1g)", "market": "International"}');

-- Historical data (1 week ago)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('SJC_9999', 'mock', 77500000, 78000000, 77750000, 'VND', NOW() - INTERVAL '7 days', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM"}'),
('XAU_USD', 'mock', 2015.00, 2016.00, 2015.50, 'USD', NOW() - INTERVAL '7 days', 
 '{"unit": "1 troy oz (31.1g)", "market": "International"}');

-- Historical data (1 month ago)
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('SJC_9999', 'mock', 76500000, 77000000, 76750000, 'VND', NOW() - INTERVAL '30 days', 
 '{"unit": "1 lượng (37.5g)", "location": "TP.HCM"}'),
('XAU_USD', 'mock', 2000.00, 2001.00, 2000.50, 'USD', NOW() - INTERVAL '30 days', 
 '{"unit": "1 troy oz (31.1g)", "market": "International"}');

-- Success message
DO $$ 
DECLARE 
    row_count INTEGER;
BEGIN 
    SELECT COUNT(*) INTO row_count FROM gold_rates;
    RAISE NOTICE '✅ Seed 002_seed_gold_rates.sql completed successfully';
    RAISE NOTICE '📊 Inserted % gold rate records', row_count;
    RAISE NOTICE '💰 Gold types: SJC_9999, SJC_24K, PNJ_24K, PNJ_18K, DOJI_24K, XAU_USD, GOLD_10K, GOLD_14K';
END $$;
