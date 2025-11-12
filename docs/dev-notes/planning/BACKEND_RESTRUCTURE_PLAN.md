# Backend Restructure Migration Plan

**Version:** 1.0.0  
**Created:** 2025-11-12  
**Status:** 📝 Ready to Execute  
**Estimated Duration:** 2-3 weeks

---

## 🎯 Objectives

**Primary Goal:**
Restructure backend codebase theo Clean Architecture để:
- ✅ Dễ maintain và scale
- ✅ Clear separation of concerns
- ✅ Better testability
- ✅ Improved developer experience

**Success Criteria:**
- All tests passing after migration
- No breaking changes to API
- Code coverage maintained >= 80%
- Documentation updated
- Zero downtime deployment

---

## 📅 Timeline Overview

| Week | Phase | Tasks | Status |
|------|-------|-------|--------|
| 1 | Setup | Create folders, install packages | 📝 Planned |
| 2 | Migration | Move files, refactor code | 📝 Planned |
| 3 | Testing | Fix tests, manual QA | 📝 Planned |
| 4 | Deployment | Deploy to production | 📝 Planned |

---

## 📦 Phase 1: Environment Setup (Week 1)

### Milestone 1.1: Create Folder Structure

**Tasks:**
```bash
# Tạo src/ directory structure
mkdir -p backend/src/api/{controllers,routes,middlewares}
mkdir -p backend/src/services
mkdir -p backend/src/providers/{currency,gold,weather}
mkdir -p backend/src/database/repositories
mkdir -p backend/src/models
mkdir -p backend/src/config
mkdir -p backend/src/utils

# Reorganize scripts
mkdir -p backend/scripts/{database,cron,dev}

# Organize tests
mkdir -p backend/tests/{unit,integration,e2e,fixtures}

# Create logs directory
mkdir -p backend/logs
```

**Deliverables:**
- [ ] All folders created
- [ ] .gitkeep files in empty folders
- [ ] Updated .gitignore

### Milestone 1.2: Install Dependencies

**New packages:**
```bash
npm install --save module-alias    # For path aliases
npm install --save winston          # Better logging
npm install --save joi              # Validation
npm install --save express-rate-limit  # Rate limiting (upgrade)
```

**package.json updates:**
```json
{
  "_moduleAliases": {
    "@": "backend/src",
    "@api": "backend/src/api",
    "@services": "backend/src/services",
    "@database": "backend/src/database",
    "@config": "backend/src/config",
    "@utils": "backend/src/utils",
    "@models": "backend/src/models",
    "@providers": "backend/src/providers"
  },
  "scripts": {
    "dev": "nodemon -r module-alias/register src/server.js",
    "start": "node -r module-alias/register src/server.js",
    "test": "jest --coverage",
    "migrate:up": "node scripts/database/migrate.js up",
    "migrate:down": "node scripts/database/migrate.js down",
    "seed": "node scripts/database/seed.js",
    "cron:gold": "node scripts/cron/fetch-gold-prices.js",
    "lint": "eslint src/ --fix"
  }
}
```

**Deliverables:**
- [ ] Dependencies installed
- [ ] package.json updated
- [ ] npm scripts configured

### Milestone 1.3: Setup Config Files

**Create:**
- [ ] `src/config/database.config.js` - Move from config/database.js
- [ ] `src/config/constants.config.js` - Move from config/constants.js
- [ ] `src/config/env.config.js` - New file for env parsing
- [ ] `src/config/logger.config.js` - New winston logger
- [ ] `ecosystem.config.js` - PM2 config for production

**Deliverables:**
- [ ] All config files created
- [ ] Environment variables validated
- [ ] Logger working

---

## 📦 Phase 2: Code Migration (Week 2)

### Milestone 2.1: Move Controllers

**Action:**
```bash
# Rename and move
mv backend/controllers/eventsController.js backend/src/api/controllers/events.controller.js
mv backend/controllers/fashionController.js backend/src/api/controllers/fashion.controller.js
mv backend/controllers/feedbackController.js backend/src/api/controllers/feedback.controller.js
mv backend/controllers/goldController.js backend/src/api/controllers/gold.controller.js
mv backend/controllers/notesController_with_db.js backend/src/api/controllers/notes.controller.js
mv backend/controllers/toolsController.js backend/src/api/controllers/tools.controller.js
mv backend/controllers/weatherController.js backend/src/api/controllers/weather.controller.js
mv backend/controllers/weddingController.js backend/src/api/controllers/wedding.controller.js
mv backend/controllers/wishlistController.js backend/src/api/controllers/wishlist.controller.js

# Delete old files
rm backend/controllers/notesController.js  # Old version without DB
```

