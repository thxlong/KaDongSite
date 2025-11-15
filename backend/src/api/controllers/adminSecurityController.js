/**
 * Admin Controller - Security Management
 * 
 * Handles all admin operations for security management:
 * - View security alerts
 * - Review and resolve alerts
 * - Block/unblock IP addresses
 * - Manage blocked IPs
 */

import pool from '../../../config/database.js';

/**
 * GET /api/admin/security/alerts
 * Get security alerts with pagination
 */
async function getAlerts(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      type = '',
      severity = '',
      reviewed = '' // 'true', 'false', 'all'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    if (type) {
      whereConditions.push(`type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    if (severity) {
      whereConditions.push(`severity = $${paramIndex}`);
      queryParams.push(severity);
      paramIndex++;
    }

    if (reviewed === 'true') {
      whereConditions.push('reviewed_at IS NOT NULL');
    } else if (reviewed === 'false') {
      whereConditions.push('reviewed_at IS NULL');
    }

    const whereClause = whereConditions.length > 0 
      ? 'WHERE ' + whereConditions.join(' AND ')
      : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM security_alerts ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalAlerts = parseInt(countResult.rows[0].count);

    // Get alerts
    const alertsQuery = `
      SELECT 
        sa.id,
        sa.type,
        sa.severity,
        sa.message,
        sa.metadata,
        sa.reviewed_by,
        sa.reviewed_at,
        sa.created_at,
        u.email as reviewed_by_email,
        u.full_name as reviewed_by_name
      FROM security_alerts sa
      LEFT JOIN users u ON sa.reviewed_by = u.id
      ${whereClause}
      ORDER BY 
        CASE WHEN sa.reviewed_at IS NULL THEN 0 ELSE 1 END,
        CASE sa.severity
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
        END,
        sa.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const alertsResult = await pool.query(alertsQuery, queryParams);

    res.json({
      success: true,
      data: {
        alerts: alertsResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalAlerts,
          totalPages: Math.ceil(totalAlerts / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch security alerts'
    });
  }
}

/**
 * GET /api/admin/security/alerts/stats
 * Get alert statistics
 */
async function getAlertStats(req, res) {
  try {
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE reviewed_at IS NULL) as unreviewed,
        COUNT(*) FILTER (WHERE severity = 'high') as high_severity,
        COUNT(*) FILTER (WHERE severity = 'medium') as medium_severity,
        COUNT(*) FILTER (WHERE severity = 'low') as low_severity,
        COUNT(*) FILTER (WHERE type = 'brute_force') as brute_force,
        COUNT(*) FILTER (WHERE type = 'suspicious_login') as suspicious_login,
        COUNT(*) FILTER (WHERE type = 'multiple_sessions') as multiple_sessions
      FROM security_alerts
    `);

    res.json({
      success: true,
      data: { stats: statsResult.rows[0] }
    });
  } catch (error) {
    console.error('Get alert stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert statistics'
    });
  }
}

/**
 * POST /api/admin/security/alerts/:id/review
 * Mark alert as reviewed
 */
async function reviewAlert(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE security_alerts 
       SET reviewed_by = $1, reviewed_at = NOW()
       WHERE id = $2 AND reviewed_at IS NULL
       RETURNING id, type, severity, message, reviewed_at`,
      [req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found or already reviewed'
      });
    }

    res.json({
      success: true,
      data: { alert: result.rows[0] },
      message: 'Alert marked as reviewed'
    });
  } catch (error) {
    console.error('Review alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to review alert'
    });
  }
}

/**
 * POST /api/admin/security/alerts/review-all
 * Mark all unreviewed alerts as reviewed
 */
async function reviewAllAlerts(req, res) {
  try {
    const result = await pool.query(
      `UPDATE security_alerts 
       SET reviewed_by = $1, reviewed_at = NOW()
       WHERE reviewed_at IS NULL
       RETURNING id`,
      [req.user.id]
    );

    res.json({
      success: true,
      message: `${result.rows.length} alerts marked as reviewed`
    });
  } catch (error) {
    console.error('Review all alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to review alerts'
    });
  }
}

/**
 * GET /api/admin/security/blocked-ips
 * Get blocked IPs with pagination
 */
