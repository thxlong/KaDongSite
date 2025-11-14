/**
 * Check admin user and wishlist data
 */

import { query } from './config/database.js'

const adminUserId = '550e8400-e29b-41d4-a716-446655440000'

async function checkAdminData() {
  try {
    console.log('🔍 Checking admin user...')
    
    // Check admin user
    const userResult = await query(
      'SELECT id, email, name, role FROM users WHERE id = $1',
      [adminUserId]
    )
    
    if (userResult.rows.length === 0) {
      console.log('❌ Admin user NOT FOUND in database!')
      console.log('User ID:', adminUserId)
      return
    }
    
    console.log('✅ Admin user found:')
    console.log(userResult.rows[0])
    
    // Check wishlist items for admin
    console.log('\n🎁 Checking wishlist items for admin...')
    const itemsResult = await query(
      `SELECT id, product_name, price, currency, created_at 
       FROM wishlist_items 
       WHERE user_id = $1 AND deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [adminUserId]
    )
    
    if (itemsResult.rows.length === 0) {
      console.log('⚠️  No wishlist items found for admin user!')
      console.log('This is why the UI shows empty data.')
      return
    }
    
    console.log(`✅ Found ${itemsResult.rows.length} wishlist items:`)
    itemsResult.rows.forEach((item, idx) => {
      console.log(`${idx + 1}. ${item.product_name} - ${item.price} ${item.currency}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    process.exit(0)
  }
}

checkAdminData()
