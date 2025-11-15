/**
 * Test admin route with detailed logging
 */

import request from 'supertest';
import app from './src/app.js';

async function testAdminRoute() {
  try {
    console.log('\n🧪 Testing admin route with authentication...\n');

    // Step 1: Login
    console.log('📝 Step 1: Login as admin...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@kadong.com',
        password: 'Admin123!@#'
      });

    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Success: ${loginRes.body.success}`);
    console.log(`   User: ${loginRes.body.data?.user?.email}`);
    console.log(`   Token: ${loginRes.body.data?.token ? 'Present' : 'Missing'}`);
    console.log(`   Cookies: ${loginRes.headers['set-cookie'] ? 'Set' : 'Not set'}`);
    
    if (loginRes.status !== 200) {
      console.log('❌ Login failed!');
      return;
    }

    const cookie = loginRes.headers['set-cookie'];
    const token = loginRes.body.data.token;
    console.log(`\n   Cookie value: ${cookie}`);
    console.log(`   Token value: ${token}`);
    console.log('');

    // Step 2: Call admin endpoint with Authorization header
    console.log('📝 Step 2: Call admin endpoint with Bearer token...');
    const adminRes = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    console.log(`   Status: ${adminRes.status}`);
    console.log(`   Body: ${JSON.stringify(adminRes.body, null, 2)}`);
    console.log('');

    if (adminRes.status === 200) {
      console.log('✅ Admin route accessible!');
    } else {
      console.log(`❌ Admin route returned ${adminRes.status}`);
      console.log('   This means auth middleware is not setting req.user');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAdminRoute();
