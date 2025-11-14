/**
 * Fetch Real Gold Prices
 * @description Manually trigger real gold price fetch from VNAppMob API
 */

import { query } from './config/database.js'
import { fetchFromAllProviders } from './providers/index.js'

async function fetchRealGold() {
  try {
    console.log('💰 Fetching real gold prices from VNAppMob API...\n')
    
    // Fetch from all active providers
    const { rates, errors } = await fetchFromAllProviders()
    
    if (errors.length > 0) {
      console.log('\n⚠️  Some providers had errors:')
      errors.forEach(err => {
        console.log(`  - ${err.provider}: ${err.error}`)
      })
    }
    
    if (rates.length === 0) {
      console.error('\n❌ No gold prices fetched! Check API keys and network.')
      process.exit(1)
    }
    
    console.log(`\n✅ Fetched ${rates.length} gold prices`)
    console.log('\n📊 Gold prices summary:')
    
    // Save to database
    let savedCount = 0
    let failedCount = 0
    
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
        
        // Format price display
        const priceDisplay = rate.currency === 'VND' 
          ? `${Math.round(rate.sell_price / 1000000)}tr - ${Math.round(rate.buy_price / 1000000)}tr VND`
          : `$${rate.buy_price.toFixed(2)} - $${rate.sell_price.toFixed(2)}`
        
        console.log(`  ✅ ${rate.type.padEnd(12)} ${priceDisplay.padEnd(30)} (${rate.meta.unit})`)
        savedCount++
      } catch (saveError) {
        console.error(`  ❌ Failed to save ${rate.type}:`, saveError.message)
        failedCount++
      }
    }
    
    console.log(`\n📈 Results:`)
    console.log(`  - Fetched: ${rates.length} prices`)
    console.log(`  - Saved: ${savedCount} records`)
    console.log(`  - Failed: ${failedCount} records`)
    
    // Show database stats
    const statsResult = await query(`
      SELECT 
        type,
        source,
        sell_price,
        buy_price,
        currency,
        fetched_at,
        meta->>'unit' as unit,
        meta->>'provider' as provider
      FROM gold_rates
      WHERE fetched_at >= NOW() - INTERVAL '1 hour'
      ORDER BY type, fetched_at DESC
    `)
    
    console.log(`\n💾 Latest data in database (last hour):`)
    if (statsResult.rows.length === 0) {
      console.log('  (no recent data)')
    } else {
      const grouped = {}
      statsResult.rows.forEach(row => {
        if (!grouped[row.type]) {
          grouped[row.type] = row
        }
      })
      
      Object.values(grouped).forEach(row => {
        const priceDisplay = row.currency === 'VND'
          ? `${Math.round(row.sell_price / 1000000)}tr VND`
          : `$${parseFloat(row.sell_price).toFixed(2)}`
        
        const timeAgo = Math.round((new Date() - new Date(row.fetched_at)) / 60000)
        console.log(`  ${row.type.padEnd(12)} ${priceDisplay.padEnd(15)} (${row.unit}) - ${timeAgo}m ago`)
      })
    }
    
    console.log('\n✅ Real gold prices fetched and saved successfully!')
    console.log('\n💡 You can now view them at: http://localhost:3000/gold')
    
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error fetching real gold prices:', error.message)
    console.error('\nStack trace:', error.stack)
    process.exit(1)
  }
}

fetchRealGold()
