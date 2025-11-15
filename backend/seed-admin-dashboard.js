/**
 * Seed Data: Admin Dashboard Test Data
 * Purpose: Create sample data for testing admin dashboard features
 * Date: 2025-11-15
 */

const { query } = require('../config/database')

async function seedAdminDashboard() {
  try {
    console.log('🌱 Seeding admin dashboard test data...')

    // 1. Create test users with different roles
    console.log('Creating test users...')
    
    const testUsers = [
      {
        email: 'moderator@kadong.com',
        name: 'Moderator User',
        password: '$2b$10$YourHashedPasswordHere', // Use bcrypt to hash
        role: 'moderator'
      },
      {
        email: 'user1@kadong.com',
        name: 'Regular User 1',
        password: '$2b$10$YourHashedPasswordHere',
        role: 'user'
      },
      {
        email: 'user2@kadong.com',
        name: 'Regular User 2',
        password: '$2b$10$YourHashedPasswordHere',
        role: 'user'
      },
      {
        email: 'locked@kadong.com',
        name: 'Locked User',
        password: '$2b$10$YourHashedPasswordHere',
        role: 'user',
        locked_at: new Date(),
        lock_reason: 'Account temporarily suspended for security review'
      }
    ]

    for (const user of testUsers) {
      await query(
        `INSERT INTO users (email, name, password_hash, role, email_verified, locked_at, lock_reason, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         ON CONFLICT (email) DO NOTHING`,
        [user.email, user.name, user.password, user.role, true, user.locked_at || null, user.lock_reason || null]
      )
    }

    // 2. Assign roles to users
    console.log('Assigning roles to users...')
    
    const moderatorUser = await query(
      `SELECT id FROM users WHERE email = 'moderator@kadong.com'`
    )
    const moderatorRole = await query(
      `SELECT id FROM roles WHERE name = 'moderator'`
    )
    
    if (moderatorUser.rows.length > 0 && moderatorRole.rows.length > 0) {
      await query(
        `INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
         VALUES ($1, $2, $1, NOW())
         ON CONFLICT (user_id, role_id) DO NOTHING`,
        [moderatorUser.rows[0].id, moderatorRole.rows[0].id]
      )
    }

    // 3. Create sample blocked IPs
    console.log('Creating blocked IPs...')
    
    const adminUser = await query(
      `SELECT id FROM users WHERE email = 'admin@kadong.com'`
    )
    
    if (adminUser.rows.length > 0) {
      const blockedIps = [
        { ip: '192.168.100.50', reason: 'Brute force attack detected', expires: null },
        { ip: '10.0.0.100', reason: 'Suspicious activity', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { ip: '172.16.0.25', reason: 'Multiple failed login attempts', expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) }
      ]

      for (const ip of blockedIps) {
        await query(
          `INSERT INTO blocked_ips (ip_address, reason, blocked_by, expires_at, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (ip_address) DO NOTHING`,
          [ip.ip, ip.reason, adminUser.rows[0].id, ip.expires]
        )
      }
    }

    // 4. Create sample audit logs
    console.log('Creating audit logs...')
    
    if (adminUser.rows.length > 0 && moderatorUser.rows.length > 0) {
      const auditLogs = [
        {
          admin_id: adminUser.rows[0].id,
          action: 'user_created',
          target_type: 'user',
          target_id: moderatorUser.rows[0].id,
          changes: { before: null, after: { email: 'moderator@kadong.com', role: 'moderator' } },
          ip_address: '192.168.1.1'
        },
        {
          admin_id: adminUser.rows[0].id,
          action: 'role_assigned',
          target_type: 'user',
          target_id: moderatorUser.rows[0].id,
          changes: { before: { roles: ['user'] }, after: { roles: ['user', 'moderator'] } },
          ip_address: '192.168.1.1'
        },
        {
          admin_id: adminUser.rows[0].id,
          action: 'ip_blocked',
          target_type: 'ip',
          target_id: null,
          changes: { ip_address: '192.168.100.50', reason: 'Brute force attack detected' },
          ip_address: '192.168.1.1'
        }
      ]

      for (const log of auditLogs) {
        await query(
          `INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, changes, ip_address, user_agent, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '1 hour')`,
          [log.admin_id, log.action, log.target_type, log.target_id, JSON.stringify(log.changes), log.ip_address, 'Mozilla/5.0 (Test Agent)']
        )
      }
    }

    // 5. Create sample security alerts
    console.log('Creating security alerts...')
    
    const securityAlerts = [
      {
        type: 'brute_force',
        severity: 'high',
        message: 'Multiple failed login attempts detected from IP 192.168.100.50',
        metadata: { ip_address: '192.168.100.50', attempts: 15, timeframe: '1 hour' }
      },
      {
        type: 'suspicious_login',
        severity: 'medium',
        message: 'Login from unusual location detected for user user1@kadong.com',
        metadata: { email: 'user1@kadong.com', location: 'Unknown Country', usual_location: 'Vietnam' }
      },
      {
        type: 'multiple_sessions',
        severity: 'low',
        message: 'User has active sessions from multiple devices',
        metadata: { email: 'user2@kadong.com', session_count: 5 }
      }
    ]

    for (const alert of securityAlerts) {
      await query(
        `INSERT INTO security_alerts (type, severity, message, metadata, created_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '2 hours')`,
        [alert.type, alert.severity, alert.message, JSON.stringify(alert.metadata)]
      )
    }

    // 6. Update last_login_at for some users
    console.log('Updating last login timestamps...')
    
    await query(
      `UPDATE users 
       SET last_login_at = NOW() - INTERVAL '2 days'
       WHERE email IN ('user1@kadong.com', 'user2@kadong.com')`
    )

    await query(
      `UPDATE users 
       SET last_login_at = NOW() - INTERVAL '1 hour'
       WHERE email = 'admin@kadong.com'`
    )

    console.log('✅ Admin dashboard test data seeded successfully!')
    console.log('Test accounts created:')
    console.log('  - moderator@kadong.com (Moderator role)')
    console.log('  - user1@kadong.com (Regular user)')
    console.log('  - user2@kadong.com (Regular user)')
    console.log('  - locked@kadong.com (Locked account)')
    console.log('Sample data created:')
    console.log('  - 3 blocked IPs')
    console.log('  - 3 audit log entries')
    console.log('  - 3 security alerts')

  } catch (error) {
    console.error('❌ Error seeding admin dashboard data:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  seedAdminDashboard()
    .then(() => {
      console.log('Seed complete!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Seed failed:', error)
      process.exit(1)
    })
}

module.exports = { seedAdminDashboard }
