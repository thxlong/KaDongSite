/**
 * E2E Tests for Logout Functionality
 * Tests complete logout user flows for both Guest and Registered users
 */

import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'

test.describe('Logout User Flows', () => {
  
  test.describe('Registered User Logout', () => {
    let testUser = {
      email: '',
      password: 'TestPassword123!',
      name: 'Test User'
    }

    test.beforeEach(async () => {
      testUser.email = faker.internet.email().toLowerCase()
    })

    test('should complete full registered user logout flow', async ({ page }) => {
      // 1. Navigate to register page
      await page.goto(`${FRONTEND_URL}/register`)
      
      // 2. Register new user
      await page.fill('input[name="email"]', testUser.email)
      await page.fill('input[name="password"]', testUser.password)
      await page.fill('input[name="confirmPassword"]', testUser.password)
      await page.fill('input[name="name"]', testUser.name)
      
      await page.click('button[type="submit"]')
      
      // 3. Wait for successful registration and redirect
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // 4. Verify user is logged in
      const userEmail = await page.textContent('[data-testid="user-email"]').catch(() => null)
      if (userEmail) {
        expect(userEmail).toContain(testUser.email)
      }
      
      // 5. Click logout button
      await page.click('[data-testid="logout-button"]')
      
      // 6. Verify confirmation dialog appears
      await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
      await expect(page.locator('text=Bạn có chắc muốn đăng xuất khỏi tài khoản')).toBeVisible()
      
      // 7. Confirm logout
      await page.click('button:has-text("Đăng xuất"):has([class*="bg-red"])')
      
      // 8. Wait for redirect to login page
      await page.waitForURL(/\/login/)
      
      // 9. Verify success message
      await expect(page.locator('text=Đã đăng xuất thành công')).toBeVisible({ timeout: 5000 })
      
      // 10. Verify cannot access protected pages
      await page.goto(`${FRONTEND_URL}/dashboard`)
      await page.waitForURL(/\/login/)
    })

    test('should cancel logout on confirmation dialog', async ({ page }) => {
      // Register and login
      await page.goto(`${FRONTEND_URL}/register`)
      await page.fill('input[name="email"]', testUser.email)
      await page.fill('input[name="password"]', testUser.password)
      await page.fill('input[name="confirmPassword"]', testUser.password)
      await page.fill('input[name="name"]', testUser.name)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // Click logout
      await page.click('[data-testid="logout-button"]')
      
      // Click cancel
      await page.click('button:has-text("Hủy")')
      
      // Should still be on the same page
      expect(page.url()).not.toContain('/login')
      
      // Should still be able to access protected content
      const userEmail = await page.textContent('[data-testid="user-email"]').catch(() => null)
      if (userEmail) {
        expect(userEmail).toContain(testUser.email)
      }
    })

    test('should logout from header dropdown menu', async ({ page }) => {
      // Register and login
      await page.goto(`${FRONTEND_URL}/register`)
      await page.fill('input[name="email"]', testUser.email)
      await page.fill('input[name="password"]', testUser.password)
      await page.fill('input[name="confirmPassword"]', testUser.password)
      await page.fill('input[name="name"]', testUser.name)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // Open user menu dropdown
      await page.click('[data-testid="user-menu-button"]').catch(async () => {
        // Fallback: click any element that opens user menu
        await page.click('button:has-text("' + testUser.name + '")').catch(() => {})
      })
      
      // Click logout from dropdown
      await page.click('[data-testid="logout-dropdown-item"]')
      
      // Confirm logout
      await page.click('button:has-text("Đăng xuất"):has([class*="bg-red"])')
      
      // Verify redirect to login
      await page.waitForURL(/\/login/)
    })

    test('should handle logout API failure gracefully', async ({ page, context }) => {
      // Register and login
      await page.goto(`${FRONTEND_URL}/register`)
      await page.fill('input[name="email"]', testUser.email)
      await page.fill('input[name="password"]', testUser.password)
      await page.fill('input[name="confirmPassword"]', testUser.password)
      await page.fill('input[name="name"]', testUser.name)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // Intercept logout API and make it fail
      await page.route('**/api/auth/logout', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            error: { code: 'LOGOUT_FAILED', message: 'Failed to logout' }
          })
        })
      })
      
      // Click logout
      await page.click('[data-testid="logout-button"]')
      await page.click('button:has-text("Đăng xuất"):has([class*="bg-red"])')
      
      // Should show error message
      await expect(page.locator('text=Không thể đăng xuất')).toBeVisible({ timeout: 5000 })
      
      // User should still see the error message and can retry
      // Should NOT redirect to login page
      expect(page.url()).not.toContain('/login')
    })
  })

  test.describe('Guest User Logout', () => {
    
    test('should complete full guest user logout flow', async ({ page }) => {
      // 1. Navigate to login page
      await page.goto(`${FRONTEND_URL}/login`)
      
      // 2. Click "Tiếp tục với Guest" button
      await page.click('button:has-text("Tiếp tục với Guest")').catch(async () => {
        await page.click('button:has-text("Guest Mode")').catch(async () => {
          await page.click('[data-testid="guest-login-button"]')
        })
      })
      
      // 3. Wait for redirect to home/dashboard
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // 4. Verify Guest indicator is visible
      await expect(page.locator('text=Guest')).toBeVisible({ timeout: 5000 })
      
      // 5. Create some data (e.g., add a note)
      const hasNotesTool = await page.locator('text=Ghi chú').isVisible().catch(() => false)
      if (hasNotesTool) {
        await page.click('text=Ghi chú')
        await page.fill('[data-testid="note-input"]', 'Test guest note')
        await page.click('[data-testid="add-note-button"]')
      }
      
      // 6. Click logout button
      await page.click('[data-testid="logout-button"]')
      
      // 7. Verify Guest-specific warning in confirmation dialog
      await expect(page.locator('text=Xác nhận đăng xuất')).toBeVisible()
      await expect(page.locator('text=chế độ Guest')).toBeVisible()
      await expect(page.locator('text=Dữ liệu của bạn sẽ bị xóa')).toBeVisible()
      
      // 8. Confirm logout
      await page.click('button:has-text("Đăng xuất"):has([class*="bg-red"])')
      
      // 9. Wait for redirect to login page
      await page.waitForURL(/\/login/)
      
      // 10. Verify success message
      await expect(page.locator('text=Đã đăng xuất thành công')).toBeVisible({ timeout: 5000 })
      
      // 11. Verify localStorage is cleared
      const hasGuestData = await page.evaluate(() => {
        return localStorage.getItem('guest_session') !== null ||
               localStorage.getItem('guest_notes') !== null ||
               localStorage.getItem('guest_wishlists') !== null
      })
      expect(hasGuestData).toBe(false)
    })

    test('should warn about data loss for Guest logout', async ({ page }) => {
      // Login as Guest
      await page.goto(`${FRONTEND_URL}/login`)
      await page.click('button:has-text("Tiếp tục với Guest")').catch(async () => {
        await page.click('[data-testid="guest-login-button"]')
      })
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // Click logout
      await page.click('[data-testid="logout-button"]')
      
      // Verify warning message
      const warningText = await page.textContent('[data-testid="logout-dialog-content"]').catch(() => 
        page.textContent('text=Dữ liệu của bạn sẽ bị xóa')
      )
      
      expect(warningText).toContain('Guest')
      expect(warningText).toContain('xóa')
    })

    test('should not call logout API for Guest user', async ({ page }) => {
      let logoutAPICalled = false
      
      // Monitor network requests
      page.on('request', request => {
        if (request.url().includes('/api/auth/logout')) {
          logoutAPICalled = true
        }
      })
      
      // Login as Guest
      await page.goto(`${FRONTEND_URL}/login`)
      await page.click('button:has-text("Tiếp tục với Guest")').catch(async () => {
        await page.click('[data-testid="guest-login-button"]')
      })
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // Logout
      await page.click('[data-testid="logout-button"]')
      await page.click('button:has-text("Đăng xuất"):has([class*="bg-red"])')
      
      // Wait a bit to ensure no API call happens
      await page.waitForTimeout(1000)
      
      // Verify logout API was NOT called for Guest
      expect(logoutAPICalled).toBe(false)
    })
  })

  test.describe('Multi-Tab Logout', () => {
    
    test('should logout from all tabs simultaneously', async ({ browser }) => {
      const context = await browser.newContext()
      const page1 = await context.newPage()
      const page2 = await context.newPage()
      
      const testUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'TestPassword123!',
        name: 'Test User'
      }
      
      // Register and login on first tab
      await page1.goto(`${FRONTEND_URL}/register`)
      await page1.fill('input[name="email"]', testUser.email)
      await page1.fill('input[name="password"]', testUser.password)
      await page1.fill('input[name="confirmPassword"]', testUser.password)
      await page1.fill('input[name="name"]', testUser.name)
      await page1.click('button[type="submit"]')
      await page1.waitForURL(/\/(dashboard|home|tools)/)
      
      // Open second tab with same session
      await page2.goto(`${FRONTEND_URL}/dashboard`)
      await page2.waitForLoadState('networkidle')
      
      // Logout from first tab
      await page1.click('[data-testid="logout-button"]')
      await page1.click('button:has-text("Đăng xuất"):has([class*="bg-red"])')
      await page1.waitForURL(/\/login/)
      
      // Second tab should also be logged out (may need refresh or event listener)
      await page2.reload()
      await page2.waitForURL(/\/login/)
      
      await context.close()
    })
  })

  test.describe('Logout Button Variants', () => {
    
    test('should render logout button in header', async ({ page }) => {
      const testUser = {
        email: faker.internet.email().toLowerCase(),
        password: 'TestPassword123!',
        name: 'Test User'
      }
      
      await page.goto(`${FRONTEND_URL}/register`)
      await page.fill('input[name="email"]', testUser.email)
      await page.fill('input[name="password"]', testUser.password)
      await page.fill('input[name="confirmPassword"]', testUser.password)
      await page.fill('input[name="name"]', testUser.name)
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/(dashboard|home|tools)/)
      
      // Verify logout button exists
      const logoutButton = page.locator('[data-testid="logout-button"]')
      await expect(logoutButton).toBeVisible()
    })
  })
})
