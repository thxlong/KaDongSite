/**
 * Smoke Tests - Verify Test Infrastructure
 * 
 * These tests verify that the test infrastructure is working correctly
 * before running the actual test suites.
 */

import { testPool, dbHelper, factories, authHelper } from './helpers/index.js';
import { mockExternalAPIs } from './mocks/externalAPIs.js';

describe('Test Infrastructure Smoke Tests', () => {
  
  describe('Database Connection', () => {
    it('should connect to test database successfully', async () => {
      const result = await testPool.query('SELECT NOW() as current_time');
      
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0]).toHaveProperty('current_time');
      expect(result.rows[0].current_time).toBeInstanceOf(Date);
    });
    
    it('should verify all tables exist', async () => {
      const tables = [
        'users', 'sessions', 'notes', 'countdown_events',
        'fashion_outfits', 'gold_rates', 'weather_cache',
        'favorite_cities', 'currency_rates', 'wishlist_items',
        'wishlist_comments', 'wishlist_hearts', 'feedback', 'tools'
      ];
      
      for (const table of tables) {
        const result = await testPool.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table]);
        
        expect(result.rows[0].exists).toBe(true);
      }
    });
  });
  
  describe('Database Helper Functions', () => {
    it('should insert and retrieve data', async () => {
      const userData = factories.user({ email: 'smoke-test@example.com' });
      
      // Insert
      const insertedUser = await dbHelper.insert('users', userData);
      expect(insertedUser).toBeDefined();
      expect(insertedUser.id).toBeDefined();
      expect(insertedUser.email).toBe('smoke-test@example.com');
      
      // Find by ID
      const foundUser = await dbHelper.findById('users', insertedUser.id);
      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(insertedUser.id);
      expect(foundUser.email).toBe('smoke-test@example.com');
    });
    
    it('should count records', async () => {
      const user = await dbHelper.insert('users', factories.user());
      await dbHelper.insert('notes', factories.note(user.id));
      await dbHelper.insert('notes', factories.note(user.id));
      
      const count = await dbHelper.count('notes', { user_id: user.id });
      expect(count).toBe(2);
    });
    
    it('should find one record with conditions', async () => {
      const user = await dbHelper.insert('users', factories.user({ role: 'admin' }));
      
      const foundUser = await dbHelper.findOne('users', { role: 'admin' });
      expect(foundUser).toBeDefined();
      expect(foundUser.role).toBe('admin');
    });
    
    it('should find all records with conditions', async () => {
      const user = await dbHelper.insert('users', factories.user());
      await dbHelper.insert('notes', factories.note(user.id, { pinned: true }));
      await dbHelper.insert('notes', factories.note(user.id, { pinned: true }));
      await dbHelper.insert('notes', factories.note(user.id, { pinned: false }));
      
      const pinnedNotes = await dbHelper.findAll('notes', { pinned: true });
      expect(pinnedNotes).toHaveLength(2);
    });
  });
  
  describe('Test Data Factories', () => {
    it('should generate valid user data', () => {
      const user = factories.user();
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('password_hash');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('created_at');
      
      expect(user.email).toMatch(/@/);
      expect(user.role).toBe('user');
    });
    
    it('should accept overrides', () => {
      const admin = factories.user({ role: 'admin', email: 'admin@test.com' });
      
      expect(admin.role).toBe('admin');
      expect(admin.email).toBe('admin@test.com');
    });
    
    it('should generate valid note data', () => {
      const userId = 'test-user-id';
      const note = factories.note(userId);
      
      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('user_id');
      expect(note).toHaveProperty('title');
      expect(note).toHaveProperty('content');
      expect(note).toHaveProperty('color');
      expect(note.user_id).toBe(userId);
    });
    
    it('should generate valid event data', () => {
      const userId = 'test-user-id';
      const event = factories.event(userId);
      
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('user_id');
      expect(event).toHaveProperty('title');
      expect(event).toHaveProperty('event_date');
      expect(event.user_id).toBe(userId);
    });
    
    it('should generate valid wishlist item data', () => {
      const userId = 'test-user-id';
      const item = factories.wishlistItem(userId);
      
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('user_id');
      expect(item).toHaveProperty('product_name');
      expect(item).toHaveProperty('product_url');
      expect(item).toHaveProperty('price');
      expect(item.user_id).toBe(userId);
    });
    
    it('should generate valid currency rate data', () => {
      const rate = factories.currencyRate();
      
      expect(rate).toHaveProperty('id');
      expect(rate).toHaveProperty('base_currency');
      expect(rate).toHaveProperty('target_currency');
      expect(rate).toHaveProperty('rate');
      expect(rate.base_currency).toBe('USD');
    });
    
    it('should generate valid gold rate data', () => {
      const gold = factories.goldRate();
      
      expect(gold).toHaveProperty('id');
      expect(gold).toHaveProperty('gold_type');
      expect(gold).toHaveProperty('buy_price');
      expect(gold).toHaveProperty('sell_price');
    });
    
    it('should generate valid weather cache data', () => {
      const weather = factories.weatherCache();
      
      expect(weather).toHaveProperty('city');
      expect(weather).toHaveProperty('temperature');
      expect(weather).toHaveProperty('humidity');
      expect(weather).toHaveProperty('weather_main');
    });
  });
  
  describe('Authentication Helper', () => {
    it('should create authenticated user', async () => {
      const { user, token } = await authHelper.createAuthenticatedUser();
      
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
    
    it('should create user with specific role', async () => {
      const { user, token } = await authHelper.createAuthenticatedUser('admin');
      
      expect(user.role).toBe('admin');
      expect(token).toBeDefined();
    });
    
    it('should generate auth header', () => {
      const token = 'test-token-123';
      const header = authHelper.getAuthHeader(token);
      
      expect(header).toHaveProperty('Authorization');
      expect(header.Authorization).toBe('Bearer test-token-123');
    });
    
    it('should create session', async () => {
      const user = await dbHelper.insert('users', factories.user());
      const session = await authHelper.createSession(user.id);
      
      expect(session).toBeDefined();
      expect(session).toHaveProperty('id');
      expect(session.user_id).toBe(user.id);
      expect(session).toHaveProperty('expires_at');
    });
    
    it('should generate mock token', () => {
      const userId = 'test-user-id';
      const token = authHelper.generateMockToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
    
    it('should generate expired token', () => {
      const userId = 'test-user-id';
      const token = authHelper.generateExpiredToken(userId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      // Decode and verify it's expired
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      expect(decoded.exp).toBeLessThan(Math.floor(Date.now() / 1000));
    });
  });
  
  describe('External API Mocks', () => {
    afterEach(() => {
      mockExternalAPIs.cleanAll();
    });
    
    it('should mock weather API', () => {
      const mockedData = mockExternalAPIs.mockWeatherAPI('Ho Chi Minh City');
      
      expect(mockedData).toBeDefined();
      expect(mockedData).toHaveProperty('name');
      expect(mockedData).toHaveProperty('main');
      expect(mockedData.main).toHaveProperty('temp');
    });
    
    it('should mock exchange rate API', () => {
      const rates = mockExternalAPIs.mockExchangeRateAPI();
      
      expect(rates).toBeDefined();
      expect(rates).toHaveProperty('USD');
      expect(rates).toHaveProperty('VND');
      expect(rates.USD).toBe(1);
    });
    
    it('should mock Shopee API', () => {
      const productData = mockExternalAPIs.mockShopeeAPI();
      
      expect(productData).toBeDefined();
      expect(productData).toHaveProperty('item');
      expect(productData.item).toHaveProperty('itemid');
      expect(productData.item).toHaveProperty('name');
    });
    
    it('should mock gold price API', () => {
      const goldData = mockExternalAPIs.mockGoldAPI();
      
      expect(goldData).toBeDefined();
      expect(goldData).toHaveProperty('data');
      expect(goldData.data).toBeInstanceOf(Array);
      expect(goldData.data.length).toBeGreaterThan(0);
    });
    
    it('should mock TikTok Shop API', () => {
      const productData = mockExternalAPIs.mockTikTokAPI();
      
      expect(productData).toBeDefined();
      expect(productData).toHaveProperty('product');
      expect(productData.product).toHaveProperty('id');
    });
    
    it('should mock API failure', () => {
      mockExternalAPIs.mockAPIFailure('https://example.com/api', 503, 'Service Unavailable');
      
      // Verify mock is set up (actual HTTP call would need nock/axios to test)
      expect(mockExternalAPIs.isDone()).toBe(false);
    });
    
    it('should mock API timeout', () => {
      mockExternalAPIs.mockAPITimeout('https://example.com/api', 5000);
      
      // Verify mock is set up
      expect(mockExternalAPIs.isDone()).toBe(false);
    });
    
    it('should clean all mocks', () => {
      mockExternalAPIs.mockWeatherAPI();
      mockExternalAPIs.mockExchangeRateAPI();
      
      mockExternalAPIs.cleanAll();
      
      // After cleanup, no mocks should be pending
      expect(() => mockExternalAPIs.isDone()).not.toThrow();
    });
  });
  
  describe('Test Cleanup', () => {
    it('should truncate tables after each test', async () => {
      // Insert data
      await dbHelper.insert('users', factories.user());
      await dbHelper.insert('users', factories.user());
      
      // Verify data exists
      const countBefore = await dbHelper.count('users');
      expect(countBefore).toBeGreaterThanOrEqual(2);
      
      // Manually truncate (afterEach will also do this)
      await dbHelper.truncate('users');
      
      // Verify table is empty
      const countAfter = await dbHelper.count('users');
      expect(countAfter).toBe(0);
    });
  });
});
