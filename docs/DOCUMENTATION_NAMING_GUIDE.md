# 📝 Documentation Naming Guide

**Version:** 1.0.0  
**Last Updated:** 2025-11-13  
**Purpose:** Chuẩn hóa cách đặt tên tài liệu trong toàn bộ dự án

---

## 🎯 Naming Conventions Overview

### 1. **Permanent Reference Docs** → `UPPER_SNAKE_CASE.md`

**Vị trí:** `docs/` (root level hoặc trong numbered folders)  
**Mục đích:** Tài liệu tham khảo ổn định, ít thay đổi, quan trọng  
**Đặc điểm:** Dễ phát hiện, nổi bật trong danh sách file

**Ví dụ:**
```
docs/
├── README.md
├── API_DOCUMENTATION.md          ✅ Permanent
├── DATABASE_SCHEMA.md            ✅ Permanent
├── SETUP_INSTALLATION.md         ✅ Permanent
├── SHELL_COMMANDS_GUIDE.md       ✅ Permanent
├── DEPLOYMENT_GUIDE.md           ✅ Permanent
├── TROUBLESHOOTING.md            ✅ Permanent
├── CONTRIBUTING.md               ✅ Permanent
└── CHANGELOG.md                  ✅ Permanent
```

---

### 2. **Dev-Notes Documents** → `kebab-case.md`

**Vị trí:** `docs/dev-notes/` và các subfolder  
**Mục đích:** Tài liệu tracking, working documents, knowledge base  
**Đặc điểm:** Dễ đọc, dễ gõ, phù hợp với git-friendly naming

**Ví dụ:**
```
docs/dev-notes/
├── README.md
├── implementations/
│   ├── gold-prices-status.md           ✅ Dev-notes
│   ├── weather-tool-status.md          ✅ Dev-notes
│   └── user-authentication-status.md   ✅ Dev-notes
├── bugfixes/
│   ├── fix-uuid-validation.md          ✅ Dev-notes
│   ├── fix-shopee-url-extraction.md    ✅ Dev-notes
│   └── fix-category-hardcode.md        ✅ Dev-notes
├── enhancements/
│   ├── wishlist-category-enhancement.md    ✅ Dev-notes
│   ├── currency-api-resilience.md          ✅ Dev-notes
│   └── gold-real-api-integration.md        ✅ Dev-notes
└── planning/
    ├── docs-restructure-plan.md        ✅ Dev-notes
    ├── database-migration-plan.md      ✅ Dev-notes
    └── api-versioning-plan.md          ✅ Dev-notes
```

---

### 3. **Folders** → `kebab-case/` or `##-kebab-case/`

**Tất cả folders:** Luôn dùng lowercase + hyphens  
**Numbered folders:** Prefix với 2 digits (01, 02, ...) để sort tự động

**Ví dụ:**
```
docs/
├── 01-getting-started/     ✅ Numbered folder
├── 02-architecture/        ✅ Numbered folder
├── 03-development/         ✅ Numbered folder
├── 04-features/            ✅ Numbered folder
├── 05-operations/          ✅ Numbered folder
├── 06-migration/           ✅ Numbered folder
└── dev-notes/              ✅ Simple folder
    ├── implementations/    ✅ No numbers needed
    ├── bugfixes/           ✅ No numbers needed
    ├── enhancements/       ✅ No numbers needed
    └── planning/           ✅ No numbers needed
```

---

## 📂 Document Type Categories

### Category 1: Implementations (NEW Features)

**Folder:** `docs/dev-notes/implementations/`  
**Naming:** `{feature-name}-status.md`  
**Purpose:** Track NEW feature implementation from scratch

**Examples:**
- ✅ `gold-prices-status.md` - Tracking gold price feature implementation
- ✅ `weather-tool-status.md` - Weather tool development progress
- ✅ `user-authentication-status.md` - Auth system implementation

**When to use:**
- Khi bắt đầu build feature hoàn toàn mới
- Feature chưa tồn tại trong codebase
- Cần track progress qua nhiều phases

---

### Category 2: Enhancements (EXISTING Features)

**Folder:** `docs/dev-notes/enhancements/`  
**Naming:** `{feature-name}-{enhancement-type}.md`  
**Purpose:** Document improvements to EXISTING features

**Enhancement Types:**
- `ux` - User experience improvements
- `api-resilience` - API reliability improvements
- `performance` - Performance optimizations
- `real-api-integration` - Replace mock with real API
- `category-enhancement` - Add/improve categorization
- `refactoring` - Code restructuring

**Examples:**
- ✅ `wishlist-category-enhancement.md` - Add category combobox to existing wishlist
- ✅ `currency-api-resilience.md` - Add 5 API fallbacks to existing currency tool
- ✅ `gold-real-api-integration.md` - Replace mock provider with real API

**When to use:**
- Feature đã tồn tại, bạn đang cải tiến
- Sửa UX/performance của feature hiện có
- Thay đổi implementation (mock → real API)

---

### Category 3: Bug Fixes

**Folder:** `docs/dev-notes/bugfixes/`  
**Naming:** `fix-{bug-description}.md`  
**Purpose:** Document bug fixes with root cause analysis

