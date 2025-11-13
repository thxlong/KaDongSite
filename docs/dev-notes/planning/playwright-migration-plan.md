# 🔄 Migration Guide: Jest/Supertest/Cypress → Playwright

**Purpose:** Guide for migrating existing tests to Playwright  
**Last Updated:** 2025-11-13

---

## 📋 Overview

This guide helps you migrate from:
- **Jest + Supertest** (API testing) → **Playwright API Testing**
- **Cypress** (E2E testing) → **Playwright E2E Testing**
- **Jest + React Testing Library** (Component testing) → **Playwright Component Testing**

---

## 🎯 Why Migrate?

### Problems with Current Stack

**Jest + Supertest:**
- ❌ Separate framework for API vs E2E
- ❌ No browser automation
- ❌ Limited parallel execution
- ❌ Requires manual mocking setup

**Cypress:**
- ❌ Only Chromium-based browsers
- ❌ No native API testing
- ❌ Parallel tests are paid feature
- ❌ Flaky tests with network timing

### Benefits of Playwright

✅ **Unified framework** - One tool for all testing  
✅ **Cross-browser** - Chrome, Firefox, Safari  
✅ **Built-in parallelization** - Faster CI/CD  
✅ **Auto-waiting** - Less flaky tests  
✅ **Better debugging** - Trace viewer, UI mode  
✅ **Microsoft support** - Active development

---

## 📦 Installation

### 1. Remove Old Dependencies

```bash
# Backend
cd backend
npm uninstall jest supertest @types/jest @types/supertest

# Frontend
cd frontend
npm uninstall cypress @testing-library/react @testing-library/jest-dom
```

### 2. Install Playwright

```bash
# Backend
cd backend
npm install -D @playwright/test
npx playwright install

# Frontend  
cd frontend
npm install -D @playwright/test
npm install -D @playwright/experimental-ct-react  # For component tests
npx playwright install
```

---

## 🔧 Configuration Migration

### Jest → Playwright Config

**Before (jest.config.js):**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js'],
}
```

**After (playwright.config.js):**
```javascript
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  reporter: [['html'], ['json'], ['list']],
  use: {
    baseURL: 'http://localhost:5000/api',
  },
})
```

### Cypress → Playwright Config

**Before (cypress.config.js):**
```javascript
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
  },
}
```

**After (playwright.config.js):**
```javascript
const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
```

---

## 🔄 API Testing Migration (Jest + Supertest → Playwright)

### Before (Jest + Supertest)

```javascript
const request = require('supertest')
const app = require('../app')

