# 🏗️ Architecture

**Purpose:** Project structure, database schema, and API documentation

---

## 📚 Documents in This Section

### [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
Overall project architecture and folder organization
- Monorepo structure (backend + frontend)
- Folder hierarchy and conventions
- Component organization
- Import paths and module resolution
- Clean Architecture principles

### [BACKEND_STRUCTURE.md](BACKEND_STRUCTURE.md)
Backend architecture details
- Express.js setup
- Controller-Route-Database pattern
- Middleware stack
- Database connection pooling
- Error handling strategy
- API versioning

### [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
Complete database design
- All tables with columns and types
- Relationships and foreign keys
- Indexes and constraints
- Soft delete pattern
- Audit fields (created_at, updated_at)
- Sample queries

### [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
REST API reference
- All endpoints with examples
- Request/response formats
- Authentication (JWT)
- Error codes
- Rate limiting
- Testing with curl/Postman

---

## 🎯 Architecture Highlights

### Tech Stack
- **Backend:** Node.js + Express.js + PostgreSQL
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Database:** PostgreSQL 13+ with uuid extension
- **Auth:** JWT Bearer tokens

### Key Patterns
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ Soft delete (never hard delete user data)
- ✅ UUID primary keys
- ✅ RESTful API design
- ✅ Component-based UI

---

## 🔗 Related Sections

- **Getting Started:** [../01-getting-started/](../01-getting-started/) - Setup instructions
- **Development:** [../03-development/](../03-development/) - How to build features
- **Features:** [../04-features/](../04-features/) - Feature-specific docs

---

**Last Updated:** 2025-11-13
