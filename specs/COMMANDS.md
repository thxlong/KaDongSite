# 🤖 Spec Kit - Copilot Agent Commands

**Version:** 1.0.0  
**Last Updated:** 2025-11-12

---

## 📋 Tổng Quan

File này chứa các câu lệnh prompt chuẩn để Copilot Agent thực thi Spec Kit workflow. Copy và paste các prompt này vào chat để kích hoạt các chức năng tương ứng.

---

## 1️⃣ Command `/specify` - Tạo Specification

### Cú pháp nhanh:
```
/specify {tên_tính_năng}
```

### Ví dụ:
```
/specify user-authentication
/specify shopping-cart
/specify payment-integration
```

### 📝 Prompt đầy đủ:

```
TASK: Tạo specification cho tính năng {tên_tính_năng}
DETAIL:
Bạn là product specification writer. Hãy tạo một specification document hoàn chỉnh theo format Spec Kit.

**Bước 1: Đọc context**
- Đọc template: specs/templates/TEMPLATE_spec.md
- Đọc project manifest: project_manifest.json
- Đọc các spec hiện có trong specs/ để tham khảo format

**Bước 2: Tạo spec file**
- File name: specs/{số_thứ_tự}_{tên_tính_năng}.spec
- Số thứ tự: Tìm spec cuối cùng và +1
- Format: Markdown với cấu trúc từ template

**Bước 3: Điền đầy đủ các sections**

### 📋 Overview
- Spec ID: {số}_{tên}
- Version: 1.0.0
- Status: 📝 Draft
- Title: Tên đầy đủ của tính năng
- Type: Feature | Bug Fix | Enhancement | Refactor
- Priority: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
- Purpose: Mô tả ngắn gọn mục đích
- Problem Statement: Vấn đề cần giải quyết

### 🎯 Goals
- Primary Goal: Mục tiêu chính
- Secondary Goals: Mục tiêu phụ
- Non-Goals: Những gì KHÔNG nằm trong scope

### ✅ Acceptance Criteria
**Must Have (Required):**
- [ ] Tiêu chí 1: Mô tả cụ thể, có thể test được
- [ ] Tiêu chí 2: ...
- [ ] Performance: Response time < 500ms
- [ ] Security: Input validation, SQL injection prevention

**Should Have (Important):**
- [ ] Tiêu chí UX improvement
- [ ] Tiêu chí accessibility

**Nice to Have (Optional):**
- [ ] Enhancement cho tương lai

### 🏗️ Technical Design

**Architecture Overview:**
- Mô tả kiến trúc tổng thể
- Component diagram (nếu cần)

**Database Changes:**
```sql
CREATE TABLE {table_name} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column1 VARCHAR(255) NOT NULL,
  column2 JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_{table}_{column} ON {table}({column});
```

**API Endpoints:**
- GET /api/{resource} - Mô tả
- POST /api/{resource} - Mô tả
- PUT /api/{resource}/:id - Mô tả
- DELETE /api/{resource}/:id - Mô tả

**Frontend Components:**
- Component 1: Mục đích, props
- Component 2: Mục đích, props

### 🔐 Security Considerations
- [ ] Parameterized SQL queries
- [ ] Input validation (whitelist approach)
- [ ] XSS prevention
- [ ] Authentication required
- [ ] Rate limiting

### 📊 Performance Requirements
- API response: < 500ms
- Database query: < 100ms
- Page load: < 2 seconds

### 🧪 Testing Strategy
- Unit tests: Controller functions, utilities
- Integration tests: API endpoints
- E2E tests: User workflows
- Coverage target: 80%

### 📅 Timeline
- Estimated: X weeks
- Start: YYYY-MM-DD
- Target: YYYY-MM-DD

### 🔗 Related
- Parent Spec: {parent_spec_id}
- Related Specs: {related_spec_ids}
- Implementation Plan: plans/{spec_id}.plan

**Output:**
- File specs/{số}_{tên}.spec đã tạo
- Format chuẩn, đầy đủ sections
- Ready để review và approve

LANG: VN
```

