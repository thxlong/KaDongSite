/**
 * Notes Page Object Model
 * @description AI-Friendly Page Object với self-healing selectors
 * @pattern Page Object Model (POM)
 * @author Automation Test Senior
 * @created 2025-11-13
 * 
 * ARCHITECTURE:
 * - Multi-selector strategy (primary, fallback, AI-readable)
 * - Self-healing capabilities
 * - Semantic locators prioritized
 * - Data attributes as backup
 */

import { expect } from '@playwright/test'

export class NotesPage {
  constructor(page) {
    this.page = page
    
    /**
     * SELECTOR STRATEGY:
     * 1. Semantic (role, text) - Most stable
     * 2. Data attributes - For test purposes
     * 3. CSS classes - As fallback
     * 4. XPath - Last resort
     * 
     * Each selector has:
     * - primary: Preferred selector
     * - fallback: Backup selectors array
     * - description: Human/AI readable purpose
     */
    this.selectors = {
      // Page Elements
      pageTitle: {
        primary: 'h1:has-text("Ghi chú")',
        fallback: [
          'h1.font-poppins',
          'h1',
          '[data-testid="page-title"]'
        ],
        description: 'Page main heading - "Ghi chú"'
      },
      
      // Actions
      addButton: {
        primary: 'button:has-text("Thêm ghi chú")',
        fallback: [
          'button:has(svg.lucide-plus)',
          'button[class*="bg-gradient"]',
          '[data-testid="add-note-button"]',
          'button:nth-of-type(1)'
        ],
        description: 'Button to add new note'
      },
      
      // Form Elements
      formContainer: {
        primary: 'form.bg-white',
        fallback: [
          'form:has(h3)',
          'form[class*="rounded"]',
          '[data-testid="note-form"]'
        ],
        description: 'Note creation/edit form'
      },
      
      formTitle: {
        primary: 'h3:has-text("ghi chú")',
        fallback: [
          'form h3',
          'h3.font-bold',
          '[data-testid="form-title"]'
        ],
        description: 'Form heading (Tạo/Chỉnh sửa ghi chú)'
      },
      
      titleInput: {
        primary: 'input[placeholder*="Tiêu đề"]',
        fallback: [
          'input[type="text"]',
          'form input:first-of-type',
          '[data-testid="note-title-input"]',
          'input[name="title"]'
        ],
        description: 'Note title input field'
      },
      
      contentInput: {
        primary: 'textarea[placeholder*="Viết"]',
        fallback: [
          'textarea',
          'form textarea',
          '[data-testid="note-content-input"]',
          'textarea[name="content"]'
        ],
        description: 'Note content textarea'
      },
      
      colorPicker: {
        primary: 'div.grid:has(button[class*="from-pastel"])',
        fallback: [
          'div:has(button[class*="from-pastel-pink"])',
          '[data-testid="color-picker"]'
        ],
        description: 'Color selection grid'
      },
      
      colorButton: (colorName) => ({
        primary: `button[class*="from-pastel-${colorName}"]`,
        fallback: [
          `button:has-text("${colorName}")`,
          `[data-color="${colorName}"]`
        ],
        description: `Color button for ${colorName}`
      }),
      
      saveButton: {
        primary: 'button[type="submit"]:has-text("Lưu")',
        fallback: [
          'button:has(svg.lucide-check)',
          'button[class*="bg-green"]',
          '[data-testid="save-button"]',
          'form button[type="submit"]'
        ],
        description: 'Save note button'
      },
      
      cancelButton: {
        primary: 'button:has-text("Hủy")',
        fallback: [
          'button:has(svg.lucide-x)',
          'button[class*="bg-gray"]',
          '[data-testid="cancel-button"]'
        ],
        description: 'Cancel form button'
      },
      
      // Note Cards
      noteCards: {
        primary: 'div.bg-gradient-to-br:has(h3)',
        fallback: [
          'div[class*="rounded-3xl"]:has(h3)',
          '[data-testid="note-card"]',
          '.note-card'
        ],
        description: 'All note cards in grid'
      },
      
      noteCard: (index = 0) => ({
        primary: `div.bg-gradient-to-br:has(h3) >> nth=${index}`,
        fallback: [
          `[data-testid="note-card"]:nth-of-type(${index + 1})`,
          `div[class*="rounded-3xl"]:has(h3) >> nth=${index}`
        ],
        description: `Note card at index ${index}`
      }),
      
      noteTitle: {
        primary: 'h3.font-bold',
        fallback: [
          'h3',
          '[data-testid="note-title"]'
        ],
        description: 'Note card title'
      },
      
      noteContent: {
        primary: 'p.text-gray-700',
        fallback: [
          'p.font-nunito',
          'p',
          '[data-testid="note-content"]'
        ],
        description: 'Note card content'
      },
      
      editButton: {
        primary: 'button:has(svg.lucide-edit-2)',
        fallback: [
          'button[aria-label="Edit"]',
          'button:has-text("Sửa")',
          '[data-testid="edit-button"]'
        ],
        description: 'Edit note button'
      },
      
      deleteButton: {
        primary: 'button:has(svg.lucide-trash-2)',
        fallback: [
          'button[aria-label="Delete"]',
          'button:has-text("Xóa")',
          '[data-testid="delete-button"]'
        ],
        description: 'Delete note button'
      },
      
      // Loading & Empty States
      loadingSpinner: {
        primary: 'div:has-text("Đang tải")',
        fallback: [
          '[data-testid="loading"]',
          '.animate-spin'
        ],
        description: 'Loading state indicator'
      },
      
      emptyState: {
        primary: 'div:has-text("Chưa có ghi chú")',
        fallback: [
          '[data-testid="empty-state"]',
          'p:has-text("Thêm ghi chú đầu tiên")'
        ],
        description: 'Empty state message'
      },
      
      errorMessage: {
        primary: 'div:has-text("Lỗi")',
        fallback: [
          '[role="alert"]',
          '[data-testid="error"]',
          '.text-red-500'
        ],
        description: 'Error message container'
      }
    }
  }

