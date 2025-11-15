import pool from './config/database.js';

async function checkWeddingTable() {
  console.log('\n🔍 Checking wedding_urls table...\n');

  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'wedding_urls'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ wedding_urls table EXISTS');

      // Get table structure
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'wedding_urls'
        ORDER BY ordinal_position
      `);

      console.log('\n📊 Table columns:');
      console.table(columnsResult.rows);

      // Count records
      const countResult = await pool.query('SELECT COUNT(*) FROM wedding_urls');
      console.log(`\n📈 Total records: ${countResult.rows[0].count}`);

      // Check admin user exists
      const adminCheck = await pool.query(
        `SELECT id, email FROM users WHERE id = $1`,
        ['550e8400-e29b-41d4-a716-446655440000']
      );

      if (adminCheck.rows.length > 0) {
        console.log('\n✅ Admin user exists:', adminCheck.rows[0].email);
      } else {
        console.log('\n❌ Admin user NOT found! Need to seed users.');
      }

    } else {
      console.log('❌ wedding_urls table DOES NOT EXIST');
      console.log('\n💡 Run migration:');
      console.log('   node run-migrations.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkWeddingTable();
