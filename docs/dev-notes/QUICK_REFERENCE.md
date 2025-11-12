# Dev-Notes Quick Reference

## 📁 Locations

```
docs/dev-notes/
├── features/          → Feature implementation tracking
├── bugfixes/          → Bug fix documentation  
├── commits/           → Commit preparation
└── TEMPLATE_*.md      → Copy these to start new notes
```

## 🚀 Quick Commands

### Start New Feature
```bash
cd docs/dev-notes/features
cp ../TEMPLATE_feature_status.md my-feature-implementation-status.md
code my-feature-implementation-status.md
```

### Document Bug Fix
```bash
cd docs/dev-notes/bugfixes
cp ../TEMPLATE_bugfix.md fix-my-bug-description.md
code fix-my-bug-description.md
```

### Prepare Commit
```bash
cd docs/dev-notes/commits
cp ../TEMPLATE_commit.md my-feature-commit.md
code my-feature-commit.md
```

## 📝 Naming Rules

| Type | Format | Example |
|------|--------|---------|
| Feature | `{name}-implementation-status.md` | `gold-implementation-status.md` |
| Bug Fix | `fix-{description}.md` | `fix-uuid-validation-error.md` |
| Commit | `{feature}-commit.md` | `fashion-tool-commit.md` |

## ✅ Checklist Templates

### Feature Status
- [ ] Requirements & goals defined
- [ ] Database schema designed
- [ ] API endpoints documented
- [ ] Backend implemented
- [ ] Frontend implemented
- [ ] Tests written
- [ ] Documentation updated

### Bug Fix
- [ ] Problem described with examples
- [ ] Root cause identified
- [ ] Solution implemented
- [ ] Tests added
- [ ] Prevention measures documented

### Commit Preparation
- [ ] All files reviewed
- [ ] Tests passing
- [ ] Security checklist complete
- [ ] Documentation updated
- [ ] Commit message drafted

## 🗂️ Archive Policy

| Keep Forever | Can Delete |
|--------------|------------|
| features/* | commits/* (after push) |
| bugfixes/* | *-wip.md |
| - | *.tmp.md |

## 💡 Pro Tips

1. **Update status regularly** - Don't wait until finished
2. **Link related docs** - Cross-reference API docs, schemas
3. **Add timestamps** - Note when blockers occur
4. **Use templates** - Ensures nothing is forgotten
5. **Keep it simple** - Focus on useful info, not perfection

## 🔗 Full Guide

See [README.md](README.md) for complete documentation.

---

**Pin this file** for daily reference! 📌
