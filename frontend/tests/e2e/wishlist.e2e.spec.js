/**
 * Wishlist E2E Tests
 * @description End-to-end tests for wishlist UI workflows
 * @spec specs/specs/03_wishlist_management.spec
 * @author KaDong Team
 * @created 2025-11-14
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'
const LOGIN_EMAIL = 'admin@kadong.com'
const LOGIN_PASSWORD = 'KaDong2024!' // Correct admin password

test.describe('Wishlist Tool E2E', () => {
  // Setup fresh profile and login before each test
  test.beforeEach(async ({ page, context }) => {
    console.log('\n🔄 Starting fresh test with new profile...')
    
    // Clear all browser data from context (fresh profile)
    await context.clearCookies()
    await context.clearPermissions()
    
    // Navigate to home page first
    await page.goto(`${BASE_URL}`)
    await page.waitForLoadState('domcontentloaded')
    
    // Clear storage
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    console.log('✓ Fresh profile created')
    console.log('🔐 Logging in with real user for E2E testing...')
    
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`)
    await page.waitForLoadState('domcontentloaded')
    
    // Setup console and response listeners FIRST (before any navigation)
    page.on('console', msg => {
      const text = msg.text()
      if (text.includes('[WishlistTool]') || text.includes('[WishlistService]') || text.includes('Error')) {
        console.log(`  [Browser Console] ${msg.type()}: ${text}`)
      }
    })
    
    // Log ALL requests to see what's happening
    page.on('request', request => {
      if (request.url().includes('/api/wishlist')) {
        console.log(`  📤 Request: ${request.method()} ${request.url()}`)
      }
    })
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/wishlist') || response.url().includes('/api/auth')) {
        console.log(`  API Response: ${response.status()} ${response.url()}`)
        
        // Log error responses for debugging
        if (response.status() >= 400) {
          const body = await response.text()
          console.log(`    Error body: ${body.substring(0, 200)}`)
        }
      }
    })
    
    // Fill in login form with real credentials
    await page.fill('input[type="email"]', LOGIN_EMAIL)
    await page.fill('input[type="password"]', LOGIN_PASSWORD)
    console.log(`📧 Filled credentials: ${LOGIN_EMAIL}`)
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for redirect to /tools
    try {
      await page.waitForURL(/\/tools/, { timeout: 10000 })
      console.log('✓ Login successful, redirected to /tools')
      
      // Note: Auth is stored in httpOnly cookie, not localStorage at this point
      console.log('  (Auth stored in httpOnly cookie, will be verified on next page)')
      
      // Navigate to wishlist (auth should persist via cookies)
      console.log('📋 Navigating to wishlist...')
      await page.goto(`${BASE_URL}/wishlist`)
      
      // Wait for /api/auth/me to succeed and extract user data
      const authResponse = await page.waitForResponse(
        response => response.url().includes('/api/auth/me') && response.status() === 200,
        { timeout: 5000 }
      )
      const authData = await authResponse.json()
      console.log('✓ Auth loaded from cookie')
      
      // CRITICAL: Manually inject user into localStorage for wishlistService
      // This is needed because AuthContext stores user in React state only,
      // but wishlistService.js reads from localStorage
      if (authData.success && authData.data) {
        await page.evaluate((userData) => {
          localStorage.setItem('user', JSON.stringify(userData))
        }, authData.data)
        console.log(`✓ User injected to localStorage: ${authData.data.email} (${authData.data.id})`)
        
        // Reload page to ensure wishlistService can read user from localStorage
        console.log('🔄 Reloading page to apply localStorage changes...')
        await page.reload({ waitUntil: 'networkidle' })
        console.log('✓ Page reloaded with user in localStorage')
      } else {
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle')
        
        // Give React time to update state after auth context loads
        await page.waitForTimeout(1000)
      }
    } catch (error) {
      console.log('❌ Login failed:', error.message)
      throw error
    }
    
    // Debug: Check current URL and HTML content
    const currentUrl = page.url()
    console.log(`  Current URL: ${currentUrl}`)
    
    // Check if wishlist page loaded
    const pageContent = await page.content()
    if (pageContent.includes('data-testid="wishlist')) {
      console.log('  ✓ Found wishlist testids in HTML')
    } else {
      console.log('  ⚠️  No wishlist testids in HTML')
    }
    
    // Wait for wishlist to load (either stats, grid, or empty state)
    try {
      await page.waitForSelector('[data-testid="wishlist-stats"], [data-testid="wishlist-grid"], [data-testid="wishlist-empty"]', {
        timeout: 15000
      })
      console.log('✓ Wishlist loaded\n')
    } catch (error) {
      console.log('⚠️  Wishlist elements not found')
      
      // Debug info
      const bodyText = await page.textContent('body')
      console.log('  Page body text (first 500 chars):', bodyText.substring(0, 500))
      
      await page.screenshot({ path: `test-results/wishlist-load-failed-${Date.now()}.png`, fullPage: true })
      throw error
    }
  })
  
  // Clean up after each test - Ensure no session persists
  test.afterEach(async ({ page, context }) => {
    console.log('\n🧹 Cleaning up after test...')
    
    // Clear all storage
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    // Clear cookies
    await context.clearCookies()
    
    console.log('✓ Cleanup complete - No session persists\n')
  })

  // ==================== Page Load & Data Display ====================
  test('should load wishlist page and display data', async ({ page }) => {
    console.log('🧪 Testing wishlist page load and data display...')
    
    // Check page title or heading
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible()
    console.log('✓ Page heading visible')
    
    // Check stats are visible
    const stats = page.locator('[data-testid="wishlist-stats"]')
    await expect(stats).toBeVisible({ timeout: 10000 })
    console.log('✓ Wishlist stats visible')
    
    // Check if data is displayed or empty state
    const grid = page.locator('[data-testid="wishlist-grid"]')
    const emptyState = page.locator('[data-testid="wishlist-empty"]')
    
    const hasData = await grid.isVisible({ timeout: 5000 }).catch(() => false)
    const isEmpty = await emptyState.isVisible({ timeout: 5000 }).catch(() => false)
    
    expect(hasData || isEmpty).toBeTruthy()
    
    if (hasData) {
      console.log('✓ Wishlist has data - checking items...')
      
      // Count wishlist cards
      const cards = page.locator('[data-testid="wishlist-card"]')
      const count = await cards.count()
      console.log(`  Found ${count} wishlist items`)
      
      expect(count).toBeGreaterThan(0)
      
      // Verify first card has required elements
      const firstCard = cards.first()
      await expect(firstCard.locator('.product-name, h3, h4')).toBeVisible()
      await expect(firstCard.locator('.price, [data-testid="price"]')).toBeVisible()
      console.log('✓ Wishlist items display correctly')
    } else {
      console.log('ℹ️  Wishlist is empty (showing empty state)')
    }
  })

  // ==================== Extract Metadata Test ====================
  test('should extract metadata from product URL', async ({ page }) => {
    console.log('🧪 Testing URL metadata extraction...')
    
    // Click add item button
    const addButton = page.locator('[data-testid="add-item-button"]')
    await expect(addButton).toBeVisible({ timeout: 10000 })
    await addButton.click()
    console.log('✓ Clicked add item button')
    
    // Wait for modal to open
    const modal = page.locator('[data-testid="wishlist-add-modal"], [role="dialog"], .modal')
    await expect(modal).toBeVisible({ timeout: 5000 })
    console.log('✓ Add modal opened')
    
    // Find URL input
    const urlInput = page.locator('input[name="product_url"], input[placeholder*="URL"], input[type="url"]').first()
    await expect(urlInput).toBeVisible()
    
    // Enter a test URL
    const testUrl = 'https://www.apple.com/iphone-15-pro/'
    await urlInput.fill(testUrl)
    console.log(`✓ Entered URL: ${testUrl}`)
    
    // Look for extract/fetch metadata button
    const extractButton = page.locator('button:has-text("Trích xuất"), button:has-text("Extract"), button:has-text("Fetch"), [data-testid="extract-button"]')
    
    if (await extractButton.isVisible({ timeout: 3000 })) {
      console.log('✓ Found extract button, clicking...')
      await extractButton.click()
      
      // Wait for loading to complete
      await page.waitForTimeout(3000)
      
      // Check if product name was auto-filled
      const nameInput = page.locator('input[name="product_name"], input[placeholder*="tên"], [data-testid="product-name-input"]').first()
      const nameValue = await nameInput.inputValue()
      
      if (nameValue && nameValue.length > 0) {
        console.log(`✓ Metadata extracted - Name: ${nameValue}`)
        expect(nameValue.length).toBeGreaterThan(0)
      } else {
        console.log('⚠️  Metadata extraction may have failed or is not implemented')
      }
    } else {
      console.log('ℹ️  No extract button found - metadata extraction may be automatic or not available')
    }
    
    // Close modal
    const closeButton = page.locator('[data-testid="close-button"], button:has-text("Đóng"), button:has-text("Cancel"), .modal-close')
    if (await closeButton.isVisible({ timeout: 2000 })) {
      await closeButton.click()
    } else {
      await page.keyboard.press('Escape')
    }
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
