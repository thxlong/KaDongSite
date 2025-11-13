# 📐 Project Structure - KaDong Personal Utilities

**Version:** 2.0.0  
**Last Updated:** 2025-11-13  
**Architecture:** Monorepo với Feature-Based Frontend + Clean Architecture Backend

---

## 🎯 **Overview**

KaDong Personal Utilities là một monorepo project bao gồm:
- **Frontend**: React SPA với feature-based architecture
- **Backend**: Node.js API với clean architecture (7 layers)
- **Docs**: Comprehensive documentation (6 sections)
- **Specs**: Specification-driven development workflow

---

## 📁 **High-Level Structure**

```
KaDongSite/                           # Project Root (Monorepo)
│
├── frontend/                         # 🎨 Frontend Application
│   ├── src/
│   │   ├── app/                     # Application core
│   │   ├── features/                # Feature modules (8 tools)
│   │   ├── shared/                  # Shared resources
│   │   ├── assets/                  # Static assets
│   │   └── styles/                  # Global styles
│   ├── tests/                       # Playwright E2E tests
│   ├── public/                      # Public assets
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   ├── playwright.config.js        # Test configuration
│   ├── package.json                # Frontend dependencies
│   └── README.md                   # Frontend documentation
│
├── backend/                          # ⚙️ Backend API
│   ├── src/
│   │   ├── api/                    # Routes & Controllers
│   │   ├── services/               # Business logic
│   │   ├── repositories/           # Data access
│   │   ├── models/                 # Data models
│   │   ├── database/               # Database layer
│   │   ├── providers/              # External services
│   │   ├── config/                 # Configuration
│   │   └── utils/                  # Utilities
│   ├── tests/                       # Playwright API tests
│   ├── scripts/                     # Utility scripts
│   ├── playwright.config.js        # Test configuration
│   ├── package.json                # Backend dependencies
│   └── README.md                   # Backend documentation
│
├── docs/                            # 📚 Documentation
│   ├── 01-getting-started/         # Quick start guides
│   ├── 02-architecture/            # System design
│   ├── 03-development/             # Dev guides
│   ├── 04-features/                # Feature docs
│   ├── 05-operations/              # Deployment
│   ├── 06-migration/               # Migration guides
│   └── dev-notes/                  # Development notes
│
├── specs/                           # 📋 Specifications
│   ├── templates/                  # Spec templates
│   ├── plans/                      # Implementation plans
│   ├── tasks/                      # Task breakdowns
│   └── COMMANDS.md                 # Spec workflow commands
│
├── package.json                     # Workspace root config
├── project_manifest.json           # Project metadata
├── QUICKSTART.md                   # Quick start guide
└── README.md                       # Project overview
```

---

## 🏗️ **Architecture Overview**

### **Frontend: Feature-Based Architecture**

```
frontend/src/
│
├── app/                              # Application Core
│   └── App.jsx                       # Routing + Layout
│
├── features/                         # Independent Feature Modules
│   ├── home/                        # Landing page
│   ├── notes/                       # Notes tool
│   ├── calendar/                    # Calendar tool
│   ├── countdown/                   # Countdown tool
│   ├── currency/                    # Currency converter
│   ├── fashion/                     # Fashion manager
│   ├── gold/                        # Gold prices
│   ├── weather/                     # Weather forecast
│   ├── wedding/                     # Wedding invitation
│   └── wishlist/                    # Wishlist
│
└── shared/                          # Shared Resources
    ├── components/                  # UI components
    ├── utils/                       # Utilities
    └── config/                      # Constants
```

**Principles:**
- ✅ Each feature is self-contained
- ✅ Shared code in `/shared`
- ✅ Clear separation of concerns
- ✅ Easy to add/remove features

### **Backend: Clean Architecture (7 Layers)**

```
backend/src/
│
├── api/                              # Layer 1: API Routes
│   ├── routes/                      # Route definitions
│   └── controllers/                 # Request handlers
│
├── services/                        # Layer 2: Business Logic
│   └── domain/                      # Domain services
│
├── repositories/                    # Layer 3: Data Access
│   └── (entity)Repository.js
│
├── models/                          # Layer 4: Data Models
│   └── (entity).model.js
│
├── database/                        # Layer 5: Database Layer
│   ├── connection.js
│   └── migrations/
│
├── providers/                       # Layer 6: External Services
│   └── (service)Provider.js
│
└── utils/                           # Layer 7: Utilities
    └── helpers/
```

