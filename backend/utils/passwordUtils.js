/**
 * Password Utilities
 * Handles password hashing and validation using bcrypt
 */

const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

/**
 * Hash a plain text password
 * @param {string} plainText - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (plainText) => {
  if (!plainText || typeof plainText !== 'string') {
    throw new Error('Password must be a non-empty string')
  }

  try {
    const hash = await bcrypt.hash(plainText, SALT_ROUNDS)
    return hash
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Compare plain text password with hash
 * @param {string} plainText - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
const comparePassword = async (plainText, hash) => {
  if (!plainText || !hash) {
    return false
  }

  try {
    const isMatch = await bcrypt.compare(plainText, hash)
    return isMatch
  } catch (error) {
    console.error('Error comparing passwords:', error)
    return false
  }
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * @param {string} password - Password to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
const validatePasswordStrength = (password) => {
  const errors = []

  if (!password || typeof password !== 'string') {
    errors.push('Password is required')
    return { valid: false, errors }
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} - { score: number (0-4), level: string }
 */
const getPasswordStrength = (password) => {
  if (!password) {
    return { score: 0, level: 'none' }
  }

  let score = 0

  // Length
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Complexity
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++ // Special characters

  // Cap at 4
  score = Math.min(score, 4)

  const levels = ['none', 'weak', 'fair', 'good', 'strong']
  
  return {
    score,
    level: levels[score]
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  getPasswordStrength,
  SALT_ROUNDS
}
