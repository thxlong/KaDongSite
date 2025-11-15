/**
 * Admin Role Management API Integration Tests
 * 
 * Tests for:
 * - GET /api/admin/roles - List roles
 * - GET /api/admin/roles/:id - Get role details
 * - POST /api/admin/roles - Create role
 * - PUT /api/admin/roles/:id - Update role
 * - DELETE /api/admin/roles/:id - Delete role
 * - POST /api/admin/users/:userId/roles/:roleId - Assign role to user
 * - DELETE /api/admin/users/:userId/roles/:roleId - Remove role from user
 * - GET /api/admin/permissions - List permissions
 */

import { test, expect } from '@playwright/test';
import request from 'supertest';
import app from '../../src/app.js';

test.describe('Admin Role Management API', () => {
  let adminCookie;
  let testRoleId;
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

    // Get a test user (not admin)
    const usersRes = await request(app)
      .get('/api/admin/users?limit=5')
      .set('Cookie', adminCookie);

    if (usersRes.status === 200 && usersRes.body.data.users.length > 0) {
      // Find a non-admin user
      const user = usersRes.body.data.users.find(u => u.email !== 'admin@kadong.com');
      if (user) {
        testUserId = user.id;
      }
    }
  });

  test.describe('GET /api/admin/roles', () => {
    test('should list all roles', async () => {
      const res = await request(app)
        .get('/api/admin/roles')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('roles');
      expect(Array.isArray(res.body.data.roles)).toBe(true);
      
      // Should have at least admin and user roles from seed
      expect(res.body.data.roles.length).toBeGreaterThanOrEqual(2);
      
      // Validate role structure
      const role = res.body.data.roles[0];
      expect(role).toHaveProperty('id');
      expect(role).toHaveProperty('name');
      expect(role).toHaveProperty('description');
      expect(role).toHaveProperty('permissions');
      expect(role).toHaveProperty('is_system');
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/roles')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/permissions', () => {
    test('should list all available permissions', async () => {
      const res = await request(app)
        .get('/api/admin/permissions')
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('permissions');
      expect(Array.isArray(res.body.data.permissions)).toBe(true);
      
      // Should have permissions from seed data
      expect(res.body.data.permissions.length).toBeGreaterThan(0);
      
      // Validate permission structure
      const permission = res.body.data.permissions[0];
      expect(permission).toHaveProperty('id');
      expect(permission).toHaveProperty('name');
      expect(permission).toHaveProperty('description');
      expect(permission).toHaveProperty('category');
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/permissions')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/roles', () => {
    test('should create a new role', async () => {
      const newRole = {
        name: 'Test Role',
        description: 'A role for testing purposes',
        permissions: ['users.view', 'users.edit']
      };

      const res = await request(app)
        .post('/api/admin/roles')
        .set('Cookie', adminCookie)
        .send(newRole)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('role');
      expect(res.body.data.role).toHaveProperty('id');
      expect(res.body.data.role.name).toBe(newRole.name);
      expect(res.body.data.role.description).toBe(newRole.description);
      expect(res.body.data.role.is_system).toBe(false);

      // Save role ID for later tests
      testRoleId = res.body.data.role.id;
    });

    test('should reject duplicate role names', async () => {
      const duplicateRole = {
        name: 'Admin',
        description: 'Duplicate admin role',
        permissions: ['users.view']
      };

      const res = await request(app)
        .post('/api/admin/roles')
        .set('Cookie', adminCookie)
        .send(duplicateRole)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });

    test('should validate required fields', async () => {
      const invalidRole = {
        description: 'Missing name field'
      };

      const res = await request(app)
        .post('/api/admin/roles')
        .set('Cookie', adminCookie)
        .send(invalidRole)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/admin/roles')
        .send({ name: 'Test', permissions: [] })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('GET /api/admin/roles/:id', () => {
    test('should get role details', async () => {
      if (!testRoleId) {
        // Get first role
        const rolesRes = await request(app)
          .get('/api/admin/roles')
          .set('Cookie', adminCookie);
        testRoleId = rolesRes.body.data.roles[0].id;
      }

      const res = await request(app)
        .get(`/api/admin/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('role');
      expect(res.body.data.role.id).toBe(testRoleId);
      expect(res.body.data.role).toHaveProperty('name');
      expect(res.body.data.role).toHaveProperty('description');
      expect(res.body.data.role).toHaveProperty('permissions');
      expect(res.body.data.role).toHaveProperty('user_count');
    });

    test('should return 404 for non-existent role', async () => {
      const res = await request(app)
        .get('/api/admin/roles/99999')
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .get('/api/admin/roles/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('PUT /api/admin/roles/:id', () => {
    test('should update role details', async () => {
      if (!testRoleId) return;

      const updates = {
        description: 'Updated test role description',
        permissions: ['users.view', 'users.edit', 'users.delete']
      };

      const res = await request(app)
        .put(`/api/admin/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .send(updates)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('role');
      expect(res.body.data.role.description).toBe(updates.description);
    });

    test('should prevent updating system roles', async () => {
      // Get admin role (system role)
      const rolesRes = await request(app)
        .get('/api/admin/roles')
        .set('Cookie', adminCookie);

      const adminRole = rolesRes.body.data.roles.find(r => r.name === 'Admin' && r.is_system);
      
      if (adminRole) {
        const res = await request(app)
          .put(`/api/admin/roles/${adminRole.id}`)
          .set('Cookie', adminCookie)
          .send({ description: 'Try to update system role' })
          .expect(403);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('system role');
      }
    });

    test('should return 404 for non-existent role', async () => {
      const res = await request(app)
        .put('/api/admin/roles/99999')
        .set('Cookie', adminCookie)
        .send({ description: 'Test' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .put('/api/admin/roles/1')
        .send({ description: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('POST /api/admin/users/:userId/roles/:roleId', () => {
    test('should assign role to user', async () => {
      if (!testUserId || !testRoleId) return;

      const res = await request(app)
        .post(`/api/admin/users/${testUserId}/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('assigned');
    });

    test('should handle duplicate role assignment gracefully', async () => {
      if (!testUserId || !testRoleId) return;

      // Try to assign same role again
      const res = await request(app)
        .post(`/api/admin/users/${testUserId}/roles/${testRoleId}`)
        .set('Cookie', adminCookie);

      // Should either succeed (idempotent) or return 400
      expect([200, 400]).toContain(res.status);
    });

    test('should return 404 for non-existent user', async () => {
      if (!testRoleId) return;

      const res = await request(app)
        .post(`/api/admin/users/99999/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 404 for non-existent role', async () => {
      if (!testUserId) return;

      const res = await request(app)
        .post(`/api/admin/users/${testUserId}/roles/99999`)
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .post('/api/admin/users/1/roles/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('DELETE /api/admin/users/:userId/roles/:roleId', () => {
    test('should remove role from user', async () => {
      if (!testUserId || !testRoleId) return;

      const res = await request(app)
        .delete(`/api/admin/users/${testUserId}/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('removed');
    });

    test('should return 404 for non-existent user', async () => {
      if (!testRoleId) return;

      const res = await request(app)
        .delete(`/api/admin/users/99999/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .delete('/api/admin/users/1/roles/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  test.describe('DELETE /api/admin/roles/:id', () => {
    test('should prevent deleting system roles', async () => {
      // Get admin role (system role)
      const rolesRes = await request(app)
        .get('/api/admin/roles')
        .set('Cookie', adminCookie);

      const adminRole = rolesRes.body.data.roles.find(r => r.name === 'Admin' && r.is_system);
      
      if (adminRole) {
        const res = await request(app)
          .delete(`/api/admin/roles/${adminRole.id}`)
          .set('Cookie', adminCookie)
          .expect(403);

        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('system role');
      }
    });

    test('should delete non-system role', async () => {
      if (!testRoleId) return;

      const res = await request(app)
        .delete(`/api/admin/roles/${testRoleId}`)
        .set('Cookie', adminCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('deleted');
    });

    test('should return 404 for non-existent role', async () => {
      const res = await request(app)
        .delete('/api/admin/roles/99999')
        .set('Cookie', adminCookie)
        .expect(404);

      expect(res.body.success).toBe(false);
    });

    test('should return 401 without authentication', async () => {
      const res = await request(app)
        .delete('/api/admin/roles/1')
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });
});
