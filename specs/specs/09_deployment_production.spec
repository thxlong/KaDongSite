# Deployment & Production Release - KaDong Tools

**Spec ID:** `09_deployment_production`  
**Version:** 1.0.0  
**Status:** 📝 Draft  
**Created:** 2025-11-13  
**Last Updated:** 2025-11-13

---

## 📋 Overview

**Title:** Deploy & Public Website KaDong Tools lên Internet  
**Type:** Deployment & Infrastructure  
**Priority:** 🔴 Critical

**Purpose:**  
Triển khai toàn bộ KaDong Tools (Frontend + Backend + Database) lên môi trường production, public website để người dùng trên toàn thế giới có thể truy cập qua Internet với domain chính thức, đảm bảo tính sẵn sàng, hiệu suất và bảo mật.

**Problem Statement:**  
Hiện tại, ứng dụng KaDong Tools chỉ chạy ở môi trường development (localhost). Người dùng không thể truy cập từ xa, không có:
- Domain chính thức (https://kadong-tools.com)
- HTTPS/SSL certificate cho bảo mật
- Production database với backup tự động
- CDN cho tốc độ tải nhanh toàn cầu
- Monitoring & logging cho production
- Auto-scaling để xử lý traffic cao
- CI/CD pipeline cho deploy tự động
- Environment separation (dev/staging/prod)

**Business Impact:**  
- Cho phép người dùng truy cập mọi lúc, mọi nơi
- Tăng uy tín với domain chuyên nghiệp
- Bảo mật HTTPS cho authentication flow
- Tốc độ tải nhanh với CDN
- Sẵn sàng cho marketing và mở rộng người dùng

---

## 🎯 Goals

### Primary Goals

1. **Frontend Deployment**
   - Deploy React app lên Vercel
   - Setup custom domain: https://kadong-tools.com
   - Enable automatic HTTPS/SSL
   - Configure CDN cho static assets
   - Enable automatic deployment from Git (main branch)

2. **Backend Deployment**
   - Deploy Express API lên Railway
   - Setup environment variables an toàn
   - Configure CORS cho production domain
   - Enable automatic deployment from Git
   - Setup health check endpoint

3. **Database Setup**
   - Setup PostgreSQL database trên Supabase/Railway
   - Chạy migrations trên production DB
   - Seed initial admin user
   - Enable automatic backups (daily)
   - Configure connection pooling

4. **Domain & SSL**
   - Đăng ký domain: kadong-tools.com (hoặc free subdomain)
   - Point domain DNS to Vercel
   - Setup API subdomain: api.kadong-tools.com
   - Enable SSL certificates (automatic với Vercel)
   - Configure HTTPS redirect (HTTP → HTTPS)

5. **Monitoring & Logging**
   - Setup error tracking (Sentry)
   - Setup uptime monitoring (UptimeRobot)
   - Configure logging (Winston + CloudWatch hoặc Logtail)
   - Setup analytics (Google Analytics / Vercel Analytics)
   - Configure alerts cho downtime

### Secondary Goals

- Setup staging environment (staging.kadong-tools.com)
- Enable preview deployments cho pull requests
- Configure CI/CD pipeline với automated tests
- Setup database backup automation
- Configure rate limiting cho production
- Enable caching strategy (Redis hoặc Vercel Edge Cache)

### Nice to Have

- Setup CDN caching strategy
- Configure auto-scaling rules
- Setup database replication (read replicas)
- Enable WAF (Web Application Firewall)
- Setup DDoS protection
- Multi-region deployment cho low latency

### Non-Goals

- Kubernetes deployment (quá phức tạp cho scale hiện tại)
- Self-hosted infrastructure (sử dụng managed services)
- Mobile app deployment (chỉ web)
- Multi-cloud strategy (chỉ 1 provider)
- Enterprise features (SSO, SAML, etc.)

---

## ✅ Acceptance Criteria

### Must Have (Required)

#### AC1: Frontend Accessible Publicly
- [ ] Website accessible tại https://kadong-tools.com
- [ ] HTTPS enabled với valid SSL certificate
- [ ] All pages load < 3 seconds (First Contentful Paint)
- [ ] Mobile responsive (verified trên iOS & Android)
- [ ] All features hoạt động đúng trên production
- [ ] No console errors trên production build
- [ ] Assets served from CDN (Vercel Edge Network)

#### AC2: Backend API Functional
- [ ] API accessible tại https://api.kadong-tools.com
- [ ] Health check endpoint: GET /api/health returns 200
- [ ] All endpoints trả về correct responses
- [ ] Authentication flow hoạt động (login/register/logout)
- [ ] Database queries successful
- [ ] CORS configured cho frontend domain
- [ ] Rate limiting active (100 req/15min per IP)
- [ ] API response time < 500ms (p95)

#### AC3: Database Production Ready
- [ ] PostgreSQL database deployed và accessible
- [ ] All migrations executed successfully
- [ ] Database seeded với admin user
- [ ] Connection pooling configured (max 20 connections)
- [ ] Automatic daily backups enabled
- [ ] SSL/TLS connection enforced
- [ ] Database credentials stored securely (env vars)

#### AC4: Domain & SSL Configuration
- [ ] Custom domain kadong-tools.com registered (hoặc free subdomain)
- [ ] DNS records configured:
  - `A` record: kadong-tools.com → Vercel IP
  - `CNAME` record: api.kadong-tools.com → Railway
  - `CNAME` record: www.kadong-tools.com → kadong-tools.com
- [ ] SSL certificate auto-renewed (Let's Encrypt)
- [ ] HTTP → HTTPS redirect active
- [ ] HSTS header enabled (max-age=31536000)

#### AC5: Environment Variables Secure
- [ ] Backend env vars set trên Railway:
  - `DATABASE_URL` (production DB connection string)
  - `JWT_SECRET` (min 32 characters random string)
  - `NODE_ENV=production`
  - `ALLOWED_ORIGINS=https://kadong-tools.com`
  - `COOKIE_SECURE=true`
- [ ] Frontend env vars set trên Vercel:
  - `VITE_API_BASE_URL=https://api.kadong-tools.com`
  - `VITE_APP_ENV=production`
- [ ] No secrets committed to Git
- [ ] Secrets rotated from default values

#### AC6: Deployment Automation
- [ ] Git push to `main` branch auto-deploys backend (Railway)
- [ ] Git push to `main` branch auto-deploys frontend (Vercel)
- [ ] Pull requests trigger preview deployments (Vercel)
- [ ] Deployment status notifications (Slack/Email)
- [ ] Rollback capability (1-click trong dashboard)

#### AC7: Monitoring Active
- [ ] Error tracking setup (Sentry cho frontend + backend)
- [ ] Uptime monitoring (UptimeRobot ping /health every 5 min)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Log aggregation (Winston logs shipped to Logtail)
- [ ] Alerts configured:
  - Email alert nếu uptime < 99.5%
  - Slack alert nếu có critical errors
  - Email alert nếu API response time > 1s (p95)

### Should Have (Important)

#### AC8: Staging Environment
- [ ] Staging frontend: https://staging.kadong-tools.com
- [ ] Staging backend: https://api-staging.kadong-tools.com
- [ ] Staging database (separate từ production)
- [ ] Deploy to staging trước khi deploy production
- [ ] Smoke tests pass trên staging trước go-live

#### AC9: Performance Optimized
- [ ] Lighthouse score > 90 (Performance)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Assets minified và compressed (Gzip/Brotli)
- [ ] Images optimized (WebP format, lazy loading)
- [ ] Code splitting enabled (Vite automatic)
- [ ] CDN cache headers configured (max-age=31536000 cho static assets)

#### AC10: Security Hardened
- [ ] Security headers configured:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] CORS restricted to production domain only
- [ ] Rate limiting enforced
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React auto-escaping)
- [ ] Cookie security: httpOnly, secure, SameSite=Strict

