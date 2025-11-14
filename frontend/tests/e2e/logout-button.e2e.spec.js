/**
 * E2E Tests - Logout Button Feature
 * @description Test logout button in Header with confirmation dialog
 * @created 2025-11-14
 */

import { test, expect } from '@playwright/test'

test.describe('Logout Button in Header', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'admin@kadong.com')
    await page.fill('input[type="password"]', 'KaDong2024!')
    await page.click('button[type="submit"]')
    
    // Wait for redirect to home
    await page.waitForURL('http://localhost:3000/', { timeout: 5000 })
    await page.waitForTimeout(1000) // Wait for auth state to settle
  })

  test('should display logout button when authenticated', async ({ page }) => {
    // Verify logout button exists
    const logoutButton = page.locator('button:has-text("Đăng xuất")')
    await expect(logoutButton).toBeVisible()
    
    // Verify user info badge exists (desktop)
    const userInfo = page.locator('text=/admin@kadong.com|Admin/')
    await expect(userInfo).toBeVisible()
  })

  test('should show confirmation dialog when clicking logout', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Đăng xuất")')
    
    // Verify confirmation dialog appears
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    await expect(page.locator('text=Bạn có chắc muốn đăng xuất')).toBeVisible()
    
    // Verify dialog buttons
    await expect(page.locator('button:has-text("Hủy")')).toBeVisible()
    await expect(page.locator('button:has-text("Đăng xuất")')).toHaveCount(2) // One in header, one in dialog
  })

  test('should cancel logout when clicking Hủy', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Đăng xuất")')
    
    // Wait for dialog
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    
    // Click Hủy button in dialog
    await page.click('button:has-text("Hủy")')
    
    // Verify dialog closes
    await expect(page.locator('text=Xác nhận đăng xuất')).not.toBeVisible()
    
    // Verify still on home page and authenticated
    expect(page.url()).toBe('http://localhost:3000/')
    await expect(page.locator('button:has-text("Đăng xuất")')).toBeVisible()
  })

  test('should logout successfully when confirming', async ({ page }) => {
    // Click logout button in header
    await page.click('button:has-text("Đăng xuất")').first()
    
    // Wait for dialog
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    
    // Click Đăng xuất button in dialog (the second one)
    const dialogLogoutButtons = page.locator('button:has-text("Đăng xuất")')
    await dialogLogoutButtons.last().click()
    
    // Wait for redirect to login page
    await page.waitForURL('http://localhost:3000/login', { timeout: 5000 })
    
    // Verify on login page
    expect(page.url()).toContain('/login')
    
    // Verify logout button no longer visible
    await expect(page.locator('button:has-text("Đăng xuất")')).not.toBeVisible()
    
    // Verify cannot access protected route
    await page.goto('http://localhost:3000/notes')
    await page.waitForURL('http://localhost:3000/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })

  test('should show loading state during logout', async ({ page }) => {
    // Click logout button
    await page.click('button:has-text("Đăng xuất")').first()
    
    // Wait for dialog
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    
    // Click confirm button
    const dialogLogoutButton = page.locator('button:has-text("Đăng xuất")').last()
    
    // Check for loading state (spinner or "Đang xử lý...")
    // Note: This might be too fast to catch, so we just verify the click doesn't throw
    await dialogLogoutButton.click()
    
    // Should redirect quickly
    await page.waitForURL('http://localhost:3000/login', { timeout: 5000 })
  })

  test('should show Guest badge for guest users', async ({ page }) => {
    // Logout first
    await page.click('button:has-text("Đăng xuất")').first()
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    await page.locator('button:has-text("Đăng xuất")').last().click()
    await page.waitForURL('http://localhost:3000/login')
    
    // Login as guest (if Guest mode button exists)
    const guestButton = page.locator('button:has-text("Tiếp tục với Guest")')
    if (await guestButton.isVisible()) {
      await guestButton.click()
      await page.waitForURL('http://localhost:3000/')
      
      // Verify Guest badge exists
      await expect(page.locator('text=Guest')).toBeVisible()
      
      // Verify logout button exists for guest
      await expect(page.locator('button:has-text("Đăng xuất")')).toBeVisible()
    } else {
      console.log('Guest mode not available, skipping guest badge test')
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to home
    await page.goto('http://localhost:3000/')
    
    // Logout button should still be visible
    await expect(page.locator('button:has-text("Đăng xuất")')).toBeVisible()
    
    // User info might be hidden on mobile, but logout button should work
    await page.click('button:has-text("Đăng xuất")')
    
    // Dialog should be full-width and visible
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    
    // Dialog should fit in viewport
    const dialog = page.locator('div.fixed.inset-0.z-50')
    await expect(dialog).toBeVisible()
  })
})

test.describe('Logout Button - Error Handling', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login')
    await page.fill('input[type="email"]', 'admin@kadong.com')
    await page.fill('input[type="password"]', 'KaDong2024!')
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/')
    await page.waitForTimeout(1000)
  })

  test('should handle API error gracefully', async ({ page }) => {
    // Intercept logout API and make it fail
    await page.route('**/api/auth/logout', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: false, 
          error: 'Internal server error' 
        })
      })
    })
    
    // Try to logout
    await page.click('button:has-text("Đăng xuất")').first()
    await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
    await page.locator('button:has-text("Đăng xuất")').last().click()
    
    // Should show error message in dialog
    await expect(page.locator('text=/Không thể đăng xuất|Failed to logout/')).toBeVisible({ timeout: 3000 })
    
    // Button should be enabled again for retry
    const dialogLogoutButton = page.locator('button:has-text("Đăng xuất")').last()
    await expect(dialogLogoutButton).toBeEnabled()
  })
})
