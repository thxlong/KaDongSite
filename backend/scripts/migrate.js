#!/usr/bin/env node

/**
 * Database Migration Runner
 * Usage: node scripts/migrate.js [up|down]
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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

const MIGRATIONS_DIR = path.join(__dirname, '../database/migrations')

/**
 * Run migration up (create tables)
 */
async function migrateUp() {
  console.log('🚀 Running migrations UP...\n')
  
  try {
    const migrationFile = path.join(MIGRATIONS_DIR, '001_up_initial_schema.sql')
    const sql = fs.readFileSync(migrationFile, 'utf8')
    
    console.log('📄 Reading migration file:', migrationFile)
    console.log('⏳ Executing SQL...\n')
    
    await pool.query(sql)
    
    console.log('✅ Migration UP completed successfully!')
    console.log('📊 Tables created:')
    
    // List all tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
  } catch (error) {
    console.error('❌ Migration UP failed:', error.message)
    throw error
  }
}

/**
 * Run migration down (drop tables)
 */
async function migrateDown() {
  console.log('⚠️  Running migrations DOWN (ROLLBACK)...\n')
  console.log('⚠️  This will DELETE all tables and data!\n')
  
  // Safety check
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ Cannot run DOWN migration in production!')
    process.exit(1)
  }
  
  try {
    const migrationFile = path.join(MIGRATIONS_DIR, '001_down_rollback.sql')
    const sql = fs.readFileSync(migrationFile, 'utf8')
    
    console.log('📄 Reading rollback file:', migrationFile)
    console.log('⏳ Executing SQL...\n')
    
    await pool.query(sql)
    
    console.log('✅ Migration DOWN completed successfully!')
    console.log('🗑️  All tables dropped')
    
  } catch (error) {
    console.error('❌ Migration DOWN failed:', error.message)
    throw error
  }
}

/**
 * Check migration status
 */
async function checkStatus() {
  console.log('📊 Checking migration status...\n')
  
  try {
    // Check if migrations table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'migrations'
      )
    `)
    
    if (!tableCheck.rows[0].exists) {
      console.log('⚠️  Migrations table not found. No migrations have been run.')
      return
    }
    
    // Get migration history
    const result = await pool.query(`
      SELECT id, name, executed_at 
      FROM migrations 
      ORDER BY executed_at DESC
    `)
    
    console.log('✅ Migrations history:')
    result.rows.forEach(row => {
      console.log(`   ${row.id}. ${row.name} - ${row.executed_at}`)
    })
    
    // Count tables
    const tableCount = await pool.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    
    console.log(`\n📦 Total tables: ${tableCount.rows[0].count}`)
    
  } catch (error) {
    console.error('❌ Status check failed:', error.message)
    throw error
  }
}

/**
 * Main execution
 */
async function main() {
  const command = process.argv[2] || 'status'
  
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   🗄️  Database Migration Tool 🗄️      ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    switch (command) {
      case 'up':
        await migrateUp()
        break
      case 'down':
        await migrateDown()
        break
      case 'status':
        await checkStatus()
        break
      default:
        console.log('Usage: node scripts/migrate.js [up|down|status]')
        console.log('  up     - Run migrations (create tables)')
        console.log('  down   - Rollback migrations (drop tables)')
        console.log('  status - Check migration status')
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
