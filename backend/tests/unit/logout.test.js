/**
 * Unit Tests for Logout Functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { logout } from '../../src/api/controllers/authController.js'
import { pool } from '../../src/config/database.config.js'

// Mock database
vi.mock('../../src/config/database.config.js', () => ({
  pool: {
    query: vi.fn()
  }
}))

describe('Logout Controller', () => {
  let req, res

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Setup request object
    req = {
      cookies: {},
      headers: {},
      user: {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'user'
      }
    }

    // Setup response object
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      clearCookie: vi.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Successful Logout', () => {
    it('should logout user with token in cookie', async () => {
      const token = 'test-jwt-token'
      req.cookies.token = token

      pool.query.mockResolvedValueOnce({ rowCount: 1 })

      await logout(req, res)

      // Should delete session from database
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM sessions'),
        [token]
      )

      // Should clear cookie
      expect(res.clearCookie).toHaveBeenCalledWith('token')

      // Should return success
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful'
      })
    })

    it('should logout user with token in Authorization header', async () => {
      const token = 'test-jwt-token'
      req.headers.authorization = `Bearer ${token}`

      pool.query.mockResolvedValueOnce({ rowCount: 1 })

      await logout(req, res)

      // Should delete session from database
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM sessions'),
        [token]
      )

      // Should clear cookie
      expect(res.clearCookie).toHaveBeenCalledWith('token')

      // Should return success
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful'
      })
    })

    it('should handle logout without token', async () => {
      // No token provided
      await logout(req, res)

      // Should not query database
      expect(pool.query).not.toHaveBeenCalled()

      // Should clear cookie anyway
      expect(res.clearCookie).toHaveBeenCalledWith('token')

      // Should return success
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful'
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const token = 'test-jwt-token'
      req.cookies.token = token

      const dbError = new Error('Database connection failed')
      pool.query.mockRejectedValueOnce(dbError)

      await logout(req, res)

      // Should return error
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Failed to logout'
        }
      })
    })

    it('should handle missing session gracefully', async () => {
      const token = 'non-existent-token'
      req.cookies.token = token

      pool.query.mockResolvedValueOnce({ rowCount: 0 })

      await logout(req, res)

      // Should still clear cookie
      expect(res.clearCookie).toHaveBeenCalledWith('token')

      // Should return success even if session doesn't exist
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful'
      })
    })
  })

  describe('Token Extraction', () => {
    it('should prioritize cookie token over header', async () => {
      const cookieToken = 'cookie-token'
      const headerToken = 'header-token'
      
      req.cookies.token = cookieToken
      req.headers.authorization = `Bearer ${headerToken}`

      pool.query.mockResolvedValueOnce({ rowCount: 1 })

      await logout(req, res)

      // Should use cookie token
      expect(pool.query).toHaveBeenCalledWith(
        expect.anything(),
        [cookieToken]
      )
    })

    it('should extract token from Bearer authorization header', async () => {
      const token = 'test-token-from-header'
      req.headers.authorization = `Bearer ${token}`

      pool.query.mockResolvedValueOnce({ rowCount: 1 })

      await logout(req, res)

      expect(pool.query).toHaveBeenCalledWith(
        expect.anything(),
        [token]
      )
    })

    it('should handle malformed Authorization header', async () => {
      req.headers.authorization = 'InvalidFormat'

      await logout(req, res)

      // Should not crash, but not query database either
      expect(pool.query).not.toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logout successful'
      })
    })
  })
})
