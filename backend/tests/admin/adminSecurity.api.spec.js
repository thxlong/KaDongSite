/**
 * Admin Security Management API Integration Tests
 * 
 * Tests for:
 * - GET /api/admin/security/alerts - List security alerts
 * - GET /api/admin/security/alerts/stats - Alert statistics
 * - POST /api/admin/security/alerts/:id/review - Review alert
 * - POST /api/admin/security/alerts/review-all - Bulk review
 * - GET /api/admin/security/blocked-ips - List blocked IPs
 * - POST /api/admin/security/blocked-ips - Block IP
 * - PUT /api/admin/security/blocked-ips/:id - Update block
 * - DELETE /api/admin/security/blocked-ips/:id - Unblock IP
 */

import { test, expect } from '@playwright/test';
import request from 'supertest';
import app from '../../src/app.js';

test.describe('Admin Security Management API', () => {
  let adminCookie;
  let testAlertId;
  let testBlockId;

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

  test.describe('GET /api/admin/security/alerts', () => {
    test('should list security alerts', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('alerts');
      expect(Array.isArray(res.body.data.alerts)).toBe(true);
      expect(res.body.data).toHaveProperty('pagination');

      // Validate pagination
      expect(res.body.data.pagination).toHaveProperty('page');
      expect(res.body.data.pagination).toHaveProperty('limit');
      expect(res.body.data.pagination).toHaveProperty('total');
      expect(res.body.data.pagination).toHaveProperty('total_pages');

      // Validate alert structure if any exist
      if (res.body.data.alerts.length > 0) {
        const alert = res.body.data.alerts[0];
        expect(alert).toHaveProperty('id');
        expect(alert).toHaveProperty('alert_type');
        expect(alert).toHaveProperty('severity');
        expect(alert).toHaveProperty('ip_address');
        expect(alert).toHaveProperty('details');
        expect(alert).toHaveProperty('is_reviewed');
        expect(alert).toHaveProperty('created_at');

        testAlertId = alert.id;
      }
    });

    test('should filter by severity', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts?severity=high')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All returned alerts should have high severity
      res.body.data.alerts.forEach(alert => {
        expect(alert.severity).toBe('high');
      });
    });

    test('should filter by review status', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts?is_reviewed=false')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All returned alerts should be unreviewed
      res.body.data.alerts.forEach(alert => {
        expect(alert.is_reviewed).toBe(false);
      });
    });

    test('should filter by date range', async () => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      const res = await request(app)
        .get(`/api/admin/security/alerts?start_date=${lastWeek.toISOString()}&end_date=${today.toISOString()}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All alerts should be within date range
      res.body.data.alerts.forEach(alert => {
        const alertDate = new Date(alert.created_at);
        expect(alertDate.getTime()).toBeGreaterThanOrEqual(lastWeek.getTime());
        expect(alertDate.getTime()).toBeLessThanOrEqual(today.getTime());
      });
    });

    test('should support pagination', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts?page=1&limit=5')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(5);
      expect(res.body.data.alerts.length).toBeLessThanOrEqual(5);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/security/alerts/stats', () => {
    test('should return alert statistics', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts/stats')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('stats');
      
      const stats = res.body.data.stats;
      expect(stats).toHaveProperty('total_alerts');
      expect(stats).toHaveProperty('unreviewed_count');
      expect(stats).toHaveProperty('high_severity_count');
      expect(stats).toHaveProperty('alerts_by_type');
      expect(stats).toHaveProperty('alerts_by_severity');

      // Validate numeric values
      expect(typeof stats.total_alerts).toBe('number');
      expect(typeof stats.unreviewed_count).toBe('number');
      expect(typeof stats.high_severity_count).toBe('number');

      // Validate arrays
      expect(Array.isArray(stats.alerts_by_type)).toBe(true);
      expect(Array.isArray(stats.alerts_by_severity)).toBe(true);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/security/alerts/stats')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/security/alerts/:id/review', () => {
    test('should mark alert as reviewed', async () => {
      if (!testAlertId) {
        // Get an unreviewed alert
        const alertsRes = await request(app)
          .get('/api/admin/security/alerts?is_reviewed=false&limit=1')
          .set('Cookie', adminCookie);
        
        if (alertsRes.body.data.alerts.length > 0) {
          testAlertId = alertsRes.body.data.alerts[0].id;
        } else {
          return; // Skip if no alerts
        }
      }

      const res = await request(app)
        .post(`/api/admin/security/alerts/${testAlertId}/review`)
        .set('Cookie', adminCookie)
        .send({ notes: 'Reviewed by test' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('reviewed');
    });

    test('should handle already reviewed alert', async () => {
      if (!testAlertId) return;

      // Try to review same alert again
      const res = await request(app)
        .post(`/api/admin/security/alerts/${testAlertId}/review`)
        .set('Cookie', adminCookie)
        .send({ notes: 'Review again' });

      // Should either succeed (idempotent) or return appropriate status
      expect([200, 400]).toContain(res.status);
    });

    test('should return 404 for non-existent alert', async () => {
      const res = await request(app)
        .post('/api/admin/security/alerts/99999/review')
        .set('Cookie', adminCookie)
        .send({ notes: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/admin/security/alerts/1/review')
        .send({ notes: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/security/alerts/review-all', () => {
    test('should bulk review alerts by type', async () => {
      const res = await request(app)
        .post('/api/admin/security/alerts/review-all')
        .set('Cookie', adminCookie)
        .send({ 
          alert_type: 'failed_login',
          notes: 'Bulk review test' 
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('reviewed_count');
      expect(typeof res.body.data.reviewed_count).toBe('number');
    });

    test('should bulk review alerts by severity', async () => {
      const res = await request(app)
        .post('/api/admin/security/alerts/review-all')
        .set('Cookie', adminCookie)
        .send({ 
          severity: 'low',
          notes: 'Bulk review low severity' 
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('reviewed_count');
    });

    test('should validate required filters', async () => {
      const res = await request(app)
        .post('/api/admin/security/alerts/review-all')
        .set('Cookie', adminCookie)
        .send({ notes: 'No filters' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/admin/security/alerts/review-all')
        .send({ alert_type: 'test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/security/blocked-ips', () => {
    test('should list blocked IPs', async () => {
      const res = await request(app)
        .get('/api/admin/security/blocked-ips')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('blocks');
      expect(Array.isArray(res.body.data.blocks)).toBe(true);
      expect(res.body.data).toHaveProperty('pagination');

      // Validate block structure if any exist
      if (res.body.data.blocks.length > 0) {
        const block = res.body.data.blocks[0];
        expect(block).toHaveProperty('id');
        expect(block).toHaveProperty('ip_address');
        expect(block).toHaveProperty('reason');
        expect(block).toHaveProperty('is_active');
        expect(block).toHaveProperty('expires_at');
        expect(block).toHaveProperty('created_at');

        testBlockId = block.id;
      }
    });

    test('should filter by active status', async () => {
      const res = await request(app)
        .get('/api/admin/security/blocked-ips?is_active=true')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      // All returned blocks should be active
      res.body.data.blocks.forEach(block => {
        expect(block.is_active).toBe(true);
      });
    });

    test('should support pagination', async () => {
      const res = await request(app)
        .get('/api/admin/security/blocked-ips?page=1&limit=10')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(10);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/security/blocked-ips')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/security/blocked-ips', () => {
    test('should block an IP address', async () => {
      const blockData = {
        ip_address: '192.168.100.50',
        reason: 'Test block',
        duration: 3600 // 1 hour
      };

      const res = await request(app)
        .post('/api/admin/security/blocked-ips')
        .set('Cookie', adminCookie)
        .send(blockData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('block');
      expect(res.body.data.block.ip_address).toBe(blockData.ip_address);
      expect(res.body.data.block.reason).toBe(blockData.reason);
      expect(res.body.data.block.is_active).toBe(true);

      testBlockId = res.body.data.block.id;
    });

    test('should validate IP address format', async () => {
      const blockData = {
        ip_address: 'invalid-ip',
        reason: 'Test',
        duration: 3600
      };

      const res = await request(app)
        .post('/api/admin/security/blocked-ips')
        .set('Cookie', adminCookie)
        .send(blockData)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('IP');
    });

    test('should validate required fields', async () => {
      const blockData = {
        reason: 'Missing IP'
      };

      const res = await request(app)
        .post('/api/admin/security/blocked-ips')
        .set('Cookie', adminCookie)
        .send(blockData)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/admin/security/blocked-ips')
        .send({ ip_address: '1.2.3.4', reason: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('PUT /api/admin/security/blocked-ips/:id', () => {
    test('should update block details', async () => {
      if (!testBlockId) return;

      const updates = {
        reason: 'Updated test block reason',
        duration: 7200 // 2 hours
      };

      const res = await request(app)
        .put(`/api/admin/security/blocked-ips/${testBlockId}`)
        .set('Cookie', adminCookie)
        .send(updates)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('block');
      expect(res.body.data.block.reason).toBe(updates.reason);
    });

    test('should return 404 for non-existent block', async () => {
      const res = await request(app)
        .put('/api/admin/security/blocked-ips/99999')
        .set('Cookie', adminCookie)
        .send({ reason: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .put('/api/admin/security/blocked-ips/1')
        .send({ reason: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('DELETE /api/admin/security/blocked-ips/:id', () => {
    test('should unblock an IP address', async () => {
      if (!testBlockId) return;

      const res = await request(app)
        .delete(`/api/admin/security/blocked-ips/${testBlockId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('unblocked');
    });

    test('should return 404 for non-existent block', async () => {
      const res = await request(app)
        .delete('/api/admin/security/blocked-ips/99999')
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .delete('/api/admin/security/blocked-ips/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('Security Validation', () => {
    test('should prevent blocking localhost', async () => {
      const blockData = {
        ip_address: '127.0.0.1',
        reason: 'Try to block localhost',
        duration: 3600
      };

      const res = await request(app)
        .post('/api/admin/security/blocked-ips')
        .set('Cookie', adminCookie)
        .send(blockData);

      // Should reject localhost blocking
      expect([400, 403]).toContain(res.status);
    });

    test('should prevent blocking private IPs (optional based on policy)', async () => {
      const blockData = {
        ip_address: '10.0.0.1',
        reason: 'Private IP test',
        duration: 3600
      };

      const res = await request(app)
        .post('/api/admin/security/blocked-ips')
        .set('Cookie', adminCookie)
        .send(blockData);

      // May succeed or fail depending on policy
      expect([200, 201, 400, 403]).toContain(res.status);
    });
  });
});
