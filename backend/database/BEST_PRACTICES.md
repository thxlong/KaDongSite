# 🎯 Best Practices & Recommendations

## 🔐 Security

### 1. **UUID vs BIGSERIAL**
✅ **Khuyến nghị: Dùng UUID**
- ✅ Không đoán được (security)
- ✅ Dễ merge databases từ nhiều nguồn
- ✅ Phân tán tốt cho sharding
- ⚠️ 16 bytes vs 8 bytes (BIGINT) - chấp nhận được
- ⚠️ Index performance tốt từ PostgreSQL 13+

```sql
-- ✅ Good
id UUID PRIMARY KEY DEFAULT uuid_generate_v4()

-- ❌ Avoid for public APIs
id BIGSERIAL PRIMARY KEY  -- Dễ enumerate: /api/users/1, /api/users/2...
```

### 2. **Password Hashing**
✅ **Sử dụng bcrypt hoặc argon2**

```javascript
import bcrypt from 'bcrypt'

// Hash password
const saltRounds = 10
const hash = await bcrypt.hash(password, saltRounds)

// Verify password
const isValid = await bcrypt.compare(password, hash)
```

### 3. **SQL Injection Prevention**
✅ **Luôn dùng parameterized queries**

```javascript
// ✅ Good - Safe from SQL injection
await query('SELECT * FROM users WHERE email = $1', [email])

// ❌ Bad - Vulnerable to SQL injection
await query(`SELECT * FROM users WHERE email = '${email}'`)
```

### 4. **Environment Variables**
✅ **Không commit sensitive data**

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key-here

# .gitignore
.env
.env.local
.env.production
```

---

## 💾 Soft Delete Pattern

### Tại sao dùng Soft Delete?
- ✅ Khôi phục dữ liệu dễ dàng
- ✅ Audit trail tốt hơn
- ✅ Comply với GDPR (xóa sau 90 ngày)
- ⚠️ Cần nhớ filter `deleted_at IS NULL` trong mọi query

### Implementation:

```sql
-- Thêm deleted_at column
deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL

-- Soft delete
UPDATE notes 
SET deleted_at = NOW() 
WHERE id = $1

-- List active only
SELECT * FROM notes 
WHERE deleted_at IS NULL

-- Restore
UPDATE notes 
SET deleted_at = NULL 
WHERE id = $1
```

### Cleanup Task (Cron Job):

```javascript
// Delete permanently after 90 days
const cleanupOldRecords = async () => {
  await query(`
    DELETE FROM notes 
    WHERE deleted_at < NOW() - INTERVAL '90 days'
  `)
}

// Run monthly
schedule.scheduleJob('0 0 1 * *', cleanupOldRecords)
```

---

## 📊 Indexing Strategy

### Indexes đã tạo:

```sql
-- Primary Keys (automatic index)
✅ users.id, notes.id, etc.

-- Foreign Keys (manual index)
✅ notes.user_id
✅ countdown_events.user_id
✅ feedback.user_id

-- Unique Constraints (automatic unique index)
✅ users.email
✅ tools.key

-- Composite Indexes (for pagination)
✅ notes(user_id, created_at DESC)
✅ countdown_events(user_id, event_date)

-- JSONB Indexes (GIN)
✅ tools.config
✅ currency_rates.rates
```

### Khi nào cần index?

```sql
-- ✅ Add index nếu query thường xuyên
SELECT * FROM notes WHERE user_id = $1  -- ✅ Có index
SELECT * FROM notes WHERE color = $1    -- ❌ Không có index (OK, ít dùng)

-- Check slow queries
EXPLAIN ANALYZE SELECT * FROM notes WHERE user_id = $1;
```

### Monitor Index Usage:

```sql
-- Check unused indexes
SELECT 
    schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 
    AND indexname NOT LIKE '%_pkey'
ORDER BY schemaname, tablename;
```

---

## 🔄 Transaction Best Practices

### Khi nào dùng Transaction?

✅ **Cần transaction:**
- Multi-step operations (create user + welcome note)
- Update multiple tables
- Financial operations
- Critical business logic

❌ **Không cần transaction:**
- Single INSERT/UPDATE/DELETE
- Read-only queries

### Example:

```javascript
import { transaction } from '../config/database.js'

// ✅ Good - Use transaction for multi-step
const createUserWithDefaults = async (email, password, name) => {
  return await transaction(async (client) => {
    // Step 1: Create user
    const userResult = await client.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [email, password, name]
    )
    const userId = userResult.rows[0].id

    // Step 2: Create welcome note
    await client.query(
      'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3)',
      [userId, 'Welcome!', 'Welcome to KaDong Tools!']
    )

    // Step 3: Create default event
    await client.query(
      'INSERT INTO countdown_events (user_id, title, event_date) VALUES ($1, $2, $3)',
      [userId, 'Join Date', new Date()]
    )

    return userId
  })
}
```

---

## 📈 Performance Optimization

### 1. **Connection Pooling**

```javascript
// ✅ Good - Use connection pool
const pool = new Pool({
  max: 20,                    // Max 20 connections
  idleTimeoutMillis: 30000,   // Close idle after 30s
  connectionTimeoutMillis: 2000
})

