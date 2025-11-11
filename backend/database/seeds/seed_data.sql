-- =====================================================
-- SEED DATA for KaDong Tools
-- Test data for development
-- =====================================================

-- =====================================================
-- SEED USERS (3 test users)
-- Password for all: "password123" (hashed with bcrypt)
-- Hash: $2a$10$rqZvN.xRqKLqJQPxXGZBKuN4J8P9xJ5gvKHrqvC8HWJ8xHWJ8xHWJ (example)
-- =====================================================
INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'ka@example.com', '$2a$10$rqZvN.xRqKLqJQPxXGZBKuN4J8P9xJ5gvKHrqvC8HWJ8xHWJ8xHWJ', 'Ka', 'admin', NOW() - INTERVAL '30 days'),
    ('550e8400-e29b-41d4-a716-446655440002', 'dong@example.com', '$2a$10$rqZvN.xRqKLqJQPxXGZBKuN4J8P9xJ5gvKHrqvC8HWJ8xHWJ8xHWJ', 'Dong', 'user', NOW() - INTERVAL '25 days'),
    ('550e8400-e29b-41d4-a716-446655440003', 'test@example.com', '$2a$10$rqZvN.xRqKLqJQPxXGZBKuN4J8P9xJ5gvKHrqvC8HWJ8xHWJ8xHWJ', 'Test User', 'user', NOW() - INTERVAL '10 days')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SEED TOOLS (4 main tools)
-- =====================================================
INSERT INTO tools (id, key, name, description, icon, color, path, config, display_order) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', 'countdown', 'Đếm ngày', 'Theo dõi những ngày đặc biệt và kỷ niệm', 'clock', 'from-pastel-purple to-pastel-blue', '/countdown', '{"features": ["countdown", "anniversary", "reminder"]}', 1),
    ('650e8400-e29b-41d4-a716-446655440002', 'calendar', 'Lịch', 'Xem lịch trình và sự kiện sắp tới', 'calendar', 'from-pastel-mint to-pastel-blue', '/calendar', '{"features": ["monthly_view", "events", "reminder"]}', 2),
    ('650e8400-e29b-41d4-a716-446655440003', 'notes', 'Ghi chú', 'Lưu lại những ý tưởng và việc cần làm', 'sticky-note', 'from-pastel-peach to-pastel-cream', '/notes', '{"features": ["quick_note", "color_tags", "search"]}', 3),
    ('650e8400-e29b-41d4-a716-446655440004', 'currency', 'Chuyển đổi tiền', 'Tính toán và chuyển đổi tiền tệ nhanh chóng', 'dollar-sign', 'from-pastel-mint to-pastel-purple', '/currency', '{"features": ["8_currencies", "realtime_rates", "history"]}', 4)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- SEED NOTES (Multiple notes for testing)
-- =====================================================
INSERT INTO notes (id, user_id, title, content, color, pinned, created_at) VALUES
    ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Danh sách mua sắm', 'Sữa, bánh mì, trứng, rau xanh, cà rốt', 'pink', TRUE, NOW() - INTERVAL '5 days'),
    ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Ý tưởng du lịch', 'Đà Lạt - tháng 12\nPhú Quốc - tháng 3\nSapa - tháng 10', 'mint', FALSE, NOW() - INTERVAL '3 days'),
    ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Việc cần làm', '- Làm báo cáo\n- Gọi điện cho mẹ\n- Đặt lịch khám răng', 'purple', TRUE, NOW() - INTERVAL '2 days'),
    ('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Công thức nấu ăn', 'Phở: nước dùng, bánh phở, thịt bò, hành, ngò\nLuộc 3 tiếng', 'peach', FALSE, NOW() - INTERVAL '1 day'),
    ('750e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Quote yêu thích', 'Love is not about how many days, months, or years you have been together.\nLove is about how much you love each other every single day. ❤️', 'cream', FALSE, NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED COUNTDOWN EVENTS
-- =====================================================
INSERT INTO countdown_events (id, user_id, title, event_date, recurring, color, created_at) VALUES
    ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Ngày yêu nhau', '2020-01-01', 'yearly', 'from-pastel-pink to-pastel-purple', NOW() - INTERVAL '100 days'),
    ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Sinh nhật Ka', '1995-03-15', 'yearly', 'from-pastel-purple to-pastel-blue', NOW() - INTERVAL '50 days'),
    ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Sinh nhật Dong', '1993-07-20', 'yearly', 'from-pastel-mint to-pastel-blue', NOW() - INTERVAL '30 days'),
    ('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Kỷ niệm cầu hôn', '2023-05-14', NULL, 'from-pastel-peach to-pastel-cream', NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED FEEDBACK (2 feedback entries)
-- =====================================================
INSERT INTO feedback (id, user_id, message, type, status, rating, created_at) VALUES
    ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Giao diện rất đẹp và dễ sử dụng! Mình rất thích phần đếm ngày.', 'general', 'reviewed', 5, NOW() - INTERVAL '7 days'),
    ('950e8400-e29b-41d4-a716-446655440002', NULL, 'Có thể thêm tính năng dark mode không ạ? Mắt mình hơi nhạy cảm với ánh sáng.', 'feature', 'pending', 4, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED CURRENCY RATES (Latest rates)
-- =====================================================
INSERT INTO currency_rates (id, base_currency, rates, fetched_at, is_current) VALUES
    ('a50e8400-e29b-41d4-a716-446655440001', 'USD', '{
        "USD": 1,
        "VND": 24000,
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 148.5,
        "KRW": 1320,
        "CNY": 7.24,
        "THB": 35.5
    }', NOW(), TRUE)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Verify seed data
-- =====================================================
SELECT 'Seed data completed!' AS status;
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Tools: ' || COUNT(*) FROM tools;
SELECT 'Notes: ' || COUNT(*) FROM notes;
SELECT 'Events: ' || COUNT(*) FROM countdown_events;
SELECT 'Feedback: ' || COUNT(*) FROM feedback;
SELECT 'Currency Rates: ' || COUNT(*) FROM currency_rates;
