import { testPool } from './setup.js';

export const dbHelper = {
  /**
   * Insert test data
   */
  async insert(table, data) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const result = await testPool.query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  },
  
  /**
   * Find by ID
   */
  async findById(table, id) {
    const result = await testPool.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },
  
  /**
   * Find one record matching conditions
   */
  async findOne(table, where = {}) {
    let query = `SELECT * FROM ${table}`;
    const conditions = [];
    const values = [];
    
    Object.entries(where).forEach(([key, value], index) => {
      conditions.push(`${key} = $${index + 1}`);
      values.push(value);
    });
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' LIMIT 1';
    
    const result = await testPool.query(query, values);
    return result.rows[0];
  },
  
  /**
   * Find all records matching conditions
   */
  async findAll(table, where = {}) {
    let query = `SELECT * FROM ${table}`;
    const conditions = [];
    const values = [];
    
    Object.entries(where).forEach(([key, value], index) => {
      conditions.push(`${key} = $${index + 1}`);
      values.push(value);
    });
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const result = await testPool.query(query, values);
    return result.rows;
  },
  
  /**
   * Count rows
   */
  async count(table, where = {}) {
    let query = `SELECT COUNT(*) FROM ${table}`;
    const conditions = [];
    const values = [];
    
    Object.entries(where).forEach(([key, value], index) => {
      conditions.push(`${key} = $${index + 1}`);
      values.push(value);
    });
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const result = await testPool.query(query, values);
    return parseInt(result.rows[0].count);
  },
  
  /**
   * Truncate table
   */
  async truncate(table) {
    await testPool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
  },
  
  /**
   * Raw query
   */
  async query(sql, params = []) {
    return await testPool.query(sql, params);
  }
};

/**
 * Cleanup database after tests
 */
export async function cleanupDatabase() {
  const tables = [
    'sessions',
    'wishlist_hearts',
    'wishlist_comments',
    'wishlist_items',
    'favorite_cities',
    'weather_cache',
    'currency_rates',
    'gold_rates',
    'fashion_outfits',
    'countdown_events',
    'notes',
    'feedback',
    'users'
  ];
  
  for (const table of tables) {
    try {
      await testPool.query(`DELETE FROM ${table}`);
    } catch (error) {
      // Ignore errors for non-existent tables in test db
      console.warn(`Warning: Could not cleanup ${table}:`, error.message);
    }
  }
}