### Nice to Have (Optional)

#### AC11: Advanced Features
- [ ] Database connection pooling với PgBouncer
- [ ] Redis caching cho API responses
- [ ] CDN caching strategy (Cloudflare hoặc Vercel Edge)
- [ ] Auto-scaling based on traffic (Railway auto-scaling)
- [ ] Geographic distribution (multi-region deployment)

---

## 🏗️ Technical Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          🌐 INTERNET                                │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
                    ▼                            ▼
         ┌──────────────────────┐    ┌─────────────────────┐
         │  Frontend (Vercel)   │    │  Backend (Railway)  │
         │  kadong-tools.com    │◄───┤ api.kadong-tools.com│
         │                      │    │                     │
         │  - React App         │    │  - Express API      │
         │  - Static Assets     │    │  - JWT Auth         │
         │  - CDN (Edge)        │    │  - REST Endpoints   │
         │  - HTTPS/SSL         │    │  - CORS             │
         └──────────────────────┘    └──────────┬──────────┘
                                                 │
                                                 │ SSL/TLS
                                                 ▼
                                      ┌────────────────────┐
                                      │ Database (Supabase)│
                                      │ PostgreSQL 13+     │
                                      │                    │
                                      │ - Users table      │
                                      │ - Sessions         │
                                      │ - Notes, Events    │
                                      │ - Auto Backups     │
                                      └────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      📊 MONITORING & LOGGING                        │
├─────────────────────────────────────────────────────────────────────┤
│  Sentry (Errors)  │  UptimeRobot (Uptime)  │  Vercel Analytics    │
│  Logtail (Logs)   │  Google Analytics      │  Railway Metrics     │
└─────────────────────────────────────────────────────────────────────┘
```

### Deployment Flow

```mermaid
graph TD
    A[👨‍💻 Developer] -->|1. git push| B[GitHub Repository]
    B -->|2. Webhook| C[Vercel CI/CD]
    B -->|3. Webhook| D[Railway CI/CD]
    
    C -->|4. Build| E[Frontend Build]
    D -->|5. Build| F[Backend Build]
    
    E -->|6. Deploy| G[Vercel Edge Network]
    F -->|7. Deploy| H[Railway Container]
    
    H -->|8. Connect| I[(PostgreSQL DB)]
    
    G -->|9. Fetch| H
    
    J[🌐 User] -->|10. Visit| G
    G -->|11. API Call| H
    H -->|12. Query| I
