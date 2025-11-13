import { test, expect } from '@playwright/test'
import { NotesPage } from '../pages/NotesPage.js'

test.describe('Notes Debug @e2e', () => {
  let notesPage
  
  test.beforeEach(async ({ page }) => {
    notesPage = new NotesPage(page)
    await notesPage.goto()
  })

  test('Debug: Create note step by step', async ({ page }) => {
    console.log('Step 1: Click add button')
    await notesPage.clickAddButton()
    await page.waitForTimeout(1000)
    
    console.log('Step 2: Verify form is visible')
    await notesPage.expectFormVisible()
    
    console.log('Step 3: Fill title')
    const titleInput = await notesPage.getElement(notesPage.selectors.titleInput)
    await titleInput.fill('Debug Test Note')
    await page.waitForTimeout(500)
    
    console.log('Step 4: Fill content')
    const contentInput = await notesPage.getElement(notesPage.selectors.contentInput)
    await contentInput.fill('This is debug content')
    await page.waitForTimeout(500)
    
    console.log('Step 5: Click save')
    const saveBtn = await notesPage.getElement(notesPage.selectors.saveButton)
    await saveBtn.click()
    
    console.log('Step 6: Wait for network')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)
    
    console.log('Step 7: Take screenshot')
    await page.screenshot({ path: 'debug-after-save.png', fullPage: true })
    
    console.log('Step 8: Check for notes')
    const noteCards = page.locator('div.bg-gradient-to-br:has(h3)')
    const count = await noteCards.count()
    console.log(`Found ${count} note cards`)
    
    if (count > 0) {
      const firstCard = noteCards.first()
      const html = await firstCard.innerHTML()
      console.log('First card HTML:', html.substring(0, 200))
    }
  })
})
