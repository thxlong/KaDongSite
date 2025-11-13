# Production Deployment Checklist

## Pre-Deployment (Phase 1-5)

### ✅ Infrastructure Setup
- [ ] Vercel account created and connected to GitHub
- [ ] Railway account created and connected to GitHub
- [ ] Supabase/Railway PostgreSQL database created
- [ ] Domain registered (or using free Vercel subdomain)
- [ ] Cloudflare account created (optional but recommended)

### ✅ Configuration Files Created
- [x] `frontend/vercel.json` - Security headers & routing
- [x] `backend/railway.json` - Railway deployment config
- [x] `frontend/.env.example` - Frontend environment variables template
- [x] `backend/.env.example` - Backend environment variables template

### ✅ Environment Variables Set

#### Backend (Railway)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:5432/db?sslmode=require
JWT_SECRET=<generated-with-openssl-rand-base64-32>
SESSION_SECRET=<generated-random-string>
ALLOWED_ORIGINS=https://kadong-tools.com,https://www.kadong-tools.com
COOKIE_SECURE=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

**Generate secrets:**
```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate SESSION_SECRET
openssl rand -base64 24
```

#### Frontend (Vercel)
```bash
VITE_API_BASE_URL=https://api.kadong-tools.com
VITE_APP_ENV=production
```

### ✅ Database Setup
- [ ] Production database created (Supabase or Railway)
- [ ] Migrations executed: `npm run db:migrate:up`
- [ ] Verify migrations: `npm run db:migrate:status`
- [ ] Admin user seeded: `node database/seeds/008_auth_seed_es6.js`
- [ ] Automatic backups enabled (daily)
- [ ] Database credentials stored securely

### ✅ Security Configuration
- [x] CORS configured for production domains only
- [x] Security headers added (vercel.json)
- [x] JWT_SECRET rotated from default
- [x] SESSION_SECRET rotated from default
- [ ] SSL/TLS enforced on database connection
- [ ] No secrets committed to Git (verify: `git grep -i "password\|secret"`)

### ✅ Code Quality
- [ ] All tests passing: `npm test`
- [ ] No console.log in production code
- [ ] No source maps in production bundle
- [ ] Bundle size < 1MB (frontend)
- [ ] ESLint warnings fixed
- [ ] Dependencies updated: `npm audit fix`

---

## Deployment (Phase 6-7)

### Backend Deployment (Railway)
1. **Create Railway Project**
   - Go to https://railway.app
   - New Project → Deploy from GitHub
   - Select repository: `KaDongSite`
   - Root directory: `backend`

2. **Configure Environment Variables**
   - Railway Dashboard → Variables
   - Copy all production env vars from above
   - Verify DATABASE_URL from Railway PostgreSQL service

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 min)
   - Check logs for errors

4. **Verify Deployment**
   ```bash
   # Test health check
   curl https://<app-name>.up.railway.app/api/health
   
   # Should return:
   # {"status":"ok","message":"KaDong Tools API is running",...}
   ```

5. **Configure Custom Domain**
   - Railway Settings → Domains → Add Domain
   - Enter: `api.kadong-tools.com`
   - Copy CNAME record for DNS configuration

### Frontend Deployment (Vercel)
1. **Create Vercel Project**
   - Go to https://vercel.com
   - New Project → Import Git Repository
   - Select repository: `KaDongSite`
   - Root directory: `frontend`
   - Framework preset: Vite

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

3. **Configure Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Add production env vars from above

4. **Deploy**
   - Click "Deploy"
   - Wait for build (~1-2 min)
   - Check deployment logs

5. **Verify Deployment**
   ```bash
   # Visit Vercel preview URL
   https://kadong-tools.vercel.app
   
   # Check browser console - no errors
   # Test API connection - login should work
   ```

6. **Configure Custom Domain**
   - Vercel Settings → Domains → Add Domain
   - Enter: `kadong-tools.com`
   - Add: `www.kadong-tools.com`
   - Copy DNS records

### DNS Configuration (Cloudflare)
1. **Add Domain to Cloudflare**
   - Add site: `kadong-tools.com`
   - Update nameservers at domain registrar
   - Wait for propagation (~1 hour)

2. **Configure DNS Records**
   ```
   Type    Name    Value                               TTL     Proxy
   CNAME   @       cname.vercel-dns.com               Auto    Yes
   CNAME   www     kadong-tools.com                   Auto    Yes
   CNAME   api     <railway-app>.up.railway.app       Auto    Yes
   ```

3. **Configure SSL/TLS**
   - SSL/TLS mode: Full (Strict)
   - Always Use HTTPS: ON
   - Minimum TLS Version: 1.2
   - TLS 1.3: ON
   - HSTS: Enabled (max-age=31536000)

4. **Verify DNS Propagation**
   ```bash
   nslookup kadong-tools.com
   nslookup api.kadong-tools.com
   ```

---

## Post-Deployment (Phase 8)

### Monitoring Setup

#### 1. Sentry (Error Tracking)
- [ ] Create account: https://sentry.io
- [ ] Create project: "KaDong Frontend"
- [ ] Create project: "KaDong Backend"
- [ ] Install SDK and configure (see spec for details)
- [ ] Add SENTRY_DSN to env vars
- [ ] Verify errors are tracked

