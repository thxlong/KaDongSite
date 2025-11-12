import { pool } from '#config/database.config.js'
import { TEST_USER_ID } from '#config/constants.config.js'

// GET all events for a user
export const getEvents = async (req, res) => {
  try {
    const userId = req.query.user_id || TEST_USER_ID // TODO: Get from auth middleware
    
    const result = await pool.query(
      `SELECT id, user_id, title, event_date, recurring, timezone, color, 
              created_at, updated_at
       FROM countdown_events
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY event_date ASC`,
      [userId]
    )

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// GET event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.user_id || TEST_USER_ID

    const result = await pool.query(
      `SELECT id, user_id, title, event_date, recurring, timezone, color, 
              created_at, updated_at
       FROM countdown_events 
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      })
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// POST create new event
export const createEvent = async (req, res) => {
  try {
    const { title, date, color, recurring } = req.body
    const userId = req.body.user_id || TEST_USER_ID

    // Validation
    if (!title || !date) {
      return res.status(400).json({
        success: false,
        error: 'Title and date are required'
      })
    }

    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        error: 'Title must be 255 characters or less'
      })
    }

    const result = await pool.query(
      `INSERT INTO countdown_events (user_id, title, event_date, recurring, color)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, event_date, recurring, timezone, color, 
                 created_at, updated_at`,
      [userId, title, date, recurring || null, color || 'from-pastel-pink to-pastel-purple']
    )

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create event',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// PUT update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const { title, date, color, recurring } = req.body
    const userId = req.body.user_id || TEST_USER_ID

    // Check if event exists and belongs to user
    const existingEvent = await pool.query(
      'SELECT * FROM countdown_events WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [id, userId]
    )
    
    if (existingEvent.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      })
    }

    // Build dynamic update query
    const updates = []
    const values = []
    let paramCount = 1

    if (title !== undefined) {
      if (title.length > 255) {
        return res.status(400).json({
          success: false,
          error: 'Title must be 255 characters or less'
        })
      }
      updates.push(`title = $${paramCount++}`)
      values.push(title)
    }
    if (date !== undefined) {
      updates.push(`event_date = $${paramCount++}`)
      values.push(date)
    }
    if (color !== undefined) {
      updates.push(`color = $${paramCount++}`)
      values.push(color)
    }
    if (recurring !== undefined) {
      updates.push(`recurring = $${paramCount++}`)
      values.push(recurring)
    }

    updates.push(`updated_at = NOW()`)
    values.push(id, userId)

    const result = await pool.query(
      `UPDATE countdown_events 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount++} AND user_id = $${paramCount++}
       RETURNING id, user_id, title, event_date, recurring, timezone, color, 
                 created_at, updated_at`,
      values
    )

    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// DELETE event (soft delete)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.user_id || req.body.user_id || TEST_USER_ID

    const result = await pool.query(
      `UPDATE countdown_events 
       SET deleted_at = NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING id, title`,
      [id, userId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
