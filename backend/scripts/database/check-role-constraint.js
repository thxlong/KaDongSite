import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new pkg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kadongsite',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432
})

const result = await pool.query(`
  SELECT pg_get_constraintdef(oid) as definition 
  FROM pg_constraint 
  WHERE conname = 'users_role_check'
`)

console.log('Role constraint:', result.rows[0]?.definition)
await pool.end()
