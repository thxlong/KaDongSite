/**
 * Wishlist Controller
 * @description Handle wishlist CRUD, hearts, comments, and stats operations
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/03_wishlist_management.spec
 */

import { query } from '#config/database.config.js'
import { extractMetadata } from '#utils/urlExtractor.js'
import {
  validateURL,
  validatePrice,
  validateCurrency,
  validateCategory,
  validateUUID,
  validateSortField,
  validateSortOrder,
  validateLimit,
  validateOffset
} from '#utils/validation.js'
import {
  sanitizeProductName,
  sanitizeText,
  sanitizeComment,
  sanitizeSearchQuery
} from '#utils/sanitizer.js'

/**
 * GET /api/wishlist
 * Get all wishlist items for a user with pagination, filtering, sorting, and search
 */
export const getWishlistItems = async (req, res) => {
  try {
    const {
      user_id,
      sort = 'date',
      order = 'desc',
      category,
      purchased,
      search,
      limit = 20,
      offset = 0
    } = req.query

    // Validation
    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    if (!validateSortField(sort)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SORT', message: 'Invalid sort field' }
      })
    }

    if (!validateSortOrder(order)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ORDER', message: 'Invalid sort order' }
      })
    }

    if (!validateLimit(limit) || !validateOffset(offset)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PAGINATION', message: 'Invalid pagination parameters' }
      })
    }

    // Build query
    let sql = `
      SELECT 
        wi.*,
        EXISTS(
          SELECT 1 FROM wishlist_hearts wh 
          WHERE wh.wishlist_item_id = wi.id AND wh.user_id = $1
        ) as user_liked,
        (
          SELECT COUNT(*) FROM wishlist_comments wc
          WHERE wc.wishlist_item_id = wi.id AND wc.deleted_at IS NULL
        ) as comment_count
      FROM wishlist_items wi
      WHERE wi.deleted_at IS NULL
    `
    const params = [user_id]
    let paramIndex = 2

    // Filter by category
    if (category) {
      sql += ` AND wi.category = $${paramIndex}`
      params.push(category)
      paramIndex++
    }

    // Filter by purchased status
    if (purchased !== undefined) {
      const isPurchased = purchased === 'true' || purchased === true
      sql += ` AND wi.is_purchased = $${paramIndex}`
      params.push(isPurchased)
      paramIndex++
    }

    // Search
    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search)
      sql += ` AND (
        wi.product_name ILIKE $${paramIndex} OR 
        wi.description ILIKE $${paramIndex}
      )`
      params.push(`%${sanitizedSearch}%`)
      paramIndex++
    }

    // Sorting
    const sortMap = {
      hearts: 'wi.heart_count',
      date: 'wi.created_at',
      price: 'wi.price',
      name: 'wi.product_name'
    }
    const sortColumn = sortMap[sort.toLowerCase()] || sortMap.date
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC'
    sql += ` ORDER BY ${sortColumn} ${sortOrder}`

    // Pagination
    sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(parseInt(limit), parseInt(offset))

    // Execute query
    const result = await query(sql, params)

    // Get total count for pagination
    let countSql = `SELECT COUNT(*) as total FROM wishlist_items wi WHERE wi.deleted_at IS NULL`
    const countParams = []
    let countParamIndex = 1

    if (category) {
      countSql += ` AND wi.category = $${countParamIndex}`
      countParams.push(category)
      countParamIndex++
    }

    if (purchased !== undefined) {
      const isPurchased = purchased === 'true' || purchased === true
      countSql += ` AND wi.is_purchased = $${countParamIndex}`
      countParams.push(isPurchased)
      countParamIndex++
    }

    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search)
      countSql += ` AND (wi.product_name ILIKE $${countParamIndex} OR wi.description ILIKE $${countParamIndex})`
      countParams.push(`%${sanitizedSearch}%`)
    }

    const countResult = await query(countSql, countParams)
    const total = parseInt(countResult.rows[0].total)

    res.json({
      success: true,
      data: {
        items: result.rows,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          has_more: offset + result.rows.length < total
        }
      }
    })

  } catch (error) {
    console.error('[Wishlist] Error fetching items:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch wishlist items' }
    })
  }
}

/**
 * POST /api/wishlist
 * Create a new wishlist item
 */
