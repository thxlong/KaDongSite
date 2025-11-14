# Admin Dashboard - Management System

**Spec ID:** `10_admin_dashboard`  
**Version:** 1.0.0  
**Status:** 📝 Draft  
**Created:** 2025-11-14  
**Last Updated:** 2025-11-14

---

## 📋 Overview

**Title:** Admin Dashboard & User Management System  
**Type:** Feature  
**Priority:** 🔴 Critical

**Purpose:**  
Xây dựng hệ thống quản trị toàn diện cho KaDong Tools, cho phép admin quản lý users, phân quyền, giám sát security, và xử lý các vấn đề liên quan đến authentication và authorization.

**Problem Statement:**  
Hiện tại hệ thống đã có authentication (login/logout) nhưng thiếu công cụ quản lý:
- Admin không có giao diện để quản lý users
- Không có cách reset login attempts khi users bị lock
- Không có dashboard để giám sát hoạt động hệ thống
- Không có công cụ phân quyền linh hoạt
- Không có audit trail để track admin actions
- Không có alerting system cho security threats

---

## 🎯 Goals

### Primary Goals

1. **User Management**
   - View danh sách tất cả users (pagination, search, filter)
   - Create/Edit/Delete users
   - Reset password cho users
   - Lock/Unlock user accounts
   - View user activity history
   - Export user data (CSV, Excel)

2. **Role & Permission Management**
   - RBAC (Role-Based Access Control)
   - Predefined roles: Admin, User, Guest, Moderator
   - Custom permissions per role
   - Assign/Revoke roles to users
   - Permission matrix view
   - Role hierarchy management

3. **Security Management**
   - View login attempts (success/failed)
   - Reset failed login attempts
   - Block/Unblock IP addresses
   - Session management (view active sessions, force logout)
   - Security alerts dashboard
   - Suspicious activity monitoring

4. **System Monitoring**
   - Real-time dashboard với metrics
   - User growth chart
   - Login activity heatmap
   - API usage statistics
   - Error rate monitoring
   - Performance metrics

5. **Admin Activity Audit**
   - Log tất cả admin actions
   - Track who did what, when
   - Audit trail với full context
   - Export audit logs
   - Alert on critical actions

### Secondary Goals

- Email notification system cho users
- Bulk operations (bulk delete, bulk role change)
- Advanced search với filters
- Data visualization (charts, graphs)
- Export/Import functionality
- Backup/Restore user data

### Non-Goals

- System configuration (environment variables) - sẽ làm riêng
- Database management - use external tools
- Code deployment - use CI/CD
- Server monitoring - use external tools (PM2, New Relic)

---

## ✅ Acceptance Criteria

### Must Have (Required)

#### User Management

- [ ] **AC1:** Admin có thể xem danh sách users với pagination
  - Table view: email, name, role, status, created_at, last_login
  - Pagination: 10/20/50/100 per page
  - Sort by: email, name, created_at, last_login
  - Filter by: role, status (active/locked), email_verified
  - Search: email, name (realtime search)

- [ ] **AC2:** Admin có thể tạo user mới
  - Form: email, name, password, role
  - Validation: email unique, password strength
  - Option: Send welcome email
  - Option: Mark email as verified
  - Success: Show toast + redirect to user detail

- [ ] **AC3:** Admin có thể edit user
  - Edit: name, email, role
  - Cannot edit: password (reset riêng), created_at
  - Confirmation: "Are you sure?" cho role change
  - Success: Update immediately + show toast

- [ ] **AC4:** Admin có thể delete user (soft delete)
  - Confirmation dialog: "This will delete all user data"
  - Soft delete: Set deleted_at timestamp
  - Option: Hard delete (permanent)
  - Prevent: Cannot delete self
  - Success: Remove from list + show toast

- [ ] **AC5:** Admin có thể reset password cho user
  - Generate random password or manual input
  - Option: Force change password on next login
  - Option: Send email với new password
  - Security: Log password reset in audit trail

- [ ] **AC6:** Admin có thể lock/unlock user account
  - Lock: User cannot login, show "Account locked" message
  - Unlock: Restore access immediately
  - Reason: Optional reason field (display to user)
  - Log: Track who locked, when, why

#### Role & Permission Management

- [ ] **AC7:** Admin có thể view roles với permissions
  - List view: role name, permission count, user count
  - Detail view: Permission matrix
  - Permissions categories:
    - Users: create, read, update, delete
    - Roles: manage
    - Security: view_logs, reset_attempts, block_ips
    - System: view_dashboard, export_data
    - Content: manage_notes, manage_wishlist, manage_countdowns

