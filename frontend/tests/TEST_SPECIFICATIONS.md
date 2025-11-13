# Test Specifications - Notes Feature
> **Document Version:** 1.0  
> **Last Updated:** 2025-11-13  
> **Feature:** Notes Tool (CRUD Operations)  
> **Test Level:** E2E (End-to-End)  
> **Framework:** Playwright + Page Object Model

---

## 📋 Table of Contents
1. [Test Overview](#test-overview)
2. [Test Scope](#test-scope)
3. [Test Cases](#test-cases)
4. [Test Data](#test-data)
5. [Test Plan](#test-plan)
6. [Task Management](#task-management)
7. [Risk Analysis](#risk-analysis)

---

## 🎯 Test Overview

### Objective
Verify that the Notes feature works correctly across all supported browsers, providing reliable CRUD operations with proper UI feedback and data persistence.

### Success Criteria
- ✅ All critical user journeys work without errors
- ✅ Data persists correctly via API
- ✅ UI responds appropriately to user actions
- ✅ Tests pass on Chromium, Firefox, WebKit
- ✅ No regression in existing functionality

### Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | >90% | TBD |
| Pass Rate | 100% | TBD |
| Execution Time | <5 min | TBD |
| Flakiness | <5% | TBD |

---

## 🔍 Test Scope

### In Scope ✅
1. **CRUD Operations**
   - Create new notes
   - Read/display notes
   - Update existing notes
   - Delete notes

2. **UI Components**
   - Page load and navigation
   - Form display and interactions
   - Button functionality
   - Color selection
   - Empty states
   - Loading states

3. **Data Handling**
   - Form validation
   - Special characters
   - Long content
   - Multiline text
   - Unicode support

4. **User Flows**
   - Happy path scenarios
   - Cancellation flows
   - Error recovery

### Out of Scope ❌
1. **Not Covered**
   - Performance testing (separate suite)
   - Security testing (penetration tests)
   - API unit tests (backend tests)
   - Mobile responsive (visual regression)
   - Accessibility (WCAG compliance)
   - Internationalization (i18n)
   - Search functionality (not implemented)
   - Note sharing (not implemented)

2. **Known Limitations**
   - Test data isolation (requires backend setup)
   - Concurrent user testing
   - Network failure scenarios
   - Browser storage limits

---

## 📝 Test Cases

### Priority Legend
- 🔴 **P0**: Critical - Must pass before release
- 🟡 **P1**: High - Important user flows
- 🟢 **P2**: Medium - Nice to have
- 🔵 **P3**: Low - Edge cases

---

### TC01: Page Load & UI Elements 🔴 P0

**Description:** Verify Notes page loads with all essential UI elements

**Preconditions:**
- Backend API is running (localhost:5000)
- Frontend is accessible (localhost:3000)
- User has valid session

**Test Steps:**
1. Navigate to `/notes`
2. Wait for page to load completely
3. Verify page title is visible
4. Verify "Thêm ghi chú" button is visible

**Expected Results:**
- ✅ Page loads without errors
- ✅ Page title "Ghi chú" is displayed
- ✅ Add button is visible and clickable
- ✅ No error messages shown

**Test Data:** None required

**Automated:** ✅ Yes - `notes.modern.spec.js:TC01`

---

### TC02: Create New Note - Happy Path 🔴 P0

**Description:** User successfully creates a new note

**Preconditions:**
- User is on Notes page
- Form is not already open

**Test Steps:**
1. Click "Thêm ghi chú" button
2. Verify form appears
3. Enter title: "Test Note Title"
4. Enter content: "This is a test note content"
5. Select color: pink
6. Click "Lưu" button
7. Wait for form to close
8. Verify note appears in list

**Expected Results:**
- ✅ Form opens smoothly
- ✅ All fields accept input
- ✅ Color selection works
- ✅ Note is saved to backend
- ✅ Note appears in UI with correct data
- ✅ Form closes after save

**Test Data:**
```javascript
{
  title: 'Test Note Title',
  content: 'This is a test note content',
  color: 'pink'
}
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC02`

---

### TC03: Create Notes with Different Colors 🟡 P1

**Description:** Verify color selection works for all available colors

**Preconditions:**
- User is on Notes page

**Test Steps:**
1. For each color (pink, purple, mint, blue, peach, cream):
   - Create a note with that color
   - Verify note displays with correct color

**Expected Results:**
- ✅ All 6 colors can be selected
- ✅ Notes display with correct background gradient
- ✅ Color persists after save

**Test Data:**
```javascript
colors: ['pink', 'purple', 'mint', 'blue', 'peach', 'cream']
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC03`

---

### TC04: Edit Existing Note 🔴 P0

**Description:** User successfully edits an existing note

**Preconditions:**
- At least one note exists

**Test Steps:**
1. Create a test note
2. Click edit button on the note
3. Verify form opens with existing data
4. Change title to "Updated Title"
5. Change content to "Updated content here"
6. Change color to blue
7. Click "Lưu"
8. Verify changes are saved

**Expected Results:**
- ✅ Form opens with pre-filled data
- ✅ All fields can be modified
- ✅ Changes are saved to backend
- ✅ UI reflects updated data
- ✅ No duplicate notes created

**Test Data:**
```javascript
original: { title: 'Test Note', content: 'Original', color: 'pink' }
updated: { title: 'Updated Title', content: 'Updated content', color: 'blue' }
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC04`

---

### TC05: Delete Note 🔴 P0

**Description:** User successfully deletes a note

**Preconditions:**
- Multiple notes exist

**Test Steps:**
1. Create 2 notes
2. Click delete button on second note
3. Confirm deletion in dialog
4. Verify note is removed

**Expected Results:**
- ✅ Delete confirmation dialog appears
- ✅ Note is deleted from backend
- ✅ Note disappears from UI
- ✅ Other notes remain intact
- ✅ Note count decreases by 1

**Test Data:**
```javascript
note1: { title: 'Note to Keep', ... }
note2: { title: 'Note to Delete', ... }
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC05`

---

### TC06: Cancel Note Creation 🟡 P1

**Description:** User cancels note creation without saving

**Preconditions:**
- User is on Notes page

**Test Steps:**
1. Click "Thêm ghi chú"
2. Enter title: "This should not be saved"
3. Enter content: "Cancelled content"
4. Click "Hủy" button
5. Verify form closes
6. Verify note was NOT saved

**Expected Results:**
- ✅ Form closes without saving
- ✅ No note is created in backend
- ✅ No note appears in UI
- ✅ Page returns to normal state

**Test Data:**
```javascript
{ title: 'This should not be saved', content: 'Cancelled' }
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC06`

---

### TC07: Special Characters Handling 🟡 P1

**Description:** Notes correctly handle special characters and unicode

**Preconditions:**
- User is on Notes page

**Test Steps:**
1. Create note with title: "Special: @#$%^&*()"
2. Content: "Testing \"quotes\", 'apostrophes', unicode: ✨🎉"
3. Save note
4. Verify all characters are preserved

**Expected Results:**
- ✅ Special characters accepted in input
- ✅ Characters saved correctly to backend
- ✅ Characters display correctly in UI
- ✅ No encoding issues

**Test Data:**
```javascript
{
  title: 'Special Characters: @#$%^&*()',
  content: 'Testing with "quotes", \'apostrophes\', unicode: ✨🎉',
  color: 'mint'
}
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC07`

---

### TC08: Empty State Display 🟢 P2

**Description:** Empty state message shows when no notes exist

**Preconditions:**
- Database has no notes for this user
- Clean test environment

**Test Steps:**
1. Navigate to Notes page
2. Verify empty state message appears
3. Verify message text is correct

**Expected Results:**
- ✅ Empty state message visible
- ✅ Message says "Chưa có ghi chú"
- ✅ Prompt to create first note shown

**Test Data:** None (requires clean state)

**Automated:** ⚠️ Partial - Requires test isolation

**Notes:** Currently skipped - needs backend reset capability

---

### TC09: Form Validation - Required Fields 🟡 P1

**Description:** Form prevents submission without required fields

**Preconditions:**
- User is on Notes page

**Test Steps:**
1. Click "Thêm ghi chú"
2. Leave title empty
3. Enter content only
4. Click "Lưu"
5. Verify form does not submit

**Expected Results:**
- ✅ HTML5 validation triggers
- ✅ Form remains open
- ✅ No note is created
- ✅ Error indication shown (browser default)

**Test Data:**
```javascript
{ title: '', content: 'Content without title' }
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC09`

---

### TC10: Long Content Handling 🟢 P2

**Description:** System handles very long text content

**Preconditions:**
- User is on Notes page

**Test Steps:**
1. Create note with 1000+ character content
2. Save note
3. Verify note displays without breaking UI

**Expected Results:**
- ✅ Long content accepts in textarea
- ✅ Content saves to backend
- ✅ UI handles display (truncate/scroll)
- ✅ No layout breaks

**Test Data:**
```javascript
{ title: 'Long Content Test', content: 'A'.repeat(1000) }
```

**Automated:** ✅ Yes - `notes.modern.spec.js:TC10`

---

### Additional Test Cases (Not Yet Implemented)

#### TC11: Multiple Notes Display 🟡 P1
- Create 10+ notes
- Verify grid layout works
- Check scrolling behavior

#### TC12: Note Ordering 🟢 P2
- Verify newest notes appear first
- Check after CRUD operations

#### TC13: Concurrent Edits 🔵 P3
- Edit same note in multiple tabs
- Verify conflict handling

#### TC14: Network Error Recovery 🟡 P1
- Simulate API failure
- Verify error messages
- Test retry logic

#### TC15: Browser Refresh 🟡 P1
- Create note
- Refresh page
- Verify note persists

---

## 🗂️ Test Data

### Static Test Data
Located in `notes.modern.spec.js:testData`

```javascript
const testData = {
  notes: {
    simple: {
      title: 'Test Note Title',
      content: 'This is a test note content',
      color: 'pink'
    },
    detailed: {
      title: 'Detailed Test Note',
      content: 'This note has more detailed content...',
      color: 'blue'
    },
    special: {
      title: 'Special Characters: @#$%^&*()',
      content: 'Testing with "quotes", \'apostrophes\', unicode: ✨🎉',
      color: 'mint'
    },
    longTitle: {
      title: 'This is a very long title to test overflow...',
      content: 'Short content',
      color: 'purple'
    },
    multiline: {
      title: 'Multiline Content Test',
      content: 'Line 1\nLine 2\nLine 3',
      color: 'peach'
    }
  },
  colors: ['pink', 'purple', 'mint', 'blue', 'peach', 'cream']
}
```

### Dynamic Test Data
- Timestamps for unique titles
- Random data generators (future)
- Faker.js integration (future)

### Test Environment Data
- User ID: `550e8400-e29b-41d4-a716-446655440000`
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## 📅 Test Plan

### Test Execution Strategy

#### Phase 1: Critical Path ✅ (Week 1)
**Priority:** P0 tests must pass  
**Tests:** TC01, TC02, TC04, TC05  
**Goal:** Core CRUD operations verified

**Tasks:**
- [x] Create Page Object Model
- [x] Write TC01-TC05
- [ ] Execute on Chromium
- [ ] Execute on Firefox
- [ ] Execute on WebKit
- [ ] Fix any failures

#### Phase 2: Extended Coverage (Week 2)
**Priority:** P1 tests  
**Tests:** TC03, TC06, TC07, TC09  
**Goal:** Edge cases and validations

**Tasks:**
- [x] Write TC06-TC09
- [ ] Add TC11-TC15
- [ ] Execute full suite
- [ ] Performance baseline

#### Phase 3: Polish & Automation (Week 3)
**Priority:** P2-P3 tests  
**Tests:** TC08, TC10, TC11-TC15  
**Goal:** Complete coverage, CI/CD integration

**Tasks:**
- [ ] Test data isolation setup
- [ ] CI/CD pipeline integration
- [ ] Test reporting dashboard
- [ ] Flakiness analysis

### Test Schedule

| Day | Activity | Owner | Status |
|-----|----------|-------|--------|
| Mon | Setup POM | QA Lead | ✅ Done |
| Tue | Write TC01-TC05 | QA Lead | ✅ Done |
| Wed | Write TC06-TC10 | QA Lead | ✅ Done |
| Thu | Execute & Debug | QA Team | 🔄 Pending |
| Fri | Report Results | QA Lead | 🔄 Pending |

### Browsers & Environments

| Browser | Version | OS | Priority |
|---------|---------|----|----|
| Chromium | Latest | Windows/Mac/Linux | P0 |
| Firefox | Latest | Windows/Mac/Linux | P0 |
| WebKit | Latest | Mac | P1 |
| Edge | Latest | Windows | P2 |
| Safari | Latest | Mac | P2 |

---

## 📊 Task Management

### Backlog

#### High Priority 🔴
- [ ] Implement test data isolation (TC08 dependency)
- [ ] Add API mocking for offline tests
- [ ] Network error scenario tests (TC14)
- [ ] Browser refresh persistence test (TC15)

#### Medium Priority 🟡
- [ ] Visual regression tests (screenshot comparison)
- [ ] Performance benchmarks
- [ ] Accessibility testing
- [ ] Mobile responsive tests

#### Low Priority 🟢
- [ ] Stress testing (1000+ notes)
- [ ] Concurrent user testing
- [ ] Localization tests
- [ ] Cross-tab synchronization

### In Progress 🔄
- [ ] Execute all tests on 3 browsers
- [ ] Document flaky tests
- [ ] Setup CI/CD pipeline

### Done ✅
- [x] Create Page Object Model (`NotesPage.js`)
- [x] Write 10 test cases (`notes.modern.spec.js`)
- [x] Self-healing selectors implementation
- [x] Test specifications document
- [x] Testing guide document

---

## ⚠️ Risk Analysis

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Test Data Pollution** | High | High | Implement DB reset before each test |
| **Flaky Selectors** | Medium | Medium | Use self-healing multi-strategy selectors |
| **API Instability** | High | Low | Add retry logic, use mocking |
| **Browser Differences** | Medium | Medium | Cross-browser testing, feature detection |
| **Network Latency** | Low | Medium | Increase timeouts, add wait strategies |

### Process Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Outdated Tests** | High | High | Regular test reviews, link to implementation |
| **Poor Documentation** | Medium | Medium | AI-friendly comments, living docs |
| **Knowledge Silos** | Medium | Low | Pair programming, knowledge sharing |
| **Incomplete Coverage** | High | Medium | Coverage reports, gap analysis |

### Dependencies

| Dependency | Risk Level | Notes |
|------------|------------|-------|
| Backend API | 🔴 Critical | Tests fail if backend down |
| Database | 🔴 Critical | Need test DB or cleanup |
| Network | 🟡 Medium | Local testing reduces risk |
| Playwright Updates | 🟢 Low | Pin versions, test before upgrade |

---

## 📈 Success Metrics

### Coverage Goals
- **Line Coverage:** >80%
- **Branch Coverage:** >70%
- **User Flows:** 100% of critical paths

### Quality Goals
- **Pass Rate:** 100% on main branch
- **Flakiness:** <5% rerun rate
- **Execution Time:** <5 minutes full suite
- **Bug Detection:** Find 90% of issues before production

### Continuous Improvement
- Weekly test review meetings
- Monthly flakiness analysis
- Quarterly test strategy review
- Annual framework evaluation

---

## 📚 References

- [Testing Guide](./TESTING_GUIDE.md)
- [Page Object Model](../tests/pages/NotesPage.js)
- [Test Suite](../tests/e2e/notes.modern.spec.js)
- [Playwright Docs](https://playwright.dev)

---

**Document Status:** 🟢 Active  
**Next Review:** 2025-12-13  
**Maintained By:** QA Team
