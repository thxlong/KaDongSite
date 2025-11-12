# 📚 KaDong Tools Documentation - Restructure Plan

**Date:** 2025-11-13  
**Status:** 📝 Proposal  
**Goal:** Organize docs/ folder for better navigation and maintenance

---

## 🎯 Objectives

1. **Clean Root Level** - Chỉ giữ README.md và folders
2. **Clear Categorization** - Phân loại rõ ràng theo mục đích
3. **Easy Navigation** - Dễ tìm tài liệu cần thiết
4. **Maintainable** - Dễ update và mở rộng

---

## 📊 Current Structure Analysis

### Current (19 files at root):
```
docs/
├── README.md
├── SETUP_INSTALLATION.md
├── SHELL_COMMANDS_GUIDE.md
├── PROJECT_STRUCTURE.md
├── DATABASE_SCHEMA.md
├── BACKEND_STRUCTURE.md
├── API_DOCUMENTATION.md
├── FRONTEND_GUIDE.md
├── CONTRIBUTING.md
├── DEPLOYMENT_GUIDE.md
├── MAINTENANCE.md
├── TROUBLESHOOTING.md
├── GOLD_FEATURE.md
├── WEATHER_TOOL_SETUP.md
├── WEDDING_INVITATION_TOOL.md
├── USER_SYSTEM.md
├── MIGRATION_SUMMARY.md
├── CHANGELOG.md
└── dev-notes/
    ├── features/
    ├── bugfixes/
    ├── commits/
    └── TEMPLATE_*.md
```

**Problems:**
- ❌ Too many files at root (hard to navigate)
- ❌ Mixed purposes (setup, architecture, features, guides)
- ❌ Features docs scattered (GOLD_FEATURE.md vs dev-notes/features/)
- ❌ No clear distinction between user docs vs developer docs

---

## 🏗️ Proposed New Structure

```
docs/
├── README.md                           # Main index (KEEP at root)
│
├── 01-getting-started/                 # 🚀 NEW - Setup & Installation
│   ├── README.md                       # Quick start guide
│   ├── installation.md                 # (was SETUP_INSTALLATION.md)
│   ├── shell-commands.md               # (was SHELL_COMMANDS_GUIDE.md)
│   └── troubleshooting.md              # (was TROUBLESHOOTING.md)
│
├── 02-architecture/                    # 🏛️ NEW - Technical Architecture
│   ├── README.md                       # Architecture overview
│   ├── project-structure.md            # (was PROJECT_STRUCTURE.md)
│   ├── backend-structure.md            # (was BACKEND_STRUCTURE.md)
│   ├── database-schema.md              # (was DATABASE_SCHEMA.md)
│   └── api-documentation.md            # (was API_DOCUMENTATION.md)
│
├── 03-development/                     # 💻 NEW - Development Guides
│   ├── README.md                       # Developer guide index
│   ├── frontend-guide.md               # (was FRONTEND_GUIDE.md)
│   ├── backend-guide.md                # NEW - Extract from others
│   ├── testing-guide.md                # NEW - Best practices
│   └── contributing.md                 # (was CONTRIBUTING.md)
│
├── 04-features/                        # ✨ NEW - Feature Documentation
│   ├── README.md                       # Features index
│   ├── gold-prices.md                  # (was GOLD_FEATURE.md)
│   ├── weather-tool.md                 # (was WEATHER_TOOL_SETUP.md)
│   ├── wedding-invitation.md           # (was WEDDING_INVITATION_TOOL.md)
│   ├── wishlist-management.md          # NEW - Document existing
│   ├── user-system.md                  # (was USER_SYSTEM.md)
│   ├── fashion-outfits.md              # NEW - Document existing
│   ├── notes-tool.md                   # NEW - Document existing
│   └── countdown-events.md             # NEW - Document existing
│
├── 05-operations/                      # 🚀 NEW - Deployment & Ops
│   ├── README.md                       # Operations overview
│   ├── deployment.md                   # (was DEPLOYMENT_GUIDE.md)
│   ├── maintenance.md                  # (was MAINTENANCE.md)
│   ├── monitoring.md                   # NEW - Add monitoring docs
│   └── backup-restore.md               # NEW - Extract from maintenance
│
├── 06-migration/                       # 🔄 NEW - Migration & Changes
│   ├── README.md                       # Migration history
│   ├── v1.2-postgres-migration.md      # (was MIGRATION_SUMMARY.md)
│   ├── v2.0-backend-restructure.md     # NEW - Recent restructure
│   └── changelog.md                    # (was CHANGELOG.md)
│
└── dev-notes/                          # 📝 KEEP - Development Tracking
    ├── README.md                       # KEEP
    ├── QUICK_REFERENCE.md              # KEEP
    ├── REORGANIZATION_SUMMARY.md       # KEEP
    ├── STRUCTURE_VISUALIZATION.md      # KEEP
    ├── API_TESTING_RESULTS.md          # KEEP
    ├── BACKEND_MIGRATION_COMPLETE.md   # KEEP
    ├── BACKEND_RESTRUCTURE_PLAN.md     # KEEP
    ├── MIGRATION_SUCCESS_SUMMARY.md    # KEEP
    │
    ├── features/                       # Feature implementation tracking
    │   ├── gold-implementation-status.md
    │   ├── weather-tool-review-summary.md
    │   ├── wedding-invitation-implementation-status.md
    │   ├── currency-tool-api-resilience.md
    │   ├── spec-kit-integration-implementation-status.md
    │   └── wishlist-category-enhancement.md  # NEW
    │
    ├── bugfixes/                       # Bug fix documentation
    │   ├── fix-uuid-validation-error.md
    │   ├── fix-currency-hardcoded-rates.md
    │   ├── fix-currency-api-missing-migrations.md
    │   └── fix-invalid-uuid-global-migration.md
    │
    ├── commits/                        # Commit summaries
    │   ├── fashion-tool-commit.md
    │   ├── currency-tool-api-fallback-commit.md
    │   └── docs-reorganization-commit.md
    │
    ├── templates/                      # NEW - Templates folder
    │   ├── TEMPLATE_feature_status.md
    │   ├── TEMPLATE_bugfix.md
    │   ├── TEMPLATE_commit.md
    │   └── README.md
    │
    └── archive/                        # NEW - Old/deprecated docs
        └── .gitkeep
```

