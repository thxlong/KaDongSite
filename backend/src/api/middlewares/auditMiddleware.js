/**
 * Audit Logging Middleware
 * 
 * Automatically logs all admin actions to admin_audit_logs table
 * Captures:
 * - Who performed the action (admin_id)
 * - What action was performed
 * - What resource was affected (target_type, target_id)
 * - Before/after state (changes JSONB)
 * - Request metadata (IP, user agent)
 */

import pool from '../../../config/database.js';

/**
 * Middleware to log admin actions
 * @param {string} action - Action name (e.g., 'user.create', 'role.update', 'ip.block')
 * @param {Object} options - Logging options
 * @param {string} options.targetType - Type of target (e.g., 'user', 'role', 'ip')
 * @param {Function} options.getTargetId - Function to extract target ID from req
 * @param {Function} options.getChanges - Function to extract changes from req/res
 */
function logAdminAction(action, options = {}) {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);

    res.json = async function(data) {
      try {
        // Only log if admin is authenticated and action was successful
        if (req.user && req.user.id && res.statusCode >= 200 && res.statusCode < 300) {
          const targetType = options.targetType || null;
          const targetId = options.getTargetId ? options.getTargetId(req, data) : null;
          const changes = options.getChanges ? options.getChanges(req, data) : null;
          
          // Get IP address
          const ipAddress = req.ip || req.connection.remoteAddress;
          
          // Get user agent
          const userAgent = req.get('user-agent') || null;

          // Insert audit log
          await pool.query(
            `INSERT INTO admin_audit_logs 
             (admin_id, action, target_type, target_id, changes, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              req.user.id,
              action,
              targetType,
              targetId,
              changes ? JSON.stringify(changes) : null,
              ipAddress,
              userAgent
            ]
          );

          console.log(`[AUDIT] Admin ${req.user.id} performed ${action} on ${targetType} ${targetId}`);
        }
      } catch (error) {
        console.error('Audit logging error:', error);
        // Don't fail the request if audit logging fails
      }

      return originalJson(data);
    };

    next();
  };
}

/**
 * Helper function to create audit log for user actions
 */
function logUserAction(action) {
  return logAdminAction(action, {
    targetType: 'user',
    getTargetId: (req, data) => req.params.id || data.user?.id,
    getChanges: (req, data) => {
      const changes = {};
      
      // Capture changes from request body
      if (req.body) {
        if (req.body.email) changes.email = req.body.email;
        if (req.body.full_name) changes.full_name = req.body.full_name;
        if (req.body.locked_at !== undefined) changes.locked = !!req.body.locked_at;
        if (req.body.lock_reason) changes.lock_reason = req.body.lock_reason;
      }

      return Object.keys(changes).length > 0 ? changes : null;
    }
  });
}

/**
 * Helper function to create audit log for role actions
 */
function logRoleAction(action) {
  return logAdminAction(action, {
    targetType: 'role',
    getTargetId: (req, data) => req.params.id || data.role?.id,
    getChanges: (req, data) => {
      const changes = {};
      
      if (req.body) {
        if (req.body.name) changes.name = req.body.name;
        if (req.body.description) changes.description = req.body.description;
        if (req.body.permissions) changes.permissions = req.body.permissions;
      }

      return Object.keys(changes).length > 0 ? changes : null;
    }
  });
}

/**
 * Helper function to create audit log for IP blocking actions
 */
function logIPAction(action) {
  return logAdminAction(action, {
    targetType: 'ip',
    getTargetId: (req, data) => req.params.id || data.blocked_ip?.id,
    getChanges: (req, data) => {
      const changes = {};
      
      if (req.body) {
        if (req.body.ip_address) changes.ip_address = req.body.ip_address;
        if (req.body.reason) changes.reason = req.body.reason;
        if (req.body.expires_at) changes.expires_at = req.body.expires_at;
      }

      return Object.keys(changes).length > 0 ? changes : null;
    }
  });
}

/**
 * Helper function to create audit log for role assignment
 */
function logRoleAssignment() {
  return logAdminAction('role.assign', {
    targetType: 'user',
    getTargetId: (req, data) => req.body.user_id || req.params.userId,
    getChanges: (req, data) => ({
      role_id: req.body.role_id || req.params.roleId,
      action: 'assigned'
    })
  });
}

/**
 * Helper function to create audit log for role removal
 */
function logRoleRemoval() {
  return logAdminAction('role.remove', {
    targetType: 'user',
    getTargetId: (req, data) => req.params.userId,
    getChanges: (req, data) => ({
      role_id: req.params.roleId,
      action: 'removed'
    })
  });
}

export {
  logAdminAction,
  logUserAction,
  logRoleAction,
  logIPAction,
  logRoleAssignment,
  logRoleRemoval
};
