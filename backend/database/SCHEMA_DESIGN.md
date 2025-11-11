# 🗄️ DATABASE SCHEMA - KaDong Tools

## 📊 ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (UUID) PK    │
│ email (unique)  │
│ password_hash   │
│ name            │
│ role            │
│ created_at      │
│ updated_at      │
│ deleted_at      │
└─────────────────┘
        │
        │ 1:N
        ├──────────────────────────────┐
        │                              │
        ▼                              ▼
┌─────────────────┐          ┌─────────────────────┐
│     NOTES       │          │  COUNTDOWN_EVENTS   │
├─────────────────┤          ├─────────────────────┤
│ id (UUID) PK    │          │ id (UUID) PK        │
│ user_id FK      │          │ user_id FK          │
│ title           │          │ title               │
│ content         │          │ event_date          │
│ color           │          │ recurring           │
│ pinned          │          │ timezone            │
│ created_at      │          │ color               │
│ updated_at      │          │ created_at          │
│ deleted_at      │          │ updated_at          │
└─────────────────┘          └─────────────────────┘
        │
        │ 0:N (nullable)
        ▼
┌─────────────────┐
│    FEEDBACK     │
├─────────────────┤
│ id (UUID) PK    │
│ user_id FK?     │
│ message         │
│ type            │
│ status          │
│ created_at      │
└─────────────────┘

┌─────────────────────┐
│       TOOLS         │
├─────────────────────┤
│ id (UUID) PK        │
│ key (unique)        │
│ name                │
│ description         │
│ config (JSONB)      │
│ is_active           │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│  CURRENCY_RATES     │
├─────────────────────┤
│ id (UUID) PK        │
│ base_currency       │
│ rates (JSONB)       │
│ fetched_at          │
│ is_current          │
└─────────────────────┘

┌─────────────────────┐
│     SESSIONS        │
├─────────────────────┤
│ id (UUID) PK        │
│ user_id FK          │
│ token_hash          │
│ expires_at          │
│ created_at          │
│ ip_address          │
│ user_agent          │
└─────────────────────┘

┌─────────────────────┐
│     MIGRATIONS      │
├─────────────────────┤
│ id (SERIAL) PK      │
│ name                │
│ executed_at         │
└─────────────────────┘
```

## 🎯 Relationships

1. **users → notes** (1:N, CASCADE DELETE)
2. **users → countdown_events** (1:N, CASCADE DELETE)
3. **users → feedback** (0:N, SET NULL)
4. **users → sessions** (1:N, CASCADE DELETE)

## 📝 Key Design Decisions

### ✅ UUID vs BIGSERIAL
- **Chọn UUID**: Tốt cho distributed systems, không đoán được, merge databases dễ dàng
- Performance: UUID có index tốt trong PostgreSQL 13+

### ✅ Soft Delete Pattern
- `deleted_at` cho users, notes, countdown_events
- Cho phép khôi phục data, audit trail tốt hơn
- Query cần thêm `WHERE deleted_at IS NULL`

### ✅ JSONB cho Dynamic Data
- `tools.config`: Lưu settings riêng cho mỗi tool
- `currency_rates.rates`: Lưu tất cả tỷ giá trong 1 object
- Index GIN cho JSONB queries nhanh

### ✅ Timestamps with Timezone
- Dùng `TIMESTAMP WITH TIME ZONE` cho đa quốc gia
- `created_at`, `updated_at` tự động

### ✅ Indexes Strategy
- Primary keys tự động có index
- Foreign keys cần index cho JOIN nhanh
- `email` UNIQUE index
- `user_id, created_at` composite index cho pagination
- GIN index cho JSONB

## 🔒 Security Considerations

1. **Password**: Luôn hash (bcrypt/argon2), không lưu plaintext
2. **Sessions**: Token hash, có expiry time
3. **Soft delete**: Sensitive data vẫn trong DB
4. **Role-based**: Chuẩn bị cho admin/user roles

## 📦 Storage Estimates

- **users**: ~1KB/row → 10K users = 10MB
- **notes**: ~2KB/row → 100K notes = 200MB
- **currency_rates**: ~5KB/row → 365 days = 2MB/year
- **Total**: < 500MB cho năm đầu (không có attachments)
