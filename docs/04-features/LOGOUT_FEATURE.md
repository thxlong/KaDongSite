# 🚪 Logout Feature - User Guide

**Feature:** Logout Button in Header  
**Version:** 1.0.0  
**Status:** ✅ Implemented  
**Updated:** 2025-11-14

---

## 📋 Tổng quan

Nút **Logout** cho phép người dùng dễ dàng đăng xuất khỏi ứng dụng KaDong Tools. Nút này hiển thị trong Header khi người dùng đã đăng nhập.

## 🎯 Vị trí

- **Location:** Top-right corner của Header
- **Hiển thị khi:** User đã đăng nhập (isAuthenticated = true)
- **Kèm theo:** User info badge (hiển thị tên/email)

### Desktop View
```
┌────────────────────────────────────────────────────────────┐
│ [Logo] KaDong Tools     Made with love  [👤 User] [Logout] │
└────────────────────────────────────────────────────────────┘
```

### Mobile View (<640px)
```
┌────────────────────────────────────────┐
│ [Logo] KaDong Tools         [Logout]   │
└────────────────────────────────────────┘
```
*Note: User info badge ẩn trên mobile để tiết kiệm không gian*

---

## 🎨 Giao diện

### 1. Logout Button
- **Style:** Red button với hover effect
- **Icon:** LogOut icon (Lucide React)
- **Text:** "Đăng xuất"
- **Size:** Small button (px-4 py-2)
- **Color:** Red text (text-red-600) on transparent background
- **Hover:** Red background (bg-red-50)

### 2. User Info Badge
Hiển thị bên cạnh nút Logout:
- **Registered User:**
  ```
  [👤 Nguyễn Văn A]
  ```
- **Guest User:**
  ```
  [👤 Guest] [Guest]
  ```
  *(Badge vàng "Guest" để phân biệt)*

### 3. Confirmation Dialog
Khi click nút Logout, xuất hiện dialog xác nhận:

```
┌─────────────────────────────────────────┐
│            [🚪 Icon]                    │
│                                         │
│       Xác nhận đăng xuất                │
│                                         │
│  Bạn có chắc muốn đăng xuất khỏi       │
│  tài khoản?                             │
│                                         │
│  [  Hủy  ]        [ Đăng xuất ]        │
└─────────────────────────────────────────┘
```

**Guest User Dialog:**
```
┌─────────────────────────────────────────┐
│            [🚪 Icon]                    │
│                                         │
│       Xác nhận đăng xuất                │
│                                         │
│  Bạn có chắc muốn đăng xuất khỏi       │
│  chế độ Guest?                          │
│  ⚠️ Dữ liệu của bạn sẽ bị xóa          │
│                                         │
│  [  Hủy  ]        [ Đăng xuất ]        │
└─────────────────────────────────────────┘
```

---

## 🔄 Flow đăng xuất

### Registered User
```
1. Click "Đăng xuất" button
   ↓
2. Dialog xuất hiện: "Bạn có chắc muốn đăng xuất?"
   ↓
3a. Click "Hủy"            3b. Click "Đăng xuất"
    → Dialog đóng              → Loading spinner
    → Vẫn logged in            → POST /api/auth/logout
                               → Clear cookie
                               → Reset AuthContext
                               → Redirect to /login
                               → Show toast: "Đã đăng xuất thành công"
```

### Guest User
```
1. Click "Đăng xuất" button
   ↓
2. Dialog xuất hiện: "⚠️ Dữ liệu của bạn sẽ bị xóa"
   ↓
3a. Click "Hủy"            3b. Click "Đăng xuất"
    → Dialog đóng              → Loading spinner
    → Vẫn logged in            → Clear localStorage
                               → Reset AuthContext
                               → Redirect to /login
                               → Data mất vĩnh viễn
```

---

## 💡 States

### 1. Normal State
- Button enabled
- Hover effect hoạt động
- Cursor: pointer

### 2. Loading State (khi đang logout)
- Button disabled
- Spinner icon thay vì LogOut icon
- Text: "Đang xử lý..."
- Cursor: not-allowed
- Opacity: 50%

### 3. Error State
- Hiển thị error message trong dialog
- Button enabled lại để retry
- Error text màu đỏ: "Không thể đăng xuất. Vui lòng thử lại."

---

## 🧪 Kiểm tra (Testing)

### Manual Test Steps

