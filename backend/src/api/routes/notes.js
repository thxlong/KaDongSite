import express from 'express'
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote 
} from '#api/controllers/notesController.js'

const router = express.Router()

// GET /api/notes - Get all notes
router.get('/', getNotes)

// GET /api/notes/:id - Get specific note
router.get('/:id', getNoteById)

// POST /api/notes - Create new note
router.post('/', createNote)

// PUT /api/notes/:id - Update note
router.put('/:id', updateNote)

// DELETE /api/notes/:id - Delete note
router.delete('/:id', deleteNote)

export default router
