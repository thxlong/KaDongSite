/**
 * JWT Token Utilities
 * Handles JWT token generation, verification, and decoding
 */

const jwt = require('jsonwebtoken')

// Get JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d' // Default: 7 days
const JWT_REMEMBER_ME_EXPIRES_IN = '30d' // Remember me: 30 days

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in environment variables. Using default (INSECURE)')
}

/**
 * Generate JWT token
 * @param {Object} payload - Token payload (user data)
 * @param {string} expiresIn - Token expiration (e.g., '7d', '30d')
 * @returns {string} - JWT token
 */
const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be an object')
  }

  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn,
      issuer: 'kadong-tools',
      audience: 'kadong-users'
    })
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Failed to generate token')
  }
}

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a non-empty string')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'kadong-tools',
      audience: 'kadong-users'
    })
    return decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired')
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    } else {
      console.error('Error verifying token:', error)
      throw new Error('Token verification failed')
    }
  }
}

/**
 * Decode JWT token without verification
 * Useful for extracting token info before verification
 * @param {string} token - JWT token to decode
 * @returns {Object|null} - Decoded payload or null if invalid
 */
const decodeToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    const decoded = jwt.decode(token, { complete: true })
    return decoded
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Check if token is about to expire
 * @param {string} token - JWT token
 * @param {number} thresholdSeconds - Time threshold in seconds (default: 86400 = 1 day)
 * @returns {boolean} - True if token expires within threshold
 */
const isTokenNearExpiry = (token, thresholdSeconds = 86400) => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.payload || !decoded.payload.exp) {
      return true // Consider invalid tokens as expired
    }

    const expiryTime = decoded.payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const timeLeft = expiryTime - now

    return timeLeft < (thresholdSeconds * 1000)
  } catch (error) {
    return true
  }
}

/**
 * Get token expiry date
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiry date or null if invalid
 */
const getTokenExpiry = (token) => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.payload || !decoded.payload.exp) {
      return null
    }

    return new Date(decoded.payload.exp * 1000)
  } catch (error) {
    return null
  }
}

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenNearExpiry,
  getTokenExpiry,
  JWT_EXPIRES_IN,
  JWT_REMEMBER_ME_EXPIRES_IN
}
