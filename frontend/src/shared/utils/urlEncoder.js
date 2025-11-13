/**
 * URL Encoder Utilities
 * @description UTF-8 encoding functions for Vietnamese guest names
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/06_wedding_invitation_url_encoder.spec
 */

/**
 * Encode Vietnamese name to URL-safe format using UTF-8 percent encoding
 * @param {string} name - Guest name with Vietnamese diacritics
 * @returns {string} URL-encoded name
 */
export const encodeVietnameseName = (name) => {
  if (!name) return ''
  return encodeURIComponent(name.trim())
}

/**
 * Generate full invitation URL with encoded name
 * @param {string} baseUrl - Base invitation URL
 * @param {string} guestName - Guest name to encode
 * @returns {string} Complete invitation URL with ?name= parameter
 */
export const generateInvitationUrl = (baseUrl, guestName) => {
  if (!baseUrl || !guestName) return ''
  const encoded = encodeVietnameseName(guestName)
  
  // Check if baseUrl already has query params
  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}name=${encoded}`
}

/**
 * Parse guest names from text with multiple separators
 * Supports: comma (,), semicolon (;), newline (\n)
 * @param {string} text - Text with guest names
 * @returns {string[]} Array of guest names
 */
export const parseGuestNames = (text) => {
  if (!text) return []
  
  return text
    .split(/[,;\n]+/) // Split by comma, semicolon, or newline
    .map(name => name.trim())
    .filter(name => name.length > 0)
}

/**
 * Remove duplicate names (case-insensitive)
 * @param {string[]} names - Array of guest names
 * @returns {string[]} Array without duplicates
 */
export const removeDuplicateNames = (names) => {
  const seen = new Set()
  return names.filter(name => {
    const lower = name.toLowerCase()
    if (seen.has(lower)) return false
    seen.add(lower)
    return true
  })
}

/**
 * Validate URL format (must start with http:// or https://)
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL format
 */
export const isValidUrl = (url) => {
  if (!url) return false
  return /^https?:\/\/.+/.test(url)
}

/**
 * Decode URL-encoded name back to original text
 * @param {string} encodedName - URL-encoded name
 * @returns {string} Decoded name
 */
export const decodeVietnameseName = (encodedName) => {
  if (!encodedName) return ''
  try {
    return decodeURIComponent(encodedName)
  } catch (error) {
    console.error('Failed to decode name:', error)
    return encodedName
  }
}

/**
 * Extract name parameter from invitation URL
 * @param {string} url - Full invitation URL
 * @returns {string|null} Decoded guest name or null if not found
 */
export const extractNameFromUrl = (url) => {
  if (!url) return null
  
  try {
    const urlObj = new URL(url)
    const name = urlObj.searchParams.get('name')
    return name ? decodeVietnameseName(name) : null
  } catch (error) {
    console.error('Failed to extract name from URL:', error)
    return null
  }
}

/**
 * Validate guest name (not empty, not too long)
 * @param {string} name - Guest name to validate
 * @returns {{ valid: boolean, error: string|null }} Validation result
 */
export const validateGuestName = (name) => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Tên không được để trống' }
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'Tên quá dài (tối đa 100 ký tự)' }
  }
  
  return { valid: true, error: null }
}

/**
 * Format guest list for export (one URL per line)
 * @param {Array<{name: string, url: string}>} urlList - List of URLs with names
 * @returns {string} Formatted text with URLs
 */
export const formatForExport = (urlList) => {
  return urlList.map(item => item.url).join('\n')
}

/**
 * Format guest list for CSV export
 * @param {Array<{name: string, url: string}>} urlList - List of URLs with names
 * @returns {string} CSV formatted text
 */
export const formatForCSV = (urlList) => {
  const header = 'Tên khách,URL\n'
  const rows = urlList.map(item => `"${item.name}","${item.url}"`).join('\n')
  return header + rows
}
