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

const checkTable = async () => {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'sessions'
      ORDER BY ordinal_position
    `)
    
    console.log('Sessions table columns:')
    result.rows.forEach(col => {
      console.log(`  ${col.column_name.padEnd(20)} ${col.data_type.padEnd(30)} ${col.is_nullable}`)
    })
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkTable()
