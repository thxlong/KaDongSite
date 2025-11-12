/**
 * Sanitization Utilities
 * Functions for sanitizing user input to prevent XSS and other attacks
 */

/**
 * Sanitize HTML by removing dangerous tags and attributes
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

  // Remove object tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')

  // Remove embed tags
  sanitized = sanitized.replace(/<embed\b[^<]*>/gi, '')

  // Remove on* event handlers (onclick, onload, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, '')

  // Remove data: URLs (can contain base64 encoded XSS)
  sanitized = sanitized.replace(/data:/gi, '')

  return sanitized.trim()
}

/**
 * Sanitize plain text by escaping HTML special characters
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }

  return text
    .trim()
    .replace(/[&<>"'\/]/g, char => htmlEscapes[char])
}

/**
 * Sanitize and truncate text
 * @param {string} text - Text to sanitize and truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Sanitized and truncated text
 */
export function sanitizeAndTruncate(text, maxLength = 1000) {
  if (!text || typeof text !== 'string') {
    return ''
  }

  let sanitized = sanitizeText(text)

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim()
  }

  return sanitized
}

/**
 * Remove control characters from text
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export function removeControlCharacters(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }

  // Remove control characters (0x00-0x1F except newline, tab)
  return text.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
}

/**
 * Normalize whitespace in text
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeWhitespace(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

/**
 * Sanitize comment text (comprehensive sanitization for comments)
 * @param {string} comment - Comment text to sanitize
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {string} Sanitized comment text
 */
export function sanitizeComment(comment, maxLength = 1000) {
  if (!comment || typeof comment !== 'string') {
    return ''
  }

  // 1. Remove control characters
  let sanitized = removeControlCharacters(comment)

  // 2. Sanitize HTML/XSS
  sanitized = sanitizeHTML(sanitized)

  // 3. Normalize whitespace
  sanitized = normalizeWhitespace(sanitized)

  // 4. Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim()
  }

  return sanitized
}

/**
 * Sanitize product name
 * @param {string} name - Product name to sanitize
 * @param {number} maxLength - Maximum length (default: 255)
 * @returns {string} Sanitized product name
 */
export function sanitizeProductName(name, maxLength = 255) {
  if (!name || typeof name !== 'string') {
    return ''
  }

  let sanitized = sanitizeText(name)
  sanitized = normalizeWhitespace(sanitized)

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim()
  }

  return sanitized
}

/**
 * Sanitize search query
 * @param {string} query - Search query to sanitize
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} Sanitized search query
 */
export function sanitizeSearchQuery(query, maxLength = 100) {
  if (!query || typeof query !== 'string') {
    return ''
  }

  // Remove special SQL characters
  let sanitized = query.replace(/[%;]/g, '')

  sanitized = sanitizeText(sanitized)
  sanitized = normalizeWhitespace(sanitized)

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim()
  }

  return sanitized
}

export default {
  sanitizeHTML,
  sanitizeText,
  sanitizeAndTruncate,
  removeControlCharacters,
  normalizeWhitespace,
  sanitizeComment,
  sanitizeProductName,
  sanitizeSearchQuery
}
