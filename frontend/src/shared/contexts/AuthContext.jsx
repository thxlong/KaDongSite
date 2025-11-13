/**
 * Authentication Context
 * Provides global authentication state and functions
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as authService from '../services/authService'
import * as guestStorage from '../utils/guestStorage'

const AuthContext = createContext(null)

/**
 * AuthProvider component
 * Wraps the app to provide authentication context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Check if user is authenticated on app load
   */
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      
      // First check for guest session
      const guestSession = guestStorage.getGuestSession()
      if (guestSession) {
        setUser(guestSession.user)
        setIsGuest(true)
        setLoading(false)
        return
      }

      // Then check for registered user
      const response = await authService.getCurrentUser()
      
      if (response.success) {
        setUser(response.data)
        setIsGuest(false)
      }
    } catch (err) {
      // User not authenticated, this is OK
      setUser(null)
      setIsGuest(false)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Register new user
   */
  const register = useCallback(async (email, password, name = '') => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.register(email, password, name)
      
      if (response.success) {
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Login user
   */
  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.login(email, password, rememberMe)
      
      if (response.success) {
        setUser(response.data.user)
        setIsGuest(false)
        return { success: true, user: response.data.user }
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Login as Guest (client-side only, no API call)
   */
  const loginAsGuest = useCallback(() => {
    try {
      setLoading(true)
      setError(null)

      const guestSession = guestStorage.createGuestSession()
      setUser(guestSession.user)
      setIsGuest(true)

      return { success: true, user: guestSession.user }
    } catch (err) {
      setError('Không thể tạo phiên Guest')
      throw new Error('Failed to create guest session')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // If guest, just clear localStorage
      if (isGuest) {
        guestStorage.clearGuestSession()
        setUser(null)
        setIsGuest(false)
        return { success: true }
      }

      // For registered users, call API
      await authService.logout()
      setUser(null)
      setIsGuest(false)
      return { success: true }
    } catch (err) {
      setError(err.message)
      // Even if API call fails, clear local user state
      setUser(null)
      setIsGuest(false)
      throw err
    } finally {
      setLoading(false)
    }
  }, [isGuest])

  /**
   * Update user data (after profile edit)
   */
  const updateUser = useCallback((userData) => {
    setUser((prev) => ({
      ...prev,
      ...userData
    }))
  }, [])

  /**
   * Refresh authentication token
   */
  const refresh = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      
      if (response.success) {
        return { success: true }
      }
    } catch (err) {
      console.error('Token refresh failed:', err)
      // If refresh fails, user needs to login again
      setUser(null)
      throw err
    }
  }, [])

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.forgotPassword(email)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Reset password with token
   */
  const resetPassword = useCallback(async (token, newPassword) => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.resetPassword(token, newPassword)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Migrate guest data to registered user account
   */
  const migrateGuestData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all guest data from localStorage
      const guestData = guestStorage.getGuestDataForMigration()

      // Call migration API
      const response = await authService.migrateGuestData(guestData)

      if (response.success) {
        // Clear guest data after successful migration
        guestStorage.clearGuestSession()
        setIsGuest(false)
        return response
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Auto-refresh token 1 day before expiry (if rememberMe)
  useEffect(() => {
    if (!user) return

    // Refresh token every 6 days (before 7-day expiry)
    const refreshInterval = setInterval(() => {
      refresh().catch(() => {
        // Refresh failed, user will be logged out
        console.warn('Auto token refresh failed')
      })
    }, 6 * 24 * 60 * 60 * 1000) // 6 days

    return () => clearInterval(refreshInterval)
  }, [user, refresh])

  const value = {
    // State
    user,
    isAuthenticated: !!user,
    isGuest,
    loading,
    error,

    // Functions
    register,
    login,
    loginAsGuest,
    logout,
    updateUser,
    checkAuth,
    refresh,
    forgotPassword,
    resetPassword,
    migrateGuestData
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth hook
 * Access authentication context in components
 * 
 * @example
 * const { user, login, logout, isAuthenticated } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

export default AuthContext
