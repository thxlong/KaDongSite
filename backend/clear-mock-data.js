/**
 * Clear Mock Gold Data
 * @description Delete all mock gold price data and fetch real prices
 */

import { query } from './config/database.js'

async function clearMockData() {
  try {
    console.log('🗑️  Clearing mock gold data from database...')
    
    // Delete all mock source data
    const deleteResult = await query(`
      DELETE FROM gold_rates 
      WHERE source = 'mock'
      RETURNING *
    `)
    
    console.log(`✅ Deleted ${deleteResult.rowCount} mock records`)
    
    // Show remaining data
    const remainingResult = await query(`
      SELECT source, COUNT(*) as count 
      FROM gold_rates 
      GROUP BY source
      ORDER BY source
    `)
    
    console.log('\n📊 Remaining data in database:')
    if (remainingResult.rows.length === 0) {
      console.log('  (empty - no data)')
    } else {
      remainingResult.rows.forEach(row => {
        console.log(`  - ${row.source}: ${row.count} records`)
      })
    }
    
    console.log('\n✅ Mock data cleared successfully!')
    console.log('\n💡 Next step: Run "node fetch-real-gold.js" to fetch real prices')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error clearing mock data:', error)
    process.exit(1)
  }
}

clearMockData()