**Refactor each controller:**
- Update imports to use module aliases
- Extract business logic to services
- Keep only HTTP handling logic
- Use standardized response format

**Deliverables:**
- [ ] 9 controllers moved and refactored
- [ ] Imports updated
- [ ] Old controllers/ folder removed

### Milestone 2.2: Move Routes

**Action:**
```bash
# Rename and move
mv backend/routes/events.js backend/src/api/routes/events.routes.js
mv backend/routes/fashion.js backend/src/api/routes/fashion.routes.js
mv backend/routes/feedback.js backend/src/api/routes/feedback.routes.js
mv backend/routes/gold.js backend/src/api/routes/gold.routes.js
mv backend/routes/notes.js backend/src/api/routes/notes.routes.js
mv backend/routes/tools.js backend/src/api/routes/tools.routes.js
mv backend/routes/weather.js backend/src/api/routes/weather.routes.js
mv backend/routes/wedding.js backend/src/api/routes/wedding.routes.js
mv backend/routes/wishlist.js backend/src/api/routes/wishlist.routes.js
```

**Create index router:**
```javascript
// backend/src/api/routes/index.js
const express = require('express')
const router = express.Router()

router.use('/events', require('./events.routes'))
router.use('/fashion', require('./fashion.routes'))
router.use('/feedback', require('./feedback.routes'))
router.use('/gold', require('./gold.routes'))
router.use('/notes', require('./notes.routes'))
router.use('/tools', require('./tools.routes'))
router.use('/weather', require('./weather.routes'))
router.use('/wedding-urls', require('./wedding.routes'))
router.use('/wishlist', require('./wishlist.routes'))

module.exports = router
```

**Deliverables:**
- [ ] 9 route files moved
- [ ] Main router created
- [ ] Imports updated
- [ ] Old routes/ folder removed

### Milestone 2.3: Create Middlewares

**New files:**
```javascript
// backend/src/api/middlewares/auth.middleware.js
// Move from utils/auth.js and enhance

// backend/src/api/middlewares/error.middleware.js
// Global error handler

// backend/src/api/middlewares/logger.middleware.js
// Request/response logging

// backend/src/api/middlewares/rateLimit.middleware.js
// Rate limiting configurations

// backend/src/api/middlewares/validate.middleware.js
// Input validation with Joi
```

**Deliverables:**
- [ ] 5 middleware files created
- [ ] Integrated in app.js
- [ ] Tests written

### Milestone 2.4: Create Services

**Extract business logic from controllers:**
```javascript
// backend/src/services/gold.service.js
// Business logic for gold prices

// backend/src/services/weather.service.js
// Business logic for weather

// backend/src/services/currency.service.js
// Business logic for currency

// backend/src/services/auth.service.js
// Authentication logic
```

**Deliverables:**
- [ ] 4+ service files created
- [ ] Business logic extracted from controllers
- [ ] Unit tests for services

### Milestone 2.5: Create Repositories

**Data access layer:**
```javascript
// backend/src/database/repositories/base.repository.js
// Base class with common CRUD

// backend/src/database/repositories/gold.repository.js
// Gold data access

// backend/src/database/repositories/weather.repository.js
// Weather data access

// backend/src/database/repositories/wedding.repository.js
// Wedding URLs data access

// backend/src/database/repositories/user.repository.js
// User data access
```

**Deliverables:**
- [ ] Base repository created
- [ ] 4+ repository files created
- [ ] SQL queries moved from controllers

### Milestone 2.6: Organize Providers

**Move and organize:**
```bash
# Move providers
mv backend/providers/currency/vietcombank.js backend/src/providers/currency/vietcombank.provider.js
mv backend/providers/currency/exchangerate.js backend/src/providers/currency/exchangerate.provider.js
mv backend/providers/gold/sjc.js backend/src/providers/gold/sjc.provider.js
mv backend/providers/gold/pnj.js backend/src/providers/gold/pnj.provider.js
mv backend/providers/gold/mockProvider.js backend/src/providers/gold/mock.provider.js
```

