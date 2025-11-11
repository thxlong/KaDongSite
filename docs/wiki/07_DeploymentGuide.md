# 🚀 07. Deployment Guide - Hướng dẫn Deploy

## 7.1 Deployment Overview

**Deployment Architecture**:
```
Frontend (Vercel/Netlify)
    ↓ HTTPS
Backend (Railway/Heroku/DigitalOcean)
    ↓ Database Connection
PostgreSQL (Supabase/Railway/AWS RDS)
```

---

## 7.2 Environment Setup

### Production Environment Variables

**Backend `.env.production`**:
```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
DB_SSL=true
DB_POOL_MAX=20

# Security
SESSION_SECRET=YOUR_SUPER_SECRET_KEY_MIN_64_CHARS_PRODUCTION
JWT_SECRET=YOUR_JWT_SECRET_KEY_MIN_64_CHARS

# CORS
CORS_ORIGIN=https://kadong-tools.vercel.app

# API Keys
CURRENCY_API_KEY=your_api_key_here

# Logging
LOG_LEVEL=error
```

**Frontend `.env.production`**:
```env
VITE_API_BASE_URL=https://api.kadong-tools.com/api
VITE_APP_ENV=production
```

---

## 7.3 Deploy PostgreSQL Database

### Option 1: Supabase (Recommended - Free Tier)

**Features**:
- ✅ Free 500MB database
- ✅ Automatic backups
- ✅ Built-in authentication
- ✅ Real-time subscriptions
- ✅ Auto-scaling

**Steps**:

1. **Create Supabase Project**
   - Visit [supabase.com](https://supabase.com)
   - Sign up → Create New Project
   - Project name: `kadong-tools`
   - Database password: (strong password)
   - Region: Select closest to users

2. **Get Connection String**
   ```
   Settings → Database → Connection String → URI
   
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

3. **Run Migrations**
   ```bash
   # Update .env with Supabase connection string
   DATABASE_URL=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres
   
   # Run migrations
   npm run db:migrate:up
   
   # Seed data
   npm run db:seed
   ```

4. **Enable SSL**
   ```javascript
   // config/database.js
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   })
   ```

---

### Option 2: Railway

**Features**:
- ✅ $5/month free credit
- ✅ Easy PostgreSQL provisioning
- ✅ Automatic backups
- ✅ Built-in monitoring

**Steps**:

1. Sign up at [railway.app](https://railway.app)
2. New Project → Add PostgreSQL
3. Copy `DATABASE_URL` from Variables tab
4. Run migrations (same as Supabase)

---

### Option 3: AWS RDS (Production)

**For high-traffic production apps**

**Steps**:
1. AWS Console → RDS → Create Database
2. Choose PostgreSQL 14.x
3. Instance size: db.t3.micro (free tier)
4. Enable automated backups
5. Configure security groups (allow port 5432)
6. Get endpoint URL → Update DATABASE_URL

---

## 7.4 Deploy Backend (Node.js API)

### Option 1: Railway (Recommended)

**Features**:
- ✅ GitHub integration
- ✅ Auto-deploy on push
- ✅ Environment variables management
- ✅ Built-in logging

**Steps**:

1. **Prepare Backend**
   ```bash
   # Ensure package.json has start script
   "scripts": {
     "start": "node app.js",
     "build": "echo 'No build step'"
   }
   ```

2. **Create Railway Project**
   - Visit [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select repository: `KaDongSite`
   - Root directory: `/backend`

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all variables from `.env.production`
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   SESSION_SECRET=...
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Railway auto-deploys on git push
   - Get deployment URL: `https://kadong-api.railway.app`

5. **Setup Custom Domain (Optional)**
   - Settings → Domains → Add Custom Domain
   - Add DNS CNAME record: `api.kadong-tools.com → xxx.railway.app`

---

### Option 2: Heroku

**Steps**:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create kadong-api
   ```

3. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:essential-0
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your_secret
   heroku config:set CORS_ORIGIN=https://your-frontend.vercel.app
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Run Migrations**
   ```bash
   heroku run npm run db:migrate:up
   ```

---

### Option 3: DigitalOcean App Platform

**Steps**:

1. Create DigitalOcean account
2. App Platform → Create App → GitHub
3. Select repository → Choose `/backend` folder
4. Configure:
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **Port**: 5000
5. Add Environment Variables
6. Deploy → Get URL

---

## 7.5 Deploy Frontend (React + Vite)

### Option 1: Vercel (Recommended)

**Features**:
- ✅ Free for personal projects
- ✅ Automatic HTTPS
- ✅ CDN distribution
- ✅ GitHub integration
- ✅ Preview deployments

**Steps**:

1. **Prepare Frontend**
   ```bash
   # Update API base URL
   # .env.production
   VITE_API_BASE_URL=https://kadong-api.railway.app/api
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import Git Repository
   - Select `KaDongSite` repo
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Settings → Environment Variables
   - Add `VITE_API_BASE_URL`

4. **Deploy**
   - Click Deploy
   - Auto-deploy on git push to main branch

5. **Get URL**
   - Production URL: `https://kadong-tools.vercel.app`

