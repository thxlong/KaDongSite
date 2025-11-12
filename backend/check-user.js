/**
 * Check if test user exists in database
 */

import { query } from './config/database.js'

const testUserId = '00000000-0000-0000-0000-000000000001'

console.log('Checking test user...')
console.log('User ID:', testUserId)

query('SELECT id, name, email FROM users WHERE id = $1', [testUserId])
  .then(result => {
    if (result.rows.length > 0) {
      console.log('✅ User exists!')
      console.log('User:', result.rows[0])
    } else {
      console.log('❌ User NOT found!')
      console.log('Creating test user...')
      return query(
        'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
        [testUserId, 'Test User', 'test@kadong.com', '$2b$10$dummyhash']
      )
    }
  })
  .then(result => {
    if (result) {
      console.log('✅ User created!')
      console.log('User:', result.rows[0])
    }
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
