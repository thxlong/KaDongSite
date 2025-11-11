# 🔧 11. Maintenance Guide - Hướng dẫn Bảo trì

## 11.1 Routine Maintenance Tasks

### Daily Tasks

#### 1. Monitor Application Health

**Check health endpoints**:
```bash
# Backend health check
curl https://api.kadong-tools.com/health

# Expected response:
# {"status":"ok","timestamp":"2024-11-11T..."}
```

**Monitor logs**:
```bash
# Railway/Heroku logs
railway logs
# or
heroku logs --tail

# Look for errors or warnings
```

#### 2. Monitor Database Connections

```sql
-- Check active connections
SELECT COUNT(*) as active_connections
FROM pg_stat_activity
WHERE state = 'active';

-- Should be < 20 (max pool size)
```

---

### Weekly Tasks

#### 1. Database Backup

**Manual backup**:
```bash
# Backup PostgreSQL database
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Or use Supabase/Railway automatic backups
```

**Automated backup script**:
```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
BACKUP_FILE="$BACKUP_DIR/kadong_backup_$DATE.sql"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Dump database
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

**Schedule with cron (Linux)**:
```bash
# Edit crontab
crontab -e

# Add weekly backup (every Sunday at 2 AM)
0 2 * * 0 /path/to/scripts/backup.sh
```

**Schedule with Windows Task Scheduler**:
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Weekly, Sunday 2:00 AM
4. Action: Start Program → `bash backup.sh`

---

#### 2. Check Disk Space

**Database size**:
```sql
SELECT 
    pg_size_pretty(pg_database_size('kadong_tools')) as database_size;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Server disk space** (Railway/Heroku):
- Check dashboard metrics
- Set up alerts for >80% usage

---

#### 3. Review Error Logs

```bash
# Backend errors (if using Winston logger)
tail -n 100 backend/error.log

# Look for patterns:
# - Repeated errors
# - Database connection issues
# - Authentication failures
```

---

### Monthly Tasks

#### 1. Database Maintenance

**VACUUM and ANALYZE**:
```sql
-- Reclaim space and update statistics
VACUUM ANALYZE;

-- For specific table
VACUUM ANALYZE notes;

-- Aggressive vacuum (if needed)
VACUUM FULL;
```

**Reindex**:
```sql
-- Rebuild indexes for better performance
REINDEX DATABASE kadong_tools;

-- Or specific table
REINDEX TABLE notes;
```

**Check bloat**:
```sql
-- Check table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_dead_tup as dead_tuples
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- If dead_tuples > 1000, run VACUUM
```

---

#### 2. Update Dependencies

**Check outdated packages**:
```bash
# Backend
cd backend
npm outdated

# Frontend
cd frontend
npm outdated
```

**Update packages safely**:
```bash
# Update minor and patch versions only
npm update

# Or update specific package
npm update express

# Test after update
npm test
npm run dev
```

**Update major versions carefully**:
```bash
# Check breaking changes first
npm info express versions

# Update with caution
npm install express@latest

# Test thoroughly before deploying
```

---

#### 3. Security Updates

**Check vulnerabilities**:
```bash
# Audit dependencies
npm audit

# Fix automatically (if possible)
npm audit fix

# For high-severity issues, update manually
```

**Update Node.js version**:
```bash
# Check current version
node --version

# Update to latest LTS
nvm install --lts
nvm use --lts

# Update package.json engine requirement
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

#### 4. Performance Review

**Database query performance**:
```sql
-- Slow queries (PostgreSQL)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- If extension not installed:
CREATE EXTENSION pg_stat_statements;
```

**API response times**:
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://api.kadong-tools.com/api/notes

# curl-format.txt:
#   time_total: %{time_total}s
```

**Frontend bundle size**:
```bash
cd frontend
npm run build

# Check dist/ folder size
du -sh dist/

# Analyze bundle (optional)
npm install --save-dev rollup-plugin-visualizer
```

---

### Quarterly Tasks

#### 1. SSL Certificate Renewal

