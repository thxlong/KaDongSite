# 🔧 09. Troubleshooting - Xử lý Lỗi

## 9.1 Common Issues & Solutions

### 🔴 Installation Issues

#### Error: "npm ERR! code ENOENT"

**Symptoms**:
```bash
npm ERR! code ENOENT
npm ERR! syscall open
npm ERR! path package.json
```

**Cause**: Not in correct directory or `package.json` missing

**Solution**:
```bash
# Check current directory
cd   # Windows
pwd  # Linux/Mac

# Navigate to correct folder
cd c:\Projects\Personal\KaDongSite\backend

# Verify package.json exists
dir package.json  # Windows
ls package.json   # Linux/Mac

# Install
npm install
```

---

#### Error: "gyp ERR! stack Error: Python not found"

**Symptoms**:
```bash
gyp ERR! stack Error: Can't find Python executable "python"
```

**Cause**: Python not installed (required for bcrypt native module)

**Solution**:
```bash
# Windows - Install Python 3.x from python.org
# Or install windows-build-tools
npm install --global windows-build-tools

# Linux
sudo apt-get install python3

# Mac
brew install python3

# Then retry npm install
npm install
```

---

### 🔴 Database Connection Issues

#### Error: "ECONNREFUSED 127.0.0.1:5432"

**Symptoms**:
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect
```

**Cause**: PostgreSQL service not running

**Solution Windows**:
```bash
# Method 1: Services GUI
services.msc
# Find "postgresql-x64-14" → Right-click → Start

# Method 2: Command line
net start postgresql-x64-14

# Verify service is running
sc query postgresql-x64-14
```

**Solution Linux**:
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

**Solution Mac**:
```bash
# Start PostgreSQL
brew services start postgresql@14

# Or manually
pg_ctl -D /usr/local/var/postgres start

# Check if running
brew services list
```

---

#### Error: "password authentication failed for user postgres"

**Symptoms**:
```bash
error: password authentication failed for user "postgres"
```

**Cause**: Wrong password in `.env` file

**Solution**:
```bash
# Option 1: Update .env with correct password
# Edit backend/.env
DB_PASSWORD=correct_password_here

# Option 2: Reset PostgreSQL password
# Windows (as postgres user)
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
\q

# Linux
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new_password';
\q

# Update .env with new password
DB_PASSWORD=new_password

# Restart backend
npm run dev
```

---

#### Error: "database kadong_tools does not exist"

**Symptoms**:
```bash
error: database "kadong_tools" does not exist
```

**Cause**: Database not created yet

**Solution**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kadong_tools;

# Verify creation
\l

# Exit
\q

# Run migrations
cd backend
npm run db:migrate:up
```

---

#### Error: "relation users does not exist"

**Symptoms**:
```bash
error: relation "users" does not exist
```

**Cause**: Migrations not run

**Solution**:
```bash
cd backend

# Check migration status
npm run db:migrate:status

# Run migrations
npm run db:migrate:up

# Verify tables created
psql -U postgres -d kadong_tools
\dt
# Should show 7 tables
\q
```

---

### 🔴 Backend API Issues

#### Error: "Port 5000 already in use"

**Symptoms**:
```bash
Error: listen EADDRINUSE: address already in use :::5000
```

**Cause**: Another process using port 5000

**Solution Windows**:
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Example output:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345

# Kill process (replace 12345 with actual PID)
taskkill /PID 12345 /F

# Or change port in .env
# backend/.env
PORT=5001

# Restart server
npm run dev
```

**Solution Linux/Mac**:
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Or use fuser
fuser -k 5000/tcp

# Or change port
PORT=5001 npm run dev
```

---

#### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Symptoms**:
```
Access to fetch at 'http://localhost:5000/api/notes' from origin 
'http://localhost:5173' has been blocked by CORS policy
```

**Cause**: Backend not configured to accept requests from frontend

**Solution**:
```javascript
// backend/app.js
import cors from 'cors'

// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true
}))

// Or allow all origins (development only)
app.use(cors())
```

**Update .env**:
```env
CORS_ORIGIN=http://localhost:5173
```

**Restart backend**:
```bash
npm run dev
```

---

#### Error: "Cannot GET /api/notes"

**Symptoms**:
```json
{
  "error": "Cannot GET /api/notes"
}
```

**Cause**: Route not registered or typo in URL

