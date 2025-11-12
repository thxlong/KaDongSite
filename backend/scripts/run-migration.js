#!/usr/bin/env node

/**
 * Run a specific migration file
 * Usage: node scripts/run-migration.js <migration-file>
 * Example: node scripts/run-migration.js 004_up_wishlist.sql
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

async function runMigration(fileName) {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   🚀 Run Specific Migration 🚀       ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    const migrationFile = path.join(MIGRATIONS_DIR, fileName)
    
    if (!fs.existsSync(migrationFile)) {
      console.error(`❌ Migration file not found: ${fileName}`)
      process.exit(1)
    }
    
    const sql = fs.readFileSync(migrationFile, 'utf8')
    
    console.log(`📄 Reading migration file: ${fileName}`)
    console.log('⏳ Executing SQL...\n')
    
    await pool.query(sql)
    
    console.log('\n✅ Migration completed successfully!')
    
    // Show current tables
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log(`\n📊 Current tables (${result.rows.length}):`)
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    if (error.detail) {
      console.error('   Detail:', error.detail)
    }
    process.exit(1)
  } finally {
    await pool.end()
  }
}

const fileName = process.argv[2]

if (!fileName) {
  console.log('Usage: node scripts/run-migration.js <migration-file>')
  console.log('Example: node scripts/run-migration.js 004_up_wishlist.sql')
  process.exit(1)
}

runMigration(fileName)
