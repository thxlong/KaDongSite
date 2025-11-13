# Login Authentication System

**Spec ID:** `08_login`  
**Version:** 1.0.0  
**Status:** 📝 Draft  
**Created:** 2025-11-13  
**Last Updated:** 2025-11-13

---

## 📋 Overview

**Title:** User Login & Authentication System  
**Type:** Feature  
**Priority:** 🔴 Critical

**Purpose:**  
Xây dựng hệ thống đăng nhập và xác thực người dùng an toàn cho KaDong Tools, cho phép người dùng đăng nhập, quản lý session, và bảo vệ các tính năng cá nhân hóa.

**Problem Statement:**  
Hiện tại, ứng dụng đang sử dụng localStorage để lưu dữ liệu và không có hệ thống xác thực người dùng. Điều này tạo ra các vấn đề:
- Dữ liệu không được đồng bộ giữa các thiết bị
- Không có cơ chế bảo mật cho dữ liệu cá nhân
- Không thể chia sẻ dữ liệu giữa các người dùng
- Không có audit trail cho các thay đổi dữ liệu
- Rủi ro mất dữ liệu khi xóa browser cache

---

## 🎯 Goals

### Primary Goals
1. **Secure Authentication**
   - Implement JWT-based authentication
   - Password hashing với bcrypt
   - Session management với secure tokens
   - Auto-logout khi token expired

2. **User Registration**
   - Email-based registration
   - Password strength validation
   - Email verification (future phase)
   - User profile management

3. **Access Control**
   - Protected routes cho authenticated users
   - Guest mode với limited features
   - Admin role cho quản lý hệ thống
   - Permission-based access control

### Secondary Goals
- Remember me functionality
- Password reset via email
- Multi-device session management
- Login activity tracking
- Social login (Google, Facebook) - future

### Non-Goals
- Two-factor authentication (2FA) - planned for v2.0
- Biometric authentication - không cần thiết
- OAuth provider (không phải identity provider)
- Enterprise SSO integration - out of scope

---

## ✅ Acceptance Criteria

### Must Have (Required)

#### Authentication Flow
- [ ] **AC1:** User có thể register với email + password
  - Email phải unique và valid format
  - Password tối thiểu 8 ký tự, có uppercase, lowercase, số
  - Success: Tạo account và auto-login
  - Failure: Show clear error messages

- [ ] **AC2:** User có thể login với email + password
  - Verify credentials against database
  - Generate JWT token với 7 days expiry
  - Store token in httpOnly cookie (secure)
  - Redirect to dashboard sau khi login thành công

- [ ] **AC3:** User có thể logout
  - Clear JWT token from cookie
  - Clear user state from frontend
  - Redirect to login page
  - Revoke token in database (sessions table)

- [ ] **AC4:** Protected routes require authentication
  - Redirect to login nếu chưa authenticate
  - Show loading state khi verify token
  - Preserve intended route sau khi login (returnUrl)
  - Auto-redirect nếu đã login

#### Security
- [ ] **AC5:** Password được hash với bcrypt (10 rounds)
  - Never store plain text passwords
  - Use salt per user
  - Password comparison sử dụng bcrypt.compare()

- [ ] **AC6:** JWT tokens secure và validated
  - Signed với strong secret key
  - Include user_id, email, role trong payload
  - Verify signature on every request
  - Check expiration time
  - Refresh token trước khi expire

- [ ] **AC7:** SQL injection prevention
  - All queries sử dụng parameterized statements
  - Input sanitization
  - No string concatenation trong SQL

- [ ] **AC8:** Rate limiting cho login endpoint
  - Max 5 attempts per 15 minutes per IP
  - Temporary lockout sau 5 failed attempts
  - Show countdown timer khi locked

#### User Experience
- [ ] **AC9:** Login form với proper validation
  - Email format validation
  - Password visibility toggle
  - Remember me checkbox
  - Clear error messages (not revealing info)
  - Loading state during authentication

