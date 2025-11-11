import express from 'express'
import {
  getOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit
} from '../controllers/fashionController.js'

const router = express.Router()

// GET /api/fashion - Get all outfits
router.get('/', getOutfits)

// GET /api/fashion/:id - Get specific outfit
router.get('/:id', getOutfitById)

// POST /api/fashion - Create new outfit
router.post('/', createOutfit)

// PUT /api/fashion/:id - Update outfit
router.put('/:id', updateOutfit)

// DELETE /api/fashion/:id - Delete outfit
router.delete('/:id', deleteOutfit)

export default router