- [ ] **AC8:** Admin có thể assign role to user
  - Dropdown: Select role
  - Multiple roles: User có thể có nhiều roles
  - Default: All new users get "user" role
  - Validation: At least one role required
  - Effect: Immediate (no need to re-login)

- [ ] **AC9:** Admin có thể create custom role
  - Form: Role name, description
  - Permission selector: Checkbox matrix
  - Inherit: Copy from existing role
  - Validation: Role name unique
  - Success: Available immediately

#### Security Management

- [ ] **AC10:** Admin có thể view login attempts
  - Table: email, ip_address, success, timestamp, user_agent
  - Filter: success/failed, date range, email, IP
  - Highlight: Failed attempts > 3 (red)
  - Auto-refresh: Every 30 seconds
  - Export: CSV download

- [ ] **AC11:** Admin có thể reset failed login attempts
  - Button: "Reset Attempts" for specific email
  - Bulk action: Reset all failed attempts
  - Effect: Allow user to login immediately
  - Log: Track reset action in audit trail
  - Success: Show count of reset attempts

- [ ] **AC12:** Admin có thể block/unblock IP address
  - Form: IP address, reason, expiry (optional)
  - Effect: Immediate block, show "Access denied"
  - Whitelist: Admin IPs cannot be blocked
  - Auto-unblock: After expiry time
  - View: List of blocked IPs

- [ ] **AC13:** Admin có thể view active sessions
  - Table: user, ip_address, user_agent, created_at, expires_at
  - Action: Force logout specific session
  - Action: Logout all sessions for user
  - Real-time: Update every 10 seconds
  - Security: Cannot logout own session

#### Dashboard & Monitoring

- [ ] **AC14:** Admin dashboard với key metrics
  - Cards: Total users, Active users (last 7 days), Total logins today, Failed attempts today
  - Charts:
    - User growth (line chart, last 30 days)
    - Login activity (bar chart, hourly)
    - Role distribution (pie chart)
    - Top active users (table)
  - Auto-refresh: Every 60 seconds
  - Date picker: Custom date range

- [ ] **AC15:** Security alerts panel
  - Alert: >10 failed login attempts from same IP (last hour)
  - Alert: New admin created
  - Alert: Multiple sessions from different countries
  - Alert: Suspicious activity detected
  - Action: Click to view details
  - Dismiss: Mark as reviewed

#### Audit Trail

- [ ] **AC16:** Admin activity log
  - Table: admin_email, action, target (user/role), timestamp, ip_address, changes (JSON)
  - Actions logged:
    - User created/edited/deleted
    - Role assigned/revoked
    - Password reset
    - Account locked/unlocked
    - Login attempts reset
    - IP blocked/unblocked
    - Session terminated
  - Filter: admin, action type, date range
  - Search: target email, action
  - Export: CSV/JSON

### Should Have (Important)

- [ ] **AC17:** Bulk operations
  - Select multiple users: Checkbox selection
  - Actions: Delete, Change role, Lock, Export
  - Confirmation: Show count + preview
  - Progress: Loading bar for long operations

- [ ] **AC18:** Advanced filters
  - Created date range
  - Last login date range
  - Email verified: yes/no
  - Has active session: yes/no
  - Login count: min/max

- [ ] **AC19:** User profile detail page
  - User info card
  - Activity timeline
  - Sessions list
  - Login history
  - Role history
  - Notes (admin comments)

- [ ] **AC20:** Email notifications
  - Send to user: Password reset, Account locked, Role changed
  - Send to admin: New user signup, Security alert
  - Templates: Customizable email templates
  - Preview: Before sending

### Nice to Have (Optional)

- [ ] **AC21:** Data visualization
  - Geographic map: Login locations
  - Device breakdown: Desktop/Mobile
  - Browser stats: Chrome, Firefox, Safari
  - Login time heatmap: Hour of day x Day of week

- [ ] **AC22:** Export/Import
  - Export users: CSV, Excel, JSON
  - Import users: CSV upload
  - Validation: Email unique, required fields
  - Dry run: Preview before import

- [ ] **AC23:** Role templates
  - Predefined roles: Admin, Moderator, User, Guest, Developer
  - Clone role: Duplicate with modifications
  - Role suggestions: Based on permission patterns

- [ ] **AC24:** Security recommendations
  - Weak passwords: List users with weak passwords
  - Inactive accounts: Users not logged in >90 days
  - Unverified emails: List + bulk resend verification
  - Suspicious IPs: ML-based detection