- [ ] **AC10:** Registration form với validation
  - Email availability check
  - Password strength meter
  - Confirm password matching
  - Terms of service agreement
  - Success confirmation

#### Performance
- [ ] **AC11:** Token verification < 50ms
- [ ] **AC12:** Login API response < 300ms
- [ ] **AC13:** Registration API response < 500ms

### Should Have (Important)

- [ ] **AC14:** Remember me functionality
  - Longer token expiry (30 days)
  - Persistent session across browser restarts
  - Clear on explicit logout

- [ ] **AC15:** Password reset flow
  - Send reset link via email
  - Time-limited reset token (1 hour)
  - Verify token before allowing reset
  - Invalidate old tokens on success

- [ ] **AC16:** User profile management
  - Edit name, email
  - Change password (with old password verification)
  - Upload avatar (future)
  - View login history

- [ ] **AC17:** Session management
  - View active sessions
  - Logout from specific device
  - Logout all other sessions
  - Show last login time/location

### Nice to Have (Optional)

- [ ] **AC18:** Social login (Google)
  - OAuth 2.0 integration
  - Link social account to existing user
  - Auto-fill profile from social data

- [ ] **AC19:** Login activity monitoring
  - Track login attempts (success/fail)
  - Detect suspicious activity
  - Email notification for new device login
  - Login history với IP, user agent, location

- [ ] **AC20:** Advanced security
  - Account lockout after X failed attempts
  - CAPTCHA after failed attempts
  - Password history (prevent reuse)
  - Force password change after X days

### Test Cases

- [ ] **T1:** Unit tests for auth controller functions
  - register(), login(), logout(), verifyToken()
  - Password hashing/comparison
  - Token generation/validation
  - Edge cases: empty fields, invalid format

- [ ] **T2:** Integration tests for auth API endpoints
  - POST /api/auth/register - success, duplicate email, validation errors
  - POST /api/auth/login - success, wrong password, non-existent user
  - POST /api/auth/logout - success, already logged out
  - GET /api/auth/me - authenticated, unauthenticated

- [ ] **T3:** E2E tests for auth flows
  - Complete registration → login → access protected page → logout
  - Failed login → show error → retry success
  - Remember me → close browser → reopen → still logged in
  - Protected route → redirect to login → login → redirect to original page

- [ ] **T4:** Security tests
  - SQL injection attempts fail
  - XSS attempts sanitized
  - Invalid JWT rejected
  - Expired JWT rejected
  - Rate limiting enforced

- [ ] **T5:** Coverage target: 90%+

---

