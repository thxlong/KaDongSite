/**
 * Integration Tests: Currency API
 * Tests all currency endpoints with real API calls
 */

import request from 'supertest';
import app from '../../../app.js';
import { query } from '../../../config/database.js';
import { cleanupDatabase } from '../../helpers/dbHelper.js';

describe('Currency API Integration Tests', () => {
  
  beforeAll(async () => {
    // Ensure currency_rates table exists and has seed data
    await query(`
      INSERT INTO currency_rates (base_currency, target_currency, rate, source, last_updated)
      VALUES 
        ('USD', 'VND', 26345.00, 'test', CURRENT_TIMESTAMP),
        ('USD', 'EUR', 0.92, 'test', CURRENT_TIMESTAMP),
        ('USD', 'GBP', 0.79, 'test', CURRENT_TIMESTAMP),
        ('USD', 'JPY', 149.50, 'test', CURRENT_TIMESTAMP),
        ('USD', 'KRW', 1320.00, 'test', CURRENT_TIMESTAMP),
        ('USD', 'CNY', 7.24, 'test', CURRENT_TIMESTAMP),
        ('USD', 'THB', 35.50, 'test', CURRENT_TIMESTAMP),
        ('USD', 'USD', 1.00, 'fixed', CURRENT_TIMESTAMP)
      ON CONFLICT (base_currency, target_currency) 
      DO UPDATE SET rate = EXCLUDED.rate, last_updated = EXCLUDED.last_updated
    `);
  });

  afterAll(async () => {
    await cleanupDatabase();
  });

  describe('GET /api/currency/rates', () => {
    
    it('should return all exchange rates with 200 status', async () => {
      const response = await request(app)
        .get('/api/currency/rates')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          base: 'USD',
          rates: expect.any(Object),
          lastUpdated: expect.any(String),
          source: expect.any(String),
          cached: expect.any(Boolean)
        }
      });
    });

    it('should include all major currencies', async () => {
      const response = await request(app)
        .get('/api/currency/rates')
        .expect(200);

      const rates = response.body.data.rates;
      const expectedCurrencies = ['VND', 'EUR', 'GBP', 'JPY', 'KRW', 'CNY', 'THB', 'USD'];
      
      expectedCurrencies.forEach(currency => {
        expect(rates).toHaveProperty(currency);
        expect(typeof rates[currency]).toBe('number');
        expect(rates[currency]).toBeGreaterThan(0);
      });
    });

    it('should have USD to USD rate equal to 1', async () => {
      const response = await request(app)
        .get('/api/currency/rates')
        .expect(200);

      expect(response.body.data.rates.USD).toBe(1);
    });

    it('should return cached data when cache is fresh', async () => {
      // First call
      await request(app).get('/api/currency/rates').expect(200);
      
      // Second call (should be cached)
      const response = await request(app)
        .get('/api/currency/rates')
        .expect(200);

      expect(response.body.data.cached).toBe(true);
    });

    it.skip('should handle database errors gracefully', async () => {
      // SKIP: Complex to mock database in integration test
      // This is better tested in unit tests
    });

  });

  describe('POST /api/currency/convert', () => {

    it('should convert USD to VND correctly', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100,
          from: 'USD',
          to: 'VND'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          amount: 100,
          from: 'USD',
          to: 'VND',
          result: expect.any(Number),
          rate: expect.any(Number)
        }
      });

      // Check conversion math
      expect(response.body.data.result).toBeCloseTo(2634500, 0);
    });

    it('should convert VND to USD correctly', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 26345,
          from: 'VND',
          to: 'USD'
        })
        .expect(200);

      expect(response.body.data.result).toBeCloseTo(1, 1);
    });

    it('should convert EUR to JPY correctly', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100,
          from: 'EUR',
          to: 'JPY'
        })
        .expect(200);

      expect(response.body.data.result).toBeGreaterThan(0);
      expect(response.body.data.from).toBe('EUR');
      expect(response.body.data.to).toBe('JPY');
    });

    it('should return same amount when converting same currency', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 500,
          from: 'USD',
          to: 'USD'
        })
        .expect(200);

      expect(response.body.data.result).toBe(500);
      expect(response.body.data.rate).toBe(1);
    });

    it('should return 400 when missing amount', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          from: 'USD',
          to: 'VND'
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: expect.stringContaining('Thiếu thông tin')
        }
      });
    });

    it('should return 400 when missing from currency', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100,
          to: 'VND'
        })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 400 when missing to currency', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100,
          from: 'USD'
        })
        .expect(400);

      expect(response.body.error.code).toBe('INVALID_INPUT');
    });

    it('should return 404 when currency not found', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 100,
          from: 'USD',
          to: 'XXX' // Invalid currency
        })
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'CURRENCY_NOT_FOUND',
          message: expect.stringContaining('Không tìm thấy tỷ giá')
        }
      });
    });

    it('should handle decimal amounts correctly', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 10.50,
          from: 'USD',
          to: 'VND'
        })
        .expect(200);

      expect(response.body.data.amount).toBe(10.50);
      expect(response.body.data.result).toBeGreaterThan(0);
    });

    it('should handle large amounts correctly', async () => {
      const response = await request(app)
        .post('/api/currency/convert')
        .send({
          amount: 1000000,
          from: 'USD',
          to: 'VND'
        })
        .expect(200);

      expect(response.body.data.result).toBeGreaterThan(1000000);
    });

  });

  describe('POST /api/currency/refresh', () => {

    it.skip('should refresh rates and return updated data', async () => {
      // SKIP: Requires external API access (blocked by SSL cert issues)
      // API works when tested manually, but CI/corporate network blocks HTTPS calls
    });

    it.skip('should update database with new rates', async () => {
      // SKIP: Requires external API access
    });

    it.skip('should handle API failures gracefully', async () => {
      // SKIP: Requires mocking external dependencies (better in unit tests)
    });

  });

  describe('Performance Tests', () => {

    it('should respond within 500ms for cached rates', async () => {
      const start = Date.now();
      await request(app).get('/api/currency/rates').expect(200);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(500);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/currency/rates').expect(200)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
      });
    });

  });

});
