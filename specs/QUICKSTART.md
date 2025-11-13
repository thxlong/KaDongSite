# ⚡ Spec Kit - Quick Start Guide

**Version:** 1.0.0  
**Last Updated:** 2025-11-13

---

## 🎯 Spec Kit là gì?

**Spec Kit** giúp bạn quản lý development workflow một cách có hệ thống:

```
💡 Idea → 📝 Spec (WHAT) → 📋 Plan (HOW) → ✅ Tasks (DO) → 🚀 Implementation
```

---

## 📁 Cấu Trúc Folder

```
specs/
├── specs/          # 📝 Specifications - Định nghĩa WHAT cần build
├── plans/          # 📋 Plans - Lập kế hoạch HOW để build
│   └── tasks/      # ✅ Tasks - Chi tiết ACTION cần làm
└── templates/      # 📄 Templates - Mẫu chuẩn để tạo docs
```

### Ví dụ thực tế:

```
specs/specs/06_gold_prices_tool.spec         ← Spec: Công cụ xem giá vàng làm gì?
specs/plans/06_gold_prices_tool.plan         ← Plan: Làm như thế nào?
specs/plans/tasks/06_phase1e_task01_unit_tests.task  ← Task: Viết unit tests
```

---

## 🚀 4 Bước Cơ Bản

### **1️⃣ Tạo Spec** (Định nghĩa tính năng)

**Khi nào:** Có ý tưởng feature mới

**Làm gì:**
```
Tạo file: specs/specs/{số}_{tên}.spec
Template: specs/templates/TEMPLATE_spec.md
```

**Nội dung chính:**
- Mục tiêu là gì? (Goals)
- Tiêu chí thành công? (Acceptance Criteria)
- Thiết kế kỹ thuật? (Technical Design)
- Security và Performance?

**Ví dụ:** `specs/specs/06_gold_prices_tool.spec`

---

### **2️⃣ Tạo Plan** (Lập kế hoạch thực hiện)

**Khi nào:** Spec đã approve, bắt đầu plan implementation

**Làm gì:**
```
Tạo file: specs/plans/{số}_{tên}.plan
Template: specs/templates/TEMPLATE_plan.md
```

**Nội dung chính:**
- Chia thành phases (Setup → Database → Backend → Frontend → Testing → Docs → Deploy)
- Timeline cho từng phase
- Tasks breakdown
- Progress tracking

**Ví dụ:** `specs/plans/06_gold_prices_tool.plan`

---

### **3️⃣ Tạo Tasks** (Chi tiết công việc)

**Khi nào:** Phase phức tạp, cần chia nhỏ hơn

**Làm gì:**
```
Tạo file: specs/plans/tasks/{plan_id}_phase{X}_task{Y}.task
Template: specs/templates/TEMPLATE_task.md
```

**Nội dung chính:**
- Subtasks với checklist
- Code examples cụ thể
- Testing plan
- Files cần tạo/sửa

**Ví dụ:** `specs/plans/tasks/06_phase1e_task01_unit_tests.task`

---

### **4️⃣ Implement** (Thực hiện)

**Làm gì:**
1. ✅ Mở task file
2. ✅ Đọc subtasks
3. ✅ Code theo implementation details
4. ✅ Chạy tests
5. ✅ Update progress (đánh dấu checkboxes)
6. ✅ Commit code

---

## 📊 Workflow Hoàn Chỉnh

### Ví dụ: Feature "Gold Prices Tool"

**Bước 1: Tạo Spec**
```
File: specs/specs/06_gold_prices_tool.spec
Nội dung:
- Mục tiêu: Hiển thị giá vàng real-time từ nhiều nguồn
- Acceptance Criteria: 
  ✅ Hiển thị 7 loại vàng
  ✅ API fetch từ VNAppMob, GoldPrice.org
  ✅ Chart với Recharts
  ✅ Auto-refresh mỗi 5 phút
- Technical Design: Provider pattern, PostgreSQL, React
```

