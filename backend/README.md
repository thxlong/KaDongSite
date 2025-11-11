# 🚀 KaDong Tools Backend - PostgreSQL Integration

Backend API cho KaDong Tools với PostgreSQL database.

## 📦 Đã hoàn thành

✅ **Database Schema Design** - PostgreSQL với 7 tables
✅ **Migrations** - SQL scripts để tạo/xóa tables
✅ **Seed Data** - Test data cho development
✅ **Connection Pool** - pg driver configuration
✅ **Example Controllers** - CRUD operations với database
✅ **Helper Scripts** - Migration, seed, test scripts
✅ **Documentation** - Đầy đủ ERD, setup guide, best practices

## 🗄️ Database Structure

### Tables Created:
1. **users** - User accounts với authentication
2. **notes** - Ghi chú cá nhân với màu sắc
3. **countdown_events** - Đếm ngày kỷ niệm
4. **tools** - Cấu hình các công cụ (JSONB)
5. **feedback** - User feedback & suggestions
6. **currency_rates** - Tỷ giá tiền tệ (JSONB)
7. **sessions** - Authentication sessions

### Features:
- ✅ UUID primary keys
- ✅ Soft deletes (deleted_at)
- ✅ Auto timestamps (created_at, updated_at)
- ✅ JSONB for dynamic data
- ✅ Proper indexes & foreign keys
- ✅ Transaction support

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Cài PostgreSQL 13+
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Setup Database
```bash
# Tạo database trong PostgreSQL
psql -U postgres
CREATE DATABASE kadongsite;
\q

# Configure environment
cp .env.example .env
# Edit .env và thay đổi DATABASE_URL
```

### 4. Run Migrations & Seed
```bash
# One command để setup tất cả
npm run db:setup

# Hoặc từng bước:
npm run db:migrate:up      # Create tables
npm run db:seed            # Load test data
npm run db:test            # Test connection
```

### 5. Start Server
```bash
npm start
# hoặc development mode:
npm run dev
```

## 📚 Database Documentation

### 📖 Đọc ngay:
1. **[database/SCHEMA_DESIGN.md](database/SCHEMA_DESIGN.md)** - ERD & thiết kế database
2. **[database/SETUP_GUIDE.md](database/SETUP_GUIDE.md)** - Hướng dẫn setup chi tiết
3. **[database/BEST_PRACTICES.md](database/BEST_PRACTICES.md)** - Best practices & tips

### 📁 Files quan trọng:
```
backend/
├── config/
│   └── database.js              # Connection pool config
│
├── controllers/
│   ├── notesController.js       # Original (in-memory)
│   └── notesController_with_db.js  # New (PostgreSQL)
│
├── database/
│   ├── migrations/
│   │   ├── 001_up_initial_schema.sql
│   │   └── 001_down_rollback.sql
│   ├── seeds/
│   │   └── seed_data.sql
│   ├── queries/
│   │   └── example_queries.sql
│   └── *.md (documentation)
│
└── scripts/
    ├── migrate.js               # Migration runner
    ├── seed.js                  # Seed data loader
    └── test-db.js               # Connection test
```

## 🎯 NPM Scripts

```bash
# Development
npm start                    # Start server
npm run dev                  # Start with nodemon

# Database
npm run db:setup            # Run migrations + seed (first time)
npm run db:migrate:up       # Create tables
npm run db:migrate:down     # Drop tables (careful!)
npm run db:migrate:status   # Check migration status
npm run db:seed             # Load seed data
npm run db:test             # Test connection
```

## 🔌 Database Connection

### Environment Variables (.env):
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/kadongsite
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Connection Pool (config/database.js):
```javascript
import pool from './config/database.js'

// Simple query
const result = await pool.query('SELECT * FROM users')

// Parameterized query (safe from SQL injection)
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
)
```

## 📊 Example Queries

### Create Note:
```javascript
const { title, content, color } = req.body
const result = await query(
  `INSERT INTO notes (user_id, title, content, color)
   VALUES ($1, $2, $3, $4)
   RETURNING *`,
  [userId, title, content, color]
)
```

