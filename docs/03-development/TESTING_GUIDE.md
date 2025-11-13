# 🧪 Testing Guide - Playwright

**Framework:** Playwright v1.40+  
**Purpose:** Comprehensive testing strategy for KaDong Tools  
**Last Updated:** 2025-11-13

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why Playwright?](#why-playwright)
3. [Setup & Installation](#setup--installation)
4. [API Testing](#api-testing)
5. [E2E Testing](#e2e-testing)
6. [Component Testing](#component-testing)
7. [Best Practices](#best-practices)
8. [Running Tests](#running-tests)
9. [Debugging](#debugging)
10. [CI/CD Integration](#cicd-integration)

---

## 🎯 Overview

**Testing Strategy:**
- ✅ **API Testing** - Test REST API endpoints (backend)
- ✅ **E2E Testing** - Test user workflows (frontend + backend)
- ✅ **Component Testing** - Test React components in isolation

**Coverage Target:** 80% minimum

**Tech Stack:**
- Framework: Playwright v1.40+
- Browsers: Chromium, Firefox, WebKit
- Language: JavaScript/TypeScript
- Reporter: HTML + JSON + LCOV

---

## 🚀 Why Playwright?

### Advantages over Jest/Supertest/Cypress

| Feature | Playwright | Jest + Supertest | Cypress |
|---------|-----------|------------------|---------|
| **Unified Framework** | ✅ API + E2E + Component | ❌ Separate tools | ⚠️ E2E only |
| **Cross-Browser** | ✅ Chrome, Firefox, Safari | ❌ Node only | ⚠️ Chrome-based |
| **Parallel Execution** | ✅ Built-in | ⚠️ With config | ⚠️ Paid feature |
| **Network Interception** | ✅ Native | ❌ Need mocks | ✅ Yes |
| **Auto-wait** | ✅ Smart waiting | ❌ Manual | ✅ Yes |
| **Debugging** | ✅ Trace viewer + UI | ⚠️ Basic | ✅ Good |
| **Microsoft Support** | ✅ Official | ❌ Community | ❌ Company |
| **Modern Architecture** | ✅ 2024 | ⚠️ 2016 | ⚠️ 2015 |

**Key Benefits:**
1. **One framework** cho tất cả testing needs
2. **Faster execution** với parallel tests
3. **Better debugging** với trace viewer
4. **Real browser testing** (not just jsdom)
5. **Built-in mocking** và network interception
6. **Official Microsoft support** và active development

---

## 🛠️ Setup & Installation

### 1. Install Playwright

**Backend:**
```bash
cd backend
npm install -D @playwright/test
npx playwright install  # Install browsers
```

**Frontend:**
```bash
cd frontend
npm install -D @playwright/test
npm install -D @playwright/experimental-ct-react  # For component testing
npx playwright install
```

### 2. Create Configuration Files

**Backend:** `backend/playwright.config.js`
```javascript
// @ts-check
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  
  // Parallel execution
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  
  // Retry on CI
  retries: process.env.CI ? 2 : 0,
  
  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list']
  ],
  
  // Global timeout
  timeout: 30000,
  
  use: {
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  
  // Projects for different types
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.api\.spec\.js/,
      use: { 
        baseURL: 'http://localhost:5000/api',
      },
    },
  ],
})
```

**Frontend:** `frontend/playwright.config.js`
```javascript
// @ts-check
const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
  
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  // Dev server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 🔧 API Testing

### Test Structure

```
backend/
└── tests/
    ├── api/
    │   ├── notes.api.spec.js
    │   ├── events.api.spec.js
    │   ├── auth.api.spec.js
    │   └── currency.api.spec.js
    └── helpers/
        ├── setup.js
        └── fixtures.js
```

### Example: Notes API Test

**File:** `backend/tests/api/notes.api.spec.js`

```javascript
const { test, expect } = require('@playwright/test')

// Test data
let testNoteId

test.describe('Notes API', () => {
  
  test.beforeAll(async () => {
    // Setup: Clean database or seed data
    console.log('Setting up test data...')
  })
  
  test.afterAll(async () => {
    // Cleanup: Remove test data
    console.log('Cleaning up test data...')
  })
  
  test('GET /api/notes - should return all notes', async ({ request }) => {
    const response = await request.get('/api/notes', {
      headers: {
        'Authorization': 'Bearer test-token-here'
      }
    })
    
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
  
  test('POST /api/notes - should create new note', async ({ request }) => {
    const newNote = {
      title: 'Test Note',
      content: 'This is a test note',
      color: 'pink',
      user_id: '00000000-0000-0000-0000-000000000001'
    }
    
    const response = await request.post('/api/notes', {
      data: newNote,
      headers: {
        'Authorization': 'Bearer test-token-here',
        'Content-Type': 'application/json'
      }
    })
    
    expect(response.status()).toBe(201)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('id')
    expect(data.data.title).toBe(newNote.title)
    
    // Save ID for next tests
    testNoteId = data.data.id
  })
  
  test('GET /api/notes/:id - should return single note', async ({ request }) => {
    const response = await request.get(`/api/notes/${testNoteId}`)
    
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.data.id).toBe(testNoteId)
  })
  
  test('PUT /api/notes/:id - should update note', async ({ request }) => {
    const updates = {
      title: 'Updated Test Note',
      content: 'Updated content'
    }
    
    const response = await request.put(`/api/notes/${testNoteId}`, {
      data: updates
    })
    
    expect(response.ok()).toBeTruthy()
    const data = await response.json()
    expect(data.data.title).toBe(updates.title)
  })
  
  test('DELETE /api/notes/:id - should soft delete note', async ({ request }) => {
    const response = await request.delete(`/api/notes/${testNoteId}`)
    
    expect(response.ok()).toBeTruthy()
    
    // Verify soft delete
    const getResponse = await request.get(`/api/notes/${testNoteId}`)
    expect(getResponse.status()).toBe(404)
  })
  
  test('POST /api/notes - should validate required fields', async ({ request }) => {
    const invalidNote = {
      // Missing title
      content: 'Content only'
    }
    
    const response = await request.post('/api/notes', {
      data: invalidNote
    })
    
    expect(response.status()).toBe(400)
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error).toBeDefined()
  })
  
  test('POST /api/notes - should prevent SQL injection', async ({ request }) => {
    const maliciousNote = {
      title: "'; DROP TABLE notes; --",
      content: 'SQL Injection attempt',
      user_id: '00000000-0000-0000-0000-000000000001'
    }
    
    const response = await request.post('/api/notes', {
      data: maliciousNote
    })
    
    // Should succeed (parameterized query prevents injection)
    expect(response.ok()).toBeTruthy()
    
    // Verify notes table still exists
    const notesResponse = await request.get('/api/notes')
    expect(notesResponse.ok()).toBeTruthy()
  })
})
```

### API Testing Best Practices

```javascript
// ✅ Good: Use test fixtures
test('should create note with fixture data', async ({ request }) => {
  const note = await fixtures.createNote()
  // Test with note
})

// ✅ Good: Test error cases
test('should handle network errors gracefully', async ({ request }) => {
  await request.get('/api/notes', { timeout: 1 })
  // Expect timeout error
})

// ✅ Good: Cleanup after tests
test.afterEach(async ({ request }) => {
  await request.delete(`/api/notes/${testNoteId}`)
})

// ❌ Bad: Hardcoded URLs
const response = await request.get('http://localhost:5000/api/notes')

// ✅ Good: Use baseURL from config
const response = await request.get('/api/notes')
```

---

## 🌐 E2E Testing

### Test Structure

```
frontend/
└── tests/
    ├── e2e/
    │   ├── notes.e2e.spec.js
    │   ├── countdown.e2e.spec.js
    │   ├── auth.e2e.spec.js
    │   └── wishlist.e2e.spec.js
    └── utils/
        ├── login.js
        └── cleanup.js
```

### Example: Notes E2E Test

**File:** `frontend/tests/e2e/notes.e2e.spec.js`

```javascript
const { test, expect } = require('@playwright/test')

test.describe('Notes Tool - E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to notes page
    await page.goto('/notes')
    
    // Wait for page load
    await page.waitForLoadState('networkidle')
  })
  
  test('should create a new note', async ({ page }) => {
    // Click Add Note button
    await page.click('button:has-text("Add Note")')
    
    // Fill in note details
    await page.fill('input[name="title"]', 'My Test Note')
    await page.fill('textarea[name="content"]', 'This is the content')
    
    // Select color
    await page.click('button[data-color="pink"]')
    
    // Save note
    await page.click('button:has-text("Save")')
    
    // Verify note appears in list
    await expect(page.locator('text=My Test Note')).toBeVisible()
    
    // Verify success message
    await expect(page.locator('.toast-success')).toContainText('Note created')
  })
  
  test('should search notes', async ({ page }) => {
    // Type in search box
    await page.fill('input[placeholder*="Search"]', 'test')
    
    // Wait for search results
    await page.waitForTimeout(500)  // Debounce
    
    // Verify filtered results
    const notes = page.locator('.note-card')
    const count = await notes.count()
    
    for (let i = 0; i < count; i++) {
      const text = await notes.nth(i).textContent()
      expect(text.toLowerCase()).toContain('test')
    }
  })
  
  test('should edit note', async ({ page }) => {
    // Click first note
    await page.click('.note-card:first-child')
    
    // Click edit button
    await page.click('button[aria-label="Edit"]')
    
    // Update title
    await page.fill('input[name="title"]', 'Updated Title')
    
    // Save
    await page.click('button:has-text("Save")')
    
    // Verify update
    await expect(page.locator('text=Updated Title')).toBeVisible()
  })
  
  test('should delete note', async ({ page }) => {
    // Click first note
    const firstNote = page.locator('.note-card:first-child')
    const noteTitle = await firstNote.locator('h3').textContent()
    
    // Click delete button
    await firstNote.locator('button[aria-label="Delete"]').click()
    
    // Confirm deletion
    await page.click('button:has-text("Confirm")')
    
    // Verify note removed
    await expect(page.locator(`text=${noteTitle}`)).not.toBeVisible()
  })
  
  test('should persist notes after page reload', async ({ page }) => {
    // Create note
    await page.click('button:has-text("Add Note")')
    await page.fill('input[name="title"]', 'Persistent Note')
    await page.click('button:has-text("Save")')
    
    // Reload page
    await page.reload()
    
    // Verify note still exists
    await expect(page.locator('text=Persistent Note')).toBeVisible()
  })
  
  test('should handle offline mode gracefully', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Try to create note
    await page.click('button:has-text("Add Note")')
    await page.fill('input[name="title"]', 'Offline Note')
    await page.click('button:has-text("Save")')
    
    // Verify error message
    await expect(page.locator('.toast-error')).toContainText('Network error')
    
    // Go back online
    await context.setOffline(false)
  })
})
```

### E2E Testing Best Practices

```javascript
// ✅ Good: Use data-testid for stable selectors
await page.click('[data-testid="add-note-button"]')

// ❌ Bad: Use fragile selectors
await page.click('div > div > button:nth-child(3)')

// ✅ Good: Wait for network to be idle
await page.waitForLoadState('networkidle')

// ✅ Good: Use page object model
class NotesPage {
  constructor(page) {
    this.page = page
    this.addButton = page.locator('[data-testid="add-note"]')
  }
  
  async createNote(title, content) {
    await this.addButton.click()
    // ...
  }
}

// ✅ Good: Mock API responses
await page.route('**/api/notes', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true, data: [] })
  })
})
```

---

## 🧩 Component Testing

### Test Structure

```
frontend/
└── tests/
    └── components/
        ├── NoteCard.component.spec.js
        ├── CountdownTimer.component.spec.js
        └── CurrencyConverter.component.spec.js