**Deliverables:**
- [ ] All providers moved
- [ ] Naming convention applied
- [ ] Imports updated

### Milestone 2.7: Create Models

**Data models:**
```javascript
// backend/src/models/GoldRate.model.js
// backend/src/models/WeatherData.model.js
// backend/src/models/WeddingUrl.model.js
// backend/src/models/User.model.js
```

**Deliverables:**
- [ ] 4+ model files created
- [ ] Data validation in models
- [ ] toJSON() methods

### Milestone 2.8: Move Utils

**Action:**
```bash
mv backend/utils/auth.js backend/src/utils/auth.util.js
mv backend/utils/validation.js backend/src/utils/validation.util.js
# Create new utils
# backend/src/utils/response.util.js
# backend/src/utils/date.util.js
# backend/src/utils/crypto.util.js
```

**Deliverables:**
- [ ] Utils moved and renamed
- [ ] New utility files created
- [ ] Standardized response format

### Milestone 2.9: Reorganize Scripts

**Move scripts:**
```bash
# Database scripts
mv backend/scripts/setup-database.js backend/scripts/database/setup.js
mv backend/scripts/run-migration.js backend/scripts/database/migrate.js
mv backend/scripts/seed.js backend/scripts/database/seed.js

# Cron scripts
mv backend/scripts/fetch-gold.js backend/scripts/cron/fetch-gold-prices.js

# Dev scripts
mv backend/check-user.js backend/scripts/dev/check-user.js
mv backend/seed-test-user.js backend/scripts/dev/seed-test-data.js

# Delete obsolete scripts
rm backend/apply-user-seed.js
rm backend/check-users.js
rm backend/quick-seed-user.js
rm backend/test-shopee-direct.js
rm backend/test-vnappmob.js
rm backend/run-missing-migrations.js
rm backend/scripts/migrate-*.js  # Old migration scripts
```

**Deliverables:**
- [ ] Scripts organized by category
- [ ] Obsolete scripts removed
- [ ] npm scripts updated

### Milestone 2.10: Update Main Files

**Refactor app.js:**
```javascript
// backend/src/app.js
require('module-alias/register')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const logger = require('@config/logger.config')
const routes = require('@api/routes')
const errorMiddleware = require('@api/middlewares/error.middleware')
const loggerMiddleware = require('@api/middlewares/logger.middleware')

const app = express()

// Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(loggerMiddleware)

// Routes
app.use('/api', routes)

// Error handling
app.use(errorMiddleware)

module.exports = app
```

**Create server.js:**
```javascript
// backend/src/server.js
require('module-alias/register')
const app = require('./app')
const logger = require('@config/logger.config')
const { PORT } = require('@config/env.config')

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server...')
  server.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})
```

**Deliverables:**
- [ ] app.js refactored with module aliases
- [ ] server.js created
- [ ] Graceful shutdown implemented

---

## 📦 Phase 3: Testing & QA (Week 3)

### Milestone 3.1: Update Tests

**Move tests:**
```bash
mkdir -p backend/tests/unit/controllers
mkdir -p backend/tests/unit/services
mkdir -p backend/tests/integration/api

# Move existing tests
mv backend/tests/*.test.js backend/tests/integration/api/
```

**Write new tests:**
- [ ] Unit tests for services
- [ ] Unit tests for repositories
- [ ] Unit tests for utils
- [ ] Integration tests for API endpoints

**Deliverables:**
- [ ] All tests passing
- [ ] Coverage >= 80%
- [ ] Test organization improved

### Milestone 3.2: Manual QA

**Test scenarios:**
- [ ] All API endpoints work
- [ ] Database migrations run
- [ ] Cron jobs execute
- [ ] Error handling works
- [ ] Logging works
- [ ] Authentication works

**Deliverables:**
- [ ] QA checklist complete
- [ ] No regressions found
- [ ] Performance acceptable

### Milestone 3.3: Documentation

**Update docs:**
- [ ] `docs/BACKEND_STRUCTURE.md` - Already created
- [ ] `docs/API_DOCUMENTATION.md` - Update with new paths
- [ ] `backend/README.md` - Update setup instructions
- [ ] `docs/DEPLOYMENT.md` - Update deployment process