// ❌ Bad - Create new connection each time
const client = new Client()
await client.connect()  // Slow!
```

### 2. **Pagination**

```javascript
// ✅ Good - LIMIT/OFFSET
const limit = 10
const offset = (page - 1) * limit
await query(
  'SELECT * FROM notes WHERE user_id = $1 LIMIT $2 OFFSET $3',
  [userId, limit, offset]
)

// ✅ Better - Cursor-based (for large datasets)
await query(
  'SELECT * FROM notes WHERE user_id = $1 AND created_at < $2 ORDER BY created_at DESC LIMIT 10',
  [userId, lastCreatedAt]
)
```

### 3. **N+1 Query Problem**

```javascript
// ❌ Bad - N+1 queries
const notes = await query('SELECT * FROM notes')
for (const note of notes.rows) {
  const user = await query('SELECT * FROM users WHERE id = $1', [note.user_id])
}

// ✅ Good - Single query with JOIN
const result = await query(`
  SELECT n.*, u.name as user_name, u.email as user_email
  FROM notes n
  JOIN users u ON n.user_id = u.id
`)
```

### 4. **JSONB Queries**

```sql
-- Get specific key from JSONB
SELECT config->>'api_key' as api_key FROM tools WHERE key = 'currency';

-- Update JSONB (merge)
UPDATE tools 
SET config = config || '{"new_key": "value"}'::jsonb 
WHERE key = 'currency';

-- Query inside JSONB
SELECT * FROM tools WHERE config @> '{"enabled": true}';
```

---

## 🗄️ Backup & Recovery

### 1. **Daily Backup Script**

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/kadongsite"
DB_NAME="kadongsite"

# Create backup
pg_dump -U postgres $DB_NAME | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### 2. **Restore from Backup**

```bash
# Restore from backup
gunzip -c backup_20241111_120000.sql.gz | psql -U postgres kadongsite

# Or without gzip
psql -U postgres kadongsite < backup.sql
```

### 3. **Retention Policy**

- **currency_rates**: Giữ 2 năm (cron job cleanup)
- **deleted records**: Giữ 90 ngày (GDPR compliance)
- **sessions**: Auto cleanup expired

```sql
-- Cleanup old currency rates (keep last 2 years)
DELETE FROM currency_rates 
WHERE fetched_at < NOW() - INTERVAL '2 years' 
  AND is_current = FALSE;

-- Cleanup expired sessions
DELETE FROM sessions 
WHERE expires_at < NOW();
```

---

## 🚀 Production Readiness

### Checklist:

- [ ] **SSL/TLS** cho database connection
- [ ] **Connection pooling** cấu hình đúng
- [ ] **Indexes** cho queries thường dùng
- [ ] **Backup** script chạy hàng ngày
- [ ] **Monitoring** (pg_stat_statements)
- [ ] **Error logging** (Winston, Sentry)
- [ ] **Rate limiting** cho API
- [ ] **CORS** cấu hình đúng domains
- [ ] **Environment variables** không hardcode
- [ ] **Database migrations** tracked properly

### Production .env:

```bash
# Production Database (use SSL)
DATABASE_URL=postgresql://user:pass@production-host:5432/kadongsite?sslmode=require

# Production settings
NODE_ENV=production
JWT_SECRET=very-secure-random-string-min-32-chars
ALLOWED_ORIGINS=https://kadong.com,https://www.kadong.com
```

---

## 📚 Additional Reading

- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Database Design](https://www.postgresql.org/docs/current/ddl.html)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

## 🎓 Summary

### Do's ✅
- ✅ Use UUIDs for primary keys
- ✅ Implement soft deletes
- ✅ Use parameterized queries ($1, $2)
- ✅ Add indexes for frequently queried columns
- ✅ Use transactions for multi-step operations
- ✅ Hash passwords with bcrypt/argon2
- ✅ Daily backups
- ✅ Connection pooling
- ✅ Monitor slow queries

### Don'ts ❌
- ❌ Never store plaintext passwords
- ❌ Don't use string concatenation for SQL
- ❌ Don't forget WHERE deleted_at IS NULL
- ❌ Don't create indexes on every column
- ❌ Don't run migrations in production without testing
- ❌ Don't commit .env files
- ❌ Don't ignore N+1 query problems