**Principles:**
- ✅ Dependency inversion (layers only depend on inner layers)
- ✅ Separation of concerns
- ✅ Testable & maintainable
- ✅ SOLID principles

---

## 📊 **Key Technologies**

### **Frontend Stack**
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.2.0 | UI library |
| Vite | ^5.0.8 | Build tool |
| React Router | ^6.20.0 | Routing |
| Tailwind CSS | ^3.3.6 | Styling |
| Framer Motion | ^10.16.16 | Animations |
| Playwright | ^1.56.1 | E2E testing |

### **Backend Stack**
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ^20.0.0 | Runtime |
| Express | ^4.18.2 | Web framework |
| PostgreSQL | ^8.11.3 | Database |
| Playwright | ^1.40.0 | API testing |
| Winston | ^3.18.3 | Logging |

---

## 🚀 **Getting Started**

### **Quick Start (Workspace)**

```bash
# 1. Install all dependencies (monorepo)
npm install

# 2. Setup database
npm run db:setup

# 3. Start development (both frontend + backend)
npm run dev:all

# 4. Access application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### **Individual Services**

```bash
# Frontend only
cd frontend
npm install
npm run dev

# Backend only
cd backend
npm install
npm run dev
```

---

## 🧪 **Testing**

### **Frontend E2E Tests**
```bash
cd frontend
npm test                 # All E2E tests
npm run test:chromium   # Chrome only
npm run test:firefox    # Firefox only
npm run test:webkit     # Safari only
npm run test:watch      # Interactive mode
```

### **Backend API Tests**
```bash
cd backend
npm test                # All API tests
npm run test:api       # API tests only
npm run test:watch     # Interactive mode
```

---

## 📚 **Documentation Structure**

### **01 - Getting Started**
- `QUICKSTART.md` - 5-minute quick start
- `SETUP_GUIDE.md` - Detailed setup
- `TROUBLESHOOTING.md` - Common issues

### **02 - Architecture**
- `ARCHITECTURE.md` - System design
- `DATABASE_SCHEMA.md` - DB structure
- `API_DOCUMENTATION.md` - API reference

### **03 - Development**
- `CONTRIBUTING.md` - How to contribute
- `TESTING_GUIDE.md` - Testing strategy
- `CODE_STYLE.md` - Style guide

### **04 - Features**
- 8 feature documentation files
- Usage guides
- API endpoints

### **05 - Operations**
- `DEPLOYMENT.md` - Deploy guide
- `MAINTENANCE.md` - Maintenance tasks

### **06 - Migration**
- `CHANGELOG.md` - Version history
- Migration guides

---

## 🎯 **Features (8 Tools)**

| Tool | Frontend Route | Backend API | Description |
|------|---------------|-------------|-------------|
| 🏠 Home | `/` | - | Landing page |
| 📝 Notes | `/notes` | `/api/notes` | Personal notes |
| 📅 Calendar | `/calendar` | `/api/calendar` | Important events |
| ⏱️ Countdown | `/countdown` | `/api/countdown` | Special day countdown |
| 💱 Currency | `/currency` | `/api/currency` | Currency converter |
| 👗 Fashion | `/fashion` | `/api/fashion` | Outfit manager |
| 💰 Gold | `/gold` | `/api/gold` | Gold prices |
| 🌤️ Weather | `/weather` | - | Weather forecast |
| 💒 Wedding | `/wedding-invitation` | - | Wedding invites |
| 🎁 Wishlist | `/wishlist` | `/api/wishlist` | Wish list |

---

## 🔧 **Development Workflow**

### **Spec-Driven Development**

```bash
# 1. Create specification
/specify {feature_name}

# 2. Create implementation plan
/plan {spec_id}

# 3. Break down into tasks
/tasks {plan_id} {phase}

# 4. Implement task
/implement {task_id}

# 5. Review
/review {file}
```

See [`specs/COMMANDS.md`](specs/COMMANDS.md) for details.

### **Git Workflow**

```bash
# Feature branch
git checkout -b feature/my-feature