---

## 2️⃣ Command `/plan` - Tạo Implementation Plan

### Cú pháp nhanh:
```
/plan {spec_id}
```

### Ví dụ:
```
/plan 01_init
/plan 02_user_auth
/plan 05_gold_prices
```

### 📝 Prompt đầy đủ:

```
TASK: Tạo implementation plan cho spec {spec_id}.spec
DETAIL:
Bạn là technical architect. Hãy tạo một implementation plan chi tiết.

**Bước 1: Đọc context**
- Đọc spec: specs/{spec_id}.spec
- Đọc template: specs/templates/TEMPLATE_plan.md
- Đọc project manifest: project_manifest.json
- Đọc database schema: docs/DATABASE_SCHEMA.md
- Đọc API docs: docs/API_DOCUMENTATION.md

**Bước 2: Tạo plan file**
- File: specs/plans/{spec_id}.plan
- Link về spec tương ứng

**Bước 3: Điền đầy đủ các sections**

### 📋 Overview
- Plan ID: {spec_id}
- Spec: specs/{spec_id}.spec
- Status: 📝 Planning
- Overall Progress: 0%
- Objectives: Từ spec
- Success Criteria: Từ acceptance criteria

### 📅 Timeline
- Estimated Duration: X weeks
- Breakdown by phase
- Key Milestones với dates

### 📦 Phase 1: Environment Setup
**Duration:** 1-2 days  
**Tasks:**
- [ ] Setup development environment
- [ ] Install dependencies
- [ ] Configure environment variables
- [ ] Initialize git branch

### 📦 Phase 2: Database Design
**Duration:** 1-2 days  
**Tasks:**
- [ ] Create ERD diagram
- [ ] Write migration up SQL
- [ ] Write migration down SQL
- [ ] Create seed data
- [ ] Add indexes for performance

**Deliverables:**
```sql
-- File: backend/database/migrations/{number}_up_{feature}.sql
CREATE TABLE {table_name} (
  -- columns here
);

CREATE INDEX idx_{table}_{column} ON {table}({column});
```

### 📦 Phase 3: Backend API
**Duration:** 3-5 days  
**Milestone 3.1: Controllers**
- [ ] Create {controller}Controller.js
- [ ] Implement GET endpoint
- [ ] Implement POST endpoint
- [ ] Implement PUT endpoint
- [ ] Implement DELETE endpoint
- [ ] Add validation
- [ ] Add error handling

**Deliverables:**
```javascript
// backend/controllers/{controller}Controller.js
const getResource = async (req, res) => {
  // Implementation
}
```

**Milestone 3.2: Routes**
- [ ] Create routes/{resource}.js
- [ ] Define all routes
- [ ] Add middleware

**Milestone 3.3: Providers (nếu cần)**
- [ ] Create providers/{provider}.js
- [ ] Implement fetch logic

### 📦 Phase 4: Frontend UI
**Duration:** 3-5 days  
**Milestone 4.1: Page Structure**
- [ ] Create src/pages/{Page}Tool.jsx
- [ ] Setup state management
- [ ] Add routing in App.jsx
- [ ] Add menu item in SidebarMenu.jsx

**Milestone 4.2: Components**
- [ ] Create src/components/{feature}/{Component1}.jsx
- [ ] Create src/components/{feature}/{Component2}.jsx
- [ ] Create index.jsx for exports

**Milestone 4.3: API Integration**
- [ ] Create src/services/{feature}Service.js
- [ ] Implement API calls
- [ ] Add error handling
- [ ] Add loading states

### 📦 Phase 5: Testing
**Duration:** 2-3 days  
- [ ] Unit tests: Controllers
- [ ] Integration tests: API endpoints
- [ ] Frontend tests: Components
- [ ] Manual testing: All workflows
- [ ] Coverage check: >= 80%

### 📦 Phase 6: Documentation
**Duration:** 1-2 days  
- [ ] Update docs/API_DOCUMENTATION.md
- [ ] Update docs/DATABASE_SCHEMA.md
- [ ] Create docs/{FEATURE}.md
- [ ] Update README.md
- [ ] Update CHANGELOG.md

### 📦 Phase 7: Deployment
**Duration:** 1-2 days  
- [ ] Run migrations on production DB
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Smoke test
- [ ] Monitor for 24h

### 📊 Progress Tracking
| Phase | Progress | Status | Est. Days | Actual Days |
|-------|----------|--------|-----------|-------------|
| 1. Setup | 0% | ⏳ | 2 | - |
| 2. Database | 0% | ⏳ | 2 | - |
| 3. Backend | 0% | ⏳ | 5 | - |
| 4. Frontend | 0% | ⏳ | 5 | - |
| 5. Testing | 0% | ⏳ | 3 | - |
| 6. Docs | 0% | ⏳ | 2 | - |
| 7. Deploy | 0% | ⏳ | 2 | - |
| **Total** | **0%** | **⏳** | **21** | **-** |

### 💡 Technical Decisions
**Decision 1: [Title]**
- Context: Why needed
- Options: A vs B vs C
- Chosen: B
- Reasoning: Why B is best
- Trade-offs: What we lose

### 🐛 Issues & Risks
- Risk 1: Description + Mitigation
- Risk 2: Description + Mitigation

### 📝 Best Practices
- Follow project_manifest.json conventions
- Use UUID for IDs
- Parameterized SQL queries
- Soft delete pattern
- API response format chuẩn

**Output:**
- File specs/plans/{spec_id}.plan đã tạo
- Chi tiết 7 phases với tasks cụ thể
- Timeline và progress tracking
- Ready để bắt đầu implement

LANG: VN
```

