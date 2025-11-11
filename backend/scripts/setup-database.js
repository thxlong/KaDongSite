#!/usr/bin/env node

/**
 * Complete Database Setup Script
 * This script will:
 * 1. Create database if not exists
 * 2. Run all migrations (001 + 002)
 * 3. Test connection
 * 4. Display database status
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const execAsync = promisify(exec)
const { Pool } = pg

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL)
const dbName = dbUrl.pathname.slice(1) // Remove leading slash
const dbUser = dbUrl.username
const dbPassword = dbUrl.password
const dbHost = dbUrl.hostname
const dbPort = dbUrl.port

console.log('╔═══════════════════════════════════════╗')
console.log('║   🗄️  Database Setup Wizard 🗄️        ║')
console.log('╚═══════════════════════════════════════╝\n')

/**
 * Step 1: Create database if not exists
 */
async function createDatabase() {
  console.log('📦 Step 1: Creating database if not exists...\n')
  
  // Connect to postgres default database first
  const pool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres' // Connect to default postgres database
  })
  
  try {
    // Check if database exists
    const checkDb = await pool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    )
    
    if (checkDb.rows.length > 0) {
      console.log(`✅ Database '${dbName}' already exists`)
    } else {
      // Create database
      await pool.query(`CREATE DATABASE ${dbName}`)
      console.log(`✅ Database '${dbName}' created successfully`)
    }
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

/**
 * Step 2: Run migration 001 (initial schema)
 */
async function runMigration001() {
  console.log('\n📦 Step 2: Running migration 001 (initial schema)...\n')
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const migrationFile = path.join(__dirname, '../database/migrations/001_up_initial_schema.sql')
  
  try {
    const sql = fs.readFileSync(migrationFile, 'utf8')
    await pool.query(sql)
    console.log('✅ Migration 001 completed (users, notes, events, tools, feedback, currency_rates, sessions)')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  Tables already exist, skipping migration 001')
    } else {
      console.error('❌ Migration 001 failed:', error.message)
      throw error
    }
  } finally {
    await pool.end()
  }
}

/**
 * Step 3: Run migration 002 (fashion_outfits)
 */
async function runMigration002() {
  console.log('\n📦 Step 3: Running migration 002 (fashion_outfits)...\n')
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const migrationFile = path.join(__dirname, '../database/migrations/002_up_fashion_outfits.sql')
  
  try {
    const sql = fs.readFileSync(migrationFile, 'utf8')
    await pool.query(sql)
    console.log('✅ Migration 002 completed (fashion_outfits table)')
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  fashion_outfits table already exists, skipping migration 002')
    } else {
      console.error('❌ Migration 002 failed:', error.message)
      throw error
    }
  } finally {
    await pool.end()
  }
}

/**
 * Step 4: Test connection and display status
 */
async function testAndDisplayStatus() {
  console.log('\n📦 Step 4: Testing connection and displaying status...\n')
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  try {
    // Test connection
    const timeResult = await pool.query('SELECT NOW() as now, version() as version')
    console.log('✅ Database connection successful')
    console.log(`📅 Server time: ${timeResult.rows[0].now}`)
    console.log(`🗄️  PostgreSQL: ${timeResult.rows[0].version.split(',')[0]}\n`)
    
    // List all tables
    const tablesResult = await pool.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log('📊 Database Tables:\n')
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name} (${row.column_count} columns)`)
    })
    
    // Check migrations table
    const migrationsResult = await pool.query(`
      SELECT name, executed_at 
      FROM migrations 
      ORDER BY executed_at DESC
    `)
    
    if (migrationsResult.rows.length > 0) {
      console.log('\n📜 Migration History:\n')
      migrationsResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.name} - ${row.executed_at}`)
      })
    }
    
    console.log('\n✅ Database setup completed successfully!')
    console.log('\n🚀 Next steps:')
    console.log('   1. Start backend: cd backend && npm run dev')
    console.log('   2. Start frontend: npm run dev')
    console.log('   3. Visit: http://localhost:5173\n')
    
  } catch (error) {
    console.error('❌ Status check failed:', error.message)
    throw error
  } finally {
    await pool.end()
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🔧 Configuration:')
    console.log(`   Database: ${dbName}`)
    console.log(`   Host: ${dbHost}:${dbPort}`)
    console.log(`   User: ${dbUser}\n`)
    
    await createDatabase()
    await runMigration001()
    await runMigration002()
    await testAndDisplayStatus()
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    console.error('\n💡 Troubleshooting:')
    console.error('   1. Make sure PostgreSQL is installed and running')
    console.error('   2. Check your .env DATABASE_URL configuration')
    console.error('   3. Verify postgres user has CREATE DATABASE permission')
    console.error('   4. Try: psql -U postgres -c "CREATE DATABASE kadong_tools;"\n')
    process.exit(1)
  }
}

main()
