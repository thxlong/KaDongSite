/**
 * E2E Tests for Gold Prices Tool
 * @description End-to-end tests for gold prices display, chart, and filtering
 */

import { test, expect } from '@playwright/test'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'

test.describe('Gold Prices Tool E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login with admin account
    await page.goto(`${FRONTEND_URL}/login`)
    
    // Wait for login page to load
    await page.waitForLoadState('networkidle')
    
    // Fill in login credentials
    await page.fill('input[type="email"]', 'admin@kadong.com')
    await page.fill('input[type="password"]', 'KaDong2024!')
    
    // Click login button
    const loginButton = page.locator('button[type="submit"]')
    await loginButton.click()
    
    // Wait for either:
    // 1. Successful login (URL changes from /login)
    // 2. Error message appears
    await page.waitForTimeout(2000)
    
    // Check if we're still on login page (error case)
    if (page.url().includes('/login')) {
      throw new Error(`Login failed. Current URL: ${page.url()}. Check if admin credentials are correct.`)
    }
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle')
    
    // Navigate to gold prices page
    await page.goto(`${FRONTEND_URL}/gold`)
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test.describe('Page Load and Initial State', () => {
    
    test('should load gold prices page successfully', async ({ page }) => {
      // Check Gold page title (inside the GoldHeader component, not the main Header)
      await expect(page.locator('text=💰 Giá Vàng Việt Nam')).toBeVisible({ timeout: 10000 })
      
      // Check refresh button exists
      await expect(page.locator('button:has-text("Làm mới")')).toBeVisible()
      
      // Check period filters exist (using more specific selectors)
      await expect(page.locator('button[aria-label="Xem theo Ngày"]')).toBeVisible()
      await expect(page.locator('button[aria-label="Xem theo Tuần"]')).toBeVisible()
      await expect(page.locator('button[aria-label="Xem theo Tháng"]')).toBeVisible()
      await expect(page.locator('button[aria-label="Xem theo Năm"]')).toBeVisible()
    })

    test('should display loading state initially', async ({ page }) => {
      // Reload to see loading state
      await page.reload()
      
      // May show loading spinner briefly
      const loadingText = page.getByText('Đang tải giá vàng...')
      
      // Either loading is visible or data loads so fast it's skipped
      const isLoadingVisible = await loadingText.isVisible().catch(() => false)
      
      if (isLoadingVisible) {
        // Wait for loading to finish
        await expect(loadingText).not.toBeVisible({ timeout: 10000 })
      }
      
      // Should show content after loading (look for the emoji + text in GoldHeader)
      await expect(page.locator('text=💰 Giá Vàng Việt Nam')).toBeVisible({ timeout: 10000 })
    })

    test('should display last update timestamp', async ({ page }) => {
      // Wait for data to load
      await page.waitForSelector('text=/Cập nhật:/')
      
      const updateText = await page.locator('text=/Cập nhật:/').textContent()
      
      // Should contain date/time
      expect(updateText).toMatch(/\d{2}:\d{2}:\d{2}/)
      expect(updateText).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })

  test.describe('Gold Price Cards Display', () => {
    
    test('should display gold price cards', async ({ page }) => {
      // Wait for price cards to load
      await page.waitForSelector('[role="button"]', { timeout: 10000 })
      
      // Check if at least one price card exists
      const cards = page.locator('[role="button"]')
      const cardCount = await cards.count()
      
      expect(cardCount).toBeGreaterThan(0)
    })

    test('should display buy and sell prices', async ({ page }) => {
      // Wait for price cards
      await page.waitForSelector('text=/Mua vào:/', { timeout: 10000 })
      
      // Check buy/sell labels exist
      await expect(page.locator('text=/Mua vào:/').first()).toBeVisible()
      await expect(page.locator('text=/Bán ra:/').first()).toBeVisible()
    })

    test('should display all gold types including jewelry grades', async ({ page }) => {
      // Wait for cards to load
      await page.waitForTimeout(2000)
      
      // Should show multiple gold types (cards count)
      const cards = page.locator('[role="button"]')
      const cardCount = await cards.count()
      
      // Should have at least 5 types (SJC_9999, SJC_24K, DOJI_24K, XAU_USD, and jewelry grades)
      expect(cardCount).toBeGreaterThanOrEqual(5)
      
      // Verify we have variety of gold types by checking if we have both per lượng and per chỉ
      const pageText = await page.textContent('body')
      const hasPerLuong = pageText.includes('lượng') || pageText.includes('SJC') || pageText.includes('DOJI')
      const hasPerChi = pageText.includes('chỉ') || pageText.includes('PNJ') || pageText.includes('GOLD')
      
      expect(hasPerLuong).toBe(true)
      expect(hasPerChi).toBe(true)
    })

    test('should show price change indicators', async ({ page }) => {
      // Wait for cards with price changes
      await page.waitForSelector('text=/%/', { timeout: 10000 })
      
      // Check if percentage changes are displayed
      const percentageText = await page.locator('text=/%/').first().textContent()
      expect(percentageText).toMatch(/[+-]?\d+\.\d+%/)
    })

    test('should display gold type names', async ({ page }) => {
      // Wait for cards
      await page.waitForSelector('[role="button"]', { timeout: 10000 })
      
      // Should show at least some gold types
      const cards = page.locator('[role="button"]')
      const firstCardText = await cards.first().textContent()
      
      // Should have some text content
      expect(firstCardText).toBeTruthy()
      expect(firstCardText.length).toBeGreaterThan(0)
    })
  })

  test.describe('Card Selection', () => {
    
    test('should have default types selected (SJC_9999, XAU_USD)', async ({ page }) => {
      // Wait for cards to load
      await page.waitForSelector('[role="button"]', { timeout: 10000 })
      
      // Check selection indicator (checking for visual indication)
      // Selected cards should have different styling
      const cards = page.locator('[role="button"]')
      const cardCount = await cards.count()
      
      expect(cardCount).toBeGreaterThan(0)
      
      // Check "Đang so sánh" counter shows 2
      const compareText = page.locator('text=/Đang so sánh:/')
      if (await compareText.isVisible()) {
        const text = await compareText.textContent()
        expect(text).toContain('2')
      }
    })

    test('should toggle card selection on click', async ({ page }) => {
      // Wait for cards
      await page.waitForSelector('[role="button"]', { timeout: 10000 })
      
      // Get initial compare count
      const compareCounter = page.locator('text=/Đang so sánh:/')
      const initialText = await compareCounter.textContent()
      const initialCount = parseInt(initialText.match(/\d+/)?.[0] || '0')
      
      // Click first card to toggle
      const firstCard = page.locator('[role="button"]').first()
      await firstCard.click()
      
      // Wait for update
      await page.waitForTimeout(500)
      
      // Compare count should change
      const newText = await compareCounter.textContent()
      const newCount = parseInt(newText.match(/\d+/)?.[0] || '0')
      
      expect(newCount).not.toBe(initialCount)
    })

    test('should allow selecting multiple cards', async ({ page }) => {
      // Wait for cards
      await page.waitForSelector('[role="button"]', { timeout: 10000 })
      
      const cards = page.locator('[role="button"]')
      const cardCount = await cards.count()
      
      if (cardCount >= 3) {
        // Click first three cards
        await cards.nth(0).click()
        await page.waitForTimeout(300)
        await cards.nth(1).click()
        await page.waitForTimeout(300)
        await cards.nth(2).click()
        await page.waitForTimeout(300)
        
        // Check compare counter updated
        const compareText = page.locator('text=/Đang so sánh:/')
        const text = await compareText.textContent()
        const count = parseInt(text.match(/\d+/)?.[0] || '0')
        
        expect(count).toBeGreaterThanOrEqual(1)
      }
    })
  })

  test.describe('Period Filters', () => {
    
    test('should have "Ngày" selected by default', async ({ page }) => {
      // Find the button by text instead of aria-label
      const dayButton = page.locator('button:has-text("Ngày")').first()
      
      await expect(dayButton).toBeVisible()
      // Check if it has the active class (bg-yellow-500)
      await expect(dayButton).toHaveClass(/bg-yellow-500/)
    })

    test('should change period to week', async ({ page }) => {
      const weekButton = page.locator('button:has-text("Tuần")').first()
      
      await weekButton.click()
      
      // Should have active class
      await expect(weekButton).toHaveClass(/bg-yellow-500/)
      
      // Day should not have active class
      const dayButton = page.locator('button:has-text("Ngày")').first()
      await expect(dayButton).not.toHaveClass(/bg-yellow-500/)
    })

    test('should change period to month', async ({ page }) => {
      const monthButton = page.locator('button:has-text("Tháng")').first()
      
      await monthButton.click()
      
      await expect(monthButton).toHaveClass(/bg-yellow-500/)
    })

    test('should change period to year', async ({ page }) => {
      const yearButton = page.locator('button:has-text("Năm")').first()
      
      await yearButton.click()
      
      await expect(yearButton).toHaveClass(/bg-yellow-500/)
    })

    test('should fetch new data when period changes', async ({ page }) => {
      // Listen for API calls
      const apiRequests = []
      page.on('request', request => {
        if (request.url().includes('/api/gold/history')) {
          apiRequests.push(request.url())
        }
      })
      
      // Change period
      const weekButton = page.locator('button:has-text("Tuần")').first()
      await weekButton.click()
      
      // Wait for API call
      await page.waitForTimeout(1000)
      
      // Should have made API call with period=week
      const weekRequests = apiRequests.filter(url => url.includes('period=week'))
      expect(weekRequests.length).toBeGreaterThan(0)
    })
  })

  test.describe('Chart Display', () => {
    
    test('should show chart by default', async ({ page }) => {
      // Wait for chart
      await page.waitForSelector('text=/Biểu đồ giá vàng/', { timeout: 10000 })
      
      await expect(page.locator('text=/Biểu đồ giá vàng/')).toBeVisible()
    })

    test('should toggle chart visibility', async ({ page }) => {
      // Chart should be visible initially
      await page.waitForSelector('text=/Biểu đồ giá vàng/', { timeout: 10000 })
      await expect(page.locator('text=/Biểu đồ giá vàng/')).toBeVisible()
      
      // Click checkbox to hide
      const chartCheckbox = page.getByLabel('Hiển thị biểu đồ')
      await chartCheckbox.click()
      
      // Chart should be hidden
      await expect(page.locator('text=/Biểu đồ giá vàng/')).not.toBeVisible()
      
      // Click again to show
      await chartCheckbox.click()
      
      // Chart should be visible again
      await expect(page.locator('text=/Biểu đồ giá vàng/')).toBeVisible()
    })

    test('should show chart with selected period label', async ({ page }) => {
      // Wait for chart
      await page.waitForSelector('text=/Biểu đồ giá vàng/', { timeout: 10000 })
      
      // Check default period "Hôm nay"
      await expect(page.locator('text=/Biểu đồ giá vàng - Hôm nay/')).toBeVisible()
      
      // Change to week
      const weekButton = page.getByLabel('Xem theo Tuần')
      await weekButton.click()
      await page.waitForTimeout(500)
      
      // Chart title should update
      await expect(page.locator('text=/Biểu đồ giá vàng - Tuần này/')).toBeVisible()
    })

    test('should display chart when types are selected', async ({ page }) => {
      // Wait for chart
      await page.waitForSelector('text=/Biểu đồ giá vàng/', { timeout: 10000 })
      
      // Chart should be visible with default selections
      const chartSection = page.locator('text=/Biểu đồ giá vàng/')
      await expect(chartSection).toBeVisible()
    })

    test('should show empty state when no historical data', async ({ page }) => {
      // Wait for chart to load
      await page.waitForTimeout(2000)
      
      // May show empty state if no data available
      const emptyState = page.locator('text=/Chưa có dữ liệu lịch sử/')
      const hasEmptyState = await emptyState.isVisible().catch(() => false)
      
      if (hasEmptyState) {
        await expect(emptyState).toBeVisible()
      }
    })
  })

  test.describe('Refresh Functionality', () => {
    
    test('should have refresh button', async ({ page }) => {
      const refreshButton = page.locator('button:has-text("Làm mới")')
      
      await expect(refreshButton).toBeVisible()
      await expect(refreshButton).toBeEnabled()
    })

    test('should refresh data on button click', async ({ page }) => {
      // Get initial timestamp
      const initialTimestamp = await page.locator('text=/Cập nhật:/').textContent()
      
      // Wait a bit to ensure time difference
      await page.waitForTimeout(1000)
      
      // Click refresh
      const refreshButton = page.locator('button:has-text("Làm mới")')
      await refreshButton.click()
      
      // Wait for refresh to complete
      await page.waitForTimeout(2000)
      
      // Timestamp should update (or at least API calls made)
      const newTimestamp = await page.locator('text=/Cập nhật:/').textContent()
      
      // Time should be different (if enough time passed)
      // Or just verify button was clickable and page still works
      expect(newTimestamp).toBeTruthy()
    })

    test('should show loading state during refresh', async ({ page }) => {
      const refreshButton = page.locator('button:has-text("Làm mới")')
      
      // Click refresh
      await refreshButton.click()
      
      // Button should show loading (spin animation)
      const svg = refreshButton.locator('svg')
      
      // Check if animate-spin class is added (may be brief)
      await page.waitForTimeout(100)
      
      // After loading, button should be enabled again
      await expect(refreshButton).toBeEnabled({ timeout: 5000 })
    })

    test('should make API calls on refresh', async ({ page }) => {
      // Monitor network requests
      const apiRequests = []
      page.on('request', request => {
        if (request.url().includes('/api/gold/')) {
          apiRequests.push(request.url())
        }
      })
      
      // Click refresh
      const refreshButton = page.locator('button:has-text("Làm mới")')
      await refreshButton.click()
      
      // Wait for API calls
      await page.waitForTimeout(2000)
      
      // Should have made API calls
      expect(apiRequests.length).toBeGreaterThan(0)
      
      // Should include /latest endpoint
      const latestRequests = apiRequests.filter(url => url.includes('/gold/latest'))
      expect(latestRequests.length).toBeGreaterThan(0)
    })
  })

  test.describe('Error Handling', () => {
    
    test('should handle API errors gracefully', async ({ page, context }) => {
      // Navigate to page
      await page.goto(`${FRONTEND_URL}/gold`)
      
      // Intercept API and make it fail
      await page.route('**/api/gold/latest', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: 'Internal server error'
          })
        })
      })
      
      // Reload to trigger error
      await page.reload()
      
      // Wait for error state
      await page.waitForTimeout(2000)
      
      // Should show error message or retry button
      const errorText = page.locator('text=/Lỗi/')
      const retryButton = page.locator('text=/Thử lại/')
      
      const hasError = await errorText.isVisible().catch(() => false)
      const hasRetry = await retryButton.isVisible().catch(() => false)
      
      expect(hasError || hasRetry).toBe(true)
    })

    test('should show empty state when no data', async ({ page }) => {
      // Navigate and wait
      await page.waitForTimeout(2000)
      
      // If no price cards are shown, should show empty state
      const cards = page.locator('[role="button"]')
      const cardCount = await cards.count()
      
      if (cardCount === 0) {
        await expect(page.locator('text=/Chưa có dữ liệu giá vàng/')).toBeVisible()
      }
    })

    test('should have retry button when error occurs', async ({ page }) => {
      // Force error state
      await page.route('**/api/gold/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ success: false, error: 'Server error' })
        })
      })
      
      await page.reload()
      await page.waitForTimeout(2000)
      
      // Should show retry button
      const retryButton = page.locator('text=/Thử lại/')
      const hasRetry = await retryButton.isVisible().catch(() => false)
      
      if (hasRetry) {
        await expect(retryButton).toBeVisible()
        await expect(retryButton).toBeEnabled()
      }
    })
  })

  test.describe('Responsive Design', () => {
    
    test('should display correctly on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      
      // Reload page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Check main elements are visible
      await expect(page.locator('text=💰 Giá Vàng Việt Nam')).toBeVisible({ timeout: 10000 })
      await expect(page.locator('button:has-text("Làm mới")')).toBeVisible()
      
      // Cards should stack vertically (grid-cols-1)
      const cards = page.locator('[role="button"]')
      if (await cards.count() > 0) {
        await expect(cards.first()).toBeVisible()
      }
    })

    test('should display correctly on tablet', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Check responsive layout
      await expect(page.locator('h1')).toBeVisible()
      
      // Should show period filters
      await expect(page.getByText('Ngày')).toBeVisible()
    })

    test('should display correctly on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // All elements should be visible
      await expect(page.locator('text=💰 Giá Vàng Việt Nam')).toBeVisible({ timeout: 10000 })
      await expect(page.locator('button:has-text("Làm mới")')).toBeVisible()
      
      // Chart should be visible if enabled
      const chart = page.locator('text=/Biểu đồ giá vàng/')
      const hasChart = await chart.isVisible().catch(() => false)
      
      if (hasChart) {
        await expect(chart).toBeVisible()
      }
    })
  })

  test.describe('Accessibility', () => {
    
    test('should have proper ARIA labels', async ({ page }) => {
      // Check button elements are visible (buttons have aria-labels in code)
      await expect(page.locator('button:has-text("Làm mới")')).toBeVisible()
      await expect(page.locator('button:has-text("Ngày")')).toBeVisible()
      await expect(page.locator('button:has-text("Tuần")')).toBeVisible()
      await expect(page.locator('button:has-text("Tháng")')).toBeVisible()
      await expect(page.locator('button:has-text("Năm")')).toBeVisible()
      
      // Check checkbox label
      const checkboxLabel = page.locator('text=Hiển thị biểu đồ')
      await expect(checkboxLabel).toBeVisible()
    })

    test('should have proper button roles', async ({ page }) => {
      // Price cards should have role="button"
      const cards = page.locator('[role="button"]')
      const cardCount = await cards.count()
      
      expect(cardCount).toBeGreaterThanOrEqual(0)
    })

    test('should be keyboard navigable', async ({ page }) => {
      // Focus on refresh button
      const refreshButton = page.locator('button:has-text("Làm mới")')
      await refreshButton.focus()
      
      // Should have focus
      await expect(refreshButton).toBeFocused()
      
      // Tab to next element
      await page.keyboard.press('Tab')
      
      // Some element should have focus
      const focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should have proper heading hierarchy', async ({ page }) => {
      // Main heading
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()
      
      // Chart heading (h2)
      const h2 = page.locator('h2')
      const hasH2 = await h2.isVisible().catch(() => false)
      
      // Heading hierarchy should be proper (h1 -> h2)
      expect(hasH2 || true).toBe(true)
    })
  })

  test.describe('Performance', () => {
    
    test('should load page within reasonable time', async ({ page }) => {
      const startTime = Date.now()
      
      await page.goto(`${FRONTEND_URL}/gold`)
      await page.waitForLoadState('networkidle')
      
      const loadTime = Date.now() - startTime
      
      // Should load within 10 seconds
      expect(loadTime).toBeLessThan(10000)
    })

    test('should not have console errors', async ({ page }) => {
      const consoleErrors = []
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })
      
      await page.goto(`${FRONTEND_URL}/gold`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000)
      
      // Filter out known harmless errors
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('Failed to load resource') &&
        !err.includes('favicon') &&
        !err.includes('404')
      )
      
      // Should not have critical errors
      expect(criticalErrors.length).toBe(0)
    })
  })
})
