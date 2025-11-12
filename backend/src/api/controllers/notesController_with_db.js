import { query, transaction } from '../config/database.js'

// =====================================================
// GET all notes for a user (with pagination)
// =====================================================
export const getNotes = async (req, res) => {
  try {
    const userId = req.user?.id // Assume auth middleware adds user to req
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    // Get notes with pagination
    const notesQuery = `
      SELECT id, title, content, color, pinned, created_at, updated_at
      FROM notes
      WHERE user_id = $1 AND deleted_at IS NULL
      ORDER BY pinned DESC, created_at DESC
      LIMIT $2 OFFSET $3
    `
    const notesResult = await query(notesQuery, [userId, limit, offset])

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notes
      WHERE user_id = $1 AND deleted_at IS NULL
    `
    const countResult = await query(countQuery, [userId])
    const total = parseInt(countResult.rows[0].total)

    res.status(200).json({
      success: true,
      data: notesResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error in getNotes:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// =====================================================
// GET single note by ID
// =====================================================
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const noteQuery = `
      SELECT id, user_id, title, content, color, pinned, created_at, updated_at
      FROM notes
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
    `
    const result = await query(noteQuery, [id, userId])

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
    console.error('Error in getNoteById:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// =====================================================
// POST create new note
// =====================================================
export const createNote = async (req, res) => {
  try {
    const userId = req.user?.id
    const { title, content, color, pinned } = req.body

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required'
      })
    }

    const insertQuery = `
      INSERT INTO notes (user_id, title, content, color, pinned)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, title, content, color, pinned, created_at, updated_at
    `
    const result = await query(insertQuery, [
      userId,
      title,
      content,
      color || 'pink',
      pinned || false
    ])

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error in createNote:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// =====================================================
// PUT update note
// =====================================================
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { title, content, color, pinned } = req.body

    const updateQuery = `
      UPDATE notes
      SET 
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        color = COALESCE($3, color),
        pinned = COALESCE($4, pinned),
        updated_at = NOW()
      WHERE id = $5 AND user_id = $6 AND deleted_at IS NULL
      RETURNING id, title, content, color, pinned, updated_at
    `
    const result = await query(updateQuery, [
      title,
      content,
      color,
      pinned,
      id,
      userId
    ])

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
    console.error('Error in updateNote:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// =====================================================
// DELETE note (soft delete)
// =====================================================
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const deleteQuery = `
      UPDATE notes
      SET deleted_at = NOW()
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id, title
    `
    const result = await query(deleteQuery, [id, userId])

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
    console.error('Error in deleteNote:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// =====================================================
// POST toggle pin status
// =====================================================
export const togglePin = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const toggleQuery = `
      UPDATE notes
      SET pinned = NOT pinned, updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id, pinned
    `
    const result = await query(toggleQuery, [id, userId])

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
    console.error('Error in togglePin:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// =====================================================
// GET search notes
// =====================================================
export const searchNotes = async (req, res) => {
  try {
    const userId = req.user?.id
    const { q } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      })
    }

    const searchQuery = `
      SELECT id, title, content, color, created_at
      FROM notes
      WHERE user_id = $1 
        AND deleted_at IS NULL
        AND (title ILIKE $2 OR content ILIKE $2)
      ORDER BY created_at DESC
      LIMIT 20
    `
    const result = await query(searchQuery, [userId, `%${q}%`])

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    console.error('Error in searchNotes:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
}
