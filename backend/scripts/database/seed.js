#!/usr/bin/env node

/**
 * Database Seed Runner
 * Usage: node scripts/seed.js
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

const SEEDS_DIR = path.join(__dirname, '../../database/seeds')

async function seedDatabase() {
  console.log('╔═══════════════════════════════════════╗')
  console.log('║   🌱 Database Seed Tool 🌱           ║')
  console.log('╚═══════════════════════════════════════╝\n')
  
  try {
    // Test connection
    await pool.query('SELECT NOW()')
    console.log('✅ Database connection successful\n')
    
    // Read seed file
    const seedFile = path.join(SEEDS_DIR, 'seed_data.sql')
    console.log('📄 Reading seed file:', seedFile)
    
    const sql = fs.readFileSync(seedFile, 'utf8')
    
    console.log('⏳ Inserting seed data...\n')
    
    // Execute seed SQL
    await pool.query(sql)
    
    console.log('✅ Seed data inserted successfully!\n')
    
    // Verify data
    console.log('📊 Verifying data:\n')
    
    const tables = ['users', 'tools', 'notes', 'countdown_events', 'feedback', 'currency_rates']
    
    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`)
      console.log(`   ${table}: ${result.rows[0].count} rows`)
    }
    
    console.log('\n🎉 Database seeding completed!')
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message)
    
    // Check if it's a duplicate key error
    if (error.code === '23505') {
      console.log('\n⚠️  Some seed data already exists (duplicate key)')
      console.log('   This is normal if you\'ve run seed before')
    }
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

seedDatabase()
