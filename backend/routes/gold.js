/**
 * Gold API Routes
 * @description Routes for gold price endpoints
 * @author KaDong Team
 * @created 2025-11-11
 */

import express from 'express'
import {
  getLatestGoldPrices,
  getGoldPriceHistory,
  triggerGoldFetch,
  getGoldSources
} from '../controllers/goldController.js'

const router = express.Router()

/**
 * @route   GET /api/gold/latest
 * @desc    Get latest gold prices
 * @query   types - Comma-separated gold types (optional)
 * @query   sources - Comma-separated sources (optional)
 * @query   limit - Max results per type (default: 1)
 * @access  Public
 */
router.get('/latest', getLatestGoldPrices)

/**
 * @route   GET /api/gold/history
 * @desc    Get historical gold price data
 * @query   type - Gold type (required)
 * @query   period - day|week|month|year (default: day)
 * @query   from - Start date ISO (optional)
 * @query   to - End date ISO (optional)
 * @query   interval - hour|day|week (auto-determined)
 * @query   limit - Max records (default: 1000)
 * @access  Public
 */
router.get('/history', getGoldPriceHistory)

/**
 * @route   GET /api/gold/sources
 * @desc    Get list of available data sources
 * @access  Public
 */
router.get('/sources', getGoldSources)

/**
 * @route   POST /api/gold/fetch
 * @desc    Trigger manual gold price fetch
 * @access  Admin (add auth middleware in production)
 */
router.post('/fetch', triggerGoldFetch)

export default router
