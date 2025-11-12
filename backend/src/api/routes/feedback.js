import express from 'express'
import { submitFeedback, getAllFeedback } from '#api/controllers/feedbackController.js'

const router = express.Router()

// POST /api/feedback - Submit feedback
router.post('/', submitFeedback)

// GET /api/feedback - Get all feedback (for admin)
router.get('/', getAllFeedback)

export default router
