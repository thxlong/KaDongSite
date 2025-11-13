/**
 * Add revoked_at column to sessions table
 */

import pkg from 'pg'
const { Pool } = pkg
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kadongdb',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432')
})

async function addRevokedAtColumn() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Starting migration: Add revoked_at column to sessions table...')
    
    // Check if column exists
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='sessions' AND column_name='revoked_at'
    `)
    
    if (checkColumn.rows.length > 0) {
      console.log('⚠️  Column revoked_at already exists in sessions table')
      return
    }
    
    // Add revoked_at column
    await client.query(`
      ALTER TABLE sessions ADD COLUMN revoked_at TIMESTAMP
    `)
    console.log('✅ Added revoked_at column to sessions table')
    
    // Add index for revoked_at
    await client.query(`
      CREATE INDEX idx_sessions_revoked_at ON sessions(revoked_at)
    `)
    console.log('✅ Created index idx_sessions_revoked_at')
    
    // Update existing indexes to exclude revoked sessions
    await client.query(`DROP INDEX IF EXISTS idx_sessions_user_id`)
    await client.query(`
      CREATE INDEX idx_sessions_user_id ON sessions(user_id) WHERE revoked_at IS NULL
    `)
    console.log('✅ Updated idx_sessions_user_id to exclude revoked sessions')
    
    await client.query(`DROP INDEX IF EXISTS idx_sessions_token_hash`)
    await client.query(`
      CREATE INDEX idx_sessions_token_hash ON sessions(token_hash) WHERE revoked_at IS NULL
    `)
    console.log('✅ Updated idx_sessions_token_hash to exclude revoked sessions')
    
    console.log('✅ Migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

addRevokedAtColumn()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
