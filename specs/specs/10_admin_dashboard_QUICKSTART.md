# Admin Dashboard - Quickstart Guide

**Version:** 1.0.0  
**Status:** 📋 Planning Phase  
**Estimated Duration:** 4 tuần (160 giờ)

---

## 🎯 TL;DR

Admin Dashboard là hệ thống quản trị cho phép admins:
- ✅ Quản lý users (CRUD, lock/unlock, reset password)
- ✅ Phân quyền RBAC (roles, permissions)
- ✅ Giám sát security (login attempts, blocked IPs, sessions)
- ✅ Theo dõi activity (audit logs)
- ✅ Dashboard với metrics và charts

**Tech Stack:**
- Backend: Express.js + PostgreSQL
- Frontend: React + Vite + TailwindCSS + Recharts
- Auth: JWT + Sessions
- Testing: Jest + Playwright

---

## 📋 Checklist - Bắt Đầu

### Trước Khi Bắt Đầu
- [ ] ✅ Auth system hoàn tất (login/logout working)
- [ ] ✅ PostgreSQL database đã setup
- [ ] ✅ Admin user đã tạo (admin@kadong.com / KaDong2024!)
- [ ] ✅ Đọc spec: `specs/specs/10_admin_dashboard.spec`
- [ ] ✅ Đọc plan: `specs/plans/10_admin_dashboard.plan`
- [ ] ✅ Team kickoff meeting

### Week 1: Backend Foundation (40h)
- [ ] **Day 1-2:** Database design & migrations (16h)
  - [ ] Create migration `009_admin_system.sql`
  - [ ] Create seed `009_admin_seed.js`
  - [ ] Run migrations and verify
  - [ ] Create database utilities
- [ ] **Day 3-4:** Admin controllers (16h)
  - [ ] Admin user controller (8 functions)
  - [ ] Admin role controller (7 functions)
  - [ ] Admin security controller (9 functions)
- [ ] **Day 5:** Dashboard & audit (8h)
  - [ ] Dashboard controller (4 functions)
  - [ ] Audit controller (3 functions)
  - [ ] Audit logging middleware

### Week 2: API Routes & Frontend Setup (40h)
- [ ] **Day 6:** API routes (8h)
  - [ ] Create admin routes (users, roles, security, dashboard, audit)
  - [ ] Update main app.js
  - [ ] Create API tests
- [ ] **Day 7-8:** Frontend setup & dashboard (16h)
  - [ ] Create admin folder structure
  - [ ] AdminLayout component
  - [ ] AdminSidebar component
  - [ ] adminService (API client)
  - [ ] DashboardPage với charts

### Week 3: User Management & Security UI (40h)
- [ ] **Day 9-10:** User management (16h)
  - [ ] UsersPage với table, filters
  - [ ] UserTable component
  - [ ] UserDetailPage
  - [ ] User dialogs (create, edit, reset, lock, delete)
- [ ] **Day 11-12:** Security features (16h)
  - [ ] RolesPage với permission matrix
  - [ ] RolePermissionMatrix component
  - [ ] SecurityPage với tabs
  - [ ] LoginAttemptsTable component
- [ ] **Day 13:** Audit logs (8h)
  - [ ] AuditLogsPage
  - [ ] AuditLogViewer component
  - [ ] Custom hooks

### Week 4: Testing & Documentation (40h)
- [ ] **Day 14-15:** Testing (16h)
  - [ ] Backend unit tests (80% coverage)
  - [ ] API integration tests
  - [ ] Frontend E2E tests (Playwright)
- [ ] **Day 16:** Documentation (8h)
  - [ ] Admin user guide
  - [ ] Role & permission guide
  - [ ] Security management guide
  - [ ] API documentation
- [ ] **Day 17-20:** Buffer & deployment (16h)
  - [ ] Bug fixes
  - [ ] Performance optimization
  - [ ] Final testing
  - [ ] Production deployment

---

## 🚀 Quick Commands

### Database Setup
```bash
# Run migration
cd backend
node scripts/database/migrate-009.js

# Seed data
node database/seeds/009_admin_seed.js

# Verify
node scripts/database/verify-admin-tables.js
```

### Backend Development
```bash
# Start dev server
cd backend
npm run dev

# Test admin endpoints
node test-admin-endpoints.js

# Run unit tests
npm test -- --coverage

# Run specific controller test
npm test adminUserController.test.js
```

### Frontend Development
```bash
# Start dev server
cd frontend
npm run dev

# Build production
npm run build

# Run E2E tests
npx playwright test admin-dashboard.e2e.spec.js

# Run specific E2E test
npx playwright test admin-users.e2e.spec.js -g "should create user"
```

---

