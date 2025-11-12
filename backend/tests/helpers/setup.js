import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test environment
dotenv.config({ path: path.join(__dirname, '../../.testenv') });

// Global test database pool
let testPool;

beforeAll(async () => {
  // Connect to test database
  testPool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 5432,
    database: process.env.TEST_DB_NAME || 'kadong_tools_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || '123'
  });
  
  // Verify connection
  await testPool.query('SELECT NOW()');
  console.log('✅ Test database connected');
});

afterAll(async () => {
  // Close connections
  if (testPool) {
    await testPool.end();
    console.log('🔌 Test database disconnected');
  }
});

// Clean database between tests
afterEach(async () => {
  if (testPool) {
    // Truncate all tables (preserve structure)
    await testPool.query(`
      TRUNCATE TABLE 
        notes, 
        countdown_events, 
        fashion_outfits,
        gold_rates,
        weather_cache,
        favorite_cities,
        currency_rates,
        wishlist_items,
        wishlist_comments,
        wishlist_hearts,
        feedback,
        sessions
      RESTART IDENTITY CASCADE
    `);
  }
});

// Export for use in tests
export { testPool };
