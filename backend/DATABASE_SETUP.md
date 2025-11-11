# 🗄️ KaDong Tools - Database Setup Complete Guide

## 📋 Trạng thái hiện tại
- ✅ Migration files sẵn sàng (001_up_initial_schema.sql, 002_up_fashion_outfits.sql)
- ✅ Setup script đã tạo (setup-database.bat)
- ✅ .env file đã cấu hình
- ⚠️ PostgreSQL chưa cài đặt

---

## 🚀 HƯỚNG DẪN SETUP ĐẦY ĐỦ

### Bước 1: Cài đặt PostgreSQL (Windows)

#### Option A: PostgreSQL Installer (Recommended)
1. **Download PostgreSQL**:
   - Truy cập: https://www.postgresql.org/download/windows/
   - Chọn phiên bản PostgreSQL 15 hoặc 16
   - Download installer (khoảng 300MB)

2. **Chạy Installer**:
   ```
   - Chọn Installation Directory: C:\Program Files\PostgreSQL\15
   - Chọn Components: 
     ✓ PostgreSQL Server
     ✓ pgAdmin 4
     ✓ Command Line Tools
   - Port: 5432 (default)
   - Locale: Default
   ```

3. **Đặt Password cho postgres user**:
   ```
   Password: kadong2024
   (Hoặc password khác, nhớ update trong .env)
   ```

4. **Thêm PostgreSQL vào PATH**:
   - Mở System Environment Variables
   - Edit PATH, thêm: `C:\Program Files\PostgreSQL\15\bin`
   - Restart terminal/PowerShell

5. **Verify Installation**:
   ```bash
   psql --version
   # Output: psql (PostgreSQL) 15.x
   ```

#### Option B: Docker (Nếu có Docker Desktop)
```bash
cd backend
docker-compose up -d
```

---

### Bước 2: Chạy Setup Script Tự Động

Sau khi cài PostgreSQL, chạy script setup:

```bash
cd backend
.\setup-database.bat
```

Script sẽ tự động:
1. ✅ Kiểm tra PostgreSQL
2. ✅ Tạo database `kadong_tools`
3. ✅ Cài dependencies (pg, dotenv)
4. ✅ Chạy migrations (tạo 8 tables)
5. ✅ Test connection

---

### Bước 3: Setup Thủ Công (Nếu script lỗi)

#### 3.1. Tạo Database
```bash
# Mở PowerShell/CMD
psql -U postgres

# Trong psql prompt:
CREATE DATABASE kadong_tools;
\l                    # List databases để verify
\q                    # Exit
```

#### 3.2. Cài Dependencies
```bash
cd backend
npm install pg dotenv
```

#### 3.3. Cập nhật .env
```bash
# File: backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kadong_tools
DB_USER=postgres
DB_PASSWORD=kadong2024  # <-- Thay bằng password bạn đặt
```

#### 3.4. Chạy Migrations
```bash
cd backend

# Migration 1: Initial schema (users, notes, events, tools, etc.)
psql -U postgres -d kadong_tools -f database/migrations/001_up_initial_schema.sql

# Migration 2: Fashion outfits table
psql -U postgres -d kadong_tools -f database/migrations/002_up_fashion_outfits.sql

# Verify tables được tạo
psql -U postgres -d kadong_tools -c "\dt"
```

Expected output:
```
                List of relations
 Schema |        Name        | Type  |  Owner
--------+--------------------+-------+----------
 public | countdown_events   | table | postgres
 public | currency_rates     | table | postgres
 public | fashion_outfits    | table | postgres
 public | feedback           | table | postgres
 public | migrations         | table | postgres
 public | notes              | table | postgres
 public | sessions           | table | postgres
 public | tools              | table | postgres
 public | users              | table | postgres
```

#### 3.5. Test Connection
```bash
node scripts/test-db.js
```

Expected output:
```
🔍 Testing database connection...

🔌 Database connected
✅ Database connection successful
📅 Server time: 2025-11-11T...
🗄️  PostgreSQL version: PostgreSQL 15.x

✅ All tests passed!
```

---

### Bước 4: Start Backend Server

```bash
cd backend
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

---

## 🧪 Testing Database

### Test 1: API Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: View Tables
```bash
psql -U postgres -d kadong_tools