```

### Infrastructure Components

#### 1. Frontend - Vercel

**Platform:** Vercel (https://vercel.com)  
**Pricing:** Free tier (Hobby plan)  
**Features:**
- Automatic HTTPS/SSL
- Global CDN (Edge Network)
- Automatic deployments từ Git
- Preview deployments cho PRs
- Web Analytics
- Edge Functions (if needed)

**Configuration:**
```javascript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.kadong-tools.com"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://api.kadong-tools.com",
    "VITE_APP_ENV": "production"
  }
}
```

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Select `frontend` directory as root
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Configure environment variables
6. Set production branch: `main`
7. Enable automatic deployments

#### 2. Backend - Railway

**Platform:** Railway (https://railway.app)  
**Pricing:** Free $5 credit/month (then ~$5-20/month)  
**Features:**
- Automatic deployments từ Git
- Built-in PostgreSQL database
- Environment variables management
- Health checks & auto-restart
- Logs & metrics
- Custom domains
- Auto-scaling

**Configuration:**
```json
// railway.json (optional)
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "healthcheck": {
    "path": "/api/health",
    "intervalSeconds": 60,
    "timeoutSeconds": 10
  }
}
```

**Environment Variables (Railway):**
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/kadongsite
JWT_SECRET=<generate_with_openssl_rand_base64_32>
SESSION_SECRET=<generate_random>
ALLOWED_ORIGINS=https://kadong-tools.com,https://www.kadong-tools.com
COOKIE_SECURE=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Deployment Steps:**
1. Create new project trên Railway
2. Connect GitHub repository
3. Select `backend` directory as root
4. Add PostgreSQL database service
5. Configure environment variables
6. Set start command: `npm start`
7. Enable health checks
8. Configure custom domain: api.kadong-tools.com

#### 3. Database - Supabase (or Railway PostgreSQL)

**Platform:** Supabase (https://supabase.com) hoặc Railway built-in DB  
**Pricing:** Free tier (500MB database, 50MB file storage)  
**Features:**
- PostgreSQL 13+
- Automatic backups (daily)
- Connection pooling (PgBouncer)
- SSL/TLS enforced
- Database dashboard
- SQL editor
- Real-time subscriptions (if needed)

**Configuration:**
```sql
-- Enable SSL/TLS connection
ALTER DATABASE kadongsite SET ssl_mode = 'require';