---

## 3️⃣ Command `/tasks` - Chia nhỏ thành Tasks

### Cú pháp nhanh:
```
/tasks {plan_id} {phase_number}
```

### Ví dụ:
```
/tasks 01_init 3
/tasks 05_gold_prices 4
```

### 📝 Prompt đầy đủ:

```
TASK: Chia nhỏ Phase {phase_number} của plan {plan_id}.plan thành tasks
DETAIL:
Bạn là project manager. Hãy chia nhỏ phase thành các tasks có thể thực thi ngay.

**Bước 1: Đọc context**
- Đọc plan: specs/plans/{plan_id}.plan
- Đọc template: specs/templates/TEMPLATE_task.md
- Focus vào Phase {phase_number}

**Bước 2: Xác định tasks**
Mỗi task phải:
- Độc lập (có thể làm riêng)
- Nhỏ gọn (2-8 giờ)
- Có acceptance criteria rõ ràng
- Có code examples cụ thể

**Bước 3: Tạo task files**
Với mỗi task trong phase, tạo file:
- specs/tasks/{plan_id}_phase{phase}_task{số}.md

**Bước 4: Điền đầy đủ task file**

### 📋 Task Overview
- Task ID: {plan_id}_phase{phase}_task{số}
- Plan: {plan_id}.plan
- Phase: Phase {phase}
- Status: 📝 Todo
- Title: Tên task ngắn gọn
- Priority: Based on plan
- Estimate: X hours
- Assigned To: Developer Name
- Due Date: Calculated from timeline

### 🎯 Objectives
1. Primary: What to build exactly
2. Secondary: Nice to have

### ✅ Acceptance Criteria
- [ ] Specific criterion 1
- [ ] Specific criterion 2
- [ ] Tests pass
- [ ] Docs updated

### 📝 Subtasks

**Backend Changes:**
- [ ] **Subtask 1:** Create migration
  - File: `backend/database/migrations/{number}_up_{name}.sql`
  - CREATE TABLE ...
  - CREATE INDEX ...

- [ ] **Subtask 2:** Create controller
  - File: `backend/controllers/{name}Controller.js`
  - Implement functions
  - Add validation

- [ ] **Subtask 3:** Create route
  - File: `backend/routes/{name}.js`
  - Define routes
  - Add middleware

**Frontend Changes:**
- [ ] **Subtask 4:** Create component
  - File: `src/components/{feature}/{Component}.jsx`
  - Implement UI
  - Add PropTypes

- [ ] **Subtask 5:** Create API service
  - File: `src/services/{name}Service.js`
  - API functions
  - Error handling

**Testing:**
- [ ] **Subtask 6:** Write tests
  - File: `backend/tests/{name}.test.js`
  - Unit tests
  - Integration tests

**Documentation:**
- [ ] **Subtask 7:** Update docs
  - API_DOCUMENTATION.md
  - README.md if needed

### 📂 Files to Create/Modify
**New Files:**
```
backend/database/migrations/{number}_up_{name}.sql
backend/controllers/{name}Controller.js
backend/routes/{name}.js
src/components/{feature}/{Component}.jsx
src/services/{name}Service.js
backend/tests/{name}.test.js
```

**Modified Files:**
```
backend/server.js - Add route
src/App.jsx - Add page route
src/components/SidebarMenu.jsx - Add menu item
```

### 🔧 Implementation Details

**Step 1: Database**
```sql
-- Migration: {number}_up_{feature}.sql
CREATE TABLE {table_name} (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  column1 VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Step 2: Controller**
```javascript
// backend/controllers/{name}Controller.js
const pool = require('../config/database')

const getResource = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM {table} WHERE deleted_at IS NULL ORDER BY created_at DESC'
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

module.exports = { getResource }
```

**Step 3: Frontend Component**
```jsx
// src/components/{feature}/{Component}.jsx
import React, { useState, useEffect } from 'react'

const Component = ({ prop1 }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data
  }, [prop1])

  if (loading) return <div>Loading...</div>

  return <div>{/* UI here */}</div>
}

export default Component
```

### 🧪 Testing Plan
**Unit Tests:**
```javascript
describe('{Controller}', () => {
  it('should return data', async () => {
    // Test implementation
  })
})
```

**Manual Test Cases:**
1. Happy path - verify works
2. Error handling - test failures
3. Edge cases - empty data, long lists

### 🔗 Dependencies
- [ ] Migration must run first
- [ ] Package X installed

### ✅ Checklist Before Done
- [ ] Code follows style guide
- [ ] Tests pass
- [ ] Docs updated
- [ ] Code reviewed
- [ ] No console.log

**Output:**
- 1 hoặc nhiều task files đã tạo trong specs/tasks/
- Mỗi task có đầy đủ subtasks, code examples, testing plan
- Ready để assign và implement

LANG: VN
```

---

## 4️⃣ Command `/implement` - Thực thi Task

### Cú pháp nhanh:
```
/implement {task_id}
```

### Ví dụ:
```
/implement 01_init_phase3_task1
/implement 05_gold_prices_phase4_task2
```

### 📝 Prompt đầy đủ:

```
TASK: Implement task {task_id}
DETAIL:
Bạn là senior full-stack developer. Hãy thực thi task này theo đúng AI developer pipeline.

**🔍 PHASE 1: VALIDATE & UNDERSTAND**

1. **Đọc task file:**
   - File: specs/tasks/{task_id}.md
   - Hiểu rõ objectives
   - Xác định acceptance criteria
   - Review subtasks checklist

2. **Đọc related documents:**
   - Plan: specs/plans/{plan_id}.plan
   - Spec: specs/{spec_id}.spec
   - Manifest: project_manifest.json

3. **Confirm tech stack:**
   - Backend: Express + PostgreSQL
   - Frontend: React + Vite + Tailwind
   - Testing: Jest + Supertest
   - Conventions: UUID, snake_case DB, camelCase JS

4. **List dependencies:**
   - Packages cần install
   - Migrations cần chạy trước
   - Other tasks cần complete trước

---

**📋 PHASE 2: PLAN FILES**

List tất cả files cần tạo/sửa:

**Files to CREATE:**
```
backend/database/migrations/{number}_up_{name}.sql
backend/database/migrations/{number}_down_{name}.sql
backend/controllers/{name}Controller.js
backend/routes/{name}.js
src/pages/{Name}Tool.jsx
src/components/{feature}/{Component}.jsx
src/services/{name}Service.js
backend/tests/{name}.test.js
```

**Files to MODIFY:**
```
backend/server.js (add route)
src/App.jsx (add page route)
src/components/SidebarMenu.jsx (add menu item)
docs/API_DOCUMENTATION.md (add endpoints)
```

---

**💻 PHASE 3: GENERATE CODE**

Tạo code cho từng file. Format:

````languageId
// filepath: backend/controllers/goldController.js
const pool = require('../config/database')

const getLatestGoldPrices = async (req, res) => {
  try {
    const { types, sources, limit = 10 } = req.query
    
    let query = `
      SELECT DISTINCT ON (gold_type, source)
        id, gold_type, source, buy_price, sell_price,
        unit, fetched_at, metadata, created_at
      FROM gold_rates
      WHERE deleted_at IS NULL
    `
    
    const conditions = []
    const params = []
    
    if (types) {
      const typesArray = types.split(',')
      params.push(typesArray)
      conditions.push(`gold_type = ANY($${params.length})`)
    }
    
    if (sources) {
      const sourcesArray = sources.split(',')
      params.push(sourcesArray)
      conditions.push(`source = ANY($${params.length})`)
    }
    
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ')
    }
    
    query += `
      ORDER BY gold_type, source, fetched_at DESC
      LIMIT $${params.length + 1}
    `
    params.push(parseInt(limit))
    
    const result = await pool.query(query, params)
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching gold prices:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gold prices'
    })
  }
}

