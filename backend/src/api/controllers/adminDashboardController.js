/**
 * Admin Controller - Dashboard & Audit Logs
 * 
 * Handles:
 * - Dashboard statistics
 * - System overview
 * - Audit logs viewing
 * - Audit log search and filters
 */

import pool from '../../../config/database.js';

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics
 */
async function getDashboardStats(req, res) {
  try {
    // Get user statistics
    const userStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as new_users_7d,
        COUNT(*) FILTER (WHERE locked_at IS NOT NULL) as locked_users,
        COUNT(*) FILTER (WHERE deleted_at IS NOT NULL) as deleted_users
      FROM users
    `);

    // Get role distribution
    const roleDistResult = await pool.query(`
      SELECT 
        r.name,
        COUNT(ur.user_id) as user_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.id, r.name
      ORDER BY user_count DESC
    `);

    // Get security statistics
    const securityStatsResult = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM security_alerts WHERE reviewed_at IS NULL) as unreviewed_alerts,
        (SELECT COUNT(*) FROM security_alerts WHERE severity = 'high') as high_severity_alerts,
        (SELECT COUNT(*) FROM blocked_ips WHERE expires_at IS NULL OR expires_at > NOW()) as active_ip_blocks,
        (SELECT COUNT(*) FROM security_alerts WHERE created_at > NOW() - INTERVAL '24 hours') as alerts_24h
    `);

    // Get session statistics
    const sessionStatsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT user_id) as unique_users
      FROM sessions
      WHERE expires_at > NOW() AND revoked_at IS NULL
    `);

    // Get recent activity (last 7 days)
    const activityResult = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as action_count
      FROM admin_audit_logs
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    // Get top admin actions (last 30 days)
    const topActionsResult = await pool.query(`
      SELECT 
        action,
        COUNT(*) as count
      FROM admin_audit_logs
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY action
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        users: userStatsResult.rows[0],
        roles: roleDistResult.rows,
        security: securityStatsResult.rows[0],
        sessions: sessionStatsResult.rows[0],
        recent_activity: activityResult.rows,
        top_actions: topActionsResult.rows
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
}

/**
 * GET /api/admin/dashboard/activity-chart
 * Get activity data for charts (last 30 days)
 */
async function getActivityChart(req, res) {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        COUNT(*) FILTER (WHERE action LIKE 'user.%') as user_actions,
        COUNT(*) FILTER (WHERE action LIKE 'role.%') as role_actions,
        COUNT(*) FILTER (WHERE action LIKE 'security.%') as security_actions,
        COUNT(*) as total_actions
      FROM admin_audit_logs
      WHERE created_at > NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC`,
      []
    );

    res.json({
      success: true,
      data: { activity: result.rows }
    });
  } catch (error) {
    console.error('Get activity chart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity chart data'
    });
  }
}

/**
 * GET /api/admin/audit-logs
 * Get audit logs with pagination and filters
 */
async function getAuditLogs(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
      admin_id = '',
      action = '',
      target_type = '',
      date_from = '',
      date_to = '',
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (admin_id) {
      whereConditions.push(`al.admin_id = $${paramIndex}`);
      queryParams.push(admin_id);
      paramIndex++;
    }

    if (action) {
      whereConditions.push(`al.action ILIKE $${paramIndex}`);
      queryParams.push(`%${action}%`);
      paramIndex++;
    }

    if (target_type) {
      whereConditions.push(`al.target_type = $${paramIndex}`);
      queryParams.push(target_type);
      paramIndex++;
    }

    if (date_from) {
      whereConditions.push(`al.created_at >= $${paramIndex}`);
      queryParams.push(date_from);
      paramIndex++;
    }

    if (date_to) {
      whereConditions.push(`al.created_at <= $${paramIndex}`);
      queryParams.push(date_to);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Valid sort columns
    const validSortColumns = ['created_at', 'action', 'target_type', 'admin_id'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM admin_audit_logs al ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalLogs = parseInt(countResult.rows[0].count);

    // Get audit logs
    const logsQuery = `
      SELECT 
        al.id,
        al.admin_id,
        al.action,
        al.target_type,
        al.target_id,
        al.changes,
        al.ip_address,
        al.user_agent,
        al.created_at,
        u.email as admin_email,
        u.full_name as admin_name
      FROM admin_audit_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      ${whereClause}
      ORDER BY al.${sortColumn} ${sortDirection}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const logsResult = await pool.query(logsQuery, queryParams);

    res.json({
      success: true,
      data: {
        logs: logsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalLogs,
          totalPages: Math.ceil(totalLogs / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit logs'
    });
  }
}

/**
 * GET /api/admin/audit-logs/:id
 * Get single audit log with detailed information
 */
async function getAuditLog(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        al.id,
        al.admin_id,
        al.action,
        al.target_type,
        al.target_id,
        al.changes,
        al.ip_address,
        al.user_agent,
        al.created_at,
        u.email as admin_email,
        u.full_name as admin_name
      FROM admin_audit_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      WHERE al.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Audit log not found'
      });
    }

    res.json({
      success: true,
      data: { log: result.rows[0] }
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit log'
    });
  }
}

