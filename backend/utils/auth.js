/**
 * Authentication Utilities
 * @description JWT authentication and user verification
 * @author KaDong Team
 * @created 2025-11-12
 */

import jwt from 'jsonwebtoken'

/**
 * Middleware to authenticate JWT token
 * Attaches user object to req.user if valid
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    // No token provided - check for user_id in query/body (backward compatibility)
    if (!token) {
      // For backward compatibility, allow user_id in query or body
      const userId = req.query.user_id || req.body.user_id
      if (userId) {
        req.user = { id: userId }
        return next()
      }

      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication token required' }
      })
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
        })
      }

      req.user = user
      next()
    })
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' }
    })
  }
}

/**
 * Middleware to make authentication optional
 * Attaches user if token is valid, otherwise continues without user
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      // Check for user_id in query/body
      const userId = req.query.user_id || req.body.user_id
      if (userId) {
        req.user = { id: userId }
      }
      return next()
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user
      }
      next()
    })
  } catch (error) {
    next()
  }
}