#### Test Case 1: Logout thành công (Registered User)
```
1. Login với tài khoản registered
2. Verify: Nút "Đăng xuất" hiển thị trong Header
3. Click nút "Đăng xuất"
4. Verify: Dialog xác nhận xuất hiện
5. Click "Đăng xuất" trong dialog
6. Verify: Loading spinner xuất hiện
7. Verify: Redirect to /login page
8. Verify: Toast message "Đã đăng xuất thành công"
9. Try access /notes → Redirect to /login
```

**Expected:** ✅ Pass
**Actual:** ✅ Pass

---

#### Test Case 2: Cancel logout
```
1. Login với tài khoản
2. Click nút "Đăng xuất"
3. Dialog xuất hiện
4. Click "Hủy" button
5. Verify: Dialog đóng
6. Verify: Vẫn ở trang hiện tại
7. Verify: isAuthenticated vẫn = true
8. Verify: Có thể tiếp tục sử dụng app
```

**Expected:** ✅ Pass
**Actual:** ✅ Pass

---

#### Test Case 3: Logout Guest user
```
1. Login với Guest mode
2. Tạo 1 note để test
3. Verify: Badge "Guest" hiển thị
4. Click nút "Đăng xuất"
5. Verify: Warning message "Dữ liệu sẽ bị xóa" xuất hiện
6. Click "Đăng xuất"
7. Verify: Redirect to /login
8. Login lại với Guest
9. Verify: Note đã tạo không còn
```

**Expected:** ✅ Pass (Data mất)
**Actual:** ✅ Pass

---

#### Test Case 4: Logout error handling
```
1. Login
2. Stop backend server (simulate API error)
3. Click "Đăng xuất"
4. Click "Đăng xuất" trong dialog
5. Verify: Error message hiển thị: "Không thể đăng xuất..."
6. Verify: Button enabled lại
7. Start backend server
8. Click "Đăng xuất" lại
9. Verify: Success
```

**Expected:** ✅ Pass
**Actual:** ⏳ To be tested

---

#### Test Case 5: Responsive layout
```
1. Desktop (>640px):
   - User info badge hiển thị
   - Logout button hiển thị
   
2. Mobile (<640px):
   - User info badge ẩn
   - Logout button vẫn hiển thị
   - Dialog full-width với padding

3. Tablet (640px-1024px):
   - User info badge hiển thị
   - Layout compact
```

**Expected:** ✅ Pass
**Actual:** ✅ Pass

---

## 🐛 Troubleshooting

### Problem 1: Logout button không hiển thị
**Symptoms:** Đã login nhưng không thấy nút Logout

**Possible Causes:**
- AuthContext chưa update `isAuthenticated = true`
- Header component chưa import LogoutButton
- CSS class hiding button

**Solutions:**
```javascript
// Check AuthContext state
console.log('isAuthenticated:', isAuthenticated)
console.log('user:', user)

// Check Header render
{isAuthenticated && <LogoutButton variant="button" />}

// Check CSS
className="flex items-center gap-3" // Should be visible
```

---

### Problem 2: Click logout không có gì xảy ra
**Symptoms:** Click button nhưng dialog không xuất hiện

**Possible Causes:**
- Event handler không được bind
- Dialog state không toggle
- Z-index issue (dialog bị che)

**Solutions:**
```javascript
// Check state
const [showConfirmDialog, setShowConfirmDialog] = useState(false)

// Check handler
const handleLogoutClick = () => {
  setShowConfirmDialog(true) // Should be called
}

// Check z-index
className="fixed inset-0 z-50" // Dialog should be on top
```

---

### Problem 3: Logout failed với API error
**Symptoms:** Logout throw error: "Failed to logout"

**Possible Causes:**
- Backend không running
- Token invalid/expired
- Network issue

**Solutions:**
```bash
# Check backend
curl http://localhost:5000/api/auth/logout -X POST -H "Authorization: Bearer <token>"

# Check token
console.log('Token:', document.cookie)

# Fallback: Force local logout
localStorage.clear()
sessionStorage.clear()
window.location.href = '/login'
```

---

### Problem 4: Guest data không bị xóa
**Symptoms:** Logout Guest nhưng data vẫn còn

**Possible Causes:**
- localStorage không được clear
- Wrong localStorage keys
- Browser cache issue

**Solutions:**
```javascript
// Check localStorage keys
console.log('Guest session:', localStorage.getItem('guest_session'))
console.log('Guest notes:', localStorage.getItem('guest_notes'))

// Manual clear
Object.keys(localStorage)
  .filter(key => key.startsWith('guest_'))
  .forEach(key => localStorage.removeItem(key))

// Verify cleared
console.log('After clear:', Object.keys(localStorage))
```

