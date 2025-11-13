/**
 * Authentication Routes
 * Defines all authentication endpoints
 */

import express from 'express'
import rateLimit from 'express-rate-limit'
import {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  migrateGuestData
} from '../controllers/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

/**
 * Rate Limiters
 */

// Login rate limiter: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Register rate limiter: 3 attempts per 15 minutes
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many registration attempts. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Forgot password rate limiter: 3 attempts per hour
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many password reset requests. Please try again later.',
      retryAfter: '1 hour'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

/**
 * Public Routes (No Authentication Required)
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @rateLimit 3 requests per 15 minutes
 */
router.post('/register', registerLimiter, register)

/**
 * @route   POST /api/auth/login
 * @desc    Login user and create session
 * @access  Public
 * @rateLimit 5 requests per 15 minutes
 */
router.post('/login', loginLimiter, login)

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset token
 * @access  Public
 * @rateLimit 3 requests per hour
 */
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword)

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPassword)

/**
 * Protected Routes (Authentication Required)
 */

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', verifyToken, getCurrentUser)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and revoke session
 * @access  Private
 */
router.post('/logout', verifyToken, logout)

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', verifyToken, refreshToken)

/**
 * @route   POST /api/auth/migrate-guest-data
 * @desc    Migrate guest data from localStorage to database
 * @access  Private (Registered users only, not guests)
 */
router.post('/migrate-guest-data', verifyToken, migrateGuestData)

export default router