### Get Notes with Pagination:
```javascript
const result = await query(
  `SELECT * FROM notes 
   WHERE user_id = $1 AND deleted_at IS NULL
   ORDER BY created_at DESC
   LIMIT $2 OFFSET $3`,
  [userId, limit, offset]
)
```

### Soft Delete:
```javascript
await query(
  `UPDATE notes SET deleted_at = NOW() WHERE id = $1`,
  [noteId]
)
```

Xem thêm trong `database/queries/example_queries.sql`

## 🔄 Migration Guide

### Chuyển từ In-Memory sang PostgreSQL:

**Step 1: Backup old controller**
```bash
mv controllers/notesController.js controllers/notesController.old.js
```

**Step 2: Use new controller**
```bash
mv controllers/notesController_with_db.js controllers/notesController.js
```

**Step 3: Update imports**
```javascript
// No changes needed! API remains the same
```

**Step 4: Restart server**
```bash
npm start
```

## 🧪 Testing

### Test Database Connection:
```bash
npm run db:test
```

Output:
```
✅ Database connection successful
📅 Server time: 2024-11-11T10:30:00.000Z
🗄️  PostgreSQL version: PostgreSQL 15.3
📊 Tables: 7
   users: 3 rows
   notes: 5 rows
   ...
```

### Test API Endpoints:
```bash
# Health check
curl http://localhost:5000/api/health

# Get notes
curl http://localhost:5000/api/notes

# Create note
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello","color":"pink"}'
```

## 🔐 Security Features

- ✅ Parameterized queries (SQL injection prevention)
- ✅ Password hashing with bcrypt
- ✅ UUID primary keys (not enumerable)
- ✅ Soft deletes (data recovery)
- ✅ Connection pooling (DoS prevention)
- ✅ Environment variables (no hardcoded secrets)

## 📈 Performance Features

- ✅ Connection pooling (max 20 connections)
- ✅ Indexes on frequently queried columns
- ✅ JSONB for dynamic data
- ✅ Prepared statements caching
- ✅ Efficient pagination

## 🐛 Troubleshooting

### "Connection refused"
```bash
# Check PostgreSQL is running
# Windows: services.msc
# Linux: sudo systemctl status postgresql

# Test connection
psql -U postgres -d kadongsite
```

### "Database does not exist"
```bash
# Create database
createdb kadongsite
# Or: psql -U postgres -c "CREATE DATABASE kadongsite"
```

### "Permission denied"
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE kadongsite TO your_user;
```

### "Migration failed"
```bash
# Check migration status
npm run db:migrate:status

# Rollback if needed
npm run db:migrate:down

# Re-run
npm run db:migrate:up
```

## 📊 Monitoring

### Check Database Size:
```sql
SELECT pg_size_pretty(pg_database_size('kadongsite'));
```

### Check Active Connections:
```sql
SELECT count(*) FROM pg_stat_activity 
WHERE datname = 'kadongsite';
```

### Find Slow Queries:
```sql
EXPLAIN ANALYZE SELECT * FROM notes WHERE user_id = '...';
```

## 🚀 Production Deployment

### Checklist:
- [ ] Use connection pooling
- [ ] Enable SSL for database connection
- [ ] Set up daily backups
- [ ] Configure proper indexes
- [ ] Enable query logging
- [ ] Use environment-specific configs
- [ ] Set up monitoring (pg_stat_statements)
- [ ] Implement rate limiting
- [ ] Enable CORS properly

### Production .env:
```bash
DATABASE_URL=postgresql://user:pass@prod-host:5432/kadongsite?sslmode=require
NODE_ENV=production
JWT_SECRET=very-secure-random-string
```

## 📚 Learn More

- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [node-postgres](https://node-postgres.com/)
- [SQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Database Design](https://www.postgresql.org/docs/current/ddl.html)

## 🆘 Support

- 📧 Email: contact@kadong.com
- 📖 Documentation: `backend/database/*.md`
- 🐛 Issues: GitHub Issues

---

**Made with ❤️ for Ka & Dong**