## 📂 File Structure

### Backend Files to Create (20 files)

```
backend/
├── database/
│   ├── migrations/
│   │   └── 009_admin_system.sql           ← NEW (Database tables)
│   └── seeds/
│       └── 009_admin_seed.js              ← NEW (Seed roles & users)
│
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── adminUserController.js     ← NEW (User CRUD)
│   │   │   ├── adminRoleController.js     ← NEW (Role RBAC)
│   │   │   ├── adminSecurityController.js ← NEW (Security mgmt)
│   │   │   ├── adminDashboardController.js← NEW (Metrics)
│   │   │   └── adminAuditController.js    ← NEW (Audit logs)
│   │   │
│   │   ├── middlewares/
│   │   │   └── auditMiddleware.js         ← NEW (Log admin actions)
│   │   │
│   │   └── routes/
│   │       └── admin/
│   │           ├── index.js               ← NEW (Main router)
│   │           ├── users.js               ← NEW (User routes)
│   │           ├── roles.js               ← NEW (Role routes)
│   │           ├── security.js            ← NEW (Security routes)
│   │           ├── dashboard.js           ← NEW (Dashboard routes)
│   │           └── audit.js               ← NEW (Audit routes)
│   │
│   └── utils/
│       ├── permissionChecker.js           ← NEW (Check permissions)
│       ├── auditLogger.js                 ← NEW (Create audit logs)
│       └── securityAlerts.js              ← NEW (Create alerts)
│
└── tests/
    ├── unit/
    │   └── controllers/
    │       ├── adminUserController.test.js
    │       ├── adminRoleController.test.js
    │       └── adminSecurityController.test.js
    └── integration/
        └── admin-api.test.js
```

### Frontend Files to Create (25 files)

```
frontend/src/features/admin/
├── components/
│   ├── AdminLayout.jsx                    ← NEW (Main layout)
│   ├── AdminSidebar.jsx                   ← NEW (Navigation)
│   ├── MetricCard.jsx                     ← NEW (Dashboard card)
│   ├── UserTable.jsx                      ← NEW (Users table)
│   ├── UserFilters.jsx                    ← NEW (Search/filter)
│   ├── RolePermissionMatrix.jsx           ← NEW (Permission grid)
│   ├── LoginAttemptsTable.jsx             ← NEW (Login history)
│   ├── SecurityAlert.jsx                  ← NEW (Alert item)
│   ├── AuditLogViewer.jsx                 ← NEW (Log timeline)
│   ├── CreateUserDialog.jsx               ← NEW
│   ├── EditUserDialog.jsx                 ← NEW
│   ├── ResetPasswordDialog.jsx            ← NEW
│   ├── LockUserDialog.jsx                 ← NEW
│   └── DeleteUserDialog.jsx               ← NEW
│
├── pages/
│   ├── DashboardPage.jsx                  ← NEW (Overview)
│   ├── UsersPage.jsx                      ← NEW (User management)
│   ├── UserDetailPage.jsx                 ← NEW (User profile)
│   ├── RolesPage.jsx                      ← NEW (RBAC)
│   ├── SecurityPage.jsx                   ← NEW (Security dashboard)
│   └── AuditLogsPage.jsx                  ← NEW (Activity log)
│
├── hooks/
│   ├── useAdminUsers.js                   ← NEW
│   ├── useAdminRoles.js                   ← NEW
│   ├── useAdminSecurity.js                ← NEW
│   ├── useAdminAudit.js                   ← NEW
│   └── useAdminMetrics.js                 ← NEW
│
├── services/
│   └── adminService.js                    ← NEW (API client)
│
└── styles/
    └── admin.css                          ← NEW (Custom styles)
```

---

## 🗄️ Database Schema Quick Reference

### New Tables (5 tables)

```sql
-- 1. roles: Role definitions với permissions
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  permissions JSONB,  -- ["users.create", "users.read", ...]
  is_system BOOLEAN
);

-- 2. user_roles: Many-to-many mapping
CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  assigned_by UUID REFERENCES users(id),
  PRIMARY KEY (user_id, role_id)
);

-- 3. blocked_ips: IP blacklist
CREATE TABLE blocked_ips (
  id UUID PRIMARY KEY,
  ip_address INET UNIQUE,
  reason TEXT,
  expires_at TIMESTAMP
);

-- 4. admin_audit_logs: Activity trail
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY,
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100),  -- create_user, delete_user, etc.
  target_type VARCHAR(50),  -- user, role, ip, session
  target_id UUID,
  changes JSONB,  -- { before: {...}, after: {...} }
  created_at TIMESTAMP
);

-- 5. security_alerts: Security warnings
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY,
  type VARCHAR(100),  -- brute_force, suspicious_login
  severity VARCHAR(20),  -- low, medium, high, critical
  message TEXT,
  metadata JSONB
);
```

