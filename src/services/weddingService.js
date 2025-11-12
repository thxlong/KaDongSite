/**
 * Wedding Invitation URL Service
 * @description API service for wedding invitation URL management
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/06_wedding_invitation_url_encoder.spec
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Helper: Get user ID (temporary - should come from auth context)
const getUserId = () => {
  // Default user: Administrator (full permissions)
  return '550e8400-e29b-41d4-a716-446655440000'
}

/**
 * Get authentication headers
 * @returns {Object} Headers with authorization
 */
const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json'
    // Note: In production, add JWT token from auth context
    // 'Authorization': `Bearer ${token}`
  }
}

/**
 * Save wedding base URL
 * Creates new URL or updates existing (soft deletes old one)
 * @param {string} baseUrl - Base invitation URL
 * @returns {Promise<Object>} Saved URL data { id, base_url, created_at }
 */
export const saveWeddingUrl = async (baseUrl) => {
  try {
    const response = await fetch(`${API_BASE}/wedding-urls?user_id=${getUserId()}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ baseUrl })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Không thể lưu URL')
    }

    return data
  } catch (error) {
    console.error('[WeddingService] Error saving URL:', error)
    throw error
  }
}

/**
 * Get latest wedding URL for the user
 * @returns {Promise<Object|null>} Latest URL data or null if none found
 */
export const getLatestWeddingUrl = async () => {
  try {
    const response = await fetch(`${API_BASE}/wedding-urls/latest?user_id=${getUserId()}`, {
      method: 'GET',
      headers: getAuthHeaders()
    })

    const data = await response.json()

    // 404 is expected when no URL exists yet
    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(data.error?.message || 'Không thể tải URL')
    }

    return data
  } catch (error) {
    console.error('[WeddingService] Error fetching URL:', error)
    throw error
  }
}

/**
 * Delete wedding URL (soft delete)
 * @param {string} id - UUID of the wedding URL
 * @returns {Promise<void>}
 */
export const deleteWeddingUrl = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/wedding-urls/${id}?user_id=${getUserId()}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Không thể xóa URL')
    }

    return data
  } catch (error) {
    console.error('[WeddingService] Error deleting URL:', error)
    throw error
  }
}

/**
 * Download guest list as text file
 * @param {Array<{name: string, url: string}>} urlList - List of URLs
 * @param {string} filename - Output filename
 */
export const downloadAsTextFile = (urlList, filename = 'wedding-invitation-links.txt') => {
  const content = urlList.map(item => item.url).join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  window.URL.revokeObjectURL(url)
}

/**
 * Download guest list as CSV file
 * @param {Array<{name: string, url: string}>} urlList - List of URLs
 * @param {string} filename - Output filename
 */
export const downloadAsCSVFile = (urlList, filename = 'wedding-invitation-links.csv') => {
  const header = 'Tên khách,URL\n'
  const rows = urlList.map(item => `"${item.name}","${item.url}"`).join('\n')
  const content = header + rows
  
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  window.URL.revokeObjectURL(url)
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return success
  } catch (error) {
    console.error('[WeddingService] Failed to copy to clipboard:', error)
    return false
  }
}