-- Configure connection pooling
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
```

**Backup Strategy:**
- Automatic daily backups (Supabase hoặc Railway)
- Retention: 7 days (free tier), 30 days (paid tier)
- Manual backup command:
  ```bash
  pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
  ```

#### 4. Domain & DNS - Cloudflare

**Domain Registrar:** Namecheap / GoDaddy / Google Domains (hoặc free subdomain từ Vercel)  
**DNS Provider:** Cloudflare (free tier)  
**Features:**
- Free SSL certificates
- DDoS protection
- CDN caching
- Analytics
- WAF (Web Application Firewall)

**DNS Records:**
```
Type    Name    Value                           TTL
A       @       76.76.21.21 (Vercel IP)        Auto
CNAME   www     kadong-tools.com                Auto
CNAME   api     <railway-app>.up.railway.app   Auto
TXT     @       vercel-verification=<token>    Auto
```

**Cloudflare Settings:**
- SSL/TLS mode: Full (Strict)
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- Minimum TLS Version: 1.2
- TLS 1.3: ON
- HSTS: Enabled (max-age=31536000)

---

## 🔄 Data Flow

### Production Request Flow

1. **User visits https://kadong-tools.com**
   - DNS resolves to Cloudflare
   - Cloudflare routes to Vercel Edge Network
   - Vercel serves cached HTML/CSS/JS from CDN
   - Browser loads React app

2. **User logs in**
   - React app sends POST /api/auth/login to https://api.kadong-tools.com
   - Cloudflare routes API request to Railway
   - Railway Express server validates credentials
   - Query PostgreSQL database (Supabase)
   - Generate JWT token
   - Set httpOnly cookie
   - Return user data to frontend

3. **User fetches notes**
   - React app sends GET /api/notes với JWT cookie
   - Railway verifies JWT signature
   - Query notes from PostgreSQL
   - Return notes JSON
   - React renders notes list

### Deployment Flow

1. **Developer pushes code**
   - `git push origin main`
   - GitHub webhook triggers Vercel + Railway

2. **Vercel builds frontend**
   - Install dependencies: `npm install`
   - Build production bundle: `npm run build`
   - Optimize assets (minify, compress)
   - Deploy to Edge Network
   - Invalidate CDN cache

3. **Railway builds backend**
   - Install dependencies: `npm install`
   - Run health check: `GET /api/health`
   - Deploy new container
   - Zero-downtime deployment (rolling update)

4. **Database migration** (manual or automated)
   - SSH to Railway (hoặc use Railway CLI)
   - Run: `npm run db:migrate:up`
   - Verify: `npm run db:migrate:status`

---

## 🔐 Security Considerations

### Authentication & Authorization
- [x] JWT tokens với httpOnly cookies (XSS protection)
- [x] SameSite=Strict (CSRF protection)
- [x] Secure flag trên cookies (HTTPS only)
- [x] Token expiry: 7 days (30 days với remember me)
- [x] Session revocation on logout (sessions table)
- [ ] Rate limiting: 5 login attempts/15min per IP
- [ ] Account lockout sau 10 failed attempts

### Network Security
- [x] HTTPS enforced (HTTP → HTTPS redirect)
- [x] HSTS header (max-age=31536000)
- [x] TLS 1.2+ only (disable TLS 1.0/1.1)
- [ ] Certificate pinning (optional)
- [x] DDoS protection (Cloudflare)
- [ ] WAF rules (block SQL injection, XSS patterns)

### Application Security
- [x] Environment variables cho secrets (không commit to Git)
- [x] SQL injection prevention (parameterized queries với pg)
- [x] XSS prevention (React auto-escaping)
- [x] CORS restricted to production domain
- [ ] CSP (Content Security Policy) header
- [ ] Input validation (backend + frontend)
- [ ] Output encoding
- [ ] File upload validation (nếu có feature upload)

### Database Security
- [x] SSL/TLS connection enforced
- [x] Connection pooling (limit 20 connections)
- [x] Least privilege principle (database user chỉ có quyền cần thiết)
- [ ] Database encryption at rest (Supabase default)
- [ ] Audit logging (track sensitive operations)
- [ ] Automatic backups encrypted

### Infrastructure Security
- [x] Secrets stored in platform vaults (Vercel/Railway env vars)
- [x] No secrets in Git repository
- [x] No default credentials (rotate JWT_SECRET, DB password)
- [ ] Regular dependency updates (npm audit)
- [ ] Container scanning (Railway auto-scan)
- [ ] Access control (2FA for Vercel/Railway accounts)

### Monitoring & Alerting
- [ ] Error tracking (Sentry for frontend + backend)
- [ ] Uptime monitoring (UptimeRobot ping /health)
- [ ] Performance monitoring (Vercel Analytics, Railway metrics)
- [ ] Security alerts (failed login attempts, suspicious activity)
- [ ] Anomaly detection (unusual traffic patterns)

---

## 📊 Performance Requirements

### Response Time (95th percentile)

| Endpoint | Target | Critical | Measurement |
|----------|--------|----------|-------------|
| Frontend page load | < 2s | < 4s | Lighthouse |
| API login | < 300ms | < 500ms | New Relic |
| API get notes | < 200ms | < 400ms | Railway metrics |
| Database query | < 50ms | < 100ms | pg_stat_statements |
| Asset load (CDN) | < 500ms | < 1s | Vercel Analytics |

### Throughput

| Metric | Target | Critical |
|--------|--------|----------|
| Concurrent users | 100 | 500 |
| Requests/second | 50 | 200 |
| Database connections | 10 avg | 20 max |
| CDN bandwidth | < 10GB/month (free tier) | < 100GB |

### Availability

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | 99.5% | UptimeRobot |
| Monthly downtime | < 3.6 hours | UptimeRobot |
| Error rate | < 0.5% | Sentry |
| Failed requests | < 1% | Vercel/Railway logs |

### Scalability

| Metric | Current | Target (6 months) | Strategy |
|--------|---------|-------------------|----------|
| Users | 10 | 1000 | Auto-scaling (Railway) |
| Database size | 10MB | 500MB | Supabase free tier OK |
| Traffic | 100 req/day | 10,000 req/day | CDN caching |
| Storage | 1MB | 50MB | Vercel/Railway free tier |

### Caching Strategy

**Frontend (Vercel):**
- Static assets (CSS, JS, images): `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: public, max-age=0, must-revalidate`
- API responses: No cache (dynamic data)

**Backend (Railway):**
- Enable response compression (Gzip/Brotli)
- Cache static responses (GET endpoints cho reference data)
- Cache TTL: 5 minutes cho gold prices, 1 hour cho currency rates

**Database:**
- Query result caching (pg_stat_statements)
- Connection pooling (PgBouncer)
- Materialized views cho complex queries (if needed)

---

## 🧪 Testing Strategy

### Pre-Deployment Testing

#### 1. Local Testing
- [ ] All features hoạt động trên localhost
- [ ] Backend tests pass: `npm test` (backend)
- [ ] Frontend tests pass: `npm test` (frontend)
- [ ] E2E tests pass: `npx playwright test`
- [ ] No console errors/warnings
- [ ] Database migrations successful

#### 2. Staging Testing
- [ ] Deploy to staging environment
- [ ] Smoke test all critical paths:
  - Registration flow
  - Login flow
  - Create/read/update/delete notes
  - Logout flow
  - Password reset flow
- [ ] Test authentication với production-like JWT_SECRET
- [ ] Test CORS với staging domain
- [ ] Test API rate limiting
- [ ] Test database connection pooling

#### 3. Production Build Testing
- [ ] Build production bundle: `npm run build`
- [ ] Verify bundle size < 1MB (frontend)
- [ ] Test production build locally: `npm run preview`
- [ ] Lighthouse audit: Performance > 90
- [ ] No source maps in production bundle
- [ ] No console.log statements in production code

### Post-Deployment Testing

#### 4. Smoke Testing (Production)
- [ ] Visit https://kadong-tools.com → loads successfully
- [ ] Visit https://api.kadong-tools.com/api/health → returns 200
- [ ] Register new test account → success
- [ ] Login với test account → success
- [ ] Create note → saves to database
- [ ] Logout → clears session
- [ ] Mobile test (iOS Safari, Android Chrome)

#### 5. Security Testing
- [ ] SSL certificate valid (A+ rating on SSLLabs)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Security headers present (check securityheaders.com)
- [ ] CORS restricted to production domain
- [ ] Rate limiting active (test 10 rapid requests → 429)
- [ ] No secrets exposed in frontend bundle

#### 6. Performance Testing
- [ ] Lighthouse audit: Performance > 90, Best Practices > 90
- [ ] API response time < 500ms (test với Postman)
- [ ] Page load time < 3s (test từ different locations)
- [ ] CDN serving assets (check response headers)
- [ ] Database query time < 100ms (check Railway metrics)

#### 7. Load Testing (Optional)
- [ ] Use Artillery hoặc k6 to simulate 100 concurrent users
- [ ] API should handle 50 req/s without errors
- [ ] Database connections stay < 20
- [ ] No memory leaks (monitor Railway metrics)

### Monitoring & Regression Testing

#### 8. Continuous Monitoring (24/7)
- [ ] UptimeRobot pings /health every 5 min → uptime > 99.5%
- [ ] Sentry tracks errors → error rate < 0.5%
- [ ] Vercel Analytics tracks page views → load time < 3s
- [ ] Railway metrics track API performance → response time < 500ms

#### 9. Weekly Regression Testing
- [ ] Run full E2E test suite: `npx playwright test`
- [ ] Test all critical user journeys
- [ ] Verify no new errors in Sentry
- [ ] Check uptime report (UptimeRobot)
- [ ] Review performance trends (Vercel/Railway dashboards)

---

## 📝 Implementation Plan

### Phase 1: Infrastructure Setup (1 day)

#### Milestone 1.1: Platform Accounts
- [ ] **Task 1.1.1:** Create Vercel account
  - Sign up tại https://vercel.com với GitHub account
  - Free Hobby plan (unlimited deployments, 100GB bandwidth)
  - **Deliverable:** Vercel account ready

- [ ] **Task 1.1.2:** Create Railway account
  - Sign up tại https://railway.app với GitHub account
  - Free $5 credit/month (~140 hours runtime)
  - **Deliverable:** Railway account ready

- [ ] **Task 1.1.3:** Create Supabase account (optional, hoặc dùng Railway DB)
  - Sign up tại https://supabase.com
  - Free tier: 500MB database, 1GB file storage
  - **Deliverable:** Supabase account ready

- [ ] **Task 1.1.4:** Register domain (optional)
  - Option A: Buy domain từ Namecheap (~$10/year)
  - Option B: Use free Vercel subdomain (kadong-tools.vercel.app)
  - **Deliverable:** Domain registered (or skip)

#### Milestone 1.2: Database Setup
- [ ] **Task 1.2.1:** Create production database
  - Platform: Supabase hoặc Railway PostgreSQL
  - Copy DATABASE_URL connection string
  - **Deliverable:** Production database created

- [ ] **Task 1.2.2:** Run migrations trên production DB
  - Connect to production DB:
    ```bash
    export DATABASE_URL="postgresql://..."
    npm run db:migrate:up
    ```
  - Verify tables created:
    ```bash
    psql $DATABASE_URL -c "\dt"
    ```
  - **Deliverable:** Database schema migrated

- [ ] **Task 1.2.3:** Seed production database
  - Seed admin user:
    ```bash
    node backend/database/seeds/008_auth_seed_es6.js
    ```
  - Verify:
    ```sql
    SELECT id, email, role FROM users WHERE role='admin';
    ```
  - **Deliverable:** Admin user created

- [ ] **Task 1.2.4:** Configure backups
  - Supabase: Automatic daily backups (built-in)
  - Railway: Enable automatic backups (Settings → Backups)
  - **Deliverable:** Backups enabled

---

### Phase 2: Backend Deployment (1 day)

#### Milestone 2.1: Railway Project Setup
- [ ] **Task 2.1.1:** Create new Railway project
  - Dashboard → New Project → Deploy from GitHub
  - Select repository: `KaDongSite`
  - Root directory: `backend`
  - **Deliverable:** Railway project created

- [ ] **Task 2.1.2:** Configure environment variables
  - Railway Dashboard → Variables:
    ```bash
    NODE_ENV=production
    PORT=5000
    DATABASE_URL=<supabase_or_railway_db_url>
    JWT_SECRET=<generate_random_32_chars>
    SESSION_SECRET=<generate_random>
    ALLOWED_ORIGINS=https://kadong-tools.com
    COOKIE_SECURE=true
    ```
  - Generate JWT_SECRET:
    ```bash
    openssl rand -base64 32
    ```
  - **Deliverable:** Env vars configured

- [ ] **Task 2.1.3:** Configure build settings
  - Build command: `npm install`
  - Start command: `npm start`
  - **Deliverable:** Build settings saved

#### Milestone 2.2: Deploy Backend
- [ ] **Task 2.2.1:** Deploy backend to Railway
  - Click "Deploy" button trên Railway
  - Wait for build to complete (~2-3 min)
  - Check logs for errors
  - **Deliverable:** Backend deployed

- [ ] **Task 2.2.2:** Verify deployment
  - Get Railway URL: `https://<app-name>.up.railway.app`
  - Test health check:
    ```bash
    curl https://<app-name>.up.railway.app/api/health
    # Should return: {"status":"ok","timestamp":"..."}
    ```
  - **Deliverable:** Health check passes

