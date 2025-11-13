/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name (optional)
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const register = async (email, password, name = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password, name })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed')
    }

    return data
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember user session
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const login = async (email, password, rememberMe = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, rememberMe })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Login failed')
    }

    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Logout current user
 * @returns {Promise<{success: boolean}>}
 */
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Logout failed')
    }

    return data
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get user')
    }

    return data
  } catch (error) {
    // Don't log error for 401 (user not logged in)
    if (error.message !== 'Authentication required') {
      console.error('Get current user error:', error)
    }
    throw error
  }
}

/**
 * Refresh authentication token
 * @returns {Promise<{success: boolean, data?: object, error?: object}>}
 */
export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Token refresh failed')
    }

    return data
  } catch (error) {
    console.error('Refresh token error:', error)
    throw error
  }
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<{success: boolean}>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Password reset request failed')
    }

    return data
  } catch (error) {
    console.error('Forgot password error:', error)
    throw error
  }
}

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} newPassword - New password
 * @returns {Promise<{success: boolean}>}
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Password reset failed')
    }

    return data
  } catch (error) {
    console.error('Reset password error:', error)
    throw error
  }
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  forgotPassword,
  resetPassword
}
