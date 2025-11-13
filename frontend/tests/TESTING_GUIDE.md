# Testing Guide - E2E with Playwright
> **Best Practices for AI-Friendly, Self-Healing E2E Tests**

---

## 📚 Table of Contents
1. [Testing Philosophy](#testing-philosophy)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Selector Strategies](#selector-strategies)
5. [Self-Healing Implementation](#self-healing-implementation)
6. [Writing AI-Friendly Tests](#writing-ai-friendly-tests)
7. [Code Standards](#code-standards)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Testing Philosophy

### Our Approach
```
User Behavior > Implementation Details
Stability > Speed
Maintainability > Cleverness
```

### Core Principles
1. **Test user journeys, not implementations**
   - ❌ Bad: `click('#btn-123')`
   - ✅ Good: `click('button:has-text("Save")')`

2. **Self-healing by design**
   - Multiple fallback selectors
   - Semantic HTML prioritized
   - Graceful degradation

3. **AI-friendly documentation**
   - Clear test descriptions
   - Given-When-Then structure
   - Comprehensive comments

4. **Maintainability first**
   - Page Object Model
   - DRY (Don't Repeat Yourself)
   - Single source of truth

---

## 🛠️ Technology Stack

### Core Framework
```json
{
  "test-runner": "Playwright 1.56.1",
  "language": "JavaScript/ES6+",
  "pattern": "Page Object Model",
  "style": "BDD (Behavior-Driven Development)"
}
```

### Why Playwright?
- ✅ Cross-browser support (Chromium, Firefox, WebKit)
- ✅ Auto-wait mechanism
- ✅ Network interception
- ✅ Parallel execution
- ✅ Great debugging tools
- ✅ Video & screenshot capture

### Project Structure
```
frontend/
├── tests/
│   ├── e2e/                    # End-to-end test files
│   │   ├── notes.modern.spec.js  # Modern test suite
│   │   └── notes.e2e.spec.js     # Legacy (deprecated)
│   ├── pages/                  # Page Object Models
│   │   └── NotesPage.js        # Notes POM with self-healing
│   ├── utils/                  # Test utilities (future)
│   ├── fixtures/               # Test data (future)
│   └── TEST_SPECIFICATIONS.md  # Test documentation
├── playwright.config.js        # Playwright configuration
└── package.json
```

---

## 🏗️ Architecture Patterns

### 1. Page Object Model (POM)

**Why POM?**
- Separates test logic from page structure
- Reusable methods across tests
- Single place to update selectors
- Easier to maintain

**Structure:**
```javascript
export class NotesPage {
  constructor(page) {
    this.page = page
    this.selectors = { /* ... */ }
  }
  
  // Navigation
  async goto() { /* ... */ }
  
  // Actions
  async createNote(data) { /* ... */ }
  async editNote(index, data) { /* ... */ }
  
  // Assertions
  async expectNoteExists(title) { /* ... */ }
  
  // Helpers
  async getAllNotes() { /* ... */ }
}
```

### 2. Selector Configuration Object

Instead of hardcoded selectors:
```javascript
// ❌ Bad: Hardcoded
await page.click('[data-testid="button"]')

// ✅ Good: Configuration object
this.selectors = {
  addButton: {
    primary: 'button:has-text("Thêm ghi chú")',
    fallback: [
      'button:has(svg.lucide-plus)',
      'button[class*="bg-gradient"]',
      '[data-testid="add-note-button"]'
    ],
    description: 'Button to add new note'
  }
}
```

**Benefits:**
- Clear intent
- Easy to update
- Self-documenting
- AI can understand purpose

### 3. Self-Healing Locator

```javascript
async getElement(selectorConfig) {
  try {
    // Try primary selector first
    const element = this.page.locator(selectorConfig.primary)
    await element.waitFor({ timeout: 2000 })
    return element
  } catch (error) {
    console.log(`⚠️ Primary failed: ${selectorConfig.primary}`)
    
    // Fallback loop
    for (const fallback of selectorConfig.fallback || []) {
      try {
        const element = this.page.locator(fallback)
        await element.waitFor({ timeout: 2000 })
        console.log(`✅ Fallback successful: ${fallback}`)
        return element
      } catch (e) {
        continue
      }
    }
    
    throw new Error(`❌ All selectors failed: ${selectorConfig.description}`)
  }
}
```

**How it works:**
1. Try best selector (semantic, stable)
2. If fails, try backup selectors in order
3. Log which selector worked
4. Throw clear error if all fail

---

## 🎯 Selector Strategies

### Priority Order (Best to Worst)

#### 1. Role + Accessible Name (Best ⭐⭐⭐)
```javascript
page.getByRole('button', { name: 'Thêm ghi chú' })
page.getByRole('textbox', { name: 'Tiêu đề' })
```
**Why:** Accessibility-first, semantic, stable

#### 2. Text Content (Very Good ⭐⭐)
```javascript
page.locator('button:has-text("Save")')
page.locator('h1:has-text("Ghi chú")')
```
**Why:** User-visible, language-dependent but clear

#### 3. Placeholder/Label (Good ⭐⭐)
```javascript
page.locator('input[placeholder*="Tiêu đề"]')
page.getByLabel('Email')
```
**Why:** Stable, user-focused

#### 4. Data Attributes (Okay ⭐)
```javascript
page.locator('[data-testid="note-card"]')
```
**Why:** Explicit for testing, but requires code changes

#### 5. CSS Classes (Fragile ⚠️)
```javascript
page.locator('.bg-white.rounded-2xl')
```
**Why:** Breaks with styling changes

#### 6. XPath (Last Resort 🚫)
```javascript
page.locator('xpath=//div[@class="container"]/button[1]')
```
**Why:** Fragile, hard to read, maintenance nightmare

### Example: Complete Selector

```javascript
titleInput: {
  primary: 'input[placeholder*="Tiêu đề"]',  // User-visible attribute
  fallback: [
    'input[type="text"]',                    // Generic but works
    'form input:first-of-type',              // Structure-based
    '[data-testid="note-title-input"]',      // Test attribute
    'input[name="title"]'                    // Form name
  ],
  description: 'Note title input field'
}
```

---

## 🔄 Self-Healing Implementation

### Concept
When UI changes break tests, self-healing tries alternative selectors automatically.

### Implementation Steps

#### 1. Define Multi-Strategy Selectors
```javascript
this.selectors = {
  saveButton: {
    primary: 'button[type="submit"]:has-text("Lưu")',
    fallback: [
      'button:has(svg.lucide-check)',
      'button[class*="bg-green"]',
      '[data-testid="save-button"]',
      'form button[type="submit"]'
    ],
    description: 'Save note button'
  }
}
```

#### 2. Create Smart Getter
```javascript
async getElement(selectorConfig) {
  // Try primary first (fast path)
  try {
    const element = this.page.locator(selectorConfig.primary)
    await element.waitFor({ timeout: 2000 })
    return element
  } catch (error) {
    // Log for debugging
    console.log(`⚠️ Primary selector failed: ${selectorConfig.primary}`)
    console.log(`🔄 Trying ${selectorConfig.fallback.length} fallback selectors...`)
    
    // Try each fallback
    for (let i = 0; i < selectorConfig.fallback.length; i++) {
      const selector = selectorConfig.fallback[i]
      try {
        const element = this.page.locator(selector)
        await element.waitFor({ timeout: 2000 })
        
        // Success! Log it
        console.log(`✅ Fallback #${i+1} successful: ${selector}`)
        
        // Optional: Report for analysis
        // this.reportFallbackUsed(selectorConfig.description, selector)
        
        return element
      } catch (e) {
        console.log(`❌ Fallback #${i+1} failed: ${selector}`)
        continue
      }
    }
    
    // All failed - throw helpful error
    throw new Error(
      `❌ All selectors failed for: ${selectorConfig.description}\n` +
      `Primary: ${selectorConfig.primary}\n` +
      `Fallbacks: ${selectorConfig.fallback.join(', ')}`
    )
  }
}
```

#### 3. Use in Page Methods
```javascript
async clickAddButton() {
  const button = await this.getElement(this.selectors.addButton)
  await button.click()
}
```

### Benefits
- Tests don't break immediately on UI changes
- Logs show which selector worked
- Can analyze logs to update primary selectors
- Buys time to fix tests properly

### Monitoring Self-Healing
```javascript
class SelfHealingReporter {
  constructor() {
    this.fallbackUsage = []
  }
  
  reportFallbackUsed(element, fallbackSelector) {
    this.fallbackUsage.push({
      element,
      fallbackSelector,
      timestamp: new Date()
    })
  }
  
  generateReport() {
    // Group by element
    // Show frequency
    // Suggest primary selector updates
  }
}
```

---

## 🤖 Writing AI-Friendly Tests

### Principles

1. **Clear Intent in Names**
```javascript
// ❌ Bad
test('test1', async () => { /* ... */ })

// ✅ Good
test('TC02: Should create a new note successfully', async () => { /* ... */ })
```

2. **Given-When-Then Structure**
```javascript
test('Should edit existing note', async () => {
  // GIVEN: A note exists
  const originalNote = testData.notes.simple
  await notesPage.createNote(originalNote)
  
  // WHEN: User edits the note
  const updatedData = { title: 'Updated Title', ... }
  await notesPage.editNote(0, updatedData)
  
  // THEN: Changes are reflected
  await notesPage.expectNoteExists(updatedData.title)
  
  console.log('✅ Note edited successfully')
})
```

3. **Descriptive Comments**
```javascript
/**
 * TEST 4: Edit Existing Note
 * GIVEN: A note exists
 * WHEN: User edits the note
 * THEN: Changes are saved and displayed
 */
```

4. **Explicit Test Data**
```javascript
const testData = {
  notes: {
    simple: {
      title: 'Test Note Title',
      content: 'This is a test note content',
      color: 'pink'
    },
    special: {
      title: 'Special Characters: @#$%^&*()',
      content: 'Testing "quotes", unicode: ✨',
      color: 'mint'
    }
  }
}
```

5. **Meaningful Logs**
```javascript
console.log('✅ TC02 PASSED: Note created successfully')
console.log('📝 Created note:', createdNote)
console.log('⚠️ Warning: Fallback selector used')
console.log('❌ Error: Unable to find element')
```

### AI Prompt Examples

When asking AI to extend tests:

```
"Add a test case for TC11: Multiple Notes Display
- Create 10 notes with different colors
- Verify grid layout shows all notes
- Check that scrolling works correctly
- Follow the same pattern as TC02-TC10
- Use NotesPage methods
- Include Given-When-Then comments
- Add to notes.modern.spec.js"
```

---

## 📏 Code Standards

### File Organization

```javascript
/**
 * File header: What, why, how
 */

// 1. Imports
import { test, expect } from '@playwright/test'
import { NotesPage } from '../pages/NotesPage.js'

// 2. Configuration
test.describe.configure({ mode: 'serial' })

// 3. Test Data
const testData = { /* ... */ }

// 4. Test Suite
test.describe('Feature Name @tags', () => {
  // 5. Setup
  let page
  test.beforeEach(async ({ page }) => { /* ... */ })
  
  // 6. Test Cases
  test('TC01: Description', async () => { /* ... */ })
  
  // 7. Teardown
  test.afterEach(async ({ page }, testInfo) => { /* ... */ })
})
```

### Naming Conventions

```javascript
// Page Objects: PascalCase
class NotesPage {}
class LoginPage {}

// Methods: camelCase, verb-first
async createNote() {}
async expectNoteExists() {}

// Variables: camelCase, descriptive
const noteData = {}
const testResults = {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000'
const MAX_RETRIES = 3

// Test data: camelCase object
const testData = {
  notes: {},
  users: {}
}
```

### Comment Style

```javascript
/**
 * Multi-line JSDoc for functions/classes
 * @param {Object} data - Note data
 * @returns {Promise<void>}
 */

// Single-line for inline explanations

/* 
 * Block comments for sections
 * or complex logic explanations
 */
```

---

## 🔧 Common Patterns

### Pattern 1: Create-Verify
```javascript
// Create entity
await notesPage.createNote(testData.notes.simple)

// Verify it exists
await notesPage.expectNoteExists(testData.notes.simple.title)

// Get actual data
const actualNote = await notesPage.getNoteTitle(0)
expect(actualNote).toContain(testData.notes.simple.title)
```

### Pattern 2: Setup-Action-Teardown
```javascript
test('Should delete note', async () => {
  // Setup: Create notes
  await notesPage.createNote({ title: 'Keep' })
  await notesPage.createNote({ title: 'Delete' })
  
  // Action: Delete one
  await notesPage.deleteNote(1)
  
  // Verify: Check result
  await notesPage.expectNoteCount(1)
  
  // No explicit teardown (handled by test isolation)
})
```

### Pattern 3: Data-Driven Testing
```javascript
const colors = ['pink', 'purple', 'mint', 'blue', 'peach', 'cream']

for (const color of colors) {
  test(`Should create note with ${color} color`, async () => {
    await notesPage.createNote({
      title: `${color} note`,
      content: `Content for ${color}`,
      color: color
    })
    
    await notesPage.expectNoteExists(`${color} note`)
  })
}
```

### Pattern 4: Error Recovery
```javascript
async createNote(data) {
  try {
    await this.clickAddButton()
    await this.fillNoteForm(data)
    await this.saveNote()
  } catch (error) {
    console.log('❌ Create note failed, attempting recovery...')
    
    // Try to close form if stuck
    try {
      await this.cancelNote()
    } catch (e) {
      // Ignore
    }
    
    throw error
  }
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Issue 1: Element Not Found
```javascript
// Symptoms: TimeoutError, element not found

// Debug steps:
1. Check selector in browser DevTools
2. Verify element is visible (not display:none)
3. Wait for page load: await page.waitForLoadState('networkidle')
4. Add explicit wait: await element.waitFor({ timeout: 5000 })
5. Check for dynamic content: await page.waitForTimeout(1000)
```

#### Issue 2: Flaky Tests
```javascript
// Symptoms: Intermittent failures

// Solutions:
1. Add proper waits (not waitForTimeout)
2. Use auto-waiting methods
3. Increase timeout for slow operations
4. Check for race conditions
5. Avoid fixed sleeps

// Good waiting:
await expect(element).toBeVisible()
await page.waitForLoadState('networkidle')
await element.waitFor({ state: 'attached' })
```

#### Issue 3: Test Data Pollution
```javascript
// Symptoms: Tests pass alone, fail together

// Solutions:
1. Implement test isolation
2. Use unique test data (timestamps)
3. Clean up after tests
4. Use test database with reset

// Example:
const uniqueTitle = `Test Note ${Date.now()}`
await notesPage.createNote({ title: uniqueTitle, ... })
```

#### Issue 4: Selector Changes
```javascript
// Symptoms: Tests break after UI update

// Solutions:
1. Use self-healing selectors (already implemented)
2. Check fallback logs
3. Update primary selector based on logs
4. Add new fallback if pattern changed

// Check logs:
⚠️ Primary selector failed: button:has-text("Save")
✅ Fallback successful: button[type="submit"]
→ Action: Update primary to button[type="submit"]:has-text("Save")
```

---

## 📊 Best Practices Summary

### DO ✅
- Use Page Object Model
- Implement self-healing selectors
- Write Given-When-Then tests
- Add descriptive comments
- Use semantic selectors
- Wait for elements properly
- Log meaningful messages
- Keep test data separate
- Follow naming conventions
- Test user behaviors

### DON'T ❌
- Hardcode selectors in tests
- Use only CSS classes
- Write cryptic test names
- Skip error handling
- Use fixed sleeps (waitForTimeout)
- Test implementation details
- Couple tests together
- Ignore flaky tests
- Forget to document
- Over-complicate

---

## 🚀 Extending the Framework

### Adding New Page Objects

```javascript
// 1. Create new file: tests/pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page
    this.selectors = {
      // Define selectors with fallbacks
    }
  }
  
  // Implement methods
}

// 2. Use in tests: tests/e2e/login.spec.js
import { LoginPage } from '../pages/LoginPage.js'

test('Should login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('user@example.com', 'password')
})
```

### Adding Test Utilities

```javascript
// tests/utils/helpers.js
export async function retryOperation(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

// Usage:
import { retryOperation } from '../utils/helpers.js'

await retryOperation(() => notesPage.createNote(data))
```

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Test Specifications](./TEST_SPECIFICATIONS.md)
- [Project README](../README.md)

---

**Last Updated:** 2025-11-13  
**Maintained By:** QA Team  
**Version:** 1.0
