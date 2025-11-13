/**
 * Role-Based Access Control (RBAC) Middleware
 * Checks user roles for authorization
 */

/**
 * Require specific roles to access a route
 * Must be used AFTER authMiddleware.verifyToken
 * 
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 * 
 * @example
 * router.get('/admin', authMiddleware.verifyToken, requireRole('admin'), handler)
 * router.get('/content', authMiddleware.verifyToken, requireRole('admin', 'user'), handler)
 */
export const requireRole = (...allowedRoles) => {
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

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
        }
      })
    }

    next()
  }
}

/**
 * Require admin role
 * Shorthand for requireRole('admin')
 * 
 * @example
 * router.delete('/users/:id', authMiddleware.verifyToken, requireAdmin, handler)
 */
export const requireAdmin = requireRole('admin')

/**
 * Require user or admin role (blocks guests)
 * Shorthand for requireRole('user', 'admin')
 * 
 * @example
 * router.post('/content', authMiddleware.verifyToken, requireUser, handler)
 */
export const requireUser = requireRole('user', 'admin')

export default {
  requireRole,
  requireAdmin,
  requireUser
}
