# Task Breakdown

**Task ID:** `{task_id}`  
**Plan:** `{plan_id}.plan`  
**Phase:** Phase X  
**Status:** 📝 Todo | 🚧 In Progress | ✅ Done | ❌ Blocked  
**Created:** YYYY-MM-DD  
**Last Updated:** YYYY-MM-DD

---

## 📋 Task Overview

**Title:** [Task Name]  
**Priority:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low  
**Estimate:** X hours/days  
**Actual Time:** Y hours/days

**Description:**  
Brief description of what this task accomplishes.

**Assigned To:** Developer Name  
**Due Date:** YYYY-MM-DD

---

## 🎯 Objectives

1. **Primary Objective**
   - What this task must achieve

2. **Secondary Objectives**
   - Additional goals if time permits

---

## ✅ Acceptance Criteria

- [ ] Criterion 1: Specific, testable requirement
- [ ] Criterion 2: Another requirement
- [ ] Criterion 3: Documentation updated
- [ ] Criterion 4: Tests pass

---

## 📝 Subtasks

### Backend Changes
- [ ] **Subtask 1:** Create database migration
  - File: `backend/database/migrations/XXX_migration_name.sql`
  - Add table/column
  - Add indexes
  
- [ ] **Subtask 2:** Create controller
  - File: `backend/controllers/{controller}Controller.js`
  - Implement endpoint logic
  - Add error handling
  
- [ ] **Subtask 3:** Add route
  - File: `backend/routes/{resource}.js`
  - Define route
  - Add middleware

### Frontend Changes
- [ ] **Subtask 4:** Create component
  - File: `src/components/{Component}.jsx`
  - Implement UI
  - Add props validation
  
- [ ] **Subtask 5:** Add API service
  - File: `src/services/{service}.js`
  - Create API functions
  - Add error handling
  
- [ ] **Subtask 6:** Update page
  - File: `src/pages/{Page}.jsx`
  - Integrate component
  - Add state management

### Testing
- [ ] **Subtask 7:** Write unit tests
  - File: `{path}/__tests__/{name}.test.js`
  - Test all functions
  - Edge cases covered

- [ ] **Subtask 8:** Manual testing
  - Test in browser
  - Cross-browser check
  - Mobile responsive

### Documentation
- [ ] **Subtask 9:** Update docs
  - Update API docs
  - Update README
  - Add code comments

---

## 📂 Files to Create/Modify

### New Files
```
backend/controllers/newController.js
backend/routes/newRoute.js
src/components/NewComponent.jsx
src/services/newService.js
```

### Modified Files
```
backend/server.js              - Add new route
src/App.jsx                     - Add new page route
src/components/SidebarMenu.jsx  - Add menu item
```

---

## 🔧 Implementation Details

### Step 1: Database Setup
```sql
-- Migration: XXX_up_feature.sql
CREATE TABLE table_name (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column1 VARCHAR(255) NOT NULL,
  column2 INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_table_column ON table_name(column1);
```

### Step 2: Backend Controller
```javascript
// backend/controllers/featureController.js
const getResource = async (req, res) => {
  try {
    const { param1, param2 } = req.query
    
    // Validation
    if (!param1) {
      return res.status(400).json({
        success: false,
        error: 'param1 is required'
      })
    }
    
    // Query database
    const result = await pool.query(
      'SELECT * FROM table_name WHERE column1 = $1',
      [param1]
    )
    
    res.json({
      success: true,
      data: result.rows
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

module.exports = { getResource }
```

### Step 3: Frontend Component
```javascript
// src/components/FeatureComponent.jsx
import React, { useState, useEffect } from 'react'
import { fetchResource } from '../services/api'

const FeatureComponent = ({ prop1, prop2 }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchResource(prop1)
        setData(result.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [prop1])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}

export default FeatureComponent
```

### Step 4: API Service
```javascript
// src/services/featureService.js
import { API_BASE_URL } from '../config/constants'

export const fetchResource = async (param1) => {
  const response = await fetch(
    `${API_BASE_URL}/resource?param1=${param1}`
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch resource')
  }
  
  return response.json()
}
```

---

## 🧪 Testing Plan

### Unit Tests
```javascript
// __tests__/featureController.test.js
describe('FeatureController', () => {
  it('should return resource list', async () => {
    const result = await getResource({ query: { param1: 'test' }})
    expect(result.success).toBe(true)
    expect(result.data).toBeInstanceOf(Array)
  })
  
  it('should return 400 if param1 missing', async () => {
    const result = await getResource({ query: {}})
    expect(result.status).toBe(400)
  })
})
```

### Integration Tests
```javascript
// __tests__/api.integration.test.js
describe('GET /api/resource', () => {
  it('should return 200 and data', async () => {
    const response = await request(app)
      .get('/api/resource?param1=test')
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})
```

### Manual Test Cases
1. **Happy Path**
   - Open page
   - Verify data loads
   - Check UI renders correctly

2. **Error Handling**
   - Test with invalid input
   - Test with network error
   - Verify error message displays

3. **Edge Cases**
   - Empty data set
   - Very long list
   - Special characters in input

---

## 🔗 Dependencies

### Blocking Dependencies
- [ ] Task X must be completed first
- [ ] Feature Y must be merged

### Related Tasks
- Task A: Related feature
- Task B: Similar implementation

### External Dependencies
- API endpoint available
- Database migration run
- Package installed

---

## 🐛 Known Issues

### Issue 1: [Description]
**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low  
**Workaround:** Temporary solution  
**Resolution:** How to fix permanently

---

## 📝 Notes

### Technical Notes
- Note 1: Implementation detail
- Note 2: Performance consideration
- Note 3: Security concern

### Questions
- [ ] Question 1: Need clarification
- [ ] Question 2: Design decision needed

### Resources
- [Documentation Link](https://example.com)
- [API Reference](https://example.com)
- [Design Mockup](https://example.com)

---

## ✅ Checklist Before Marking Done

### Code Quality
- [ ] Code follows style guide
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Functions have JSDoc comments

### Testing
- [ ] Unit tests written
- [ ] Tests pass locally
- [ ] Manual testing complete
- [ ] Edge cases tested

### Documentation
- [ ] Code comments added
- [ ] API docs updated
- [ ] README updated
- [ ] CHANGELOG updated

### Review
- [ ] Self-review complete
- [ ] Code review requested
- [ ] Feedback addressed
- [ ] Approved by reviewer

### Deployment
- [ ] Migration ready
- [ ] Environment variables set
- [ ] No breaking changes
- [ ] Rollback plan ready

---

## 🔄 Progress Log

### YYYY-MM-DD - Started
- Initial setup
- Created files

### YYYY-MM-DD - In Progress
- Implemented backend
- 50% complete

### YYYY-MM-DD - Completed
- All tests pass
- Merged to main

---

## 🎯 Success Criteria Met

- [x] All subtasks completed
- [x] Tests pass
- [x] Code reviewed
- [x] Documentation updated
- [x] Deployed to production

**Completed By:** Developer Name  
**Completion Date:** YYYY-MM-DD  
**Time Taken:** X hours

---

**Next Task:** `{next_task_id}`  
**Related Plan:** `plans/{plan_id}.plan`  
**Related Spec:** `specs/{spec_id}.spec`