module.exports = { getLatestGoldPrices }
````

**Lưu ý conventions:**
- ✅ Parameterized queries: `$1, $2, $3`
- ✅ UUID cho IDs: `uuid_generate_v4()`
- ✅ snake_case: Database columns
- ✅ camelCase: JavaScript variables
- ✅ PascalCase: React components
- ✅ Soft delete: `WHERE deleted_at IS NULL`
- ✅ Timestamps: `created_at, updated_at, deleted_at`
- ✅ Error handling: try-catch
- ✅ API format: `{ success, data/error }`

---

**🧪 PHASE 4: WRITE TESTS**

Tạo test files:

````javascript
// filepath: backend/tests/gold.test.js
const request = require('supertest')
const app = require('../server')
const pool = require('../config/database')

describe('Gold API Endpoints', () => {
  describe('GET /api/gold/latest', () => {
    it('should return latest gold prices', async () => {
      const res = await request(app)
        .get('/api/gold/latest')
        .query({ limit: 5 })
      
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toBeInstanceOf(Array)
      expect(res.body.data.length).toBeLessThanOrEqual(5)
    })
    
    it('should filter by gold type', async () => {
      const res = await request(app)
        .get('/api/gold/latest')
        .query({ types: 'SJC_9999,SJC_24K' })
      
      expect(res.status).toBe(200)
      res.body.data.forEach(item => {
        expect(['SJC_9999', 'SJC_24K']).toContain(item.gold_type)
      })
    })
  })
})
````

