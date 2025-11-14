# Admin Dashboard - Hệ Thống Quản Trị

**Version:** 1.0.0  
**Status:** 📝 Planning Phase  
**Last Updated:** 2025-11-14

---

## 📖 Giới Thiệu

Admin Dashboard là hệ thống quản trị toàn diện cho KaDong Tools, cung cấp đầy đủ công cụ để quản lý users, phân quyền, giám sát security và theo dõi hoạt động của hệ thống.

### Mục Đích

- **Quản lý Users:** Tạo, sửa, xóa, khóa/mở khóa tài khoản users
- **Phân Quyền (RBAC):** Role-Based Access Control với custom roles và permissions
- **Bảo Mật:** Giám sát login attempts, block IPs, quản lý sessions
- **Audit Trail:** Theo dõi mọi hành động của admins
- **Monitoring:** Dashboard với metrics và charts real-time

### Đối Tượng Sử Dụng

- **System Admin:** Full access, quản lý toàn bộ hệ thống
- **Moderator:** Quản lý users và content
- **Developer:** Xem logs và metrics (future)

---

## 🏗️ Kiến Trúc Hệ Thống

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Admin Frontend                        │
│  (React + Vite + TailwindCSS + Recharts)                │
│                                                          │
│  • Dashboard (metrics, charts)                           │
│  • User Management (CRUD, lock, reset)                   │
│  • Role Management (RBAC, permissions)                   │
│  • Security (login attempts, blocked IPs, sessions)      │
│  • Audit Logs (activity trail)                           │
└──────────────────────────────────────────────────────────┘
                         ↕ REST API (JSON)
┌──────────────────────────────────────────────────────────┐
│                    Admin Backend                         │
│  (Express.js + Node.js)                                 │
│                                                          │
│  • Admin Controllers (users, roles, security, audit)     │
│  • Auth Middleware (JWT verification, role check)        │
│  • Audit Middleware (log all actions)                    │
│  • Rate Limiter (100 req/15min)                         │
└──────────────────────────────────────────────────────────┘
                         ↕ SQL
┌──────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                   │
│                                                          │
│  • users (enhanced with locked_at, last_login_at)        │
│  • roles (name, permissions JSONB)                       │
│  • user_roles (many-to-many)                            │
│  • blocked_ips (ip_address, reason, expires_at)         │
│  • admin_audit_logs (action, target, changes)           │
│  • security_alerts (type, severity, metadata)           │
└──────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

### Tables Overview

#### 1. `roles` - Quản lý roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]',  -- Array of permission strings
  is_system BOOLEAN DEFAULT FALSE, -- System roles cannot be deleted
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Predefined Roles:**
- `admin` - Full system access
- `moderator` - Content and user moderation
- `user` - Standard user access
- `guest` - Guest access (limited)

**Permissions Structure:**
```json
{
  "permissions": [
    "users.create",
    "users.read",
    "users.update",
    "users.delete",
    "roles.manage",
    "security.view_logs",
    "security.reset_attempts",
    "security.block_ips",
    "system.view_dashboard",
    "system.export_data",
    "content.manage_all"
  ]
}
```

---

#### 2. `user_roles` - Mapping users ↔ roles

```sql
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);
```

**Relationship:**
- One user can have multiple roles
- One role can be assigned to multiple users
- Track who assigned the role

---

#### 3. `blocked_ips` - Danh sách IPs bị block

```sql
CREATE TABLE blocked_ips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET UNIQUE NOT NULL,
  reason TEXT,
  blocked_by UUID REFERENCES users(id),
  expires_at TIMESTAMP,              -- NULL = permanent
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Use Cases:**
- Block brute force attackers
- Block suspicious IPs
- Temporary or permanent blocks
- Auto-unblock after expiry

---

#### 4. `admin_audit_logs` - Lưu mọi hành động của admins

```sql
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,      -- create_user, delete_user, etc.
  target_type VARCHAR(50),           -- user, role, ip, session
  target_id UUID,
  changes JSONB,                     -- { before: {...}, after: {...} }
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Actions Logged:**
- `create_user`, `update_user`, `delete_user`
- `assign_role`, `revoke_role`
- `reset_password`
- `lock_user`, `unlock_user`
- `block_ip`, `unblock_ip`
- `terminate_session`
- `reset_login_attempts`

