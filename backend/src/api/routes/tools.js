import express from 'express'
import { getTools, getToolById } from '#api/controllers/toolsController.js'

const router = express.Router()

// GET /api/tools - Get all available tools
router.get('/', getTools)

// GET /api/tools/:id - Get specific tool information
router.get('/:id', getToolById)

export default router
