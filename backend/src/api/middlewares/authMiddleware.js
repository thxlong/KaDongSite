/**
 * Authentication Middleware
 * Verifies JWT tokens and manages user sessions
 */

import jwt from 'jsonwebtoken'
import { pool } from '#config/database.config.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set. Using default (INSECURE)')
}

/**
 * Verify JWT token and attach user to request
 * Use this middleware for protected routes
 * 
 * @middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const verifyToken = async (req, res, next) => {
  try {
    // Extract token from cookie (preferred) or Authorization header
    let token = req.cookies?.token

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authentication token required'
        }
      })
    }

    // Verify JWT signature and expiry
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'kadong-tools',
        audience: 'kadong-users'
      })
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Authentication token has expired'
          }
        })
      }

      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid authentication token'
        }
      })
    }

    // Check if session exists and is not revoked
    const sessionResult = await pool.query(
      `SELECT id, user_id, expires_at
       FROM sessions
       WHERE token_hash = $1`,
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

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Session has expired. Please login again.'
        }
      })
    }

    // Get user data from database
    const userResult = await pool.query(
      `SELECT id, email, name, role, email_verified, preferences, created_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [session.user_id]
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

    const user = userResult.rows[0]

    // Attach user data to request object
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      email_verified: user.email_verified,
      preferences: user.preferences,
      created_at: user.created_at
    }

    req.token = token
    req.sessionId = session.id

    next()
  } catch (error) {
    console.error('Error in verifyToken middleware:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication error'
      }
    })
  }
}

/**
 * Optional authentication middleware
 * Attaches user to request if valid token is provided
 * Does NOT block request if no token or invalid token
 * 
 * Use this for endpoints that have different behavior for authenticated/guest users
 * 
 * @middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // Extract token from cookie or Authorization header
    let token = req.cookies?.token

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      }
    }

    // No token - continue as guest
    if (!token) {
      req.user = null
      return next()
    }

    // Try to verify token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'kadong-tools',
        audience: 'kadong-users'
      })
    } catch (jwtError) {
      // Invalid or expired token - continue as guest
      req.user = null
      return next()
    }

    // Check session
    const sessionResult = await pool.query(
      `SELECT id, user_id
       FROM sessions
       WHERE token_hash = $1 AND expires_at > NOW()`,
      [token]
    )

    if (sessionResult.rows.length === 0) {
      // Session not found or revoked - continue as guest
      req.user = null
      return next()
    }

    const session = sessionResult.rows[0]

    // Get user data
    const userResult = await pool.query(
      `SELECT id, email, name, role, email_verified, preferences, created_at
       FROM users
       WHERE id = $1 AND deleted_at IS NULL`,
      [session.user_id]
    )

    if (userResult.rows.length === 0) {
      // User not found - continue as guest
      req.user = null
      return next()
    }

    const user = userResult.rows[0]

    // Attach user data
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      email_verified: user.email_verified,
      preferences: user.preferences,
      created_at: user.created_at
    }

    req.token = token
    req.sessionId = session.id

    next()
  } catch (error) {
    console.error('Error in optionalAuth middleware:', error)
    // On error, continue as guest
    req.user = null
    next()
  }
}

export default {
  verifyToken,
  optionalAuth
}