6. **Custom Domain (Optional)**
   - Settings → Domains → Add Domain
   - Add DNS records:
     ```
     A     @     76.76.21.21
     CNAME www   cname.vercel-dns.com
     ```

---

### Option 2: Netlify

**Steps**:

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Visit [netlify.com](https://netlify.com)
   - Drag & drop `dist/` folder to Netlify

3. **Configure**
   - Site Settings → Build & Deploy
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Environment Variables**
   - Site Settings → Environment
   - Add `VITE_API_BASE_URL`

5. **Continuous Deployment**
   - Connect GitHub repository
   - Auto-deploy on push

---

### Option 3: GitHub Pages

**Steps**:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/KaDongSite",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/KaDongSite/',
     // ...
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

---

## 7.6 CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      
      - name: Run tests
        working-directory: ./backend
        run: npm test
      
      - name: Deploy to Railway
        run: |
          # Railway auto-deploys on push
          echo "Backend deployed via Railway GitHub integration"
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Build
        working-directory: ./frontend
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        run: npm run build
      
      - name: Deploy to Vercel
        run: |
          # Vercel auto-deploys on push
          echo "Frontend deployed via Vercel GitHub integration"
```

---

## 7.7 Database Migrations in Production

### Safe Migration Strategy

```bash
# 1. Backup database first
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# 2. Test migration on staging
DATABASE_URL=$STAGING_DB npm run db:migrate:up

# 3. If successful, run on production
DATABASE_URL=$PRODUCTION_DB npm run db:migrate:up

# 4. Verify data integrity
psql $PRODUCTION_DB -c "SELECT COUNT(*) FROM users;"
```

### Rollback Strategy

```bash
# If migration fails, rollback
npm run db:migrate:down

# Restore from backup
psql $DATABASE_URL < backup_20241111.sql
```

---

## 7.8 Performance Optimization

### Frontend Optimization

```javascript
// vite.config.js - Production build optimization
export default defineConfig({
  build: {
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer': ['framer-motion'],
          'utils': ['date-fns', 'lucide-react']
        }
      }
    }
  }
})
```

### Backend Optimization

```javascript
// app.js - Production middleware
if (process.env.NODE_ENV === 'production') {
  // Compression
  const compression = require('compression')
  app.use(compression())
  
  // Security headers
  const helmet = require('helmet')
  app.use(helmet())
  
  // Rate limiting
  const rateLimit = require('express-rate-limit')
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  })
  app.use('/api/', limiter)
}
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX CONCURRENTLY idx_notes_user_created 
ON notes(user_id, created_at DESC);

-- Vacuum and analyze
VACUUM ANALYZE;

-- Enable connection pooling (already configured)
```

---

## 7.9 Monitoring & Logging

### Backend Logging (Winston)

```bash
npm install winston
```

```javascript
// config/logger.js
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger
```

### Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/react
```

**Backend**:
```javascript
// app.js
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

**Frontend**:
```javascript
// main.jsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV
})
```

### Uptime Monitoring

**Options**:
- [UptimeRobot](https://uptimerobot.com) - Free, 5-minute checks
- [Pingdom](https://pingdom.com) - Advanced monitoring
- [StatusCake](https://statuscake.com) - Free tier available

**Setup**:
1. Add health check endpoint
   ```javascript
   // app.js
   app.get('/health', (req, res) => {
     res.json({ status: 'ok', timestamp: new Date() })
   })
   ```

2. Configure UptimeRobot to check `https://api.kadong-tools.com/health` every 5 minutes

---

## 7.10 SSL/HTTPS Setup

### Automatic SSL (Railway/Vercel/Netlify)

- ✅ Auto-provisioned
- ✅ Auto-renewal
- ✅ No configuration needed

### Manual SSL (DigitalOcean/Custom Server)

**Using Let's Encrypt (Free)**:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.kadong-tools.com

# Auto-renewal (cron job)
sudo certbot renew --dry-run
```

---

## 7.11 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] CORS configured correctly
- [ ] SSL certificates ready
- [ ] Backup strategy in place

### Post-Deployment

- [ ] Health check endpoint responding
- [ ] Database connection working
- [ ] Frontend can reach backend API
- [ ] Authentication flow working
- [ ] All pages loading correctly
- [ ] No console errors
- [ ] Monitoring tools active
- [ ] DNS records propagated (if custom domain)

---

## 7.12 Rollback Plan

### Frontend Rollback (Vercel)

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Backend Rollback (Railway)

1. Go to Railway dashboard
2. Deployments tab
3. Find previous successful deployment
4. Click "Redeploy"

### Database Rollback

```bash
# Restore from backup
pg_restore -d $DATABASE_URL backup_20241111.dump

# Or use SQL backup
psql $DATABASE_URL < backup_20241111.sql
```

---

## 📎 Related Links

- **[Setup Guide](03_SetupAndInstallation.md)** - Local development setup
- **[Database Schema](04_DatabaseSchema.md)** - Database structure
- **[Maintenance Guide](11_Maintenance_Guide.md)** - Ongoing maintenance
- **[Troubleshooting](09_Troubleshooting.md)** - Common deployment issues

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
