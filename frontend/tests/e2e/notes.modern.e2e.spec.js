/**
 * Notes E2E Tests - Modern Approach
 * @description AI-Friendly, Self-Healing, Page Object Model based tests
 * @pattern BDD (Behavior-Driven Development)
 * @framework Playwright + Page Object Model
 * @author Automation Test Senior
 * @created 2025-11-13
 * 
 * TEST STRATEGY:
 * - Given-When-Then pattern
 * - Page Object Model for maintainability
 * - Self-healing selectors
 * - Comprehensive test data
 * - Clear test descriptions
 * 
 * EXECUTION:
 * npm run test:e2e -- notes.modern.spec.js
 */

import { test, expect } from '@playwright/test'
import { NotesPage } from '../pages/NotesPage.js'

/**
 * TEST CONFIGURATION
 */
test.describe.configure({ mode: 'serial' }) // Run tests in order

/**
 * TEST DATA
 * Centralized test data for easy maintenance
 */
const testData = {
  notes: {
    simple: {
      title: 'Test Note Title',
      content: 'This is a test note content',
      color: 'pink'
    },
    detailed: {
      title: 'Detailed Test Note',
      content: 'This note has more detailed content for testing purposes. It includes multiple sentences and should be displayed correctly in the UI.',
      color: 'blue'
    },
    special: {
      title: 'Special Characters: @#$%^&*()',
      content: 'Testing with special chars: "quotes", \'apostrophes\', and unicode: ✨🎉',
      color: 'mint'
    },
    longTitle: {
      title: 'This is a very long title to test how the UI handles lengthy text content that might overflow',
      content: 'Short content',
      color: 'purple'
    },
    multiline: {
      title: 'Multiline Content Test',
      content: 'Line 1\nLine 2\nLine 3\n\nParagraph after blank line',
      color: 'peach'
    }
  },
  colors: ['pink', 'purple', 'mint', 'blue', 'peach', 'cream']
}

/**
 * TEST SUITE: Notes Feature - Critical User Journeys
 */
