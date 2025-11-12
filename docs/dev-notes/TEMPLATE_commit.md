# Commit Summary: [Feature/Component Name]

**Type:** 🎨 Feature | 🐛 Fix | 📝 Docs | ♻️ Refactor | ✅ Test | 🔧 Chore  
**Scope:** [Module/Component]  
**Breaking Changes:** ✅ Yes | ❌ No  
**Date:** YYYY-MM-DD

## 📝 Summary

Brief one-line description of changes.

## 🎯 Purpose

Why these changes were made:
- Problem being solved
- Feature being added
- Improvement being made

## 📋 Changes Overview

### Backend
- ✅ Created `backend/path/file.js` - Description
- ✅ Modified `backend/path/file.js` - What changed
- ✅ Deleted `backend/path/old-file.js` - Why removed

### Frontend
- ✅ Created `src/components/Component.jsx` - Description
- ✅ Modified `src/pages/Page.jsx` - What changed
- ✅ Updated `src/config/constants.js` - What changed

### Database
- ✅ Migration: `001_up_table_name.sql`
- ✅ Seed: `001_seed_data.sql`

### Documentation
- ✅ Created `docs/FEATURE_NAME.md`
- ✅ Updated `README.md`
- ✅ Updated `CHANGELOG.md`

### Configuration
- ✅ Updated `package.json` - Added dependencies
- ✅ Updated `.env.example` - New variables

## 🔍 Detailed Changes

### File 1: `path/to/file.js`
**Purpose:** What this file does  
**Changes:**
- Added function `functionName()` - Purpose
- Modified `existingFunction()` - What changed and why
- Removed deprecated code - Why removed

### File 2: `path/to/file.jsx`
**Purpose:** What this file does  
**Changes:**
- ...

## ✅ Testing Checklist

### Functionality
- [ ] All new features work as expected
- [ ] Existing features not broken
- [ ] Edge cases handled
- [ ] Error handling works

### Code Quality
- [ ] No console.logs left
- [ ] No commented code
- [ ] Follows naming conventions
- [ ] No hardcoded values
- [ ] Proper error messages

### Security
- [ ] No secrets in code
- [ ] Input validation added
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (proper escaping)

### Performance
- [ ] No N+1 queries
- [ ] Indexes added where needed
- [ ] No memory leaks
- [ ] API response time acceptable

### Documentation
- [ ] Code comments added
- [ ] API documentation updated
- [ ] README updated
- [ ] CHANGELOG updated

## 🧪 Test Results

### Unit Tests
```bash
npm test
# Results: X tests passed, 0 failed
```

### Integration Tests
```bash
npm run test:integration
# Results: ...
```

### Manual Testing
- ✅ Tested feature A
- ✅ Tested feature B
- ✅ Tested edge case C

## 📊 Impact Assessment

### Files Changed
- Backend: X files
- Frontend: Y files
- Database: Z migrations
- Documentation: N files
- Total: XX files

### Lines Changed
- Added: +XXX lines
- Removed: -XXX lines
- Modified: ~XXX lines

### Dependencies Added/Updated
```json
{
  "new-package": "^1.0.0",
  "updated-package": "^2.0.0"
}
```

## 🚨 Breaking Changes

### Change 1
**What changed:** API endpoint renamed  
**Old:** `GET /api/old-endpoint`  
**New:** `GET /api/new-endpoint`  
**Migration:** Update all API calls  

### Change 2
...

## 📝 Commit Message Draft

```
feat(scope): brief description

Detailed description of changes:
- Change 1
- Change 2
- Change 3

BREAKING CHANGE: Description of breaking change (if any)

Closes #123
Refs #456
```

### Conventional Commit Format
```
type(scope): subject

body

footer
```

**Type Options:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

## 🔗 Related

- [Feature Status](../features/feature-name-implementation-status.md)
- [Bug Fix](../bugfixes/fix-bug-name.md)
- [Issue #123](link)
- [PR #456](link)

## 📅 Timeline

- **Started:** YYYY-MM-DD
- **Completed:** YYYY-MM-DD
- **Reviewed:** YYYY-MM-DD
- **Merged:** YYYY-MM-DD

## 👥 Contributors

- **Developer:** Name
- **Reviewer:** Name
- **Tester:** Name

---

**Ready to Commit:** ✅ Yes | ❌ No  
**Last Updated:** YYYY-MM-DD