describe('Notes API', () => {
  it('should get all notes', async () => {
    const response = await request(app)
      .get('/api/notes')
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
  
  it('should create note', async () => {
    const newNote = {
      title: 'Test',
      content: 'Content'
    }
    
    const response = await request(app)
      .post('/api/notes')
      .send(newNote)
      .expect(201)
    
    expect(response.body.data.title).toBe('Test')
  })
})
```

### After (Playwright)

```javascript
const { test, expect } = require('@playwright/test')

test.describe('Notes API', () => {
  test('should get all notes', async ({ request }) => {
    const response = await request.get('/api/notes')
    
    expect(response.ok()).toBeTruthy()
    expect(response.status()).toBe(200)
    
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
  
  test('should create note', async ({ request }) => {
    const newNote = {
      title: 'Test',
      content: 'Content'
    }
    
    const response = await request.post('/api/notes', {
      data: newNote
    })
    
    expect(response.status()).toBe(201)
    
    const data = await response.json()
    expect(data.data.title).toBe('Test')
  })
})
```

### Key Changes

| Jest/Supertest | Playwright | Notes |
|---------------|-----------|-------|
| `describe()` | `test.describe()` | Same concept |
| `it()` | `test()` | Test definition |
| `request(app).get()` | `request.get()` | Built-in request |
| `.expect(200)` | `expect(response.status()).toBe(200)` | Explicit assertion |
| `.send(data)` | `{ data: ... }` | Options object |

---

## 🌐 E2E Testing Migration (Cypress → Playwright)

### Before (Cypress)

```javascript
describe('Notes Tool', () => {
  beforeEach(() => {
    cy.visit('/notes')
  })
  
  it('should create note', () => {
    cy.get('[data-testid="add-note"]').click()
    cy.get('[name="title"]').type('Test Note')
    cy.get('[name="content"]').type('Content')
    cy.contains('Save').click()
    
    cy.contains('Test Note').should('be.visible')
  })
  
  it('should search notes', () => {
    cy.get('[data-testid="search"]').type('test')
    cy.get('.note-card').should('have.length.at.least', 1)
  })
})
```

### After (Playwright)

```javascript
const { test, expect } = require('@playwright/test')

test.describe('Notes Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notes')
  })
  
  test('should create note', async ({ page }) => {
    await page.click('[data-testid="add-note"]')
    await page.fill('[name="title"]', 'Test Note')
    await page.fill('[name="content"]', 'Content')
    await page.click('button:has-text("Save")')
    
    await expect(page.locator('text=Test Note')).toBeVisible()
  })
  
  test('should search notes', async ({ page }) => {
    await page.fill('[data-testid="search"]', 'test')
    
    const noteCards = page.locator('.note-card')
    expect(await noteCards.count()).toBeGreaterThanOrEqual(1)
  })
})
```

### Key Changes

| Cypress | Playwright | Notes |
|---------|-----------|-------|
| `cy.visit()` | `page.goto()` | Navigation |
| `cy.get()` | `page.locator()` | Element selection |
| `.click()` | `page.click()` | Click action |
| `.type()` | `page.fill()` | Input text |
| `.should('be.visible')` | `expect(...).toBeVisible()` | Assertion |
| `cy.contains()` | `page.locator('text=...')` | Text locator |

---

## 🧩 Component Testing Migration

### Before (React Testing Library)

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import NoteCard from './NoteCard'

describe('NoteCard', () => {
  it('should render note', () => {
    const note = { title: 'Test', content: 'Content' }
    render(<NoteCard note={note} />)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  
  it('should call onEdit', () => {
    const handleEdit = jest.fn()
    render(<NoteCard note={{}} onEdit={handleEdit} />)
    
    fireEvent.click(screen.getByLabelText('Edit'))
    expect(handleEdit).toHaveBeenCalled()
  })
})
```

### After (Playwright Component Testing)

```javascript
const { test, expect } = require('@playwright/experimental-ct-react')
const NoteCard = require('./NoteCard')

test.describe('NoteCard', () => {
  test('should render note', async ({ mount }) => {
    const note = { title: 'Test', content: 'Content' }
    const component = await mount(<NoteCard note={note} />)
    
    await expect(component.locator('text=Test')).toBeVisible()
    await expect(component.locator('text=Content')).toBeVisible()
  })
  
  test('should call onEdit', async ({ mount }) => {
    let editCalled = false
    const handleEdit = () => { editCalled = true }
    
    const component = await mount(<NoteCard note={{}} onEdit={handleEdit} />)
    
    await component.locator('[aria-label="Edit"]').click()
    expect(editCalled).toBe(true)
  })
})
```

---

## 📊 Migration Checklist

### Phase 1: Setup (Day 1)

- [ ] Install Playwright dependencies
- [ ] Create playwright.config.js files
- [ ] Remove old test dependencies
- [ ] Update package.json scripts
- [ ] Install browsers (`npx playwright install`)

### Phase 2: Configuration (Day 1)

- [ ] Configure test directories
- [ ] Setup reporters (HTML, JSON, LCOV)
- [ ] Configure browser settings
- [ ] Setup global setup/teardown
- [ ] Configure environment variables

### Phase 3: API Tests Migration (Day 2-3)

- [ ] Create test fixtures
- [ ] Migrate GET endpoint tests
- [ ] Migrate POST endpoint tests
- [ ] Migrate PUT endpoint tests
- [ ] Migrate DELETE endpoint tests
- [ ] Add error handling tests
- [ ] Add validation tests
- [ ] Add security tests (SQL injection, XSS)

### Phase 4: E2E Tests Migration (Day 3-5)

- [ ] Migrate navigation tests
- [ ] Migrate form submission tests
- [ ] Migrate search/filter tests
- [ ] Migrate CRUD workflow tests
- [ ] Add cross-browser tests
- [ ] Add mobile viewport tests
- [ ] Add accessibility tests

