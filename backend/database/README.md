# 🗄️ KaDong Tools - Database Documentation

## 📚 Tài liệu đầy đủ

### 1. [SCHEMA_DESIGN.md](SCHEMA_DESIGN.md)
- ERD (Entity Relationship Diagram)
- Quan hệ giữa các bảng
- Key design decisions
- Storage estimates

### 2. [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Hướng dẫn cài đặt PostgreSQL
- Tạo database
- Chạy migrations
- Seed data
- Testing
- Troubleshooting

### 3. [BEST_PRACTICES.md](BEST_PRACTICES.md)
- Security best practices
- Soft delete pattern
- Indexing strategy
- Transaction guidelines
- Performance optimization
- Backup & recovery
- Production checklist

## 🚀 Quick Start

```bash
# 1. Cài đặt dependencies
cd backend
npm install

# 2. Cấu hình .env
cp .env.example .env
# Edit .env với database credentials

# 3. Chạy migrations + seed (one command)
npm run db:setup

# 4. Test connection
npm run db:test

# 5. Start server
npm start
```

## 📁 Cấu trúc Database Files

```
backend/database/
├── SCHEMA_DESIGN.md           # Thiết kế database ERD
├── SETUP_GUIDE.md             # Hướng dẫn setup chi tiết
├── BEST_PRACTICES.md          # Best practices & tips
├── README.md                  # File này
│
├── migrations/                # SQL migrations
│   ├── 001_up_initial_schema.sql    # Create tables
│   └── 001_down_rollback.sql        # Drop tables
│
├── seeds/                     # Test data
│   └── seed_data.sql          # Sample data for development
│
└── queries/                   # SQL examples
    └── example_queries.sql    # Common queries for controllers
```

## 🎯 Các lệnh Database

```bash
# Migration commands
npm run db:migrate:up          # Tạo tables
npm run db:migrate:down        # Xóa tables (rollback)
npm run db:migrate:status      # Kiểm tra status

# Seed data
npm run db:seed                # Load test data

# Testing
npm run db:test                # Test connection & diagnostics

# Setup (all-in-one)
npm run db:setup               # migrate:up + seed
```

## 📊 Database Schema Summary

### Core Tables:
- **users** - User accounts (admin/user roles)
- **notes** - Ghi chú với màu sắc
- **countdown_events** - Sự kiện đếm ngày
- **tools** - Cấu hình các công cụ
- **feedback** - User feedback
- **currency_rates** - Tỷ giá tiền tệ
- **sessions** - Authentication sessions

### Relationships:
```
users (1) ──→ (N) notes
users (1) ──→ (N) countdown_events
users (1) ──→ (N) feedback (nullable)
users (1) ──→ (N) sessions
```

## 🔧 Configuration Files

### backend/config/database.js
Connection pool configuration với pg driver

### backend/controllers/notesController_with_db.js
Example controller sử dụng PostgreSQL thay vì in-memory

## 📖 SQL Examples

Xem file `queries/example_queries.sql` cho:
- CRUD operations
- Pagination
- Soft deletes
- Transactions
- JSONB queries
- Full-text search

## 🐛 Troubleshooting

### Connection failed?
```bash
# Check PostgreSQL running
# Windows: services.msc
# Linux: sudo systemctl status postgresql

# Test với psql
psql -U postgres -d kadongsite
```

### Tables not found?
```bash
# Run migrations
npm run db:migrate:up

# Check status
npm run db:migrate:status
```

### Permission denied?
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE kadongsite TO your_user;
```

## 🎓 Learning Resources

- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [node-postgres (pg)](https://node-postgres.com/)
- [SQL Best Practices](https://www.postgresql.org/docs/current/tutorial.html)

## 💡 Pro Tips

1. **Luôn backup trước khi migrate down**
2. **Dùng transactions cho multi-step operations**
3. **Monitor slow queries với EXPLAIN ANALYZE**
4. **Index các columns thường query**
5. **Soft delete thay vì hard delete**

## 🆘 Need Help?

Liên hệ qua:
- Email: contact@kadong.com
- GitHub Issues
- Documentation trong các file .md

---

**Happy Coding! 🎉**