  /**
   * Self-healing locator
   * Tries primary selector, falls back to alternatives
   * @param {Object} selectorConfig - Selector configuration
   * @returns {Locator} Playwright locator
   */
  async getElement(selectorConfig) {
    try {
      const element = this.page.locator(selectorConfig.primary)
      await element.waitFor({ timeout: 2000 })
      return element
    } catch (error) {
      console.log(`⚠️ Primary selector failed: ${selectorConfig.primary}`)
      console.log(`🔄 Trying fallback selectors...`)
      
      for (const fallback of selectorConfig.fallback || []) {
        try {
          const element = this.page.locator(fallback)
          await element.waitFor({ timeout: 2000 })
          console.log(`✅ Fallback successful: ${fallback}`)
          return element
        } catch (e) {
          continue
        }
      }
      
      throw new Error(`❌ All selectors failed for: ${selectorConfig.description}`)
    }
  }

  // ==================== NAVIGATION ====================
  
  async goto() {
    await this.page.goto('/notes')
    await this.page.waitForLoadState('networkidle')
  }

  // ==================== ASSERTIONS ====================
  
  async expectPageLoaded() {
    const title = await this.getElement(this.selectors.pageTitle)
    await expect(title).toBeVisible()
  }

  async expectAddButtonVisible() {
    const button = await this.getElement(this.selectors.addButton)
    await expect(button).toBeVisible()
  }

  async expectFormVisible() {
    const form = await this.getElement(this.selectors.formContainer)
    await expect(form).toBeVisible()
  }

  async expectFormNotVisible() {
    const form = this.page.locator(this.selectors.formContainer.primary)
    await expect(form).not.toBeVisible()
  }

  async expectNoteCount(count) {
    const cards = this.page.locator(this.selectors.noteCards.primary)
    await expect(cards).toHaveCount(count)
  }

  async expectNoteExists(title) {
    const card = this.page.locator(`div.bg-gradient-to-br:has-text("${title}")`).first()
    await expect(card).toBeVisible()
  }

  async expectEmptyState() {
    const empty = await this.getElement(this.selectors.emptyState)
    await expect(empty).toBeVisible()
  }

  // ==================== ACTIONS ====================
  
  async clickAddButton() {
    const button = await this.getElement(this.selectors.addButton)
    await button.click()
  }

  async fillNoteForm({ title, content, color }) {
    if (title !== undefined) {
      const titleInput = await this.getElement(this.selectors.titleInput)
      await titleInput.fill(title)
    }
    
    if (content !== undefined) {
      const contentInput = await this.getElement(this.selectors.contentInput)
      await contentInput.fill(content)
    }
    
    if (color) {
      const colorBtn = await this.getElement(this.selectors.colorButton(color))
      await colorBtn.click()
    }
  }

  async saveNote() {
    const saveBtn = await this.getElement(this.selectors.saveButton)
    await saveBtn.click()
    await this.page.waitForLoadState('networkidle')
  }

  async cancelNote() {
    const cancelBtn = await this.getElement(this.selectors.cancelButton)
    await cancelBtn.click()
  }

  async createNote({ title, content, color = 'pink' }) {
    await this.clickAddButton()
    await this.fillNoteForm({ title, content, color })
    await this.saveNote()
  }

  async editNote(index, { title, content, color }) {
    const cards = this.page.locator(this.selectors.noteCards.primary)
    const card = cards.nth(index)
    const editBtn = card.locator('button:has(svg.lucide-edit-2)')
    await editBtn.click()
    
    await this.fillNoteForm({ title, content, color })
    await this.saveNote()
  }

  async deleteNote(index) {
    const cards = this.page.locator(this.selectors.noteCards.primary)
    const card = cards.nth(index)
    const deleteBtn = card.locator('button:has(svg.lucide-trash-2)')
    
    // Accept dialog
    this.page.on('dialog', dialog => dialog.accept())
    await deleteBtn.click()
    await this.page.waitForLoadState('networkidle')
  }

  // ==================== HELPERS ====================
  
  async getNoteCard(index) {
    const selector = this.selectors.noteCard(index)
    return await this.getElement(selector)
  }

  async getNoteTitle(index) {
    const cards = this.page.locator(this.selectors.noteCards.primary)
    const card = cards.nth(index)
    const title = card.locator('h3')
    return await title.textContent()
  }

  async getNoteContent(index) {
    const cards = this.page.locator(this.selectors.noteCards.primary)
    const card = cards.nth(index)
    const content = card.locator('p.text-gray-700')
    return await content.textContent()
  }

  async getAllNotes() {
    const cards = this.page.locator(this.selectors.noteCards.primary)
    await cards.first().waitFor({ timeout: 5000 }).catch(() => {}) // Wait for at least one card
    const count = await cards.count()
    
    const notes = []
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      const title = await card.locator('h3').first().textContent()
      // Get the main content paragraph (not the timestamp)
      const contentParagraphs = card.locator('p.text-gray-700, p.font-nunito')
      const content = await contentParagraphs.first().textContent()
      notes.push({ title, content })
    }
    
    return notes
  }

  async waitForNoteSaved() {
    await this.page.waitForLoadState('networkidle')
    await this.expectFormNotVisible()
  }
}
