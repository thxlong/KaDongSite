# Guest Mode & Logout Implementation Guide

## 📋 Tổng quan

Implementation hoàn chỉnh cho **Guest Mode** và **Logout UI** theo spec `08_login.spec v1.1.0`.

### ✨ Tính năng chính

1. **Guest Mode** - Sử dụng ứng dụng mà không cần đăng ký
   - Login bằng 1 click
   - Dữ liệu lưu trong localStorage
   - Session tự động expire sau 24 giờ
   - Warning banner về data loss risk

2. **Logout UI** - Nút đăng xuất với confirmation
   - Hiển thị trong Header dropdown
   - Confirmation dialog trước khi logout
   - Loading states
   - Phân biệt Guest vs Registered logout

3. **Guest Migration** - Chuyển dữ liệu khi upgrade
   - Auto-detect Guest data khi register
   - Migrate notes, countdowns, wishlist
   - API endpoint `/api/auth/migrate-guest-data`

---

## 🏗️ Architecture

### Backend Files

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── authController.js           # Added migrateGuestData()
│   │   └── routes/
│   │       └── auth.js                     # Added POST /migrate-guest-data
```

### Frontend Files

```
frontend/
├── src/
│   ├── features/
│   │   └── auth/
│   │       ├── LoginPage.jsx               # Added Guest button
│   │       └── RegisterPage.jsx            # Added migration UI
│   ├── shared/
│   │   ├── components/
│   │   │   ├── LogoutButton.jsx           # NEW
│   │   │   └── GuestWarningBanner.jsx     # NEW
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx            # Added isGuest, loginAsGuest(), migrateGuestData()
│   │   ├── services/
│   │   │   └── authService.js             # Added migrateGuestData()
│   │   └── utils/
│   │       └── guestStorage.js            # NEW - localStorage utilities
│   └── styles/
│       └── index.css                       # Added animations
```

---

## 🔌 API Endpoints

### POST /api/auth/migrate-guest-data

Migrate guest data từ localStorage sang database.

**Auth Required:** Yes (Registered user only, not guest)  
**Method:** POST  
**URL:** `/api/auth/migrate-guest-data`

**Request Body:**
```json
{
  "notes": [
    {
      "title": "Note 1",
      "content": "Content...",
      "created_at": "2025-11-13T10:00:00Z"
    }
  ],
  "countdowns": [
    {
      "name": "Event 1",
      "target_date": "2025-12-31T00:00:00Z",
      "created_at": "2025-11-13T10:00:00Z"
    }
  ],
  "wishlist": [
    {
      "product_url": "https://...",
      "title": "Product 1",
      "price": 100000,
      "image_url": "https://...",
      "created_at": "2025-11-13T10:00:00Z"
    }
  ]
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "migrated": {
      "notes": 5,
      "countdowns": 3,
      "wishlist": 10
    }
  },
  "message": "Đã chuyển 5 ghi chú, 3 đếm ngược, 10 wishlist"
}
```

**Response Error (403):**
```json
{
  "success": false,
  "error": {
    "code": "GUEST_MIGRATION_NOT_ALLOWED",
    "message": "Guest users cannot migrate data. Please register first."
  }
}
```

**Validation:**
- User must be authenticated (JWT token)
- User role must NOT be 'guest'
- Max 1000 items per array
- Arrays can be empty

---

## 💾 LocalStorage Structure

Guest data được lưu với prefix `guest_`:

```javascript
// Guest session (24h expiry)
localStorage.getItem('guest_session')
// {
//   user: { id: 'guest', email: 'guest@kadong.local', name: 'Guest', role: 'guest' },
//   isGuest: true,
//   expiresAt: 1731513600000,
//   createdAt: 1731427200000
// }

// Guest notes
localStorage.getItem('guest_notes')
// [{ title: '...', content: '...', created_at: '...' }]

// Guest countdowns
localStorage.getItem('guest_countdowns')
// [{ name: '...', target_date: '...', created_at: '...' }]

// Guest wishlist
localStorage.getItem('guest_wishlist')
// [{ product_url: '...', title: '...', price: 100000, ... }]
```

---

## 🎨 Components

### 1. LogoutButton

**File:** `frontend/src/shared/components/LogoutButton.jsx`

**Props:**
- `variant`: 'dropdown' | 'button'
- `onLogoutComplete`: Callback sau khi logout thành công

**Features:**
- Confirmation dialog
- Loading states
- Phân biệt Guest vs Registered logout
- Toast notification

**Usage:**
```jsx
import LogoutButton from '../shared/components/LogoutButton'

// In dropdown menu
<LogoutButton variant="dropdown" />

// Standalone button
<LogoutButton 
  variant="button" 
  onLogoutComplete={() => console.log('Logged out')} 
/>
```

---

### 2. GuestWarningBanner

**File:** `frontend/src/shared/components/GuestWarningBanner.jsx`

**Props:**
- `onUpgrade`: Callback khi click "Tạo tài khoản"

**Features:**
- Warning message về data loss
- Storage info (X notes, Y countdowns, Z MB used)
- CTA button
- Dismissible

**Usage:**
```jsx
import { useAuth } from '../shared/contexts/AuthContext'
import GuestWarningBanner from '../shared/components/GuestWarningBanner'

