// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright Configuration for Backend API Testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',
  testMatch: ['**/*.spec.js', '**/*.api.spec.js', '**/*.integration.spec.js'],
  testIgnore: ['**/frontend/**', '**/tests/fashion.test.js', '**/tests/mocks/**'],
  
  // Parallel execution for faster tests
  fullyParallel: true,
  
  // Number of workers
  workers: process.env.CI ? 1 : undefined,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Global timeout for each test
  timeout: 30 * 1000, // 30 seconds
  
  // Expect timeout
  expect: {
    timeout: 5 * 1000, // 5 seconds
  },
  
  // Global setup and teardown
  globalSetup: './tests/global-setup.js',
  globalTeardown: './tests/global-teardown.js',
  
  // Shared settings for all tests
  use: {
    // Base URL for API
    baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
    
    // Capture trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
  
  // Projects for different test types
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.api\.spec\.js/,
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:5000/api',
      },
    },
    {
      name: 'Integration Tests',
      testMatch: /.*\.integration\.spec\.js/,
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
      },
    },
  ],
  
  // Web server for tests (optional - if you want Playwright to start server)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5000/health',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
})
