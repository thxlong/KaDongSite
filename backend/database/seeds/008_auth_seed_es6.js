#!/usr/bin/env node

/**
 * Seed Auth Users
 * Creates test users with bcrypt-hashed passwords
 */

import bcrypt from 'bcrypt'
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kadongsite',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
})

const SALT_ROUNDS = 10
const TEST_PASSWORD = 'Admin123!@#'

const testUsers = [
  {
    email: 'admin@kadong.com',
    name: 'Admin User',
    role: 'admin',
    email_verified: true,
    preferences: { theme: 'light', language: 'vi' }
  },
  {
    email: 'user@kadong.com',
    name: 'Test User',
    role: 'user',
    email_verified: true,
    preferences: { theme: 'pastel', language: 'vi' }
  },
  {
    email: 'testuser2@kadong.com',
    name: 'Test User 2',
    role: 'user',
    email_verified: false,
    preferences: {}
  }
]

const seedUsers = async () => {
  console.log('🌱 Seeding auth users...\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    // Hash password once for all users
    console.log('🔐 Hashing password...')
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS)
    console.log('✅ Password hashed\n')
    
    // Insert or update each user
    for (const user of testUsers) {
      console.log(`Creating user: ${user.email}`)
      
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role, email_verified, preferences)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) 
         DO UPDATE SET
           password_hash = EXCLUDED.password_hash,
           name = EXCLUDED.name,
           role = EXCLUDED.role,
           email_verified = EXCLUDED.email_verified,
           preferences = EXCLUDED.preferences,
           updated_at = NOW()
         RETURNING id, email, name, role`,
        [
          user.email,
          passwordHash,
          user.name,
          user.role,
          user.email_verified,
          JSON.stringify(user.preferences)
        ]
      )
      
      const createdUser = result.rows[0]
      console.log(`  ✅ ${createdUser.email} (${createdUser.role})`)
    }
    
    console.log('\n✅ Seeding completed successfully!')
    console.log('\n📝 Test Users Summary:')
    console.log('┌────────────────────────┬──────────┬──────────────┐')
    console.log('│ Email                  │ Role     │ Password     │')
    console.log('├────────────────────────┼──────────┼──────────────┤')
    testUsers.forEach(user => {
      console.log(`│ ${user.email.padEnd(22)} │ ${user.role.padEnd(8)} │ ${TEST_PASSWORD.padEnd(12)} │`)
    })
    console.log('└────────────────────────┴──────────┴──────────────┘')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

seedUsers()
