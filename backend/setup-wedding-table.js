import pool from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupWeddingTable() {
  console.log('\n🔧 Setting up wedding_urls table...\n');

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connected\n');

    // Read migration file
    const migrationPath = path.join(__dirname, 'database', 'migrations', '007_up_wedding_urls.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 Running migration: 007_up_wedding_urls.sql');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully\n');

    // Verify table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'wedding_urls'
      );
    `);

    if (result.rows[0].exists) {
      console.log('✅ wedding_urls table created');

      // Get columns
      const cols = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'wedding_urls'
        ORDER BY ordinal_position
      `);

      console.log('\n📊 Table structure:');
      cols.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('❌ Table creation failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupWeddingTable();
