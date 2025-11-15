/**
 * Admin Test Helpers
 * Utilities for admin API testing
 */

import request from 'supertest';
import app from '../../src/app.js';

/**
 * Login as admin and get session cookie
 * @returns {Promise<string>} Admin cookie string
 */
export async function getAdminCookie() {
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@kadong.com',
      password: 'Admin123!@#'
    });

  if (loginRes.status === 200 && loginRes.headers['set-cookie']) {
    return loginRes.headers['set-cookie'];
  }

  throw new Error(`Admin login failed with status ${loginRes.status}`);
}

/**
 * Create a test user
 * @param {string} adminCookie - Admin session cookie
 * @returns {Promise<Object>} Created user object
 */
export async function createTestUser(adminCookie) {
  const newUser = {
    email: `testuser${Date.now()}@test.com`,
    full_name: 'Test User',
    password: 'Test123!@#',
    role_ids: []
  };

  const res = await request(app)
    .post('/api/admin/users')
    .set('Cookie', adminCookie)
    .send(newUser);

  if (res.status === 201) {
    return res.body.data.user;
  }

  throw new Error(`Failed to create test user: ${res.body.error}`);
}
