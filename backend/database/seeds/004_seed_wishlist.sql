-- =====================================================
-- Wishlist Seed Data
-- Creates sample wishlist items for development
-- =====================================================

-- Get test user ID (assuming test user exists from 001_test_user.sql)
DO $$
DECLARE
    test_user_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
    item1_id UUID;
    item2_id UUID;
    item3_id UUID;
    item4_id UUID;
    item5_id UUID;
    item6_id UUID;
    item7_id UUID;
    item8_id UUID;
    item9_id UUID;
    item10_id UUID;
BEGIN
    RAISE NOTICE '🎁 Seeding wishlist data...';
    
    -- Insert wishlist items
    INSERT INTO wishlist_items (user_id, product_name, product_url, product_image_url, price, currency, origin, description, category)
    VALUES 
        -- Electronics
        (
            test_user_id,
            'iPhone 15 Pro Max 256GB',
            'https://www.apple.com/iphone-15-pro/',
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=1280',
            29990000,
            'VND',
            'Apple Store',
            'Natural Titanium color. The latest iPhone with A17 Pro chip, titanium design, and USB-C.',
            'Electronics'
        ),
        (
            test_user_id,
            'MacBook Air M2 13-inch',
            'https://www.apple.com/macbook-air-13-and-15-m2/',
            'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=1280',
            27990000,
            'VND',
            'Apple Store',
            'Midnight color. 8GB RAM, 256GB SSD. Perfect for everyday tasks.',
            'Electronics'
        ),
        (
            test_user_id,
            'Sony WH-1000XM5 Headphones',
            'https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b',
            'https://m.media-amazon.com/images/I/61vKL9MbOTL._AC_SL1500_.jpg',
            9290000,
            'VND',
            'Sony Official Store',
            'Black. Industry-leading noise cancellation, 30-hour battery life.',
            'Electronics'
        ),
        
        -- Fashion
        (
            test_user_id,
            'Uniqlo Áo Phao Nam',
            'https://www.uniqlo.com/vn/en/products/E465040-000',
            'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/465040/item/goods_09_465040.jpg',
            1990000,
            'VND',
            'Uniqlo Vietnam',
            'Màu đen, size M. Áo phao siêu ấm, nhẹ, có thể gấp gọn.',
            'Fashion'
        ),
        (
            test_user_id,
            'Nike Air Max 270',
            'https://www.nike.com/t/air-max-270-mens-shoes-KkLcGR',
            'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/air-max-270-mens-shoes-KkLcGR.png',
            3690000,
            'VND',
            'Nike Store',
            'Triple Black colorway. Size US 9. Maximum cushioning, sleek design.',
            'Fashion'
        ),
        
        -- Home & Living
        (
            test_user_id,
            'Dyson V15 Detect Absolute',
            'https://www.dyson.com/vacuum-cleaners/cordless/v15/detect-absolute',
            'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/vacuum-cleaners/447600-01.png',
            19490000,
            'VND',
            'Dyson Vietnam',
            'Cordless vacuum with laser dust detection. 60-minute runtime.',
            'Home'
        ),
        (
            test_user_id,
            'Philips Air Fryer XXL',
            'https://www.philips.com.vn/c-p/HD9650_90/xxl-air-fryer',
            'https://images.philips.com/is/image/PhilipsConsumer/HD9650_90-IMS-en_US',
            4990000,
            'VND',
            'Philips Store',
            'Family size 7.3L. Fat removal technology, 7 preset programs.',
            'Home'
        ),
        
        -- Books
        (
            test_user_id,
            'Atomic Habits by James Clear',
            'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299',
            'https://m.media-amazon.com/images/I/81YkqyaFVEL._SL1500_.jpg',
            350000,
            'VND',
            'Fahasa',
            'Vietnamese translation. The life-changing book about building good habits.',
            'Books'
        ),
        
        -- Games
        (
            test_user_id,
            'Nintendo Switch OLED Model',
            'https://www.nintendo.com/switch/oled-model/',
            'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_600/ncom/en_US/switch/site-design-update/hardware/switch-oled/gallery/image01',
            9490000,
            'VND',
            'Nintendo Store',
            'White version with 64GB internal storage. Includes Joy-Con controllers.',
            'Games'
        ),
        
        -- Beauty
        (
            test_user_id,
            'La Roche-Posay Anthelios Sunscreen',
            'https://www.laroche-posay.vn/anthelios-uvmune-400',
            'https://www.laroche-posay.vn/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/a/n/anthelios-uvmune-400-invisible-fluid-spf50-50ml.jpg',
            420000,
            'VND',
            'Guardian Pharmacy',
            'SPF50+ PA++++. 50ml. Best sunscreen for sensitive skin.',
            'Beauty'
        );
    
    RAISE NOTICE '✅ Inserted 10 wishlist items';
    
    -- Insert hearts for items (simulate user hearting items)
    -- Note: heart_count is auto-updated via triggers
    INSERT INTO wishlist_hearts (wishlist_item_id, user_id)
    SELECT id, test_user_id
    FROM wishlist_items
    WHERE user_id = test_user_id
    LIMIT 8; -- Heart 8 out of 10 items
    
    RAISE NOTICE '✅ Added hearts to items';
    
    -- Insert sample comments
    INSERT INTO wishlist_comments (wishlist_item_id, user_id, comment_text)
    SELECT id, test_user_id, 'Cần check giá sale trong Black Friday!'
    FROM wishlist_items
    WHERE product_name LIKE '%iPhone%'
    LIMIT 1;
    
    INSERT INTO wishlist_comments (wishlist_item_id, user_id, comment_text)
    SELECT id, test_user_id, 'Đợi đến tháng 12 mới mua, giá sẽ giảm.'
    FROM wishlist_items
    WHERE product_name LIKE '%MacBook%'
    LIMIT 1;
    
    INSERT INTO wishlist_comments (wishlist_item_id, user_id, comment_text)
    SELECT id, test_user_id, 'Màu đen đẹp hơn màu trắng. Remember to buy size M!'
    FROM wishlist_items
    WHERE product_name LIKE '%Uniqlo%'
    LIMIT 1;
    
    INSERT INTO wishlist_comments (wishlist_item_id, user_id, comment_text)
    SELECT id, test_user_id, 'Best book for habit building. Highly recommended by many people.'
    FROM wishlist_items
    WHERE product_name LIKE '%Atomic Habits%'
    LIMIT 1;
    
    INSERT INTO wishlist_comments (wishlist_item_id, user_id, comment_text)
    SELECT id, test_user_id, 'Xem review trên YouTube trước khi mua. Check warranty policy.'
    FROM wishlist_items
    WHERE product_name LIKE '%Dyson%'
    LIMIT 1;
    
    RAISE NOTICE '✅ Added 5 sample comments';
    
    -- Mark one item as purchased (for testing)
    UPDATE wishlist_items
    SET is_purchased = TRUE, purchased_at = NOW()
    WHERE product_name LIKE '%Sunscreen%';
    
    RAISE NOTICE '✅ Marked 1 item as purchased';
    
    -- Show summary
    RAISE NOTICE '';
    RAISE NOTICE '📊 Wishlist Seed Summary:';
    RAISE NOTICE '   - 10 items created';
    RAISE NOTICE '   - 8 items hearted';
    RAISE NOTICE '   - 5 comments added';
    RAISE NOTICE '   - 1 item marked as purchased';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Categories: Electronics (3), Fashion (2), Home (2), Books (1), Games (1), Beauty (1)';
    
END $$;

-- Verify seed data
SELECT 
    COUNT(*) as total_items,
    SUM(CASE WHEN is_purchased THEN 1 ELSE 0 END) as purchased,
    SUM(heart_count) as total_hearts
FROM wishlist_items;

SELECT COUNT(*) as total_comments
FROM wishlist_comments;

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Wishlist seed data completed successfully!';
END $$;