---

## 📚 Code Reference

### Files Modified
1. **Header Component** (`frontend/src/shared/components/Header.jsx`)
   - Added LogoutButton import
   - Added user info badge
   - Added conditional rendering based on `isAuthenticated`
   - Added responsive styling for mobile/desktop

2. **LogoutButton Component** (`frontend/src/shared/components/LogoutButton.jsx`)
   - Already existed
   - No changes needed
   - Used `variant="button"` prop

3. **AuthContext** (`frontend/src/shared/contexts/AuthContext.jsx`)
   - Already has `logout()` function
   - Already has `isGuest` flag
   - No changes needed

### Code Snippets

#### Header.jsx - Logout Integration
```jsx
import LogoutButton from './LogoutButton'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const { user, isAuthenticated, isGuest } = useAuth()

  return (
    <header>
      {/* ... Logo ... */}
      
      {/* User section - only when authenticated */}
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          {/* User info badge */}
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-pastel-pink/20 to-pastel-purple/20 px-4 py-2 rounded-full">
            <User className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              {isGuest ? '👤 Guest' : user?.name || user?.email}
            </span>
            {isGuest && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                Guest
              </span>
            )}
          </div>

          {/* Logout button */}
          <LogoutButton variant="button" />
        </div>
      )}
    </header>
  )
}
```

---

## 🔐 Security Considerations

### 1. Token Cleanup
- ✅ JWT token được clear from cookie
- ✅ Session revoked in database
- ✅ No token stored in localStorage/sessionStorage

### 2. Guest Data Cleanup
- ✅ All guest data cleared from localStorage
- ⚠️ Warning shown before delete
- ✅ No recovery possible (intentional)

### 3. CSRF Protection
- ✅ Logout endpoint requires valid JWT
- ✅ SameSite cookie policy
- ✅ No GET request for logout (only POST)

### 4. XSS Protection
- ✅ No innerHTML usage
- ✅ All user input sanitized
- ✅ React escapes JSX by default

---

## 📊 Analytics Events

Track logout events cho analytics:

```javascript
// On logout click
analytics.track('logout_initiated', {
  user_type: isGuest ? 'guest' : 'registered',
  timestamp: new Date().toISOString()
})

// On logout success
analytics.track('logout_success', {
  user_id: user?.id,
  session_duration: sessionDuration,
  timestamp: new Date().toISOString()
})

// On logout error
analytics.track('logout_error', {
  error_message: error.message,
  timestamp: new Date().toISOString()
})
```

---

## 🎯 Future Enhancements

### Phase 2 Improvements
- [ ] **Dropdown Menu:** Move logout to user dropdown menu
  - Click avatar → show menu
  - Menu items: Profile, Settings, Logout
  - Better UX for mobile

- [ ] **Logout All Devices:** 
  - Button: "Logout from all devices"
  - Revoke all sessions in database
  - Useful khi forgot to logout on public device

- [ ] **Session History:**
  - Show last login time
  - Show active sessions (device, location)
  - Allow selective logout

- [ ] **Remember This Device:**
  - Checkbox: "Don't ask again on this device"
  - Skip confirmation dialog
  - Store in localStorage

---

## ✅ Checklist

### Implementation Status
- [x] LogoutButton component created
- [x] Integrated into Header
- [x] AuthContext integration
- [x] Confirmation dialog
- [x] Loading state
- [x] Error handling
- [x] Guest user support
- [x] Responsive design
- [x] Documentation

### Testing Status
- [x] Manual testing - Registered user logout
- [x] Manual testing - Guest user logout
- [x] Manual testing - Cancel logout
- [x] Manual testing - Responsive layout
- [ ] E2E automated test
- [ ] Error scenario test (API down)
- [ ] Performance test (logout speed)

---

## 👥 Changelog

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-11-14 | 1.0.0 | Initial implementation | KaDong Team |
| 2025-11-14 | 1.0.0 | Added to Header with user info badge | KaDong Team |
| 2025-11-14 | 1.0.0 | Documentation created | KaDong Team |

---

**Maintained by:** KaDong Development Team  
**Last Updated:** 2025-11-14  
**Status:** ✅ Production Ready

For questions or issues, see [08_login.spec](../../specs/specs/08_login.spec)