async function getBlockedIPs(req, res) {
  try {
    const {
      page = 1,
      limit = 20,
      active = 'true' // 'true', 'false', 'all'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = '';
    if (active === 'true') {
      whereClause = 'WHERE (expires_at IS NULL OR expires_at > NOW())';
    } else if (active === 'false') {
      whereClause = 'WHERE expires_at IS NOT NULL AND expires_at <= NOW()';
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM blocked_ips ${whereClause}`;
    const countResult = await pool.query(countQuery);
    const totalBlocked = parseInt(countResult.rows[0].count);

    // Get blocked IPs
    const blockedQuery = `
      SELECT 
        bi.id,
        bi.ip_address,
        bi.reason,
        bi.blocked_by,
        bi.expires_at,
        bi.created_at,
        u.email as blocked_by_email,
        u.full_name as blocked_by_name
      FROM blocked_ips bi
      LEFT JOIN users u ON bi.blocked_by = u.id
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN bi.expires_at IS NULL THEN 0 
          WHEN bi.expires_at > NOW() THEN 1 
          ELSE 2 
        END,
        bi.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const blockedResult = await pool.query(blockedQuery, [limit, offset]);

    res.json({
      success: true,
      data: {
        blocked_ips: blockedResult.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalBlocked,
          totalPages: Math.ceil(totalBlocked / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get blocked IPs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blocked IPs'
    });
  }
}

/**
 * POST /api/admin/security/blocked-ips
 * Block an IP address
 */
async function blockIP(req, res) {
  try {
    const { ip_address, reason, expires_at } = req.body;

    // Validate required fields
    if (!ip_address || !reason) {
      return res.status(400).json({
        success: false,
        error: 'IP address and reason are required'
      });
    }

    // Check if IP is already blocked
    const existingBlock = await pool.query(
      `SELECT id FROM blocked_ips 
       WHERE ip_address = $1 
       AND (expires_at IS NULL OR expires_at > NOW())`,
      [ip_address]
    );

    if (existingBlock.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'IP address is already blocked'
      });
    }

    const result = await pool.query(
      `INSERT INTO blocked_ips (ip_address, reason, blocked_by, expires_at)
       VALUES ($1, $2, $3, $4)
       RETURNING id, ip_address, reason, expires_at, created_at`,
      [ip_address, reason, req.user.id, expires_at || null]
    );

    res.status(201).json({
      success: true,
      data: { blocked_ip: result.rows[0] },
      message: 'IP address blocked successfully'
    });
  } catch (error) {
    console.error('Block IP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to block IP address'
    });
  }
}

/**
 * DELETE /api/admin/security/blocked-ips/:id
 * Unblock an IP address
 */
async function unblockIP(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM blocked_ips WHERE id = $1 RETURNING ip_address',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Blocked IP not found'
      });
    }

    res.json({
      success: true,
      message: `IP ${result.rows[0].ip_address} unblocked successfully`
    });
  } catch (error) {
    console.error('Unblock IP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unblock IP address'
    });
  }
}

/**
 * PUT /api/admin/security/blocked-ips/:id
 * Update blocked IP expiry or reason
 */
async function updateBlockedIP(req, res) {
  try {
    const { id } = req.params;
    const { reason, expires_at } = req.body;

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (reason) {
      updates.push(`reason = $${paramIndex}`);
      values.push(reason);
      paramIndex++;
    }

    if (expires_at !== undefined) {
      updates.push(`expires_at = $${paramIndex}`);
      values.push(expires_at);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE blocked_ips 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, ip_address, reason, expires_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Blocked IP not found'
      });
    }

    res.json({
      success: true,
      data: { blocked_ip: result.rows[0] },
      message: 'Blocked IP updated successfully'
    });
  } catch (error) {
    console.error('Update blocked IP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update blocked IP'
    });
  }
}

/**
 * POST /api/admin/security/cleanup-expired
 * Clean up expired IP blocks
 */
async function cleanupExpiredBlocks(req, res) {
  try {
    const result = await pool.query(
      `DELETE FROM blocked_ips 
       WHERE expires_at IS NOT NULL AND expires_at <= NOW()
       RETURNING ip_address`
    );

    res.json({
      success: true,
      message: `${result.rows.length} expired IP blocks cleaned up`
    });
  } catch (error) {
    console.error('Cleanup expired blocks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup expired blocks'
    });
  }
}

export {
  getAlerts,
  getAlertStats,
  reviewAlert,
  reviewAllAlerts,
  getBlockedIPs,
  blockIP,
  unblockIP,
  updateBlockedIP,
  cleanupExpiredBlocks
};
