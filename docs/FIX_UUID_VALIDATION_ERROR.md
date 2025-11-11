# Fix: UUID Validation Error trong Fashion Tool

## 🐛 Vấn đề

Khi lưu outfit trên frontend, gặp lỗi:

```
Error creating outfit: error: invalid input syntax for type uuid: "test-user-id"
```

**Nguyên nhân:**
- Frontend hardcoded `user_id: 'test-user-id'` (string không hợp lệ)
- Database yêu cầu UUID hợp lệ theo format: `00000000-0000-0000-0000-000000000001`
- Backend expect camelCase (`shirtColor`) nhưng frontend gửi snake_case (`shirt_color`)

## ✅ Giải pháp

### 1. Tạo Constants File cho Frontend

**File:** `src/config/constants.js`

```javascript
export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
```

### 2. Update Frontend - FashionTool.jsx

**Thay đổi:**
- Import constants: `import { TEST_USER_ID, API_BASE_URL } from '../config/constants'`
- Thay thế tất cả `'test-user-id'` → `TEST_USER_ID`
- Thay thế tất cả `'http://localhost:5000'` → `API_BASE_URL`
- Convert formData sang snake_case khi gửi API request

**Trước:**
```javascript
const payload = {
  ...formData,
  user_id: 'test-user-id',  // ❌ Invalid UUID
  hatColor: formData.hatColor || null,
  bagColor: formData.bagColor || null
}
```

**Sau:**
```javascript
const payload = {
  name: formData.name,
  shirt_color: formData.shirtColor,
  pants_color: formData.pantsColor,
  shoes_color: formData.shoesColor,
  hat_color: formData.hatColor || null,
  bag_color: formData.bagColor || null,
  user_id: TEST_USER_ID  // ✅ Valid UUID
}
```

### 3. Update Backend - fashionController.js

**Thay đổi:** Accept cả camelCase và snake_case để tương thích với nhiều client

**Trước:**
```javascript
const { name, shirtColor, pantsColor, shoesColor, hatColor, bagColor } = req.body
```

**Sau:**
```javascript
// Accept both camelCase and snake_case for compatibility
const name = req.body.name
const shirtColor = req.body.shirtColor || req.body.shirt_color
const pantsColor = req.body.pantsColor || req.body.pants_color
const shoesColor = req.body.shoesColor || req.body.shoes_color
const hatColor = req.body.hatColor || req.body.hat_color
const bagColor = req.body.bagColor || req.body.bag_color
const userId = req.body.user_id || TEST_USER_ID
```

### 4. Test Script

**File:** `backend/test-fashion-fix.js`

Tạo test script để verify fix hoạt động:

```javascript
const payload = {
  name: 'Test Outfit Fixed',
  shirt_color: 'blue',
  pants_color: 'black',
  shoes_color: 'brown',
  hat_color: 'black',
  bag_color: 'brown',
  user_id: '00000000-0000-0000-0000-000000000001'  // Valid UUID
}
```

**Kết quả:**
```
✅ SUCCESS! Outfit created:
{
  "id": "22330b4a-00c1-4e21-9a47-afd978d3ddc7",
  "user_id": "00000000-0000-0000-0000-000000000001",
  "name": "Test Outfit Fixed",
  ...
}
```

## 📋 Checklist

- [x] Tạo `src/config/constants.js` với TEST_USER_ID và API_BASE_URL
- [x] Update `FashionTool.jsx`:
  - [x] Import constants
  - [x] Thay thế hardcoded `'test-user-id'` → `TEST_USER_ID`
  - [x] Thay thế hardcoded URLs → `API_BASE_URL`
  - [x] Convert formData sang snake_case trong payload
- [x] Update `fashionController.js`:
  - [x] `createOutfit()` - Accept both naming conventions
  - [x] `updateOutfit()` - Accept both naming conventions
- [x] Tạo test script `backend/test-fashion-fix.js`
- [x] Test thành công: Outfit created với UUID hợp lệ

## 🔍 Root Cause Analysis

### Tại sao lỗi xảy ra?

1. **Hardcoded String thay vì UUID hợp lệ**
   - Frontend sử dụng `'test-user-id'` (development placeholder)
   - PostgreSQL expect UUID format: `XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`
   - Error code `22P02` = "Invalid text representation"

2. **Naming Convention Inconsistency**
   - Database columns: `snake_case` (shirt_color, pants_color)
   - Backend controller: expect `camelCase` (shirtColor, pantsColor)
   - Frontend formData: sử dụng `camelCase`
   - Mismatch dẫn đến validation fail

3. **Thiếu Constants Management**
   - UUID được định nghĩa ở backend (`backend/config/constants.js`)
   - Frontend không có file tương ứng
   - Developers phải nhớ và copy UUID manually

### Bài học

1. **Luôn sử dụng Constants cho IDs**
   ```javascript
   // ❌ Bad
   user_id: 'test-user-id'
   
   // ✅ Good
   import { TEST_USER_ID } from '../config/constants'
   user_id: TEST_USER_ID
   ```

2. **Chuẩn hóa Naming Convention**
   - API request/response: `snake_case` (theo database)
   - Frontend internal: `camelCase` (theo React convention)
   - Backend: Accept both, normalize internally

3. **Validate UUIDs sớm**
   ```javascript
   // Backend validation
   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
   if (!uuidRegex.test(userId)) {
     return res.status(400).json({
       error: 'Invalid UUID format'
     })
   }
   ```

4. **Test với Production-like Data**
   - Seed script đã tạo test user với UUID: `00000000-0000-0000-0000-000000000001`
   - Frontend phải sử dụng UUID này, không phải string placeholder

## 🚀 Next Steps (Optional)

1. **Add UUID Validation Middleware**
   ```javascript
   // backend/middleware/validateUUID.js
   export const validateUUID = (paramName) => (req, res, next) => {
     const uuid = req.params[paramName] || req.body[paramName] || req.query[paramName]
     if (uuid && !isValidUUID(uuid)) {
       return res.status(400).json({
         success: false,
         error: `Invalid UUID format for ${paramName}`
       })
     }
     next()
   }
   ```

2. **Add Frontend UUID Helper**
   ```javascript
   // src/utils/validators.js
   export const isValidUUID = (uuid) => {
     return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)
   }
   ```

3. **Update Other Tools**
   - Check `NotesTool.jsx`, `CountdownTool.jsx` for similar issues
   - Centralize API_BASE_URL usage

4. **Add Integration Test**
   ```javascript
   // backend/tests/fashion.test.js
   describe('Fashion API', () => {
     it('should reject invalid UUID', async () => {
       const response = await request(app)
         .post('/api/fashion')
         .send({ 
           user_id: 'invalid-uuid',
           name: 'Test'
         })
       expect(response.status).toBe(400)
     })
   })
   ```

## 📝 Files Changed

1. **Created:**
   - `src/config/constants.js` - Frontend constants
   - `backend/test-fashion-fix.js` - Test script

2. **Modified:**
   - `src/pages/FashionTool.jsx` - Use constants, convert to snake_case
   - `backend/controllers/fashionController.js` - Accept both naming conventions

## ✅ Verification

```bash
# Test backend
cd backend
node test-fashion-fix.js
# Output: ✅ SUCCESS! Outfit created

# Test frontend
# 1. Open http://localhost:3001/fashion
# 2. Fill form and click "Lưu trang phục"
# 3. Should save successfully without UUID error
```

---

**Date:** 2025-11-11  
**Status:** ✅ Resolved  
**Impact:** Fashion Tool now works correctly with valid UUIDs