---

## 📋 File Mapping

### 01-getting-started/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `SETUP_INSTALLATION.md` | `01-getting-started/installation.md` | MOVE |
| `SHELL_COMMANDS_GUIDE.md` | `01-getting-started/shell-commands.md` | MOVE |
| `TROUBLESHOOTING.md` | `01-getting-started/troubleshooting.md` | MOVE |

### 02-architecture/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `PROJECT_STRUCTURE.md` | `02-architecture/project-structure.md` | MOVE |
| `BACKEND_STRUCTURE.md` | `02-architecture/backend-structure.md` | MOVE |
| `DATABASE_SCHEMA.md` | `02-architecture/database-schema.md` | MOVE |
| `API_DOCUMENTATION.md` | `02-architecture/api-documentation.md` | MOVE |

### 03-development/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `FRONTEND_GUIDE.md` | `03-development/frontend-guide.md` | MOVE |
| `CONTRIBUTING.md` | `03-development/contributing.md` | MOVE |
| - | `03-development/backend-guide.md` | CREATE |
| - | `03-development/testing-guide.md` | CREATE |

### 04-features/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `GOLD_FEATURE.md` | `04-features/gold-prices.md` | MOVE |
| `WEATHER_TOOL_SETUP.md` | `04-features/weather-tool.md` | MOVE |
| `WEDDING_INVITATION_TOOL.md` | `04-features/wedding-invitation.md` | MOVE |
| `USER_SYSTEM.md` | `04-features/user-system.md` | MOVE |
| - | `04-features/wishlist-management.md` | CREATE |
| - | `04-features/fashion-outfits.md` | CREATE |
| - | `04-features/notes-tool.md` | CREATE |
| - | `04-features/countdown-events.md` | CREATE |

### 05-operations/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `DEPLOYMENT_GUIDE.md` | `05-operations/deployment.md` | MOVE |
| `MAINTENANCE.md` | `05-operations/maintenance.md` | MOVE |
| - | `05-operations/monitoring.md` | CREATE |
| - | `05-operations/backup-restore.md` | CREATE |

### 06-migration/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `MIGRATION_SUMMARY.md` | `06-migration/v1.2-postgres-migration.md` | MOVE |
| `CHANGELOG.md` | `06-migration/changelog.md` | MOVE |
| - | `06-migration/v2.0-backend-restructure.md` | CREATE |

### dev-notes/
| Old Location | New Location | Action |
|--------------|--------------|--------|
| `dev-notes/TEMPLATE_*.md` | `dev-notes/templates/TEMPLATE_*.md` | MOVE |
| - | `dev-notes/templates/README.md` | CREATE |
| - | `dev-notes/archive/` | CREATE |

---

## ✨ Benefits

