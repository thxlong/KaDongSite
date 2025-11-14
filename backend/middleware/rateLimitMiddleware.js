/**
 * Rate Limiting Middleware
 * Prevents brute force attacks on authentication endpoints
 */

const rateLimit = require('express-rate-limit')

/**
 * Skip rate limiting if DISABLE_RATE_LIMIT env variable is set
 * Useful for E2E tests and development
 */
const shouldSkipRateLimit = (req) => {
  return process.env.DISABLE_RATE_LIMIT === 'true'
}

/**
 * Rate limiter for login endpoint
 * 5 requests per 15 minutes per IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 requests per window
  skip: shouldSkipRateLimit, // Skip when DISABLE_RATE_LIMIT=true
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count successful logins too
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many login attempts. Please try again in 15 minutes.',
        retryAfter: '15 minutes'
      }
    })
  }
})

/**
 * Rate limiter for registration endpoint
 * 3 requests per 15 minutes per IP
 */
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 requests per window
  skip: shouldSkipRateLimit, // Skip when DISABLE_RATE_LIMIT=true
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many registration attempts. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many registration attempts. Please try again in 15 minutes.',
        retryAfter: '15 minutes'
      }
    })
  }
})

/**
 * Rate limiter for forgot password endpoint
 * 3 requests per hour per IP
 */
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 requests per hour
  skip: shouldSkipRateLimit, // Skip when DISABLE_RATE_LIMIT=true
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many password reset requests. Please try again later.',
      retryAfter: '1 hour'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many password reset requests. Please try again in 1 hour.',
        retryAfter: '1 hour'
      }
    })
  }
})

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  skip: shouldSkipRateLimit, // Skip when DISABLE_RATE_LIMIT=true
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

module.exports = {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
  generalLimiter,
  // Aliases for easier use
  login: loginLimiter,
  register: registerLimiter,
  forgotPassword: forgotPasswordLimiter,
  general: generalLimiter
}