- [ ] **Task 2.2.3:** Configure custom domain (API subdomain)
  - Railway Settings → Domains → Add Domain
  - Enter: `api.kadong-tools.com`
  - Copy CNAME record: `<app-name>.up.railway.app`
  - **Deliverable:** Domain added (DNS config in Phase 4)

---

### Phase 3: Frontend Deployment (1 day)

#### Milestone 3.1: Vercel Project Setup
- [ ] **Task 3.1.1:** Create new Vercel project
  - Dashboard → New Project → Import Git Repository
  - Select repository: `KaDongSite`
  - Root directory: `frontend`
  - Framework preset: Vite
  - **Deliverable:** Vercel project created

- [ ] **Task 3.1.2:** Configure build settings
  - Build command: `npm run build`
  - Output directory: `dist`
  - Install command: `npm install`
  - **Deliverable:** Build settings saved

- [ ] **Task 3.1.3:** Configure environment variables
  - Vercel Dashboard → Settings → Environment Variables:
    ```bash
    VITE_API_BASE_URL=https://api.kadong-tools.com
    VITE_APP_ENV=production
    ```
  - **Deliverable:** Env vars configured

#### Milestone 3.2: Deploy Frontend
- [ ] **Task 3.2.1:** Deploy frontend to Vercel
  - Click "Deploy" button
  - Wait for build (~1-2 min)
  - Check deployment logs
  - **Deliverable:** Frontend deployed