export const createWishlistItem = async (req, res) => {
  try {
    const {
      user_id,
      product_name,
      product_url,
      product_image_url,
      price,
      currency = 'VND',
      origin,
      description,
      category
    } = req.body

    // Validation
    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    if (!product_name) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PRODUCT_NAME', message: 'product_name is required' }
      })
    }

    if (!product_url || !validateURL(product_url)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_URL', message: 'Valid product_url is required' }
      })
    }

    if (price !== undefined && price !== null && !validatePrice(price)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PRICE', message: 'Price must be a positive number' }
      })
    }

    if (currency && !validateCurrency(currency)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CURRENCY', message: 'Currency must be VND, USD, EUR, or JPY' }
      })
    }

    if (category && !validateCategory(category)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CATEGORY', message: 'Invalid category' }
      })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeProductName(product_name)
    const sanitizedDescription = description ? sanitizeText(description) : null
    const sanitizedOrigin = origin ? sanitizeText(origin) : null

    // Insert item
    const sql = `
      INSERT INTO wishlist_items (
        user_id, product_name, product_url, product_image_url,
        price, currency, origin, description, category
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `

    const result = await query(sql, [
      user_id,
      sanitizedName,
      product_url,
      product_image_url || null,
      price || null,
      currency,
      sanitizedOrigin,
      sanitizedDescription,
      category || null
    ])

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('[Wishlist] Error creating item:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to create wishlist item' }
    })
  }
}

/**
 * PUT /api/wishlist/:id
 * Update a wishlist item
 */
export const updateWishlistItem = async (req, res) => {
  try {
    const { id } = req.params
    const {
      user_id,
      product_name,
      product_url,
      product_image_url,
      price,
      currency,
      origin,
      description,
      category
    } = req.body

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Check ownership
    const checkSql = `SELECT user_id FROM wishlist_items WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Wishlist item not found' }
      })
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to update this item' }
      })
    }

    // Validate optional fields
    if (product_url && !validateURL(product_url)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_URL', message: 'Invalid product_url' }
      })
    }

    if (price !== undefined && price !== null && !validatePrice(price)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PRICE', message: 'Price must be a positive number' }
      })
    }

    if (currency && !validateCurrency(currency)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CURRENCY', message: 'Currency must be VND, USD, EUR, or JPY' }
      })
    }

    if (category && !validateCategory(category)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CATEGORY', message: 'Invalid category' }
      })
    }

    // Build update query dynamically
    const updates = []
    const params = [id]
    let paramIndex = 2

    if (product_name) {
      updates.push(`product_name = $${paramIndex}`)
      params.push(sanitizeProductName(product_name))
      paramIndex++
    }

    if (product_url) {
      updates.push(`product_url = $${paramIndex}`)
      params.push(product_url)
      paramIndex++
    }

    if (product_image_url !== undefined) {
      updates.push(`product_image_url = $${paramIndex}`)
      params.push(product_image_url || null)
      paramIndex++
    }

    if (price !== undefined) {
      updates.push(`price = $${paramIndex}`)
      params.push(price || null)
      paramIndex++
    }

    if (currency) {
      updates.push(`currency = $${paramIndex}`)
      params.push(currency)
      paramIndex++
    }

    if (origin !== undefined) {
      updates.push(`origin = $${paramIndex}`)
      params.push(origin ? sanitizeText(origin) : null)
      paramIndex++
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`)
      params.push(description ? sanitizeText(description) : null)
      paramIndex++
    }

    if (category !== undefined) {
      updates.push(`category = $${paramIndex}`)
      params.push(category || null)
      paramIndex++
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'NO_UPDATES', message: 'No fields to update' }
      })
    }

    const sql = `
      UPDATE wishlist_items
      SET ${updates.join(', ')}
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `

    const result = await query(sql, params)

    res.json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('[Wishlist] Error updating item:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update wishlist item' }
    })
  }
}

/**
 * DELETE /api/wishlist/:id
 * Soft delete a wishlist item
 */
export const deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.body

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Check ownership
    const checkSql = `SELECT user_id FROM wishlist_items WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Wishlist item not found' }
      })
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this item' }
      })
    }

    // Soft delete
    const sql = `
      UPDATE wishlist_items
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id
    `

    await query(sql, [id])

    res.json({
      success: true,
      message: 'Wishlist item deleted successfully'
    })

  } catch (error) {
    console.error('[Wishlist] Error deleting item:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete wishlist item' }
    })
  }
}

/**
 * PATCH /api/wishlist/:id/purchase
 * Toggle purchased status
 */
export const togglePurchased = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.body

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Check item exists
    const checkSql = `SELECT is_purchased FROM wishlist_items WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Wishlist item not found' }
      })
    }

    const currentStatus = checkResult.rows[0].is_purchased
    const newStatus = !currentStatus

    // Update status
    const sql = `
      UPDATE wishlist_items
      SET 
        is_purchased = $2,
        purchased_at = CASE WHEN $2 = true THEN NOW() ELSE NULL END
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, is_purchased, purchased_at
    `

    const result = await query(sql, [id, newStatus])

    res.json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('[Wishlist] Error toggling purchased:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to toggle purchased status' }
    })
  }
}

/**
 * POST /api/wishlist/:id/heart
 * Heart a wishlist item
 */