```

### Example: Component Test

**File:** `frontend/tests/components/NoteCard.component.spec.js`

```javascript
const { test, expect } = require('@playwright/experimental-ct-react')
const NoteCard = require('../../src/components/notes/NoteCard')

test.describe('NoteCard Component', () => {
  
  test('should render note data correctly', async ({ mount }) => {
    const note = {
      id: '1',
      title: 'Test Note',
      content: 'Test Content',
      color: 'pink',
      created_at: '2025-11-13T00:00:00Z'
    }
    
    const component = await mount(<NoteCard note={note} />)
    
    await expect(component.locator('h3')).toContainText('Test Note')
    await expect(component.locator('p')).toContainText('Test Content')
    await expect(component).toHaveClass(/bg-pink/)
  })
  
  test('should call onEdit when edit button clicked', async ({ mount }) => {
    let editCalled = false
    const handleEdit = () => { editCalled = true }
    
    const component = await mount(
      <NoteCard 
        note={{ id: '1', title: 'Test' }} 
        onEdit={handleEdit} 
      />
    )
    
    await component.locator('button[aria-label="Edit"]').click()
    expect(editCalled).toBe(true)
  })
  
  test('should truncate long content', async ({ mount }) => {
    const longNote = {
      id: '1',
      title: 'Long Note',
      content: 'A'.repeat(500)
    }
    
    const component = await mount(<NoteCard note={longNote} />)
    
    const content = await component.locator('p').textContent()
    expect(content.length).toBeLessThan(500)
    expect(content).toContain('...')
  })
})
```

---

## 📝 Best Practices

### 1. Test Organization

```javascript
// ✅ Good: Descriptive test names
test('should create note and show success message', async ({ page }) => {})

