/**
 * Debug Routes - DEVELOPMENT ONLY
 * Quick routes for seeding and testing
 */

import express from 'express'
import { query } from '#config/database.config.js'
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
    const adminPassword = await bcrypt.hash('Admin123!@#', 10)
    const guestPassword = await bcrypt.hash('Admin123!@#', 10)
    
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
            password: 'Admin123!@#',
            role: 'admin',
            permissions: 'Full access - Create, Read, Update, Delete'
          },
          guest: {
            email: 'guest@kadong.com',
            password: 'Admin123!@#',
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

/**
 * POST /api/debug/migrate-currency
 * Run currency_rates migration and seed
 */
router.post('/migrate-currency', async (req, res) => {
  try {
    console.log('[DEBUG] Running currency migration...')
    
    // Drop table if exists
    await query('DROP TABLE IF EXISTS currency_rates CASCADE')
    console.log('[DEBUG] Dropped existing table')
    
    // Create table
    await query(`
      CREATE TABLE currency_rates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        base_currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        target_currency VARCHAR(3) NOT NULL,
        rate NUMERIC(15, 6) NOT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source VARCHAR(50) DEFAULT 'exchangerate-api',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(base_currency, target_currency)
      )
    `)
    console.log('[DEBUG] Created currency_rates table')
    
    // Create indexes
    await query('CREATE INDEX idx_currency_rates_base_target ON currency_rates(base_currency, target_currency)')
    await query('CREATE INDEX idx_currency_rates_last_updated ON currency_rates(last_updated DESC)')
    console.log('[DEBUG] Created indexes')
    
    // Seed initial data
    await query(`
      INSERT INTO currency_rates (base_currency, target_currency, rate, source, last_updated) VALUES
        ('USD', 'USD', 1.000000, 'fixed', CURRENT_TIMESTAMP),
        ('USD', 'VND', 26345.00, 'exchangerate-api', CURRENT_TIMESTAMP),
        ('USD', 'EUR', 0.92, 'exchangerate-api', CURRENT_TIMESTAMP),
        ('USD', 'GBP', 0.79, 'exchangerate-api', CURRENT_TIMESTAMP),
        ('USD', 'JPY', 149.50, 'exchangerate-api', CURRENT_TIMESTAMP),
        ('USD', 'KRW', 1320.00, 'exchangerate-api', CURRENT_TIMESTAMP),
        ('USD', 'CNY', 7.24, 'exchangerate-api', CURRENT_TIMESTAMP),
        ('USD', 'THB', 35.50, 'exchangerate-api', CURRENT_TIMESTAMP)
    `)
    console.log('[DEBUG] Seeded currency rates')
    
    const result = await query('SELECT * FROM currency_rates ORDER BY target_currency')
    
    res.json({
      success: true,
      message: 'Currency migration completed successfully',
      data: {
        total: result.rows.length,
        rates: result.rows
      }
    })
  } catch (error) {
    console.error('[DEBUG] Error in currency migration:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'MIGRATION_FAILED',
        message: error.message
      }
    })
  }
})

export default router