**Deliverables:**
- [ ] All documentation updated
- [ ] README clear for new developers
- [ ] Architecture diagrams added

---

## 📦 Phase 4: Deployment (Week 4)

### Milestone 4.1: Pre-deployment

**Tasks:**
- [ ] Create deployment branch: `refactor/backend-structure`
- [ ] Final code review
- [ ] Run all tests in CI/CD
- [ ] Build Docker image
- [ ] Test on staging environment

**Deliverables:**
- [ ] Code reviewed and approved
- [ ] All tests passing in CI
- [ ] Staging deployment successful

### Milestone 4.2: Production Deployment

**Deployment steps:**
```bash
# 1. Merge to main
git checkout main
git merge refactor/backend-structure

# 2. Tag release
git tag -a v2.0.0 -m "Backend restructure - Clean Architecture"
git push origin v2.0.0

# 3. Deploy to Railway
# Railway auto-deploys on push to main

# 4. Run migrations on production
railway run npm run migrate:up

# 5. Restart services
railway restart
```

**Rollback plan:**
```bash
# If issues arise:
git revert HEAD~1
git push origin main
railway restart
```

**Deliverables:**
- [ ] Production deployment successful
- [ ] Zero downtime achieved
- [ ] Monitoring active
- [ ] No critical errors in 24h

### Milestone 4.3: Post-deployment

**Tasks:**
- [ ] Monitor logs for 24 hours
- [ ] Check performance metrics
- [ ] Verify all features work
- [ ] Update team documentation
- [ ] Announce completion

**Deliverables:**
- [ ] System stable
- [ ] Team trained on new structure
- [ ] Migration complete

---

## 🔄 Rollback Strategy

**If critical issues found:**

### Option 1: Quick Revert
```bash
# Revert last commit
git revert HEAD
git push origin main
railway restart
```

### Option 2: Full Rollback
```bash
# Rollback to previous tag
git checkout v1.5.0
git push origin main --force
railway restart
```

### Option 3: Hotfix
```bash
# Create hotfix branch
git checkout -b hotfix/issue-name
# Fix issue
git commit -m "fix: critical issue"
git push origin hotfix/issue-name
# Merge and deploy
```

---

## ✅ Checklist Before Migration

- [ ] Backup production database
- [ ] Document current API endpoints
- [ ] Notify team of migration timeline
- [ ] Setup monitoring alerts
- [ ] Prepare rollback plan
- [ ] Test on local environment
- [ ] Test on staging environment
- [ ] Get approval from tech lead

---

## 📊 Success Metrics

**Technical:**
- [ ] All tests passing (>= 80% coverage)
- [ ] No breaking API changes
- [ ] Response time < 500ms (maintained)
- [ ] Zero downtime deployment
- [ ] No critical bugs in 7 days

**Team:**
- [ ] Developer onboarding time reduced 50%
- [ ] Code review time reduced 30%
- [ ] Bug fix time reduced 40%
- [ ] Feature development velocity increased 25%

---

## 🎯 Benefits Expected

### Short-term (Week 1-4)
- ✅ Cleaner codebase
- ✅ Better organized files
- ✅ Easier to navigate

### Medium-term (Month 1-3)
- ✅ Faster feature development
- ✅ Easier testing
- ✅ Better code quality

### Long-term (6+ months)
- ✅ Easier to scale team
- ✅ Easier to maintain
- ✅ Reduced technical debt

---

## 👥 Team Responsibilities

**Tech Lead:**
- [ ] Review migration plan
- [ ] Approve architecture decisions
- [ ] Final code review

**Backend Developer:**
- [ ] Execute migration
- [ ] Write tests
- [ ] Update documentation

**QA Engineer:**
- [ ] Manual testing
- [ ] Regression testing
- [ ] Performance testing

**DevOps:**
- [ ] Setup CI/CD for new structure
- [ ] Monitor deployment
- [ ] Handle rollback if needed

---

## 📞 Support

**Questions?**
- Tech Lead: [contact]
- Backend Team: [slack-channel]
- Documentation: docs/BACKEND_STRUCTURE.md

---

**Status:** 📝 Ready to Execute  
**Created:** 2025-11-12  
**Estimated Completion:** 2025-12-03 (3 weeks)  
**Risk Level:** Medium (well-planned, good tests, rollback ready)