// ❌ Bad: Vague test names
test('test 1', async ({ page }) => {})

// ✅ Good: Group related tests
test.describe('Note Creation', () => {
  test('with valid data', async ({ page }) => {})
  test('with invalid data', async ({ page }) => {})
  test('with missing fields', async ({ page }) => {})
})
```

### 2. Data Management

```javascript
// ✅ Good: Use fixtures
const fixtures = require('./fixtures')
test('should create note', async ({ request }) => {
  const note = fixtures.validNote()
  // ...
})

// ✅ Good: Cleanup after tests
test.afterEach(async () => {
  await cleanupTestData()
})
```

### 3. Assertions

```javascript
// ✅ Good: Specific assertions
await expect(page.locator('.note-title')).toHaveText('My Note')

// ❌ Bad: Too generic
await expect(page.locator('.note')).toBeVisible()

// ✅ Good: Multiple assertions for clarity
expect(response.status()).toBe(200)
expect(data.success).toBe(true)
expect(data.data).toBeDefined()
```

### 4. Waiting

```javascript
// ✅ Good: Auto-wait (Playwright default)
await page.click('button')  // Waits automatically

// ❌ Bad: Hard-coded waits
await page.waitForTimeout(3000)

// ✅ Good: Wait for specific condition
await page.waitForSelector('.note-card')
await page.waitForLoadState('networkidle')
```

### 5. Error Handling

```javascript
// ✅ Good: Test error scenarios
test('should show error for invalid input', async ({ page }) => {
  await page.click('button:has-text("Save")')
  await expect(page.locator('.error-message')).toBeVisible()
})

