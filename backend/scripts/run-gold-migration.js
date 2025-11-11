/**
 * Run Gold Migration Script
 * @description Manually run 002_up_gold_rates.sql migration
 */

import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { query } from '../config/database.js'
import pg from 'pg'

const { Pool } = pg

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const main = async () => {
  try {
    console.log('🚀 Running gold_rates migration...\n')

    // Read migration file
    const migrationPath = path.join(__dirname, '../database/migrations/002_up_gold_rates.sql')
    const sql = await fs.readFile(migrationPath, 'utf-8')

    // Execute migration
    await query(sql)

    console.log('✅ Migration completed successfully\n')

    // Load seed data
    console.log('🌱 Loading seed data...\n')
    const seedPath = path.join(__dirname, '../database/seeds/002_seed_gold_rates.sql')
    const seedSql = await fs.readFile(seedPath, 'utf-8')
    await query(seedSql)

    console.log('✅ Seed data loaded successfully\n')

    // Verify
    const { rows } = await query('SELECT COUNT(*) FROM gold_rates')
    console.log(`📊 Total gold rates in database: ${rows[0].count}\n`)

    process.exit(0)

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()