/**
 * GET /api/admin/audit-logs/user/:userId
 * Get audit logs for specific user
 */
async function getUserAuditLogs(req, res) {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM admin_audit_logs WHERE target_type = $1 AND target_id = $2',
      ['user', userId]
    );
    const totalLogs = parseInt(countResult.rows[0].count);

    // Get logs
    const logsResult = await pool.query(
      `SELECT 
        al.id,
        al.admin_id,
        al.action,
        al.changes,
        al.ip_address,
        al.created_at,
        u.email as admin_email,
        u.full_name as admin_name
      FROM admin_audit_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      WHERE al.target_type = $1 AND al.target_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3 OFFSET $4`,
      ['user', userId, limit, offset]
    );

    res.json({
      success: true,
      data: {
        logs: logsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalLogs,
          totalPages: Math.ceil(totalLogs / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user audit logs'
    });
  }
}

/**
 * GET /api/admin/audit-logs/export
 * Export audit logs as CSV
 */
async function exportAuditLogs(req, res) {
  try {
    const {
      action = '',
      target_type = '',
      date_from = '',
      date_to = ''
    } = req.query;

    // Build WHERE clause (same as getAuditLogs)
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (action) {
      whereConditions.push(`al.action ILIKE $${paramIndex}`);
      queryParams.push(`%${action}%`);
      paramIndex++;
    }

    if (target_type) {
      whereConditions.push(`al.target_type = $${paramIndex}`);
      queryParams.push(target_type);
      paramIndex++;
    }

    if (date_from) {
      whereConditions.push(`al.created_at >= $${paramIndex}`);
      queryParams.push(date_from);
      paramIndex++;
    }

    if (date_to) {
      whereConditions.push(`al.created_at <= $${paramIndex}`);
      queryParams.push(date_to);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get all matching logs (limit to 10,000 for safety)
    const logsResult = await pool.query(
      `SELECT 
        al.id,
        al.admin_id,
        u.email as admin_email,
        al.action,
        al.target_type,
        al.target_id,
        al.changes,
        al.ip_address,
        al.created_at
      FROM admin_audit_logs al
      LEFT JOIN users u ON al.admin_id = u.id
      ${whereClause}
      ORDER BY al.created_at DESC
      LIMIT 10000`,
      queryParams
    );

    // Convert to CSV
    const csvHeaders = 'ID,Admin Email,Action,Target Type,Target ID,Changes,IP Address,Created At\n';
    const csvRows = logsResult.rows.map(log => {
      return [
        log.id,
        log.admin_email || 'N/A',
        log.action,
        log.target_type || '',
        log.target_id || '',
        JSON.stringify(log.changes || {}),
        log.ip_address || '',
        log.created_at
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    }).join('\n');

    const csv = csvHeaders + csvRows;

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit logs'
    });
  }
}

/**
 * GET /api/admin/system/health
 * Get system health status
 */
async function getSystemHealth(req, res) {
  try {
    const healthChecks = {
      database: false,
      timestamp: new Date().toISOString()
    };

    // Check database connection
    try {
      await pool.query('SELECT 1');
      healthChecks.database = true;
    } catch (error) {
      console.error('Database health check failed:', error);
    }

    const isHealthy = healthChecks.database;

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: { health: healthChecks }
    });
  } catch (error) {
    console.error('System health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check system health'
    });
  }
}

export {
  getDashboardStats,
  getActivityChart,
  getAuditLogs,
  getAuditLog,
  getUserAuditLogs,
  exportAuditLogs,
  getSystemHealth
};