**Automatic renewal** (Let's Encrypt):
```bash
# Test renewal
sudo certbot renew --dry-run

# Renewal happens automatically, but verify
sudo certbot certificates
```

**Railway/Vercel/Netlify**: Auto-renewed, no action needed

---

#### 2. Backup Restoration Test

**Test backup restoration**:
```bash
# 1. Create test database
createdb kadong_tools_test

# 2. Restore from backup
psql kadong_tools_test < backup_20241111.sql

# 3. Verify data
psql kadong_tools_test
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM notes;

# 4. Drop test database
dropdb kadong_tools_test
```

---

#### 3. Archive Old Data

**Archive old sessions**:
```sql
-- Delete expired sessions (older than 30 days)
DELETE FROM sessions
WHERE expires_at < NOW() - INTERVAL '30 days';
```

**Archive soft-deleted records**:
```sql
-- Move to archive table (create if needed)
CREATE TABLE notes_archive AS
SELECT * FROM notes WHERE deleted_at < NOW() - INTERVAL '90 days';

-- Delete from main table
DELETE FROM notes WHERE deleted_at < NOW() - INTERVAL '90 days';
```

---

#### 4. Review and Update Documentation

- [ ] Check all Wiki pages for accuracy
- [ ] Update API documentation if endpoints changed
- [ ] Update Changelog with new releases
- [ ] Update README with new features
- [ ] Review and update Troubleshooting guide

---

## 11.2 Monitoring Setup

### Application Monitoring

**Using Railway/Heroku**:
- ✅ Built-in metrics (CPU, memory, response times)
- ✅ Log aggregation
- ✅ Automatic restarts on crash

**External monitoring tools**:

**1. UptimeRobot** (Free):
```
Setup:
1. Sign up at uptimerobot.com
2. Add Monitor → HTTP(s)
3. URL: https://api.kadong-tools.com/health
4. Interval: 5 minutes
5. Alert contacts: your-email@example.com
```

**2. Sentry** (Error tracking):
```bash
npm install @sentry/node @sentry/react
```

```javascript
// Backend: app.js
const Sentry = require('@sentry/node')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
})

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
```

**3. LogRocket** (Session replay):
```bash
npm install logrocket
```

```javascript
// Frontend: main.jsx
import LogRocket from 'logrocket'

if (import.meta.env.PROD) {
  LogRocket.init('your-app-id')
}
```

---

### Database Monitoring

**Key metrics to monitor**:

```sql
-- 1. Connection count
SELECT COUNT(*) FROM pg_stat_activity;

-- 2. Database size growth
SELECT 
    pg_size_pretty(pg_database_size('kadong_tools')) as size,
    NOW() as timestamp;

-- 3. Longest running queries
SELECT 
    pid,
    now() - query_start as duration,
    query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC
LIMIT 5;

-- 4. Cache hit ratio (should be >95%)
SELECT 
    sum(heap_blks_read) as heap_read,
    sum(heap_blks_hit) as heap_hit,
    sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

**Automated monitoring script**:
```javascript
// scripts/monitor-db.js
import { query } from '../config/database.js'

const checkDatabaseHealth = async () => {
  try {
    // Check connections
    const { rows: [{ count }] } = await query(
      'SELECT COUNT(*) FROM pg_stat_activity'
    )
    console.log(`Active connections: ${count}`)
    
    // Check size
    const { rows: [{ size }] } = await query(
      `SELECT pg_size_pretty(pg_database_size('kadong_tools')) as size`
    )
    console.log(`Database size: ${size}`)
    
    // Alert if connections > 18 (90% of max 20)
    if (count > 18) {
      console.warn('⚠️ WARNING: High connection count!')
      // Send alert email/Slack notification
    }
  } catch (error) {
    console.error('❌ Database health check failed:', error)
  }
}

// Run every 5 minutes
setInterval(checkDatabaseHealth, 5 * 60 * 1000)
```

---

## 11.3 Backup Strategy

### Automated Backup Schedule

| Frequency | Retention | Storage |
|-----------|-----------|---------|
| **Daily** | 7 days | Local server |
| **Weekly** | 4 weeks | Cloud storage (S3/Drive) |
| **Monthly** | 12 months | Cloud storage (S3/Drive) |

### Backup Script

```bash
#!/bin/bash
# scripts/backup-schedule.sh

DATE=$(date +%Y%m%d)
DAY=$(date +%A)
BACKUP_DIR="backups"

# Daily backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/daily_$DATE.sql"
gzip "$BACKUP_DIR/daily_$DATE.sql"

# Weekly backup (Sunday)
if [ "$DAY" = "Sunday" ]; then
    cp "$BACKUP_DIR/daily_$DATE.sql.gz" "$BACKUP_DIR/weekly_$DATE.sql.gz"
    # Upload to cloud
    aws s3 cp "$BACKUP_DIR/weekly_$DATE.sql.gz" s3://kadong-backups/weekly/
fi

# Monthly backup (1st of month)
if [ $(date +%d) -eq 01 ]; then
    cp "$BACKUP_DIR/daily_$DATE.sql.gz" "$BACKUP_DIR/monthly_$DATE.sql.gz"
    # Upload to cloud
    aws s3 cp "$BACKUP_DIR/monthly_$DATE.sql.gz" s3://kadong-backups/monthly/
fi

# Delete old daily backups (>7 days)
find "$BACKUP_DIR" -name "daily_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

---

### Backup Restoration

**Full restoration**:
```bash
# 1. Stop application
# Railway: Pause deployment
# Heroku: heroku maintenance:on

# 2. Drop and recreate database
dropdb kadong_tools
createdb kadong_tools

# 3. Restore from backup
gunzip -c backup_20241111.sql.gz | psql kadong_tools

# 4. Verify data integrity
psql kadong_tools
\dt
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM notes;

# 5. Restart application
# Railway: Resume deployment
# Heroku: heroku maintenance:off
```

**Partial restoration** (single table):
```bash
# Extract single table from backup
pg_restore -t notes backup_20241111.dump > notes_backup.sql

# Restore only that table
psql kadong_tools < notes_backup.sql
```

---

## 11.4 Scaling Considerations

### When to Scale

**Database**:
- Queries taking >1 second
- Connection pool maxing out
- CPU usage >80% consistently

**Backend**:
- Response times >500ms
- Memory usage >80%
- High CPU usage

**Frontend**:
- Bundle size >1MB
- Slow page loads (>3s)

### Scaling Strategies

**Database Scaling**:
```sql
-- 1. Add indexes
CREATE INDEX CONCURRENTLY idx_notes_search 
ON notes USING gin(to_tsvector('english', title || ' ' || content));

-- 2. Partition large tables
CREATE TABLE notes_2024 PARTITION OF notes
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- 3. Upgrade instance
# Supabase: Upgrade plan
# Railway: Increase resources
```

**Backend Scaling**:
```bash
# 1. Add more server instances (horizontal scaling)
# Railway: Scale replicas
# Heroku: heroku ps:scale web=2

# 2. Optimize queries
# Use database indexes
# Cache frequent queries

# 3. Add Redis for caching
npm install redis
```

**Frontend Scaling**:
```javascript
// 1. Code splitting
const NotesTool = lazy(() => import('./pages/NotesTool'))

// 2. CDN for static assets
# Vercel: Automatic CDN
# Netlify: Automatic CDN

// 3. Image optimization
# Use WebP format
# Lazy loading
<img loading="lazy" />
```

---

## 11.5 Security Maintenance

### Regular Security Checks

**1. Update dependencies monthly**:
```bash
npm audit
npm audit fix
```

**2. Review user access**:
```sql
-- Check inactive users (>90 days)
SELECT id, email, username, created_at
FROM users
WHERE deleted_at IS NULL
  AND id NOT IN (
    SELECT DISTINCT user_id FROM sessions
    WHERE created_at > NOW() - INTERVAL '90 days'
  );
```

**3. Rotate secrets annually**:
```bash
# Generate new secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update .env
SESSION_SECRET=new_secret_here
JWT_SECRET=new_jwt_secret_here

# Redeploy application
git push
```

**4. Review API rate limits**:
```javascript
// Adjust rate limits if needed
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100  // Increase if legitimate traffic is blocked
})
```

---

## 11.6 Wiki Maintenance

### Updating Documentation

**When to update Wiki**:
- ✅ After adding new features
- ✅ After fixing major bugs
- ✅ After changing API endpoints
- ✅ After updating dependencies
- ✅ After deployment changes

**Wiki Update Checklist**:
- [ ] Update relevant Wiki pages
- [ ] Update Changelog (10_Changelog.md)
- [ ] Update API Documentation (05_API_Documentation.md)
- [ ] Add new issues to Troubleshooting (09_Troubleshooting.md)
- [ ] Update version numbers
- [ ] Add screenshots if UI changed

**Example workflow**:
```bash
# 1. Make changes to code
# 2. Test changes
# 3. Update Wiki
cd docs/wiki

# Edit relevant files
# Example: Added dark mode feature

# Update multiple files
# - 01_Introduction.md (add to features list)
# - 06_FrontendOverview.md (add dark mode section)
# - 10_Changelog.md (add to [Unreleased])

# 4. Commit changes
git add .
git commit -m "docs: add dark mode documentation"
git push
```

---

## 11.7 Maintenance Checklist

### Daily
- [ ] Check application health endpoints
- [ ] Monitor error logs
- [ ] Check database connections

### Weekly
- [ ] Database backup
- [ ] Check disk space
- [ ] Review error logs for patterns

### Monthly
- [ ] Database maintenance (VACUUM, ANALYZE)
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance review

### Quarterly
- [ ] SSL certificate check
- [ ] Backup restoration test
- [ ] Archive old data
- [ ] Documentation review

### Annually
- [ ] Rotate secrets
- [ ] Major version upgrades
- [ ] Infrastructure review
- [ ] Disaster recovery drill

---

## 11.8 Emergency Procedures

### Application Down

**1. Check health endpoint**:
```bash
curl https://api.kadong-tools.com/health
```

**2. Check logs**:
```bash
railway logs  # or heroku logs
```

**3. Restart application**:
```bash
railway restart  # or heroku restart
```

**4. If database issue, check connections**:
```sql
SELECT * FROM pg_stat_activity;
```

---

### Database Corruption

**1. Stop application**:
```bash
railway pause
```

**2. Assess damage**:
```sql
-- Check integrity
SELECT * FROM pg_database WHERE datname = 'kadong_tools';
```

**3. Restore from backup**:
```bash
# See "Backup Restoration" section above
```

**4. Verify restoration**:
```sql
-- Run checks
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM notes;
```

**5. Restart application**:
```bash
railway resume
```

---

### Data Loss

**1. Check soft-deleted records**:
```sql
-- Recover soft-deleted notes
SELECT * FROM notes WHERE deleted_at IS NOT NULL;

-- Restore if needed
UPDATE notes SET deleted_at = NULL WHERE id = 'uuid';
```

**2. Restore from backup if necessary**

**3. Document incident**:
- What happened
- What was lost
- How it was recovered
- Prevention measures

---

## 📎 Related Links

- **[Setup Guide](03_SetupAndInstallation.md)** - Initial setup
- **[Database Schema](04_DatabaseSchema.md)** - Database structure
- **[Deployment Guide](07_DeploymentGuide.md)** - Deployment procedures
- **[Troubleshooting](09_Troubleshooting.md)** - Common issues

---

## 📞 Support Contacts

**For urgent issues**:
- **Email**: support@kadong-tools.com
- **GitHub Issues**: [github.com/username/KaDongSite/issues](https://github.com/username/KaDongSite/issues)

**Service Status Pages**:
- **Railway**: [railway.app/status](https://railway.app/status)
- **Vercel**: [vercel-status.com](https://www.vercel-status.com)
- **Supabase**: [status.supabase.com](https://status.supabase.com)

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
