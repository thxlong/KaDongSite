/**
 * Admin User API Integration Tests
 * 
 * Tests for:
 * - GET /api/admin/users - List users
 * - GET /api/admin/users/:id - Get user details
 * - POST /api/admin/users - Create user
 * - PUT /api/admin/users/:id - Update user
 * - DELETE /api/admin/users/:id - Delete user
 * - POST /api/admin/users/:id/lock - Lock account
 * - POST /api/admin/users/:id/unlock - Unlock account
 */

import { test, expect } from '@playwright/test';
import request from 'supertest';
import app from '../../src/app.js';
import { getAdminCookie } from './helpers.js';

test.describe('Admin User API', () => {
  let adminCookie;
  let testUserId;
  let createdUserId;

  // Get admin session cookie before each test
  test.beforeEach(async () => {
    adminCookie = await getAdminCookie();
  });

  test.describe('GET /api/admin/users', () => {
    test('should return list of users with pagination', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('users');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.users)).toBe(true);
      expect(res.body.data.pagination).toHaveProperty('page');
      expect(res.body.data.pagination).toHaveProperty('totalPages');
      expect(res.body.data.pagination).toHaveProperty('total');
    });

    test('should filter users by search term', async () => {
      const res = await request(app)
        .get('/api/admin/users?search=admin')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.users.length).toBeGreaterThan(0);
      
      // At least one result should match search term
      const hasMatch = res.body.data.users.some(user =>
        user.email.toLowerCase().includes('admin') ||
        (user.full_name && user.full_name.toLowerCase().includes('admin'))
      );
      expect(hasMatch).toBe(true);
    });

    test('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/admin/users?role=admin')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      if (res.body.data.users.length > 0) {
        const user = res.body.data.users[0];
        expect(user.roles).toBeDefined();
        const hasAdminRole = user.roles.some(role => role.name === 'admin');
        expect(hasAdminRole).toBe(true);
      }
    });

    test('should filter users by status (active)', async () => {
      const res = await request(app)
        .get('/api/admin/users?status=active')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      
      if (res.body.data.users.length > 0) {
        // All users should not be locked
        const allActive = res.body.data.users.every(user => !user.locked_at);
        expect(allActive).toBe(true);
      }
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/users', () => {
    test('should create a new user', async () => {
      const newUser = {
        email: `testuser${Date.now()}@test.com`,
        full_name: 'Test User',
        password: 'Test123!@#',
        role_ids: []
      };

      const res = await request(app)
        .post('/api/admin/users')
        .set('Cookie', adminCookie)
        .send(newUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toBe(newUser.email);
      expect(res.body.data.user.full_name).toBe(newUser.full_name);
      
      // Save for later tests
      createdUserId = res.body.data.user.id;
    });

    test('should return 400 if email already exists', async () => {
      const duplicateUser = {
        email: 'admin@kadong.com',
        full_name: 'Duplicate Admin',
        password: 'Test123!@#'
      };

      const res = await request(app)
        .post('/api/admin/users')
        .set('Cookie', adminCookie)
        .send(duplicateUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Email already exists');
    });

    test('should return 400 if required fields missing', async () => {
      const invalidUser = {
        email: 'incomplete@test.com'
        // Missing full_name and password
      };

      const res = await request(app)
        .post('/api/admin/users')
        .set('Cookie', adminCookie)
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/users/:id', () => {
    test('should return user details', async () => {
      // Use created user ID
      if (!createdUserId) {
        return; // Skip if user wasn't created
      }

      const res = await request(app)
        .get(`/api/admin/users/${createdUserId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('id', createdUserId);
      expect(res.body.data.user).toHaveProperty('email');
      expect(res.body.data.user).toHaveProperty('roles');
      expect(res.body.data.user).toHaveProperty('active_sessions');
    });

    test('should return 404 for non-existent user', async () => {
      const fakeId = '00000000-0000-4000-8000-000000000000';

      const res = await request(app)
        .get(`/api/admin/users/${fakeId}`)
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('User not found');
    });
  });

  test.describe('PUT /api/admin/users/:id', () => {
    test('should update user information', async () => {
      if (!createdUserId) return;

      const updates = {
        full_name: 'Updated Test User'
      };

      const res = await request(app)
        .put(`/api/admin/users/${createdUserId}`)
        .set('Cookie', adminCookie)
        .send(updates)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.full_name).toBe(updates.full_name);
    });

    test('should return 404 for non-existent user', async () => {
      const fakeId = '00000000-0000-4000-8000-000000000000';
      
      const res = await request(app)
        .put(`/api/admin/users/${fakeId}`)
        .set('Cookie', adminCookie)
        .send({ full_name: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/users/:id/lock', () => {
    test('should lock user account', async () => {
      if (!createdUserId) return;

      const res = await request(app)
        .post(`/api/admin/users/${createdUserId}/lock`)
        .set('Cookie', adminCookie)
        .send({ reason: 'Test lock' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.locked_at).toBeTruthy();
      expect(res.body.data.user.lock_reason).toBe('Test lock');
    });

    test('should return 400 if reason is missing', async () => {
      if (!createdUserId) return;

      const res = await request(app)
        .post(`/api/admin/users/${createdUserId}/lock`)
        .set('Cookie', adminCookie)
        .send({})
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Lock reason is required');
    });
  });

  test.describe('POST /api/admin/users/:id/unlock', () => {
    test('should unlock user account', async () => {
      if (!createdUserId) return;

      const res = await request(app)
        .post(`/api/admin/users/${createdUserId}/unlock`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.locked_at).toBeFalsy();
    });
  });

  test.describe('DELETE /api/admin/users/:id', () => {
    test('should soft delete user', async () => {
      if (!createdUserId) return;

      const res = await request(app)
        .delete(`/api/admin/users/${createdUserId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted successfully');

      // Verify user is deleted (should return 404)
      await request(app)
        .get(`/api/admin/users/${createdUserId}`)
        .set('Cookie', adminCookie)
        .expect(404);
    });

    test('should return 404 for non-existent user', async () => {
      const fakeId = '00000000-0000-4000-8000-000000000000';

      const res = await request(app)
        .delete(`/api/admin/users/${fakeId}`)
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/users/:id/sessions', () => {
    test('should return user active sessions', async () => {
      // Get admin user ID from login
      const adminRes = await request(app)
        .get('/api/admin/users?search=admin@kadong.com')
        .set('Cookie', adminCookie);

      if (adminRes.body.data.users.length > 0) {
        const adminUserId = adminRes.body.data.users[0].id;

        const res = await request(app)
          .get(`/api/admin/users/${adminUserId}/sessions`)
          .set('Cookie', adminCookie)
          .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('sessions');
        expect(Array.isArray(res.body.data.sessions)).toBe(true);
      }
    });
  });
});
