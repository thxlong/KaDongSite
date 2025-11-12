import pool from './config/database.js';

(async () => {
  try {
    const result = await pool.query(`
      SELECT 
        type, 
        buy_price, 
        sell_price,
        meta->>'provider' as provider,
        fetched_at 
      FROM gold_rates 
      WHERE source = 'real' 
        AND meta->>'provider' LIKE '%VNAppMob%' 
      ORDER BY fetched_at DESC 
      LIMIT 10
    `);
    
    console.log('\n=== VNAppMob Gold Prices ===\n');
    console.table(result.rows);
    
    console.log(`\nTotal: ${result.rows.length} records`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
