/**
 * Quick seed test user via backend connection
 */

import { query } from './config/database.js'

const testUser = {
  id: 'a0000000-0000-4000-8000-000000000001',
  email: 'test@kadong.com',
  name: 'Test User',
  role: 'user',
  password_hash: '$2b$10$dummyhashfordevonly'
}

console.log('🌱 Creating test user via backend connection...')
console.log('User ID:', testUser.id)

query(
  `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
   VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
   ON CONFLICT (email) DO UPDATE SET
     id = $1,
     name = $4,
     role = $5,
     updated_at = NOW()
   RETURNING id, email, name, role, created_at`,
  [testUser.id, testUser.email, testUser.password_hash, testUser.name, testUser.role]
)
  .then(result => {
    console.log('✅ Test user created/updated successfully!')
    console.log('User:', result.rows[0])
    console.log('\n📝 Use this UUID in frontend:')
    console.log(testUser.id)
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error.message)
    console.error('Details:', error)
    process.exit(1)
  })
