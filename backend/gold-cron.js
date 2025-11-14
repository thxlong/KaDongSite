/**
 * Gold Price Auto-Updater (Cron Job)
 * @description Automatically fetch and update gold prices every 5 minutes
 */

import cron from 'node-cron'
import { query } from './config/database.js'
import { fetchFromAllProviders } from './providers/index.js'

// Cron schedule: Every 5 minutes
const CRON_SCHEDULE = '*/5 * * * *' // Every 5 minutes
// const CRON_SCHEDULE = '0 */1 * * *' // Every hour
// const CRON_SCHEDULE = '0 9,12,15,18 * * *' // At 9am, 12pm, 3pm, 6pm

let isRunning = false
let lastUpdate = null
let updateCount = 0

/**
 * Fetch and save gold prices
 */
async function updateGoldPrices() {
  if (isRunning) {
    console.log('⏭️  Skipping update - previous update still running')
    return
  }
  
  isRunning = true
  const startTime = new Date()
  
  try {
    console.log(`\n⏰ [${startTime.toLocaleString('vi-VN')}] Updating gold prices...`)
    
    // 1. Fetch from APIs
    const { rates, errors } = await fetchFromAllProviders()
    
    if (rates.length === 0) {
      console.error('❌ No gold prices fetched!')
      return
    }
    
    // 2. Save to database
    let savedCount = 0
    for (const rate of rates) {
      try {
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
        savedCount++
      } catch (saveError) {
        console.error(`  ❌ Failed to save ${rate.type}:`, saveError.message)
      }
    }
    
    // 3. Calculate jewelry gold prices (10K, 14K, 18K)
    const baseResult = await query(`
      SELECT buy_price, sell_price
      FROM gold_rates
      WHERE type = 'SJC_9999'
      ORDER BY fetched_at DESC
      LIMIT 1
    `)
    
    if (baseResult.rows.length > 0) {
      const base24K = baseResult.rows[0]
      const now = new Date()
      
      const jewelryTypes = [
        { type: 'PNJ_18K', purity: 0.75, unit: '1 chỉ (3.75g)', brand: 'PNJ' },
        { type: 'GOLD_14K', purity: 0.585, unit: '1 chỉ (3.75g)' },
        { type: 'GOLD_10K', purity: 0.417, unit: '1 chỉ (3.75g)' }
      ]
      
      for (const jewelry of jewelryTypes) {
        const buyPrice = Math.round((base24K.buy_price / 10) * jewelry.purity)
        const sellPrice = Math.round((base24K.sell_price / 10) * jewelry.purity)
        
        try {
          await query(`
            INSERT INTO gold_rates (
              type, source, buy_price, sell_price, mid_price,
              currency, fetched_at, meta
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            jewelry.type,
            'real',
            buyPrice,
            sellPrice,
            (buyPrice + sellPrice) / 2,
            'VND',
            now,
            JSON.stringify({
              unit: jewelry.unit,
              purity: `${(jewelry.purity * 100).toFixed(1)}%`,
              brand: jewelry.brand || null,
              provider: 'Calculated from SJC 9999'
            })
          ])
          savedCount++
        } catch (err) {
          console.error(`  ❌ Failed to save ${jewelry.type}:`, err.message)
        }
      }
    }
    
    const duration = ((new Date() - startTime) / 1000).toFixed(2)
    lastUpdate = new Date()
    updateCount++
    
    console.log(`✅ Update #${updateCount} completed in ${duration}s`)
    console.log(`  - Fetched: ${rates.length} prices`)
    console.log(`  - Saved: ${savedCount} records`)
    if (errors.length > 0) {
      console.log(`  - Errors: ${errors.length} providers failed`)
    }
    
  } catch (error) {
    console.error('❌ Update failed:', error.message)
  } finally {
    isRunning = false
  }
}

/**
 * Start cron job
 */
function startCronJob() {
  console.log('🚀 Gold Price Auto-Updater Started')
  console.log(`📅 Schedule: ${CRON_SCHEDULE} (every 5 minutes)`)
  console.log(`⏰ Started at: ${new Date().toLocaleString('vi-VN')}`)
  console.log('─'.repeat(60))
  
  // Run immediately on start
  updateGoldPrices()
  
  // Schedule cron job
  const task = cron.schedule(CRON_SCHEDULE, () => {
    updateGoldPrices()
  })
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Stopping cron job...')
    task.stop()
    console.log('✅ Cron job stopped')
    console.log(`📊 Statistics:`)
    console.log(`  - Total updates: ${updateCount}`)
    console.log(`  - Last update: ${lastUpdate ? lastUpdate.toLocaleString('vi-VN') : 'N/A'}`)
    process.exit(0)
  })
  
  console.log('✅ Cron job is running. Press Ctrl+C to stop.\n')
}

// Start the cron job
startCronJob()
