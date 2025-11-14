import bcrypt from 'bcrypt'
import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new pkg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kadongsite',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
})

const testPassword = async () => {
  try {
    // Get admin user
    const result = await pool.query(
      'SELECT email, password_hash FROM users WHERE email = $1',
      ['admin@kadong.com']
    )
    
    if (result.rows.length === 0) {
      console.log('Admin user not found')
      return
    }
    
    const user = result.rows[0]
    console.log('Email:', user.email)
    console.log('Password hash:', user.password_hash)
    
    // Test multiple passwords
    const passwords = ['admin123', 'Admin123', 'KaDong2024!', 'admin']
    
    for (const testPass of passwords) {
      console.log(`\nTesting password: "${testPass}"`)
      const isMatch = await bcrypt.compare(testPass, user.password_hash)
      console.log(`  Match: ${isMatch}`)
    }
    
  } catch (error) {
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)
  } finally {
    await pool.end()
  }
}

testPassword()
