# 📚 Spec Kit - Specification Management System

**Version:** 1.0.1  
**Last Updated:** 2025-11-13

---

## 🎯 Tổng Quan

**Spec Kit** là hệ thống quản lý workflow development có cấu trúc, giúp team định nghĩa, lập kế hoạch, và thực thi features một cách có hệ thống.

```
💡 Idea → 📝 Spec (WHAT) → 📋 Plan (HOW) → ✅ Tasks (DO) → 🚀 Code
```

---

## 🚀 Quick Start

### Bắt Đầu Nhanh

**Lần đầu sử dụng?** → Đọc [QUICKSTART.md](QUICKSTART.md) (10 phút)

**Cần hướng dẫn chi tiết?** → Đọc [USAGE_GUIDE.md](USAGE_GUIDE.md)

**Tìm spec/plan/task cụ thể?** → Xem [INDEX.md](INDEX.md)

**Làm việc với AI Copilot?** → Xem [COMMANDS.md](COMMANDS.md)

---

## 📁 Cấu Trúc Folder

```
specs/
├── 📄 INDEX.md                     # Navigation hub
├── 🚀 QUICKSTART.md                # Hướng dẫn nhanh
├── 📚 USAGE_GUIDE.md               # Hướng dẫn chi tiết
├── 📖 README.md                    # File này
├── 🤖 COMMANDS.md                  # AI prompts
├── ⚙️ config.json                  # Configuration
│
├── 📝 specs/                       # Specifications (WHAT)
│   ├── 01_init.spec
│   ├── 06_gold_prices_tool.spec
│   └── ...
│
├── 📋 plans/                       # Plans (HOW)
│   ├── 01_init.plan
│   ├── 06_gold_prices_tool.plan
│   └── tasks/                      # Tasks (ACTION)
│       ├── 06_phase1e_task01_unit_tests.task
│       └── ...
│
└── 📄 templates/                   # Templates
    ├── TEMPLATE_spec.md
    ├── TEMPLATE_plan.md
    └── TEMPLATE_task.md
```

---

## 🔄 Workflow Cơ Bản

### 4 Bước

### 4 Bước

**1. Tạo Spec** - Định nghĩa WHAT cần build
```
Template: specs/templates/TEMPLATE_spec.md
Output: specs/specs/{id}_{name}.spec
Example: specs/specs/06_gold_prices_tool.spec
```

**2. Tạo Plan** - Lập kế hoạch HOW để build
```
Template: specs/templates/TEMPLATE_plan.md
Output: specs/plans/{id}_{name}.plan
Example: specs/plans/06_gold_prices_tool.plan
```

**3. Tạo Tasks** - Chi tiết ACTION cần làm (optional)
```
Template: specs/templates/TEMPLATE_task.md
Output: specs/plans/tasks/{id}_phase{X}_task{Y}.task
Example: specs/plans/tasks/06_phase1e_task01_unit_tests.task
```

**4. Implement** - Code và track progress
```
- Follow subtasks trong task file
- Mark checkboxes khi complete
- Update progress trong plan
- Commit code với Conventional Commits format
```

---

## 📝 Document Types

### Specification (.spec)

**Mục đích:** Định nghĩa WHAT cần build

**Khi nào tạo:**
- ✅ Feature mới
- ✅ Major refactor
- ✅ Breaking changes
- ✅ Database schema changes

**Không cần tạo:**
- ❌ Bug fixes nhỏ
- ❌ UI tweaks
- ❌ Typo fixes

**Key Sections:**
- Overview & Goals
- Acceptance Criteria (Must/Should/Nice to Have)
- Technical Design (Architecture, API, Database)
- Security & Performance
- Testing Strategy

**Template:** `specs/templates/TEMPLATE_spec.md`

---

### Implementation Plan (.plan)

**Mục đích:** Lập kế hoạch HOW để build

**Khi nào tạo:**
- Sau khi spec được approve
- Trước khi bắt đầu code

**Key Sections:**
- Timeline & Milestones
- 7 Phases (Setup → Database → Backend → Frontend → Testing → Docs → Deploy)
- Progress Tracking Table
- Technical Decisions
- Issues & Risks

**Template:** `specs/templates/TEMPLATE_plan.md`

---

### Task Breakdown (.task)

**Mục đích:** Chi tiết ACTION cần làm

