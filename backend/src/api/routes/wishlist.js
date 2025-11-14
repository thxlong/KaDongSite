/**
 * Wishlist Routes
 * @description API routes for wishlist management (CRUD, hearts, comments, stats)
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/03_wishlist_management.spec
 */

import express from 'express'
import rateLimit from 'express-rate-limit'
import * as wishlistController from '#api/controllers/wishlistController.js'

const router = express.Router()

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

const heartLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // 100 hearts per day
  message: {
    success: false,
    error: {
      code: 'HEART_RATE_LIMIT_EXCEEDED',
      message: 'You have reached the daily heart limit'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 comments per hour
  message: {
    success: false,
    error: {
      code: 'COMMENT_RATE_LIMIT_EXCEEDED',
      message: 'Too many comments, please slow down'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

// Apply general rate limiter to all routes
router.use(generalLimiter)

// URL metadata extraction (must be before /:id routes)
router.post('/extract-metadata', wishlistController.extractUrlMetadata)

// Stats (must be before /:id routes)
router.get('/stats', wishlistController.getStats)

// Wishlist items CRUD
router.get('/', wishlistController.getWishlistItems)
router.post('/', wishlistController.createWishlistItem)
router.put('/:id', wishlistController.updateWishlistItem)
router.delete('/:id', wishlistController.deleteWishlistItem)

// Purchase toggle
router.patch('/:id/purchase', wishlistController.togglePurchased)

// Hearts (with special rate limiter)
router.post('/:id/heart', heartLimiter, wishlistController.heartItem)
router.delete('/:id/heart', wishlistController.unheartItem)

// Comments (with special rate limiter)
router.get('/:id/comments', wishlistController.getComments)
router.post('/:id/comments', commentLimiter, wishlistController.addComment)
router.put('/comments/:comment_id', wishlistController.updateComment)
router.delete('/comments/:comment_id', wishlistController.deleteComment)

export default router
