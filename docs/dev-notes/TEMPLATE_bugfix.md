# Fix: [Bug Title]

**Bug ID:** #XXX (if tracked)  
**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low  
**Date Found:** YYYY-MM-DD  
**Date Fixed:** YYYY-MM-DD  
**Status:** ✅ Fixed | 🚧 In Progress | ⏳ Pending

## 🐛 Problem Description

### Symptoms
What users/developers see:
- Error message or unexpected behavior
- Steps to reproduce
- Expected vs actual behavior

### Error Details
```
Error message or stack trace
```

### Impact
- Who is affected?
- How critical is this?
- Workaround available?

## 🔍 Root Cause Analysis

### Investigation Process
1. Initial hypothesis
2. What was checked
3. What was found

### Root Cause
Detailed explanation of what caused the bug:
- Which code was responsible?
- Why did it fail?
- What assumption was wrong?

### Why It Happened
- Missing validation?
- Incorrect logic?
- Integration issue?
- Configuration error?

## ✅ Solution

### Approach
Explain the fix strategy:
- What needed to change
- Why this approach was chosen
- Alternative approaches considered

### Implementation

**Files Changed:**
1. `path/to/file1.js` - What changed
2. `path/to/file2.jsx` - What changed

**Code Changes:**

**Before:**
```javascript
// Problematic code
const userId = 'test-user-id' // ❌ Invalid UUID
```

**After:**
```javascript
// Fixed code
import { TEST_USER_ID } from '../config/constants'
const userId = TEST_USER_ID // ✅ Valid UUID
```

### Testing

**Test Cases:**
1. ✅ Test case 1 - Pass
2. ✅ Test case 2 - Pass
3. ✅ Test case 3 - Pass

**Verification:**
```bash
# How to verify the fix
npm test
node test-script.js
```

**Results:**
```
✅ SUCCESS! Expected behavior confirmed
```

## 📚 Lessons Learned

### What Went Wrong
- Hardcoded values instead of constants
- Missing validation
- Incorrect assumptions

### Prevention Measures
1. Add validation for...
2. Create helper function...
3. Document assumption...
4. Add test case...

### Best Practices
- Always use constants for IDs
- Validate input early
- Add comprehensive tests

## 🔗 Related

- [Feature Implementation](../features/feature-name.md)
- [API Documentation](../../API_DOCUMENTATION.md)
- [Related Issue #123](link)

## 📝 Additional Notes

- Edge cases to consider
- Future improvements
- Related technical debt

---

**Fixed By:** Developer Name  
**Reviewed By:** Reviewer Name  
**Last Updated:** YYYY-MM-DD