# List tables
\dt

# View table structure
\d users
\d fashion_outfits

# View data
SELECT * FROM migrations;
SELECT * FROM users LIMIT 5;

# Exit
\q
```

### Test 3: Insert Test Data
```bash
psql -U postgres -d kadong_tools

-- Insert test user
INSERT INTO users (email, password_hash, name, role)
VALUES ('test@kadong.com', 'hashed_password', 'Test User', 'user');

-- Insert test note
INSERT INTO notes (user_id, title, content, color)
VALUES (
  (SELECT id FROM users WHERE email = 'test@kadong.com'),
  'First Note',
  'Hello from database!',
  'pink'
);

-- Verify
SELECT * FROM notes;

\q
```

---

## 🔧 Troubleshooting

### Lỗi 1: "psql: command not found"
**Giải pháp**: PostgreSQL chưa được thêm vào PATH
```bash
# Add to PATH:
C:\Program Files\PostgreSQL\15\bin
```

### Lỗi 2: "password authentication failed"
**Giải pháp**: Sai password
1. Kiểm tra password đã đặt khi cài PostgreSQL
2. Update trong `.env` file:
   ```
   DB_PASSWORD=your_actual_password
   ```

### Lỗi 3: "database does not exist"
**Giải pháp**: Tạo database
```bash
psql -U postgres -c "CREATE DATABASE kadong_tools;"
```

### Lỗi 4: "role 'postgres' does not exist"
**Giải pháp**: User postgres chưa được tạo
```bash
# Trong psql với superuser
CREATE ROLE postgres WITH LOGIN PASSWORD 'kadong2024' SUPERUSER;
```

### Lỗi 5: "relation does not exist"
**Giải pháp**: Migrations chưa chạy
```bash
# Chạy lại migrations
psql -U postgres -d kadong_tools -f database/migrations/001_up_initial_schema.sql
psql -U postgres -d kadong_tools -f database/migrations/002_up_fashion_outfits.sql
```

### Lỗi 6: Connection timeout
**Giải pháp**: PostgreSQL service không chạy
```bash
# Windows: Mở Services (services.msc)
# Tìm "postgresql-x64-15" → Start

# Hoặc qua PowerShell (as Admin)
Start-Service postgresql-x64-15
```

---

## 📊 Database Schema Overview

### 8 Tables Created:
1. **migrations** - Track schema versions
2. **users** - User accounts
3. **notes** - Personal notes with colors
4. **countdown_events** - Event countdown tracker
5. **tools** - Tool metadata
6. **feedback** - User feedback
7. **currency_rates** - Currency conversion rates
8. **fashion_outfits** - Outfit color combinations ⭐ NEW

### Key Features:
- ✅ UUID primary keys
- ✅ Soft delete (deleted_at)
- ✅ Audit timestamps (created_at, updated_at)
- ✅ Foreign key constraints
- ✅ Indexes on frequently queried columns
- ✅ Auto-update triggers
- ✅ CHECK constraints for data validation

---

## 📚 Useful Commands

```bash
# Connect to database
psql -U postgres -d kadong_tools

# psql commands:
\l              # List databases
\dt             # List tables
\d table_name   # Describe table
\di             # List indexes
\du             # List users
\q              # Quit

# SQL queries:
SELECT COUNT(*) FROM users;
SELECT * FROM fashion_outfits WHERE deleted_at IS NULL;
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

---

## 🎯 Next Steps

1. ✅ Test API endpoints với Postman/curl
2. ✅ Seed sample data (optional)
3. ✅ Configure backup schedule
4. ✅ Set up pgAdmin for GUI management
5. ✅ Configure SSL for production

---

## 📞 Need Help?

Nếu gặp lỗi, check:
1. PostgreSQL service đang chạy
2. Password trong .env đúng
3. Database `kadong_tools` đã được tạo
4. Migrations đã chạy thành công
5. Port 5432 không bị block bởi firewall

**Logs location**:
- Backend: Console output
- PostgreSQL: `C:\Program Files\PostgreSQL\15\data\log\`

---

**Status**: ⏳ Waiting for PostgreSQL installation
**Next**: Run `.\setup-database.bat` after installing PostgreSQL