**Solution**:
```javascript
// Check backend/app.js
import notesRoutes from './routes/notes.js'

// Verify route is registered
app.use('/api/notes', notesRoutes)  // Correct
// NOT: app.use('/api/note', notesRoutes)  // Wrong (singular)

// Check route file: backend/routes/notes.js
import express from 'express'
const router = express.Router()

router.get('/', getNotes)  // GET /api/notes

export default router

// Restart backend
```

**Check URL in frontend**:
```javascript
// ✅ CORRECT
fetch('http://localhost:5000/api/notes')

// ❌ WRONG
fetch('http://localhost:5000/notes')      // Missing /api
fetch('http://localhost:5000/api/note')   // Wrong endpoint
```

---

### 🔴 Frontend Issues

#### Error: "Module not found: Can't resolve 'react'"

**Symptoms**:
```bash
Module not found: Error: Can't resolve 'react'
```

**Cause**: Dependencies not installed

**Solution**:
```bash
cd frontend
npm install

# If still fails, delete and reinstall
rmdir /s /q node_modules  # Windows
rm -rf node_modules       # Linux/Mac

npm install
```

---

#### Error: "Uncaught ReferenceError: process is not defined"

**Symptoms**:
```
Uncaught ReferenceError: process is not defined
```

**Cause**: Using Node.js `process.env` in Vite (use `import.meta.env`)

**Solution**:
```javascript
// ❌ WRONG (Node.js syntax)
const apiUrl = process.env.REACT_APP_API_URL

// ✅ CORRECT (Vite syntax)
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

**Update .env**:
```env
# ❌ WRONG
REACT_APP_API_URL=http://localhost:5000

# ✅ CORRECT (must start with VITE_)
VITE_API_BASE_URL=http://localhost:5000
```

---

#### Error: "Failed to fetch" when calling API

**Symptoms**:
```javascript
TypeError: Failed to fetch
```

**Causes & Solutions**:

**1. Backend not running**:
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If not, start backend
cd backend
npm run dev
```

**2. Wrong API URL**:
```javascript
// frontend/src/utils/api.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
//                                                      ^ Check this URL
```

**3. Network error**:
```bash
# Check browser console for error details
# Check Network tab in DevTools
```

---

#### Blank Page / White Screen

**Symptoms**: Frontend shows blank white page, no errors

**Solutions**:

**1. Check console for errors**:
- Open DevTools (F12)
- Check Console tab for JavaScript errors

**2. Verify build**:
```bash
cd frontend
npm run build

# Check if dist/ folder created
dir dist  # Windows
ls dist   # Linux/Mac
```

**3. Check routing**:
```javascript
// src/App.jsx
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>  {/* Must wrap routes */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**4. Check component imports**:
```javascript
// ❌ WRONG
import Home from './pages/home'  // Case-sensitive

// ✅ CORRECT
import Home from './pages/Home'
```

---

### 🔴 Authentication Issues

#### Error: "jwt malformed"

**Symptoms**:
```json
{
  "error": "jwt malformed"
}
```

**Cause**: Invalid or missing JWT token

**Solution**:
```javascript
// Frontend - Check token format
localStorage.getItem('token')  // Should be: eyJhbGciOiJIUzI1...

// Backend - Check JWT secret
// backend/.env
JWT_SECRET=your_secret_key_min_32_chars

// Verify token in request
const token = req.headers.authorization?.split(' ')[1]  // Bearer <token>

if (!token) {
  return res.status(401).json({ error: 'No token provided' })
}
```

---

#### Error: "jwt expired"

**Symptoms**:
```json
{
  "error": "jwt expired"
}
```

**Cause**: Token expired (default: 7 days)

**Solution**:
```javascript
// User needs to login again
// Frontend
if (error.message === 'jwt expired') {
  // Clear token
  localStorage.removeItem('token')
  // Redirect to login
  navigate('/login')
}

// Or increase token expiration (backend)
// controllers/authController.js
const token = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }  // Changed from 7d to 30d
)
```

---

### 🔴 Build & Deployment Issues

#### Error: "Cannot find module" in production

**Symptoms**:
```bash
Error: Cannot find module './routes/notes'
```

**Cause**: Missing `.js` extension in imports (required for ES modules)

**Solution**:
```javascript
// ❌ WRONG
import notesRoutes from './routes/notes'

