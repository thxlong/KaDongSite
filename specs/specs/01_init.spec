# Spec: Project Initialization & Structure

**Spec ID:** `01_init`  
**Version:** 1.0.0  
**Status:** ✅ Completed  
**Created:** 2024-11-01  
**Last Updated:** 2025-11-12  
**Overall Progress:** 95%

---

## 📋 Overview

**Title:** KaDong Tools - Personal Utilities Platform  
**Type:** Full-Stack Web Application  
**Stack:** React + Node.js + PostgreSQL

**Purpose:**  
Create a personal utilities website for couples with tools for notes, countdowns, calendar, currency conversion, fashion outfit planning, and gold price tracking.

---

## 🎯 Goals

1. **User-Friendly Interface**
   - Pastel color theme
   - Responsive design (mobile + desktop)
   - Smooth animations with Framer Motion

2. **Data Persistence**
   - PostgreSQL database for reliable storage
   - Soft delete for all records
   - UUID-based primary keys

3. **Modular Architecture**
   - Each tool is independent
   - Reusable components
   - Clear API contracts

4. **Developer Experience**
   - Clear documentation
   - Standardized code style
   - Easy setup process

---

## ✅ Acceptance Criteria

### 1. Project Structure
- [x] Frontend: React 18 + Vite + Tailwind CSS
- [x] Backend: Express.js + PostgreSQL
- [x] Database: Properly configured with migrations
- [x] Documentation: Comprehensive docs in `/docs`
- [x] Version Control: Git with conventional commits

### 2. Core Features
- [x] Notes Tool - CRUD operations with color coding ✅
- [x] Countdown Tool - Event tracking with real-time countdown ✅
- [ ] Calendar Tool - Month view with event display ⏳ (Backend ready, frontend TBD)
- [x] Currency Tool - Multi-currency conversion ✅
- [x] Fashion Tool - Outfit color matching with preview ✅
- [x] Gold Prices Tool - Vietnamese gold price tracking ✅
- [x] Weather Tool - City weather with favorites ✅ (Added 2025)
- [x] Wishlist Tool - Product wishlist with hearts & comments ✅ (Added 2025)

### 3. Technical Requirements
- [x] REST API with standardized responses ✅
- [x] Input validation on backend ✅
- [x] Error handling with user-friendly messages ✅
- [x] Security: SQL injection prevention, XSS prevention ✅
- [x] Performance: Response time < 500ms ✅
- [x] Code quality: ESLint + Prettier configured ✅
- [ ] Automated Testing: Unit + Integration tests ⚠️ 0% coverage (In Progress)

### 4. Database Schema
- [x] Users table with authentication fields ✅
- [x] Sessions table for auth tokens ✅
- [x] Notes table with soft delete ✅
- [x] Countdown_events table ✅
- [x] Fashion_outfits table ✅
- [x] Currency_rates table ✅
- [x] Gold_rates table with indexes ✅
- [x] Weather_cache table ✅ (Added 2025)
- [x] Favorite_cities table ✅ (Added 2025)
- [x] Wishlist_items table ✅ (Added 2025)
- [x] Wishlist_hearts table ✅ (Added 2025)
- [x] Wishlist_comments table ✅ (Added 2025)
- [x] Feedback table ✅ (Added 2025)
- [x] Tools table for tool metadata ✅
- [x] Migrations table for version tracking ✅
- [x] Audit fields (created_at, updated_at, deleted_at) ✅

### 5. Documentation
- [x] README.md with project overview
- [x] SETUP_INSTALLATION.md with step-by-step guide
- [x] API_DOCUMENTATION.md with all endpoints
- [x] DATABASE_SCHEMA.md with ERD
- [x] TROUBLESHOOTING.md with common issues
- [x] Dev-notes structure for tracking progress

---

## 🏗️ Architecture

### Frontend (Port 5173)
```
src/
├── components/       # Reusable UI components
│   ├── Header.jsx
│   ├── SidebarMenu.jsx
│   ├── Footer.jsx
│   └── gold/         # Gold tool components
├── pages/            # Route pages
│   ├── Home.jsx
│   ├── NotesTool.jsx
│   ├── CountdownTool.jsx
│   ├── CalendarTool.jsx
│   ├── CurrencyTool.jsx
│   ├── FashionTool.jsx
│   └── GoldPricesTool.jsx
├── config/           # Configuration
│   └── constants.js
└── main.jsx          # Entry point
```

