/**
 * Wishlist Service
 * @description API service for wishlist management
 * @author KaDong Team
 * @created 2025-11-12
 */

// Build API base URL - add /api suffix if VITE_API_BASE_URL is set
const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : 'http://localhost:5000/api'

// Helper: Get user ID from localStorage (supports both regular and guest users)
const getUserId = () => {
  try {
    // Try to get user from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.id
    }
    
    // Try to get guest session
    const guestSessionStr = localStorage.getItem('guest_session')
    if (guestSessionStr) {
      const guestSession = JSON.parse(guestSessionStr)
      return guestSession.user.id
    }
    
    // Fallback to default admin user for development
    console.warn('[WishlistService] No user found in localStorage, using default admin')
    return '550e8400-e29b-41d4-a716-446655440000'
  } catch (error) {
    console.error('[WishlistService] Error getting user ID:', error)
    // Fallback to default admin user
    return '550e8400-e29b-41d4-a716-446655440000'
  }
}

/**
 * Get wishlist items with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response with items and pagination
 */
export const getWishlistItems = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      user_id: getUserId(),
      ...params
    })

    const response = await fetch(`${API_BASE}/wishlist?${queryParams}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch wishlist items')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error fetching items:', error)
    throw error
  }
}

/**
 * Create new wishlist item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created item
 */
export const createWishlistItem = async (itemData) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId(),
        ...itemData
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to create item')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error creating item:', error)
    throw error
  }
}

/**
 * Update wishlist item
 * @param {string} id - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} Updated item
 */
export const updateWishlistItem = async (id, itemData) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId(),
        ...itemData
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to update item')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error updating item:', error)
    throw error
  }
}

/**
 * Delete wishlist item
 * @param {string} id - Item ID
 * @returns {Promise<void>}
 */
export const deleteWishlistItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId()
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to delete item')
    }
  } catch (error) {
    console.error('[WishlistService] Error deleting item:', error)
    throw error
  }
}

/**
 * Toggle purchased status
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Updated item
 */
export const togglePurchased = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/${id}/purchase`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId()
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to toggle purchased')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error toggling purchased:', error)
    throw error
  }
}

/**
 * Heart an item
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Updated heart count
 */
export const heartItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/${id}/heart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId()
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to heart item')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error hearting item:', error)
    throw error
  }
}

/**
 * Unheart an item
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Updated heart count
 */
export const unheartItem = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE}/wishlist/${id}/heart?user_id=${getUserId()}`,
      {
        method: 'DELETE'
      }
    )

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to unheart item')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error unhearting item:', error)
    throw error
  }
}

/**
 * Get comments for an item
 * @param {string} id - Item ID
 * @returns {Promise<Array>} Comments array
 */
export const getComments = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/${id}/comments`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch comments')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error fetching comments:', error)
    throw error
  }
}

/**
 * Add comment to an item
 * @param {string} id - Item ID
 * @param {string} commentText - Comment text
 * @returns {Promise<Object>} Created comment
 */
export const addComment = async (id, commentText) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId(),
        comment_text: commentText
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to add comment')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error adding comment:', error)
    throw error
  }
}

/**
 * Update comment
 * @param {string} commentId - Comment ID
 * @param {string} commentText - Updated comment text
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = async (commentId, commentText) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: getUserId(),
        comment_text: commentText
      })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to update comment')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error updating comment:', error)
    throw error
  }
}

/**
 * Delete comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(
      `${API_BASE}/wishlist/comments/${commentId}?user_id=${getUserId()}`,
      {
        method: 'DELETE'
      }
    )

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to delete comment')
    }
  } catch (error) {
    console.error('[WishlistService] Error deleting comment:', error)
    throw error
  }
}

/**
 * Get wishlist statistics
 * @returns {Promise<Object>} Stats data
 */
export const getWishlistStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/stats?user_id=${getUserId()}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to fetch stats')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error fetching stats:', error)
    throw error
  }
}

/**
 * Extract metadata from URL
 * @param {string} url - Product URL
 * @returns {Promise<Object>} Extracted metadata
 */
export const extractMetadata = async (url) => {
  try {
    const response = await fetch(`${API_BASE}/wishlist/extract-metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error?.message || 'Failed to extract metadata')
    }

    return data.data
  } catch (error) {
    console.error('[WishlistService] Error extracting metadata:', error)
    throw error
  }
}

export default {
  getWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  togglePurchased,
  heartItem,
  unheartItem,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getWishlistStats,
  extractMetadata
}