export const heartItem = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.body

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Check if item exists
    const checkSql = `SELECT id FROM wishlist_items WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Wishlist item not found' }
      })
    }

    // Check if already hearted
    const heartCheckSql = `SELECT id FROM wishlist_hearts WHERE wishlist_item_id = $1 AND user_id = $2`
    const heartCheckResult = await query(heartCheckSql, [id, user_id])

    if (heartCheckResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'ALREADY_HEARTED', message: 'Item already hearted by this user' }
      })
    }

    // Insert heart (trigger will update heart_count)
    const insertSql = `INSERT INTO wishlist_hearts (wishlist_item_id, user_id) VALUES ($1, $2)`
    await query(insertSql, [id, user_id])

    // Get updated heart_count
    const countSql = `SELECT heart_count FROM wishlist_items WHERE id = $1`
    const countResult = await query(countSql, [id])

    res.status(201).json({
      success: true,
      data: {
        heart_count: countResult.rows[0].heart_count,
        user_liked: true
      }
    })

  } catch (error) {
    console.error('[Wishlist] Error hearting item:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to heart item' }
    })
  }
}

/**
 * DELETE /api/wishlist/:id/heart
 * Unheart a wishlist item
 */
export const unheartItem = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id } = req.query

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Check if hearted
    const checkSql = `SELECT id FROM wishlist_hearts WHERE wishlist_item_id = $1 AND user_id = $2`
    const checkResult = await query(checkSql, [id, user_id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_HEARTED', message: 'Item not hearted by this user' }
      })
    }

    // Delete heart (trigger will update heart_count)
    const deleteSql = `DELETE FROM wishlist_hearts WHERE wishlist_item_id = $1 AND user_id = $2`
    await query(deleteSql, [id, user_id])

    // Get updated heart_count
    const countSql = `SELECT heart_count FROM wishlist_items WHERE id = $1`
    const countResult = await query(countSql, [id])

    res.json({
      success: true,
      data: {
        heart_count: countResult.rows[0].heart_count,
        user_liked: false
      }
    })

  } catch (error) {
    console.error('[Wishlist] Error unhearting item:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to unheart item' }
    })
  }
}

/**
 * GET /api/wishlist/:id/comments
 * Get all comments for a wishlist item
 */
export const getComments = async (req, res) => {
  try {
    const { id } = req.params

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    // Get comments with user info
    const sql = `
      SELECT 
        wc.id,
        wc.comment_text,
        wc.created_at,
        wc.updated_at,
        wc.user_id,
        u.name as user_name,
        u.email as user_email
      FROM wishlist_comments wc
      JOIN users u ON wc.user_id = u.id
      WHERE wc.wishlist_item_id = $1 AND wc.deleted_at IS NULL
      ORDER BY wc.created_at ASC
    `

    const result = await query(sql, [id])

    res.json({
      success: true,
      data: result.rows
    })

  } catch (error) {
    console.error('[Wishlist] Error fetching comments:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch comments' }
    })
  }
}

/**
 * POST /api/wishlist/:id/comments
 * Add a comment to a wishlist item
 */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { user_id, comment_text } = req.body

    // Validation
    if (!validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid wishlist item ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    if (!comment_text || comment_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_COMMENT', message: 'Comment text cannot be empty' }
      })
    }

    // Check if item exists
    const checkSql = `SELECT id FROM wishlist_items WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Wishlist item not found' }
      })
    }

    // Sanitize comment
    const sanitizedComment = sanitizeComment(comment_text)

    if (sanitizedComment.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_COMMENT', message: 'Comment text cannot be empty after sanitization' }
      })
    }

    // Insert comment
    const sql = `
      INSERT INTO wishlist_comments (wishlist_item_id, user_id, comment_text)
      VALUES ($1, $2, $3)
      RETURNING 
        id, comment_text, created_at, updated_at, user_id
    `

    const result = await query(sql, [id, user_id, sanitizedComment])

    // Get user info
    const userSql = `SELECT name, email FROM users WHERE id = $1`
    const userResult = await query(userSql, [user_id])

    const comment = {
      ...result.rows[0],
      user_name: userResult.rows[0].name,
      user_email: userResult.rows[0].email
    }

    res.status(201).json({
      success: true,
      data: comment
    })

  } catch (error) {
    console.error('[Wishlist] Error adding comment:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to add comment' }
    })
  }
}

/**
 * PUT /api/wishlist/comments/:comment_id
 * Update a comment
 */