// ✅ Good: Test network errors
test('should handle API failure', async ({ page }) => {
  await page.route('**/api/notes', route => route.abort())
  // Test error handling
})
```

---

## 🎮 Running Tests

### Command Reference

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test notes.api.spec.js

# Run by tag
npx playwright test --grep @api
npx playwright test --grep @e2e

# Run in UI mode (interactive)
npx playwright test --ui

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run with debugging
npx playwright test --debug

# Generate code (record actions)
npx playwright codegen http://localhost:3000

# Show test report
npx playwright show-report
```

### NPM Scripts

**Backend:** `backend/package.json`
```json
{
  "scripts": {
    "test": "playwright test",
    "test:api": "playwright test --grep @api",
    "test:watch": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

**Frontend:** `frontend/package.json`
```json
{
  "scripts": {
    "test": "playwright test",
    "test:e2e": "playwright test --grep @e2e",
    "test:component": "playwright test --grep @component",
    "test:ui": "playwright test --ui",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "test:codegen": "playwright codegen http://localhost:3000"
  }
}
```

---

## 🐛 Debugging

### 1. Visual Debugging

```bash
# Open test in browser
npx playwright test --headed --debug

# Step through test
npx playwright test --debug notes.spec.js
```

### 2. Trace Viewer

```javascript
// Enable tracing in config
use: {
  trace: 'on-first-retry'
}
```

```bash
# View trace
npx playwright show-trace trace.zip
```

### 3. Screenshots

```javascript
// Take screenshot on failure (auto)
use: {
  screenshot: 'only-on-failure'
}

// Manual screenshot
await page.screenshot({ path: 'debug.png' })
```

### 4. Console Logs

```javascript
// Listen to console
page.on('console', msg => console.log(msg.text()))

// Page errors
page.on('pageerror', err => console.log(err))
```

### 5. Pause Execution

```javascript
// Pause test
await page.pause()

// Wait for user input
await page.waitForTimeout(999999)
```

---

## 🚀 CI/CD Integration

### GitHub Actions

**.github/workflows/tests.yml**
```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend && npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run Backend Tests
        run: cd backend && npm test
      
      - name: Run Frontend Tests
        run: cd frontend && npm test
      
      - name: Upload Test Results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: |
            backend/playwright-report/
            frontend/playwright-report/
          retention-days: 30
```

---

## 📊 Coverage Reports

### Generate Coverage

```bash
# Run with coverage
npx playwright test --reporter=html,json,lcov

# View HTML report
npx playwright show-report
```

### Coverage Thresholds

**playwright.config.js**
```javascript
module.exports = defineConfig({
  // ... other config
  
  use: {
    coverage: {
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/*.spec.js'
      ]
    }
  }
})
```

---

## 🔗 Related Documentation

- **Playwright Official Docs:** https://playwright.dev
- **API Testing Guide:** https://playwright.dev/docs/api-testing
- **Component Testing:** https://playwright.dev/docs/test-components
- **Best Practices:** https://playwright.dev/docs/best-practices

---

## 📚 Example Test Files

See complete examples:
- `backend/tests/api/notes.api.spec.js` - API testing
- `frontend/tests/e2e/notes.e2e.spec.js` - E2E testing
- `frontend/tests/components/NoteCard.component.spec.js` - Component testing

---

**Maintained by:** KaDong Team  
**Last Updated:** 2025-11-13  
**Version:** 1.0.0 (Playwright Migration)
