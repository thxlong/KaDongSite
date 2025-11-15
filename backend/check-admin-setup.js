/**
 * Check admin user and roles setup
 */

import pool from './config/database.js';

async function checkAdminSetup() {
  try {
    console.log('\n🔍 Checking admin user setup...\n');

    // Check admin user
    const userResult = await pool.query(
      `SELECT id, email, name, role, email_verified, created_at
       FROM users 
       WHERE email = 'admin@kadong.com'`
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Admin user NOT found in users table');
      return;
    }

    const adminUser = userResult.rows[0];
    console.log('✅ Admin user found:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role (legacy): ${adminUser.role}`);
    console.log(`   Verified: ${adminUser.email_verified}`);
    console.log('');

    // Check roles table
    const rolesResult = await pool.query(
      `SELECT id, name, description FROM roles ORDER BY name`
    );

    console.log('📋 Available roles:');
    rolesResult.rows.forEach(role => {
      console.log(`   - ${role.name} (${role.id}): ${role.description || 'N/A'}`);
    });
    console.log('');

    // Check user_roles
    const userRolesResult = await pool.query(
      `SELECT ur.user_id, ur.role_id, r.name as role_name
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = $1`,
      [adminUser.id]
    );

    if (userRolesResult.rows.length === 0) {
      console.log('❌ Admin user has NO roles in user_roles table!');
      console.log('');
      console.log('🔧 Fix: Need to assign admin role to user');
      console.log('');
      
      // Try to find admin role
      const adminRoleResult = await pool.query(
        `SELECT id FROM roles WHERE name = 'admin'`
      );
      
      if (adminRoleResult.rows.length > 0) {
        const adminRoleId = adminRoleResult.rows[0].id;
        console.log(`💡 Admin role ID found: ${adminRoleId}`);
        console.log('');
        console.log('Run this SQL to fix:');
        console.log(`INSERT INTO user_roles (user_id, role_id) VALUES ('${adminUser.id}', '${adminRoleId}');`);
      } else {
        console.log('❌ Admin role NOT found in roles table!');
        console.log('');
        console.log('Need to create admin role first:');
        console.log(`INSERT INTO roles (name, description) VALUES ('admin', 'Administrator with full access');`);
      }
    } else {
      console.log('✅ Admin user roles:');
      userRolesResult.rows.forEach(ur => {
        console.log(`   - ${ur.role_name} (${ur.role_id})`);
      });
    }

    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdminSetup();
