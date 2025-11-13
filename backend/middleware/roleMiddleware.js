/**
 * Role-Based Access Control Middleware
 * Checks if authenticated user has required role(s)
 */

/**
 * Middleware to require specific role(s)
 * Must be used AFTER authMiddleware.verifyToken
 * @param {...string} allowedRoles - Roles that are allowed
 * @returns {Function} - Express middleware
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      })
    }

    // Check if user has one of the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource'
        }
      })
    }

    // User has required role
    next()
  }
}

/**
 * Middleware to require admin role
 * Convenience wrapper for requireRole('admin')
 */
const requireAdmin = requireRole('admin')

/**
 * Middleware to require user or admin role
 * Blocks guest users
 */
const requireUser = requireRole('user', 'admin')

module.exports = {
  requireRole,
  requireAdmin,
  requireUser
}
