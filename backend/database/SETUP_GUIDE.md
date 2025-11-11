# 🚀 Database Setup Guide - KaDong Tools

## 📋 Prerequisites

- PostgreSQL 13+ installed
- Node.js 18+
- Database client (pgAdmin, DBeaver, hoặc psql CLI)

## 🔧 Step 1: Cài đặt PostgreSQL

### Windows:
```bash
# Download từ: https://www.postgresql.org/download/windows/
# Hoặc dùng Chocolatey:
choco install postgresql
```

### macOS:
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 🗄️ Step 2: Tạo Database

### Cách 1: Sử dụng psql CLI
```bash
# Login vào PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE kadongsite;

# Tạo user (optional, dùng cho production)
CREATE USER kadong_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kadongsite TO kadong_user;

# Exit
\q
```

### Cách 2: Sử dụng pgAdmin
1. Mở pgAdmin
2. Right-click "Databases" → Create → Database
3. Tên: `kadongsite`
4. Owner: `postgres` (hoặc user bạn tạo)
5. Save

## ⚙️ Step 3: Cấu hình Backend

### 3.1. Cài đặt pg driver
```bash
cd backend
npm install pg dotenv
```

### 3.2. Cập nhật .env file
```bash
# backend/.env
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/kadongsite

# Hoặc dùng individual params:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=kadongsite
# DB_USER=postgres
# DB_PASSWORD=your_password
```

## 📦 Step 4: Chạy Migrations

### Cách 1: Manual migration (SQL files)
```bash
# Từ thư mục backend/
cd backend

# Run migration UP (create tables)
psql -U postgres -d kadongsite -f database/migrations/001_up_initial_schema.sql

# Verify
psql -U postgres -d kadongsite -c "\dt"
```

### Cách 2: Sử dụng migration script
```bash
# Tạo file backend/scripts/migrate.js
node scripts/migrate.js up

# Rollback nếu cần
node scripts/migrate.js down
```

## 🌱 Step 5: Seed Data

```bash
# Load seed data
psql -U postgres -d kadongsite -f database/seeds/seed_data.sql

# Verify data
psql -U postgres -d kadongsite -c "SELECT * FROM users;"
psql -U postgres -d kadongsite -c "SELECT * FROM tools;"
```

## ✅ Step 6: Test Connection

### 6.1. Tạo test script
```bash
# backend/scripts/test-db.js
import { testConnection } from '../config/database.js'

testConnection()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
```

### 6.2. Chạy test
```bash
node scripts/test-db.js
```

Expected output:
```
🔌 Database connected
✅ Database connection successful
📅 Server time: 2024-11-11T10:30:00.000Z
🗄️  PostgreSQL version: PostgreSQL 15.3
```

## 🔄 Step 7: Update Controllers

### 7.1. Backup old controllers
```bash
mv controllers/notesController.js controllers/notesController.old.js
```

### 7.2. Use new DB-enabled controller
```bash
mv controllers/notesController_with_db.js controllers/notesController.js
```

### 7.3. Update app.js
```javascript
// backend/app.js
import { testConnection } from './config/database.js'

// Test DB connection on startup
testConnection()

// ... rest of your code
```

## 🚀 Step 8: Start Server

```bash
# Từ thư mục backend/
npm start

# Hoặc development mode với nodemon
npm run dev
```

Expected output:
```
🔌 Database connected
✅ Database connection successful
╔═══════════════════════════════════════╗
║   🌸 KaDong Tools API Server 🌸      ║
║   Running on http://localhost:5000   ║
║   Environment: development           ║
╚═══════════════════════════════════════╝
```

## 🧪 Step 9: Test API Endpoints

### Test với curl hoặc Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Get notes (requires auth later)
curl http://localhost:5000/api/notes

# Create note
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello","color":"pink"}'
```

## 📊 Useful psql Commands

```bash
# Connect to database
psql -U postgres -d kadongsite

# List all tables
\dt

# Describe table structure
\d users
\d notes

# View data
SELECT * FROM users;
SELECT * FROM notes LIMIT 10;

# Check indexes
\di

# Exit
\q
```

## 🔧 Troubleshooting

### Lỗi: "password authentication failed"
```bash
# Kiểm tra pg_hba.conf
# Windows: C:\Program Files\PostgreSQL\15\data\pg_hba.conf
# Linux: /etc/postgresql/15/main/pg_hba.conf

# Thay đổi method thành 'md5' hoặc 'trust'
# Restart PostgreSQL
```

### Lỗi: "database does not exist"
```bash
# Tạo lại database
createdb kadongsite

# Hoặc
psql -U postgres -c "CREATE DATABASE kadongsite;"
```

### Lỗi: "relation does not exist"
```bash
# Chạy lại migrations
psql -U postgres -d kadongsite -f database/migrations/001_up_initial_schema.sql
```

### Lỗi: Connection timeout
```bash
# Kiểm tra PostgreSQL đang chạy
# Windows:
services.msc → PostgreSQL

# Linux/Mac:
sudo systemctl status postgresql
```

## 🎯 Next Steps

1. ✅ Implement authentication (JWT, sessions)
2. ✅ Add middleware for auth checking
3. ✅ Create remaining controllers (events, feedback, etc.)
4. ✅ Set up backup schedule
5. ✅ Configure for production (connection pooling, SSL)

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl-constraints.html)

---

**Need help?** Check logs in:
- PostgreSQL logs: `/var/log/postgresql/` (Linux)
- Backend logs: console output hoặc thêm logging với Winston/Pino
