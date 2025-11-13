/**
 * Authentication Controller
 * Handles user registration, login, logout, and session management
 */

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '#config/database.config.js'
import fs from 'fs'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'
const JWT_REMEMBER_ME_EXPIRES_IN = '30d'

// Error logging function
const logError = (context, error) => {
  const message = `[${new Date().toISOString()}] ${context}: ${error.message}\n${error.stack}\n\n`
  fs.appendFileSync('auth-errors.log', message)
  console.error(context, error)
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set. Using default (INSECURE)')
}

/**
 * Helper: Generate JWT token
 */
const generateToken = (userId, email, role, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    {
      expiresIn,
      issuer: 'kadong-tools',
      audience: 'kadong-users'
    }
  )
}

/**
 * Helper: Log login attempt
 */
const logLoginAttempt = async (email, ipAddress, userAgent, success, failureReason = null) => {
  try {
    await pool.query(
      `INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, ipAddress || '127.0.0.1', userAgent || 'unknown', success, failureReason]
    )
  } catch (error) {
    console.error('Error logging login attempt:', error.message)
  }
}

/**
 * Helper: Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Helper: Validate password strength
 */
const isStrongPassword = (password) => {
  if (password.length < 8) return false
  if (!/[A-Z]/.test(password)) return false
  if (!/[a-z]/.test(password)) return false
  if (!/[0-9]/.test(password)) return false
  return true
}

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (req, res) => {
  const { email, password, name } = req.body

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        }
      })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Invalid email format'
        }
      })
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
        }
      })
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already registered'
        }
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, email_verified, created_at`,
      [email.toLowerCase(), passwordHash, name || null, 'user']
    )

    const user = userResult.rows[0]

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create session
    await pool.query(
      `INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        token,
        expiresAt,
        req.ip || '127.0.0.1',
        req.get('user-agent') || 'unknown'
      ]
    )

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // Return user data (exclude password_hash)
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at
        },
        token,
        expiresIn: JWT_EXPIRES_IN
      },
      message: 'Registration successful'
    })
  } catch (error) {
    logError('register', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_FAILED',
        message: 'Failed to register user'
      }
    })
  }
}

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required'
        }
      })
    }

    // Get user from database
    const userResult = await pool.query(
      `SELECT id, email, password_hash, name, role, email_verified, created_at
       FROM users
       WHERE email = $1 AND deleted_at IS NULL`,
      [email.toLowerCase()]
    )

    // User not found or wrong password (generic error for security)
    if (userResult.rows.length === 0) {
      await logLoginAttempt(email, req.ip, req.get('user-agent'), false, 'USER_NOT_FOUND')
      
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      })
    }

    const user = userResult.rows[0]

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash)

    if (!isMatch) {
      await logLoginAttempt(email, req.ip, req.get('user-agent'), false, 'WRONG_PASSWORD')
      
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      })
    }

    // Log successful login
    await logLoginAttempt(email, req.ip, req.get('user-agent'), true)

    // Generate JWT token
    const expiresIn = rememberMe ? JWT_REMEMBER_ME_EXPIRES_IN : JWT_EXPIRES_IN
    const token = generateToken(user.id, user.email, user.role, expiresIn)
    const expiresAt = new Date(
      Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
    )

    // Create session
    await pool.query(
      `INSERT INTO sessions (user_id, token_hash, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        user.id,
        token,
        expiresAt,
        req.ip || '127.0.0.1',
        req.get('user-agent') || 'unknown'
      ]
    )

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000
    })

    // Return user data
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.email_verified
        },
        token,
        expiresIn
      },
      message: 'Login successful'
    })
  } catch (error) {
    logError('login', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_FAILED',
        message: 'Failed to login'
      }
    })
  }
}

/**
 * POST /api/auth/logout
 * Logout user (revoke session)
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.substring(7)

    if (token) {
      // Revoke session in database (soft delete with revoked_at timestamp)
      await pool.query(
        `UPDATE sessions 
         SET revoked_at = NOW() 
         WHERE token_hash = $1 AND revoked_at IS NULL`,
        [token]
      )
    }

    // Clear cookie
    res.clearCookie('token')

    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Error in logout:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGOUT_FAILED',
        message: 'Failed to logout'
      }
    })
  }
}

/**
 * GET /api/auth/me
 * Get current user profile
 * Requires authentication
 */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      })
    }

    // Get last login time
    const lastLoginResult = await pool.query(
      `SELECT created_at
       FROM login_attempts
       WHERE email = $1 AND success = true
       ORDER BY created_at DESC
       LIMIT 1`,
      [req.user.email]
    )

    res.json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        emailVerified: req.user.email_verified,
        preferences: req.user.preferences,
        createdAt: req.user.created_at,
        lastLoginAt: lastLoginResult.rows[0]?.created_at || null
      }
    })
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_USER_FAILED',
        message: 'Failed to fetch user data'
      }
    })
  }
}

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 * Requires valid (but possibly near-expiry) token
 */
export const refreshToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      })
    }

    // Generate new token
    const newToken = generateToken(req.user.id, req.user.email, req.user.role)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Update session
    await pool.query(
      `UPDATE sessions
       SET token_hash = $1, expires_at = $2
       WHERE id = $3`,
      [newToken, expiresAt, req.sessionId]
    )

    // Set new cookie
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      data: {
        token: newToken,
        expiresIn: JWT_EXPIRES_IN
      },
      message: 'Token refreshed successfully'
    })
  } catch (error) {
    console.error('Error in refreshToken:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'REFRESH_FAILED',
        message: 'Failed to refresh token'
      }
    })
  }
}

