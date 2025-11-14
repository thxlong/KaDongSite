/**
 * Seed wishlist data for admin user
 * @description Creates sample wishlist items for testing
 */

import { query } from './config/database.js'

const adminUserId = '550e8400-e29b-41d4-a716-446655440000'

const sampleItems = [
  {
    product_name: 'iPhone 15 Pro Max 256GB',
    product_url: 'https://www.apple.com/iphone-15-pro/',
    product_image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-blue-titanium-select.png',
    price: 29990000,
    currency: 'VND',
    origin: 'USA',
    category: 'Electronics',
    description: 'Latest iPhone with A17 Pro chip and titanium design'
  },
  {
    product_name: 'MacBook Pro 14" M3 Pro',
    product_url: 'https://www.apple.com/macbook-pro-14-and-16/',
    product_image_url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp-spacegray-select-202310.png',
    price: 52990000,
    currency: 'VND',
    origin: 'USA',
    category: 'Electronics',
    description: 'Powerful laptop for professionals with M3 Pro chip'
  },
  {
    product_name: 'Sony WH-1000XM5 Headphones',
    product_url: 'https://www.sony.com/electronics/headband-headphones/wh-1000xm5',
    product_image_url: 'https://www.sony.com/image/sony_wh1000xm5_black.jpg',
    price: 8990000,
    currency: 'VND',
    origin: 'Japan',
    category: 'Electronics',
    description: 'Industry-leading noise canceling headphones'
  },
  {
    product_name: 'Nike Air Max 270',
    product_url: 'https://www.nike.com/t/air-max-270',
    product_image_url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto/air-max-270-mens-shoes.jpg',
    price: 3500000,
    currency: 'VND',
    origin: 'Vietnam',
    category: 'Fashion',
    description: 'Comfortable lifestyle sneakers with Max Air unit'
  },
  {
    product_name: 'Lego Star Wars Millennium Falcon',
    product_url: 'https://www.lego.com/en-us/product/millennium-falcon-75192',
    product_image_url: 'https://www.lego.com/cdn/cs/set/assets/millennium-falcon.jpg',
    price: 19990000,
    currency: 'VND',
    origin: 'Denmark',
    category: 'Toys',
    description: 'Ultimate Lego Star Wars collector set with 7541 pieces'
  },
  {
    product_name: 'Kindle Paperwhite (2024)',
    product_url: 'https://www.amazon.com/kindle-paperwhite',
    product_image_url: 'https://m.media-amazon.com/images/I/kindle-paperwhite.jpg',
    price: 3290000,
    currency: 'VND',
    origin: 'USA',
    category: 'Books',
    description: 'Waterproof e-reader with adjustable warm light'
  },
  {
    product_name: 'DJI Mini 3 Pro Drone',
    product_url: 'https://www.dji.com/mini-3-pro',
    product_image_url: 'https://www.dji.com/mini-3-pro/image.jpg',
    price: 15990000,
    currency: 'VND',
    origin: 'China',
    category: 'Electronics',
    description: 'Lightweight drone with 4K HDR video and 34-min flight time'
  },
  {
    product_name: 'PlayStation 5 (Slim)',
    product_url: 'https://www.playstation.com/en-us/ps5/',
    product_image_url: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim.jpg',
    price: 12990000,
    currency: 'VND',
    origin: 'Japan',
    category: 'Electronics',
    description: 'Next-gen gaming console with 1TB storage'
  },
  {
    product_name: 'Dyson V15 Detect Vacuum',
    product_url: 'https://www.dyson.com/vacuum-cleaners/cordless/v15',
    product_image_url: 'https://dyson-h.assetsadobe2.com/is/image/content/v15-detect.jpg',
    price: 18990000,
    currency: 'VND',
    origin: 'UK',
    category: 'Home',
    description: 'Intelligent cordless vacuum with laser detection'
  },
  {
    product_name: 'Rolex Submariner Date',
    product_url: 'https://www.rolex.com/watches/submariner',
    product_image_url: 'https://www.rolex.com/content/dam/submariner.jpg',
    price: 250000000,
    currency: 'VND',
    origin: 'Switzerland',
    category: 'Fashion',
    description: 'Iconic luxury diving watch with 41mm case'
  }
]

async function seedAdminWishlist() {
  try {
    console.log('🌱 Seeding wishlist data for admin user...')
    console.log(`Admin ID: ${adminUserId}\n`)
    
    // Clear existing wishlist items for admin (soft delete)
    await query(
      'UPDATE wishlist_items SET deleted_at = NOW() WHERE user_id = $1',
      [adminUserId]
    )
    console.log('🗑️  Cleared existing wishlist items\n')
    
    // Insert sample items
    let successCount = 0
    
    for (const item of sampleItems) {
      try {
        const result = await query(
          `INSERT INTO wishlist_items (
            user_id, product_name, product_url, product_image_url,
            price, currency, origin, category, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id, product_name, price, currency`,
          [
            adminUserId,
            item.product_name,
            item.product_url,
            item.product_image_url,
            item.price,
            item.currency,
            item.origin,
            item.category,
            item.description
          ]
        )
        
        const created = result.rows[0]
        successCount++
        console.log(`✅ ${successCount}. ${created.product_name} - ${created.price.toLocaleString()} ${created.currency}`)
      } catch (error) {
        console.error(`❌ Failed to insert ${item.product_name}:`, error.message)
      }
    }
    
    console.log(`\n🎉 Successfully seeded ${successCount}/${sampleItems.length} items!`)
    
    // Verify
    const verifyResult = await query(
      'SELECT COUNT(*) as count FROM wishlist_items WHERE user_id = $1 AND deleted_at IS NULL',
      [adminUserId]
    )
    
    console.log(`\n✅ Verification: ${verifyResult.rows[0].count} items in database`)
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message)
  } finally {
    process.exit(0)
  }
}

seedAdminWishlist()
