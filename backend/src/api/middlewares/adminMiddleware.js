/**
 * Admin Authorization Middleware
 * 
 * Provides middleware functions to:
 * - Verify user has admin or moderator role
 * - Protect admin-only routes
 * - Check specific permissions for actions
 */

import pool from '../../../config/database.js';

/**
 * Middleware to require user has admin role
 * Checks if authenticated user has 'admin' or 'moderator' role
 */
async function requireAdmin(req, res, next) {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userId = req.user.id;

    // Check if user has admin or moderator role (using legacy role column)
    const result = await pool.query(
      `SELECT role FROM users WHERE id = $1 AND role IN ('admin', 'moderator')`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    // Attach role to request (compatible format)
    const role = result.rows[0].role;
    
    // Admin role has all permissions in legacy system
    const allPermissions = role === 'admin' ? [
      'users.view', 'users.create', 'users.edit', 'users.delete', 'users.lock',
      'roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign',
      'security.view_alerts', 'security.review_alerts', 'security.block_ip', 'security.unblock_ip',
      'audit.view', 'audit.export',
      'dashboard.view', 'dashboard.stats'
    ] : [
      'users.view', 'users.lock',
      'security.view_alerts',
      'audit.view',
      'dashboard.view'
    ];
    
    req.adminRoles = [{
      name: role,
      permissions: allPermissions
    }];

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Middleware to check if user has specific permission
 * @param {string} permission - Permission to check (e.g., 'users.create', 'roles.edit')
 */
function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      // requireAdmin should run first
      if (!req.adminRoles) {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }

      // Check if any of user's roles have the required permission
      const hasPermission = req.adminRoles.some(role => 
        role.permissions && role.permissions.includes(permission)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: `Permission denied: ${permission}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}

/**
 * Middleware to prevent self-targeting admin actions
 * Prevents admin from deleting/locking their own account
 */
function preventSelfTarget(req, res, next) {
  try {
    const targetUserId = req.params.id || req.body.user_id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot perform this action on your own account'
      });
    }

    next();
  } catch (error) {
    console.error('Self-target prevention error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Middleware to check if user account is locked
 */
async function checkAccountLocked(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return next();
    }

    const result = await pool.query(
      'SELECT locked_at, lock_reason FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length > 0 && result.rows[0].locked_at) {
      return res.status(403).json({
        success: false,
        error: 'Account is locked',
        reason: result.rows[0].lock_reason
      });
    }

    next();
  } catch (error) {
    console.error('Account lock check error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

export {
  requireAdmin,
  requirePermission,
  preventSelfTarget,
  checkAccountLocked
};
