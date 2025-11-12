/**
 * Wedding Invitation URL Controller
 * @description Handle wedding invitation URL CRUD operations
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/06_wedding_invitation_url_encoder.spec
 */

import { query } from '#config/database.config.js'
import { validateUUID } from '#utils/validation.js'

/**
 * POST /api/wedding-urls
 * Create or update base URL for wedding invitation
 * @body { baseUrl: string }
 */
export const saveWeddingUrl = async (req, res) => {
  try {
    const { baseUrl } = req.body
    const userId = req.user?.id

    // Validation - user authentication
    if (!userId || !validateUUID(userId)) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User authentication required' }
      })
    }

    // Validation - base URL required
    if (!baseUrl || baseUrl.trim() === '') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_URL', message: 'Base URL is required' }
      })
    }

    // Validation - URL format (must start with http:// or https://)
    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(baseUrl)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_FORMAT', message: 'URL must start with http:// or https://' }
      })
    }

    // Validation - max length
    if (baseUrl.length > 500) {
      return res.status(400).json({
        success: false,
        error: { code: 'URL_TOO_LONG', message: 'URL must be less than 500 characters' }
      })
    }

    // Soft delete previous active URLs for this user
    await query(
      `UPDATE wedding_urls 
       SET deleted_at = NOW(), updated_at = NOW() 
       WHERE user_id = $1 AND deleted_at IS NULL`,
      [userId]
    )

    // Insert new URL
    const result = await query(
      `INSERT INTO wedding_urls (user_id, base_url) 
       VALUES ($1, $2) 
       RETURNING id, base_url, created_at`,
      [userId, baseUrl]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error saving wedding URL:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to save wedding URL' }
    })
  }
}

/**
 * GET /api/wedding-urls/latest
 * Get latest active wedding URL for the authenticated user
 */
export const getLatestWeddingUrl = async (req, res) => {
  try {
    const userId = req.user?.id

    // Validation - user authentication
    if (!userId || !validateUUID(userId)) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User authentication required' }
      })
    }

    // Query latest active URL
    const result = await query(
      `SELECT id, base_url, created_at 
       FROM wedding_urls 
       WHERE user_id = $1 AND deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    )

    // No URL found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'URL_NOT_FOUND', message: 'No wedding invitation URL found. Please add one.' }
      })
    }

    res.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching wedding URL:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to fetch wedding URL' }
    })
  }
}

/**
 * DELETE /api/wedding-urls/:id
 * Soft delete a wedding URL
 * @param id - UUID of the wedding URL
 */
export const deleteWeddingUrl = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Validation - user authentication
    if (!userId || !validateUUID(userId)) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User authentication required' }
      })
    }

    // Validation - URL ID
    if (!id || !validateUUID(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Valid URL ID is required' }
      })
    }

    // Soft delete URL (only if owned by user)
    const result = await query(
      `UPDATE wedding_urls 
       SET deleted_at = NOW(), updated_at = NOW() 
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL 
       RETURNING id`,
      [id, userId]
    )

    // URL not found or not owned by user
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'URL_NOT_FOUND', message: 'Wedding invitation URL not found' }
      })
    }

    res.json({
      success: true,
      message: 'Wedding invitation URL deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting wedding URL:', error)
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Failed to delete wedding URL' }
    })
  }
}