- [ ] **Task 3.2.2:** Verify deployment
  - Get Vercel URL: `https://kadong-tools.vercel.app`
  - Visit URL → should load website
  - Check browser console → no errors
  - **Deliverable:** Website loads

- [ ] **Task 3.2.3:** Configure custom domain (root domain)
  - Vercel Settings → Domains → Add Domain
  - Enter: `kadong-tools.com`
  - Add `www.kadong-tools.com` as alias
  - Copy DNS records (configure in Phase 4)
  - **Deliverable:** Domain added

---

### Phase 4: Domain & DNS Configuration (0.5 day)

#### Milestone 4.1: DNS Setup
- [ ] **Task 4.1.1:** Point domain to Cloudflare (optional)
  - Add domain to Cloudflare
  - Update nameservers tại domain registrar
  - Wait for propagation (~1 hour)
  - **Deliverable:** Cloudflare managing DNS

- [ ] **Task 4.1.2:** Configure DNS records
  - Cloudflare DNS → Add records:
    ```
    A      @    76.76.21.21       (Vercel IP)
    CNAME  www  kadong-tools.com
    CNAME  api  <railway-app>.up.railway.app
    ```
  - TTL: Auto (or 300 seconds)
  - Proxy status: Proxied (orange cloud)
  - **Deliverable:** DNS records added

- [ ] **Task 4.1.3:** Verify DNS propagation
  - Check DNS:
    ```bash
    nslookup kadong-tools.com
    nslookup api.kadong-tools.com
    ```
  - Wait for propagation (~5-60 min)
  - **Deliverable:** DNS resolves correctly

#### Milestone 4.2: SSL/TLS Setup
- [ ] **Task 4.2.1:** Enable SSL on Vercel
  - Vercel auto-provisions Let's Encrypt certificate
  - Wait for certificate issuance (~5 min)
  - Verify: https://kadong-tools.com loads với valid SSL
  - **Deliverable:** SSL active on frontend

- [ ] **Task 4.2.2:** Enable SSL on Railway
  - Railway auto-provisions SSL for custom domain
  - Verify: https://api.kadong-tools.com/api/health → valid SSL
  - **Deliverable:** SSL active on backend

- [ ] **Task 4.2.3:** Configure Cloudflare SSL settings
  - SSL/TLS mode: Full (Strict)
  - Always Use HTTPS: ON
  - Minimum TLS Version: 1.2
  - **Deliverable:** SSL hardened

---

### Phase 5: Security Configuration (0.5 day)

#### Milestone 5.1: Security Headers
- [ ] **Task 5.1.1:** Add security headers to frontend
  - Create `vercel.json`:
    ```json
    {
      "headers": [
        {
          "source": "/(.*)",
          "headers": [
            { "key": "X-Frame-Options", "value": "DENY" },
            { "key": "X-Content-Type-Options", "value": "nosniff" },
            { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
          ]
        }
      ]
    }
    ```
  - Commit và push to Git
  - **Deliverable:** Security headers active

- [ ] **Task 5.1.2:** Configure CORS on backend
  - Update `backend/app.js`:
    ```javascript
    const cors = require('cors');
    app.use(cors({
      origin: process.env.ALLOWED_ORIGINS.split(','),
      credentials: true
    }));
    ```
  - Verify ALLOWED_ORIGINS env var: `https://kadong-tools.com`
  - **Deliverable:** CORS restricted

- [ ] **Task 5.1.3:** Enable rate limiting
  - Verify rate limit middleware active (already implemented)
  - Test: Send 10 rapid login requests → 6th should get 429
  - **Deliverable:** Rate limiting works

#### Milestone 5.2: Secrets Rotation
- [ ] **Task 5.2.1:** Rotate JWT_SECRET
  - Generate new secret:
    ```bash
    openssl rand -base64 32
    ```
  - Update Railway env var: `JWT_SECRET=<new_value>`
  - Redeploy backend
  - **Deliverable:** JWT_SECRET rotated

- [ ] **Task 5.2.2:** Verify no secrets in Git
  - Search codebase:
    ```bash
    git grep -i "password\|secret\|api_key"
    ```
  - Ensure only .env.example has placeholders
  - **Deliverable:** No secrets committed

---

### Phase 6: Monitoring Setup (0.5 day)

#### Milestone 6.1: Error Tracking (Sentry)
- [ ] **Task 6.1.1:** Create Sentry account
  - Sign up tại https://sentry.io (free tier: 5K errors/month)
  - Create project: "KaDong Frontend"
  - Create project: "KaDong Backend"
  - **Deliverable:** Sentry projects created

- [ ] **Task 6.1.2:** Install Sentry SDK (Frontend)
  - Install:
    ```bash
    npm install @sentry/react --save
    ```
  - Initialize in `frontend/src/main.jsx`:
    ```javascript
    import * as Sentry from "@sentry/react";
    Sentry.init({
      dsn: "https://xxx@sentry.io/xxx",
      environment: "production",
      tracesSampleRate: 0.1
    });
    ```
  - Add VITE_SENTRY_DSN to Vercel env vars
  - **Deliverable:** Frontend errors tracked

- [ ] **Task 6.1.3:** Install Sentry SDK (Backend)
  - Install:
    ```bash
    npm install @sentry/node --save
    ```
  - Initialize in `backend/app.js`:
    ```javascript
    const Sentry = require("@sentry/node");
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    ```
  - Add SENTRY_DSN to Railway env vars
  - **Deliverable:** Backend errors tracked

