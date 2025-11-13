#!/usr/bin/env node

/**
 * Run Migration 008 - Auth System
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const { Pool } = pg

// Check if DATABASE_URL exists, otherwise build from components
const connectionConfig = process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL }
  : {
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'kadongsite',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432
    }

const pool = new Pool(connectionConfig)

const MIGRATION_FILE = path.join(__dirname, '../../database/migrations/008_up_auth_system.sql')

async function runMigration() {
  console.log('🚀 Running Migration 008: Auth System\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    // Read migration file
    const sql = fs.readFileSync(MIGRATION_FILE, 'utf8')
    console.log('📄 Reading migration file:', MIGRATION_FILE)
    console.log('⏳ Executing SQL...\n')
    
    // Run migration
    await pool.query(sql)
    
    console.log('✅ Migration 008 completed successfully!')
    console.log('📊 Auth tables created:')
    console.log('   - users')
    console.log('   - sessions')
    console.log('   - login_attempts')
    console.log('   - password_reset_tokens')
    
    // Verify tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('users', 'sessions', 'login_attempts', 'password_reset_tokens')
      ORDER BY table_name
    `)
    
    console.log('\n✅ Verified tables in database:')
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`)
    })
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

runMigration()