**Example Log Entry:**
```json
{
  "admin_id": "uuid-admin",
  "action": "update_user",
  "target_type": "user",
  "target_id": "uuid-user",
  "changes": {
    "before": { "role": "user" },
    "after": { "role": "moderator" }
  },
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2025-11-14T12:00:00Z"
}
```

---

#### 5. `security_alerts` - Cảnh báo security

```sql
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(100) NOT NULL,        -- brute_force, suspicious_login, etc.
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  metadata JSONB,                    -- Additional context
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Alert Types:**
- `brute_force` - >10 failed login attempts from same IP
- `suspicious_login` - Login from unusual location
- `multiple_sessions` - User has >5 active sessions
- `admin_created` - New admin user created
- `mass_deletion` - Bulk delete operation

**Example Alert:**
```json
{
  "type": "brute_force",
  "severity": "high",
  "message": "10 failed login attempts from 192.168.1.100",
  "metadata": {
    "ip": "192.168.1.100",
    "email": "user@example.com",
    "count": 10,
    "timeframe": "1 hour"
  },
  "created_at": "2025-11-14T12:00:00Z"
}
```

---

#### 6. `users` Table Enhancements

**New Columns:**
```sql
ALTER TABLE users 
  ADD COLUMN locked_at TIMESTAMP,
  ADD COLUMN lock_reason TEXT,
  ADD COLUMN last_login_at TIMESTAMP;
