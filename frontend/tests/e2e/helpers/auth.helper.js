/**
 * Authentication Helper for E2E Tests
 * @description Helper functions for login/logout with fresh profile
 * @author KaDong Team
 * @created 2025-11-14
 */

/**
 * Login to the application
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<void>}
 */
export async function login(page, email, password) {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
  
  // Navigate to login page
  await page.goto(`${BASE_URL}/login`)
  await page.waitForLoadState('domcontentloaded')
  
  // Clear any existing storage
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  
  // Fill login form
  const emailInput = page.locator('input[type="email"], input[name="email"]').first()
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first()
  const submitButton = page.locator('button[type="submit"]').first()
  
  await emailInput.fill(email)
  await passwordInput.fill(password)
  await submitButton.click()
  
  // Wait for navigation after login
  try {
    await page.waitForURL(/\/(dashboard|home|wishlist)/, { timeout: 10000 })
  } catch (error) {
    console.warn('Login might have failed or redirected elsewhere')
    // Take screenshot for debugging
    await page.screenshot({ path: `test-results/login-failed-${Date.now()}.png` })
  }
}

/**
 * Logout from the application
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function logout(page) {
  // Try to find and click logout button
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Đăng xuất"), a:has-text("Logout")').first()
  
  if (await logoutButton.isVisible({ timeout: 2000 })) {
    await logoutButton.click()
    await page.waitForURL(/\/(login|home)/, { timeout: 5000 })
  }
  
  // Clear storage
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

/**
 * Verify fresh profile (no existing auth data)
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>}
 */
export async function verifyFreshProfile(page) {
  const storageData = await page.evaluate(() => {
    return {
      localStorageKeys: Object.keys(localStorage),
      sessionStorageKeys: Object.keys(sessionStorage),
      hasUser: !!localStorage.getItem('user'),
      hasToken: !!localStorage.getItem('token'),
    }
  })
  
  console.log('Storage check:', storageData)
  
  return !storageData.hasUser && !storageData.hasToken
}

/**
 * Clear all browser data
 * @param {import('@playwright/test').BrowserContext} context - Browser context
 * @returns {Promise<void>}
 */
export async function clearAllBrowserData(context) {
  await context.clearCookies()
  await context.clearPermissions()
}