/**
 * POST /api/auth/forgot-password
 * Request password reset token
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    // Always return success to prevent email enumeration
    // Don't reveal if email exists or not

    if (!email || !isValidEmail(email)) {
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      })
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email.toLowerCase()]
    )

    if (userResult.rows.length === 0) {
      // Don't reveal user doesn't exist
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      })
    }

    const user = userResult.rows[0]

    // Generate reset token (random string)
    const resetToken = jwt.sign(
      { userId: user.id, purpose: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Store reset token
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    )

    // TODO: Send email with reset link
    // For now, just log it
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`)

    res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      // Remove in production - only for testing
      ...(process.env.NODE_ENV !== 'production' && { token: resetToken })
    })
  } catch (error) {
    console.error('Error in forgotPassword:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'FORGOT_PASSWORD_FAILED',
        message: 'Failed to process password reset request'
      }
    })
  }
}

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body

  try {
    // Validation
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Token and new password are required'
        }
      })
    }

    // Validate password strength
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
        }
      })
    }

    // Verify token exists and not used/expired
    const tokenResult = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token = $1`,
      [token]
    )

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token'
        }
      })
    }

    const resetTokenData = tokenResult.rows[0]

    // Check if already used
    if (resetTokenData.used_at) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TOKEN_ALREADY_USED',
          message: 'Reset token has already been used'
        }
      })
    }

    // Check if expired
    if (new Date(resetTokenData.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Reset token has expired'
        }
      })
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)

    // Update password
    await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [passwordHash, resetTokenData.user_id]
    )

    // Mark token as used
    await pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`,
      [resetTokenData.id]
    )

    // Revoke all existing sessions (force re-login)
    await pool.query(
      `UPDATE sessions SET revoked_at = NOW() WHERE user_id = $1`,
      [resetTokenData.user_id]
    )

    res.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    })
  } catch (error) {
    console.error('Error in resetPassword:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'RESET_PASSWORD_FAILED',
        message: 'Failed to reset password'
      }
    })
  }
}

/**
 * POST /api/auth/migrate-guest-data
 * Migrate guest data from localStorage to database
 * Requires authenticated user (not guest)
 */
export const migrateGuestData = async (req, res) => {
  try {
    const { userId, role } = req.user
    const { notes = [], countdowns = [], wishlist = [] } = req.body

    // Validation: Must be authenticated registered user
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      })
    }

    // Validation: Guest users cannot migrate (they need to register first)
    if (role === 'guest') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'GUEST_MIGRATION_NOT_ALLOWED',
          message: 'Guest users cannot migrate data. Please register first.'
        }
      })
    }

    // Validation: Check array limits
    if (notes.length > 1000 || countdowns.length > 1000 || wishlist.length > 1000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MIGRATION_LIMIT_EXCEEDED',
          message: 'Maximum 1000 items per category'
        }
      })
    }

    const client = await pool.connect()
    let migratedCounts = { notes: 0, countdowns: 0, wishlist: 0 }

    try {
      await client.query('BEGIN')

      // Migrate Notes
      if (notes.length > 0) {
        for (const note of notes) {
          const { title, content, created_at } = note
          await client.query(
            `INSERT INTO notes (user_id, title, content, created_at)
             VALUES ($1, $2, $3, $4)`,
            [userId, title || 'Untitled', content || '', created_at || new Date()]
          )
          migratedCounts.notes++
        }
      }

      // Migrate Countdowns
      if (countdowns.length > 0) {
        for (const countdown of countdowns) {
          const { name, target_date, created_at } = countdown
          await client.query(
            `INSERT INTO countdowns (user_id, name, target_date, created_at)
             VALUES ($1, $2, $3, $4)`,
            [userId, name || 'Untitled Event', target_date, created_at || new Date()]
          )
          migratedCounts.countdowns++
        }
      }

      // Migrate Wishlist
      if (wishlist.length > 0) {
        for (const item of wishlist) {
          const { product_url, title, price, image_url, created_at } = item
          await client.query(
            `INSERT INTO wishlist (user_id, product_url, title, price, image_url, created_at)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, product_url || '', title || 'Untitled Product', price, image_url, created_at || new Date()]
          )
          migratedCounts.wishlist++
        }
      }

      await client.query('COMMIT')

      // Build success message
      const parts = []
      if (migratedCounts.notes > 0) parts.push(`${migratedCounts.notes} ghi chú`)
      if (migratedCounts.countdowns > 0) parts.push(`${migratedCounts.countdowns} đếm ngược`)
      if (migratedCounts.wishlist > 0) parts.push(`${migratedCounts.wishlist} wishlist`)
      
      const message = parts.length > 0
        ? `Đã chuyển ${parts.join(', ')}`
        : 'Không có dữ liệu để chuyển'

      res.json({
        success: true,
        data: {
          migrated: migratedCounts
        },
        message
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    logError('migrateGuestData', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'MIGRATION_FAILED',
        message: 'Failed to migrate guest data'
      }
    })
  }
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  migrateGuestData
}
