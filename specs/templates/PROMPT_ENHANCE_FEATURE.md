# ✨ PROMPT CHUẨN: ENHANCE FEATURE

## 📋 Checklist Tổng Quan
- [ ] Đọc specs hiện tại
- [ ] Phân tích requirement mới
- [ ] Design solution
- [ ] Update specs với enhancement
- [ ] Implement changes
- [ ] Update documentation
- [ ] Viết unit tests
- [ ] Viết integration tests (nếu cần)
- [ ] Run all tests
- [ ] Manual testing trong browser
- [ ] Performance check
- [ ] Update CHANGELOG.md

---

## 🎯 BƯỚC 1: ĐỌC SPECS HIỆN TẠI & HIỂU FEATURE

### Prompt Template:
```
TASK: Phân tích feature hiện tại trước khi enhance

CONTEXT:
- Feature: [TÊN_FEATURE]
- File specs: specs/specs/[TÊN_FILE].spec
- File plan: specs/plans/[TÊN_FILE].plan
- Current implementation: [MÔ_TẢ]

ACTION:
1. Đọc specs để hiểu current state:
   - Core functionality
   - User flows
   - Technical constraints
   - Known limitations

2. Đọc plan để hiểu architecture:
   - Components structure
   - Data flow
   - API contracts
   - Dependencies

3. Review existing code:
   - Component hierarchy
   - State management
   - API endpoints
   - Database schema

OUTPUT:
Current State Summary:
- Features implemented: [LIST]
- User flows: [LIST]
- Technical stack: [LIST]
- Known limitations: [LIST]
- Extension points: [LIST]
```

### Ví dụ thực tế:
```
TASK: Phân tích Gold Prices Tool trước khi enhance

CONTEXT:
- Feature: Gold Prices Tool
- File specs: specs/specs/06_gold_prices_tool.spec
- File plan: specs/plans/06_gold_prices_tool.plan
- Current implementation: Basic gold price display + chart

CURRENT STATE:

Features Implemented:
✅ Phase 1a: Database schema (gold_rates table)
✅ Phase 1b: Gold price fetchers (5 sources)
✅ Phase 1c: API endpoints (/latest, /history, /fetch)
✅ Phase 1d: Frontend components (GoldCard, GoldChart, GoldFilters)
✅ Phase 1e: Historical chart display

User Flows:
1. View latest gold prices → See 7 gold types with buy/sell prices
2. Select gold type → See historical chart
3. Change period (day/week/month/year) → Chart updates
4. Manual refresh → Fetch new prices

Technical Stack:
- Backend: Express + PostgreSQL + node-cron
- Frontend: React + Recharts + Framer Motion
- Data: 5 external sources (SJC, DOJI, PNJ, XAU, etc.)
- Refresh: Auto-fetch every 30 minutes

Known Limitations:
⚠️ No price alerts
⚠️ No comparison between different periods
⚠️ No export data functionality
⚠️ No gold price prediction
⚠️ No notifications for price changes
⚠️ No historical data download

Extension Points:
🔌 Alert system (price threshold)
🔌 Comparison view (vs previous day/week)
🔌 Export (CSV, Excel, PDF)
🔌 Price prediction (ML model)
🔌 Push notifications
🔌 Data analytics dashboard
```

---

## 💡 BƯỚC 2: PHÂN TÍCH REQUIREMENT MỚI

### Prompt Template:
```
TASK: Phân tích enhancement requirement

REQUIREMENT:
[MÔ_TẢ_CHI_TIẾT_ENHANCEMENT]

QUESTIONS TO ANSWER:
1. WHY: Tại sao cần enhancement này?
   - User pain point
   - Business value
   - Priority level

2. WHAT: Enhancement làm gì?
   - Core functionality
   - User-facing changes
   - Data requirements

3. WHO: Ai sẽ dùng?
   - Target users
   - Use cases
   - Frequency of use

4. HOW: Implement như thế nào?
   - Technical approach
   - Integration points
   - Breaking changes?

5. WHEN: Timeline?
   - MVP scope
   - Future iterations
   - Dependencies

OUTPUT:
Enhancement Analysis:
- Problem Statement: [WHY]
- Solution: [WHAT]
- Users: [WHO]
- Implementation: [HOW]
- Scope: [WHEN]
- Success Criteria: [METRICS]
```

### Ví dụ thực tế:
```
TASK: Phân tích enhancement - Price Alert System

REQUIREMENT:
"Thêm tính năng alert khi giá vàng đạt threshold do user đặt"

ANALYSIS:

1. WHY - Tại sao cần?
   - User pain point: Phải manual check giá liên tục
   - Business value: Tăng engagement, giữ chân users
   - Priority: HIGH (top user request)

2. WHAT - Enhancement làm gì?
   Core Functionality:
   - User tạo alert rule: "Notify me when SJC_9999 >= 154M"
   - System check prices mỗi 5 phút
   - Khi đạt threshold → Send notification
   - User xem lịch sử alerts triggered
   
   User-Facing Changes:
   - New "Alerts" tab trong Gold Prices page
   - Alert creation form (type, condition, threshold, channels)
   - Alert list với status (active/triggered/expired)
   - Notification badges
   
   Data Requirements:
   - New table: gold_alerts (rules)
   - New table: gold_alert_logs (history)
   - Notification channels: In-app, Email, Push (future)

3. WHO - Ai sẽ dùng?
   Target Users:
   - Gold investors (daily traders)
   - Gold shop owners (bulk buyers)
   - Individual buyers (wait for good price)
   
   Use Cases:
   - "Alert me when XAU drops below $2600"
   - "Notify when SJC_9999 increases 1% in a day"
   - "Tell me if any gold type has sudden spike"
   
   Frequency:
   - Setup: Once per target price
   - Check: Every 5 minutes (auto)
   - View history: Weekly/monthly

4. HOW - Implement như thế nào?
   Technical Approach:
   - Backend: Alert engine với cron job (5min interval)
   - Database: PostgreSQL tables + indexes
   - Frontend: New AlertsPanel component
   - Notifications: Toast (in-app) + Email (SendGrid)
   
   Integration Points:
   - Hook into existing gold fetch cycle
   - Reuse gold_rates table for price comparison
   - Add notification service (new module)
   
   Breaking Changes:
   ✅ No breaking changes (additive only)
   ✅ Backward compatible

5. WHEN - Timeline?
   MVP Scope (Sprint 1 - 2 weeks):
   - Database schema
   - Alert CRUD API
   - Basic alert engine (cron)
   - Frontend UI (create/list alerts)
   - In-app notifications (toast)
   
   Future Iterations:
   - Phase 2: Email notifications
   - Phase 3: Push notifications (PWA)
   - Phase 4: Advanced conditions (trend, volatility)
   - Phase 5: Alert templates

SUCCESS CRITERIA:
- ✅ User can create alert in < 30 seconds
- ✅ Alert triggers within 5 minutes of threshold hit
- ✅ 90%+ accuracy (no false positives)
- ✅ Zero impact on existing gold price display
- ✅ Support 100+ concurrent alerts
```

