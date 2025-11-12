/**
 * Validation Utilities
 * Functions for validating wishlist data
 */

import validator from 'validator'

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateURL(url) {
  if (!url || typeof url !== 'string') {
    return false
  }

  // Use validator library for URL validation
  if (!validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  })) {
    return false
  }

  // Additional security: block javascript:, data:, file: schemes
  const lowerUrl = url.toLowerCase()
  const blockedSchemes = ['javascript:', 'data:', 'file:', 'vbscript:']
  
  if (blockedSchemes.some(scheme => lowerUrl.startsWith(scheme))) {
    return false
  }

  return true
}

/**
 * Validate price
 * @param {number} price - Price to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validatePrice(price) {
  // Price is optional (can be null)
  if (price === null || price === undefined) {
    return true
  }

  // Must be a number
  if (typeof price !== 'number' || isNaN(price)) {
    return false
  }

  // Must be >= 0
  if (price < 0) {
    return false
  }

  // Must be finite (no Infinity)
  if (!isFinite(price)) {
    return false
  }

  return true
}

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateCurrency(currency) {
  if (!currency || typeof currency !== 'string') {
    return false
  }

  const validCurrencies = ['VND', 'USD', 'EUR', 'JPY']
  return validCurrencies.includes(currency.toUpperCase())
}

/**
 * Validate category
 * @param {string} category - Category to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateCategory(category) {
  // Category is optional
  if (!category) {
    return true
  }

  if (typeof category !== 'string') {
    return false
  }

  const validCategories = [
    'Electronics',
    'Fashion',
    'Home',
    'Books',
    'Games',
    'Beauty',
    'Sports',
    'Toys',
    'Food',
    'Other'
  ]

  return validCategories.includes(category)
}

/**
 * Validate UUID
 * @param {string} id - UUID to validate
 * @returns {boolean} True if valid UUID, false otherwise
 */
export function validateUUID(id) {
  if (!id || typeof id !== 'string') {
    return false
  }

  // Accept any UUID format (v1, v3, v4, v5) or valid UUID string for development
  return validator.isUUID(id) // Accept any UUID version
}

/**
 * Validate sort field
 * @param {string} sort - Sort field to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateSortField(sort) {
  if (!sort) {
    return true // Default will be used
  }

  const validSortFields = ['hearts', 'date', 'price', 'name']
  return validSortFields.includes(sort.toLowerCase())
}

/**
 * Validate sort order
 * @param {string} order - Sort order to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateSortOrder(order) {
  if (!order) {
    return true // Default will be used
  }

  const validOrders = ['asc', 'desc']
  return validOrders.includes(order.toLowerCase())
}

/**
 * Validate pagination limit
 * @param {number} limit - Limit to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateLimit(limit) {
  if (limit === null || limit === undefined) {
    return true // Default will be used
  }

  const num = Number(limit)
  if (isNaN(num)) {
    return false
  }

  // Between 1 and 100
  return num >= 1 && num <= 100
}

/**
 * Validate pagination offset
 * @param {number} offset - Offset to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function validateOffset(offset) {
  if (offset === null || offset === undefined) {
    return true // Default will be used
  }

  const num = Number(offset)
  if (isNaN(num)) {
    return false
  }

  // Must be >= 0
  return num >= 0
}

export default {
  validateURL,
  validatePrice,
  validateCurrency,
  validateCategory,
  validateUUID,
  validateSortField,
  validateSortOrder,
  validateLimit,
  validateOffset
}
