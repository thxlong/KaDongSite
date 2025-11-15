import pool from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrations = [
  '002_create_rbac_tables.sql',
  '003_create_audit_logs.sql',
  '004_create_security_tables.sql',
  '005_add_user_security_columns.sql'
];

async function runMigrations() {
  console.log('\n🔧 Running admin dashboard migrations...\n');

  try {
    // Test connection first
    await pool.query('SELECT 1');
    console.log('✅ Database connected\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return;
  }

  for (const migration of migrations) {
    const migrationPath = path.join(__dirname, 'database', 'migrations', migration);
    
    try {
      console.log(`📄 Running: ${migration}`);
      
      if (!fs.existsSync(migrationPath)) {
        console.error(`❌ File not found: ${migrationPath}\n`);
        continue;
      }
      
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      await pool.query(sql);
      
      console.log(`✅ Success: ${migration}\n`);
    } catch (error) {
      console.error(`❌ Failed: ${migration}`);
      console.error(`   Error: ${error.message}\n`);
      
      // Continue with other migrations even if one fails
      continue;
    }
  }

  // Verify tables exist
  console.log('\n🔍 Verifying created tables...\n');
  
  const tables = ['roles', 'user_roles', 'audit_logs', 'security_alerts', 'blocked_ips'];
  
  for (const table of tables) {
    try {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        );
      `, [table]);
      
      if (result.rows[0].exists) {
        console.log(`✅ ${table} - exists`);
      } else {
        console.log(`❌ ${table} - missing`);
      }
    } catch (error) {
      console.error(`❌ ${table} - error checking`);
    }
  }

  // Verify new columns on users table
  console.log('\n🔍 Verifying users table columns...\n');
  
  const columns = ['locked_at', 'lock_reason', 'last_login_at', 'failed_login_attempts'];
  
  try {
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = ANY($1)
    `, [columns]);
    
    const existingColumns = result.rows.map(r => r.column_name);
    
    for (const col of columns) {
      if (existingColumns.includes(col)) {
        console.log(`✅ users.${col} - exists`);
      } else {
        console.log(`❌ users.${col} - missing`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking users columns');
  }

  console.log('\n✨ Migration process completed!\n');
  
  await pool.end();
}

runMigrations().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});