---

## 🏗️ BƯỚC 3: DESIGN SOLUTION

### Prompt Template:
```
TASK: Design solution cho enhancement [TÊN]

COMPONENTS:

1. DATABASE SCHEMA:
   ```sql
   -- New tables/columns
   CREATE TABLE [table_name] (
     id SERIAL PRIMARY KEY,
     [columns],
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Indexes
   CREATE INDEX idx_[name] ON [table] ([column]);
   ```

2. API ENDPOINTS:
   ```
   POST   /api/[resource]          - Create
   GET    /api/[resource]          - List
   GET    /api/[resource]/:id      - Get one
   PUT    /api/[resource]/:id      - Update
   DELETE /api/[resource]/:id      - Delete
   ```

3. BACKEND LOGIC:
   - Controllers: [list]
   - Services: [list]
   - Utils: [list]
   - Cron jobs: [list]

4. FRONTEND COMPONENTS:
   ```
   components/
   ├─ [Feature]Panel/
   │  ├─ index.jsx
   │  ├─ [Feature]Form.jsx
   │  ├─ [Feature]List.jsx
   │  └─ [Feature]Item.jsx
   ```

5. STATE MANAGEMENT:
   - Local state: [what]
   - Context: [what]
   - API calls: [when]

6. ERROR HANDLING:
   - Validation errors
   - API errors
   - User feedback

OUTPUT:
Solution Design Document:
- Architecture diagram
- Data flow
- API contracts
- Component hierarchy
- Edge cases handled
```

### Ví dụ thực tế:
```
TASK: Design solution cho Gold Price Alert System

SOLUTION DESIGN:

1. DATABASE SCHEMA:
   ```sql
   -- Alert rules table
   CREATE TABLE gold_alerts (
     id SERIAL PRIMARY KEY,
     user_id INTEGER NOT NULL,
     gold_type VARCHAR(50) NOT NULL,
     condition VARCHAR(10) NOT NULL, -- 'above', 'below', 'change'
     threshold_value DECIMAL(20,2) NOT NULL,
     threshold_unit VARCHAR(10), -- 'absolute', 'percent'
     status VARCHAR(20) DEFAULT 'active', -- 'active', 'triggered', 'expired'
     notification_channels TEXT[], -- ['in-app', 'email']
     expires_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Alert history/logs table
   CREATE TABLE gold_alert_logs (
     id SERIAL PRIMARY KEY,
     alert_id INTEGER REFERENCES gold_alerts(id) ON DELETE CASCADE,
     triggered_at TIMESTAMP DEFAULT NOW(),
     gold_type VARCHAR(50) NOT NULL,
     trigger_price DECIMAL(20,2) NOT NULL,
     threshold_value DECIMAL(20,2) NOT NULL,
     condition VARCHAR(10) NOT NULL,
     notification_sent BOOLEAN DEFAULT false,
     notification_error TEXT
   );
   
   -- Indexes for performance
   CREATE INDEX idx_gold_alerts_user_status 
     ON gold_alerts(user_id, status);
   CREATE INDEX idx_gold_alerts_status_type 
     ON gold_alerts(status, gold_type);
   CREATE INDEX idx_gold_alert_logs_alert_id 
     ON gold_alert_logs(alert_id);
   ```

2. API ENDPOINTS:
   ```
   POST   /api/gold/alerts              - Create new alert
   GET    /api/gold/alerts              - List user's alerts
   GET    /api/gold/alerts/:id          - Get alert details
   PUT    /api/gold/alerts/:id          - Update alert
   DELETE /api/gold/alerts/:id          - Delete alert
   GET    /api/gold/alerts/:id/logs     - Get alert trigger history
   POST   /api/gold/alerts/:id/test     - Test alert (dry run)
   ```

3. BACKEND LOGIC:
   
   Controllers:
   - `goldAlertController.js`:
     - createAlert()
     - getAlerts()
     - getAlert()
     - updateAlert()
     - deleteAlert()
     - getAlertLogs()
     - testAlert()
   
   Services:
   - `alertEngine.js`:
     - checkAlerts() - Main cron job
     - evaluateCondition(alert, currentPrice)
     - triggerAlert(alert, price)
     - sendNotification(alert, log)
   
   - `notificationService.js`:
     - sendInAppNotification(userId, message)
     - sendEmailNotification(email, subject, body)
     - formatAlertMessage(alert, price)
   
   Utils:
   - `alertValidation.js`:
     - validateAlertData(data)
     - validateThreshold(type, value)
   
   Cron Jobs:
   - Every 5 minutes: Check active alerts
   - Every day: Clean up expired alerts
   - Every hour: Send digest notifications

4. FRONTEND COMPONENTS:
   ```
   src/features/gold/
   ├─ alerts/
   │  ├─ index.jsx              (GoldAlertsPanel - main container)
   │  ├─ AlertForm.jsx          (Create/Edit alert form)
   │  ├─ AlertList.jsx          (List of user's alerts)
   │  ├─ AlertItem.jsx          (Single alert card)
   │  ├─ AlertLogs.jsx          (Alert trigger history)
   │  └─ AlertNotification.jsx  (Toast notification)
   ```

5. STATE MANAGEMENT:
   
   Local State (useState):
   - Alert form inputs
   - Modal open/close
   - Loading states
   
   Context (optional):
   - Active alerts count (for badge)
   - Recent notifications
   
   API Calls (useEffect):
   - Fetch alerts on mount
   - Poll for new notifications every 30s
   - Refetch after create/update/delete

6. ERROR HANDLING:
   
   Validation Errors:
   - Threshold must be positive number
   - Gold type must be valid
   - Condition must be: above/below/change
   - At least one notification channel
   
   API Errors:
   - Network errors → Retry with exponential backoff
   - 400 Bad Request → Show validation messages
   - 401 Unauthorized → Redirect to login
   - 500 Server Error → Show generic error + log
   
   User Feedback:
   - Success toast: "Alert created successfully"
   - Error toast: "Failed to create alert. Please try again."
   - Loading spinners during API calls
   - Disabled buttons during submission

ARCHITECTURE DIAGRAM:
```
┌─────────────────────────────────────────────┐
│              FRONTEND                       │
│  ┌─────────────────────────────────────┐   │
│  │  GoldPricesPage                     │   │
│  │  ├─ GoldFilters                     │   │
│  │  ├─ GoldCards                       │   │
│  │  ├─ GoldChart                       │   │
│  │  └─ GoldAlertsPanel ⭐ NEW          │   │
│  │      ├─ AlertForm                   │   │
│  │      ├─ AlertList                   │   │
│  │      └─ AlertNotification           │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────────┐
│              BACKEND                        │
│  ┌─────────────────────────────────────┐   │
│  │  API Endpoints                      │   │
│  │  POST   /api/gold/alerts            │   │
│  │  GET    /api/gold/alerts            │   │
│  │  PUT    /api/gold/alerts/:id        │   │
│  │  DELETE /api/gold/alerts/:id        │   │
│  └─────────────────┬───────────────────┘   │
│                    │                        │
│  ┌─────────────────▼───────────────────┐   │
│  │  goldAlertController                │   │
│  │  - CRUD operations                  │   │
│  └─────────────────┬───────────────────┘   │
│                    │                        │
│  ┌─────────────────▼───────────────────┐   │
│  │  Alert Engine ⭐ NEW                │   │
│  │  - Cron job (every 5 min)          │   │
│  │  - Check active alerts              │   │
│  │  - Evaluate conditions              │   │
│  │  - Trigger notifications            │   │
│  └─────────────────┬───────────────────┘   │
│                    │                        │
│  ┌─────────────────▼───────────────────┐   │
│  │  Notification Service ⭐ NEW        │   │
│  │  - In-app (Socket.io / Polling)     │   │
│  │  - Email (SendGrid)                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────┬───────────────────────────┘
                  │ SQL
┌─────────────────▼───────────────────────────┐
│           POSTGRESQL                        │
│  ┌─────────────────────────────────────┐   │
│  │  gold_rates (existing)              │   │
│  │  gold_alerts ⭐ NEW                 │   │
│  │  gold_alert_logs ⭐ NEW             │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

DATA FLOW:
```
1. User creates alert:
   Frontend Form → POST /api/gold/alerts → DB (gold_alerts)

2. Cron job checks alerts (every 5 min):
   Alert Engine → Query gold_alerts (status=active)
                → Query gold_rates (latest prices)
                → Evaluate conditions
                → If triggered:
                   - Insert gold_alert_logs
                   - Update gold_alerts (status=triggered)
                   - Send notification

3. User receives notification:
   Notification Service → In-app toast (frontend polls)
                        → Email (SendGrid API)

4. User views alert history:
   Frontend → GET /api/gold/alerts/:id/logs → DB (gold_alert_logs)
```

EDGE CASES HANDLED:
✅ Alert với expired timestamp → Auto-skip
✅ Multiple alerts trigger cùng lúc → Batch process
✅ Notification fail → Log error, retry later
✅ Price data missing → Skip check, log warning
✅ User deletes alert → Cascade delete logs
✅ Duplicate alerts → Prevent at API level
✅ Invalid threshold → Validate before save
```

---

## 📝 BƯỚC 4: UPDATE SPECS VỚI ENHANCEMENT

### Prompt Template:
```
TASK: Update specs với enhancement mới

FILES TO UPDATE:

1. specs/specs/[feature].spec:
   - Add new section for enhancement
   - Update user flows
   - Add acceptance criteria
   - Update constraints

2. specs/plans/[feature].plan:
   - Add new phase/task
   - Update implementation timeline
   - Add dependencies
   - Update tech stack

TEMPLATE:

## Enhancement: [TÊN]

### Overview
[MÔ_TẢ_NGẮN_GỌN]

### User Stories
- As a [user type], I want [goal] so that [benefit]
- ...

### Acceptance Criteria
- [ ] User can [action]
- [ ] System should [behavior]
- [ ] Performance: [metric]
- [ ] Error handling: [scenario]

### Implementation Details
- Database: [changes]
- API: [endpoints]
- Frontend: [components]
- Background jobs: [tasks]

### Testing Requirements
- Unit tests: [coverage]
- Integration tests: [scenarios]
- E2E tests: [flows]
- Performance tests: [benchmarks]

OUTPUT: Updated spec files
```

### Ví dụ thực tế:
```
TASK: Update specs với Gold Price Alert enhancement

FILE 1: specs/specs/06_gold_prices_tool.spec

ADDITIONS:

---

## Phase 2: Price Alert System ⭐ NEW

### Overview
Cho phép users tạo alerts khi giá vàng đạt threshold họ đặt. System tự động check mỗi 5 phút và gửi notification khi alert trigger.

### User Stories

**US-06-11**: Alert Creation
- As a gold investor
- I want to create price alerts for specific gold types
- So that I don't have to manually check prices constantly

**US-06-12**: Alert Notifications
- As a gold shop owner
- I want to receive notifications when my alerts trigger
- So that I can make timely buying decisions

**US-06-13**: Alert Management
- As a user
- I want to view, edit, and delete my alerts
- So that I can manage my price monitoring strategy

**US-06-14**: Alert History
- As a trader
- I want to see history of triggered alerts
- So that I can analyze price patterns

### Acceptance Criteria

✅ Alert Creation:
- [ ] User can select gold type from dropdown
- [ ] User can choose condition: Above, Below, % Change
- [ ] User can enter threshold value
- [ ] User can select notification channels (in-app, email)
- [ ] User can set optional expiry date
- [ ] Form validates inputs before submission
- [ ] Alert created appears in alert list immediately

✅ Alert Monitoring:
- [ ] System checks active alerts every 5 minutes
- [ ] Conditions evaluated correctly (above/below/change)
- [ ] Alert triggers within 5 minutes of threshold hit
- [ ] Only active alerts are checked
- [ ] Expired alerts auto-deactivated

✅ Notifications:
- [ ] In-app notification shows immediately (toast)
- [ ] Toast includes: gold type, price, condition
- [ ] Toast auto-dismisses after 5 seconds
- [ ] Email sent to user (if enabled)
- [ ] Email includes alert details + current prices

✅ Alert Management:
- [ ] User sees list of all their alerts
- [ ] Alerts grouped by status (active/triggered/expired)
- [ ] User can edit alert threshold/channels
- [ ] User can delete alert with confirmation
- [ ] User can view trigger history per alert

✅ Performance:
- [ ] Alert check completes in < 10 seconds
- [ ] Supports 1000+ concurrent alerts
- [ ] No impact on existing gold price display
- [ ] Database queries optimized with indexes

✅ Error Handling:
- [ ] Invalid threshold → Show validation error
- [ ] API error → Show retry option
- [ ] Price data unavailable → Skip check, log warning
- [ ] Notification failure → Log error, retry later

### Implementation Details

#### Database Schema
```sql
-- Alerts table
CREATE TABLE gold_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  gold_type VARCHAR(50) NOT NULL,
  condition VARCHAR(10) NOT NULL,
  threshold_value DECIMAL(20,2) NOT NULL,
  threshold_unit VARCHAR(10) DEFAULT 'absolute',
  status VARCHAR(20) DEFAULT 'active',
  notification_channels TEXT[],
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_condition CHECK (condition IN ('above', 'below', 'change')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'triggered', 'expired'))
);

-- Alert logs table
CREATE TABLE gold_alert_logs (
  id SERIAL PRIMARY KEY,
  alert_id INTEGER REFERENCES gold_alerts(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP DEFAULT NOW(),
  gold_type VARCHAR(50) NOT NULL,
  trigger_price DECIMAL(20,2) NOT NULL,
  threshold_value DECIMAL(20,2) NOT NULL,
  condition VARCHAR(10) NOT NULL,
  notification_sent BOOLEAN DEFAULT false,
  notification_error TEXT
);

-- Indexes
CREATE INDEX idx_gold_alerts_user_status ON gold_alerts(user_id, status);
CREATE INDEX idx_gold_alerts_status_type ON gold_alerts(status, gold_type);
CREATE INDEX idx_gold_alert_logs_alert_id ON gold_alert_logs(alert_id);
```

#### API Endpoints
```
POST   /api/gold/alerts              - Create alert
GET    /api/gold/alerts              - List user's alerts
GET    /api/gold/alerts/:id          - Get alert
PUT    /api/gold/alerts/:id          - Update alert
DELETE /api/gold/alerts/:id          - Delete alert
GET    /api/gold/alerts/:id/logs     - Get alert logs
POST   /api/gold/alerts/:id/test     - Test alert (dry run)
```

#### Frontend Components
```
src/features/gold/alerts/
├─ index.jsx              (GoldAlertsPanel)
├─ AlertForm.jsx          (Create/Edit form)
├─ AlertList.jsx          (List of alerts)
├─ AlertItem.jsx          (Alert card)
├─ AlertLogs.jsx          (Trigger history)
└─ AlertNotification.jsx  (Toast component)
```

#### Background Jobs
- **Alert Checker** (every 5 minutes):
  - Query active alerts
  - Fetch latest gold prices
  - Evaluate conditions
  - Trigger notifications
  - Update alert status

- **Cleanup Job** (daily at 2 AM):
  - Deactivate expired alerts
  - Archive old logs (> 90 days)

### Testing Requirements

#### Unit Tests (Target: 25+ tests)
- AlertForm validation (5 tests)
- Alert condition evaluation (8 tests)
- Alert CRUD operations (6 tests)
- Notification formatting (3 tests)
- Edge cases (3 tests)

#### Integration Tests (Target: 15+ tests)
- POST /api/gold/alerts (3 tests)
- GET /api/gold/alerts (2 tests)
- PUT /api/gold/alerts/:id (2 tests)
- DELETE /api/gold/alerts/:id (2 tests)
- Alert engine cron job (4 tests)
- Notification delivery (2 tests)

#### E2E Tests (Target: 5+ scenarios)
- Create alert → Trigger → Receive notification
- Edit alert → Verify updated condition
- Delete alert → Verify no longer triggers
- View alert history → See past triggers
- Multiple alerts → All trigger correctly

---

FILE 2: specs/plans/06_gold_prices_tool.plan

ADDITIONS:

---

## Phase 2: Price Alert System (Sprint 3-4)

### Tasks

#### Task 2a: Database & API Setup (3 days)
**File:** specs/plans/tasks/06_phase2a_task01_alert_api.task

**Deliverables:**
- [ ] Migration: Create gold_alerts table
- [ ] Migration: Create gold_alert_logs table
- [ ] Migration: Add indexes
- [ ] Controller: goldAlertController.js
- [ ] Routes: /api/gold/alerts/*
- [ ] Validation: alertValidation.js
- [ ] Tests: 10+ API tests

**Acceptance:**
- All CRUD endpoints working
- Validation working correctly
- Tests passing

#### Task 2b: Alert Engine (4 days)
**File:** specs/plans/tasks/06_phase2b_task01_alert_engine.task

**Deliverables:**
- [ ] Service: alertEngine.js
- [ ] Cron job: Check alerts every 5 min
- [ ] Service: evaluateCondition()
- [ ] Service: triggerAlert()
- [ ] Cleanup job: Daily at 2 AM
- [ ] Tests: 15+ engine tests

**Acceptance:**
- Alerts checked every 5 minutes
- Conditions evaluated correctly
- Status updated on trigger
- Logs created

#### Task 2c: Notification System (3 days)
**File:** specs/plans/tasks/06_phase2c_task01_notifications.task

**Deliverables:**
- [ ] Service: notificationService.js
- [ ] In-app: Toast notifications
- [ ] Email: SendGrid integration
- [ ] Templates: Email HTML/text
- [ ] Error handling: Retry logic
- [ ] Tests: 8+ notification tests

**Acceptance:**
- Toast shows on trigger
- Email sends successfully
- Retry on failure
- Error logging

#### Task 2d: Frontend UI (5 days)
**File:** specs/plans/tasks/06_phase2d_task01_alert_ui.task

**Deliverables:**
- [ ] Component: GoldAlertsPanel
- [ ] Component: AlertForm
- [ ] Component: AlertList
- [ ] Component: AlertItem
- [ ] Component: AlertLogs
- [ ] Component: AlertNotification
- [ ] Tests: 20+ component tests

**Acceptance:**
- UI matches design mockups
- Form validation working
- Real-time updates
- Responsive design

#### Task 2e: Integration & Testing (2 days)
**File:** specs/plans/tasks/06_phase2e_task01_integration.task

**Deliverables:**
- [ ] E2E tests: 5+ scenarios
- [ ] Performance tests: Load testing
- [ ] Documentation: API docs
- [ ] Documentation: User guide
- [ ] Bug fixes from testing

**Acceptance:**
- All tests passing
- Performance benchmarks met
- Docs complete

### Dependencies
- Phase 1 must be complete
- SendGrid account setup
- User authentication (if not done)

### Timeline
- Total: 17 days (~3.5 weeks)
- Start: After Phase 1 completion
- End: Sprint 4

### Success Metrics
- ✅ Users create 100+ alerts in first week
- ✅ Alert accuracy: 95%+
- ✅ Notification delivery: 99%+
- ✅ No performance degradation
- ✅ User satisfaction: 4.5/5 stars
```

---

## 💻 BƯỚC 5: IMPLEMENT CHANGES

### Prompt Template:
```
TASK: Implement enhancement [TÊN]

IMPLEMENTATION ORDER:
1. Backend first (database → API → logic)
2. Frontend components
3. Integration
4. Polish & refinement

PRINCIPLES:
- Incremental development
- Test as you go
- Commit frequently
- Code review ready

ACTION:

Phase 1: Backend Database
□ Create migration files
□ Run migrations
□ Verify schema in DB
□ Test with sample data

Phase 2: Backend API
□ Create controllers
□ Create routes
□ Add validation
□ Test with Postman/curl

Phase 3: Backend Logic
□ Implement services
□ Add cron jobs
□ Add error handling
□ Add logging

Phase 4: Frontend Components
□ Create component files
□ Build UI step by step
□ Add state management
□ Connect to API

Phase 5: Integration
□ Test frontend → backend
□ Test cron jobs
□ Test notifications
□ Fix integration bugs

OUTPUT:
Implementation checklist with status
```

### Ví dụ thực tế:
```
TASK: Implement Gold Price Alert System

PHASE 1: Backend Database ✅ COMPLETE

1. Create migration:
   ```bash
   $ cd backend
   $ npx knex migrate:make create_gold_alerts
   $ npx knex migrate:make create_gold_alert_logs
   ```

2. Write migrations:
   File: backend/migrations/20251113_create_gold_alerts.js
   - Create gold_alerts table
   - Add constraints
   - Add indexes

3. Run migrations:
   ```bash
   $ npx knex migrate:latest
   → Batch 3 run: 2 migrations
   ✅ 20251113_create_gold_alerts.js
   ✅ 20251113_create_gold_alert_logs.js
   ```

4. Verify:
   ```sql
   \d gold_alerts
   \d gold_alert_logs
   SELECT * FROM gold_alerts LIMIT 1;
   ```

PHASE 2: Backend API ✅ COMPLETE

1. Create controller:
   File: backend/controllers/goldAlertController.js
   ```javascript
   exports.createAlert = async (req, res) => { /* ... */ }
   exports.getAlerts = async (req, res) => { /* ... */ }
   exports.getAlert = async (req, res) => { /* ... */ }
   exports.updateAlert = async (req, res) => { /* ... */ }
   exports.deleteAlert = async (req, res) => { /* ... */ }
   exports.getAlertLogs = async (req, res) => { /* ... */ }
   ```

2. Create routes:
   File: backend/routes/goldAlertRoutes.js
   ```javascript
   router.post('/alerts', createAlert)
   router.get('/alerts', getAlerts)
   router.get('/alerts/:id', getAlert)
   router.put('/alerts/:id', updateAlert)
   router.delete('/alerts/:id', deleteAlert)
   router.get('/alerts/:id/logs', getAlertLogs)
   ```

3. Add validation:
   File: backend/utils/alertValidation.js
   ```javascript
   const validateAlertData = (data) => {
     if (!data.gold_type) throw new Error('Gold type required')
     if (!['above', 'below', 'change'].includes(data.condition)) {
       throw new Error('Invalid condition')
     }
     if (data.threshold_value <= 0) {
       throw new Error('Threshold must be positive')
     }
     // ...
   }
   ```

4. Test API:
   ```bash
   # Create alert
   $ curl -X POST http://localhost:5000/api/gold/alerts \
     -H "Content-Type: application/json" \
     -d '{"gold_type":"SJC_9999","condition":"above","threshold_value":154000000}'
   → {"success":true,"data":{"id":1,...}}
   
   # Get alerts
   $ curl http://localhost:5000/api/gold/alerts
   → {"success":true,"data":[{...}],"count":1}
   ```

PHASE 3: Backend Logic ✅ COMPLETE

1. Create alert engine:
   File: backend/services/alertEngine.js
   ```javascript
   const checkAlerts = async () => {
     const activeAlerts = await getActiveAlerts()
     const latestPrices = await getLatestGoldPrices()
     
     for (const alert of activeAlerts) {
       const price = latestPrices[alert.gold_type]
       const triggered = evaluateCondition(alert, price)
       
       if (triggered) {
         await triggerAlert(alert, price)
       }
     }
   }
   
   const evaluateCondition = (alert, currentPrice) => {
     switch (alert.condition) {
       case 'above':
         return currentPrice >= alert.threshold_value
       case 'below':
         return currentPrice <= alert.threshold_value
       case 'change':
         // Calculate % change from 24h ago
         const change = calculateChange(alert.gold_type)
         return Math.abs(change) >= alert.threshold_value
     }
   }
   
   const triggerAlert = async (alert, price) => {
     // Create log
     await createAlertLog(alert, price)
     
     // Update alert status
     await updateAlertStatus(alert.id, 'triggered')
     
     // Send notification
     await sendNotification(alert, price)
   }
   ```

2. Setup cron job:
   File: backend/src/server.js
   ```javascript
   const cron = require('node-cron')
   const { checkAlerts } = require('./services/alertEngine')
   
   // Check alerts every 5 minutes
   cron.schedule('*/5 * * * *', async () => {
     console.log('[Cron] Checking gold price alerts...')
     try {
       await checkAlerts()
     } catch (error) {
       console.error('[Cron] Alert check failed:', error)
     }
   })
   ```

3. Create notification service:
   File: backend/services/notificationService.js
   ```javascript
   const sendNotification = async (alert, price) => {
     const channels = alert.notification_channels
     
     if (channels.includes('in-app')) {
       await sendInAppNotification(alert.user_id, {
         title: 'Price Alert Triggered',
         message: formatAlertMessage(alert, price),
         type: 'alert'
       })
     }
     
     if (channels.includes('email')) {
       await sendEmailNotification(alert.user_email, {
         subject: `Gold Price Alert: ${alert.gold_type}`,
         html: formatEmailTemplate(alert, price)
       })
     }
   }
   ```

PHASE 4: Frontend Components ✅ COMPLETE

1. Create component structure:
   ```bash
   $ cd frontend/src/features/gold
   $ mkdir alerts
   $ cd alerts
   $ touch index.jsx AlertForm.jsx AlertList.jsx AlertItem.jsx AlertLogs.jsx
   ```

2. Build GoldAlertsPanel:
   File: frontend/src/features/gold/alerts/index.jsx
   ```javascript
   export const GoldAlertsPanel = () => {
     const [alerts, setAlerts] = useState([])
     const [loading, setLoading] = useState(true)
     const [showForm, setShowForm] = useState(false)
     
     useEffect(() => {
       fetchAlerts()
     }, [])
     
     const fetchAlerts = async () => {
       const response = await fetch('/api/gold/alerts')
       const data = await response.json()
       setAlerts(data.data)
       setLoading(false)
     }
     
     return (
       <div className="bg-white rounded-xl shadow-sm p-6">
         <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold">Price Alerts</h2>
           <button onClick={() => setShowForm(true)}>
             + New Alert
           </button>
         </div>
         
         {showForm && (
           <AlertForm 
             onSubmit={handleCreateAlert}
             onCancel={() => setShowForm(false)}
           />
         )}
         
         <AlertList 
           alerts={alerts}
           onEdit={handleEdit}
           onDelete={handleDelete}
         />
       </div>
     )
   }
   ```

3. Build AlertForm:
   File: frontend/src/features/gold/alerts/AlertForm.jsx
   ```javascript
   export const AlertForm = ({ onSubmit, onCancel, initialData }) => {
     const [formData, setFormData] = useState({
       gold_type: initialData?.gold_type || 'SJC_9999',
       condition: initialData?.condition || 'above',
       threshold_value: initialData?.threshold_value || '',
       notification_channels: initialData?.notification_channels || ['in-app']
     })
     
     const handleSubmit = async (e) => {
       e.preventDefault()
       
       // Validation
       if (!formData.threshold_value || formData.threshold_value <= 0) {
         toast.error('Please enter valid threshold')
         return
       }
       
       // Submit
       try {
         await onSubmit(formData)
         toast.success('Alert created successfully')
       } catch (error) {
         toast.error('Failed to create alert')
       }
     }
     
     return (
       <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded">
         <div className="grid grid-cols-2 gap-4">
           <select 
             value={formData.gold_type}
             onChange={(e) => setFormData({...formData, gold_type: e.target.value})}
           >
             <option value="SJC_9999">SJC 9999</option>
             <option value="DOJI_24K">DOJI 24K</option>
             {/* ... */}
           </select>
           
           <select
             value={formData.condition}
             onChange={(e) => setFormData({...formData, condition: e.target.value})}
           >
             <option value="above">Above</option>
             <option value="below">Below</option>
             <option value="change">% Change</option>
           </select>
           
           <input
             type="number"
             placeholder="Threshold value"
             value={formData.threshold_value}
             onChange={(e) => setFormData({...formData, threshold_value: e.target.value})}
           />
           
           <div>
             <label>
               <input type="checkbox" value="in-app" checked />
               In-app notification
             </label>
             <label>
               <input type="checkbox" value="email" />
               Email notification
             </label>
           </div>
         </div>
         
         <div className="flex gap-2 mt-4">
           <button type="submit" className="btn-primary">
             Create Alert
           </button>
           <button type="button" onClick={onCancel} className="btn-secondary">
             Cancel
           </button>
         </div>
       </form>
     )
   }
   ```

4. Build AlertList & AlertItem:
   Similar structure with mapping over alerts array...

PHASE 5: Integration ✅ COMPLETE

1. Connect frontend to backend:
   - API calls working
   - Data flowing correctly
   - Error handling in place

2. Test cron job:
   ```bash
   # Manually trigger
   $ node -e "require('./services/alertEngine').checkAlerts()"
   → [AlertEngine] Checking 3 active alerts...
   → [AlertEngine] Alert #1 triggered: SJC_9999 >= 154M
   → [Notification] Sent in-app notification to user #5
   ```

3. Test end-to-end:
   - Create alert in UI
   - Wait for price to hit threshold
   - Receive notification
   - View alert history

4. Fix bugs:
   - ✅ Form validation not working → Fixed
   - ✅ Notification not showing → Added toast library
   - ✅ Cron job not running → Fixed cron syntax

IMPLEMENTATION COMPLETE! 🎉

FILES CREATED/MODIFIED:
Backend:
- migrations/20251113_create_gold_alerts.js (NEW)
- migrations/20251113_create_gold_alert_logs.js (NEW)
- controllers/goldAlertController.js (NEW)
- routes/goldAlertRoutes.js (NEW)
- services/alertEngine.js (NEW)
- services/notificationService.js (NEW)
- utils/alertValidation.js (NEW)
- server.js (MODIFIED - added cron)

Frontend:
- features/gold/alerts/index.jsx (NEW)
- features/gold/alerts/AlertForm.jsx (NEW)
- features/gold/alerts/AlertList.jsx (NEW)
- features/gold/alerts/AlertItem.jsx (NEW)
- features/gold/alerts/AlertLogs.jsx (NEW)
- features/gold/GoldPricesPage.jsx (MODIFIED - added AlertsPanel)

Total: 13 new files, 2 modified
```

---

## 📚 BƯỚC 6-10: (Tương tự như FIX BUG)

- Bước 6: Update Documentation
- Bước 7: Viết Unit Tests
- Bước 8: Viết Integration Tests
- Bước 9: Run All Tests
- Bước 10: Manual Testing
- Bước 11: Performance Testing ⭐ (NEW for enhancements)
- Bước 12: Update CHANGELOG & Commit

*(Chi tiết các bước này tương tự template FIX BUG, điều chỉnh cho enhancement context)*

---

## ⚡ BƯỚC 11: PERFORMANCE TESTING (FOR ENHANCEMENTS)

### Prompt Template:
```
TASK: Performance testing cho enhancement [TÊN]

METRICS TO MEASURE:
1. Response Time
   - API endpoints
   - Page load
   - User interactions

2. Throughput
   - Requests per second
   - Concurrent users
   - Data processing rate

3. Resource Usage
   - CPU %
   - Memory MB
   - Database connections
   - Network I/O

4. Scalability
   - Load testing (100, 1000, 10000 users)
   - Stress testing (find breaking point)
   - Soak testing (24h stability)

TOOLS:
- Artillery / k6 / JMeter for load testing
- Chrome DevTools for frontend
- PostgreSQL EXPLAIN for query optimization
- pm2 / New Relic for monitoring

ACTION:
1. Baseline measurement (before enhancement)
2. Load testing (after enhancement)
3. Compare results
4. Optimize bottlenecks
5. Re-test

OUTPUT:
Performance Report:
- Baseline: [metrics]
- After enhancement: [metrics]
- Impact: [% change]
- Bottlenecks found: [list]
- Optimizations applied: [list]
- Final results: [metrics]
```

### Ví dụ thực tế:
```
TASK: Performance testing cho Gold Alert System

BASELINE (Before Alert System):
- GET /api/gold/latest: 45ms avg
- GET /api/gold/history: 291ms avg
- Page load time: 917ms
- Database connections: 5-10 active
- Memory usage: 150MB

LOAD TEST SCENARIO:
```yaml
# artillery-load-test.yml
config:
  target: "http://localhost:5000"
  phases:
    - duration: 60
      arrivalRate: 10  # 10 users/sec
    - duration: 120
      arrivalRate: 50  # 50 users/sec
    - duration: 60
      arrivalRate: 100 # 100 users/sec

scenarios:
  - name: "Gold Alerts Workflow"
    flow:
      - post:
          url: "/api/gold/alerts"
          json:
            gold_type: "SJC_9999"
            condition: "above"
            threshold_value: 154000000
      - get:
          url: "/api/gold/alerts"
      - think: 5
      - get:
          url: "/api/gold/latest"
```

RUN TESTS:
```bash
$ artillery run artillery-load-test.yml

Results:
────────────────────────────────────
Scenario duration:       240s
Total requests:          12,000
Successful requests:     11,987 (99.9%)
Failed requests:         13 (0.1%)
RPS:                     50
Latency p50:             85ms
Latency p95:             320ms
Latency p99:             580ms
```

BOTTLENECKS FOUND:
1. ❌ POST /api/gold/alerts slow (250ms avg)
   - Root cause: Missing index on user_id
   - Fix: CREATE INDEX idx_gold_alerts_user ON gold_alerts(user_id)
   - Result: 250ms → 45ms ✅

2. ❌ Alert engine cron job takes 15 seconds
   - Root cause: N+1 query problem
   - Fix: Batch query all prices at once
   - Result: 15s → 2s ✅

3. ❌ GET /api/gold/alerts slow with many alerts
   - Root cause: No pagination
   - Fix: Add LIMIT/OFFSET + total count
   - Result: Always < 100ms ✅

OPTIMIZATIONS APPLIED:
```sql
-- Add missing indexes
CREATE INDEX idx_gold_alerts_user ON gold_alerts(user_id);
CREATE INDEX idx_gold_alerts_status_type ON gold_alerts(status, gold_type);

-- Optimize alert engine query
-- Before: Loop + individual queries
-- After: Single batch query
SELECT a.*, r.mid_price
FROM gold_alerts a
LEFT JOIN LATERAL (
  SELECT mid_price
  FROM gold_rates
  WHERE type = a.gold_type
  ORDER BY fetched_at DESC
  LIMIT 1
) r ON true
WHERE a.status = 'active';
```

RE-TEST AFTER OPTIMIZATION:
```bash
$ artillery run artillery-load-test.yml

Results (AFTER OPTIMIZATION):
────────────────────────────────────
Scenario duration:       240s
Total requests:          12,000
Successful requests:     12,000 (100%)  ✅ +0.1%
Failed requests:         0 (0%)         ✅ -0.1%
RPS:                     50
Latency p50:             42ms           ✅ -43ms
Latency p95:             180ms          ✅ -140ms
Latency p99:             280ms          ✅ -300ms
```

FINAL PERFORMANCE REPORT:

API Endpoints:
- POST /api/gold/alerts: 250ms → 45ms (-82%) ✅
- GET /api/gold/alerts: 320ms → 85ms (-73%) ✅
- GET /api/gold/latest: 45ms → 48ms (+7%) ✅ (acceptable)
- GET /api/gold/history: 291ms → 295ms (+1%) ✅ (no impact)

Background Jobs:
- Alert engine (5 min cron): 15s → 2s (-87%) ✅
- Cleanup job (daily): 5s → 5s (no change) ✅

Resource Usage:
- Memory: 150MB → 180MB (+20%) ✅ (acceptable)
- CPU: 10% → 15% (+50%) ⚠️ (monitor during cron)
- DB connections: 5-10 → 8-12 (+20%) ✅
- Disk I/O: Minimal increase ✅

Scalability:
- ✅ 100 concurrent users: No issues
- ✅ 1,000 concurrent users: p99 < 500ms
- ✅ 10,000 concurrent users: Need caching + load balancer
- ✅ Soak test 24h: Stable, no memory leaks

CONCLUSION:
✅ Performance impact minimal
✅ All latencies within acceptable range
✅ Optimization successful
✅ Ready for production
```

---

## 📋 QUICK REFERENCE CHECKLIST

```
ENHANCE FEATURE WORKFLOW CHECKLIST:

□ Step 1: Đọc Specs Hiện Tại
  □ Current features
  □ User flows
  □ Tech stack
  □ Limitations

□ Step 2: Phân Tích Requirement Mới
  □ WHY (problem statement)
  □ WHAT (solution)
  □ WHO (users)
  □ HOW (implementation)
  □ WHEN (scope & timeline)

□ Step 3: Design Solution
  □ Database schema
  □ API endpoints
  □ Backend logic
  □ Frontend components
  □ State management
  □ Error handling

□ Step 4: Update Specs
  □ specs/specs/[feature].spec
  □ specs/plans/[feature].plan
  □ User stories
  □ Acceptance criteria

□ Step 5: Implement Changes
  □ Backend database
  □ Backend API
  □ Backend logic
  □ Frontend components
  □ Integration

□ Step 6: Update Documentation
  □ CHANGELOG.md
  □ Code comments
  □ API docs
  □ User guide

□ Step 7: Unit Tests
  □ Component tests
  □ Logic tests
  □ Coverage >= 80%

□ Step 8: Integration Tests
  □ API tests
  □ Data flow tests
  □ E2E scenarios

□ Step 9: Run All Tests
  □ Unit tests pass
  □ Integration tests pass
  □ No regression

□ Step 10: Manual Testing
  □ Happy path
  □ Edge cases
  □ Cross-browser
  □ Responsive

□ Step 11: Performance Testing ⭐
  □ Load testing
  □ Identify bottlenecks
  □ Optimize
  □ Re-test

□ Step 12: Finalize
  □ Update CHANGELOG
  □ Git commit
  □ Create PR
  □ Request review

DONE! ✅
```

---

## 🎓 BEST PRACTICES FOR ENHANCEMENTS

### 1. Backward Compatibility
```javascript
// ❌ BAD: Breaking change
// Remove old field without migration
DELETE FROM users WHERE last_login_at IS NULL;

// ✅ GOOD: Additive changes
// Add new field, keep old one for compatibility
ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP;
-- Migrate data gradually
UPDATE users SET last_active_at = last_login_at WHERE last_active_at IS NULL;
```

### 2. Feature Flags
```javascript
// ✅ GOOD: Use feature flags for gradual rollout
const FEATURES = {
  GOLD_ALERTS: process.env.FEATURE_GOLD_ALERTS === 'true'
}

if (FEATURES.GOLD_ALERTS) {
  // Show alerts panel
} else {
  // Hide alerts panel
}
```

### 3. Database Migrations
```javascript
// ✅ GOOD: Reversible migrations
exports.up = async (knex) => {
  await knex.schema.createTable('gold_alerts', (table) => {
    table.increments('id')
    // ...
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable('gold_alerts')
}
```

### 4. API Versioning
```javascript
// ✅ GOOD: Version API endpoints
router.post('/v2/gold/alerts', createAlert)  // New version
router.post('/v1/gold/alerts', deprecatedCreateAlert)  // Keep old version
```

### 5. Gradual Rollout
```
Phase 1: Beta testing (10% users)
Phase 2: Limited rollout (50% users)
Phase 3: Full rollout (100% users)
```

---

## ⏱️ ESTIMATED TIME

```
Enhancement Process Timeline:
├─ Step 1: Đọc Specs            → 30-60 min
├─ Step 2: Phân Tích Requirement → 60-120 min
├─ Step 3: Design Solution       → 120-180 min
├─ Step 4: Update Specs          → 60-90 min
├─ Step 5: Implement Changes     → 3-7 days
├─ Step 6: Update Docs           → 60-120 min
├─ Step 7: Unit Tests            → 2-4 hours
├─ Step 8: Integration Tests     → 2-3 hours
├─ Step 9: Run All Tests         → 30-60 min
├─ Step 10: Manual Testing       → 1-2 hours
├─ Step 11: Performance Testing  → 2-4 hours
└─ Step 12: Finalize             → 30-60 min

TOTAL: 
- Small enhancement: 3-5 days
- Medium enhancement: 1-2 weeks
- Large enhancement: 2-4 weeks
```

---

**VERSION:** 1.0.0
**CREATED:** 2025-11-13
**AUTHOR:** KaDongSite Team
**STATUS:** ✅ Production Ready