### Phase 5: Component Tests Migration (Day 5-6)

- [ ] Setup component testing
- [ ] Migrate component render tests
- [ ] Migrate event handler tests
- [ ] Migrate props validation tests
- [ ] Add visual regression tests (optional)

### Phase 6: CI/CD Integration (Day 6-7)

- [ ] Update GitHub Actions workflow
- [ ] Configure test parallelization
- [ ] Setup test result artifacts
- [ ] Configure coverage reports
- [ ] Test production builds

### Phase 7: Documentation & Training (Day 7)

- [ ] Update TESTING_GUIDE.md
- [ ] Create migration examples
- [ ] Document best practices
- [ ] Train team on Playwright
- [ ] Remove old test documentation

---

## 🔧 Common Migration Patterns

### Pattern 1: Async/Await

```javascript
// Cypress (chain-based)
cy.get('.button').click()
  .then(() => cy.get('.modal'))
  .then(() => cy.contains('Success'))

// Playwright (async/await)
await page.click('.button')
await page.locator('.modal').waitFor()
await expect(page.locator('text=Success')).toBeVisible()
```

### Pattern 2: Custom Commands

```javascript
// Cypress custom command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[name=email]').type(email)
  cy.get('[name=password]').type(password)
  cy.contains('Login').click()
})

// Playwright fixture
test.extend({
  async loginAs({ page }, use, testInfo) {
    await page.goto('/login')
    await page.fill('[name=email]', 'user@test.com')
    await page.fill('[name=password]', 'password')
    await page.click('button:has-text("Login")')
    await use(page)
  }
})
```

### Pattern 3: Waiting

```javascript
// Cypress (automatic waiting)
cy.get('.button').click()  // Auto-waits

// Playwright (also auto-waits)
await page.click('.button')  // Auto-waits

// Explicit waits
await page.waitForSelector('.element')
await page.waitForLoadState('networkidle')
```

---

## 💡 Best Practices After Migration

### 1. Use Test Tags

```javascript
test('GET /api/notes @api @smoke', async ({ request }) => {
  // Test code
})

test('should create note @e2e @critical', async ({ page }) => {
  // Test code
})
```

Run tagged tests:
```bash
npx playwright test --grep @smoke
npx playwright test --grep "@api.*@critical"
```

### 2. Organize Tests by Type

```
tests/
├── api/          # API tests (@api tag)
├── e2e/          # E2E tests (@e2e tag)
├── component/    # Component tests (@component tag)
├── helpers/      # Test utilities
└── fixtures/     # Test data
```

### 3. Use Page Object Model

```javascript
class NotesPage {
  constructor(page) {
    this.page = page
    this.addButton = page.locator('[data-testid="add-note"]')
    this.searchInput = page.locator('[data-testid="search"]')
  }
  
  async createNote(title, content) {
    await this.addButton.click()
    await this.page.fill('[name="title"]', title)
    await this.page.fill('[name="content"]', content)
    await this.page.click('button:has-text("Save")')
  }
}
```

### 4. Parallel Execution

```javascript
// playwright.config.js
module.exports = {
  workers: process.env.CI ? 2 : undefined,  // 2 workers on CI
  fullyParallel: true,
}
```

---

## 🎓 Learning Resources

### Official Docs
- https://playwright.dev/docs/intro
- https://playwright.dev/docs/api-testing
- https://playwright.dev/docs/test-components

### Migration Guides
- https://playwright.dev/docs/test-runners
- https://playwright.dev/docs/best-practices

### Video Tutorials
- Playwright YouTube Channel
- Microsoft Learn Platform

---

## ✅ Verification

After migration, verify:

```bash
# Run all tests
npx playwright test

# Check coverage
npx playwright test --reporter=html

# Test in all browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Generate report
npx playwright show-report
```

Expected results:
- ✅ All tests passing
- ✅ Coverage >= 80%
- ✅ Faster execution than before
- ✅ Tests run in parallel
- ✅ Cross-browser compatibility

---

**Last Updated:** 2025-11-13  
**Migration Status:** ✅ Complete