### Backend (Port 5000)
```
backend/
├── controllers/      # Business logic
│   ├── noteController.js
│   ├── eventController.js
│   ├── fashionController.js
│   └── goldController.js
├── routes/           # API routes
│   ├── notes.js
│   ├── events.js
│   ├── fashion.js
│   └── gold.js
├── config/           # Configuration
│   ├── database.js
│   └── constants.js
├── database/
│   ├── migrations/   # SQL migrations
│   └── seeds/        # Seed data
├── providers/        # External data providers
│   └── mockProvider.js
└── app.js            # Express app entry
```

### Database
```sql
-- Core Tables
users (id UUID, email, password_hash, name, role)
notes (id UUID, user_id, title, content, color, pinned)
countdown_events (id UUID, user_id, title, target_date, theme)
fashion_outfits (id UUID, user_id, name, shirt_color, pants_color, shoes_color)
gold_rates (id UUID, type, source, buy_price, sell_price, currency, fetched_at)
currency_rates (id UUID, base_currency, rates JSONB)
```

---

## 📝 Implementation Notes

### 1. Technology Choices

**Why React?**
- Component reusability
- Large ecosystem
- Fast development with Vite

**Why PostgreSQL?**
- ACID transactions
- Rich data types (JSONB for metadata)
- Mature and reliable

**Why Tailwind CSS?**
- Utility-first approach
- Fast styling
- Consistent design system

### 2. Key Decisions

**UUID over Auto-increment:**
- Better for distributed systems
- No ID guessing attacks
- Easier data migration

**Soft Delete:**
- Data recovery possible
- Audit trail
- User mistakes reversible

**API Response Format:**
```json
{
  "success": true|false,
  "data": {},
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}
```

### 3. Security Measures

- ✅ Parameterized SQL queries (no string concatenation)
- ✅ Input validation (whitelist approach)
- ✅ XSS prevention (React auto-escaping)
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Environment variables for secrets
- ✅ bcrypt for password hashing

---

## 🧪 Testing Strategy

### Unit Tests
- Controller functions
- Utility functions
- Validation logic

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests
- User workflows
- Form submissions
- Navigation

**Coverage Target:** 80%

---

## 🚀 Deployment

### Frontend
- Platform: Vercel
- Auto-deploy from `main` branch
- Environment: `VITE_API_BASE_URL`

### Backend
- Platform: Railway / Heroku
- Auto-deploy from `main` branch
- Environment: `DATABASE_URL`, `JWT_SECRET`

### Database
- Platform: Supabase
- Automated backups
- SSL enabled

---

## 📊 Success Metrics

### Performance
- Page load: < 2 seconds
- API response: < 500ms
- Database query: < 100ms

### Code Quality
- ESLint: 0 errors ✅
- Test coverage: 0% ⚠️ (Target: > 80%, In Progress)
- Build: No warnings ✅

### User Experience
- Mobile responsive: 100%
- Accessibility: WCAG AA
- Browser support: Chrome, Firefox, Safari, Edge (latest)

---

## 🔄 Dependencies

### Frontend
- react@18.2.0
- react-router-dom@6.20.0
- framer-motion@10.16.16
- lucide-react (icons)
- date-fns (date utilities)
- recharts (charts for gold prices)

### Backend
- express@4.18.2
- pg@8.11.3 (PostgreSQL client)
- cors, dotenv, body-parser
- bcrypt, jsonwebtoken
- node-cron (for gold price fetching)

### Dev Dependencies
- vite, tailwindcss
- eslint, prettier
- nodemon
- jest, supertest

---

## 📅 Timeline