---

**📚 PHASE 5: UPDATE DOCUMENTATION**

**1. API Documentation (docs/API_DOCUMENTATION.md):**
```markdown
### GET /api/gold/latest
Get latest gold prices with optional filters.

**Query Parameters:**
- `types` (string, optional) - Comma-separated gold types
- `sources` (string, optional) - Comma-separated sources
- `limit` (number, optional, default: 10) - Max results

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "gold_type": "SJC_9999",
      "buy_price": 85500000,
      "sell_price": 86000000,
      "fetched_at": "2025-11-11T10:00:00Z"
    }
  ],
  "count": 10
}
\`\`\`
```

**2. README.md (nếu cần):**
- Thêm feature vào list
- Update screenshots

**3. CHANGELOG.md:**
```markdown
## [1.3.0] - 2025-11-11

### ✨ New Features
- **Gold Prices Tool**: Real-time gold price tracking
  - Latest prices with filters
  - Historical data with charts
  - 7 gold types supported
  - Auto-refresh with cron
```

---

**🔐 PHASE 6: SECURITY CHECK**

Verify:
- [x] No hardcoded secrets (check .env usage)
- [x] Parameterized SQL (no string concatenation)
- [x] Input validation (types, sources, limit)
- [x] XSS prevention (React auto-escapes)
- [x] Error messages don't leak sensitive info
- [x] Rate limiting (nếu cần)

