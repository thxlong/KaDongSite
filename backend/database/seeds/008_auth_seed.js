/**
 * Seed script for authentication system
 * Creates test users with properly hashed passwords
 */

const bcrypt = require('bcryptjs')
const pool = require('../../config/database')

const SALT_ROUNDS = 10
const TEST_PASSWORD = 'KaDong2024!'

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
    email: 'guest@kadong.com',
    name: 'Guest User',
    role: 'guest',
    email_verified: false,
    preferences: {}
  }
]

async function seedAuthUsers() {
  console.log('🌱 Seeding authentication users...')

  try {
    // Hash password once (same for all test users)
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS)
    console.log(`🔐 Password hashed with ${SALT_ROUNDS} rounds`)

    // Insert each user
    for (const user of testUsers) {
      try {
        const result = await pool.query(
          `INSERT INTO users (email, password_hash, name, role, email_verified, preferences)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (email) DO UPDATE
           SET password_hash = EXCLUDED.password_hash,
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

        console.log(`✅ Created/Updated user: ${result.rows[0].email} (${result.rows[0].role})`)
      } catch (error) {
        console.error(`❌ Error creating user ${user.email}:`, error.message)
      }
    }

    console.log('\n📋 Test Users Summary:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email               | Password      | Role')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    testUsers.forEach(user => {
      console.log(`${user.email.padEnd(20)}| ${TEST_PASSWORD.padEnd(14)}| ${user.role}`)
    })
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('✅ Authentication users seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding authentication users:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedAuthUsers()
    .then(() => {
      console.log('🎉 Seed complete!')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Seed failed:', error)
      process.exit(1)
    })
}

module.exports = seedAuthUsers