#### Milestone 6.2: Uptime Monitoring (UptimeRobot)
- [ ] **Task 6.2.1:** Create UptimeRobot account
  - Sign up tại https://uptimerobot.com (free tier: 50 monitors)
  - **Deliverable:** UptimeRobot account ready

- [ ] **Task 6.2.2:** Add monitors
  - Monitor 1: Frontend
    - URL: https://kadong-tools.com
    - Type: HTTP(s)
    - Interval: 5 minutes
  - Monitor 2: Backend
    - URL: https://api.kadong-tools.com/api/health
    - Type: HTTP(s)
    - Interval: 5 minutes
    - Keyword: "ok" (check response contains "ok")
  - **Deliverable:** Monitors active

- [ ] **Task 6.2.3:** Configure alerts
  - Alert contacts: Add email address
  - Alert when: Down (1 check)
  - **Deliverable:** Alerts configured

#### Milestone 6.3: Analytics (Vercel Analytics)
- [ ] **Task 6.3.1:** Enable Vercel Analytics
  - Vercel Dashboard → Analytics → Enable
  - Free tier: 2500 events/month
  - **Deliverable:** Analytics tracking pageviews

- [ ] **Task 6.3.2:** Add Google Analytics (optional)
  - Create GA4 property
  - Add tracking code to `index.html`
  - **Deliverable:** GA4 tracking (optional)

---

### Phase 7: Testing & Go-Live (1 day)

#### Milestone 7.1: Pre-Launch Testing
- [ ] **Task 7.1.1:** Smoke test production
  - Test all critical paths (checklist in Testing Strategy section)
  - Verify no console errors
  - Test on mobile (iOS + Android)
  - **Deliverable:** All smoke tests pass

- [ ] **Task 7.1.2:** Security audit
  - Check SSL: https://www.ssllabs.com/ssltest/
  - Check headers: https://securityheaders.com/
  - Check CORS: Use Postman to test from different origin
  - **Deliverable:** Security audit passes

- [ ] **Task 7.1.3:** Performance audit
  - Lighthouse audit: https://pagespeed.web.dev/
  - Target: Performance > 90, Best Practices > 90
  - **Deliverable:** Performance audit passes

#### Milestone 7.2: Launch
- [ ] **Task 7.2.1:** Final checklist
  - [ ] DNS propagated
  - [ ] SSL certificates valid
  - [ ] All monitors active
  - [ ] Error tracking working
  - [ ] Database backups enabled
  - [ ] All tests passing
  - **Deliverable:** Checklist complete

- [ ] **Task 7.2.2:** Go live!
  - Announce internally (team notification)
  - Share link với test users
  - Monitor metrics closely for first 24h
  - **Deliverable:** Website publicly accessible

- [ ] **Task 7.2.3:** Post-launch monitoring (24h)
  - Check UptimeRobot: uptime > 99%
  - Check Sentry: error rate < 1%
  - Check Vercel Analytics: page load time < 3s
  - Check Railway metrics: API response time < 500ms
  - **Deliverable:** 24h stability report

---

### Phase 8: Post-Launch Optimization (Ongoing)

#### Milestone 8.1: Performance Optimization
- [ ] **Task 8.1.1:** Analyze Lighthouse report
  - Identify performance bottlenecks
  - Fix low-hanging fruit (image optimization, code splitting)
  - **Deliverable:** Performance improvements implemented

- [ ] **Task 8.1.2:** Optimize database queries
  - Check slow queries: `SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;`
  - Add indexes for slow queries
  - **Deliverable:** Query performance improved

- [ ] **Task 8.1.3:** Enable caching
  - Frontend: Configure Vercel edge caching
  - Backend: Add Redis caching cho API responses (optional)
  - **Deliverable:** Caching strategy implemented

#### Milestone 8.2: Monitoring & Alerting
- [ ] **Task 8.2.1:** Review error trends
  - Weekly review Sentry errors
  - Fix top 3 errors
  - **Deliverable:** Error rate decreased

- [ ] **Task 8.2.2:** Review performance trends
  - Weekly review Vercel/Railway metrics
  - Identify degradation patterns
  - **Deliverable:** Performance stable

---

## 🚀 Rollout Plan

### Pre-Deployment Checklist

- [ ] All code reviewed và merged to `main` branch
- [ ] All tests passing (unit + integration + E2E)
- [ ] Database migrations tested on staging
- [ ] Environment variables documented
- [ ] Secrets rotated from defaults
- [ ] Deployment plan reviewed by team
- [ ] Rollback plan documented
- [ ] Stakeholders notified of deployment window

### Deployment Day Plan

#### Morning (9:00 AM - 12:00 PM)
1. **9:00 AM** - Deploy to staging
2. **9:30 AM** - Run smoke tests on staging
3. **10:00 AM** - Fix any issues found
4. **11:00 AM** - Final staging approval
5. **11:30 AM** - Go/no-go decision

#### Afternoon (1:00 PM - 5:00 PM)
1. **1:00 PM** - Deploy database migrations to production
2. **1:15 PM** - Deploy backend to Railway
3. **1:30 PM** - Verify backend health check
4. **2:00 PM** - Deploy frontend to Vercel
5. **2:15 PM** - Verify frontend loads
6. **2:30 PM** - Configure DNS (if not done)
7. **3:00 PM** - Wait for DNS propagation
8. **3:30 PM** - Smoke test production
9. **4:00 PM** - Monitor metrics
10. **5:00 PM** - Go-live announcement

### Post-Deployment Monitoring

**First 1 hour:**
- Monitor every 5 minutes
- Check UptimeRobot status
- Check Sentry for errors
- Check Railway logs
- Check Vercel Analytics

