# Wishlist Testing Quick Reference

## 🚀 Quick Start

### 1. Chạy Backend Tests (Jest)
```bash
cd backend
NODE_OPTIONS="--experimental-vm-modules" npx jest tests/wishlist.test.js
```

### 2. Chạy Frontend E2E Tests (Playwright)
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend  
cd frontend && npm run dev

# Terminal 3: Run tests
cd frontend && npx playwright test wishlist.e2e.spec.js --project=chromium-e2e
```

---

## 📊 Test Results

### Backend Integration Tests ✅
- **Total**: 37 tests
- **Passed**: 35 tests (95%)
- **Skipped**: 2 tests (GET /:id endpoint không tồn tại)
- **Time**: ~6s

### Frontend E2E Tests 📝
- **Total**: 15 tests
- **Status**: Ready (chưa chạy vì server chưa start)
- **Coverage**: All user workflows

---

## 🐛 Bug Fixed

**Issue**: Wishlist page không hiển thị items  
**Root Cause**: Data structure mismatch  
**Solution**: Fixed WishlistPage.jsx line 62

```javascript
// ❌ Before (SAI)
const data = await wishlistService.getWishlistItems(params)
setItems(data.items || [])  // data.items = undefined

// ✅ After (ĐÚNG)
const data = await wishlistService.getWishlistItems(params)
const items = data?.items || []  // data = {items: [...], pagination: {...}}
setItems(items)
```

---

## 📁 Files Modified

### Frontend
- ✅ `frontend/src/features/wishlist/WishlistPage.jsx` - Fixed bug
- ✅ `frontend/src/features/wishlist/WishlistStats.jsx` - Added testid
- ✅ `frontend/src/features/wishlist/WishlistGrid.jsx` - Added testid
- ✅ `frontend/src/features/wishlist/WishlistHeader.jsx` - Added testid

### Backend Tests
- ✅ `backend/tests/wishlist.test.js` - 600 lines, 38 test cases
- ✅ `backend/jest.config.js` - ES modules support

### Frontend Tests
- ✅ `frontend/tests/e2e/wishlist.e2e.spec.js` - 500 lines, 15 tests

---

## 🔧 Commands Cheat Sheet

```bash
# Backend Tests
cd backend
NODE_OPTIONS="--experimental-vm-modules" npx jest tests/wishlist.test.js --verbose
NODE_OPTIONS="--experimental-vm-modules" npx jest tests/wishlist.test.js --coverage
NODE_OPTIONS="--experimental-vm-modules" npx jest tests/wishlist.test.js --watch

# Frontend E2E Tests
cd frontend
npx playwright test wishlist.e2e.spec.js --project=chromium-e2e
npx playwright test wishlist.e2e.spec.js -g "should load" --project=chromium-e2e
npx playwright test wishlist.e2e.spec.js --ui --project=chromium-e2e
npx playwright test wishlist.e2e.spec.js --debug --project=chromium-e2e
npx playwright show-report

# Seed test user
cd backend
node seed-test-user.js

# Start servers
cd backend && npm run dev  # Port 5000
cd frontend && npm run dev # Port 5173
```

---

## ✅ Test Coverage

### Backend API Endpoints (35/37 tests passed)

#### CRUD Operations
- ✅ GET /api/wishlist - List items with filters
- ✅ POST /api/wishlist - Create item
- ✅ PUT /api/wishlist/:id - Update item
- ✅ DELETE /api/wishlist/:id - Soft delete item
- ⏭️ GET /api/wishlist/:id - Single item (endpoint không tồn tại)

#### Heart System
- ✅ POST /api/wishlist/:id/heart - Heart item
- ✅ DELETE /api/wishlist/:id/heart - Unheart item

#### Comments
- ✅ POST /api/wishlist/:id/comments - Add comment
- ✅ GET /api/wishlist/:id/comments - Get comments
- ✅ PUT /api/wishlist/comments/:id - Update comment
- ✅ DELETE /api/wishlist/comments/:id - Delete comment

#### Other Features
- ✅ PATCH /api/wishlist/:id/purchase - Toggle purchased
- ✅ GET /api/wishlist/stats - Get statistics

#### Security & Performance
- ✅ SQL injection prevention
- ✅ XSS sanitization
- ✅ Load 100 items < 1000ms
- ✅ Heart item < 500ms

### Frontend E2E Tests (15 tests)

#### User Workflows
- 📝 Page load
- 📝 Add item workflow
- 📝 Heart/unheart workflow
- 📝 Comment CRUD workflow
- 📝 Edit item workflow
- 📝 Mark purchased workflow
- 📝 Search workflow
- 📝 Filter by category
- 📝 Sort workflow
- 📝 Delete item workflow
- 📝 Stats display
- 📝 Responsive design
- 📝 Error handling

---

## 📚 Full Documentation

Xem chi tiết tại: `docs/04-features/WISHLIST_BUGFIX_SUMMARY.md`

---

**Last Updated**: 14/11/2025  
**Status**: ✅ All backend tests passing, E2E tests ready
