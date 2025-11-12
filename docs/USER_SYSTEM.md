# 👥 Hệ Thống User - KaDong Tools

## 📋 Tổng Quan

Hệ thống có **2 loại user** với phân quyền rõ ràng:

### 👑 Administrator (Admin)
- **Email:** `admin@kadong.com`
- **Password:** `admin123`
- **UUID:** `550e8400-e29b-41d4-a716-446655440000`
- **Quyền hạn:** Full access (Create, Read, Update, Delete)
- **Chức năng:**
  - ✅ Tạo wishlist items mới
  - ✅ Chỉnh sửa tất cả items
  - ✅ Xóa items
  - ✅ Heart/Unheart items
  - ✅ Thêm/sửa/xóa comments
  - ✅ Toggle purchased status
  - ✅ Xem statistics

### 👤 Guest User
- **Email:** `guest@kadong.com`
- **Password:** `guest123`
- **UUID:** `550e8400-e29b-41d4-a716-446655440099`
- **Quyền hạn:** Read-only (Chỉ xem)
- **Chức năng:**
  - ✅ Xem danh sách wishlist items
  - ✅ Xem chi tiết items
  - ✅ Xem comments
  - ✅ Xem statistics
  - ❌ KHÔNG thể tạo/sửa/xóa items
  - ❌ KHÔNG thể heart items
  - ❌ KHÔNG thể thêm comments

---

## 🚀 User Mặc Định

**Default user khi vào web:** `Administrator` (admin@kadong.com)

Frontend service tự động sử dụng admin UUID:
```javascript
// src/services/wishlistService.js
const getUserId = () => {
  return '550e8400-e29b-41d4-a716-446655440000' // Admin
}
```

---

## 🔧 Thao Tác Với Users

### 1️⃣ Seed Users (Tạo lại users)

**Cách 1: Qua API (Khuyến nghị)**
```powershell
# POST request
Invoke-RestMethod -Uri "http://localhost:5000/api/debug/seed-users" -Method Post

# Kết quả: Xóa tất cả users cũ, tạo admin + guest
```

**Cách 2: Qua Database Script**
```bash
cd backend
node apply-user-seed.js
```

**Cách 3: Qua SQL File**
```sql
-- Chạy file: backend/database/seeds/001_test_user.sql
psql -U postgres -d kadong_tools -f backend/database/seeds/001_test_user.sql
```

### 2️⃣ Xem Danh Sách Users

**Qua API:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/debug/users" -Method Get
```

**Qua Database:**
```sql
SELECT id, email, name, role, created_at 
FROM users 
ORDER BY role DESC;
```

### 3️⃣ Đổi User Mặc Định

**File:** `src/services/wishlistService.js`

```javascript
const getUserId = () => {
  // Admin (full permissions)
  return '550e8400-e29b-41d4-a716-446655440000'
  
  // Guest (read-only)
  // return '550e8400-e29b-41d4-a716-446655440099'
}
```

---

## 🧪 Test Chức Năng

### Test với Admin User
```powershell
# 1. Tạo wishlist item
$body = @{
    user_id = "550e8400-e29b-41d4-a716-446655440000"
    product_url = "https://shopee.vn/product-url"
    product_name = "Test Product"
    price = 100000
    currency = "VND"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist" `
    -Method Post -ContentType "application/json" -Body $body

# ✅ Expected: Success (201 Created)
```

### Test với Guest User
```powershell
# 1. Thử tạo wishlist item (should fail nếu có permission check)
$body = @{
    user_id = "550e8400-e29b-41d4-a716-446655440099"
    product_url = "https://shopee.vn/product-url"
    product_name = "Test Product"
    price = 100000
    currency = "VND"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/wishlist" `
    -Method Post -ContentType "application/json" -Body $body

# Note: Hiện tại backend chưa có middleware check permissions
# Guest vẫn có thể create items nếu gửi user_id của mình
```

---

## 🔐 Bảo Mật & Phân Quyền

### Hiện Tại
- ✅ Có 2 role: `admin` và `user`
- ✅ UUID validation (chặn invalid UUIDs)
- ⚠️ **CHƯA có middleware check permissions**
- ⚠️ Frontend trust user_id từ service

### Cần Implement (Future)
1. **Authentication middleware**
   - JWT tokens
   - Session management
   - Login/Logout endpoints

2. **Authorization middleware**
   ```javascript
   // Example
   const requireAdmin = (req, res, next) => {
     if (req.user.role !== 'admin') {
       return res.status(403).json({ error: 'Admin only' })
     }
     next()
   }
   
   router.post('/wishlist', requireAdmin, createWishlistItem)
   ```

3. **Frontend auth context**
   - Login form
   - Store user session
   - Show/hide features based on role

---

## 📊 Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' 
         CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);
```

**Roles:**
- `admin`: Full permissions
- `user`: Limited permissions (read-only intended)

---

## 🎯 Quick Commands

```powershell
# Seed users
Invoke-RestMethod -Uri "http://localhost:5000/api/debug/seed-users" -Method Post

# List users
Invoke-RestMethod -Uri "http://localhost:5000/api/debug/users" -Method Get

# Test Shopee extraction
.\test-shopee-extract.ps1

# Test create item
.\test-create-item.ps1

# Start backend
cd backend
node app.js

# Start frontend
npm run dev
```

---

## 📝 Notes

1. **Default user = Admin**: Frontend tự động dùng admin UUID
2. **Guest user**: Hiện tại chỉ để demo, chưa có enforce permissions ở backend
3. **Passwords**: Sử dụng bcrypt hash với salt rounds = 10
4. **Debug routes**: Chỉ available khi `NODE_ENV=development`
5. **Database clean**: Seed script sẽ **XÓA TẤT CẢ users cũ** trước khi tạo mới

---

## ✅ Checklist Setup

- [x] Tạo admin user với UUID hợp lệ
- [x] Tạo guest user với UUID hợp lệ  
- [x] Set default user = admin trong frontend
- [x] Xóa tất cả users cũ (clean database)
- [x] Test create wishlist item với admin
- [x] Test Shopee URL extraction
- [ ] Implement permission middleware (future)
- [ ] Add login/logout functionality (future)
- [ ] Frontend auth context (future)

---

**Tất cả đã hoạt động! Bạn có thể bắt đầu thêm sản phẩm trên UI.** 🎉