**First 24 hours:**
- Monitor every 1 hour
- Review error rates
- Review performance metrics
- Check database health
- Check user feedback

**First 7 days:**
- Daily monitoring
- Weekly metrics review
- Address any issues
- Gather user feedback

### Rollback Plan

**Scenario 1: Frontend issues**
1. Revert Vercel deployment:
   - Vercel Dashboard → Deployments → Previous deployment → Promote to Production
2. Clear CDN cache
3. Verify rollback successful

**Scenario 2: Backend issues**
1. Revert Railway deployment:
   - Railway Dashboard → Deployments → Previous deployment → Redeploy
2. Verify health check passes
3. Check logs for errors

**Scenario 3: Database issues**
1. Run down migration:
   ```bash
   npm run db:migrate:down
   ```
2. Restore from backup:
   ```bash
   pg_restore -d $DATABASE_URL backup.sql
   ```
3. Verify data integrity

**Scenario 4: Complete rollback**
1. Revert frontend (Vercel)
2. Revert backend (Railway)
3. Rollback database migration
4. Update DNS if needed (point to old servers)
5. Notify stakeholders

---

## 📚 Documentation

### Pre-Deployment Documentation
- [ ] Update README.md with production URLs
- [ ] Document deployment process (this spec)
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Document rollback procedures

### Post-Deployment Documentation
- [ ] Update CHANGELOG.md với deployment date
- [ ] Document production architecture (diagrams)
- [ ] Create monitoring dashboard guide
- [ ] Document incident response procedures
- [ ] Update user guide with production URLs

### Infrastructure Documentation
- [ ] Vercel project configuration
- [ ] Railway project configuration
- [ ] Supabase/Railway database setup
- [ ] Cloudflare DNS configuration
- [ ] Monitoring tools setup (Sentry, UptimeRobot)

---

## 🔗 Related Documentation

- **Implementation Plan:** `specs/plans/09_deployment_production.plan` (to be created)
- **Login Spec:** `specs/specs/08_login.spec`
- **Architecture Doc:** `docs/02-architecture/SYSTEM_ARCHITECTURE.md` (to be created)
- **Runbook:** `docs/05-operations/PRODUCTION_RUNBOOK.md` (to be created)
- **Monitoring Guide:** `docs/05-operations/MONITORING_GUIDE.md` (to be created)

---

## 📅 Timeline

**Estimated Duration:** 5 days  
**Start Date:** 2025-11-18 (after login feature complete)  
**Target Go-Live:** 2025-11-22

### Milestones

| Milestone | Target Date | Duration | Dependencies |
|-----------|-------------|----------|--------------|
| M1: Infrastructure Setup | Nov 18 | 1 day | None |
| M2: Backend Deployment | Nov 19 | 1 day | M1 complete |
| M3: Frontend Deployment | Nov 20 | 1 day | M2 complete |
| M4: Domain & DNS | Nov 20 | 0.5 day | M3 complete |
| M5: Security Config | Nov 21 | 0.5 day | M4 complete |
| M6: Monitoring Setup | Nov 21 | 0.5 day | M5 complete |
| M7: Testing & Go-Live | Nov 22 | 1 day | M6 complete |
| M8: Post-Launch | Nov 23+ | Ongoing | M7 complete |

---

## 👥 Stakeholders

**Author:** DevOps Engineer / Full-stack Developer  
**Approver:** Product Owner  
**Reviewers:** Backend Team, Frontend Team, Security Team  
**Notified:** All team members, test users

---

## 📊 Success Metrics

### Launch Metrics (First 7 days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Uptime | > 99.5% | UptimeRobot |
| Error rate | < 0.5% | Sentry |
| Page load time | < 3s | Vercel Analytics |
| API response time | < 500ms | Railway metrics |
| Failed deployments | 0 | Git logs |
| Critical bugs | 0 | Sentry + user reports |

### Business Metrics (First 30 days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| New user registrations | 50 | Database query |
| Daily active users | 20 | Google Analytics |
| Page views/day | 200 | Vercel Analytics |
| Average session duration | > 5 min | Google Analytics |
| Bounce rate | < 40% | Google Analytics |

### Cost Metrics (Monthly)

| Service | Free Tier Limit | Estimated Usage | Cost |
|---------|-----------------|-----------------|------|
| Vercel | 100GB bandwidth | 10GB | $0 |
| Railway | $5 credit | ~140 hours | $0 |
| Supabase | 500MB DB | 50MB | $0 |
| Sentry | 5K errors | 500 errors | $0 |
| UptimeRobot | 50 monitors | 2 monitors | $0 |
| Domain | N/A | 1 domain | $10/year |
| **Total** | - | - | **~$1/month** |

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-11-13 | 1.0.0 | Initial deployment spec created | AI Developer |

---

## ✅ Sign-off

- [ ] Spec reviewed by DevOps team
- [ ] Spec reviewed by security team
- [ ] Timeline approved by stakeholders
- [ ] Budget approved ($0-10/month)
- [ ] Rollback plan reviewed
- [ ] Monitoring strategy approved
- [ ] Ready to begin deployment

**Approved By:** (Pending)  
**Approval Date:** (Pending)

---

**Next Steps:**
1. Review this spec với team
2. Create implementation plan: `specs/plans/09_deployment_production.plan`
3. Setup platform accounts (Vercel, Railway, Supabase)
4. Begin Phase 1: Infrastructure Setup

---

**Maintained By:** DevOps Team  
**Review Cycle:** After each deployment  
**Next Review:** After first production deployment

---

**END OF DEPLOYMENT SPEC**