export const updateComment = async (req, res) => {
  try {
    const { comment_id } = req.params
    const { user_id, comment_text } = req.body

    // Validation
    if (!validateUUID(comment_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid comment ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    if (!comment_text || comment_text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_COMMENT', message: 'Comment text cannot be empty' }
      })
    }

    // Check ownership
    const checkSql = `SELECT user_id FROM wishlist_comments WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [comment_id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Comment not found' }
      })
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to update this comment' }
      })
    }

    // Sanitize comment
    const sanitizedComment = sanitizeComment(comment_text)

    if (sanitizedComment.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_COMMENT', message: 'Comment text cannot be empty after sanitization' }
      })
    }

    // Update comment
    const sql = `
      UPDATE wishlist_comments
      SET comment_text = $2
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, comment_text, created_at, updated_at, user_id
    `

    const result = await query(sql, [comment_id, sanitizedComment])

    res.json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('[Wishlist] Error updating comment:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to update comment' }
    })
  }
}

/**
 * DELETE /api/wishlist/comments/:comment_id
 * Soft delete a comment
 */
export const deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params
    const { user_id } = req.query

    // Validation
    if (!validateUUID(comment_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid comment ID' }
      })
    }

    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Check ownership
    const checkSql = `SELECT user_id FROM wishlist_comments WHERE id = $1 AND deleted_at IS NULL`
    const checkResult = await query(checkSql, [comment_id])

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Comment not found' }
      })
    }

    if (checkResult.rows[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You do not have permission to delete this comment' }
      })
    }

    // Soft delete
    const sql = `
      UPDATE wishlist_comments
      SET deleted_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `

    await query(sql, [comment_id])

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.error('[Wishlist] Error deleting comment:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete comment' }
    })
  }
}

/**
 * GET /api/wishlist/stats
 * Get wishlist statistics
 */
export const getStats = async (req, res) => {
  try {
    const { user_id } = req.query

    // Validation
    if (!user_id || !validateUUID(user_id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_USER_ID', message: 'Valid user_id is required' }
      })
    }

    // Total items and value
    const totalSql = `
      SELECT 
        COUNT(*) as total_items,
        COALESCE(SUM(CASE WHEN price IS NOT NULL THEN price ELSE 0 END), 0) as total_value,
        COUNT(CASE WHEN is_purchased = true THEN 1 END) as purchased_count,
        COUNT(CASE WHEN is_purchased = false THEN 1 END) as unpurchased_count
      FROM wishlist_items
      WHERE deleted_at IS NULL
    `
    const totalResult = await query(totalSql)

    // Top hearted items
    const topHeartedSql = `
      SELECT 
        id, product_name, product_image_url, heart_count, price, currency
      FROM wishlist_items
      WHERE deleted_at IS NULL AND heart_count > 0
      ORDER BY heart_count DESC
      LIMIT 5
    `
    const topHeartedResult = await query(topHeartedSql)

    // Categories breakdown
    const categoriesSql = `
      SELECT 
        category,
        COUNT(*) as count,
        COALESCE(SUM(price), 0) as total_value
      FROM wishlist_items
      WHERE deleted_at IS NULL AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `
    const categoriesResult = await query(categoriesSql)

    // Recent purchases
    const recentPurchasesSql = `
      SELECT 
        id, product_name, product_image_url, price, currency, purchased_at
      FROM wishlist_items
      WHERE is_purchased = true AND deleted_at IS NULL
      ORDER BY purchased_at DESC
      LIMIT 5
    `
    const recentPurchasesResult = await query(recentPurchasesSql)

    res.json({
      success: true,
      data: {
        total_items: parseInt(totalResult.rows[0].total_items),
        total_value: parseFloat(totalResult.rows[0].total_value),
        purchased_count: parseInt(totalResult.rows[0].purchased_count),
        unpurchased_count: parseInt(totalResult.rows[0].unpurchased_count),
        top_hearted: topHeartedResult.rows,
        categories: categoriesResult.rows,
        recent_purchases: recentPurchasesResult.rows
      }
    })

  } catch (error) {
    console.error('[Wishlist] Error fetching stats:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch stats' }
    })
  }
}

/**
 * POST /api/wishlist/extract-metadata
 * Extract metadata from a URL
 */
export const extractUrlMetadata = async (req, res) => {
  try {
    const { url } = req.body

    // Validation
    if (!url || !validateURL(url)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_URL', message: 'Valid URL is required' }
      })
    }

    // Extract metadata
    const metadata = await extractMetadata(url)

    if (!metadata) {
      return res.status(422).json({
        success: false,
        error: { code: 'EXTRACTION_FAILED', message: 'Failed to extract metadata from URL' }
      })
    }

    res.json({
      success: true,
      data: metadata
    })

  } catch (error) {
    console.error('[Wishlist] Error extracting metadata:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to extract metadata' }
    })
  }
}

export default {
  getWishlistItems,
  createWishlistItem,
  updateWishlistItem,
  deleteWishlistItem,
  togglePurchased,
  heartItem,
  unheartItem,
  getComments,
  addComment,
  updateComment,
  deleteComment,
  getStats,
  extractUrlMetadata
}
