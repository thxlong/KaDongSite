/**
 * Guest Storage Utilities
 * Handle localStorage operations for Guest mode users
 * All guest data is prefixed with 'guest_' and stored client-side only
 */

const GUEST_SESSION_KEY = 'guest_session'
const GUEST_NOTES_KEY = 'guest_notes'
const GUEST_COUNTDOWNS_KEY = 'guest_countdowns'
const GUEST_WISHLIST_KEY = 'guest_wishlist'
const GUEST_SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Generate guest session token (client-side only)
 */
export const createGuestSession = () => {
  const guestSession = {
    user: {
      id: 'guest',
      email: 'guest@kadong.local',
      name: 'Guest',
      role: 'guest'
    },
    isGuest: true,
    expiresAt: Date.now() + GUEST_SESSION_DURATION,
    createdAt: Date.now()
  }

  localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(guestSession))
  return guestSession
}

/**
 * Get guest session from localStorage
 */
export const getGuestSession = () => {
  try {
    const sessionStr = localStorage.getItem(GUEST_SESSION_KEY)
    if (!sessionStr) return null

    const session = JSON.parse(sessionStr)
    
    // Check if session expired
    if (Date.now() > session.expiresAt) {
      clearGuestSession()
      return null
    }

    return session
  } catch (error) {
    console.error('Error reading guest session:', error)
    return null
  }
}

/**
 * Clear guest session and all guest data
 */
export const clearGuestSession = () => {
  localStorage.removeItem(GUEST_SESSION_KEY)
  localStorage.removeItem(GUEST_NOTES_KEY)
  localStorage.removeItem(GUEST_COUNTDOWNS_KEY)
  localStorage.removeItem(GUEST_WISHLIST_KEY)
}

/**
 * Check if guest session is valid
 */
export const isGuestSessionValid = () => {
  const session = getGuestSession()
  return session !== null && Date.now() < session.expiresAt
}

/**
 * Get all guest data for migration
 */
export const getGuestDataForMigration = () => {
  try {
    return {
      notes: JSON.parse(localStorage.getItem(GUEST_NOTES_KEY) || '[]'),
      countdowns: JSON.parse(localStorage.getItem(GUEST_COUNTDOWNS_KEY) || '[]'),
      wishlist: JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]')
    }
  } catch (error) {
    console.error('Error reading guest data:', error)
    return { notes: [], countdowns: [], wishlist: [] }
  }
}

/**
 * Save guest notes to localStorage
 */
export const saveGuestNotes = (notes) => {
  try {
    localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes))
    return true
  } catch (error) {
    console.error('Error saving guest notes:', error)
    return false
  }
}

/**
 * Get guest notes from localStorage
 */
export const getGuestNotes = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_NOTES_KEY) || '[]')
  } catch (error) {
    console.error('Error reading guest notes:', error)
    return []
  }
}

/**
 * Save guest countdowns to localStorage
 */
export const saveGuestCountdowns = (countdowns) => {
  try {
    localStorage.setItem(GUEST_COUNTDOWNS_KEY, JSON.stringify(countdowns))
    return true
  } catch (error) {
    console.error('Error saving guest countdowns:', error)
    return false
  }
}

/**
 * Get guest countdowns from localStorage
 */
export const getGuestCountdowns = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_COUNTDOWNS_KEY) || '[]')
  } catch (error) {
    console.error('Error reading guest countdowns:', error)
    return []
  }
}

/**
 * Save guest wishlist to localStorage
 */
export const saveGuestWishlist = (wishlist) => {
  try {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlist))
    return true
  } catch (error) {
    console.error('Error saving guest wishlist:', error)
    return false
  }
}

/**
 * Get guest wishlist from localStorage
 */
export const getGuestWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]')
  } catch (error) {
    console.error('Error reading guest wishlist:', error)
    return []
  }
}

/**
 * Get storage usage info
 */
export const getGuestStorageInfo = () => {
  const notes = getGuestNotes()
  const countdowns = getGuestCountdowns()
  const wishlist = getGuestWishlist()

  const dataStr = JSON.stringify({ notes, countdowns, wishlist })
  const sizeBytes = new Blob([dataStr]).size
  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2)

  return {
    notes: notes.length,
    countdowns: countdowns.length,
    wishlist: wishlist.length,
    totalSize: sizeMB,
    maxSize: '5.00' // Browser localStorage limit (~5MB)
  }
}

export default {
  createGuestSession,
  getGuestSession,
  clearGuestSession,
  isGuestSessionValid,
  getGuestDataForMigration,
  saveGuestNotes,
  getGuestNotes,
  saveGuestCountdowns,
  getGuestCountdowns,
  saveGuestWishlist,
  getGuestWishlist,
  getGuestStorageInfo
}
