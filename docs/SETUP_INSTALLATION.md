# ⚙️ 03. Setup and Installation - Cài đặt và Khởi chạy

## 3.1 Yêu cầu hệ thống

### Phần mềm bắt buộc

| Software | Minimum Version | Recommended | Download |
|----------|----------------|-------------|----------|
| **Node.js** | 18.0.0 | 20.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | 8.0.0 | 10.x | Included with Node.js |
| **PostgreSQL** | 13.0 | 14.x or 15.x | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | 2.30+ | Latest | [git-scm.com](https://git-scm.com/) |

### Optional Tools

| Tool | Purpose | Download |
|------|---------|----------|
| **pgAdmin** | PostgreSQL GUI | [pgadmin.org](https://www.pgadmin.org/) |
| **Postman** | API testing | [postman.com](https://www.postman.com/) |
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |

### Kiểm tra version hiện tại

```bash
# Kiểm tra Node.js
node --version
# Expected: v18.x.x or higher

# Kiểm tra npm
npm --version
# Expected: 8.x.x or higher

# Kiểm tra PostgreSQL
psql --version
# Expected: psql (PostgreSQL) 13.x or higher

# Kiểm tra Git
git --version
# Expected: git version 2.30.x or higher
```

---

## 3.2 Clone dự án

### Từ GitHub (nếu có remote repository)

```bash
# Clone repository
git clone https://github.com/your-username/KaDongSite.git

# Di chuyển vào thư mục dự án
cd KaDongSite
```

### Hoặc khởi tạo Git mới

```bash
# Khởi tạo Git repository
git init

# Thêm remote (optional)
git remote add origin https://github.com/your-username/KaDongSite.git
```

---

## 3.3 Cài đặt Frontend

### Bước 1: Di chuyển vào thư mục frontend

```bash
cd frontend
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

**Packages được cài đặt**:
- `react` & `react-dom` - React framework
- `react-router-dom` - Client-side routing
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `date-fns` - Date utilities
- `vite` - Build tool
- `tailwindcss` - Utility-first CSS

### Bước 3: Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### Bước 4: Build cho production (optional)

```bash
npm run build
```

Build output sẽ ở thư mục `dist/`

---

## 3.4 Cài đặt Backend

### Bước 1: Di chuyển vào thư mục backend

```bash
cd ../backend
# Hoặc từ root: cd backend
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

**Packages được cài đặt**:
- `express` - Web framework
- `pg` - PostgreSQL client
- `dotenv` - Environment variables
- `cors` - Cross-Origin Resource Sharing
- `bcrypt` - Password hashing
- `body-parser` - Request body parsing

### Bước 3: Cấu hình environment variables

```bash
# Copy file .env.example
copy .env.example .env
# Trên Linux/Mac: cp .env.example .env
```

**Chỉnh sửa file `.env`**:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kadong_tools
DB_USER=postgres
DB_PASSWORD=your_password_here

# Alternative: Connection String Format
DATABASE_URL=postgresql://postgres:your_password_here@localhost:5432/kadong_tools

# Session Secret (generate random string)
SESSION_SECRET=your_super_secret_key_here_min_32_chars

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**⚠️ Important Notes**:
- Thay `your_password_here` bằng PostgreSQL password của bạn
- Tạo `SESSION_SECRET` ngẫu nhiên (ít nhất 32 ký tự)
- **KHÔNG commit file `.env` lên Git** (đã có trong `.gitignore`)

### Bước 4: Tạo PostgreSQL database

```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Trong psql shell, tạo database
CREATE DATABASE kadong_tools;

# Kiểm tra database đã tạo
\l

# Thoát psql
\q
```

**Alternative: Sử dụng pgAdmin**
1. Mở pgAdmin
2. Right-click "Databases" → Create → Database
3. Nhập tên: `kadong_tools`
4. Click "Save"

---

## 3.5 Cấu hình Database

### Bước 1: Kiểm tra kết nối

```bash
npm run db:test
```

**Expected Output**:
```
✅ Database connection successful!
Server version: PostgreSQL 14.x
Database: kadong_tools
User: postgres
```

**Nếu lỗi kết nối**:
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra thông tin trong `.env` (host, port, user, password)
- Kiểm tra firewall/antivirus không block port 5432

### Bước 2: Chạy migrations (tạo tables)

```bash
npm run db:migrate:up
```

**Migrations sẽ tạo 7 tables**:
1. `users` - User accounts
2. `notes` - User notes
3. `countdown_events` - Countdown timers
4. `tools` - Tool metadata
5. `feedback` - User feedback
6. `currency_rates` - Exchange rates
7. `sessions` - User sessions

**Expected Output**:
```
🚀 Running migration: 001_up_initial_schema.sql
✅ Migration completed successfully!
Tables created: 7
```

### Bước 3: Load seed data (test data)

```bash
npm run db:seed
```

**Seed data bao gồm**:
- 3 users (ka@example.com, dong@example.com, admin@example.com)
- 5 notes
- 4 countdown events
- 4 tool configurations
- 2 feedback entries
- 1 currency rate record

**Expected Output**:
```
🌱 Seeding database...
✅ Seed data loaded successfully!
Inserted: 3 users, 5 notes, 4 events, 4 tools, 2 feedback
```

### Bước 4: Verify migrations

```bash
npm run db:migrate:status
```

**Expected Output**:
```
📊 Migration Status
✅ 001_up_initial_schema.sql - Applied
```

---

## 3.6 Khởi chạy ứng dụng

### Development Mode

#### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

**Expected Output**:
```
🚀 Server running on http://localhost:5000
✅ Connected to PostgreSQL database
📂 Database: kadong_tools
```

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

**Expected Output**:
```
  VITE v5.0.8  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

---

## 3.7 Kiểm tra cài đặt

### Test Frontend

1. Mở trình duyệt: http://localhost:5173
2. Kiểm tra trang Home hiển thị 4 tool cards
3. Click vào "Notes Tool" → Xem notes list
4. Click vào "Countdown Tool" → Xem countdown events

### Test Backend API

**Sử dụng curl**:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-11-11T..."}

# Test get all notes
curl http://localhost:5000/api/notes

# Expected response:
# {"success":true,"data":[...notes array...]}

# Test get all tools
curl http://localhost:5000/api/tools

# Expected response:
# {"success":true,"data":[...tools array...]}
```

**Sử dụng Postman**:

1. Import collection từ `docs/postman/KaDong_API.json` (nếu có)
2. Hoặc tạo requests thủ công:
   - GET http://localhost:5000/api/notes
   - GET http://localhost:5000/api/events
   - POST http://localhost:5000/api/notes (với body JSON)

### Test Database

**Sử dụng psql**:

```bash
# Kết nối database
psql -U postgres -d kadong_tools

# Kiểm tra tables
\dt

# Expected output: List of 7 tables

# Query sample data
SELECT * FROM users;
SELECT * FROM notes LIMIT 5;
SELECT * FROM countdown_events;

# Thoát
\q
```

**Sử dụng pgAdmin**:

1. Connect to `kadong_tools` database
2. Expand "Schemas" → "public" → "Tables"
3. Right-click table → "View/Edit Data" → "All Rows"

---

## 3.8 Troubleshooting - Xử lý lỗi thường gặp

### ❌ Error: "Cannot find module 'express'"

**Nguyên nhân**: Chưa cài dependencies

**Giải pháp**:
```bash
cd backend
npm install
```

---

### ❌ Error: "ECONNREFUSED 127.0.0.1:5432"

**Nguyên nhân**: PostgreSQL service chưa chạy

**Giải pháp Windows**:
```bash
# Kiểm tra service
services.msc
# Tìm "postgresql-x64-14" → Start

# Hoặc dùng command
net start postgresql-x64-14
```

**Giải pháp Linux/Mac**:
```bash
# Start PostgreSQL
sudo systemctl start postgresql
# Hoặc
brew services start postgresql@14
```

---

### ❌ Error: "password authentication failed for user postgres"

**Nguyên nhân**: Sai password trong file `.env`

**Giải pháp**:
1. Kiểm tra password PostgreSQL
2. Update file `.env`:
   ```env
   DB_PASSWORD=correct_password_here
   ```
3. Restart backend server

---

### ❌ Error: "database kadong_tools does not exist"

**Nguyên nhân**: Chưa tạo database

**Giải pháp**:
```bash
psql -U postgres
CREATE DATABASE kadong_tools;
\q
```

---

### ❌ Error: "relation users does not exist"

**Nguyên nhân**: Chưa chạy migrations

**Giải pháp**:
```bash
cd backend
npm run db:migrate:up
```

---

### ❌ Error: "Port 5000 already in use"

**Nguyên nhân**: Port 5000 đã bị process khác sử dụng

**Giải pháp Windows**:
```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay PID bằng số tìm được)
taskkill /PID <PID> /F

# Hoặc đổi port trong .env
PORT=5000
```

**Giải pháp Linux/Mac**:
```bash
# Tìm và kill process
lsof -ti:5000 | xargs kill -9

# Hoặc đổi port
PORT=5000
```

---

### ❌ Error: "CORS policy blocked"

**Nguyên nhân**: Frontend origin không được phép

**Giải pháp**:
1. Kiểm tra `CORS_ORIGIN` trong `.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```
2. Hoặc thêm vào `app.js`:
   ```javascript
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }))
   ```

---

### ❌ Error: "npm ERR! code ENOENT"

**Nguyên nhân**: File `package.json` không tồn tại

**Giải pháp**:
```bash
# Kiểm tra đang ở đúng thư mục
pwd  # Linux/Mac
cd   # Windows

# Di chuyển vào thư mục backend hoặc frontend
cd backend
npm install
```

---

## 3.9 Cấu hình nâng cao

### Thay đổi Port

**Backend Port**:
```env
# .env
PORT=5000
```

**Frontend Port**:
```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Database Connection Pooling

```javascript
// config/database.js
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,              // Max number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

### Enable HTTPS cho Development

**Frontend (Vite)**:
```javascript
// vite.config.js
import fs from 'fs'

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem'),
    }
  }
})
```

**Backend (Express)**:
```javascript
// app.js
import https from 'https'
import fs from 'fs'

const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
}

https.createServer(options, app).listen(5000)
```

---

## 3.10 Quick Start Summary

**Cài đặt nhanh trong 5 phút**:

```bash
# 1. Clone và cài đặt
git clone <repo-url>
cd KaDongSite

# 2. Backend setup
cd backend
npm install
copy .env.example .env
# Edit .env với database password

# 3. Database setup
psql -U postgres -c "CREATE DATABASE kadong_tools"
npm run db:migrate:up
npm run db:seed

# 4. Frontend setup
cd ../frontend
npm install

# 5. Start both servers
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# 6. Open browser
# http://localhost:5173
```

---

## 📎 Related Links

- **[Project Structure](02_ProjectStructure.md)** - Cấu trúc thư mục
- **[Database Schema](04_DatabaseSchema.md)** - Chi tiết database
- **[API Documentation](05_API_Documentation.md)** - API endpoints
- **[Troubleshooting](09_Troubleshooting.md)** - Xử lý lỗi chi tiết

---

## 📚 Next Steps

Sau khi cài đặt thành công:

1. ✅ **Đọc [Database Schema](04_DatabaseSchema.md)** - Hiểu cấu trúc database
2. ✅ **Đọc [API Documentation](05_API_Documentation.md)** - Học cách sử dụng API
3. ✅ **Đọc [Frontend Overview](06_FrontendOverview.md)** - Tìm hiểu React components
4. ✅ **Thử modify code** - Thêm feature mới
5. ✅ **Deploy** - Đọc [Deployment Guide](07_DeploymentGuide.md)

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
