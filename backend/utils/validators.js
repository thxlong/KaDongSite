/**
 * Validators for Authentication
 * Input validation functions for auth-related data
 */

const validator = require('validator')

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' }
  }

  // Trim whitespace
  email = email.trim()

  // Check format using validator library
  if (!validator.isEmail(email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  // Additional checks
  if (email.length > 255) {
    return { valid: false, error: 'Email must be less than 255 characters' }
  }

  return { valid: true, error: null }
}

/**
 * Validate password strength
 * Requirements:
 * - Min 8 characters
 * - At least 1 uppercase
 * - At least 1 lowercase
 * - At least 1 number
 * @param {string} password - Password to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
const isStrongPassword = (password) => {
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
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Escape HTML special characters
  return validator.escape(input.trim())
}

/**
 * Validate name (optional field)
 * @param {string} name - Name to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
const isValidName = (name) => {
  // Name is optional
  if (!name) {
    return { valid: true, error: null }
  }

  if (typeof name !== 'string') {
    return { valid: false, error: 'Name must be a string' }
  }

  const trimmedName = name.trim()

  if (trimmedName.length === 0) {
    return { valid: true, error: null } // Empty is ok (optional)
  }

  if (trimmedName.length > 255) {
    return { valid: false, error: 'Name must be less than 255 characters' }
  }

  // Only allow letters, spaces, and common name characters
  if (!/^[a-zA-ZÀ-ỹ\s'-]+$/.test(trimmedName)) {
    return { valid: false, error: 'Name contains invalid characters' }
  }

  return { valid: true, error: null }
}

/**
 * Validate user role
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid role
 */
const isValidRole = (role) => {
  const validRoles = ['admin', 'user', 'guest']
  return validRoles.includes(role)
}

/**
 * Validate UUID format
 * @param {string} id - UUID to validate
 * @returns {boolean} - True if valid UUID
 */
const isValidUUID = (id) => {
  if (!id || typeof id !== 'string') {
    return false
  }

  return validator.isUUID(id)
}

/**
 * Validate IP address
 * @param {string} ip - IP address to validate
 * @returns {boolean} - True if valid IP
 */
const isValidIP = (ip) => {
  if (!ip || typeof ip !== 'string') {
    return false
  }

  return validator.isIP(ip, 4) || validator.isIP(ip, 6)
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  sanitizeInput,
  isValidName,
  isValidRole,
  isValidUUID,
  isValidIP
}
