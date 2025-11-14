/**
 * Add Jewelry Gold Prices (10K, 14K, 18K)
 * @description Calculate jewelry gold prices based on 24K gold price and purity
 */

import { query } from './config/database.js'

async function addJewelryGold() {
  try {
    console.log('💍 Adding jewelry gold prices (10K, 14K, 18K)...\n')
    
    // Get latest 24K gold price from SJC (base price for calculation)
    const baseResult = await query(`
      SELECT buy_price, sell_price
      FROM gold_rates
      WHERE type = 'SJC_9999'
      ORDER BY fetched_at DESC
      LIMIT 1
    `)
    
    if (baseResult.rows.length === 0) {
      console.error('❌ No 24K gold price found. Please run fetch-real-gold.js first.')
      process.exit(1)
    }
    
    const base24K = baseResult.rows[0]
    console.log(`📊 Using SJC 9999 as base price:`)
    console.log(`  Buy: ${Math.round(base24K.buy_price / 1000000)}tr VND`)
    console.log(`  Sell: ${Math.round(base24K.sell_price / 1000000)}tr VND\n`)
    
    // Jewelry gold purity percentages
    const jewelryTypes = [
      {
        type: 'PNJ_18K',
        purity: 0.75, // 18/24 = 75%
        unit: '1 chỉ (3.75g)',
        location: 'Toàn quốc',
        brand: 'PNJ',
        description: 'Vàng 18K (75%) - Vàng trang sức cao cấp'
      },
      {
        type: 'GOLD_14K',
        purity: 0.585, // 14/24 = 58.5%
        unit: '1 chỉ (3.75g)',
        location: 'TP.HCM',
        description: 'Vàng 14K (58.5%) - Vàng trang sức phổ biến'
      },
      {
        type: 'GOLD_10K',
        purity: 0.417, // 10/24 = 41.7%
        unit: '1 chỉ (3.75g)',
        location: 'TP.HCM',
        description: 'Vàng 10K (41.7%) - Vàng trang sức giá rẻ'
      }
    ]
    
    const now = new Date()
    let savedCount = 0
    
    for (const jewelry of jewelryTypes) {
      // Calculate price per chỉ (3.75g) based on purity
      // 1 lượng = 10 chỉ = 37.5g
      // Price per chỉ = (24K price / 10) * purity
      const buyPricePerChi = Math.round((base24K.buy_price / 10) * jewelry.purity)
      const sellPricePerChi = Math.round((base24K.sell_price / 10) * jewelry.purity)
      const midPrice = Math.round((buyPricePerChi + sellPricePerChi) / 2)
      
      try {
        await query(`
          INSERT INTO gold_rates (
            type, source, buy_price, sell_price, mid_price,
            currency, fetched_at, meta
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          jewelry.type,
          'real',
          buyPricePerChi,
          sellPricePerChi,
          midPrice,
          'VND',
          now,
          JSON.stringify({
            unit: jewelry.unit,
            purity: `${(jewelry.purity * 100).toFixed(1)}%`,
            location: jewelry.location,
            brand: jewelry.brand || null,
            provider: 'Calculated from SJC 9999',
            provider_url: 'https://sjc.com.vn',
            description: jewelry.description,
            calculation: {
              base_type: 'SJC_9999',
              base_buy_price: base24K.buy_price,
              base_sell_price: base24K.sell_price,
              purity_factor: jewelry.purity,
              chi_factor: 0.1 // 1 chỉ = 1/10 lượng
            }
          })
        ])
        
        console.log(`✅ ${jewelry.type.padEnd(12)} ${Math.round(sellPricePerChi / 1000000)}tr - ${Math.round(buyPricePerChi / 1000000)}tr VND (${jewelry.unit})`)
        console.log(`   → Purity: ${(jewelry.purity * 100).toFixed(1)}% of 24K`)
        savedCount++
      } catch (saveError) {
        console.error(`❌ Failed to save ${jewelry.type}:`, saveError.message)
      }
    }
    
    console.log(`\n📈 Results: Added ${savedCount}/3 jewelry gold types`)
    
    // Show all gold types in database
    const allTypesResult = await query(`
      SELECT DISTINCT 
        type,
        source,
        sell_price,
        buy_price,
        currency,
        meta->>'unit' as unit,
        meta->>'purity' as purity
      FROM gold_rates
      WHERE fetched_at >= NOW() - INTERVAL '1 hour'
      ORDER BY type
    `)
    
    console.log(`\n💾 All gold types in database (last hour):`)
    allTypesResult.rows.forEach(row => {
      const priceDisplay = row.currency === 'VND'
        ? `${Math.round(row.sell_price / 1000000)}tr VND`
        : `$${parseFloat(row.sell_price).toFixed(2)}`
      
      const purityStr = row.purity ? ` [${row.purity}]` : ''
      console.log(`  ${row.type.padEnd(12)} ${priceDisplay.padEnd(15)} (${row.unit})${purityStr}`)
    })
    
    console.log('\n✅ Jewelry gold prices added successfully!')
    console.log('💡 View at: http://localhost:3000/gold')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding jewelry gold:', error)
    process.exit(1)
  }
}

addJewelryGold()
