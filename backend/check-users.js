/**
 * Debug: Check users in database
 */

import { query } from './config/database.js'

console.log('🔍 Checking users in database...\n')

query('SELECT id, email, name, role, created_at FROM users ORDER BY created_at LIMIT 10')
  .then(result => {
    if (result.rows.length === 0) {
      console.log('❌ No users found!')
      console.log('Run: npm run db:seed')
    } else {
      console.log(`✅ Found ${result.rows.length} users:\n`)
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`)
        console.log(`   ID: ${user.id}`)
        console.log(`   Role: ${user.role}`)
        console.log(`   Created: ${user.created_at}\n`)
      })
    }
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