### Enhanced Users Table

```sql
ALTER TABLE users 
  ADD COLUMN locked_at TIMESTAMP,
  ADD COLUMN lock_reason TEXT,
  ADD COLUMN last_login_at TIMESTAMP;
```

---

## 📡 API Endpoints Quick Reference

### Base: `/api/admin`

#### User Management
- `GET /users` - List users (pagination, filters)
- `POST /users` - Create user
- `GET /users/:id` - User detail
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/:id/reset-password` - Reset password
- `POST /users/:id/lock` - Lock account
- `POST /users/:id/unlock` - Unlock account

#### Role Management
- `GET /roles` - List roles
- `POST /roles` - Create role
- `PUT /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role
- `POST /users/:id/roles` - Assign role
- `DELETE /users/:id/roles/:roleId` - Revoke role

#### Security
- `GET /security/login-attempts` - View attempts
- `POST /security/reset-attempts` - Reset attempts
- `GET /security/blocked-ips` - List blocked IPs
- `POST /security/block-ip` - Block IP
- `DELETE /security/block-ip/:ip` - Unblock IP
- `GET /security/sessions` - Active sessions
- `DELETE /security/sessions/:id` - Force logout

#### Dashboard
- `GET /dashboard/metrics` - Key metrics
- `GET /dashboard/charts` - Chart data

#### Audit
- `GET /audit-logs` - Activity logs (pagination, filters)

**All endpoints require admin role + JWT token**

---

## 🧪 Testing Quick Reference

### Backend Unit Tests
```bash
# Test user controller
npm test adminUserController.test.js

# Test role controller
npm test adminRoleController.test.js

# Test security controller
npm test adminSecurityController.test.js

# Test all với coverage
npm test -- --coverage
```

### API Integration Tests
```bash
# Test all admin endpoints
npm test admin-api.test.js

# Test specific endpoint group
npm test admin-api.test.js -t "user management"
```

### Frontend E2E Tests
```bash
# Test admin dashboard
npx playwright test admin-dashboard.e2e.spec.js

# Test user management
npx playwright test admin-users.e2e.spec.js

# Test security features
npx playwright test admin-security.e2e.spec.js

# Run all admin tests
npx playwright test admin-*.e2e.spec.js

# Debug mode
npx playwright test admin-users.e2e.spec.js --debug
```

---

## 🔒 Security Checklist

### Must Verify Before Production
- [ ] All admin routes protected by `verifyToken` + `requireAdmin`
- [ ] User role verified from database (not JWT)
- [ ] All inputs sanitized (XSS prevention)
- [ ] SQL injection prevented (parameterized queries)
- [ ] All admin actions logged in audit trail
- [ ] Rate limiting applied (100 req/15min)
- [ ] CSRF tokens used for state changes
- [ ] Password never logged
- [ ] Admin cannot delete self
- [ ] Admin cannot revoke own admin role
- [ ] Blocked IPs cannot access
- [ ] Locked users cannot login

---

## 📊 Success Metrics

### Performance Targets (p95)
- Dashboard load: <500ms
- Users list (20 items): <300ms
- User detail: <200ms
- Chart data: <400ms
- Audit logs (50 items): <300ms

### Functional Targets
- 100% admin actions logged
- 100% admins use dashboard (vs manual DB queries)
- >95% security incidents detected
- >4.5/5 admin satisfaction score

---

## 🐛 Common Issues & Solutions

### Issue 1: Migration fails
**Error:** `relation "roles" already exists`

**Solution:**
```bash
# Rollback migration
node scripts/database/rollback-009.js

# Re-run migration
node scripts/database/migrate-009.js
```

### Issue 2: Permission denied on admin routes
**Error:** `403 Forbidden - Insufficient permissions`

**Solution:**
1. Check user has admin role in database:
```sql
SELECT u.email, r.name 
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'admin@kadong.com';
```

2. Verify JWT token contains correct user ID
3. Check session is active in database

### Issue 3: Audit logs not created
**Error:** Actions not appearing in audit logs

**Solution:**
1. Verify audit middleware registered:
```javascript
// In admin routes
router.use(auditLog);
```

2. Check audit table exists:
```sql
SELECT * FROM admin_audit_logs LIMIT 1;
```

3. Check log for errors:
```bash
tail -f backend/logs/app.log | grep audit
```

### Issue 4: Charts not loading
**Error:** Dashboard charts show "No data"