**Examples:**
- ✅ `fix-uuid-validation.md` - Invalid UUID format causing errors
- ✅ `fix-shopee-url-extraction.md` - New Shopee URL format not recognized
- ✅ `fix-category-hardcode.md` - Category field hardcoded instead of optional

**When to use:**
- Khi sửa bug (không phải feature mới)
- Cần document root cause để tránh regression
- Học được lesson từ bug này

---

### Category 4: Planning Documents

**Folder:** `docs/dev-notes/planning/`  
**Naming:** `{topic}-plan.md`  
**Purpose:** Planning and analysis BEFORE implementation

**Examples:**
- ✅ `docs-restructure-plan.md` - Plan for reorganizing docs folder
- ✅ `database-migration-plan.md` - Plan for DB schema changes
- ✅ `api-versioning-plan.md` - Plan for API v2 rollout

**When to use:**
- Khi cần lên plan cho major changes
- Cần phân tích options trước khi quyết định
- Documenting proposals để team review

---

## 🔀 Implementation vs Enhancement - Key Differences

| Aspect | Implementation | Enhancement |
|--------|---------------|-------------|
| **Feature** | NEW (không tồn tại) | EXISTING (đã có) |
| **Folder** | `implementations/` | `enhancements/` |
| **Naming** | `{feature}-status.md` | `{feature}-{type}.md` |
| **Scope** | Build from scratch | Improve what exists |
| **Examples** | gold-prices-status.md | wishlist-category-enhancement.md |
| | weather-tool-status.md | currency-api-resilience.md |
| | user-auth-status.md | gold-real-api-integration.md |

**Rule of Thumb:**
- Nếu feature CHƯA CÓ → `implementations/`
- Nếu feature ĐÃ CÓ, bạn cải tiến → `enhancements/`

---

## 📋 Quick Decision Tree

```
┌─ Creating new document?
│
├─ Is it a permanent reference doc?
│  │  (API docs, DB schema, setup guide, etc.)
│  └─ YES → Use UPPER_SNAKE_CASE.md in docs/ or numbered folder
│
├─ Is it a dev-note working document?
│  │
│  ├─ Is it a NEW feature being built?
│  │  └─ YES → implementations/{feature}-status.md
│  │
│  ├─ Is it an improvement to EXISTING feature?
│  │  └─ YES → enhancements/{feature}-{type}.md
│  │
│  ├─ Is it a bug fix?
│  │  └─ YES → bugfixes/fix-{bug-description}.md
│  │
│  └─ Is it planning/analysis before implementation?
│     └─ YES → planning/{topic}-plan.md
│
└─ Creating a folder?
   └─ Use kebab-case/ (with ## prefix if numbered)
```

---

## ✅ Checklist for Creating Docs

### Before creating a new doc, ask:

1. **Is it permanent or working document?**
   - Permanent → `UPPER_SNAKE_CASE.md`
   - Working → `kebab-case.md`

2. **What type of dev-note is it?**
   - New feature → `implementations/`
   - Improvement → `enhancements/`
   - Bug fix → `bugfixes/`
   - Planning → `planning/`

3. **Does it follow naming convention?**
   - implementations: `{feature}-status.md`
   - enhancements: `{feature}-{type}.md`
   - bugfixes: `fix-{bug}.md`
   - planning: `{topic}-plan.md`

4. **Is the folder structure correct?**
   - All folders use `kebab-case/`
   - Numbered folders use `##-kebab-case/`
   - Dev-notes stay in `docs/dev-notes/{subfolder}/`

---

## 🔧 Migration Examples

### Wrong → Right

❌ `docs/GOLD_IMPLEMENTATION_STATUS.md`  
✅ `docs/dev-notes/implementations/gold-prices-status.md`

❌ `docs/dev-notes/features/gold-implementation-status.md`  
✅ `docs/dev-notes/implementations/gold-prices-status.md`

❌ `docs/wishlist_category_enhancement.md`  
✅ `docs/dev-notes/enhancements/wishlist-category-enhancement.md`

❌ `docs/dev-notes/DOCS_RESTRUCTURE_PLAN.md`  
✅ `docs/dev-notes/planning/docs-restructure-plan.md`

❌ `docs/Fix-UUID-Validation-Error.md`  
✅ `docs/dev-notes/bugfixes/fix-uuid-validation.md`

---

## 🎯 Benefits of This System

### 1. **Clear Distinction**
- UPPER_SNAKE_CASE = Permanent, important, reference
- kebab-case = Working, tracking, dev-notes

### 2. **Easy to Find**
- Permanent docs stand out in listings
- Dev-notes organized by type (implementation, enhancement, etc.)

### 3. **Git-Friendly**
- kebab-case works well with URLs
- No spaces, special characters, capitals in URLs

### 4. **Scalable**
- Easy to add new categories
- Numbered folders keep order clear
- Type-based subfolders in dev-notes prevent clutter

### 5. **Self-Documenting**
- File name reveals purpose immediately
- Folder location reveals category
- Naming pattern reveals content type

---

## 📚 Related References

- **Project Manifest:** `project_manifest.json` (section `conventions.documentation`)
- **Dev-Notes Guide:** `docs/dev-notes/README.md`
- **Spec Kit Guide:** `specs/README.md`

---

**Maintained By:** KaDong Development Team  
**Last Updated:** 2025-11-13  
**Version:** 1.0.0
