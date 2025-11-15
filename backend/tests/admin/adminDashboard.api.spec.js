/**
 * Admin Dashboard API Integration Tests
 * 
 * Tests for:
 * - GET /api/admin/dashboard/stats - Dashboard statistics
 * - GET /api/admin/dashboard/activity-chart - Activity chart data
 * - GET /api/admin/system/health - System health check
 */

import { test, expect } from '@playwright/test';
import request from 'supertest';
import app from '../../src/app.js';

test.describe('Admin Dashboard API', () => {
  let adminCookie;

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
  });

  test.describe('GET /api/admin/dashboard/stats', () => {
    test('should return dashboard statistics', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('roles');
      expect(res.body.data).toHaveProperty('security');
      expect(res.body.data).toHaveProperty('sessions');

      // Validate users stats structure
      expect(res.body.data.users).toHaveProperty('total_users');
      expect(res.body.data.users).toHaveProperty('new_users_30d');
      expect(res.body.data.users).toHaveProperty('new_users_7d');
      expect(res.body.data.users).toHaveProperty('locked_users');

      // Validate security stats structure
      expect(res.body.data.security).toHaveProperty('unreviewed_alerts');
      expect(res.body.data.security).toHaveProperty('high_severity_alerts');
      expect(res.body.data.security).toHaveProperty('active_ip_blocks');

      // Validate sessions stats structure
      expect(res.body.data.sessions).toHaveProperty('total_sessions');
      expect(res.body.data.sessions).toHaveProperty('unique_users');

      // Validate roles array
      expect(Array.isArray(res.body.data.roles)).toBe(true);
      if (res.body.data.roles.length > 0) {
        const role = res.body.data.roles[0];
        expect(role).toHaveProperty('name');
        expect(role).toHaveProperty('user_count');
      }

      // Validate recent activity
      if (res.body.data.recent_activity) {
        expect(Array.isArray(res.body.data.recent_activity)).toBe(true);
      }

      // Validate top actions
      if (res.body.data.top_actions) {
        expect(Array.isArray(res.body.data.top_actions)).toBe(true);
      }
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    test('should have numeric values for all counts', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Cookie', adminCookie)
        .expect(200);

      const stats = res.body.data;
      
      // Check numeric values
      expect(typeof stats.users.total_users).toBe('number');
      expect(typeof stats.users.new_users_7d).toBe('number');
      expect(typeof stats.users.new_users_30d).toBe('number');
      expect(typeof stats.users.locked_users).toBe('number');
      
      expect(typeof stats.security.unreviewed_alerts).toBe('number');
      expect(typeof stats.security.high_severity_alerts).toBe('number');
      expect(typeof stats.security.active_ip_blocks).toBe('number');
      
      expect(typeof stats.sessions.total_sessions).toBe('number');
      expect(typeof stats.sessions.unique_users).toBe('number');

      // All counts should be non-negative
      expect(stats.users.total_users).toBeGreaterThanOrEqual(0);
      expect(stats.users.new_users_7d).toBeGreaterThanOrEqual(0);
      expect(stats.security.unreviewed_alerts).toBeGreaterThanOrEqual(0);
      expect(stats.sessions.total_sessions).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('GET /api/admin/dashboard/activity-chart', () => {
    test('should return activity chart data for default 30 days', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/activity-chart')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('activity');
      expect(Array.isArray(res.body.data.activity)).toBe(true);

      if (res.body.data.activity.length > 0) {
        const dataPoint = res.body.data.activity[0];
        expect(dataPoint).toHaveProperty('date');
        expect(dataPoint).toHaveProperty('user_actions');
        expect(dataPoint).toHaveProperty('role_actions');
        expect(dataPoint).toHaveProperty('security_actions');
        expect(dataPoint).toHaveProperty('total_actions');

        // Validate numeric values
        expect(typeof dataPoint.total_actions).toBe('number');
        expect(dataPoint.total_actions).toBeGreaterThanOrEqual(0);
      }
    });

    test('should accept custom days parameter', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/activity-chart?days=7')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('activity');
      
      // Should have at most 7 days of data
      expect(res.body.data.activity.length).toBeLessThanOrEqual(7);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/activity-chart')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/system/health', () => {
    test('should return system health status', async () => {
      const res = await request(app)
        .get('/api/admin/system/health')
        .set('Cookie', adminCookie);

      // Should return 200 if healthy, 503 if unhealthy
      expect([200, 503]).toContain(res.status);

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('health');
        expect(res.body.data.health).toHaveProperty('database');
        expect(res.body.data.health).toHaveProperty('timestamp');
        expect(res.body.data.health.database).toBe(true);
      } else {
        expect(res.body.success).toBe(false);
      }
    });

    test('should include timestamp in ISO format', async () => {
      const res = await request(app)
        .get('/api/admin/system/health')
        .set('Cookie', adminCookie);

      if (res.status === 200) {
        const timestamp = res.body.data.health.timestamp;
        expect(timestamp).toBeDefined();
        
        // Validate ISO 8601 format
        const date = new Date(timestamp);
        expect(date.toISOString()).toBe(timestamp);
      }
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/system/health')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('Dashboard Performance', () => {
    test('should respond to stats request within 1 second', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Cookie', adminCookie)
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(1000); // < 1 second
    });

    test('should respond to activity chart within 500ms', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/admin/dashboard/activity-chart')
        .set('Cookie', adminCookie)
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(500); // < 500ms
    });
  });

  test.describe('Dashboard Data Consistency', () => {
    test('should have consistent user counts across endpoints', async () => {
      // Get dashboard stats
      const statsRes = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Cookie', adminCookie)
        .expect(200);

      const totalUsers = statsRes.body.data.users.total_users;

      // Get users list
      const usersRes = await request(app)
        .get('/api/admin/users?limit=1000')
        .set('Cookie', adminCookie)
        .expect(200);

      const userCount = usersRes.body.data.pagination.total;

      // Counts should match
      expect(totalUsers).toBe(userCount);
    });

    test('should calculate role distribution correctly', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Cookie', adminCookie)
        .expect(200);

      const roles = res.body.data.roles;
      
      if (roles.length > 0) {
        // Sum of all role user counts should <= total users
        const totalRoleUsers = roles.reduce((sum, role) => sum + parseInt(role.user_count), 0);
        const totalUsers = res.body.data.users.total_users;
        
        // Some users may have multiple roles, so sum can be >= total
        expect(totalRoleUsers).toBeGreaterThanOrEqual(0);
        expect(totalRoleUsers).toBeLessThanOrEqual(totalUsers * 3); // Max 3 roles per user typically
      }
    });
  });
});