### 1. Clear Navigation (Numbered folders)
```
01-getting-started/     # Start here
02-architecture/        # Understand the system
03-development/         # Build features
04-features/            # Feature specs
05-operations/          # Deploy & maintain
06-migration/           # History & changes
dev-notes/             # Development tracking
```

### 2. Logical Grouping
- **Users/New Developers** → 01-getting-started/
- **Architects/Reviewers** → 02-architecture/
- **Developers** → 03-development/ + dev-notes/
- **Product/QA** → 04-features/
- **DevOps** → 05-operations/
- **Maintainers** → 06-migration/

### 3. Scalability
- Easy to add new features to 04-features/
- Easy to add new guides to 03-development/
- Easy to archive old migrations in 06-migration/

### 4. Consistency
- Each folder has README.md index
- Consistent naming: lowercase-with-hyphens.md
- Clear prefixes: 01-, 02-, etc.

---

## 📝 Implementation Steps

### Phase 1: Create New Structure (10 mins)
1. Create 6 numbered folders
2. Create README.md in each folder
3. Create templates/ folder in dev-notes/

### Phase 2: Move Existing Files (20 mins)
1. Move files according to mapping table
2. Rename files (UPPERCASE.md → lowercase.md)
3. Update internal links in moved files

### Phase 3: Create New Files (30 mins)
1. Create missing feature docs (wishlist, fashion, notes, events)
2. Create backend-guide.md
3. Create testing-guide.md
4. Create monitoring.md
5. Create backup-restore.md
6. Create v2.0-backend-restructure.md

### Phase 4: Update README.md (15 mins)
1. Update main docs/README.md with new structure
2. Create README.md for each folder
3. Add navigation links

### Phase 5: Update Links (20 mins)
1. Find all internal doc links: `grep -r "docs/" --include="*.md"`
2. Update links to new paths
3. Verify all links work

### Phase 6: Git Commit (5 mins)
1. Git mv for tracked files (preserves history)
2. Commit with clear message
3. Verify in GitHub

**Total Time:** ~100 minutes (1.5-2 hours)

---

## 🔗 Cross-Reference Updates

### Files with many internal links to update:
1. `README.md` - Main index
2. `dev-notes/README.md` - Dev notes index
3. `CONTRIBUTING.md` → `03-development/contributing.md`
4. All feature status files in `dev-notes/features/`

### Search patterns:
```bash
# Find all doc links
grep -r "\[.*\](.*\.md)" docs/ --include="*.md"

# Find specific file references
grep -r "SETUP_INSTALLATION.md" docs/ --include="*.md"
grep -r "API_DOCUMENTATION.md" docs/ --include="*.md"
```

---

## ⚠️ Risks & Mitigation

### Risk 1: Broken Links
**Mitigation:**
- Use git mv to preserve history
- Update all internal links systematically
- Create redirects/aliases if needed
- Test all links before final commit

### Risk 2: External References
**Mitigation:**
- Check if external docs link to these files
- Add deprecation notice in old locations
- Create symlinks temporarily

### Risk 3: Developer Confusion
**Mitigation:**
- Create docs-reorganization-commit.md with mapping
- Update CHANGELOG.md with restructure note
- Announce in team chat/email

---

## ✅ Success Criteria

- [ ] All files moved to appropriate folders
- [ ] All internal links updated and working
- [ ] Each folder has README.md index
- [ ] Main README.md updated with new structure
- [ ] No broken links
- [ ] Git history preserved
- [ ] Clear migration guide for team

---

## 📊 Before & After Comparison

### Before (Root Level - 19 items):
```
docs/
├── README.md
├── 18 Markdown files (hard to navigate)
└── dev-notes/
```

### After (Root Level - 8 items):
```
docs/
├── README.md
├── 01-getting-started/
├── 02-architecture/
├── 03-development/
├── 04-features/
├── 05-operations/
├── 06-migration/
└── dev-notes/
```

**Improvement:**
- ✅ 19 items → 8 items (58% reduction)
- ✅ Clear categorization (6 categories)
- ✅ Logical flow (numbered folders)
- ✅ Easy navigation (grouped by purpose)

---

## 🚀 Next Steps

1. **Review & Approve** this plan
2. **Execute** restructure in ~2 hours
3. **Update** all links and references
4. **Test** navigation and links
5. **Commit** with detailed message
6. **Announce** to team with migration guide

---

**Prepared By:** Technical Architect  
**Date:** 2025-11-13  
**Status:** 📝 Awaiting Approval  
**Estimated Effort:** 2 hours
