#!/usr/bin/env node

/**
 * Currency Tool Migration Runner
 * Run currency_rates table migration (005)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') })

const { Pool } = pg

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kadong_tools',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'kadong2024'
})

async function runCurrencyMigration() {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   💱 Currency Tool Migration 💱       ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    // Read migration file
    const migrationFile = path.join(__dirname, '../database/migrations/005_up_currency_rates.sql')
    console.log('📄 Reading migration file:', migrationFile)
    
    if (!fs.existsSync(migrationFile)) {
      throw new Error(`Migration file not found: ${migrationFile}`)
    }
    
    const sql = fs.readFileSync(migrationFile, 'utf8')
    console.log('⏳ Executing migration SQL...\n')
    
    // Execute migration
    await pool.query(sql)
    
    console.log('✅ Currency migration completed successfully!\n')
    console.log('📊 Created table:')
    console.log('   - currency_rates (exchange rates cache)')
    console.log('\n📋 Created indexes:')
    console.log('   - idx_currency_rates_base_target')
    console.log('   - idx_currency_rates_last_updated\n')
    
    // Verify table was created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'currency_rates'
    `)
    
    if (result.rows.length === 1) {
      console.log('✅ Verification: currency_rates table exists in database')
    } else {
      console.warn('⚠️  Warning: Table not found after migration')
    }
    
    // Now run seed data
    console.log('\n⏳ Seeding initial currency rates...\n')
    const seedFile = path.join(__dirname, '../database/seeds/005_currency_rates.sql')
    const seedSql = fs.readFileSync(seedFile, 'utf8')
    await pool.query(seedSql)
    
    const ratesResult = await pool.query('SELECT COUNT(*) as count FROM currency_rates')
    console.log(`✅ Seeded ${ratesResult.rows[0].count} currency rates\n`)
    
    console.log('🎉 Currency tool ready to use!')
    console.log('   API endpoint: http://localhost:5000/api/currency/rates\n')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    
    if (error.message.includes('already exists')) {
      console.log('\n💡 Table may already exist. To rollback and recreate:')
      console.log('   node scripts/migrate-currency.js rollback')
    }
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

async function rollbackCurrencyMigration() {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   ⚠️  Currency Tool Rollback ⚠️       ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  console.log('⚠️  This will DELETE currency_rates table and data!\n')
  
  try {
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    const migrationFile = path.join(__dirname, '../database/migrations/005_down_currency_rates.sql')
    console.log('📄 Reading rollback file:', migrationFile)
    
    const sql = fs.readFileSync(migrationFile, 'utf8')
    console.log('⏳ Executing SQL...\n')
    
    await pool.query(sql)
    
    console.log('✅ Currency rollback completed successfully!')
    console.log('🗑️  Dropped table: currency_rates\n')
    
  } catch (error) {
    console.error('\n❌ Rollback failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Main execution
const command = process.argv[2] || 'up'

if (command === 'rollback' || command === 'down') {
  rollbackCurrencyMigration()
} else {
  runCurrencyMigration()
}