function Dashboard() {
  const { isGuest } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      {isGuest && (
        <GuestWarningBanner onUpgrade={() => navigate('/register')} />
      )}
      {/* Content */}
    </div>
  )
}
```

---

### 3. LoginPage with Guest Button

**File:** `frontend/src/features/auth/LoginPage.jsx`

**Features:**
- Divider "─── hoặc ───"
- Guest button: "Tiếp tục với Guest"
- Tooltip: "Dữ liệu sẽ lưu tạm trong trình duyệt"
- Icon: UserCircle

**Flow:**
```
Click "Tiếp tục với Guest"
  ↓
loginAsGuest() (client-side)
  ↓
Store in localStorage
  ↓
Redirect to /tools
```

---

### 4. RegisterPage with Migration

**File:** `frontend/src/features/auth/RegisterPage.jsx`

**Features:**
- Auto-detect Guest data
- Show migration info banner
- Button text: "Đăng ký & Chuyển dữ liệu"
- Auto-migrate after registration

**Flow:**
```
Register as Guest
  ↓
Check guestDataInfo (isGuest + hasData)
  ↓
Show info banner
  ↓
Submit registration
  ↓
Call migrateGuestData() API
  ↓
Show success message with counts
  ↓
Clear localStorage
  ↓
Redirect to /tools
```

---

## 🔄 Data Flows

### Guest Login Flow

```
1. User trên LoginPage
2. Click "Tiếp tục với Guest"
3. Frontend:
   - Generate guest session
   - Store in localStorage (key: 'guest_session')
   - Update AuthContext (isGuest = true)
   - Redirect to /tools
4. No API call (pure client-side)
```

### Guest Logout Flow

```
1. User click Logout button
2. Confirmation dialog appears
3. If confirmed:
   - If isGuest:
     - Clear all guest data from localStorage
     - Reset AuthContext
     - Redirect to /login
   - If registered:
     - POST /api/auth/logout
     - Clear cookies
     - Redirect to /login
```

### Guest Migration Flow

```
1. Guest user navigate to /register
2. RegisterPage checks isGuest
3. If Guest với data:
   - Show info banner
   - Change button text
4. User submits registration form
5. POST /api/auth/register
6. After success, POST /api/auth/migrate-guest-data
7. Backend:
   - Validate user is registered (not guest)
   - Bulk insert notes, countdowns, wishlist
   - Return migration summary
8. Frontend:
   - Show success message
   - Clear guest localStorage
   - Update isGuest = false
   - Redirect to /tools
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Guest Mode
- [ ] Click "Tiếp tục với Guest" trên LoginPage → Redirect to /tools
- [ ] Tạo 1 note → Check localStorage có `guest_notes`
- [ ] Tạo 1 countdown → Check localStorage có `guest_countdowns`
- [ ] Tạo 1 wishlist item → Check localStorage có `guest_wishlist`
- [ ] Reload page → Guest session still valid
- [ ] Wait 24h → Guest session expired, redirect to login
- [ ] Guest banner hiển thị với correct counts
- [ ] Click "Tạo tài khoản" trên banner → Navigate to /register

#### Logout
- [ ] Login as registered user → Logout button shows in header
- [ ] Click Logout → Confirmation dialog appears
- [ ] Click "Hủy" → Dialog closes, still logged in
- [ ] Click "Đăng xuất" → API called, redirect to /login
- [ ] Login as Guest → Click Logout → No API call, localStorage cleared

#### Migration
- [ ] Login as Guest, create data
- [ ] Navigate to /register
- [ ] Info banner shows: "X notes, Y countdowns, Z wishlist sẽ được chuyển"
- [ ] Button text: "Đăng ký & Chuyển dữ liệu"
- [ ] Submit registration
- [ ] Migration loading shows: "Đang chuyển dữ liệu..."
- [ ] Success message: "Đã chuyển X notes, Y countdowns, Z wishlist"
- [ ] Check database: Data migrated successfully
- [ ] Check localStorage: Guest data cleared

### API Testing

```bash
# Test migration endpoint (requires auth token)
curl -X POST http://localhost:5000/api/auth/migrate-guest-data \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{
    "notes": [{"title": "Test", "content": "Content", "created_at": "2025-11-13T10:00:00Z"}],
    "countdowns": [],
    "wishlist": []
  }'

# Expected response
{
  "success": true,
  "data": {
    "migrated": {
      "notes": 1,
      "countdowns": 0,
      "wishlist": 0
    }
  },
  "message": "Đã chuyển 1 ghi chú"
}
```

---

## 📊 Success Metrics

### Quantitative
- Guest session creation < 50ms (no API call)
- Migration API response < 2s for 100 items
- LocalStorage usage < 5MB
- Zero data loss during migration

### Qualitative
- User feedback: "Dễ dàng dùng thử không cần đăng ký"
- Clear warning về data loss risk
- Smooth upgrade path từ Guest → Registered
- Intuitive logout confirmation

---

## 🐛 Troubleshooting

### Guest session không lưu
- Check localStorage available: `typeof localStorage !== 'undefined'`
- Check browser privacy mode
- Check localStorage quota (5MB limit)

### Migration fail
- Check JWT token valid (not guest)
- Check request body format
- Check database tables exist (notes, countdowns, wishlist)
- Check foreign key constraint (user_id)

### Logout không hoạt động
- Check AuthContext có isGuest flag
- Check cookie httpOnly setting
- Check CORS credentials: 'include'

---

## 📚 Related Documentation

- **Spec:** `specs/specs/08_login.spec` (v1.1.0)
- **Auth Implementation:** `backend/AUTH_IMPLEMENTATION_SUMMARY.md`
- **Database Schema:** `backend/database/SCHEMA_DESIGN.md`

---

**Maintained By:** KaDong Development Team  
**Last Updated:** 2025-11-13  
**Version:** 1.0.0
