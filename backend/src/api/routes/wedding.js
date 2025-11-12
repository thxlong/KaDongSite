/**
 * Wedding Invitation URL Routes
 * @description API routes for wedding invitation URL encoding
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/06_wedding_invitation_url_encoder.spec
 */

import express from 'express'
import rateLimit from 'express-rate-limit'
import * as weddingController from '#api/controllers/weddingController.js'
import { authenticateToken } from '#utils/auth.js'

const router = express.Router()

// Rate limiter for POST endpoint (10 requests per hour)
const saveUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
})

// All routes require authentication
router.use(authenticateToken)

// POST /api/wedding-urls - Create/update base URL
router.post('/wedding-urls', saveUrlLimiter, weddingController.saveWeddingUrl)

// GET /api/wedding-urls/latest - Get latest URL
router.get('/wedding-urls/latest', weddingController.getLatestWeddingUrl)

// DELETE /api/wedding-urls/:id - Soft delete URL
router.delete('/wedding-urls/:id', weddingController.deleteWeddingUrl)

export default router
