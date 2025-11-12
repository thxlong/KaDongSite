/**
 * Seed test user for wishlist feature
 */

import { query } from './config/database.js'
import bcrypt from 'bcrypt'

const testUser = {
  id: 'a0000000-0000-4000-8000-000000000001',
  name: 'Test User',
  email: 'test@kadong.com',
  password: 'test123456'
}

async function seedTestUser() {
  try {
    console.log('🌱 Seeding test user...')
    
    // Check if user exists
    const checkResult = await query('SELECT id FROM users WHERE id = $1', [testUser.id])
    
    if (checkResult.rows.length > 0) {
      console.log('✅ Test user already exists!')
      console.log('User ID:', testUser.id)
      return
    }

    // Hash password
    const passwordHash = await bcrypt.hash(testUser.password, 10)

    // Insert user
    const result = await query(
      `INSERT INTO users (id, name, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING id, name, email, created_at`,
      [testUser.id, testUser.name, testUser.email, passwordHash]
    )

    console.log('✅ Test user created successfully!')
    console.log('User:', result.rows[0])
    console.log('Password:', testUser.password)
    
  } catch (error) {
    console.error('❌ Error seeding test user:', error)
    throw error
  } finally {
    process.exit(0)
  }
}

seedTestUser()
