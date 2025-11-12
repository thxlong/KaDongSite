/**
 * Migrate localStorage Gold Data to Database
 * @description Import existing gold data from localStorage export to PostgreSQL
 * @author KaDong Team
 * @created 2025-11-11
 * 
 * Usage:
 *   node scripts/migrate-gold-localstorage.js <json-file-path>
 *   
 * Example:
 *   node scripts/migrate-gold-localstorage.js data/gold-local-export.json
 */

import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { query } from '../config/database.js'

dotenv.config()

/**
 * Parse and validate gold data from localStorage export
 * @param {Object} rawData - Raw data from JSON file
 * @returns {Array} Normalized gold rate objects
 */
const normalizeData = (rawData) => {
  const rates = []

  // Handle different possible export formats
  let dataArray = []
  
  if (Array.isArray(rawData)) {
    dataArray = rawData
  } else if (rawData.goldRates && Array.isArray(rawData.goldRates)) {
    dataArray = rawData.goldRates
  } else if (rawData.data && Array.isArray(rawData.data)) {
    dataArray = rawData.data
  } else {
    throw new Error('Invalid data format: expected array or object with goldRates/data property')
  }

  for (const item of dataArray) {
    // Validate required fields
    if (!item.type || !item.currency) {
      console.warn(`Skipping invalid item (missing type or currency):`, item)
      continue
    }

    // Normalize rate object
    const rate = {
      type: item.type,
      source: item.source || 'localStorage',
      buy_price: parseFloat(item.buy_price || item.buyPrice || 0),
      sell_price: parseFloat(item.sell_price || item.sellPrice || 0),
      mid_price: parseFloat(item.mid_price || item.midPrice || 0),
      currency: item.currency,
      fetched_at: item.fetched_at || item.fetchedAt || item.timestamp || new Date(),
      meta: item.meta || item.metadata || {}
    }

    // Calculate mid_price if missing
    if (!rate.mid_price && rate.buy_price && rate.sell_price) {
      rate.mid_price = (rate.buy_price + rate.sell_price) / 2
    }

    rates.push(rate)
  }

  return rates
}

/**
 * Check if record already exists
 * @param {Object} rate - Gold rate object
 * @returns {Promise<boolean>} True if exists
 */
const recordExists = async (rate) => {
  try {
    const { rows } = await query(`
      SELECT id FROM gold_rates
      WHERE type = $1 
        AND source = $2 
        AND fetched_at = $3
      LIMIT 1
    `, [rate.type, rate.source, rate.fetched_at])

    return rows.length > 0
  } catch (error) {
    console.error('Error checking record existence:', error.message)
    return false
  }
}

/**
 * Import gold rates to database
 * @param {Array} rates - Array of gold rate objects
 * @param {boolean} skipDuplicates - Skip duplicate records (default: true)
 * @returns {Promise<Object>} Import results
 */
const importRates = async (rates, skipDuplicates = true) => {
  let inserted = 0
  let skipped = 0
  let failed = 0

  console.log(`\nImporting ${rates.length} records...`)
  console.log('Skip duplicates:', skipDuplicates ? 'Yes' : 'No')
  console.log('-'.repeat(60))

  for (let i = 0; i < rates.length; i++) {
    const rate = rates[i]
    
    try {
      // Check for duplicates
      if (skipDuplicates) {
        const exists = await recordExists(rate)
        if (exists) {
          skipped++
          if (skipped % 10 === 0) {
            process.stdout.write(`\rProgress: ${i + 1}/${rates.length} | Inserted: ${inserted} | Skipped: ${skipped} | Failed: ${failed}`)
          }
          continue
        }
      }

      // Insert record
      await query(`
        INSERT INTO gold_rates (
          type, source, buy_price, sell_price, mid_price,
          currency, fetched_at, meta
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        rate.type,
        rate.source,
        rate.buy_price,
        rate.sell_price,
        rate.mid_price,
        rate.currency,
        rate.fetched_at,
        JSON.stringify(rate.meta)
      ])

      inserted++
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        process.stdout.write(`\rProgress: ${i + 1}/${rates.length} | Inserted: ${inserted} | Skipped: ${skipped} | Failed: ${failed}`)
      }

    } catch (error) {
      failed++
      console.error(`\n❌ Failed to import record ${i + 1}:`, error.message)
      console.error('   Data:', JSON.stringify(rate, null, 2))
    }
  }

  console.log(`\rProgress: ${rates.length}/${rates.length} | Inserted: ${inserted} | Skipped: ${skipped} | Failed: ${failed}`)
  console.log('-'.repeat(60))

  return { inserted, skipped, failed }
}

/**
 * Main execution
 */
const main = async () => {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('❌ Error: Missing JSON file path')
    console.log('\nUsage:')
    console.log('  node scripts/migrate-gold-localstorage.js <json-file-path>')
    console.log('\nExample:')
    console.log('  node scripts/migrate-gold-localstorage.js data/gold-local-export.json')
    process.exit(1)
  }

  const filePath = path.resolve(args[0])
  const skipDuplicates = !args.includes('--force')

  console.log('\n' + '='.repeat(60))
  console.log('Gold Data Migration - localStorage to PostgreSQL')
  console.log('='.repeat(60))
  console.log(`Input file: ${filePath}`)
  console.log(`Time: ${new Date().toISOString()}`)
  console.log('='.repeat(60))

  try {
    // Read JSON file
    console.log('\n📂 Reading JSON file...')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const rawData = JSON.parse(fileContent)
    console.log('✅ File loaded successfully')

    // Normalize data
    console.log('\n🔄 Normalizing data...')
    const rates = normalizeData(rawData)
    console.log(`✅ Normalized ${rates.length} records`)

    // Show sample
    if (rates.length > 0) {
      console.log('\n📋 Sample record:')
      console.log(JSON.stringify(rates[0], null, 2))
    }

    // Confirm before import
    console.log('\n⚠️  Ready to import to database')
    console.log(`   Records to import: ${rates.length}`)
    console.log(`   Skip duplicates: ${skipDuplicates ? 'Yes' : 'No'}`)

    // Import to database
    const { inserted, skipped, failed } = await importRates(rates, skipDuplicates)

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('Migration Summary')
    console.log('='.repeat(60))
    console.log(`✅ Successfully inserted: ${inserted}`)
    console.log(`⏭️  Skipped (duplicates): ${skipped}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📊 Total processed: ${inserted + skipped + failed}`)
    console.log('='.repeat(60))

    if (failed > 0) {
      console.log('\n⚠️  Some records failed to import. Check error messages above.')
      process.exit(1)
    }

    console.log('\n✅ Migration completed successfully!\n')
    process.exit(0)

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('\nStack trace:', error.stack)
    process.exit(1)
  }
}

// Run
main()
