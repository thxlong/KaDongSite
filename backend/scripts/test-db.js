#!/usr/bin/env node

/**
 * Database Connection Test
 * Usage: node scripts/test-db.js
 */

import { testConnection, query, closePool } from '../config/database.js'

async function testDatabase() {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   🔍 Database Connection Test 🔍     ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  try {
    // Test basic connection
    const connected = await testConnection()
    
    if (!connected) {
      throw new Error('Connection test failed')
    }
    
    console.log('\n📊 Running diagnostic queries...\n')
    
    // Check database size
    const sizeResult = await query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `)
    console.log(`💾 Database size: ${sizeResult.rows[0].size}`)
    
    // Check active connections
    const connResult = await query(`
      SELECT count(*) as connections 
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `)
    console.log(`🔌 Active connections: ${connResult.rows[0].connections}`)
    
    // List all tables
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)
    
    console.log(`\n📋 Tables (${tablesResult.rows.length}):`)
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })
    
    // Check row counts
    console.log('\n📊 Row counts:')
    const tables = ['users', 'tools', 'notes', 'countdown_events', 'feedback', 'currency_rates']
    
    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) as count FROM ${table}`)
        console.log(`   ${table}: ${result.rows[0].count} rows`)
      } catch (error) {
        console.log(`   ${table}: table not found`)
      }
    }
    
    console.log('\n✅ All tests passed!')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('\n🔧 Troubleshooting tips:')
    console.error('   1. Check if PostgreSQL is running')
    console.error('   2. Verify DATABASE_URL in .env file')
    console.error('   3. Make sure database "kadongsite" exists')
    console.error('   4. Check username and password')
    process.exit(1)
  } finally {
    await closePool()
  }
}

testDatabase()