## 🏗️ Technical Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Login Page        Register Page       Protected Routes         │
│  ├─ LoginForm      ├─ RegisterForm     ├─ Notes                 │
│  ├─ Validation     ├─ Validation       ├─ Countdown             │
│  └─ Error Handler  └─ Strength Meter   └─ Settings              │
│                                                                  │
│  Auth Context (Global State)                                    │
│  ├─ user (id, email, name, role)                               │
│  ├─ isAuthenticated (boolean)                                  │
│  ├─ loading (boolean)                                          │
│  └─ functions: login(), logout(), register(), checkAuth()      │
│                                                                  │
│  Private Route Component                                        │
│  └─ Redirect to /login nếu !isAuthenticated                    │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP (JSON)
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API (Express)                        │
├─────────────────────────────────────────────────────────────────┤
│  Auth Routes (/api/auth/*)                                      │
│  ├─ POST /register → authController.register()                 │
│  ├─ POST /login → authController.login()                       │
│  ├─ POST /logout → authController.logout()                     │
│  ├─ GET /me → authController.getCurrentUser()                  │
│  ├─ POST /refresh → authController.refreshToken()              │
│  └─ POST /forgot-password → authController.forgotPassword()    │
│                                                                  │
│  Auth Middleware                                                │
│  ├─ verifyToken() - Check JWT in cookie/header                │
│  ├─ extractUser() - Decode payload                            │
│  └─ attachUser() - Add user to req.user                       │
│                                                                  │
│  Auth Controller                                                │
│  ├─ Hash passwords (bcrypt)                                    │
│  ├─ Generate JWT tokens                                        │
│  ├─ Verify credentials                                         │
│  └─ Session management                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕ SQL
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────────┤
│  users table                                                     │
│  ├─ id (UUID, PK)                                               │
│  ├─ email (VARCHAR, UNIQUE, NOT NULL)                          │
│  ├─ password_hash (VARCHAR, NOT NULL)                          │
│  ├─ name (VARCHAR)                                              │
│  ├─ role (ENUM: admin, user, guest)                           │
│  ├─ email_verified (BOOLEAN, default false)                   │
│  ├─ created_at, updated_at, deleted_at                         │
│                                                                  │
│  sessions table                                                  │
│  ├─ id (UUID, PK)                                               │
│  ├─ user_id (UUID, FK → users.id)                              │
│  ├─ token (TEXT, UNIQUE)                                        │
│  ├─ expires_at (TIMESTAMP)                                      │
│  ├─ ip_address (INET)                                           │
│  ├─ user_agent (TEXT)                                           │
│  ├─ created_at, revoked_at                                      │
│                                                                  │
│  login_attempts table                                            │
│  ├─ id (UUID, PK)                                               │
│  ├─ email (VARCHAR)                                             │
│  ├─ ip_address (INET)                                           │
│  ├─ success (BOOLEAN)                                           │
│  ├─ created_at (TIMESTAMP)                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Database Changes

#### New Tables

```sql
-- Users table (extend existing or create new)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
  email_verified BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Sessions table for token management
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP
);

-- Login attempts for security tracking
CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Indexes for Performance

```sql
-- Users indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Sessions indexes
CREATE INDEX idx_sessions_user_id ON sessions(user_id) WHERE revoked_at IS NULL;
CREATE INDEX idx_sessions_token ON sessions(token) WHERE revoked_at IS NULL;
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Login attempts indexes
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_created_at ON login_attempts(created_at DESC);

-- Password reset tokens indexes
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_token ON password_reset_tokens(token) WHERE used_at IS NULL;
CREATE INDEX idx_password_reset_expires ON password_reset_tokens(expires_at);
```

#### Triggers

```sql
-- Update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### API Endpoints

#### POST /api/auth/register
**Purpose:** Tạo tài khoản mới  
**Auth Required:** No  
**Rate Limit:** 3 requests/15min per IP

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "name": "John Doe",
  "agreeToTerms": true
}
```

**Validation:**
- Email: Valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number
- Name: Optional, max 255 chars
- Terms: Required, must be true

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "created_at": "2025-11-13T10:00:00Z"
    },
    "token": "jwt_token_here"
  },
  "message": "Registration successful"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email already exists",
    "details": {
      "field": "email",
      "value": "user@example.com"
    }
  }
}
```

---

#### POST /api/auth/login
**Purpose:** Đăng nhập  
**Auth Required:** No  
**Rate Limit:** 5 requests/15min per IP

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123",
  "rememberMe": false
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "jwt_token_here",
    "expiresIn": "7d"
  },
  "message": "Login successful"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

#### POST /api/auth/logout
**Purpose:** Đăng xuất và revoke token  
**Auth Required:** Yes (Bearer token)

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### GET /api/auth/me
**Purpose:** Lấy thông tin user hiện tại  
**Auth Required:** Yes

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "emailVerified": false,
    "createdAt": "2025-11-13T10:00:00Z",
    "lastLoginAt": "2025-11-13T12:00:00Z"
  }
}
```

---

#### POST /api/auth/refresh
**Purpose:** Refresh JWT token trước khi expire  
**Auth Required:** Yes (valid but near-expiry token)

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token",
    "expiresIn": "7d"
  }
}
```

---

#### POST /api/auth/forgot-password
**Purpose:** Request password reset email  
**Auth Required:** No  
**Rate Limit:** 3 requests/hour per email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Note:** Always return success (don't reveal if email exists)

---

#### POST /api/auth/reset-password
**Purpose:** Reset password với token  
**Auth Required:** No

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewStrongPass123"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

### Frontend Components

#### 1. LoginPage Component
**File:** `frontend/src/pages/LoginPage.jsx`  
**Purpose:** Login form và authentication logic

**Props:** None (uses AuthContext)

**State:**
```javascript
{
  email: '',
  password: '',
  rememberMe: false,
  errors: {},
  loading: false
}
```

**Features:**
- Email/password inputs với validation
- Remember me checkbox
- Loading spinner khi submitting
- Error messages display
- Link to registration
- Link to forgot password

---

#### 2. RegisterPage Component
**File:** `frontend/src/pages/RegisterPage.jsx`  
**Purpose:** User registration form

**State:**
```javascript
{
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  agreeToTerms: false,
  errors: {},
  loading: false
}
```

**Features:**
- Password strength meter
- Confirm password matching
- Terms checkbox
- Link to login

---

#### 3. AuthContext
**File:** `frontend/src/contexts/AuthContext.jsx`  
**Purpose:** Global authentication state

**State:**
```javascript
{
  user: null | { id, email, name, role },
  isAuthenticated: false,
  loading: true,
  error: null
}
```

**Functions:**
```javascript
{
  login: async (email, password, rememberMe) => {},
  register: async (email, password, name) => {},
  logout: async () => {},
  checkAuth: async () => {},
  updateUser: (userData) => {}
}
```

---

#### 4. PrivateRoute Component
**File:** `frontend/src/components/auth/PrivateRoute.jsx`  
**Purpose:** Protect routes requiring authentication

**Usage:**
```jsx
<PrivateRoute>
  <NotesTool />
</PrivateRoute>
```

**Logic:**
```javascript
if (loading) return <LoadingSpinner />
if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} />
return <Outlet />
```

---

#### 5. AuthService
**File:** `frontend/src/services/authService.js`  
**Purpose:** API calls cho authentication

**Functions:**
```javascript
{
  register: async (email, password, name) => POST /api/auth/register,
  login: async (email, password, rememberMe) => POST /api/auth/login,
  logout: async () => POST /api/auth/logout,
  getCurrentUser: async () => GET /api/auth/me,
  refreshToken: async () => POST /api/auth/refresh,
  forgotPassword: async (email) => POST /api/auth/forgot-password,
  resetPassword: async (token, newPassword) => POST /api/auth/reset-password
}
```

---

## 🔄 Data Flow

### Registration Flow
```
1. User điền form (email, password, name)
2. Frontend validate inputs
3. POST /api/auth/register
4. Backend:
   a. Validate email unique
   b. Hash password với bcrypt
   c. INSERT INTO users table
   d. Generate JWT token
   e. INSERT INTO sessions table
   f. Return user + token
5. Frontend:
   a. Store token in httpOnly cookie
   b. Update AuthContext state
   c. Redirect to dashboard
```

### Login Flow
```
1. User điền email + password
2. Frontend validate inputs
3. POST /api/auth/login
4. Backend:
   a. Check rate limit (5/15min)
   b. Query user by email
   c. Compare password hash
   d. Log attempt (login_attempts table)
   e. If success:
      - Generate JWT token
      - INSERT INTO sessions table
      - Return user + token
   f. If fail:
      - Log failed attempt
      - Check lockout threshold
      - Return generic error
5. Frontend:
   a. Store token in httpOnly cookie
   b. Update AuthContext (user, isAuthenticated)
   c. Redirect to returnUrl || dashboard
```

### Protected Route Access Flow
```
1. User navigate to /notes (protected)
2. PrivateRoute component check isAuthenticated
3. If false:
   a. Save current path in state.from
   b. Redirect to /login
4. If true:
   a. Check token expiry
   b. If near expiry (< 1 day):
      - Call POST /api/auth/refresh
      - Update token
   c. Render protected component
```

### Logout Flow
```
1. User click logout button
2. POST /api/auth/logout
3. Backend:
   a. Extract token from cookie
   b. UPDATE sessions SET revoked_at = NOW()
   c. Return success
4. Frontend:
   a. Clear cookie
   b. Reset AuthContext (user = null, isAuthenticated = false)
   c. Redirect to /login
```

---

## 🔐 Security Considerations

### Authentication & Authorization
- [x] JWT tokens với strong secret (32+ chars random string)
- [x] HttpOnly cookies (prevent XSS access)
- [x] Secure flag in production (HTTPS only)
- [x] SameSite=Strict (CSRF protection)
- [x] Token expiry: 7 days default, 30 days với remember me
- [x] Refresh tokens trước khi expire
- [x] Role-based access control (admin, user, guest)
- [x] Session revocation on logout

### Input Validation
- [x] Email format validation (frontend + backend)
- [x] Password complexity requirements
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (sanitize all inputs)
- [x] Rate limiting (login: 5/15min, register: 3/15min)
- [x] Request size limits (1MB max)

### Data Protection
- [x] Password hashing với bcrypt (10 rounds)
- [x] Never log passwords (even hashed)
- [x] No sensitive data in JWT payload (only id, email, role)
- [x] HTTPS in production (TLS 1.2+)
- [x] Environment variables cho secrets
- [x] Database connection encryption

### Attack Prevention
- [x] Brute force protection (rate limiting + lockout)
- [x] Generic error messages (don't reveal user existence)
- [x] Token replay attack prevention (one-time use for reset tokens)
- [x] Session fixation prevention (new token on login)
- [x] CORS properly configured (allow specific origins)
- [x] Helmet.js security headers

### Monitoring & Logging
- [x] Log all authentication events (success/fail)
- [x] Track login attempts (email, IP, user agent)
- [x] Alert on suspicious activity (>10 failed attempts)
- [x] Audit trail cho admin actions
- [x] No sensitive data in logs

---

## 📊 Performance Requirements

### Response Times
- Login API: < 300ms (target: 200ms)
- Register API: < 500ms (bcrypt hashing overhead)
- Token verification: < 50ms
- Protected route load: < 100ms (includes auth check)

### Database Performance
- User query by email: < 20ms (indexed)
- Session lookup: < 30ms (indexed on token)
- Login attempt check: < 50ms

### Scalability
- Concurrent logins: 100+ users/second
- Database connections: 20 pool size
- JWT verification: Stateless (no DB lookup per request)

### Caching Strategy
- User profile in memory (5 min TTL)
- Role permissions cached (15 min TTL)
- Public key for JWT verification cached

---

## 🧪 Testing Strategy

### Unit Tests
- [x] `authController.register()` - hash password, create user
- [x] `authController.login()` - verify credentials, generate token
- [x] `authController.logout()` - revoke session
- [x] `authMiddleware.verifyToken()` - validate JWT
- [x] `passwordUtils.hash()` - bcrypt hashing
- [x] `passwordUtils.compare()` - bcrypt comparison
- [x] `tokenUtils.generate()` - JWT generation
- [x] `tokenUtils.verify()` - JWT verification
- [x] `validators.isValidEmail()` - email format
- [x] `validators.isStrongPassword()` - password strength

### Integration Tests
- [x] POST /api/auth/register - create account, return token
- [x] POST /api/auth/login - authenticate, return token
- [x] POST /api/auth/logout - revoke session
- [x] GET /api/auth/me - return user profile
- [x] POST /api/auth/refresh - refresh token
- [x] Error cases: duplicate email, wrong password, invalid token
- [x] Rate limiting enforcement
- [x] Session expiry handling

### E2E Tests
- [x] Complete registration flow: form → submit → dashboard
- [x] Complete login flow: form → submit → redirect to returnUrl
- [x] Protected route access: unauthenticated → redirect to login
- [x] Logout flow: logout → clear state → redirect to login
- [x] Remember me: login → close browser → reopen → still logged in
- [x] Password reset: request → email → reset → login

### Security Tests
- [x] SQL injection attempts in email/password fields
- [x] XSS attempts in name field
- [x] Invalid JWT signature rejected
- [x] Expired JWT rejected
- [x] Tampered JWT payload rejected
- [x] Rate limit enforced (6th attempt blocked)
- [x] Weak password rejected

**Coverage Target:** 90%+

---

## 📝 Implementation Notes

### Technical Decisions

#### Decision 1: JWT vs Session-based Auth
**Context:** Cần chọn authentication strategy  
**Options:**
1. Session-based (server-side sessions in Redis)
   - Pros: Easy to revoke, server control
   - Cons: Stateful, requires Redis, more complex

2. JWT tokens (stateless)
   - Pros: Stateless, scalable, mobile-friendly
   - Cons: Hard to revoke, token size

3. Hybrid (JWT + sessions table)
   - Pros: Best of both worlds, can revoke
   - Cons: Slightly more complex

**Decision:** Hybrid approach (JWT + sessions table)  
**Reasoning:**
- JWT cho stateless verification (performance)
- Sessions table cho revocation capability (security)
- No Redis dependency (simpler deployment)
- Balance between performance và security

**Trade-offs:**
- Slightly more storage (sessions table)
- DB query on logout (acceptable overhead)

---

#### Decision 2: Password Storage - bcrypt vs argon2
**Context:** Password hashing algorithm  
**Options:**
1. bcrypt (industry standard)
   - Pros: Battle-tested, npm package stable, 10+ years production use
   - Cons: Slower than some alternatives

2. argon2 (newer, winner of PHC)
   - Pros: More secure against GPU attacks
   - Cons: Newer, less battle-tested in Node.js

**Decision:** bcrypt với 10 salt rounds  
**Reasoning:**
- Industry standard, proven security
- Excellent npm package (bcryptjs)
- Performance adequate for our scale (<100 req/s)
- 10 rounds = good balance (250ms hash time)

**Trade-offs:**
- Not the "newest" algorithm
- But stability > cutting-edge for auth

---

#### Decision 3: Token Storage - Cookie vs LocalStorage
**Context:** Where to store JWT on client  
**Options:**
1. localStorage
   - Pros: Easy to access from JS
   - Cons: Vulnerable to XSS

2. httpOnly cookie
   - Pros: Not accessible from JS (XSS protection)
   - Cons: CSRF risk (mitigated by SameSite)

**Decision:** httpOnly cookie với SameSite=Strict  
**Reasoning:**
- XSS protection (most common attack)
- SameSite=Strict prevents CSRF
- Automatic sending with requests
- More secure than localStorage

**Trade-offs:**
- Slightly more complex CORS setup
- But security > convenience

---

### Dependencies

**Backend:**
```json
{
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "express-rate-limit": "^7.1.5",
  "validator": "^13.11.0",
  "cookie-parser": "^1.4.6"
}
```

**Frontend:**
```json
{
  "react-hook-form": "^7.48.2",
  "zod": "^3.22.4"
}
```

### Known Limitations

1. **Email Verification:**
   - v1.0 không có email verification
   - Users có thể register với invalid email
   - **Workaround:** Add email verification in v1.1
   - **Impact:** Low (personal app, trusted users)

2. **2FA:**
   - Không support 2FA trong v1.0
   - **Workaround:** Plan for v2.0
   - **Impact:** Medium (security enhancement)

3. **Social Login:**
   - Chỉ email/password trong v1.0
   - **Workaround:** Add Google OAuth in v1.2
   - **Impact:** Low (nice-to-have)

4. **Password History:**
   - Không prevent password reuse
   - **Workaround:** Add in v1.3 nếu cần
   - **Impact:** Low (personal app)

---

## 🚀 Rollout Plan

### Phase 1: Backend Auth Foundation (Week 1)
- [x] Create database tables (users, sessions, login_attempts)
- [x] Implement auth controller (register, login, logout)
- [x] JWT token generation/verification
- [x] Password hashing utilities
- [x] Auth middleware
- [x] Unit tests

### Phase 2: Backend API Endpoints (Week 1-2)
- [x] POST /api/auth/register
- [x] POST /api/auth/login
- [x] POST /api/auth/logout
- [x] GET /api/auth/me
- [x] POST /api/auth/refresh
- [x] Rate limiting middleware
- [x] Integration tests

### Phase 3: Frontend Auth UI (Week 2)
- [x] LoginPage component
- [x] RegisterPage component
- [x] AuthContext provider
- [x] PrivateRoute component
- [x] AuthService API calls
- [x] Form validation

### Phase 4: Integration & Testing (Week 2-3)
- [x] Connect frontend ↔ backend
- [x] E2E tests
- [x] Security testing
- [x] Performance testing
- [x] Bug fixes

### Phase 5: Password Reset (Week 3)
- [x] Forgot password flow
- [x] Email service integration
- [x] Reset token generation
- [x] Reset password UI

### Phase 6: Documentation & Deployment (Week 3)
- [x] Update API docs
- [x] User guide
- [x] Migration guide (for existing users)
- [x] Deploy to staging
- [x] Deploy to production

### Rollback Plan
- **Database:** Run down migration (`006_down_auth.sql`)
- **Backend:** Revert auth routes
- **Frontend:** Remove auth pages, restore guest mode
- **Users:** Existing data preserved (backward compatible)

---

## 📚 Documentation

### User Documentation
- [x] **Login Guide:** `docs/user-guides/LOGIN_GUIDE.md`
  - How to register
  - How to login
  - Password requirements
  - Forgot password flow
  - Troubleshooting

- [x] **Security Best Practices:** `docs/user-guides/SECURITY_TIPS.md`
  - Choose strong password
  - Enable remember me safely
  - Logout on shared devices
  - Recognize phishing

### Developer Documentation
- [x] **API Documentation:** `docs/API_DOCUMENTATION.md`
  - Auth endpoints
  - Request/response formats
  - Error codes
  - Rate limits

- [x] **Database Schema:** `docs/DATABASE_SCHEMA.md`
  - Users table
  - Sessions table
  - Login attempts table
  - Indexes and constraints

- [x] **Auth Architecture:** `docs/dev-notes/features/login-auth-architecture.md`
  - System design
  - Security model
  - Token flow
  - Best practices

- [x] **Migration Guide:** `docs/MIGRATION_TO_AUTH.md`
  - Impact on existing features
  - Data migration steps
  - Breaking changes
  - Upgrade path

---

## 🔗 Related

- **Parent Spec:** N/A (standalone feature)
- **Related Specs:** 
  - `01_init.spec` - Project initialization
  - `03_wishlist_management.spec` - Will use auth
- **Implementation Plan:** `specs/plans/08_login.plan`
- **Feature Status:** `docs/dev-notes/features/login-implementation-status.md`

---

## 📅 Timeline

**Estimated Effort:** 3 weeks  
**Start Date:** 2025-11-13  
**Target Date:** 2025-12-04  
**Phases:**
- Week 1: Backend foundation + API endpoints
- Week 2: Frontend UI + Integration
- Week 3: Testing + Documentation + Deployment

---

## ✍️ Stakeholders

**Author:** Senior AI Developer  
**Reviewers:** KaDong Team  
**Approver:** Product Owner  
**Implementers:** Full-stack Development Team

---

## 📊 Success Metrics

### Quantitative
- **Registration conversion:** >80% complete registration form
- **Login success rate:** >95% successful logins
- **Token renewal rate:** >90% auto-refresh before expiry
- **API response time:** <300ms avg
- **Zero security incidents:** No password leaks, no SQL injection

### Qualitative
- User feedback: Easy to use login/register
- No confusion about authentication state
- Clear error messages
- Smooth UX (no jarring redirects)
- Confidence in security (HTTPS, secure cookies)

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-11-13 | 1.0.0 | Initial specification | AI Developer |

---

**Maintained By:** KaDong Development Team  
**Review Cycle:** Weekly during implementation  
**Next Review:** 2025-11-20