---

## 🏗️ Technical Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (React)                            │
├─────────────────────────────────────────────────────────────────┤
│  Admin Dashboard Layout                                         │
│  ├─ Sidebar Navigation                                          │
│  │  ├─ Dashboard                                                │
│  │  ├─ Users                                                    │
│  │  ├─ Roles & Permissions                                      │
│  │  ├─ Security                                                 │
│  │  └─ Audit Logs                                               │
│  │                                                               │
│  ├─ Pages                                                        │
│  │  ├─ DashboardPage (metrics, charts)                         │
│  │  ├─ UsersPage (table, search, filters)                      │
│  │  ├─ UserDetailPage (profile, activity)                      │
│  │  ├─ RolesPage (RBAC management)                             │
│  │  ├─ SecurityPage (login attempts, blocked IPs)              │
│  │  └─ AuditLogsPage (activity log)                            │
│  │                                                               │
│  └─ Components                                                   │
│     ├─ UserTable (DataTable with actions)                       │
│     ├─ RolePermissionMatrix (checkbox grid)                     │
│     ├─ LoginAttemptsChart (recharts)                            │
│     ├─ SecurityAlerts (notification panel)                      │
│     └─ AuditLogViewer (timeline view)                           │
│                                                                  │
│  Protected by: requireRole(['admin'])                           │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTP (JSON)
┌─────────────────────────────────────────────────────────────────┐
│                     Backend API (Express)                        │
├─────────────────────────────────────────────────────────────────┤
│  Admin Routes (/api/admin/*)                                    │
│  ├─ GET /users - List users (pagination, filter, search)       │
│  ├─ POST /users - Create user                                  │
│  ├─ GET /users/:id - Get user detail                           │
│  ├─ PUT /users/:id - Update user                               │
│  ├─ DELETE /users/:id - Delete user (soft)                     │
│  ├─ POST /users/:id/reset-password - Reset password            │
│  ├─ POST /users/:id/lock - Lock account                        │
│  ├─ POST /users/:id/unlock - Unlock account                    │
│  │                                                               │
│  ├─ GET /roles - List roles with permissions                   │
│  ├─ POST /roles - Create custom role                           │
│  ├─ PUT /roles/:id - Update role permissions                   │
│  ├─ DELETE /roles/:id - Delete role                            │
│  ├─ POST /users/:id/roles - Assign role                        │
│  ├─ DELETE /users/:id/roles/:roleId - Revoke role              │
│  │                                                               │
│  ├─ GET /security/login-attempts - View attempts               │
│  ├─ POST /security/reset-attempts - Reset failed attempts      │
│  ├─ GET /security/blocked-ips - List blocked IPs               │
│  ├─ POST /security/block-ip - Block IP                         │
│  ├─ DELETE /security/block-ip/:ip - Unblock IP                 │
│  ├─ GET /security/sessions - View active sessions              │
│  ├─ DELETE /security/sessions/:id - Force logout session       │
│  │                                                               │
│  ├─ GET /dashboard/metrics - Key metrics                       │
│  ├─ GET /dashboard/charts - Chart data                         │
│  ├─ GET /dashboard/alerts - Security alerts                    │
│  │                                                               │
│  └─ GET /audit-logs - Activity log (pagination, filter)        │
│                                                                  │
│  Middleware: verifyToken + requireAdmin                         │
│  Rate Limit: 100 requests / 15 min                              │
└─────────────────────────────────────────────────────────────────┘
                              ↕ SQL
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                         │
├─────────────────────────────────────────────────────────────────┤
│  users (existing - enhanced)                                     │
│  ├─ locked_at (TIMESTAMP) ← NEW                                 │
│  ├─ lock_reason (TEXT) ← NEW                                    │
│  └─ last_login_at (TIMESTAMP) ← NEW                             │
│                                                                  │
│  roles (NEW)                                                     │
│  ├─ id (UUID PK)                                                │
│  ├─ name (VARCHAR UNIQUE)                                       │
│  ├─ description (TEXT)                                          │
│  ├─ permissions (JSONB) - Array of permission strings           │
│  ├─ is_system (BOOLEAN) - Cannot delete system roles            │
│  └─ created_at, updated_at                                      │
│                                                                  │
│  user_roles (NEW) - Many-to-many                                │
│  ├─ user_id (UUID FK → users.id)                                │
│  ├─ role_id (UUID FK → roles.id)                                │
│  ├─ assigned_by (UUID FK → users.id)                            │
│  └─ assigned_at (TIMESTAMP)                                     │
│                                                                  │
│  blocked_ips (NEW)                                               │
│  ├─ id (UUID PK)                                                │
│  ├─ ip_address (INET UNIQUE)                                    │
│  ├─ reason (TEXT)                                               │
│  ├─ blocked_by (UUID FK → users.id)                             │
│  ├─ expires_at (TIMESTAMP)                                      │
│  └─ created_at                                                  │
│                                                                  │
│  admin_audit_logs (NEW)                                          │
│  ├─ id (UUID PK)                                                │
│  ├─ admin_id (UUID FK → users.id)                               │
│  ├─ action (VARCHAR) - create_user, delete_user, etc.           │
│  ├─ target_type (VARCHAR) - user, role, ip, session             │
│  ├─ target_id (UUID)                                            │
│  ├─ changes (JSONB) - Before/After state                        │
│  ├─ ip_address (INET)                                           │
│  ├─ user_agent (TEXT)                                           │
│  └─ created_at [indexed]                                        │
│                                                                  │
│  security_alerts (NEW)                                           │
│  ├─ id (UUID PK)                                                │
│  ├─ type (VARCHAR) - brute_force, suspicious_login, etc.        │
│  ├─ severity (VARCHAR) - low, medium, high, critical            │
│  ├─ message (TEXT)                                              │
│  ├─ metadata (JSONB)                                            │
│  ├─ reviewed_by (UUID FK → users.id)                            │
│  ├─ reviewed_at (TIMESTAMP)                                     │
│  └─ created_at [indexed]                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Changes

### New Tables

```sql
-- Roles table (RBAC)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]', -- Array of permission strings
  is_system BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Role mapping (Many-to-many)
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Blocked IPs
CREATE TABLE blocked_ips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET UNIQUE NOT NULL,
  reason TEXT,
  blocked_by UUID REFERENCES users(id),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin audit logs
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- create_user, delete_user, assign_role, etc.
  target_type VARCHAR(50), -- user, role, ip, session
  target_id UUID,
  changes JSONB, -- { before: {...}, after: {...} }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Security alerts
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) NOT NULL, -- brute_force, suspicious_login, multiple_sessions
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB, -- Additional context
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add columns to existing users table
ALTER TABLE users 
  ADD COLUMN locked_at TIMESTAMP,
  ADD COLUMN lock_reason TEXT,
  ADD COLUMN last_login_at TIMESTAMP;
```

### Indexes

```sql
-- User roles indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Blocked IPs indexes
CREATE INDEX idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX idx_blocked_ips_expires_at ON blocked_ips(expires_at) WHERE expires_at IS NOT NULL;

-- Admin audit logs indexes
CREATE INDEX idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_id);
CREATE INDEX idx_admin_audit_logs_action ON admin_audit_logs(action);
CREATE INDEX idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_admin_audit_logs_target ON admin_audit_logs(target_type, target_id);

-- Security alerts indexes
CREATE INDEX idx_security_alerts_type ON security_alerts(type);
CREATE INDEX idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX idx_security_alerts_created_at ON security_alerts(created_at DESC);
CREATE INDEX idx_security_alerts_reviewed ON security_alerts(reviewed_at) WHERE reviewed_at IS NULL;

-- Existing tables indexes
CREATE INDEX idx_users_locked_at ON users(locked_at) WHERE locked_at IS NOT NULL;
CREATE INDEX idx_users_last_login_at ON users(last_login_at DESC);
CREATE INDEX idx_users_role ON users(role); -- Existing column for basic role
```

### Seed Data

```sql
-- Predefined roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
('admin', 'Full system access', 
 '["users.create","users.read","users.update","users.delete","roles.manage","security.view_logs","security.reset_attempts","security.block_ips","system.view_dashboard","system.export_data","content.manage_all"]'::jsonb, 
 true),
('moderator', 'Content and user moderation', 
 '["users.read","users.update","security.view_logs","content.manage_all"]'::jsonb, 
 true),
('user', 'Standard user access', 
 '["content.manage_own"]'::jsonb, 
 true),
('guest', 'Guest access (limited)', 
 '["content.view"]'::jsonb, 
 true);

-- Assign admin role to existing admin user
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 
  u.id, 
  r.id,
  u.id -- Self-assigned
FROM users u, roles r
WHERE u.email = 'admin@kadong.com' AND r.name = 'admin';
```

---

## 📡 API Endpoints

### User Management

#### GET /api/admin/users
**Purpose:** List users với pagination và filters  
**Auth:** Admin only  
**Rate Limit:** 100/15min

**Query Parameters:**
```typescript
{
  page?: number = 1
  limit?: number = 20
  sort?: 'email' | 'name' | 'created_at' | 'last_login_at' = 'created_at'
  order?: 'asc' | 'desc' = 'desc'
  search?: string // Email or name
  role?: string
  status?: 'active' | 'locked' | 'all' = 'all'
  email_verified?: boolean
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "roles": ["user"],
        "email_verified": true,
        "created_at": "2025-11-14T10:00:00Z",
        "last_login_at": "2025-11-14T12:00:00Z",
        "locked_at": null,
        "sessions_count": 2
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 100,
      "per_page": 20
    }
  }
}
```

---

#### POST /api/admin/users
**Purpose:** Create new user  
**Auth:** Admin only

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "SecurePass123",
  "role": "user",
  "email_verified": false,
  "send_welcome_email": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "name": "New User",
      "role": "user",
      "created_at": "2025-11-14T12:00:00Z"
    }
  },
  "message": "User created successfully"
}
```

---

#### PUT /api/admin/users/:id
**Purpose:** Update user  
**Auth:** Admin only

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "moderator"
}
```

---

#### DELETE /api/admin/users/:id
**Purpose:** Soft delete user  
**Auth:** Admin only

**Query Parameters:**
```typescript
{
  hard?: boolean = false // Permanent delete
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

#### POST /api/admin/users/:id/reset-password
**Purpose:** Reset user password  
**Auth:** Admin only

**Request Body:**
```json
{
  "new_password": "NewSecurePass123", // Optional, auto-generate if empty
  "force_change": true, // Require change on next login
  "send_email": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "password": "NewSecurePass123" // Only if not emailed
  },
  "message": "Password reset successfully"
}
```

---

#### POST /api/admin/users/:id/lock
**Purpose:** Lock user account  
**Auth:** Admin only

**Request Body:**
```json
{
  "reason": "Suspicious activity detected"
}
```

---

#### POST /api/admin/users/:id/unlock
**Purpose:** Unlock user account  
**Auth:** Admin only

---

### Role Management

#### GET /api/admin/roles
**Purpose:** List all roles with permissions

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "admin",
      "description": "Full system access",
      "permissions": ["users.create", "users.read", ...],
      "is_system": true,
      "user_count": 3,
      "created_at": "2025-11-14T10:00:00Z"
    }
  ]
}
```

---

#### POST /api/admin/roles
**Purpose:** Create custom role

**Request Body:**
```json
{
  "name": "support",
  "description": "Customer support team",
  "permissions": ["users.read", "content.manage_all"]
}
```

---

#### POST /api/admin/users/:userId/roles
**Purpose:** Assign role to user

**Request Body:**
```json
{
  "role_id": "uuid"
}
```

---

### Security Management

#### GET /api/admin/security/login-attempts
**Purpose:** View login attempts

**Query Parameters:**
```typescript
{
  page?: number = 1
  limit?: number = 50
  success?: boolean // Filter by success/failed
  email?: string
  ip_address?: string
  from?: string // ISO date
  to?: string // ISO date
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "attempts": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "ip_address": "192.168.1.1",
        "success": false,
        "failure_reason": "Invalid password",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2025-11-14T12:00:00Z"
      }
    ],
    "pagination": {...},
    "summary": {
      "total": 1250,
      "success": 1100,
      "failed": 150
    }
  }
}
```

---

#### POST /api/admin/security/reset-attempts
**Purpose:** Reset failed login attempts

**Request Body:**
```json
{
  "email": "user@example.com" // Optional, reset all if empty
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reset_count": 5
  },
  "message": "5 failed attempts reset"
}
```

---

#### POST /api/admin/security/block-ip
**Purpose:** Block IP address

**Request Body:**
```json
{
  "ip_address": "192.168.1.100",
  "reason": "Brute force attack",
  "expires_at": "2025-11-15T00:00:00Z" // Optional, permanent if empty
}
```

---

#### GET /api/admin/security/sessions
**Purpose:** View active sessions

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "ip_address": "192.168.1.1",
      "user_agent": "Chrome 120...",
      "created_at": "2025-11-14T10:00:00Z",
      "expires_at": "2025-11-21T10:00:00Z",
      "last_activity": "2025-11-14T12:00:00Z"
    }
  ],
  "count": 45
}
```

---

#### DELETE /api/admin/security/sessions/:id
**Purpose:** Force logout session

---

### Dashboard

#### GET /api/admin/dashboard/metrics
**Purpose:** Key metrics for dashboard

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "active_7d": 850,
      "new_today": 12,
      "growth_rate": 5.2
    },
    "logins": {
      "today": 3450,
      "failed_today": 23,
      "average_per_day": 3200
    },
    "security": {
      "blocked_ips": 5,
      "locked_accounts": 2,
      "pending_alerts": 3
    },
    "sessions": {
      "active": 245,
      "total_today": 3450
    }
  }
}
```

---

#### GET /api/admin/dashboard/charts
**Purpose:** Chart data

**Query Parameters:**
```typescript
{
  type: 'user_growth' | 'login_activity' | 'role_distribution'
  from?: string // ISO date
  to?: string // ISO date
  interval?: 'hour' | 'day' | 'week' = 'day'
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "chart_type": "user_growth",
    "data": [
      { "date": "2025-11-01", "count": 1200 },
      { "date": "2025-11-02", "count": 1215 },
      ...
    ]
  }
}
```

---

### Audit Logs

#### GET /api/admin/audit-logs
**Purpose:** View admin activity logs

**Query Parameters:**
```typescript
{
  page?: number = 1
  limit?: number = 50
  admin_email?: string
  action?: string
  target_type?: string
  from?: string
  to?: string
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "admin": {
          "id": "uuid",
          "email": "admin@kadong.com",
          "name": "Admin"
        },
        "action": "user_deleted",
        "target_type": "user",
        "target_id": "uuid",
        "changes": {
          "before": { "deleted_at": null },
          "after": { "deleted_at": "2025-11-14T12:00:00Z" }
        },
        "ip_address": "192.168.1.1",
        "created_at": "2025-11-14T12:00:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

## 🎨 Frontend Design

### Page Structure

```
/admin
├── /dashboard          → Dashboard Overview
├── /users              → User Management
│   ├── /               → Users list
│   ├── /new            → Create user
│   └── /:id            → User detail & edit
├── /roles              → Role & Permission Management
├── /security           → Security Dashboard
│   ├── /login-attempts → Login attempts table
│   ├── /blocked-ips    → Blocked IPs list
│   └── /sessions       → Active sessions
└── /audit-logs         → Activity audit trail
```

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] KaDong Admin                    [👤 Admin] [Logout]  │
├─────────┬───────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                                 │
│         │                                                   │
│ 📊 Dash │ ┌─────────────────────────────────────────────┐ │
│ 👥 Users│ │  Page Title                                 │ │
│ 🔐 Roles│ │  ───────────────                            │ │
│ 🛡️ Secu │ │                                             │ │
│ 📝 Audit│ │  Content (tables, charts, forms)            │ │
│         │ │                                             │ │
│         │ │                                             │ │
│         │ └─────────────────────────────────────────────┘ │
│         │                                                   │
├─────────┴───────────────────────────────────────────────────┤
│ Footer: v1.0.0 | Last Updated: 2025-11-14                   │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. AdminLayout
- **File:** `frontend/src/features/admin/AdminLayout.jsx`
- **Purpose:** Main layout với sidebar navigation
- **Children:** Outlet for nested routes

#### 2. Dashboard Page
- **File:** `frontend/src/features/admin/DashboardPage.jsx`
- **Components:**
  - MetricCard (Total users, Active users, etc.)
  - UserGrowthChart (Line chart)
  - LoginActivityChart (Bar chart)
  - RoleDistributionPie (Pie chart)
  - SecurityAlerts (Alert panel)
  - RecentActivity (Timeline)

#### 3. Users Management
- **File:** `frontend/src/features/admin/UsersPage.jsx`
- **Components:**
  - UsersTable (DataTable với sorting, filtering)
  - UserFilters (Search, Role filter, Status filter)
  - UserActions (Create, Edit, Delete, Lock, Reset password)
  - BulkActions (Select multiple, bulk operations)

#### 4. User Detail Page
- **File:** `frontend/src/features/admin/UserDetailPage.jsx`
- **Sections:**
  - User Info Card (Edit inline)
  - Activity Timeline
  - Sessions List
  - Login History
  - Role Management
  - Admin Notes

#### 5. Roles Management
- **File:** `frontend/src/features/admin/RolesPage.jsx`
- **Components:**
  - RolesTable (List of roles)
  - PermissionMatrix (Checkbox grid)
  - CreateRoleDialog (Form)

#### 6. Security Dashboard
- **File:** `frontend/src/features/admin/SecurityPage.jsx`
- **Tabs:**
  - Login Attempts (Table với filters)
  - Blocked IPs (List với unblock action)
  - Active Sessions (Table với force logout)
  - Security Alerts (Alert panel)

#### 7. Audit Logs
- **File:** `frontend/src/features/admin/AuditLogsPage.jsx`
- **Components:**
  - AuditLogTable (Timeline view)
  - LogFilters (Admin, Action, Date range)
  - LogDetail (Modal với full changes JSON)

---

## 🔒 Security Considerations

### Authorization
- ✅ All admin endpoints require `requireAdmin` middleware
- ✅ Check user has 'admin' role in database
- ✅ Prevent admin from deleting self
- ✅ Prevent admin from revoking own admin role
- ✅ Log all admin actions in audit trail

### Input Validation
- ✅ Validate all user inputs (email, name, role, etc.)
- ✅ Sanitize search queries (prevent SQL injection)
- ✅ Validate IP address format
- ✅ Check role exists before assigning
- ✅ Limit bulk operations (max 100 users at once)

### Rate Limiting
- Admin endpoints: 100 requests / 15 min
- More lenient than public endpoints
- Track by user_id, not IP (admins may use VPN)

### Audit Trail
- Log EVERYTHING admin does
- Include before/after state for updates
- Cannot be deleted (only archived after 1 year)
- Accessible only to admin role
- Export capability for compliance

### CSRF Protection
- Use CSRF tokens for state-changing operations
- Verify token on POST/PUT/DELETE
- SameSite cookie policy

### XSS Prevention
- Sanitize all user-generated content
- Escape HTML in user names, emails
- Use Content Security Policy headers

---

## 🧪 Testing Strategy

### Unit Tests
- Admin controller functions
- Permission checking logic
- Audit log creation
- Security alert detection
- User lock/unlock logic

### Integration Tests
- Admin API endpoints
- Role assignment flow
- Password reset flow
- IP blocking mechanism
- Session termination

### E2E Tests
- Admin login → dashboard
- Create/Edit/Delete user
- Assign role to user
- Reset password flow
- Lock account flow
- View and filter audit logs
- Block IP flow

### Security Tests
- Non-admin cannot access admin endpoints
- Admin cannot delete self
- Audit logs cannot be tampered
- Blocked IP cannot access
- Rate limiting enforced

---

## 📊 Performance Requirements

### Response Times
- Dashboard load: < 500ms
- Users list (20 items): < 300ms
- User detail: < 200ms
- Chart data: < 400ms
- Audit logs (50 items): < 300ms

### Pagination
- Default: 20 items per page
- Max: 100 items per page
- Server-side pagination (not load all)

### Caching
- Dashboard metrics: Cache 60 seconds
- Role list: Cache 5 minutes
- User list: No cache (real-time)
- Audit logs: No cache

### Database Optimization
- Indexes on frequently queried columns
- Composite indexes for complex queries
- Query optimization for joins
- Connection pooling (20 connections)

---

## 🚀 Rollout Plan

### Phase 1: Backend Foundation (Week 1)
- [ ] Create database migrations (roles, user_roles, blocked_ips, admin_audit_logs, security_alerts)
- [ ] Seed predefined roles
- [ ] Update user management endpoints
- [ ] Implement admin audit logging middleware
- [ ] Unit tests

### Phase 2: Admin API Endpoints (Week 1-2)
- [ ] User management endpoints (CRUD, lock, unlock, reset)
- [ ] Role management endpoints (CRUD, assign, revoke)
- [ ] Security endpoints (login attempts, block IP, sessions)
- [ ] Dashboard metrics endpoint
- [ ] Audit logs endpoint
- [ ] Integration tests

### Phase 3: Frontend Layout & Dashboard (Week 2)
- [ ] AdminLayout component với sidebar
- [ ] Protected admin route wrapper
- [ ] Dashboard page với metrics cards
- [ ] Chart components (user growth, login activity)
- [ ] Security alerts panel

### Phase 4: User Management UI (Week 2-3)
- [ ] UsersPage với table, search, filters
- [ ] UserDetailPage
- [ ] Create/Edit user dialogs
- [ ] Lock/Unlock user actions
- [ ] Reset password dialog
- [ ] Bulk actions

### Phase 5: Role & Security UI (Week 3)
- [ ] RolesPage với permission matrix
- [ ] Create custom role dialog
- [ ] Assign role to user
- [ ] SecurityPage với login attempts table
- [ ] Block/Unblock IP interface
- [ ] Active sessions management

### Phase 6: Audit Logs & Monitoring (Week 3-4)
- [ ] AuditLogsPage với timeline view
- [ ] Log filters và search
- [ ] Export functionality
- [ ] Real-time updates (WebSocket or polling)
- [ ] Security alerts notifications

### Phase 7: Testing & Polish (Week 4)
- [ ] E2E tests cho all admin flows
- [ ] Security testing
- [ ] Performance optimization
- [ ] UI/UX improvements
- [ ] Accessibility (WCAG 2.1)

### Phase 8: Documentation & Deployment (Week 4)
- [ ] Admin user guide
- [ ] Developer documentation
- [ ] API documentation (Swagger)
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production

---

## 📚 Documentation

### User Documentation
- **Admin Dashboard Guide:** `docs/admin/ADMIN_DASHBOARD_GUIDE.md`
  - Overview of features
  - How to manage users
  - How to assign roles
  - How to handle security issues
  - Best practices

- **Role & Permission Guide:** `docs/admin/ROLE_PERMISSION_GUIDE.md`
  - Understanding RBAC
  - Predefined roles
  - Creating custom roles
  - Permission reference

- **Security Management Guide:** `docs/admin/SECURITY_GUIDE.md`
  - Monitoring login attempts
  - Blocking suspicious IPs
  - Managing sessions
  - Responding to security alerts

### Developer Documentation
- **Admin API Reference:** `docs/api/ADMIN_API.md`
  - All admin endpoints
  - Request/response formats
  - Error codes
  - Rate limits

- **Database Schema:** Update `docs/DATABASE_SCHEMA.md`
  - New tables (roles, user_roles, blocked_ips, etc.)
  - Relationships
  - Indexes

- **Admin Architecture:** `docs/dev-notes/admin-architecture.md`
  - System design
  - Component structure
  - Data flow
  - Best practices

---

## 🔗 Related

- **Parent Spec:** `08_login.spec` (Authentication system)
- **Related Specs:**
  - `01_init.spec` - Project initialization
  - `04_api_testing_framework.spec` - API testing
- **Implementation Plan:** `specs/plans/10_admin_dashboard.plan`
- **Feature Status:** `docs/dev-notes/features/admin-dashboard-status.md`

---

## 📅 Timeline

**Estimated Effort:** 4 weeks (160 hours)  
**Start Date:** 2025-11-15  
**Target Date:** 2025-12-13

**Breakdown:**
- Week 1: Backend foundation + Admin API (40h)
- Week 2: Frontend layout + Dashboard + User Management (40h)
- Week 3: Role Management + Security UI (40h)
- Week 4: Audit Logs + Testing + Documentation (40h)

---

## ✍️ Stakeholders

**Author:** KaDong Development Team  
**Reviewers:** Security Team, Product Owner  
**Approver:** Project Lead  
**Implementers:** Full-stack Development Team

---

## 📊 Success Metrics

### Quantitative
- **Admin adoption:** 100% admins use dashboard (vs manual DB queries)
- **Response time:** <500ms for all admin pages
- **Audit coverage:** 100% admin actions logged
- **Security incidents:** Detect >95% suspicious activities
- **User satisfaction:** >4.5/5 rating from admins

### Qualitative
- Easy to find and manage users
- Intuitive permission management
- Clear security alerts
- Comprehensive audit trail
- Professional UI/UX

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-11-14 | 1.0.0 | Initial specification | KaDong Team |

---

**Maintained By:** KaDong Development Team  
**Review Cycle:** Weekly during implementation  
**Next Review:** 2025-11-21

---

## 📝 Notes

### Dependencies
- Requires completed authentication system (spec 08)
- Requires established RBAC patterns
- May need data visualization library (recharts, chart.js)
- May need data table library (react-table, tanstack-table)

### Risks
- **Performance:** Large user base may slow queries → Use pagination + indexes
- **Security:** Admin access is powerful → Strict authorization + audit everything
- **Complexity:** Many features → Implement incrementally, MVP first
- **UX:** Dashboard can be overwhelming → Clear navigation + progressive disclosure

### Future Enhancements (v2.0)
- Advanced analytics (ML-based insights)
- Automated security responses (auto-block suspicious IPs)
- Integration với external systems (Slack alerts, email)
- Mobile app for admins
- Multi-language support
- Dark mode
- Customizable dashboard widgets