#### 2. UptimeRobot (Uptime Monitoring)
- [ ] Create account: https://uptimerobot.com
- [ ] Add monitor: `https://kadong-tools.com` (HTTP, 5min interval)
- [ ] Add monitor: `https://api.kadong-tools.com/api/health` (HTTP, 5min interval, keyword: "ok")
- [ ] Configure email alerts
- [ ] Verify monitors are active

#### 3. Vercel Analytics
- [ ] Enable Vercel Analytics in dashboard
- [ ] Verify pageviews are tracked
- [ ] Set up weekly reports (optional)

### Testing

#### Smoke Tests (Production)
```bash
# 1. Test frontend loads
curl -I https://kadong-tools.com
# Should return: 200 OK

# 2. Test API health check
curl https://api.kadong-tools.com/api/health
# Should return: {"status":"ok",...}

# 3. Test CORS
# Open browser console at https://kadong-tools.com
fetch('https://api.kadong-tools.com/api/health')
  .then(r => r.json())
  .then(console.log)
# Should work without CORS errors

# 4. Test authentication flow
# - Register new account
# - Login with credentials
# - Access protected route (e.g., /notes)
# - Logout
# All should work correctly

# 5. Test on mobile
# - iOS Safari
# - Android Chrome
# Website should be fully responsive
```

#### Security Tests
```bash
# 1. SSL Test
# Visit: https://www.ssllabs.com/ssltest/
# Enter: kadong-tools.com
# Target: A+ rating

# 2. Security Headers Test
# Visit: https://securityheaders.com/
# Enter: https://kadong-tools.com
# Target: A rating

# 3. Test rate limiting
# Send 10 rapid requests to login endpoint
# 6th request should return 429 Too Many Requests
```

#### Performance Tests
```bash
# 1. Lighthouse Audit
# Visit: https://pagespeed.web.dev/
# Enter: https://kadong-tools.com
# Target: Performance > 90, Best Practices > 90

# 2. Test API response time
curl -w "Total time: %{time_total}s\n" -o /dev/null -s https://api.kadong-tools.com/api/health
# Target: < 500ms
```

### Monitoring (First 24 Hours)
- [ ] Check UptimeRobot: uptime > 99%
- [ ] Check Sentry: error rate < 1%
- [ ] Check Vercel Analytics: page load time < 3s
- [ ] Check Railway metrics: API response time < 500ms
- [ ] Check database connections: < 10 concurrent
- [ ] Review logs for errors
- [ ] Gather user feedback

---

## Rollback Procedures

### If Frontend Issues Occur
```bash
# 1. Revert deployment in Vercel
# Vercel Dashboard → Deployments → Previous → Promote to Production

# 2. Verify rollback
curl -I https://kadong-tools.com
```

### If Backend Issues Occur
```bash
# 1. Revert deployment in Railway
# Railway Dashboard → Deployments → Previous → Redeploy

# 2. Verify rollback
curl https://api.kadong-tools.com/api/health
```

### If Database Issues Occur
```bash
# 1. Rollback migration
npm run db:migrate:down

# 2. Restore from backup (if needed)
pg_restore -d $DATABASE_URL backup.sql

# 3. Verify data integrity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## Production Verification Script

Before deploying, run the verification script:

```bash
cd backend
node scripts/verify-production.js
```

This checks:
- ✅ Environment variables configured correctly
- ✅ Required files exist
- ✅ package.json has start script
- ✅ Dependencies installed
- ✅ Migrations ready
- ✅ Security settings correct
- ✅ No secrets in Git

---

## Success Metrics

Monitor these metrics for first 7 days:

| Metric | Target | How to Check |
|--------|--------|--------------|
| Uptime | > 99.5% | UptimeRobot dashboard |
| Error rate | < 0.5% | Sentry dashboard |
| Page load time | < 3s | Vercel Analytics |
| API response time | < 500ms | Railway metrics |
| Failed deployments | 0 | Git commit history |
| Critical bugs | 0 | Sentry + user reports |

---

## Support & Troubleshooting

### Common Issues

**Issue: CORS errors in browser console**
```
Solution: Verify ALLOWED_ORIGINS includes production domain
Railway env var: ALLOWED_ORIGINS=https://kadong-tools.com
```

**Issue: Database connection failed**
```
Solution: Check DATABASE_URL has sslmode=require
Example: postgresql://user:pass@host:5432/db?sslmode=require
```

**Issue: 502 Bad Gateway**
```
Solution: Check Railway logs for errors
Railway Dashboard → Logs → View recent errors
```

**Issue: Vercel build failed**
```
Solution: Check build logs
Vercel Dashboard → Deployments → View logs
Common fix: npm install before npm run build
```

---

## Contact & Escalation

- **Technical Issues:** Check Railway/Vercel logs first
- **Security Issues:** Immediately rollback and investigate
- **Database Issues:** Check Supabase dashboard, restore from backup if needed
- **Monitoring Alerts:** Respond within 1 hour for critical issues

---

**Last Updated:** 2025-11-13  
**Maintained By:** DevOps Team  
**Review Before:** Every production deployment
