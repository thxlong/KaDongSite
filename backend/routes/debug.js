/**
 * Debug Routes - DEVELOPMENT ONLY
 * Quick routes for seeding and testing
 */

import express from 'express'
import { query } from '../config/database.js'
import bcrypt from 'bcrypt'

const router = express.Router()

/**
 * POST /api/debug/seed-users
 * Seed admin and guest users (deletes all existing users)
 */
router.post('/seed-users', async (req, res) => {
  try {
    console.log('[DEBUG] Seeding users...')
    
    // Delete all existing users
    await query('DELETE FROM users')
    console.log('[DEBUG] Deleted all existing users')
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10)
    const guestPassword = await bcrypt.hash('guest123', 10)
    
    // Insert admin user
    await query(
      `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      ['550e8400-e29b-41d4-a716-446655440000', 'admin@kadong.com', adminPassword, 'Administrator', 'admin']
    )
    console.log('[DEBUG] Created admin user')
    
    // Insert guest user
    await query(
      `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      ['550e8400-e29b-41d4-a716-446655440099', 'guest@kadong.com', guestPassword, 'Guest User', 'user']
    )
    console.log('[DEBUG] Created guest user')
    
    // Get all users
    const result = await query('SELECT id, email, name, role, created_at FROM users ORDER BY role DESC')
    
    res.json({
      success: true,
      message: 'Users seeded successfully',
      data: {
        users: result.rows,
        credentials: {
          admin: {
            email: 'admin@kadong.com',
            password: 'admin123',
            role: 'admin',
            permissions: 'Full access - Create, Read, Update, Delete'
          },
          guest: {
            email: 'guest@kadong.com',
            password: 'guest123',
            role: 'user',
            permissions: 'Read-only access'
          }
        }
      }
    })
  } catch (error) {
    console.error('[DEBUG] Error seeding users:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'SEED_FAILED',
        message: error.message
      }
    })
  }
})

/**
 * GET /api/debug/users
 * List all users in database
 */
router.get('/users', async (req, res) => {
  try {
    const result = await query(`
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      ORDER BY role DESC, created_at DESC
    `)
    
    res.json({
      success: true,
      data: {
        total: result.rows.length,
        users: result.rows
      }
    })
  } catch (error) {
    console.error('[DEBUG] Error listing users:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'QUERY_FAILED',
        message: error.message
      }
    })
  }
})

export default router
