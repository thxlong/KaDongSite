/**
 * Data Migration Script: localStorage to PostgreSQL
 * 
 * This script helps migrate existing data from browser localStorage
 * to the PostgreSQL database.
 * 
 * Usage:
 * 1. Export localStorage data from browser console:
 *    - Open browser DevTools (F12)
 *    - Run: console.log(JSON.stringify({
 *        notes: JSON.parse(localStorage.getItem('notes') || '[]'),
 *        countdowns: JSON.parse(localStorage.getItem('countdowns') || '[]')
 *      }))
 *    - Copy the output
 * 
 * 2. Save the output to data.json in this scripts folder
 * 
 * 3. Run: node backend/scripts/migrate-localStorage.js
 */

import pool from '../config/database.js'
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const DATA_FILE = join(__dirname, 'data.json')
const USER_ID = '00000000-0000-0000-0000-000000000001' // Test user UUID from seeds

async function migrateNotes(notes) {
  console.log(`\n📝 Migrating ${notes.length} notes...`)
  let successCount = 0
  let errorCount = 0

  for (const note of notes) {
    try {
      // Check if note already exists (by title and content to avoid duplicates)
      const existing = await pool.query(
        `SELECT id FROM notes 
         WHERE user_id = $1 AND title = $2 AND content = $3 AND deleted_at IS NULL`,
        [USER_ID, note.title, note.content]
      )

      if (existing.rows.length > 0) {
        console.log(`  ⚠️  Skipping duplicate: "${note.title}"`)
        continue
      }

      // Insert note
      await pool.query(
        `INSERT INTO notes (user_id, title, content, color, pinned, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          USER_ID,
          note.title,
          note.content,
          note.color || 'pink',
          note.pinned || false,
          note.createdAt || new Date().toISOString(),
          note.updatedAt || new Date().toISOString()
        ]
      )

      successCount++
      console.log(`  ✅ Migrated: "${note.title}"`)
    } catch (error) {
      errorCount++
      console.error(`  ❌ Error migrating note "${note.title}":`, error.message)
    }
  }

  console.log(`\n📊 Notes migration complete: ${successCount} success, ${errorCount} errors`)
  return { success: successCount, errors: errorCount }
}

async function migrateCountdowns(countdowns) {
  console.log(`\n🎉 Migrating ${countdowns.length} countdown events...`)
  let successCount = 0
  let errorCount = 0

  for (const countdown of countdowns) {
    try {
      // Check if event already exists
      const existing = await pool.query(
        `SELECT id FROM countdown_events 
         WHERE user_id = $1 AND title = $2 AND event_date = $3 AND deleted_at IS NULL`,
        [USER_ID, countdown.title, countdown.date]
      )

      if (existing.rows.length > 0) {
        console.log(`  ⚠️  Skipping duplicate: "${countdown.title}"`)
        continue
      }

      // Insert event
      await pool.query(
        `INSERT INTO countdown_events (user_id, title, event_date, color, recurring, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          USER_ID,
          countdown.title,
          countdown.date,
          countdown.color || 'from-pastel-pink to-pastel-purple',
          countdown.recurring || null,
          countdown.createdAt || new Date().toISOString(),
          countdown.updatedAt || new Date().toISOString()
        ]
      )

      successCount++
      console.log(`  ✅ Migrated: "${countdown.title}"`)
    } catch (error) {
      errorCount++
      console.error(`  ❌ Error migrating countdown "${countdown.title}":`, error.message)
    }
  }

  console.log(`\n📊 Countdowns migration complete: ${successCount} success, ${errorCount} errors`)
  return { success: successCount, errors: errorCount }
}

async function main() {
  console.log('🚀 Starting localStorage to Database Migration\n')
  console.log(`Target User ID: ${USER_ID}\n`)

  // Check if data file exists
  if (!existsSync(DATA_FILE)) {
    console.error(`❌ Error: ${DATA_FILE} not found!`)
    console.log('\nPlease follow these steps:')
    console.log('1. Open your browser DevTools (F12)')
    console.log('2. Run this in the console:')
    console.log(`   console.log(JSON.stringify({
     notes: JSON.parse(localStorage.getItem('notes') || '[]'),
     countdowns: JSON.parse(localStorage.getItem('countdowns') || '[]')
   }))`)
    console.log('3. Copy the output and save it to backend/scripts/data.json')
    console.log('4. Run this script again\n')
    process.exit(1)
  }

  try {
    // Read data file
    const rawData = readFileSync(DATA_FILE, 'utf-8')
    const data = JSON.parse(rawData)

    console.log(`📦 Found ${data.notes?.length || 0} notes and ${data.countdowns?.length || 0} countdowns\n`)

    // Migrate notes
    const notesResult = await migrateNotes(data.notes || [])

    // Migrate countdowns
    const countdownsResult = await migrateCountdowns(data.countdowns || [])

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 MIGRATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`Notes:      ${notesResult.success} ✅  ${notesResult.errors} ❌`)
    console.log(`Countdowns: ${countdownsResult.success} ✅  ${countdownsResult.errors} ❌`)
    console.log('='.repeat(50) + '\n')

    console.log('✅ Migration completed successfully!')
    console.log('\n💡 Next steps:')
    console.log('1. Verify data in the database')
    console.log('2. Test the application')
    console.log('3. Once confirmed, you can delete data.json\n')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
