import { test, expect } from '@playwright/test'

/**
 * Notes Tool - End-to-End Tests
 * Tests complete user workflows
 */

test.describe('Notes Tool - E2E @e2e', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to notes page
    await page.goto('/notes')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })
  
  test('should display notes page correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Notes/)
    
    // Verify main components
    await expect(page.locator('h1')).toContainText('Notes')
    await expect(page.locator('[data-testid="add-note-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
  })
  
  test('should create new note', async ({ page }) => {
    // Click add note button
    await page.click('[data-testid="add-note-button"]')
    
    // Fill in note form
    await page.fill('[name="title"]', 'E2E Test Note')
    await page.fill('[name="content"]', 'This note was created by E2E test')
    
    // Select color
    await page.click('[data-color="pink"]')
    
    // Save note
    await page.click('button:has-text("Save")')
    
    // Verify note appears
    await expect(page.locator('text=E2E Test Note')).toBeVisible()
    
    // Verify success notification
    await expect(page.locator('.toast-success, .notification-success')).toBeVisible()
  })
  
  test('should search notes', async ({ page }) => {
    // Type in search box
    await page.fill('[data-testid="search-input"]', 'test')
    
    // Wait for debounce/search
    await page.waitForTimeout(500)
    
    // Verify search results
    const noteCards = page.locator('.note-card')
    const count = await noteCards.count()
    
    // Check each visible note contains search term
    for (let i = 0; i < count; i++) {
      const text = await noteCards.nth(i).textContent()
      expect(text.toLowerCase()).toContain('test')
    }
  })
  
  test('should edit existing note', async ({ page }) => {
    // Click first note
    await page.click('.note-card:first-child')
    
    // Click edit button
    await page.click('[aria-label="Edit"], button:has-text("Edit")')
    
    // Update content
    const newTitle = 'Updated E2E Note ' + Date.now()
    await page.fill('[name="title"]', newTitle)
    
    // Save changes
    await page.click('button:has-text("Save")')
    
    // Verify update
    await expect(page.locator(`text=${newTitle}`)).toBeVisible()
  })
  
  test('should delete note', async ({ page }) => {
    // Get first note title
    const firstNote = page.locator('.note-card:first-child')
    const noteTitle = await firstNote.locator('h3, .note-title').textContent()
    
    // Click delete button
    await firstNote.locator('[aria-label="Delete"], button:has-text("Delete")').click()
    
    // Confirm deletion in modal/dialog
    await page.click('button:has-text("Confirm"), button:has-text("Delete")')
    
    // Verify note removed
    await expect(page.locator(`text=${noteTitle}`)).not.toBeVisible()
  })
  
  test('should filter notes by color', async ({ page }) => {
    // Click color filter
    await page.click('[data-filter="pink"]')
    
    // Verify only pink notes shown
    const notes = page.locator('.note-card')
    const count = await notes.count()
    
    for (let i = 0; i < count; i++) {
      await expect(notes.nth(i)).toHaveClass(/pink|bg-pink/)
    }
  })
  
  test('should persist data after reload', async ({ page }) => {
    // Create unique note
    const uniqueTitle = 'Persist Test ' + Date.now()
    
    await page.click('[data-testid="add-note-button"]')
    await page.fill('[name="title"]', uniqueTitle)
    await page.fill('[name="content"]', 'Should persist')
    await page.click('button:has-text("Save")')
    
    // Verify created
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible()
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Verify still exists
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible()
  })
  
  test('should handle network errors gracefully', async ({ page, context }) => {
    // Simulate offline
    await context.setOffline(true)
    
    // Try to create note
    await page.click('[data-testid="add-note-button"]')
    await page.fill('[name="title"]', 'Offline Note')
    await page.click('button:has-text("Save")')
    
    // Verify error message
    await expect(page.locator('.error, .toast-error, .notification-error')).toBeVisible()
    
    // Go back online
    await context.setOffline(false)
  })
  
  test('should validate required fields', async ({ page }) => {
    // Try to save empty note
    await page.click('[data-testid="add-note-button"]')
    await page.click('button:has-text("Save")')
    
    // Verify validation error
    await expect(page.locator('.error, [class*="error"]')).toBeVisible()
  })
  
  test('should support keyboard navigation', async ({ page }) => {
    // Focus search box with keyboard
    await page.keyboard.press('/')
    
    // Verify search focused
    await expect(page.locator('[data-testid="search-input"]')).toBeFocused()
    
    // Escape to close modal (if any open)
    await page.keyboard.press('Escape')
  })
})