# Commit with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update readme"

# Push and create PR
git push origin feature/my-feature
```

---

## 📦 **Package Scripts (Root)**

### **Development**
```bash
npm run dev              # Start frontend only
npm run dev:backend      # Start backend only
npm run dev:all          # Start both (recommended)
```

### **Build**
```bash
npm run build            # Build frontend for production
```

### **Database**
```bash
npm run db:setup         # Initialize database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed data
npm run db:test          # Test connection
```

### **Testing**
```bash
npm test                 # Run frontend E2E tests
npm run test:api         # Run backend API tests
npm run test:e2e         # Run all E2E tests
```

---

## 🌳 **Workspace Management**

This is an **npm workspaces** monorepo:

```json
// package.json
{
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

**Benefits:**
- ✅ Shared `node_modules` (disk space saving)
- ✅ Hoisted dependencies
- ✅ Run scripts in workspaces
- ✅ Single `npm install` for all

**Commands:**
```bash
# Install in specific workspace
npm install axios --workspace=backend

# Run script in workspace
npm run dev --workspace=frontend

# Install all workspaces
npm install
```

---

## 📂 **File Organization**

### **What Goes Where?**

| Type | Location | Example |
|------|----------|---------|
| Frontend feature | `frontend/src/features/{name}/` | `notes/NotesPage.jsx` |
| Shared UI component | `frontend/src/shared/components/` | `Header.jsx` |
| Backend API route | `backend/src/api/routes/` | `notesRoutes.js` |
| Backend service | `backend/src/services/domain/` | `NotesService.js` |
| Database migration | `backend/src/database/migrations/` | `001_create_notes.sql` |
| Documentation | `docs/{section}/` | `03-development/TESTING_GUIDE.md` |
| Spec | `specs/` | `01_notes.spec` |
| Test | `{workspace}/tests/` | `frontend/tests/e2e/notes.spec.js` |

---

## 🔒 **Environment Variables**

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_APP_VERSION=2.0.0
```

### **Backend (.env)**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/kadong
JWT_SECRET=your-secret-key
```

---

## 📊 **Project Stats**

### **Codebase**
- **Frontend**: ~15,000 lines (JSX + CSS)
- **Backend**: ~8,000 lines (JavaScript)
- **Tests**: ~2,000 lines (Playwright)
- **Docs**: ~5,000 lines (Markdown)

### **Features**
- **Tools**: 8 productivity tools
- **API Endpoints**: 35+ endpoints
- **Database Tables**: 12 tables
- **Test Coverage**: 80%+ (target)

---

## 🎓 **Learning Resources**

### **Frontend**
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Backend**
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### **Testing**
- [Playwright Docs](https://playwright.dev/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)

---

## 🤝 **Contributing**

1. Read [`docs/03-development/CONTRIBUTING.md`](docs/03-development/CONTRIBUTING.md)
2. Follow spec-driven workflow ([`specs/COMMANDS.md`](specs/COMMANDS.md))
3. Write tests for new features
4. Update documentation
5. Follow code style guidelines

---

## 📝 **Migration History**

### **v2.0.0 (2025-11-13) - Frontend Restructure**
- ✅ Migrated to feature-based architecture
- ✅ Moved all frontend code to `frontend/` directory
- ✅ Implemented monorepo with npm workspaces
- ✅ Updated all import paths
- ✅ Created comprehensive documentation

### **v1.5.0 (2025-11-12) - Testing Framework**
- ✅ Migrated from Jest/Cypress to Playwright
- ✅ Unified testing framework (API + E2E)
- ✅ Cross-browser testing support

### **v1.0.0 (2025-11-10) - Initial Release**
- ✅ Backend clean architecture
- ✅ 8 core features implemented
- ✅ Documentation structure

---

## 🔗 **Quick Links**

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [API Documentation](docs/02-architecture/API_DOCUMENTATION.md)
- [Database Schema](docs/02-architecture/DATABASE_SCHEMA.md)
- [Testing Guide](docs/03-development/TESTING_GUIDE.md)
- [Quick Start](QUICKSTART.md)

---

**Maintained with ❤️ by KaDong Team**  
**Last Updated:** 2025-11-13  
**Version:** 2.0.0