**Solution:**
1. Check API returns data:
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/admin/dashboard/charts?type=user_growth
```

2. Verify date range:
```javascript
// Default to last 30 days if no date provided
const from = req.query.from || new Date(Date.now() - 30*24*60*60*1000);
```

3. Check recharts installed:
```bash
npm list recharts
```

---

## 📚 Documentation Links

### Core Docs
- **Full Spec:** `specs/specs/10_admin_dashboard.spec`
- **Implementation Plan:** `specs/plans/10_admin_dashboard.plan`
- **Overview:** `docs/04-features/ADMIN_DASHBOARD_OVERVIEW.md`
- **THIS FILE:** `specs/specs/10_admin_dashboard_QUICKSTART.md`

### Related Docs
- **Auth System:** `backend/AUTH_IMPLEMENTATION_SUMMARY.md`
- **Database Schema:** `docs/DATABASE_SCHEMA.md`
- **API Reference:** `docs/api/ADMIN_API.md` (to be created)

### User Guides (to be created)
- `docs/admin/ADMIN_DASHBOARD_GUIDE.md` - Admin user guide
- `docs/admin/ROLE_PERMISSION_GUIDE.md` - RBAC guide
- `docs/admin/SECURITY_GUIDE.md` - Security management guide

---

## 🤝 Team Collaboration

### Daily Standup Questions
1. **What did you complete yesterday?**
   - Example: "Created admin user controller với 8 functions"
2. **What are you working on today?**
   - Example: "Implementing role permission matrix UI"
3. **Any blockers?**
   - Example: "Need clarification on permission inheritance logic"

### Code Review Checklist
- [ ] Code follows project conventions
- [ ] All functions have JSDoc comments
- [ ] Error handling implemented
- [ ] Security best practices followed
- [ ] Tests written and passing
- [ ] No console.log left in code
- [ ] Performance optimized (no N+1 queries)

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/admin-dashboard-users

# Commit with meaningful message
git commit -m "feat(admin): implement user management CRUD"

# Push to remote
git push origin feature/admin-dashboard-users

# Create pull request
# Get review from 2+ team members
# Merge after approval
```

---

## 🎓 Learning Resources

### For Admins (End Users)
1. Read: `docs/admin/ADMIN_DASHBOARD_GUIDE.md` (to be created)
2. Watch: Demo video (to be recorded)
3. Practice: Use on staging environment

### For Developers
1. Study: Existing auth system (`backend/AUTH_IMPLEMENTATION_SUMMARY.md`)
2. Read: Spec + Plan (this folder)
3. Reference: Example controllers in `backend/src/api/controllers/`
4. Learn: RBAC patterns (Google: "Role-Based Access Control best practices")

### External Resources
- **RBAC:** https://auth0.com/docs/manage-users/access-control/rbac
- **Audit Logging:** https://www.sumologic.com/glossary/audit-trail/
- **Security Best Practices:** https://owasp.org/www-project-top-ten/
- **PostgreSQL JSONB:** https://www.postgresql.org/docs/current/datatype-json.html

---

## 🔄 Status Updates

### How to Update Status

**After completing a phase:**
```markdown
## Week 1 Progress (2025-11-18)
✅ Database migration created and tested
✅ Admin controllers implemented (user, role, security)
✅ Audit logging middleware working
🚧 Dashboard controller 50% complete

**Blockers:** None
**Next:** Complete dashboard controller, create API routes
```

**Share in:** Team chat, daily standup, project management tool

---

## 📞 Need Help?

### Quick Questions
- **Spec unclear?** Read full spec: `specs/specs/10_admin_dashboard.spec`
- **How to implement X?** Check plan: `specs/plans/10_admin_dashboard.plan`
- **Technical details?** Read overview: `docs/04-features/ADMIN_DASHBOARD_OVERVIEW.md`

### Stuck on Something?
1. Check existing code examples
2. Search similar implementations in codebase
3. Ask team in chat
4. Schedule pairing session

### Contact
- **Tech Lead:** [Name] ([Email])
- **Product Owner:** [Name] ([Email])
- **Team Chat:** #kadong-dev

---

## 🚀 Ready to Start?

### Your First Task
1. ✅ Read this quickstart guide (you're here!)
2. ✅ Read full spec: `specs/specs/10_admin_dashboard.spec`
3. ✅ Read implementation plan: `specs/plans/10_admin_dashboard.plan`
4. ✅ Attend team kickoff meeting
5. ✅ Setup local environment
6. ✅ Checkout feature branch: `git checkout -b feature/admin-dashboard`
7. ✅ Start Week 1, Day 1: Database migration

**Good luck! 🎉**

---

**Maintained By:** KaDong Development Team  
**Version:** 1.0.0  
**Last Updated:** 2025-11-14  
**Next Review:** 2025-11-21
