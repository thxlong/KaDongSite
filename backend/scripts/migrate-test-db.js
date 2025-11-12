import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment
dotenv.config({ path: path.join(__dirname, '../.testenv') });

const { Pool } = pg;

async function migrateTestDatabase() {
  const pool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT) || 5432,
    database: process.env.TEST_DB_NAME || 'kadong_tools_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || '123'
  });

  try {
    console.log('🔧 Connecting to test database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to test database');

    // Enable UUID extension
    console.log('\n📦 Enabling extensions...');
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    console.log('✅ UUID extension enabled');

    // Read and run migrations
    const migrationsDir = path.join(__dirname, '../database/migrations');
    const migrations = [
      '001_up_initial_schema.sql',
      '002_up_fashion_outfits.sql',
      '002_up_gold_rates.sql',
      '003_up_weather_tool.sql',
      '004_up_wishlist.sql',
      '005_up_currency_rates.sql'
    ];

    console.log('\n🚀 Running migrations...');
    for (const migration of migrations) {
      const filePath = path.join(migrationsDir, migration);
      if (fs.existsSync(filePath)) {
        console.log(`   Running ${migration}...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        try {
          await pool.query(sql);
          console.log(`   ✅ ${migration} completed`);
        } catch (error) {
          // Ignore "already exists" errors
          if (error.code === '42P07' || error.code === '42710' || error.message.includes('already exists')) {
            console.log(`   ⚠️  ${migration} - tables/indexes already exist, skipping`);
          } else {
            throw error;
          }
        }
      } else {
        console.log(`   ⚠️  ${migration} not found, skipping`);
      }
    }

    // Verify tables created
    console.log('\n🔍 Verifying tables...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${result.rows.length} tables:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n✅ Test database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrateTestDatabase();
