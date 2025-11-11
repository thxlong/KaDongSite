import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Database configuration
const config = {
  // Option 1: Use connection string
  connectionString: process.env.DATABASE_URL,
  
  // Option 2: Use individual parameters (uncomment if not using DATABASE_URL)
  // host: process.env.DB_HOST || 'localhost',
  // port: parseInt(process.env.DB_PORT || '5432'),
  // database: process.env.DB_NAME || 'kadongsite',
  // user: process.env.DB_USER || 'postgres',
  // password: process.env.DB_PASSWORD,
  
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
  
  // SSL configuration (for production)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Set to true in production with proper certificates
  } : false
}

// Create connection pool
const pool = new Pool(config)

// Event handlers
pool.on('connect', () => {
  console.log('🔌 Database connected')
})

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})

// Test connection function
export const testConnection = async () => {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT NOW() as now, version() as version')
    console.log('✅ Database connection successful')
    console.log('📅 Server time:', result.rows[0].now)
    console.log('🗄️  PostgreSQL version:', result.rows[0].version.split(',')[0])
    client.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

// Query helper with error handling
export const query = async (text, params) => {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('📊 Query executed', { text, duration, rows: result.rowCount })
    return result
  } catch (error) {
    console.error('❌ Query error:', error.message)
    throw error
  }
}

// Transaction helper
export const transaction = async (callback) => {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Transaction error:', error.message)
    throw error
  } finally {
    client.release()
  }
}

// Get a client from pool (for advanced usage)
export const getClient = async () => {
  const client = await pool.connect()
  return client
}

// Close pool (for graceful shutdown)
export const closePool = async () => {
  await pool.end()
  console.log('🔌 Database pool closed')
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await closePool()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  await closePool()
  process.exit(0)
})

export default pool
