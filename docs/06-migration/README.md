# 🔄 Migration

**Purpose:** Database migrations and version history

---

## 📚 Documents in This Section

### [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)
localStorage to PostgreSQL migration
- Migration rationale
- Data transformation process
- Schema design decisions
- Migration scripts
- Rollback procedures
- Lessons learned

### [CHANGELOG.md](CHANGELOG.md)
Version history and release notes
- All versions with dates
- New features per version
- Bug fixes and improvements
- Breaking changes
- Migration guides between versions

---

## 🎯 Migration History

### v1.4.0 - Gold Real API Integration
- Replaced mock provider with real market data
- 3 API sources with fallback
- Realistic Nov 2025 prices

### v1.3.0 - Spec Kit Integration
- Added specification management system
- Workflow: /specify → /plan → /tasks → /implement

### v1.2.0 - Dev-Notes Structure
- Created docs/dev-notes/ folder
- Organized features, bugfixes, commits

### v1.1.0 - localStorage → PostgreSQL
- Full database migration
- UUID-based architecture
- Soft delete pattern

### v1.0.0 - Initial Release
- Core tools (Notes, Countdown, Calendar)
- Basic authentication
- localStorage-based

---

## 📋 Migration Checklist

Before any migration:
- [ ] Backup production database
- [ ] Test migration on staging
- [ ] Write rollback script
- [ ] Document breaking changes
- [ ] Update CHANGELOG.md
- [ ] Notify users if needed
- [ ] Monitor for 24h after migration

---

## 🔗 Related Sections

- **Architecture:** [../02-architecture/DATABASE_SCHEMA.md](../02-architecture/DATABASE_SCHEMA.md) - Current schema
- **Operations:** [../05-operations/MAINTENANCE.md](../05-operations/MAINTENANCE.md) - Backup procedures

---

**Last Updated:** 2025-11-13