```

**Usage:**
- `locked_at`: NULL = active, NOT NULL = locked
- `lock_reason`: Admin notes why account was locked
- `last_login_at`: Track user activity

---

## 📡 API Endpoints

### Base URL: `/api/admin`

**Authentication:** All endpoints require JWT token with admin role  
**Rate Limit:** 100 requests / 15 minutes

---

### 👥 User Management

#### GET `/api/admin/users`
**Purpose:** List users với pagination và filters

**Query Parameters:**
```typescript
{
  page?: number = 1
  limit?: number = 20
  sort?: 'email' | 'name' | 'created_at' | 'last_login_at' = 'created_at'
  order?: 'asc' | 'desc' = 'desc'
  search?: string              // Email or name
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

#### POST `/api/admin/users`
**Purpose:** Create new user

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

#### PUT `/api/admin/users/:id`
**Purpose:** Update user

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "moderator"
}
```

---

#### DELETE `/api/admin/users/:id`
**Purpose:** Soft delete user

**Query Parameters:**
```typescript
{
  hard?: boolean = false  // Permanent delete
}
```

---

#### POST `/api/admin/users/:id/reset-password`
**Purpose:** Reset user password

**Request Body:**
```json
{
  "new_password": "NewSecurePass123",  // Optional, auto-generate if empty
  "force_change": true,                // Require change on next login
  "send_email": true
}
```

---

#### POST `/api/admin/users/:id/lock`
**Purpose:** Lock user account

**Request Body:**
```json
{
  "reason": "Suspicious activity detected"
}
```

---

#### POST `/api/admin/users/:id/unlock`
**Purpose:** Unlock user account

---

### 🔐 Role Management

#### GET `/api/admin/roles`
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

#### POST `/api/admin/roles`
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

#### POST `/api/admin/users/:userId/roles`
**Purpose:** Assign role to user

**Request Body:**
```json
{
  "role_id": "uuid"
}
```

---

### 🛡️ Security Management

#### GET `/api/admin/security/login-attempts`
**Purpose:** View login attempts

**Query Parameters:**
```typescript
{
  page?: number = 1
  limit?: number = 50
  success?: boolean
  email?: string
  ip_address?: string
  from?: string  // ISO date
  to?: string    // ISO date
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

#### POST `/api/admin/security/reset-attempts`
**Purpose:** Reset failed login attempts

**Request Body:**
```json
{
  "email": "user@example.com"  // Optional, reset all if empty
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

#### POST `/api/admin/security/block-ip`
**Purpose:** Block IP address

**Request Body:**
```json
{
  "ip_address": "192.168.1.100",
  "reason": "Brute force attack",
  "expires_at": "2025-11-15T00:00:00Z"  // Optional, permanent if empty
}
```

---

#### GET `/api/admin/security/sessions`
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

#### DELETE `/api/admin/security/sessions/:id`
**Purpose:** Force logout session

---

### 📊 Dashboard

#### GET `/api/admin/dashboard/metrics`
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

#### GET `/api/admin/dashboard/charts`
**Purpose:** Chart data

**Query Parameters:**
```typescript
{
  type: 'user_growth' | 'login_activity' | 'role_distribution'
  from?: string
  to?: string
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
      { "date": "2025-11-02", "count": 1215 }
    ]
  }
}
```

---

### 📝 Audit Logs

#### GET `/api/admin/audit-logs`
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

## 🎨 Frontend Pages

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

---

### 1. Dashboard Page (`/admin/dashboard`)

**Components:**
- **Metric Cards:** Total users, Active users (7d), Logins today, Failed attempts
- **User Growth Chart:** Line chart showing user growth over time
- **Login Activity Chart:** Bar chart showing hourly login activity
- **Role Distribution:** Pie chart showing user distribution by role
- **Security Alerts Panel:** List of pending security alerts
- **Recent Activity:** Timeline of recent admin actions

**Features:**
- Auto-refresh every 60 seconds
- Date range picker for charts
- Click alerts to view details
- Quick actions: Create user, View users, View security

---

### 2. Users Page (`/admin/users`)

**Components:**
- **Users Table:** List of all users
  - Columns: Email, Name, Role, Status, Last Login, Actions
  - Sorting: Click column headers
  - Filtering: Role, Status, Email verified
  - Search: Real-time search by email or name
- **Bulk Actions:** Select multiple users for bulk operations
- **Action Buttons:** Edit, Delete, Lock, Reset password
- **Create User Button:** Opens dialog to create new user

**Features:**
- Pagination: 20 items per page (configurable)
- Export: CSV download
- Refresh: Manual refresh button
- Responsive: Mobile-friendly table

---

### 3. User Detail Page (`/admin/users/:id`)

**Sections:**
- **User Info Card:** Display and edit user details
  - Email, Name, Role, Status
  - Created at, Last login at
  - Inline edit mode
- **Activity Timeline:** Recent user actions
- **Sessions List:** Active sessions with force logout button
- **Login History:** Last 50 login attempts
- **Role Management:** Assign/Revoke roles
- **Admin Notes:** Private notes about the user

**Actions:**
- Edit user
- Reset password
- Lock/Unlock account
- Delete user
- Force logout all sessions

---

### 4. Roles Page (`/admin/roles`)

**Components:**
- **Roles Table:** List of all roles
  - Columns: Name, Description, User Count, System Role
  - Actions: Edit, Delete (custom only)
- **Permission Matrix:** Grid of all permissions
  - Categories: Users, Roles, Security, System, Content
  - Checkboxes: Enable/Disable permissions
- **Create Role Dialog:** Form to create custom role

**Features:**
- Predefined roles (cannot delete)
- Custom roles (can edit, delete)
- Permission inheritance (future)
- Role templates

---

### 5. Security Page (`/admin/security`)

**Tabs:**
- **Login Attempts:** Table of all login attempts
  - Filters: Success/Failed, Date range, Email, IP
  - Highlight: Failed attempts in red
  - Action: Reset attempts button
- **Blocked IPs:** List of blocked IP addresses
  - Columns: IP, Reason, Blocked by, Expires at
  - Action: Unblock button
  - Form: Block new IP
- **Active Sessions:** List of active user sessions
  - Columns: User, IP, User Agent, Created at, Expires at
  - Action: Force logout button
- **Security Alerts:** List of security alerts
  - Filter: Severity, Type, Status
  - Action: Dismiss button

**Features:**
- Auto-refresh every 30 seconds
- Export login attempts to CSV
- Quick actions for common tasks

---

### 6. Audit Logs Page (`/admin/audit-logs`)

**Components:**
- **Audit Timeline:** Chronological list of admin actions
  - Items: Admin, Action, Target, Timestamp
  - Icons: Different icon for each action type
  - Click: View full details in modal
- **Filters:** Admin, Action type, Target type, Date range
- **Search:** Search by target email or action
- **Export:** Download as CSV or JSON

**Features:**
- Auto-refresh every 30 seconds
- Detailed view: Before/After changes
- Link to target (user, role, etc.)
- Cannot delete logs (read-only)

---

## 🔒 Security Considerations

### Authentication
- ✅ JWT token required on all admin endpoints
- ✅ Token validated on every request
- ✅ Session checked in database
- ✅ httpOnly cookies for XSS protection

### Authorization
- ✅ User must have admin role
- ✅ Role verified from database (not JWT)
- ✅ Permission check before sensitive actions
- ✅ Admin cannot delete self
- ✅ Admin cannot revoke own admin role

### Audit Trail
- ✅ Log all admin actions
- ✅ Include before/after state
- ✅ Record IP address and user agent
- ✅ Logs cannot be deleted (only archived)
- ✅ Export capability for compliance

### Input Validation
- ✅ Sanitize all inputs (prevent XSS)
- ✅ Parameterized queries (prevent SQL injection)
- ✅ Email format validation
- ✅ Password strength validation
- ✅ Role name validation

### Rate Limiting
- ✅ 100 requests / 15 minutes per admin
- ✅ Track by user_id (not IP)
- ✅ Clear error message on limit exceeded
- ✅ Log rate limit violations

---

## 🧪 Testing Strategy

### Unit Tests
- Admin controller functions
- Permission checking logic
- Audit log creation
- Security alert detection

### Integration Tests
- Admin API endpoints
- Role assignment flow
- Password reset flow
- IP blocking mechanism

### E2E Tests
- Admin login → dashboard
- Create/Edit/Delete user
- Assign role to user
- Lock account flow
- View and filter audit logs

### Security Tests
- Non-admin cannot access
- Admin cannot delete self
- Audit logs cannot be tampered
- Blocked IP cannot access

---

## 📊 Performance Requirements

### Response Times (p95)
- Dashboard load: <500ms
- Users list (20 items): <300ms
- User detail: <200ms
- Chart data: <400ms
- Audit logs (50 items): <300ms

### Optimization
- Database indexes on frequently queried columns
- Pagination for large datasets
- Caching for dashboard metrics (60 seconds)
- Query optimization for complex joins

---

## 🚀 Deployment

### Pre-requisites
- Existing auth system (login/logout) complete
- PostgreSQL database set up
- Admin user seeded (admin@kadong.com)

### Steps
1. **Database Migration:**
   ```bash
   npm run db:migrate:009
   npm run db:seed:009
   ```

2. **Backend Deployment:**
   ```bash
   cd backend
   npm install
   npm run build
   pm2 restart all
   ```

3. **Frontend Deployment:**
   ```bash
   cd frontend
   npm install
   npm run build
   # Deploy dist/ to CDN
   ```

4. **Verification:**
   - Login as admin@kadong.com
   - Navigate to /admin/dashboard
   - Test key functions

---

## 📚 Related Documentation

- **Spec:** `specs/specs/10_admin_dashboard.spec` - Full specification
- **Plan:** `specs/plans/10_admin_dashboard.plan` - Implementation plan
- **Auth System:** `backend/AUTH_IMPLEMENTATION_SUMMARY.md` - Authentication docs
- **Database:** `docs/DATABASE_SCHEMA.md` - Database schema
- **API:** `docs/api/ADMIN_API.md` - API documentation (to be created)

---

## 🔄 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-14 | Initial documentation | KaDong Team |

---

**Maintained By:** KaDong Development Team  
**Contact:** dev@kadong.com  
**Review Cycle:** Monthly during active development
