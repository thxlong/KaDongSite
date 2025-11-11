#!/usr/bin/env node

/**
 * Weather Tool Migration Runner
 * Run only the weather-specific migration (003)
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

async function runWeatherMigration() {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   🌤️  Weather Tool Migration 🌤️      ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    // Read migration file
    const migrationFile = path.join(__dirname, '../database/migrations/003_up_weather_tool.sql')
    console.log('📄 Reading migration file:', migrationFile)
    
    if (!fs.existsSync(migrationFile)) {
      throw new Error(`Migration file not found: ${migrationFile}`)
    }
    
    const sql = fs.readFileSync(migrationFile, 'utf8')
    console.log('⏳ Executing SQL...\n')
    
    // Execute migration
    await pool.query(sql)
    
    console.log('✅ Weather migration completed successfully!\n')
    console.log('📊 Created tables:')
    console.log('   - favorite_cities (with 4 indexes)')
    console.log('   - weather_cache (with 5 indexes)')
    console.log('\n📋 Created triggers:')
    console.log('   - update_favorite_cities_updated_at')
    console.log('\n🔧 Created functions:')
    console.log('   - delete_expired_weather_cache()\n')
    
    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('favorite_cities', 'weather_cache')
      ORDER BY table_name
    `)
    
    if (result.rows.length === 2) {
      console.log('✅ Verification: Both tables exist in database')
    } else {
      console.warn('⚠️  Warning: Expected 2 tables, found', result.rows.length)
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    
    if (error.message.includes('already exists')) {
      console.log('\n💡 Tables may already exist. To rollback and recreate:')
      console.log('   node scripts/migrate-weather.js rollback')
    }
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

async function rollbackWeatherMigration() {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   ⚠️  Weather Tool Rollback ⚠️        ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  console.log('⚠️  This will DELETE weather tables and data!\n')
  
  try {
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    const migrationFile = path.join(__dirname, '../database/migrations/003_down_weather_tool.sql')
    console.log('📄 Reading rollback file:', migrationFile)
    
    const sql = fs.readFileSync(migrationFile, 'utf8')
    console.log('⏳ Executing SQL...\n')
    
    await pool.query(sql)
    
    console.log('✅ Weather rollback completed successfully!')
    console.log('🗑️  Dropped tables: favorite_cities, weather_cache\n')
    
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
  rollbackWeatherMigration()
} else {
  runWeatherMigration()
}
