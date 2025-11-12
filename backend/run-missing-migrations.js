import pg from 'pg';
import fs from 'fs';

const { Client } = pg;

const client = new Client({
  user: 'postgres',
  password: '123',
  host: 'localhost',
  port: 5432,
  database: 'kadong_tools'
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Migration 003 - Weather Tool
    console.log('\n🔄 Running migration 003_up_weather_tool...');
    try {
      const sql003 = fs.readFileSync('database/migrations/003_up_weather_tool.sql', 'utf8');
      await client.query(sql003);
      await client.query("INSERT INTO migrations (id, name) VALUES (3, '003_up_weather_tool')");
      console.log('✅ Migration 003 completed');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ Migration 003 tables already exist, inserting migration record...');
        await client.query("INSERT INTO migrations (id, name) VALUES (3, '003_up_weather_tool') ON CONFLICT DO NOTHING");
      } else {
        throw error;
      }
    }

    // Migration 004 - Wishlist
    console.log('\n🔄 Running migration 004_up_wishlist...');
    try {
      const sql004 = fs.readFileSync('database/migrations/004_up_wishlist.sql', 'utf8');
      await client.query(sql004);
      await client.query("INSERT INTO migrations (id, name) VALUES (4, '004_up_wishlist')");
      console.log('✅ Migration 004 completed');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ Migration 004 tables already exist, inserting migration record...');
        await client.query("INSERT INTO migrations (id, name) VALUES (4, '004_up_wishlist') ON CONFLICT DO NOTHING");
      } else {
        throw error;
      }
    }

    // Migration 005 - Currency Rates
    console.log('\n🔄 Running migration 005_up_currency_rates...');
    try {
      const sql005 = fs.readFileSync('database/migrations/005_up_currency_rates.sql', 'utf8');
      await client.query(sql005);
      await client.query("INSERT INTO migrations (id, name) VALUES (5, '005_up_currency_rates')");
      console.log('✅ Migration 005 completed');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️ Migration 005 tables already exist, inserting migration record...');
        await client.query("INSERT INTO migrations (id, name) VALUES (5, '005_up_currency_rates') ON CONFLICT DO NOTHING");
      } else {
        throw error;
      }
    }

    console.log('\n✅ All migrations completed successfully!');

    // Verify
    const result = await client.query('SELECT * FROM migrations ORDER BY id');
    console.log('\n📋 Current migrations:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