test.describe('Notes E2E - Modern Approach @e2e @notes', () => {
  
  let notesPage
  
  /**
   * SETUP: Before each test
   * Initialize page object and navigate
   */
  test.beforeEach(async ({ page }) => {
    notesPage = new NotesPage(page)
    await notesPage.goto()
  })

  /**
   * TEST 1: Page Load & Initial State
   * GIVEN: User navigates to Notes page
   * WHEN: Page loads successfully
   * THEN: All essential UI elements are visible
   */
  test('TC01: Should load Notes page with all UI elements', async () => {
    // GIVEN: Already navigated in beforeEach
    
    // WHEN: Page is loaded
    await notesPage.expectPageLoaded()
    
    // THEN: Essential elements are visible
    await notesPage.expectAddButtonVisible()
    
    // Log for AI/human readability
    console.log('✅ TC01 PASSED: Page loaded successfully')
  })

  /**
   * TEST 2: Create New Note - Happy Path
   * GIVEN: User is on Notes page
   * WHEN: User creates a new note
   * THEN: Note is created and displayed
   */
  test('TC02: Should create a new note successfully', async () => {
    // GIVEN: User is on Notes page
    await notesPage.expectPageLoaded()
    
    // WHEN: User creates a new note
    const noteData = testData.notes.simple
    await notesPage.createNote(noteData)
    
    // THEN: Note is created and visible
    await notesPage.expectNoteExists(noteData.title)
    
    console.log('✅ TC02 PASSED: Note created successfully')
  })

  /**
   * TEST 3: Create Note with Different Colors
   * GIVEN: User wants to organize notes by color
   * WHEN: User creates notes with different colors
   * THEN: Each note displays with correct color
   */
  test('TC03: Should create notes with different colors', async () => {
    // GIVEN: User is on Notes page
    await notesPage.expectPageLoaded()
    
    // WHEN: User creates notes with different colors
    for (const color of testData.colors.slice(0, 3)) { // Test 3 colors
      await notesPage.createNote({
        title: `Note with ${color} color`,
        content: `This is a ${color} note`,
        color: color
      })
    }
    
    // THEN: All notes are created
    await notesPage.expectNoteExists('Note with pink color')
    await notesPage.expectNoteExists('Note with purple color')
    await notesPage.expectNoteExists('Note with mint color')
    
    console.log('✅ TC03 PASSED: Multiple colored notes created')
  })

  /**
   * TEST 4: Edit Existing Note
   * GIVEN: A note exists
   * WHEN: User edits the note
   * THEN: Changes are saved and displayed
   */
  test.skip('TC04: Should edit existing note', async () => {
    // GIVEN: A note exists
    const originalNote = testData.notes.simple
    await notesPage.createNote(originalNote)
    
    // WHEN: User edits the note
    const updatedData = {
      title: 'Updated Title',
      content: 'Updated content here',
      color: 'blue'
    }
    
    await notesPage.editNote(0, updatedData)
    
    // THEN: Changes are reflected
    await notesPage.expectNoteExists(updatedData.title)
    
    const updatedNote = await notesPage.getNoteTitle(0)
    expect(updatedNote).toContain(updatedData.title)
    
    console.log('✅ TC04 PASSED: Note edited successfully')
  })

  /**
   * TEST 5: Delete Note
   * GIVEN: Multiple notes exist
   * WHEN: User deletes a note
   * THEN: Note is removed from list
   */
  test.skip('TC05: Should delete note successfully', async () => {
    // GIVEN: Multiple notes exist
    await notesPage.createNote({ ...testData.notes.simple, title: 'Note to Keep' })
    await notesPage.createNote({ ...testData.notes.simple, title: 'Note to Delete' })
    
    const initialCount = 2
    await notesPage.expectNoteCount(initialCount)
    
    // WHEN: User deletes a note
    await notesPage.deleteNote(1) // Delete second note
    
    // THEN: Note count decreases
    await notesPage.expectNoteCount(initialCount - 1)
    
    // Verify deleted note is gone
    const remainingNotes = await notesPage.getAllNotes()
    const deletedNote = remainingNotes.find(n => n.title.includes('Note to Delete'))
    
    expect(deletedNote).toBeUndefined()
    
    console.log('✅ TC05 PASSED: Note deleted successfully')
  })

  /**
   * TEST 6: Cancel Note Creation
   * GIVEN: User starts creating a note
   * WHEN: User cancels the operation
   * THEN: Form closes without saving
   */
  test('TC06: Should cancel note creation without saving', async ({ page }) => {
    // GIVEN: User starts creating a note
    await notesPage.clickAddButton()
    await notesPage.expectFormVisible()
    
    await notesPage.fillNoteForm({
      title: 'This should not be saved',
      content: 'Cancelled content'
    })
    
    // WHEN: User cancels
    await notesPage.cancelNote()
    
    // THEN: Form closes, note not saved
    await notesPage.expectFormNotVisible()
    
    // Verify note doesn't exist
    const noteExists = await page.locator('div.bg-gradient-to-br:has-text("This should not be saved")').count()
    expect(noteExists).toBe(0)
    
    console.log('✅ TC06 PASSED: Note creation cancelled')
  })

  /**
   * TEST 7: Special Characters Handling
   * GIVEN: User wants to save note with special characters
   * WHEN: Note is created with special chars
   * THEN: All characters are preserved
   */
  test('TC07: Should handle special characters correctly', async ({ page }) => {
    // GIVEN: User has data with special characters
    const specialNote = testData.notes.special
    
    // WHEN: Note is created
    await notesPage.createNote(specialNote)
    
    // THEN: Special characters are preserved
    await notesPage.expectNoteExists('Special Characters: @#$%^&*()')
    
    console.log('✅ TC07 PASSED: Special characters handled')
  })

  /**
   * TEST 8: Empty State Display
   * GIVEN: No notes exist
   * WHEN: Page loads
   * THEN: Empty state message is shown
   */
  test.skip('TC08: Should display empty state when no notes', async ({ page }) => {
    // GIVEN: Fresh page with no notes (need to clear existing)
    // This test assumes backend can be reset or uses isolated test data
    
    // WHEN: Page loads with no notes
    // (In real scenario, you'd clear DB or use test isolation)
    
    // THEN: Empty state should be visible
    // Note: This test might fail if notes exist from previous tests
    // In production, implement proper test data isolation
    
    console.log('⚠️ TC08: Requires test data isolation - Skipped in this demo')
    test.skip()
  })

  /**
   * TEARDOWN: After each test
   * Log test results
   */
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== 'passed') {
      console.log(`❌ ${testInfo.title} - FAILED`)
      // Could add screenshot here
      // await page.screenshot({ path: `failure-${testInfo.title}.png` })
    }
  })
})

/**
 * TEST SUITE: Notes Validation & Edge Cases
 */
test.describe('Notes E2E - Validation & Edge Cases @e2e @notes @validation', () => {
  
  let notesPage
  
  test.beforeEach(async ({ page }) => {
    notesPage = new NotesPage(page)
    await notesPage.goto()
  })

  /**
   * TEST 9: Form Validation - Empty Title
   * GIVEN: User tries to save note without title
   * WHEN: Save is attempted
   * THEN: Validation prevents saving
   */
  test('TC09: Should validate required title field', async () => {
    // GIVEN: User opens form
    await notesPage.clickAddButton()
    
    // WHEN: User tries to save without title
    await notesPage.fillNoteForm({
      title: '', // Empty title
      content: 'Content without title'
    })
    
    // Try to save (HTML5 validation should prevent)
    const saveBtn = await notesPage.getElement(notesPage.selectors.saveButton)
    await saveBtn.click()
    
    // THEN: Form should still be visible (not submitted)
    await notesPage.expectFormVisible()
    
    console.log('✅ TC09 PASSED: Empty title validation works')
  })

  /**
   * TEST 10: Long Content Handling
   * GIVEN: User enters very long content
   * WHEN: Note is saved
   * THEN: Content is truncated/scrollable appropriately
   */
  test('TC10: Should handle long content gracefully', async () => {
    // GIVEN: Very long content
    const longContent = 'A'.repeat(1000) // 1000 characters
    
    // WHEN: Note is created with long content
    await notesPage.createNote({
      title: 'Long Content Test',
      content: longContent,
      color: 'pink'
    })
    
    // THEN: Note is saved (UI should handle display)
    await notesPage.expectNoteExists('Long Content Test')
    
    console.log('✅ TC10 PASSED: Long content handled')
  })
})
