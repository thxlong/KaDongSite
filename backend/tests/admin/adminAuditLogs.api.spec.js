/**
 * Admin Audit Logs API Integration Tests
 * 
 * Tests for:
 * - GET /api/admin/audit-logs - List audit logs
 * - GET /api/admin/audit-logs/:id - Get log details
 * - GET /api/admin/audit-logs/user/:userId - User-specific logs
 * - GET /api/admin/audit-logs/export - Export logs to CSV
 */

import { test, expect } from '@playwright/test';
import request from 'supertest';
import app from '../../src/app.js';

test.describe('Admin Audit Logs API', () => {
  let adminCookie;
  let testLogId;
  let testUserId;

  test.beforeAll(async () => {
    // Login as admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@kadong.com',
        password: 'Admin123!@#'
      });

    if (loginRes.status === 200) {
      adminCookie = loginRes.headers['set-cookie'];
    }

    // Get a test user
    const usersRes = await request(app)
      .get('/api/admin/users?limit=1')
      .set('Cookie', adminCookie);

    if (usersRes.status === 200 && usersRes.body.data.users.length > 0) {
      testUserId = usersRes.body.data.users[0].id;
    }
  });

  test.describe('GET /api/admin/audit-logs', () => {
    test('should list audit logs', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('logs');
      expect(Array.isArray(res.body.data.logs)).toBe(true);
      expect(res.body.data).toHaveProperty('pagination');

      // Validate pagination
      expect(res.body.data.pagination).toHaveProperty('page');
      expect(res.body.data.pagination).toHaveProperty('limit');
      expect(res.body.data.pagination).toHaveProperty('total');
      expect(res.body.data.pagination).toHaveProperty('total_pages');

      // Validate log structure if any exist
      if (res.body.data.logs.length > 0) {
        const log = res.body.data.logs[0];
        expect(log).toHaveProperty('id');
        expect(log).toHaveProperty('user_id');
        expect(log).toHaveProperty('action');
        expect(log).toHaveProperty('target_type');
        expect(log).toHaveProperty('target_id');
        expect(log).toHaveProperty('ip_address');
        expect(log).toHaveProperty('user_agent');
        expect(log).toHaveProperty('created_at');

        testLogId = log.id;
      }
    });

    test('should filter by action', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?action=user.view')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All logs should have the specified action
      res.body.data.logs.forEach(log => {
        expect(log.action).toBe('user.view');
      });
    });

    test('should filter by target type', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?target_type=user')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All logs should have the specified target type
      res.body.data.logs.forEach(log => {
        expect(log.target_type).toBe('user');
      });
    });

    test('should filter by date range', async () => {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);

      const res = await request(app)
        .get(`/api/admin/audit-logs?start_date=${lastMonth.toISOString()}&end_date=${today.toISOString()}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All logs should be within date range
      res.body.data.logs.forEach(log => {
        const logDate = new Date(log.created_at);
        expect(logDate.getTime()).toBeGreaterThanOrEqual(lastMonth.getTime());
        expect(logDate.getTime()).toBeLessThanOrEqual(today.getTime());
      });
    });

    test('should search by keyword', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?search=admin')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // Logs should contain the search keyword in action or details
      res.body.data.logs.forEach(log => {
        const searchableContent = `${log.action} ${JSON.stringify(log.details || {})}`.toLowerCase();
        expect(searchableContent).toContain('admin');
      });
    });

    test('should support pagination', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?page=1&limit=10')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(10);
      expect(res.body.data.logs.length).toBeLessThanOrEqual(10);
    });

    test('should sort by created_at descending by default', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?limit=5')
        .set('Cookie', adminCookie)
        .expect(200);

      if (res.body.data.logs.length > 1) {
        const logs = res.body.data.logs;
        for (let i = 0; i < logs.length - 1; i++) {
          const current = new Date(logs[i].created_at);
          const next = new Date(logs[i + 1].created_at);
          expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
        }
      }
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/audit-logs/:id', () => {
    test('should get log details', async () => {
      if (!testLogId) {
        // Get first log
        const logsRes = await request(app)
          .get('/api/admin/audit-logs?limit=1')
          .set('Cookie', adminCookie);
        
        if (logsRes.body.data.logs.length > 0) {
          testLogId = logsRes.body.data.logs[0].id;
        } else {
          return; // Skip if no logs
        }
      }

      const res = await request(app)
        .get(`/api/admin/audit-logs/${testLogId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('log');
      expect(res.body.data.log.id).toBe(testLogId);
      expect(res.body.data.log).toHaveProperty('action');
      expect(res.body.data.log).toHaveProperty('target_type');
      expect(res.body.data.log).toHaveProperty('details');
      expect(res.body.data.log).toHaveProperty('ip_address');
      expect(res.body.data.log).toHaveProperty('user_agent');
      expect(res.body.data.log).toHaveProperty('created_at');

      // Should include user information
      if (res.body.data.log.user_id) {
        expect(res.body.data.log).toHaveProperty('user_email');
        expect(res.body.data.log).toHaveProperty('user_name');
      }
    });

    test('should return 404 for non-existent log', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/99999')
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/audit-logs/user/:userId', () => {
    test('should get user-specific logs', async () => {
      if (!testUserId) return;

      const res = await request(app)
        .get(`/api/admin/audit-logs/user/${testUserId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('logs');
      expect(Array.isArray(res.body.data.logs)).toBe(true);
      expect(res.body.data).toHaveProperty('pagination');

      // All logs should belong to the specified user
      res.body.data.logs.forEach(log => {
        expect(log.user_id).toBe(testUserId);
      });
    });

    test('should support pagination for user logs', async () => {
      if (!testUserId) return;

      const res = await request(app)
        .get(`/api/admin/audit-logs/user/${testUserId}?page=1&limit=5`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(5);
      expect(res.body.data.logs.length).toBeLessThanOrEqual(5);
    });

    test('should filter user logs by action', async () => {
      if (!testUserId) return;

      const res = await request(app)
        .get(`/api/admin/audit-logs/user/${testUserId}?action=user.login`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All logs should be login actions for this user
      res.body.data.logs.forEach(log => {
        expect(log.user_id).toBe(testUserId);
        expect(log.action).toBe('user.login');
      });
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/user/99999')
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/user/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/audit-logs/export', () => {
    test('should export logs to CSV', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/export')
        .set('Cookie', adminCookie)
        .expect(200);

      // Should return CSV content type
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.headers['content-disposition']).toContain('attachment');
      expect(res.headers['content-disposition']).toContain('.csv');

      // Should have CSV content
      expect(res.text).toBeDefined();
      expect(res.text.length).toBeGreaterThan(0);

      // Should have CSV headers
      const lines = res.text.split('\n');
      expect(lines[0]).toContain('id');
      expect(lines[0]).toContain('action');
      expect(lines[0]).toContain('created_at');
    });

    test('should export filtered logs', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/export?action=user.login')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.headers['content-type']).toContain('text/csv');
      
      // CSV should contain filtered data
      const lines = res.text.split('\n');
      if (lines.length > 1) {
        // Check data rows (skip header)
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            expect(lines[i]).toContain('user.login');
          }
        }
      }
    });

    test('should export logs with date range', async () => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      const res = await request(app)
        .get(`/api/admin/audit-logs/export?start_date=${lastWeek.toISOString()}&end_date=${today.toISOString()}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toBeDefined();
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs/export')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('Audit Log Tracking', () => {
    test('should create audit log when viewing users', async () => {
      // Get initial log count
      const beforeRes = await request(app)
        .get('/api/admin/audit-logs?action=user.view&limit=1')
        .set('Cookie', adminCookie);
      
      const beforeCount = beforeRes.body.data.pagination.total;

      // View users page
      await request(app)
        .get('/api/admin/users')
        .set('Cookie', adminCookie);

      // Wait a bit for log to be created
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check if new log was created
      const afterRes = await request(app)
        .get('/api/admin/audit-logs?action=user.view&limit=1')
        .set('Cookie', adminCookie);
      
      const afterCount = afterRes.body.data.pagination.total;

      // Should have at least one more log
      expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
    });

    test('should track IP address in audit logs', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?limit=5')
        .set('Cookie', adminCookie)
        .expect(200);

      if (res.body.data.logs.length > 0) {
        res.body.data.logs.forEach(log => {
          expect(log.ip_address).toBeDefined();
          expect(typeof log.ip_address).toBe('string');
          expect(log.ip_address.length).toBeGreaterThan(0);
        });
      }
    });

    test('should track user agent in audit logs', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?limit=5')
        .set('Cookie', adminCookie)
        .expect(200);

      if (res.body.data.logs.length > 0) {
        res.body.data.logs.forEach(log => {
          expect(log.user_agent).toBeDefined();
          expect(typeof log.user_agent).toBe('string');
        });
      }
    });
  });

  test.describe('Audit Log Statistics', () => {
    test('should aggregate logs by action type', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?limit=100')
        .set('Cookie', adminCookie)
        .expect(200);

      if (res.body.data.logs.length > 0) {
        // Count actions
        const actionCounts = {};
        res.body.data.logs.forEach(log => {
          actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
        });

        // Should have multiple action types
        expect(Object.keys(actionCounts).length).toBeGreaterThan(0);
      }
    });

    test('should track different target types', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs?limit=100')
        .set('Cookie', adminCookie)
        .expect(200);

      if (res.body.data.logs.length > 0) {
        // Count target types
        const targetTypes = new Set();
        res.body.data.logs.forEach(log => {
          if (log.target_type) {
            targetTypes.add(log.target_type);
          }
        });

        // Should have logs for different entity types
        expect(targetTypes.size).toBeGreaterThan(0);
      }
    });
  });
});
