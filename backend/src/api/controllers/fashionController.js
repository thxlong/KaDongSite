import { pool } from '#config/database.config.js'
import { TEST_USER_ID } from '#config/constants.config.js'

// GET all fashion outfits for a user
export const getOutfits = async (req, res) => {
  try {
    const userId = req.query.user_id || TEST_USER_ID // TODO: Get from auth middleware
    
    const result = await pool.query(
      `SELECT id, user_id, name, shirt_color, pants_color, shoes_color, 
              hat_color, bag_color, created_at, updated_at
       FROM fashion_outfits
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [userId]
    )

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    })
  } catch (error) {
    console.error('Error fetching outfits:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch outfits',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// GET outfit by ID
export const getOutfitById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.user_id || TEST_USER_ID

    const result = await pool.query(
      `SELECT id, user_id, name, shirt_color, pants_color, shoes_color,
              hat_color, bag_color, created_at, updated_at
       FROM fashion_outfits
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Outfit not found'
      })
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error fetching outfit:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch outfit',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// POST create new outfit
export const createOutfit = async (req, res) => {
  try {
    // Accept both camelCase and snake_case for compatibility
    const name = req.body.name
    const shirtColor = req.body.shirtColor || req.body.shirt_color
    const pantsColor = req.body.pantsColor || req.body.pants_color
    const shoesColor = req.body.shoesColor || req.body.shoes_color
    const hatColor = req.body.hatColor || req.body.hat_color
    const bagColor = req.body.bagColor || req.body.bag_color
    const userId = req.body.user_id || TEST_USER_ID

    // Validation
    if (!name || !shirtColor || !pantsColor || !shoesColor) {
      return res.status(400).json({
        success: false,
        error: 'Name, shirt color, pants color, and shoes color are required'
      })
    }

    if (name.length < 1 || name.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 1 and 100 characters'
      })
    }

    const validColors = [
      'red', 'orange', 'yellow', 'green', 'blue',
      'purple', 'brown', 'black', 'white', 'gray',
      'pink', 'peach', 'cream', 'mint', 'sky'
    ]

    const colorsToValidate = [
      { name: 'shirt', value: shirtColor },
      { name: 'pants', value: pantsColor },
      { name: 'shoes', value: shoesColor }
    ]

    if (hatColor) colorsToValidate.push({ name: 'hat', value: hatColor })
    if (bagColor) colorsToValidate.push({ name: 'bag', value: bagColor })

    for (const color of colorsToValidate) {
      if (!validColors.includes(color.value)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${color.name} color: ${color.value}`
        })
      }
    }

    const result = await pool.query(
      `INSERT INTO fashion_outfits 
       (user_id, name, shirt_color, pants_color, shoes_color, hat_color, bag_color)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, name, shirt_color, pants_color, shoes_color, 
                 hat_color, bag_color, created_at, updated_at`,
      [userId, name, shirtColor, pantsColor, shoesColor, hatColor || null, bagColor || null]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating outfit:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create outfit',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// PUT update outfit
export const updateOutfit = async (req, res) => {
  try {
    const { id } = req.params
    // Accept both camelCase and snake_case for compatibility
    const name = req.body.name
    const shirtColor = req.body.shirtColor || req.body.shirt_color
    const pantsColor = req.body.pantsColor || req.body.pants_color
    const shoesColor = req.body.shoesColor || req.body.shoes_color
    const hatColor = req.body.hatColor || req.body.hat_color
    const bagColor = req.body.bagColor || req.body.bag_color
    const userId = req.body.user_id || TEST_USER_ID

    // Check if outfit exists
    const existingOutfit = await pool.query(
      'SELECT id FROM fashion_outfits WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL',
      [id, userId]
    )

    if (existingOutfit.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Outfit not found'
      })
    }

    // Validation
    if (name && (name.length < 1 || name.length > 100)) {
      return res.status(400).json({
        success: false,
        error: 'Name must be between 1 and 100 characters'
      })
    }

    const validColors = [
      'red', 'orange', 'yellow', 'green', 'blue',
      'purple', 'brown', 'black', 'white', 'gray',
      'pink', 'peach', 'cream', 'mint', 'sky'
    ]

    const colorsToValidate = []
    if (shirtColor) colorsToValidate.push({ name: 'shirt', value: shirtColor })
    if (pantsColor) colorsToValidate.push({ name: 'pants', value: pantsColor })
    if (shoesColor) colorsToValidate.push({ name: 'shoes', value: shoesColor })
    if (hatColor) colorsToValidate.push({ name: 'hat', value: hatColor })
    if (bagColor) colorsToValidate.push({ name: 'bag', value: bagColor })

    for (const color of colorsToValidate) {
      if (!validColors.includes(color.value)) {
        return res.status(400).json({
          success: false,
          error: `Invalid ${color.name} color: ${color.value}`
        })
      }
    }

    // Build dynamic update query
    const updates = []
    const values = []
    let paramCounter = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCounter++}`)
      values.push(name)
    }
    if (shirtColor !== undefined) {
      updates.push(`shirt_color = $${paramCounter++}`)
      values.push(shirtColor)
    }
    if (pantsColor !== undefined) {
      updates.push(`pants_color = $${paramCounter++}`)
      values.push(pantsColor)
    }
    if (shoesColor !== undefined) {
      updates.push(`shoes_color = $${paramCounter++}`)
      values.push(shoesColor)
    }
    if (hatColor !== undefined) {
      updates.push(`hat_color = $${paramCounter++}`)
      values.push(hatColor)
    }
    if (bagColor !== undefined) {
      updates.push(`bag_color = $${paramCounter++}`)
      values.push(bagColor)
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      })
    }

    values.push(id, userId)

    const result = await pool.query(
      `UPDATE fashion_outfits
       SET ${updates.join(', ')}
       WHERE id = $${paramCounter++} AND user_id = $${paramCounter++} AND deleted_at IS NULL
       RETURNING id, user_id, name, shirt_color, pants_color, shoes_color,
                 hat_color, bag_color, created_at, updated_at`,
      values
    )

    res.status(200).json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error updating outfit:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update outfit',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

// DELETE outfit (soft delete)
export const deleteOutfit = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.query.user_id || TEST_USER_ID

    const result = await pool.query(
      `UPDATE fashion_outfits
       SET deleted_at = NOW()
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
       RETURNING id, name`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Outfit not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Outfit deleted successfully',
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error deleting outfit:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete outfit',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}