---

**📊 PHASE 7: UPDATE PROGRESS**

1. **Mark subtasks complete:**
   - Update specs/tasks/{task_id}.md
   - Check off completed subtasks

2. **Update plan progress:**
   - Update specs/plans/{plan_id}.plan
   - Increment phase progress percentage

3. **Update feature status:**
   - Update docs/dev-notes/features/{feature}-implementation-status.md
   - Mark phase/tasks complete

4. **Update manifest:**
   - Update project_manifest.json nếu có thay đổi API/DB/dependencies

---

**✅ PHASE 8: VERIFICATION**

Trước khi commit, check:
- [ ] All subtasks completed
- [ ] Code follows conventions
- [ ] Tests pass (`npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] API endpoints work (manual test)
- [ ] UI renders correctly
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented code

---

**🚀 PHASE 9: COMMIT PREPARATION**

Generate commit message (Conventional Commits format):

```
feat(gold): implement gold price API endpoints

Backend:
- Add getLatestGoldPrices controller with filters
- Add getGoldPriceHistory with period aggregation
- Add routes in backend/routes/gold.js
- Add gold endpoints to server.js

Frontend:
- Create GoldPricesTool page with state management
- Create GoldListCard component
- Create goldService for API calls
- Add /gold route in App.jsx

Tests:
- Add gold.test.js with 8 test cases
- Coverage: 85%

Docs:
- Update API_DOCUMENTATION.md with 4 endpoints
- Update CHANGELOG.md v1.3.0

Closes #gold-prices-phase3-task1
```

---

**📦 OUTPUT DELIVERABLES:**

1. ✅ All code files created/modified
2. ✅ Tests written and passing
3. ✅ Documentation updated
4. ✅ Security checked
5. ✅ Progress tracked
6. ✅ Commit message ready
7. ✅ Ready to push

**Next steps:**
1. Review code yourself
2. Run tests: `npm test`
3. Run lint: `npm run lint`
4. Manual test in browser
5. Create commit with generated message
6. Push to branch
7. Create PR if needed

LANG: VN
```

---

## 5️⃣ Command `/review` - Review Spec/Plan/Task

### Cú pháp:
```
/review {file_path}
```

### Ví dụ:
```
/review specs/05_gold_prices.spec
/review specs/plans/02_user_auth.plan
/review specs/tasks/01_init_phase3_task1.md
```

### 📝 Prompt:

```
TASK: Review file {file_path}
DETAIL:
Bạn là technical reviewer. Hãy review file này và đưa ra feedback.

**Review Checklist:**

**For .spec files:**
- [ ] Overview đầy đủ và rõ ràng
- [ ] Goals realistic và measurable
- [ ] Acceptance criteria cụ thể, testable
- [ ] Technical design chi tiết
- [ ] Security considerations đầy đủ
- [ ] Performance requirements defined
- [ ] Testing strategy comprehensive
- [ ] Timeline reasonable

**For .plan files:**
- [ ] Linked đúng spec
- [ ] All 7 phases có
- [ ] Tasks breakdown chi tiết
- [ ] Timeline realistic
- [ ] Technical decisions documented
- [ ] Risks identified
- [ ] Progress tracking setup

**For .task files:**
- [ ] Objectives clear
- [ ] Acceptance criteria testable
- [ ] Subtasks actionable
- [ ] Code examples correct
- [ ] Testing plan adequate
- [ ] Dependencies identified

**Output:**
- ✅ Approved - Ready to proceed
- 🔄 Needs revision - List issues
- ❌ Rejected - Major problems

LANG: VN
```

---

## 6️⃣ Command `/update` - Update Spec Status

### Cú pháp:
```
/update {spec_id}
```

### Ví dụ:
```
/update 01_init
/update 03_wishlist_management
/update 04_api_testing_framework
```

### 📝 Prompt:

```
TASK: Review và update status của spec {spec_id}
DETAIL:
Bạn là technical lead. Hãy review implementation hiện tại và update spec file.

**Bước 1: Thu thập thông tin**
- Đọc spec: specs/{spec_id}.spec
- Check backend: controllers/, routes/, database/migrations/
- Check frontend: src/pages/, src/components/
- Check tests: backend/tests/
- Check docs: docs/

**Bước 2: Đánh giá progress**
- Backend implementation: X% (check controllers/routes exist)
- Frontend implementation: X% (check pages/components exist)
- Database schema: X% (check migrations)
- Testing: X% (check coverage, test files)
- Documentation: X% (check API docs, README)

**Bước 3: Update spec file**
Chỉ update những phần sau (KHÔNG tạo version history mới):

1. **Header:**
   - Last Updated: YYYY-MM-DD (current date)
   - Status: Draft/In Progress/Complete
   - Overall Progress: X%

2. **Acceptance Criteria:**
   - Đánh dấu [x] cho completed items
   - Thêm ✅ và date cho done items
   - Thêm ⏳ cho in progress
   - Thêm ⚠️ cho blocked items

3. **Implementation Status Section (nếu chưa có):**
   Thêm section mới ở cuối trước "Review & Updates":
   ```markdown
   ## 📊 Implementation Status (Added: YYYY-MM-DD)
   
   ### Backend: X% Complete
   - Controllers: List implemented
   - Routes: List implemented
   - Database: Tables created
   
   ### Frontend: X% Complete
   - Pages: List implemented
   - Components: List implemented
   
   ### Testing: X% Coverage
   - Unit tests: X/Y
   - Integration tests: X/Y
   - Coverage: X%
   
   ### Critical Findings:
   - ✅ Completed items
   - ⚠️ Gaps/blockers
   - 🔴 Risks
   ```

4. **Review & Updates Table:**
   - Chỉ có 1 entry với Version 1.0.0
   - Update "Changes" column với latest changes
   - Update date to current
   - Format:
   ```markdown
   | Date | Version | Changes | Updated By |
   |------|---------|---------|------------|
   | YYYY-MM-DD | 1.0.0 | Brief summary of implementation status | Team |
   ```

**QUAN TRỌNG:**
- ❌ KHÔNG tạo version 1.1.0, 1.2.0, etc.
- ❌ KHÔNG tạo nhiều dòng trong Review table
- ✅ CHỈ update existing Version 1.0.0 entry
- ✅ CHỈ update Last Updated date ở header
- ✅ CHỈ thêm checkmarks và status symbols

**Output:**
- Spec file đã update với status mới nhất
- Implementation status section added/updated
- Review table có 1 entry duy nhất
- Ready for next phase

LANG: VN
```

---

## 7️⃣ Command `/status` - Check Progress

### Cú pháp:
```
/status {spec_id}
```

### Ví dụ:
```
/status 01_init
/status 03_wishlist_management
/status 04_api_testing_framework
```

### 📝 Prompt:

```
TASK: Kiểm tra progress của spec {spec_id}
DETAIL:
Hãy tổng hợp progress của spec này.

**Thu thập thông tin:**
1. Đọc spec: specs/{spec_id}.spec
2. Đọc plan: specs/plans/{spec_id}.plan
3. Đọc feature status: docs/dev-notes/features/{feature}-implementation-status.md
4. Đọc tasks: specs/tasks/{spec_id}_*.md

**Tính toán progress:**
- Spec status: Draft/In Progress/Completed
- Plan progress: X%
- Phases completed: Y/7
- Tasks completed: Z/Total

**Output format:**
Tạo comprehensive progress report bao gồm:

1. **Executive Summary:**
   - Spec ID, name, status
   - Overall progress percentage
   - Priority level

2. **Phase Progress Table:**
   | Phase | Name | Progress | Status | Tasks |
   |-------|------|----------|--------|-------|
   | 1 | Setup | 100% | ✅ Complete | 6/6 |
   | 2 | Backend | 60% | 🚧 In Progress | 18/30 |

3. **Acceptance Criteria Status:**
   - Must Have: X/Y completed
   - Should Have: X/Y completed
   - Nice to Have: X/Y completed

4. **Coverage Metrics (nếu có testing):**
   - Code coverage: X%
   - Tests written: X/Y
   - Tests passing: X/Y

5. **Critical Findings:**
   - ✅ Completed features
   - ⚠️ Gaps/blockers
   - 🔴 Risk assessment

6. **Next Steps (Priority Order):**
   - Urgent tasks
   - Important tasks
   - Nice to have tasks

7. **Timeline Status:**
   - Started: Date
   - Current day: X
   - Progress: On Track/Delayed
   - ETA: Date

**Lưu ý:**
- Format output dễ đọc với tables, emoji, sections rõ ràng
- Highlight critical issues bằng ⚠️ hoặc 🔴
- Đưa ra recommendations cụ thể
- Link đến related specs nếu có

LANG: VN
```

---

## 💡 Tips Sử Dụng

### Best Practices:
1. **Tuần tự workflow:** `/specify` → `/plan` → `/tasks` → `/implement`
2. **Review sau mỗi bước:** Dùng `/review` để check quality
3. **Track progress thường xuyên:** Dùng `/status` để monitor
4. **Update khi hoàn thành:** Mark subtasks complete ngay
5. **Document decisions:** Ghi lại technical decisions trong plan

### Common Patterns:

**Pattern 1: New Feature từ đầu**
```
/specify shopping-cart
/review specs/06_shopping_cart.spec
/plan 06_shopping_cart
/review specs/plans/06_shopping_cart.plan
/tasks 06_shopping_cart 1
/implement 06_shopping_cart_phase1_task1
/update 06_shopping_cart
```

**Pattern 2: Continue existing feature**
```
/status 04_api_testing_framework
/tasks 04_api_testing_framework 2
/implement 04_api_testing_framework_phase2_task1
/update 04_api_testing_framework
```

**Pattern 3: Quick check and update**
```
/status 03_wishlist_management
/update 03_wishlist_management
```

**Pattern 4: Critical Gap Response**
```
/status 03_wishlist_management
[Nhận thấy: 0% test coverage - CRITICAL]
/plan 04_api_testing_framework
/tasks 04_api_testing_framework 1
/implement 04_api_testing_framework_phase1_task1
/update 04_api_testing_framework
```

---

## 🔧 Troubleshooting

### Issue: Không tìm thấy file
**Solution:** Check path, số thứ tự spec

### Issue: Template không đầy đủ
**Solution:** Đọc lại TEMPLATE_*.md trong specs/templates/

### Issue: Code không theo conventions
**Solution:** Đọc lại project_manifest.json conventions section

### Issue: Progress không update
**Solution:** Mark subtasks complete trong task file

---

## 📚 Related Documentation

- **Spec Kit README:** `specs/README.md`
- **Templates:** `specs/templates/`
- **Config:** `specs/config.json`
- **Project Manifest:** `project_manifest.json`
- **Dev Notes Guide:** `docs/dev-notes/README.md`

---

**Maintained By:** KaDong Development Team  
**Last Updated:** 2025-11-11  
**Version:** 1.0.0
