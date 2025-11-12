# Spec: Project Initialization & Structure

**Spec ID:** `01_init`  
**Version:** 1.0.0  
**Status:** ✅ Completed  
**Created:** 2024-11-01  
**Last Updated:** 2025-11-11

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
- [x] Notes Tool - CRUD operations with color coding
- [x] Countdown Tool - Event tracking with real-time countdown
- [x] Calendar Tool - Month view with event display
- [x] Currency Tool - Multi-currency conversion
- [x] Fashion Tool - Outfit color matching with preview
- [x] Gold Prices Tool - Vietnamese gold price tracking

### 3. Technical Requirements
- [x] REST API with standardized responses
- [x] Input validation on backend
- [x] Error handling with user-friendly messages
- [x] Security: SQL injection prevention, XSS prevention
- [x] Performance: Response time < 500ms
- [x] Code quality: ESLint + Prettier configured

### 4. Database Schema
- [x] Users table with authentication fields
- [x] Notes table with soft delete
- [x] Countdown_events table
- [x] Fashion_outfits table
- [x] Currency_rates table
- [x] Gold_rates table with indexes
- [x] Audit fields (created_at, updated_at, deleted_at)

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
- ESLint: 0 errors
- Test coverage: > 80%
- Build: No warnings

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

| Phase | Duration | Status |
|-------|----------|--------|
| Setup & Structure | Week 1 | ✅ Done |
| Database Design | Week 1 | ✅ Done |
| Backend API | Week 2-3 | ✅ Done |
| Frontend UI | Week 3-4 | ✅ Done |
| Testing | Week 5 | 🚧 In Progress |
| Documentation | Week 5 | ✅ Done |
| Deployment | Week 6 | ⏳ Pending |

---

## 🔗 Related Specs

- `02_notes_tool.spec` - Notes functionality
- `03_countdown_tool.spec` - Countdown feature
- `04_fashion_tool.spec` - Fashion outfit matcher
- `05_gold_prices.spec` - Gold price tracking

---

## 📚 References

- [Project Manifest](../project_manifest.json)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Database Schema](../docs/DATABASE_SCHEMA.md)
- [Setup Guide](../docs/SETUP_INSTALLATION.md)

---

**Maintained By:** KaDong Team  
**Review Cycle:** Monthly  
**Next Review:** 2025-12-11
