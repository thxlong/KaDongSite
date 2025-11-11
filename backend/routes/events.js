import express from 'express'
import { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventsController.js'

const router = express.Router()

// GET /api/events - Get all events
router.get('/', getEvents)

// GET /api/events/:id - Get specific event
router.get('/:id', getEventById)

// POST /api/events - Create new event
router.post('/', createEvent)

// PUT /api/events/:id - Update event
router.put('/:id', updateEvent)

// DELETE /api/events/:id - Delete event
router.delete('/:id', deleteEvent)

export default router