**Khi nào tạo:**
- Phase phức tạp (> 5 subtasks)
- Cần code examples cụ thể
- Team cần assign tasks riêng

**Key Sections:**
- Objectives & Acceptance Criteria
- Subtasks với checkboxes
- Files to Create/Modify
- Implementation Details với code
- Testing Plan
- Dependencies

**Template:** `specs/templates/TEMPLATE_task.md`

---

## 📊 Naming Conventions

### Specs
```
Format: {id}_{feature_name}.spec
Examples:
- 01_init.spec
- 06_gold_prices_tool.spec
- 08_user_authentication.spec
```

### Plans
```
Format: {id}_{feature_name}.plan (same ID as spec)
Examples:
- 01_init.plan
- 06_gold_prices_tool.plan
```

### Tasks
```
Format: {plan_id}_phase{X}_task{Y}.task
Examples:
- 06_phase1e_task01_unit_tests.task
- 06_phase2a_task01_automated_fetch.task
```

---

## ✨ Best Practices

### Writing Specs

✅ **DO:**
- Define clear, measurable acceptance criteria
- Include technical diagrams and examples
- Consider security and performance upfront
- Link to related specs and documentation

❌ **DON'T:**
- Mix implementation details into specs (that's for plans)
- Skip acceptance criteria
- Ignore edge cases and error handling
- Forget to define success metrics

### Creating Plans

✅ **DO:**
- Break work into logical phases (7 phases chuẩn)
- Set realistic timelines
- Track progress with percentages
- Document technical decisions with reasoning

❌ **DON'T:**
- Create overly detailed plans upfront
- Skip risk assessment
- Ignore dependencies
- Forget to update progress

### Managing Tasks

✅ **DO:**
- Keep tasks small (2-8 hours)
- Include code examples
- Define clear acceptance criteria
- Update status regularly

❌ **DON'T:**
- Create tasks without context
- Skip testing checklist
- Ignore dependencies
- Forget to document learnings

---

## 📚 Ví Dụ Thực Tế

### Gold Prices Tool (Complete Example)

**Spec:** `specs/specs/06_gold_prices_tool.spec`
- ✅ Requirements: Display 7 gold types from multiple sources
- ✅ Acceptance Criteria: < 500ms response, 80% coverage
- ✅ Technical Design: Provider pattern, PostgreSQL, React
- ✅ Status: Complete

**Plan:** `specs/plans/06_gold_prices_tool.plan`
- ✅ Phase 1A: Database (100%)
- ✅ Phase 1B: Providers (100%)
- ✅ Phase 1C: Backend API (100%)
- ✅ Phase 1D: Frontend UI (100%)
- 🚧 Phase 1E: Testing (20%)
- ⏳ Phase 2A: Auto-fetch (0%)
- ⏳ Phase 2B: Alerts (0%)
- Overall: 85%

**Tasks:**
- `06_phase1e_task01_unit_tests.task` - Vitest setup, provider tests
- `06_phase1e_task03_e2e_tests.task` - Playwright E2E tests
- `06_phase2a_task01_automated_fetch.task` - Cron job implementation
- `06_phase2b_task01_alerts_schema.task` - Price alerts database

---

## 🔗 Liên Kết Tài Liệu

| Tài liệu | Mục đích | Link |
|----------|----------|------|
| **INDEX.md** | Navigation & tổng quan | [INDEX.md](INDEX.md) |
| **QUICKSTART.md** | Hướng dẫn nhanh | [QUICKSTART.md](QUICKSTART.md) |
| **USAGE_GUIDE.md** | Hướng dẫn chi tiết | [USAGE_GUIDE.md](USAGE_GUIDE.md) |
| **COMMANDS.md** | AI prompts reference | [COMMANDS.md](COMMANDS.md) |
| **config.json** | Configuration | [config.json](config.json) |

---

## 📊 Status Tracking

### Spec Status
- 📝 **Draft** - Đang viết spec
- 🚧 **In Progress** - Đang implement
- ✅ **Completed** - Hoàn thành
- ❌ **Cancelled** - Hủy bỏ

### Plan Progress
```markdown
| Phase | Progress | Status |
|-------|----------|--------|
| 1. Setup | 100% | ✅ Complete |
| 2. Database | 100% | ✅ Complete |
| 3. Backend | 60% | 🚧 In Progress |
```

### Task Checklist
```markdown
- [x] Setup environment ✅
- [x] Create database schema ✅
- [ ] Write unit tests ⏳
- [ ] Deploy to production ⏳
```

---

## 🛠️ Configuration

Configuration được lưu trong `specs/config.json`:

```json
{
  "version": "1.0.1",
  "directories": {
    "specs": "specs/specs/",
    "plans": "specs/plans/",
    "tasks": "specs/plans/tasks/",
    "templates": "specs/templates/"
  },
  "namingConventions": {
    "specs": "{id}_{name}.spec",
    "plans": "{spec_id}.plan",
    "tasks": "{plan_id}_phase{X}_task{Y}.task"
  }
}
```

---

## 🔄 Integration

### Với Dev Notes System

**Feature Status:** `docs/dev-notes/features/{feature}-implementation-status.md`
- Link từ plan đến feature status
- Track progress chi tiết hơn

**Bug Fixes:** `docs/dev-notes/bugfixes/fix-{bug}.md`
- Link bug fixes đến related specs

### Với Project Documentation

**API Docs:** `docs/API_DOCUMENTATION.md`
- Update khi thêm endpoints mới

**Database Schema:** `docs/DATABASE_SCHEMA.md`
- Update khi thay đổi schema

**Project Manifest:** `project_manifest.json`
- Reference specs trong manifest

---

## 🎓 Learning Path

### Day 1: Hiểu Hệ Thống
1. ✅ Đọc [QUICKSTART.md](QUICKSTART.md)
2. ✅ Xem [INDEX.md](INDEX.md)
3. ✅ Đọc example spec: `specs/specs/06_gold_prices_tool.spec`
4. ✅ Đọc example plan: `specs/plans/06_gold_prices_tool.plan`

### Day 2: Practice
1. ✅ Pick một feature nhỏ
2. ✅ Tạo spec dùng template
3. ✅ Tạo plan dùng template
4. ✅ Implement Phase 1

### Day 3: Deep Dive
1. ✅ Đọc [USAGE_GUIDE.md](USAGE_GUIDE.md) đầy đủ
2. ✅ Hiểu [config.json](config.json)
3. ✅ Study [COMMANDS.md](COMMANDS.md) cho AI workflows

---

## ❓ FAQ

### Q: Khi nào cần tạo spec?
**A:** Cho mọi feature mới, major refactor, hoặc breaking changes. Skip cho bug fixes nhỏ.

### Q: Plan cần chi tiết đến đâu?
**A:** Đủ chi tiết để guide implementation nhưng flexible để adapt. Clarity > perfection.

### Q: Có cần task files cho mọi phase không?
**A:** Không. Chỉ dùng tasks cho complex phases. Simple phases track trực tiếp trong plan.

### Q: Bao lâu update status một lần?
**A:** Update specs khi requirements change, plans hàng tuần, tasks hàng ngày khi active.

### Q: Tasks folder ở đâu?
**A:** `specs/plans/tasks/` (KHÔNG phải `specs/tasks/`). Đã restructure ngày 2025-11-13.

---

## 🔄 Changelog

### Version 1.0.1 (2025-11-13)
- ✅ **Restructured folder:** Moved `specs/tasks/` → `specs/plans/tasks/`
- ✅ **Created INDEX.md:** Navigation hub for all docs
- ✅ **Created QUICKSTART.md:** 10-minute quick start guide
- ✅ **Created USAGE_GUIDE.md:** Detailed usage instructions
- ✅ **Simplified README.md:** Overview + links to detailed docs
- ✅ **Updated config.json:** v1.0.1 with correct paths

### Version 1.0.0 (2025-11-11)
- ✅ Initial Spec Kit setup
- ✅ Created templates
- ✅ Created COMMANDS.md
- ✅ Created config.json

---

## 📞 Support

**Questions?** Check:
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Detailed Guide:** [USAGE_GUIDE.md](USAGE_GUIDE.md)
- **Navigation:** [INDEX.md](INDEX.md)
- **AI Commands:** [COMMANDS.md](COMMANDS.md)
- **Project Manifest:** `../project_manifest.json`

---

**Happy Specifying! 🚀**

*Maintained by: KaDong Development Team*  
*Version: 1.0.1*  
*Last Updated: 2025-11-13*
