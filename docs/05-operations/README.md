# 🚀 Operations

**Purpose:** Deployment, maintenance, and monitoring guides

---

## 📚 Documents in This Section

### [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
Production deployment instructions
- Vercel (Frontend)
- Railway (Backend)
- Supabase (Database)
- Environment variables setup
- CI/CD with GitHub Actions
- SSL/HTTPS configuration
- Domain setup

### [MAINTENANCE.md](MAINTENANCE.md)
Ongoing maintenance tasks
- Daily: Health checks, log reviews
- Weekly: Database backups, error logs
- Monthly: Dependency updates, VACUUM ANALYZE
- Quarterly: Security audits, backup restoration tests
- Database optimization
- Performance monitoring

---

## 🎯 Production Stack

### Frontend (Vercel)
- URL: https://kadong-tools.vercel.app
- Auto-deploy from `main` branch
- Environment: Production
- CDN: Enabled
- SSL: Auto-managed

### Backend (Railway)
- URL: https://api.kadong-tools.com
- PostgreSQL database included
- Auto-deploy from `main` branch
- Health check: /health endpoint
- Logs: Centralized in Railway dashboard

### Database (Supabase/Railway)
- PostgreSQL 13+
- Daily automated backups
- Connection pooling: 20 connections
- SSL: Required in production

---

## 🔧 Common Operations

### Deploy New Version
```bash
# Frontend
git push origin main  # Auto-deploys to Vercel

# Backend
git push origin main  # Auto-deploys to Railway
```

### Database Migrations
```bash
cd backend
npm run db:migrate:up    # Run new migrations
npm run db:migrate:status  # Check status
```

### Rollback
```bash
npm run db:migrate:down  # Rollback last migration
git revert <commit>      # Revert code changes
```

### Monitor Logs
- Vercel: Dashboard → Logs
- Railway: Dashboard → Deployments → Logs
- Backend: `backend/logs/combined.log`

---

## 🔗 Related Sections

- **Getting Started:** [../01-getting-started/](../01-getting-started/) - Local setup
- **Architecture:** [../02-architecture/](../02-architecture/) - Understand structure
- **Migration:** [../06-migration/](../06-migration/) - Database changes

---

**Last Updated:** 2025-11-13
