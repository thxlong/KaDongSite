// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Frontend E2E Testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  testMatch: '**/*.spec.js',
  
  // Parallel execution
  fullyParallel: true,
  
  // Forbid test.only in CI
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Number of workers
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Global timeout for each test
  timeout: 30 * 1000, // 30 seconds
  
  // Expect timeout
  expect: {
    timeout: 5 * 1000,
  },
  
  // Shared settings for all tests
  use: {
    // Base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Browser options - ALWAYS HEADED MODE
    headless: false,
    viewport: { width: 1280, height: 720 },
    
    // Capture trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // NO STORAGE STATE - Fresh profile every test
    storageState: undefined,
  },
  
  // Projects for different browsers and test types
  projects: [
    // E2E Tests - Chrome ONLY (headed mode, fresh profile)
    {
      name: 'chrome-e2e',
      testMatch: /.*\.e2e\.spec\.js/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        headless: false, // Always headed
        channel: 'chrome', // Use Google Chrome
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled', // Hide automation
            '--disable-web-security', // For CORS
          ],
        },
        // Clear all storage before each test
        storageState: undefined,
      },
    },
    
    // Mobile Tests - Optional
    {
      name: 'mobile-chrome',
      testMatch: /.*\.mobile\.spec\.js/,
      use: { 
        ...devices['Pixel 5'],
      },
    },
    
    {
      name: 'mobile-safari',
      testMatch: /.*\.mobile\.spec\.js/,
      use: { 
        ...devices['iPhone 12'],
      },
    },
    
    // Component Tests
    {
      name: 'component-tests',
      testMatch: /.*\.component\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  
  // Start dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },
})