// ✅ CORRECT
import notesRoutes from './routes/notes.js'
```

---

#### Error: "Vite build fails with memory error"

**Symptoms**:
```bash
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Cause**: Not enough memory for build

**Solution**:
```bash
# Increase Node.js memory limit
# package.json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
  }
}

# Or run directly
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

### 🔴 Performance Issues

#### Slow API Responses

**Symptoms**: API takes >1 second to respond

**Solutions**:

**1. Add database indexes**:
```sql
-- Check missing indexes
EXPLAIN ANALYZE SELECT * FROM notes WHERE user_id = 'uuid';

-- Add index if needed
CREATE INDEX idx_notes_user_id ON notes(user_id);
```

**2. Enable connection pooling** (already configured):
```javascript
// config/database.js
const pool = new Pool({
  max: 20,  // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
```

**3. Optimize queries**:
```sql
-- ❌ BAD - N+1 problem
SELECT * FROM notes WHERE user_id = '...';  -- For each note
SELECT * FROM users WHERE id = '...';       -- Query user again

-- ✅ GOOD - Join once
SELECT n.*, u.username 
FROM notes n 
JOIN users u ON n.user_id = u.id 
WHERE n.user_id = '...';
```

---

#### Frontend Slow to Load

**Solutions**:

**1. Code splitting**:
```javascript
// src/App.jsx
import { lazy, Suspense } from 'react'

const NotesTool = lazy(() => import('./pages/NotesTool'))
const CountdownTool = lazy(() => import('./pages/CountdownTool'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/notes" element={<NotesTool />} />
    <Route path="/countdown" element={<CountdownTool />} />
  </Routes>
</Suspense>
```

**2. Optimize images**:
```bash
# Use WebP format
# Compress images
# Use lazy loading
<img src="..." loading="lazy" />
```

**3. Remove unused dependencies**:
```bash
npm install -g depcheck
depcheck

# Remove unused
npm uninstall unused-package
```

---

## 9.2 Debugging Tips

### Backend Debugging

**1. Enable detailed logging**:
```javascript
// app.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body)
  next()
})
```

**2. Use debugger**:
```javascript
// Add breakpoint
debugger;

// Run with inspector
node --inspect app.js
```

**3. Test with curl**:
```bash
# Test endpoint
curl -X GET http://localhost:5000/api/notes

# With headers
curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/api/notes

# POST with data
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","content":"Test"}' \
     http://localhost:5000/api/notes
```

---

### Frontend Debugging

**1. React DevTools**:
- Install React DevTools extension
- Inspect component props/state
- Track re-renders

**2. Network Tab**:
- Open DevTools → Network
- Check API requests
- Verify request/response data

**3. Console logging**:
```javascript
console.log('State:', state)
console.table(notes)  // Table format
console.error('Error:', error)
```

---

### Database Debugging

**1. Check query logs**:
```javascript
// Enable query logging
const query = (text, params) => {
  console.log('QUERY:', text, params)
  return pool.query(text, params)
}
```

**2. Use EXPLAIN**:
```sql
EXPLAIN ANALYZE SELECT * FROM notes WHERE user_id = 'uuid';
```

**3. Check connections**:
```sql
-- Active connections
SELECT * FROM pg_stat_activity;

-- Kill connection
SELECT pg_terminate_backend(pid);
```

---

## 9.3 Getting Help

### Before Asking for Help

- [ ] Checked this troubleshooting guide
- [ ] Searched GitHub issues
- [ ] Googled error message
- [ ] Checked browser console
- [ ] Checked server logs
- [ ] Tried restarting services

### How to Ask

**Provide**:
1. Error message (full text)
2. Steps to reproduce
3. Environment (OS, Node version, etc.)
4. Relevant code
5. What you've tried

**Good question example**:
```markdown
## Problem
Getting "ECONNREFUSED" when connecting to database

## Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

## Environment
- Windows 11
- Node.js 18.17.0
- PostgreSQL 14.9

## What I've Tried
1. Checked PostgreSQL service is running ✅
2. Verified credentials in .env ✅
3. Can connect with pgAdmin ✅
4. Still fails in Node.js ❌

## Code
[Paste relevant code]
```

---

## 📎 Related Links

- **[Setup Guide](03_SetupAndInstallation.md)** - Installation steps
- **[Contribution Guide](08_ContributionGuide.md)** - Development workflow
- **[Deployment Guide](07_DeploymentGuide.md)** - Production issues

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