**Bước 2: Tạo Plan**
```
File: specs/plans/06_gold_prices_tool.plan
Phases:
- Phase 1A: Database (2 days) - gold_rates table, indexes
- Phase 1B: Providers (3 days) - realProvider, mockProvider
- Phase 1C: Backend API (3 days) - 4 endpoints
- Phase 1D: Frontend UI (4 days) - 5 components
- Phase 1E: Testing (3 days) - Unit + E2E tests
- Phase 2A: Auto-fetch (2 days) - Cron job
- Phase 2B: Alerts (3 days) - Price alerts
```

**Bước 3: Tạo Tasks**
```
File: specs/plans/tasks/06_phase1e_task01_unit_tests.task
Subtasks:
- [ ] Setup Vitest
- [ ] Write mockProvider tests
- [ ] Write realProvider tests
- [ ] Write registry tests
- [ ] Create test fixtures
- [ ] Run tests and verify 80% coverage
```

**Bước 4: Implement**
```bash
# Làm theo task file
1. npm install vitest @vitest/coverage-v8
2. Tạo vitest.config.js
3. Tạo tests/providers/mockProvider.test.js
4. npm run test:unit
5. Đánh dấu subtasks complete
6. git commit -m "test: add unit tests for gold providers"
```

---

## 📚 Naming Conventions

### Specs
```
Format: {số}_{tên_feature}.spec
Ví dụ:
- 01_init.spec
- 06_gold_prices_tool.spec
- 07_wedding_invitation_url_encoder.spec
```

### Plans
```
Format: {số}_{tên_feature}.plan (cùng số với spec)
Ví dụ:
- 01_init.plan
- 06_gold_prices_tool.plan
```

### Tasks
```
Format: {plan_id}_phase{X}_task{Y}.task
Ví dụ:
- 06_phase1e_task01_unit_tests.task
- 06_phase2a_task01_automated_fetch.task
- 06_phase2b_task01_alerts_schema.task
```

---

## ✅ Status & Progress

### Spec Status
- 📝 **Draft** - Đang viết spec
- 🚧 **In Progress** - Đang implement
- ✅ **Completed** - Hoàn thành
- ❌ **Cancelled** - Hủy bỏ

### Plan Progress
```markdown
| Phase | Progress | Status |
|-------|----------|--------|
| 1A. Database | 100% | ✅ Complete |
| 1B. Providers | 100% | ✅ Complete |
| 1C. Backend | 100% | ✅ Complete |
| 1D. Frontend | 100% | ✅ Complete |
| 1E. Testing | 20% | 🚧 In Progress |
```

### Task Checklist
```markdown
- [x] Setup environment ✅
- [x] Create database schema ✅
- [ ] Write unit tests ⏳
- [ ] Deploy to production ⏳
```

---

## 🔗 Liên Kết Giữa Các Docs

### Spec ↔ Plan ↔ Tasks

**Trong Spec:**
```markdown
**Related Documents:**
- Implementation Plan: `specs/plans/06_gold_prices_tool.plan`
- Feature Status: `docs/dev-notes/features/gold-implementation-status.md`
```

**Trong Plan:**
```markdown
**Spec Reference:** `specs/specs/06_gold_prices_tool.spec`
**Tasks:** See `specs/plans/tasks/06_phase*_task*.task`
```

**Trong Task:**
```markdown
**Plan:** `specs/plans/06_gold_prices_tool.plan`
**Spec:** `specs/specs/06_gold_prices_tool.spec`
```

---

## 🎓 Best Practices

### ✅ DOs

1. **Tạo spec trước khi code** - Định nghĩa rõ WHAT trước
2. **Chia nhỏ phases** - Mỗi phase 2-5 ngày
3. **Update progress thường xuyên** - Mark subtasks done ngay khi xong
4. **Link documents** - Luôn link spec → plan → tasks
5. **Follow templates** - Dùng templates để consistency

### ❌ DON'Ts

