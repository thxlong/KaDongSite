/**
 * Apply user seed data to database
 * This will delete all existing users and create only admin and guest
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { query } from './config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function applySeed() {
  console.log('╔══════════════════════════════════════════╗')
  console.log('║   👥 Applying User Seed Data 👥         ║')
  console.log('╚══════════════════════════════════════════╝\n')
  
  try {
    // Test connection
    await query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    // Read seed file
    const seedFile = path.join(__dirname, 'database/seeds/001_test_user.sql')
    console.log('📄 Reading seed file:', seedFile)
    
    const sql = fs.readFileSync(seedFile, 'utf8')
    
    console.log('⚠️  WARNING: This will DELETE all existing users!')
    console.log('⏳ Applying seed data...\n')
    
    // Execute seed SQL
    await query(sql)
    
    console.log('\n✅ Seed data applied successfully!\n')
    
    // Verify users
    console.log('📊 Current users in database:\n')
    
    const result = await query(`
      SELECT id, email, name, role, created_at 
      FROM users 
      ORDER BY role DESC, created_at DESC
    `)
    
    result.rows.forEach((user, index) => {
      const icon = user.role === 'admin' ? '👑' : '👤'
      console.log(`${icon} ${user.name}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   UUID: ${user.id}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}\n`)
    })
    
    console.log('🎉 User setup completed!')
    console.log('🔑 Default user: admin@kadong.com')
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message)
    console.error('Details:', error)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

applySeed()
