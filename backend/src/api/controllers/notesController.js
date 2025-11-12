import { pool } from '#config/database.config.js'
import { TEST_USER_ID } from '#config/constants.config.js'

// GET all notes for a user
export const getNotes = async (req, res) => {
  try {
    const userId = req.query.user_id || TEST_USER_ID // TODO: Get from auth middleware
    
    const result = await pool.query(
      `SELECT id, user_id, title, content, color, pinned, created_at, updated_at
       FROM notes
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY pinned DESC, created_at DESC`,
      [userId]
    )

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching notes:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// GET note by ID
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.user_id || TEST_USER_ID

    const result = await pool.query(
      `SELECT id, user_id, title, content, color, pinned, created_at, updated_at
       FROM notes
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      })
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching note:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// POST create new note
export const createNote = async (req, res) => {
  try {
    const { title, content, color, pinned } = req.body
    const userId = req.body.user_id || TEST_USER_ID

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      })
    }

    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        error: 'Title must be 255 characters or less'
      })
    }

    const result = await pool.query(
      `INSERT INTO notes (user_id, title, content, color, pinned)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, title, content, color, pinned, created_at, updated_at`,
      [userId, title, content, color || 'pink', pinned || false]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating note:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create note',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// PUT update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, color, pinned } = req.body
    const userId = req.body.user_id || TEST_USER_ID

    // Check if note exists
    const existingNote = await pool.query(
      'SELECT id FROM notes WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [id, userId]
    )

    if (existingNote.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      })
    }

    // Build dynamic update query
    const updates = []
    const values = []
    let paramCounter = 1

    if (title !== undefined) {
      updates.push(`title = $${paramCounter++}`)
      values.push(title)
    }
    if (content !== undefined) {
      updates.push(`content = $${paramCounter++}`)
      values.push(content)
    }
    if (color !== undefined) {
      updates.push(`color = $${paramCounter++}`)
      values.push(color)
    }
    if (pinned !== undefined) {
      updates.push(`pinned = $${paramCounter++}`)
      values.push(pinned)
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      })
    }

    values.push(id, userId)

    const result = await pool.query(
      `UPDATE notes
       SET ${updates.join(', ')}
       WHERE id = $${paramCounter++} AND user_id = $${paramCounter++} AND deleted_at IS NULL
       RETURNING id, user_id, title, content, color, pinned, created_at, updated_at`,
      values
    )

    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating note:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update note',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// DELETE note (soft delete)
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.user_id || TEST_USER_ID

    const result = await pool.query(
      `UPDATE notes
       SET deleted_at = NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING id, title`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error deleting note:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete note',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
