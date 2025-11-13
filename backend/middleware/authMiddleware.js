/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

const pool = require('../config/database')
const { verifyToken } = require('../utils/tokenUtils')

/**
 * Middleware to verify JWT token from cookie or Authorization header
 * Attaches user data to req.user if token is valid
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */
const verifyTokenMiddleware = async (req, res, next) => {
  try {
    let token = null

    // Try to get token from cookie first (preferred for web)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    }
    
    // Fallback: Check Authorization header (for mobile/API clients)
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authentication required'
        }
      })
    }

    // Verify JWT signature and expiry
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: error.message || 'Invalid or expired token'
        }
      })
    }

    // Check if session is revoked (logged out)
    const sessionResult = await pool.query(
      `SELECT id, user_id, expires_at, revoked_at
       FROM sessions
       WHERE token = $1`,
      [token]
    )

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found'
        }
      })
    }

    const session = sessionResult.rows[0]

    // Check if session is revoked
    if (session.revoked_at) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'SESSION_REVOKED',
          message: 'Session has been revoked'
        }
      })
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Session has expired'
        }
      })
    }

    // Get user from database
    const userResult = await pool.query(
      `SELECT id, email, name, role, email_verified, preferences, created_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [decoded.userId]
    )

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      })
    }

    // Attach user to request
    req.user = userResult.rows[0]
    req.token = token
    req.sessionId = session.id

    next()
  } catch (error) {
    console.error('Error in auth middleware:', error)
    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    })
  }
}

/**
 * Optional auth middleware
 * Attaches user if token is valid, but doesn't block if no token
 * Useful for endpoints that work differently for authenticated vs guest users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization) {
      const authHeader = req.headers.authorization
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    // No token = guest user
    if (!token) {
      req.user = null
      return next()
    }

    // Try to verify token, but don't block if invalid
    try {
      const decoded = verifyToken(token)
      
      const userResult = await pool.query(
        `SELECT id, email, name, role, email_verified, preferences, created_at
         FROM users
         WHERE id = $1 AND deleted_at IS NULL`,
        [decoded.userId]
      )

      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0]
      }
    } catch (error) {
      // Invalid token, treat as guest
      req.user = null
    }

    next()
  } catch (error) {
    // On error, treat as guest
    req.user = null
    next()
  }
}

module.exports = {
  verifyToken: verifyTokenMiddleware,
  optionalAuth
}