| Phase | Duration | Status | Notes |
|-------|----------|--------|-------|
| Setup & Structure | Week 1 | ✅ Done | 2024-11 |
| Database Design | Week 1 | ✅ Done | 15 tables created |
| Backend API | Week 2-3 | ✅ Done | 9 controllers, 10 routes |
| Frontend UI | Week 3-4 | 🟡 Mostly Done | Some tools incomplete |
| Testing Framework | Week 5 | 🚧 In Progress | Phase 1 complete (15%) |
| Testing Implementation | Week 6-7 | ⏳ Planned | Target: 196 tests, 80% coverage |
| Documentation | Week 5 | ✅ Done | API docs, setup guides |
| Deployment | Week 8 | ⏳ Pending | After testing complete |

---

## 🔗 Related Specs

### Core Features
- `02_notes_tool.spec` - Notes functionality ✅
- `03_wishlist_management.spec` - Wishlist with hearts & comments ✅ (Backend 100%, Tests 0%)
- `04_api_testing_framework.spec` - Comprehensive testing 🚧 (Phase 1: 100%)
- `05_gold_prices.spec` - Gold price tracking ✅

### Future Specs
- `06_calendar_tool.spec` - Calendar integration ⏳
- `07_weather_tool.spec` - Weather feature documentation ⏳
- `08_e2e_testing.spec` - Frontend E2E tests ⏳

---

## 📚 References

- [Project Manifest](../project_manifest.json)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Database Schema](../docs/DATABASE_SCHEMA.md)
- [Setup Guide](../docs/SETUP_INSTALLATION.md)

---

## 📊 Current Status Summary (2025-11-12)

### ✅ Completed (95%)

**Backend Infrastructure:**
- ✅ 9 Controllers fully implemented (2,000+ lines)
- ✅ 10 API routes configured
- ✅ 15 database tables with migrations
- ✅ PostgreSQL with UUID, soft delete, audit fields
- ✅ Security: Parameterized queries, input validation

**Features Delivered:**
- ✅ Notes Tool (CRUD, colors, pinning)
- ✅ Events/Countdown Tool (recurring events)
- ✅ Fashion Tool (outfit color matching)
- ✅ Gold Prices Tool (SJC, PNJ, DOJI tracking)
- ✅ Currency Tool (8 currencies)
- ✅ Weather Tool (OpenWeatherMap integration)
- ✅ Wishlist Tool (hearts, comments, stats)
- ✅ Feedback system

**Documentation:**
- ✅ API Documentation
- ✅ Database Schema
- ✅ Setup/Installation Guide
- ✅ Troubleshooting Guide

### ⚠️ Critical Gap: Testing (0% → Target 80%)

**Current State:**
- ❌ 0 unit tests (Target: 72)
- ❌ 0 integration tests (Target: 75)
- ❌ 0 security tests (Target: 25)
- ❌ 0 performance tests (Target: 24)
- ❌ 0% code coverage (2,000+ lines untested)

**In Progress:**
- 🚧 API Testing Framework (Phase 1: 100% - infrastructure ready)
- ✅ 29 smoke tests passing
- ⏳ Phase 2-4: Writing actual tests (Week 2-4)

**Risk Assessment:** 🔴 HIGH
- Production code deployed without automated tests
- No regression detection
- Manual testing only

### 🟡 Incomplete Features

**Frontend:**
- ⏳ Calendar Tool (Backend ready, frontend TBD)
- ⏳ Some tool UIs need polish

**Additional Features:**
- ⏳ User authentication (tables ready, controllers incomplete)
- ⏳ File uploads
- ⏳ Real-time notifications

### 📋 Next Steps (Priority Order)

**Urgent (Week 1-2):**
1. ⚠️ Complete API testing (196 tests) - Started
2. ⚠️ Achieve 80% code coverage
3. ⏳ Fix Wishlist 0% coverage (1,113 lines)

**Important (Week 3-4):**
4. ⏳ Complete Calendar tool frontend
5. ⏳ Add authentication flow tests
6. ⏳ Performance benchmarking

**Nice to Have (Week 5+):**
7. ⏳ E2E frontend tests (use: playwright)
8. ⏳ CI/CD pipeline setup
9. ⏳ Production deployment

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2024-11-01 | 1.0.0 | Initial project specification | KaDong Team |
| 2025-11-12 | 1.0.0 | Status review: 95% complete, testing gap identified | QA Team |

---

**Maintained By:** KaDong Team  
**Review Cycle:** Monthly  
**Next Review:** 2025-12-12
