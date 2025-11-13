#!/usr/bin/env node

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

const checkTables = async () => {
  try {
    console.log('Checking auth tables...\n')
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'sessions', 'login_attempts', 'password_reset_tokens')
      ORDER BY table_name
    `)
    
    const existing = result.rows.map(r => r.table_name)
    const required = ['users', 'sessions', 'login_attempts', 'password_reset_tokens']
    
    console.log('Required tables:')
    required.forEach(table => {
      if (existing.includes(table)) {
        console.log(`  ✅ ${table}`)
      } else {
        console.log(`  ❌ ${table} (MISSING)`)
      }
    })
    
    if (existing.includes('users')) {
      // Check users table columns
      const columns = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position
      `)
      
      console.log('\nUsers table columns:')
      columns.rows.forEach(c => console.log(`  - ${c.column_name}`))
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkTables()
