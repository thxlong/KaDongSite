/**
 * Gold Price Fetch Script
 * @description Fetches gold prices from providers and saves to database
 * @author KaDong Team
 * @created 2025-11-11
 * 
 * Usage:
 *   node scripts/fetch-gold.js        # One-time fetch
 *   node scripts/fetch-gold.js --cron # Start cron scheduler
 * 
 * Environment Variables:
 *   GOLD_FETCH_CRON - Cron expression (default: '0 *\/5 * * * *' = every 5 minutes)
 *   DATABASE_URL    - PostgreSQL connection string
 */

import dotenv from 'dotenv'
import cron from 'node-cron'
import { query } from '../config/database.js'
import { fetchFromAllProviders } from '../providers/index.js'

dotenv.config()

// Default: every 5 minutes
const CRON_EXPRESSION = process.env.GOLD_FETCH_CRON || '0 */5 * * * *'

/**
 * Fetch and save gold prices
 * @returns {Promise<Object>} Fetch results
 */
const fetchAndSave = async () => {
  const startTime = Date.now()
  console.log('\n' + '='.repeat(60))
  console.log(`[Fetch Gold] Starting fetch at ${new Date().toISOString()}`)
  console.log('='.repeat(60))

  try {
    // Fetch from all providers
    const { rates, errors } = await fetchFromAllProviders()

    if (rates.length === 0) {
      console.warn('[Fetch Gold] ⚠️  No rates fetched from any provider')
      return {
        success: false,
        fetched: 0,
        saved: 0,
        errors: errors.length,
        duration_ms: Date.now() - startTime
      }
    }

    // Save to database
    let savedCount = 0
    let failedCount = 0

    for (const rate of rates) {
      try {
        await query(`
          INSERT INTO gold_rates (
            type, 
            source, 
            buy_price, 
            sell_price, 
            mid_price, 
            currency, 
            fetched_at, 
            meta
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
        savedCount++
      } catch (saveError) {
        console.error(`[Fetch Gold] ❌ Failed to save ${rate.type} from ${rate.source}:`, saveError.message)
        failedCount++
      }
    }

    const duration = Date.now() - startTime

    console.log('\n' + '='.repeat(60))
    console.log('[Fetch Gold] ✅ Fetch completed')
    console.log(`  Fetched: ${rates.length} rates`)
    console.log(`  Saved: ${savedCount} rates`)
    console.log(`  Failed: ${failedCount} rates`)
    console.log(`  Provider errors: ${errors.length}`)
    console.log(`  Duration: ${duration}ms`)
    console.log('='.repeat(60) + '\n')

    // Update statistics cache (optional)
    await updateStatistics()

    return {
      success: true,
      fetched: rates.length,
      saved: savedCount,
      failed: failedCount,
      errors: errors.length,
      duration_ms: duration
    }

  } catch (error) {
    console.error('[Fetch Gold] ❌ Fatal error:', error)
    return {
      success: false,
      error: error.message,
      duration_ms: Date.now() - startTime
    }
  }
}

/**
 * Update statistics cache
 * Optional: Calculate and cache aggregated statistics
 */
const updateStatistics = async () => {
  try {
    // Example: Get latest stats
    const statsQuery = `
      SELECT 
        COUNT(*) as total_rates,
        COUNT(DISTINCT type) as total_types,
        COUNT(DISTINCT source) as total_sources,
        MAX(fetched_at) as last_update
      FROM gold_rates
    `
    const { rows } = await query(statsQuery)
    
    if (rows[0]) {
      console.log('[Fetch Gold] 📊 Database statistics:')
      console.log(`  Total rates: ${rows[0].total_rates}`)
      console.log(`  Total types: ${rows[0].total_types}`)
      console.log(`  Total sources: ${rows[0].total_sources}`)
      console.log(`  Last update: ${rows[0].last_update}`)
    }

    // Optional: Save to cache table or Redis
    // await query('UPDATE cache SET stats = $1 WHERE key = $2', [JSON.stringify(rows[0]), 'gold_stats'])
    // await redis.set('gold:stats', JSON.stringify(rows[0]))

  } catch (error) {
    console.error('[Fetch Gold] Failed to update statistics:', error.message)
  }
}

/**
 * Clean old data (optional)
 * Remove data older than retention period
 */
const cleanOldData = async () => {
  const retentionDays = process.env.GOLD_DATA_RETENTION_DAYS || 90

  try {
    const result = await query(`
      DELETE FROM gold_rates 
      WHERE fetched_at < NOW() - INTERVAL '${retentionDays} days'
    `)
    
    if (result.rowCount > 0) {
      console.log(`[Fetch Gold] 🗑️  Cleaned ${result.rowCount} old records (older than ${retentionDays} days)`)
    }
  } catch (error) {
    console.error('[Fetch Gold] Failed to clean old data:', error.message)
  }
}

/**
 * Main execution
 */
const main = async () => {
  const args = process.argv.slice(2)
  const runCron = args.includes('--cron')

  if (runCron) {
    // Run as cron job
    console.log('[Fetch Gold] 🕐 Starting cron scheduler')
    console.log(`[Fetch Gold] Schedule: ${CRON_EXPRESSION}`)
    console.log('[Fetch Gold] Press Ctrl+C to stop\n')

    // Validate cron expression
    if (!cron.validate(CRON_EXPRESSION)) {
      console.error(`[Fetch Gold] ❌ Invalid cron expression: ${CRON_EXPRESSION}`)
      process.exit(1)
    }

    // Run immediately on start
    await fetchAndSave()

    // Schedule recurring fetches
    cron.schedule(CRON_EXPRESSION, async () => {
      await fetchAndSave()
    })

    // Optional: Clean old data daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('[Fetch Gold] 🗑️  Running daily cleanup...')
      await cleanOldData()
    })

  } else {
    // Run once
    console.log('[Fetch Gold] 🔄 Running one-time fetch\n')
    const result = await fetchAndSave()
    
    if (!result.success) {
      process.exit(1)
    }
    
    process.exit(0)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Fetch Gold] 👋 Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n[Fetch Gold] 👋 Shutting down gracefully...')
  process.exit(0)
})

// Run
main().catch(error => {
  console.error('[Fetch Gold] ❌ Unhandled error:', error)
  process.exit(1)
})
