/**
 * Add GOLD_10K to database
 */

import { query } from './config/database.js'

console.log('Adding GOLD_10K to database...')

const insertQuery = `
INSERT INTO gold_rates (type, source, buy_price, sell_price, mid_price, currency, fetched_at, meta) VALUES
('GOLD_10K', 'mock', 32500000, 33000000, 32750000, 'VND', NOW() - INTERVAL '1 hour', 
 '{"unit": "1 chỉ (3.75g)", "location": "TP.HCM", "purity": "41.7%", "note": "Vàng trang sức phổ thông"}'),
('GOLD_10K', 'mock', 32400000, 32900000, 32650000, 'VND', NOW() - INTERVAL '2 hours', 
 '{"unit": "1 chỉ (3.75g)", "location": "TP.HCM", "purity": "41.7%", "note": "Vàng trang sức phổ thông"}')
ON CONFLICT DO NOTHING;
`

query(insertQuery)
  .then(result => {
    console.log('✅ GOLD_10K added successfully!')
    console.log('Inserted rows:', result.rowCount)
    
    // Verify
    return query("SELECT type, COUNT(*) as count FROM gold_rates WHERE type LIKE 'GOLD_%' GROUP BY type ORDER BY type")
  })
  .then(result => {
    console.log('\n📊 Gold types in database:')
    result.rows.forEach(row => {
      console.log(`  ${row.type}: ${row.count} records`)
    })
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error.message)
    process.exit(1)
  })