1. **Đừng skip spec** - Ngay cả features nhỏ nên có spec ngắn
2. **Đừng tạo plan quá chi tiết** - Enough to guide, flexible to adapt
3. **Đừng quên update progress** - Update khi hoàn thành từng subtask
4. **Đừng hardcode trong specs** - Specs define behavior, not implementation details
5. **Đừng duplicate info** - Link thay vì copy/paste

---

## 📖 Templates

### 1. Spec Template
```
File: specs/templates/TEMPLATE_spec.md
Sections:
- Overview (ID, Version, Status, Purpose)
- Goals (Primary, Secondary, Non-Goals)
- Acceptance Criteria (Must/Should/Nice to Have)
- Technical Design (Architecture, API, Database)
- Security Considerations
- Performance Requirements
- Testing Strategy
- Timeline & Dependencies
```

### 2. Plan Template
```
File: specs/templates/TEMPLATE_plan.md
Sections:
- Overview (Plan ID, Spec, Status)
- Timeline & Milestones
- 7 Phases (Setup → Database → Backend → Frontend → Testing → Docs → Deploy)
- Progress Tracking Table
- Technical Decisions
- Issues & Risks
```

### 3. Task Template
```
File: specs/templates/TEMPLATE_task.md
Sections:
- Task Overview (ID, Priority, Estimate)
- Objectives
- Acceptance Criteria
- Subtasks (với checkboxes)
- Files to Create/Modify
- Implementation Details (code examples)
- Testing Plan
- Dependencies
```

---

## 🛠️ Common Workflows

### Workflow 1: Feature Mới Hoàn Toàn

```bash
1. Tạo spec: specs/specs/08_new_feature.spec
2. Review spec với team
3. Tạo plan: specs/plans/08_new_feature.plan
4. Implement Phase 1:
   - Tạo tasks: 08_phase1_task01.task, 08_phase1_task02.task
   - Code theo tasks
   - Update progress
5. Repeat cho phases tiếp theo
6. Complete và document
```

### Workflow 2: Continue Existing Feature

```bash
1. Check progress: Read plan file
2. Tìm next task trong phase hiện tại
3. Tạo task file nếu chưa có
4. Implement task
5. Update progress trong plan
6. Move to next task
```

### Workflow 3: Bug Fix Major

```bash
1. Tạo spec (nếu fix lớn, ảnh hưởng nhiều): 09_fix_security_issue.spec
2. Tạo plan với phases
3. Implement và test
4. Document trong CHANGELOG.md
```

---

## 📞 Cần Giúp Đỡ?

### Đọc Thêm

- **README đầy đủ:** `specs/README.md`
- **Commands reference:** `specs/COMMANDS.md`
- **Config:** `specs/config.json`
- **Project manifest:** `project_manifest.json`

### Ví Dụ Thực Tế

- **Spec:** `specs/specs/06_gold_prices_tool.spec`
- **Plan:** `specs/plans/06_gold_prices_tool.plan`
- **Task:** `specs/plans/tasks/06_phase1e_task01_unit_tests.task`

### Template Files

- `specs/templates/TEMPLATE_spec.md`
- `specs/templates/TEMPLATE_plan.md`
- `specs/templates/TEMPLATE_task.md`

---

## 📊 Quick Reference

| Muốn làm gì? | Dùng file nào? | Template |
|--------------|----------------|----------|
| Định nghĩa feature mới | `specs/{id}_{name}.spec` | TEMPLATE_spec.md |
| Lập kế hoạch implement | `plans/{id}_{name}.plan` | TEMPLATE_plan.md |
| Chi tiết task cụ thể | `plans/tasks/{id}_phase{X}_task{Y}.task` | TEMPLATE_task.md |
| Check progress | Đọc plan file | - |
| Track implementation | `docs/dev-notes/features/` | - |

---

**Happy Building! 🚀**

*Maintained by: KaDong Development Team*  
*Version: 1.0.0*  
*Last Updated: 2025-11-13*
