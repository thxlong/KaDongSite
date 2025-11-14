/**
 * Seed wishlist data for Guest user in database
 * @description For E2E testing - Guest user needs data in DB too
 */

import { query } from './config/database.js'

// Guest user ID (matches frontend constant)
const guestUserId = '550e8400-e29b-41d4-a716-446655440099'

const sampleItems = [
  {
    product_name: 'Samsung Galaxy S24 Ultra',
    product_url: 'https://www.samsung.com/vn/smartphones/galaxy-s24/',
    product_image_url: 'https://images.samsung.com/is/image/samsung/galaxy-s24-ultra',
    price: 33990000,
    currency: 'VND',
    origin: 'Korea',
    category: 'Electronics',
    description: 'Flagship Samsung phone with S Pen and AI features'
  },
  {
    product_name: 'AirPods Pro (2nd Gen)',
    product_url: 'https://www.apple.com/airpods-pro/',
    product_image_url: 'https://store.storeimages.cdn-apple.com/airpods-pro.png',
    price: 6990000,
    currency: 'VND',
    origin: 'USA',
    category: 'Electronics',
    description: 'Premium wireless earbuds with active noise cancellation'
  },
  {
    product_name: 'Adidas Ultraboost 23',
    product_url: 'https://www.adidas.com/us/ultraboost',
    product_image_url: 'https://assets.adidas.com/ultraboost-23.jpg',
    price: 4500000,
    currency: 'VND',
    origin: 'Germany',
    category: 'Fashion',
    description: 'Premium running shoes with responsive Boost cushioning'
  }
]

async function seedGuestWishlist() {
  try {
    console.log('🌱 Seeding wishlist data for Guest user...')
    console.log(`Guest user ID: ${guestUserId}\n`)
    
    // Check if Guest user exists
    const userCheck = await query('SELECT id FROM users WHERE id = $1', [guestUserId])
    if (userCheck.rows.length === 0) {
      console.log('⚠️  Guest user not found in database, will create...')
      // Try to create if doesn't exist
      try {
        await query(
          `INSERT INTO users (id, email, name, role, password_hash)
           VALUES ($1, $2, $3, $4, $5)`,
          [guestUserId, 'guest@kadong.local', 'Guest User', 'user', '$2b$10$dummyhash']
        )
        console.log('✓ Guest user created\n')
      } catch (err) {
        console.log('ℹ️  Guest user already exists\n')
      }
    } else {
      console.log('✓ Guest user exists\n')
    }
    
    // Clear existing wishlist items for guest
    await query(
      'UPDATE wishlist_items SET deleted_at = NOW() WHERE user_id = $1',
      [guestUserId]
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
            guestUserId,
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
      [guestUserId]
    )
    
    console.log(`\n✅ Verification: ${verifyResult.rows[0].count} items in database for Guest user`)
    console.log('\n💡 Guest user can now use wishlist in E2E tests!')
    
  } catch (error) {
    console.error('❌ Error seeding data:', error.message)
  } finally {
    process.exit(0)
  }
}

seedGuestWishlist()
