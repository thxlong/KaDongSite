/**
 * Wishlist E2E Tests
 * @description End-to-end tests for wishlist UI workflows
 * @spec specs/specs/03_wishlist_management.spec
 * @author KaDong Team
 * @created 2025-11-14
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TEST_USER_EMAIL = 'testuser@kadong.com'
const TEST_USER_PASSWORD = 'KaDong2024!'

test.describe('Wishlist Tool E2E', () => {
  // Hooks
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto(`${BASE_URL}/login`)
    
    // Login
    await page.fill('input[name="email"]', TEST_USER_EMAIL)
    await page.fill('input[name="password"]', TEST_USER_PASSWORD)
    await page.click('button[type="submit"]')
    
    // Wait for redirect to tools page
    await page.waitForURL(/.*\/(|tools)/, { timeout: 10000 })
    
    // Navigate to wishlist
    await page.goto(`${BASE_URL}/wishlist`)
    await page.waitForLoadState('networkidle')
  })

  // ==================== Page Load ====================
  test('should load wishlist page successfully', async ({ page }) => {
    // Check page title or heading
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
    
    // Check stats are visible
    await expect(page.locator('[data-testid="wishlist-stats"]')).toBeVisible({ timeout: 5000 })
    
    // Check grid or empty state is visible
    const grid = page.locator('[data-testid="wishlist-grid"]')
    const emptyState = page.locator('[data-testid="wishlist-empty"]')
    
    await expect(grid.or(emptyState)).toBeVisible()
  })

  // ==================== Add Item Workflow ====================
  test('should add new wishlist item successfully', async ({ page }) => {
    // Click add item button
    const addButton = page.locator('[data-testid="add-item-button"]')
    await expect(addButton).toBeVisible()
    await addButton.click()
    
    // Wait for modal to open
    const modal = page.locator('[data-testid="wishlist-add-modal"]')
    await expect(modal).toBeVisible()
    
    // Fill form
    await page.fill('[data-testid="product-url-input"]', 'https://example.com/test-product')
    await page.fill('[data-testid="product-name-input"]', 'E2E Test Product')
    await page.fill('[data-testid="price-input"]', '1000000')
    await page.selectOption('[data-testid="currency-select"]', 'VND')
    await page.fill('[data-testid="origin-input"]', 'Vietnam')
    await page.selectOption('[data-testid="category-select"]', 'Electronics')
    await page.fill('[data-testid="description-textarea"]', 'This is a test product for E2E testing')
    
    // Submit form
    await page.click('[data-testid="save-button"]')
    
    // Wait for modal to close
    await expect(modal).not.toBeVisible({ timeout: 5000 })
    
    // Verify toast notification
    const toast = page.locator('[data-testid="toast-success"]')
    await expect(toast).toBeVisible({ timeout: 3000 })
    
    // Verify item appears in grid
    await page.waitForTimeout(1000) // Wait for grid refresh
    const itemCard = page.locator('[data-testid="wishlist-card"]').filter({ hasText: 'E2E Test Product' })
    await expect(itemCard).toBeVisible({ timeout: 5000 })
  })

  // ==================== Heart/Unheart Workflow ====================
  test('should heart and unheart item successfully', async ({ page }) => {
    // Find first wishlist card
    const firstCard = page.locator('[data-testid="wishlist-card"]').first()
    await expect(firstCard).toBeVisible({ timeout: 5000 })
    
    // Get initial heart count
    const heartButton = firstCard.locator('[data-testid="heart-button"]')
    const heartCount = firstCard.locator('[data-testid="heart-count"]')
    
    await expect(heartButton).toBeVisible()
    await expect(heartCount).toBeVisible()
    
    const initialCount = await heartCount.textContent()
    const initialCountNum = parseInt(initialCount || '0', 10)
    
    // Click heart button
    await heartButton.click()
    
    // Wait for heart animation
    await page.waitForTimeout(500)
    
    // Verify heart count increased
    await expect(heartCount).toHaveText(`${initialCountNum + 1}`, { timeout: 3000 })
    
    // Verify heart icon is filled
    const heartIcon = heartButton.locator('svg')
    await expect(heartIcon).toHaveClass(/fill-red|text-red/, { timeout: 1000 })
    
    // Click again to unheart
    await heartButton.click()
    await page.waitForTimeout(500)
    
    // Verify heart count decreased
    await expect(heartCount).toHaveText(`${initialCountNum}`, { timeout: 3000 })
  })

  // ==================== Comment Workflow ====================
  test('should add, edit, and delete comment successfully', async ({ page }) => {
    // Find first wishlist card
    const firstCard = page.locator('[data-testid="wishlist-card"]').first()
    await expect(firstCard).toBeVisible({ timeout: 5000 })
    
    // Expand comments section
    const commentsToggle = firstCard.locator('[data-testid="comments-toggle"]')
    await expect(commentsToggle).toBeVisible()
    await commentsToggle.click()
    
    // Wait for comments section to expand
    const commentsSection = firstCard.locator('[data-testid="comments-section"]')
    await expect(commentsSection).toBeVisible({ timeout: 2000 })
    
    // Add comment
    const commentInput = commentsSection.locator('[data-testid="comment-input"]')
    await expect(commentInput).toBeVisible()
    await commentInput.fill('This is an E2E test comment')
    
    const commentSubmit = commentsSection.locator('[data-testid="comment-submit"]')
    await commentSubmit.click()
    
    // Wait for comment to appear
    await page.waitForTimeout(1000)
    const commentItem = commentsSection.locator('[data-testid="comment-item"]').filter({ hasText: 'This is an E2E test comment' })
    await expect(commentItem).toBeVisible({ timeout: 3000 })
    
    // Edit comment (if own comment)
    const editButton = commentItem.locator('[data-testid="comment-edit"]')
    if (await editButton.isVisible()) {
      await editButton.click()
      
      const editInput = commentItem.locator('[data-testid="comment-edit-input"]')
      await editInput.fill('Updated E2E test comment')
      
      const saveButton = commentItem.locator('[data-testid="comment-save"]')
      await saveButton.click()
      
      await page.waitForTimeout(500)
      await expect(commentItem).toContainText('Updated E2E test comment', { timeout: 3000 })
    }
    
    // Delete comment
    const deleteButton = commentItem.locator('[data-testid="comment-delete"]')
    if (await deleteButton.isVisible()) {
      await deleteButton.click()
      
      // Confirm deletion if dialog appears
      const confirmButton = page.locator('[data-testid="confirm-delete"]')
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }
      
      // Verify comment is removed
      await expect(commentItem).not.toBeVisible({ timeout: 3000 })
    }
  })

  // ==================== Edit Item Workflow ====================
  test('should edit wishlist item successfully', async ({ page }) => {
    // Find first wishlist card
    const firstCard = page.locator('[data-testid="wishlist-card"]').first()
    await expect(firstCard).toBeVisible({ timeout: 5000 })
    
    // Click edit button
    const editButton = firstCard.locator('[data-testid="edit-button"]')
    await expect(editButton).toBeVisible()
    await editButton.click()
    
    // Wait for edit modal
    const modal = page.locator('[data-testid="wishlist-edit-modal"]')
    await expect(modal).toBeVisible({ timeout: 3000 })
    
    // Update product name
    const nameInput = modal.locator('[data-testid="product-name-input"]')
    await nameInput.clear()
    await nameInput.fill('Updated Product Name E2E')
    
    // Update price
    const priceInput = modal.locator('[data-testid="price-input"]')
    await priceInput.clear()
    await priceInput.fill('2000000')
    
    // Save changes
    const saveButton = modal.locator('[data-testid="save-button"]')
    await saveButton.click()
    
    // Wait for modal to close
    await expect(modal).not.toBeVisible({ timeout: 5000 })
    
    // Verify changes in card
    await page.waitForTimeout(1000)
    const updatedCard = page.locator('[data-testid="wishlist-card"]').filter({ hasText: 'Updated Product Name E2E' })
    await expect(updatedCard).toBeVisible({ timeout: 5000 })
  })

  // ==================== Mark as Purchased Workflow ====================
  test('should mark item as purchased successfully', async ({ page }) => {
    // Find first wishlist card
    const firstCard = page.locator('[data-testid="wishlist-card"]').first()
    await expect(firstCard).toBeVisible({ timeout: 5000 })
    
    // Click mark purchased button/toggle
    const purchaseToggle = firstCard.locator('[data-testid="purchase-toggle"]')
    await expect(purchaseToggle).toBeVisible()
    
    // Click to mark as purchased
    await purchaseToggle.click()
    
    // Wait for update
    await page.waitForTimeout(500)
    
    // Verify purchased badge appears
    const purchasedBadge = firstCard.locator('[data-testid="purchased-badge"]')
    await expect(purchasedBadge).toBeVisible({ timeout: 3000 })
    
    // Click again to unmark
    await purchaseToggle.click()
    await page.waitForTimeout(500)
    
    // Verify badge disappears
    await expect(purchasedBadge).not.toBeVisible({ timeout: 3000 })
  })

  // ==================== Search Workflow ====================
  test('should search wishlist items successfully', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('[data-testid="search-input"]')
    await expect(searchInput).toBeVisible({ timeout: 5000 })
    
    // Type search query
    await searchInput.fill('iPhone')
    
    // Wait for debounce and results
    await page.waitForTimeout(500)
    
    // Verify filtered results
    const cards = page.locator('[data-testid="wishlist-card"]')
    const count = await cards.count()
    
    if (count > 0) {
      // Check first card contains search term
      const firstCardText = await cards.first().textContent()
      expect(firstCardText?.toLowerCase()).toContain('iphone')
    }
    
    // Clear search
    await searchInput.clear()
    await page.waitForTimeout(500)
  })

  // ==================== Filter by Category ====================
  test('should filter by category successfully', async ({ page }) => {
    // Find category filter
    const categorySelect = page.locator('[data-testid="category-filter"]')
    await expect(categorySelect).toBeVisible({ timeout: 5000 })
    
    // Select Electronics category
    await categorySelect.selectOption('Electronics')
    
    // Wait for filter
    await page.waitForTimeout(500)
    
    // Verify all visible cards are Electronics
    const cards = page.locator('[data-testid="wishlist-card"]')
    const count = await cards.count()
    
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const categoryBadge = cards.nth(i).locator('[data-testid="category-badge"]')
        if (await categoryBadge.isVisible()) {
          await expect(categoryBadge).toHaveText('Electronics')
        }
      }
    }
    
    // Reset filter
    await categorySelect.selectOption('all')
    await page.waitForTimeout(500)
  })

  // ==================== Sort Workflow ====================
  test('should sort items successfully', async ({ page }) => {
    // Find sort dropdown
    const sortSelect = page.locator('[data-testid="sort-select"]')
    await expect(sortSelect).toBeVisible({ timeout: 5000 })
    
    // Sort by hearts
    await sortSelect.selectOption('hearts')
    await page.waitForTimeout(500)
    
    // Verify sort order
    const heartCounts = page.locator('[data-testid="heart-count"]')
    const count = await heartCounts.count()
    
    if (count > 1) {
      const first = parseInt(await heartCounts.first().textContent() || '0', 10)
      const second = parseInt(await heartCounts.nth(1).textContent() || '0', 10)
      expect(first).toBeGreaterThanOrEqual(second)
    }
    
    // Sort by date
    await sortSelect.selectOption('date')
    await page.waitForTimeout(500)
    
    // Sort by price
    await sortSelect.selectOption('price')
    await page.waitForTimeout(500)
  })

  // ==================== Delete Item Workflow ====================
  test('should delete wishlist item successfully', async ({ page }) => {
    // Create a test item first
    const addButton = page.locator('[data-testid="add-item-button"]')
    await addButton.click()
    
    const modal = page.locator('[data-testid="wishlist-add-modal"]')
    await expect(modal).toBeVisible()
    
    await page.fill('[data-testid="product-url-input"]', 'https://example.com/delete-test')
    await page.fill('[data-testid="product-name-input"]', 'DELETE ME E2E TEST')
    await page.click('[data-testid="save-button"]')
    
    await expect(modal).not.toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(1000)
    
    // Find the test item
    const testCard = page.locator('[data-testid="wishlist-card"]').filter({ hasText: 'DELETE ME E2E TEST' })
    await expect(testCard).toBeVisible({ timeout: 5000 })
    
    // Click delete button
    const deleteButton = testCard.locator('[data-testid="delete-button"]')
    await expect(deleteButton).toBeVisible()
    await deleteButton.click()
    
    // Confirm deletion
    const confirmDialog = page.locator('[data-testid="delete-confirm-dialog"]')
    if (await confirmDialog.isVisible()) {
      const confirmButton = confirmDialog.locator('[data-testid="confirm-delete"]')
      await confirmButton.click()
    }
    
    // Verify item is removed
    await expect(testCard).not.toBeVisible({ timeout: 5000 })
    
    // Verify success toast
    const toast = page.locator('[data-testid="toast-success"]')
    await expect(toast).toBeVisible({ timeout: 3000 })
  })

  // ==================== Stats Display ====================
  test('should display wishlist stats correctly', async ({ page }) => {
    const stats = page.locator('[data-testid="wishlist-stats"]')
    await expect(stats).toBeVisible({ timeout: 5000 })
    
    // Check total items stat
    const totalItems = stats.locator('[data-testid="stat-total-items"]')
    await expect(totalItems).toBeVisible()
    
    // Check total value stat
    const totalValue = stats.locator('[data-testid="stat-total-value"]')
    await expect(totalValue).toBeVisible()
    
    // Check purchased count stat
    const purchasedCount = stats.locator('[data-testid="stat-purchased"]')
    await expect(purchasedCount).toBeVisible()
    
    // Check top hearted items
    const topHearted = stats.locator('[data-testid="stat-top-hearted"]')
    if (await topHearted.isVisible()) {
      await expect(topHearted).toBeVisible()
    }
  })

  // ==================== Responsive Design ====================
  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Verify layout adapts
    const grid = page.locator('[data-testid="wishlist-grid"]')
    await expect(grid).toBeVisible()
    
    // Check cards are full width on mobile
    const firstCard = page.locator('[data-testid="wishlist-card"]').first()
    if (await firstCard.isVisible()) {
      const box = await firstCard.boundingBox()
      expect(box?.width).toBeGreaterThan(300) // Should be nearly full width
    }
    
    // Check add button is FAB on mobile
    const addButton = page.locator('[data-testid="add-item-button"]')
    await expect(addButton).toBeVisible()
  })

  // ==================== Error Handling ====================
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true)
    
    // Try to add item
    const addButton = page.locator('[data-testid="add-item-button"]')
    await addButton.click()
    
    const modal = page.locator('[data-testid="wishlist-add-modal"]')
    await expect(modal).toBeVisible()
    
    await page.fill('[data-testid="product-url-input"]', 'https://example.com/offline-test')
    await page.fill('[data-testid="product-name-input"]', 'Offline Test')
    await page.click('[data-testid="save-button"]')
    
    // Wait for error message
    await page.waitForTimeout(2000)
    
    const errorToast = page.locator('[data-testid="toast-error"]')
    await expect(errorToast).toBeVisible({ timeout: 5000 })
    
    // Go back online
    await page.context().setOffline(false)
  })
})
