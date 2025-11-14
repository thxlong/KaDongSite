# 🔧 Hướng dẫn Fetch Giá Vàng Thực

## 📋 Tổng quan

Hệ thống tự động fetch giá vàng thực từ VNAppMob API và tính toán giá vàng trang sức dựa trên độ tinh khiết.

## 🏗️ Kiến trúc

### Providers
- **realProvider.js**: Fetch từ VNAppMob API (SJC, DOJI, PNJ 24K)
- **mockProvider.js**: Mock data cho testing (DISABLED)

### Data Sources
1. **VNAppMob API** (Primary)
   - Endpoint: `https://api.vnappmob.com/api/v2/gold`
   - Free tier: 1000 requests/day
   - Cập nhật: Mỗi 6 tiếng
   - Data: SJC_9999, SJC_24K, DOJI_24K, PNJ_24K

2. **Calculated Prices** (Secondary)
   - Dựa trên SJC_9999 (base price)
   - Tính theo độ tinh khiết:
     - PNJ_18K = 75% x SJC_9999 / 10 chỉ
     - GOLD_14K = 58.5% x SJC_9999 / 10 chỉ
     - GOLD_10K = 41.7% x SJC_9999 / 10 chỉ

3. **Manual Override** (Fallback)
   - Từ file .env khi API không khả dụng
   - Dùng cho XAU_USD và backup data

## 🚀 Cách sử dụng

### 1. Fetch giá lần đầu (Manual)

```bash
cd backend

# Bước 1: Xóa data mock cũ
npm run gold:clear-mock

# Bước 2: Fetch giá thực từ VNAppMob API
npm run gold:fetch

# Bước 3: Thêm giá vàng trang sức (10K, 14K, 18K)
npm run gold:fetch:jewelry
```

### 2. Auto-update (Cron Job)

```bash
# Chạy cron job (cập nhật mỗi 5 phút)
npm run gold:cron

# Hoặc dùng PM2 (production)
pm2 start ecosystem.config.js
pm2 logs gold-price-cron
```

### 3. Check giá hiện tại

```bash
# API endpoint
curl http://localhost:5000/api/gold/latest

# PowerShell
Invoke-RestMethod http://localhost:5000/api/gold/latest
```

## 📁 Files quan trọng

### Scripts
- `clear-mock-data.js` - Xóa data mock cũ
- `fetch-real-gold.js` - Fetch giá thực từ API
- `add-jewelry-gold.js` - Thêm giá vàng trang sức
- `gold-cron.js` - Cron job tự động update

### Providers
- `providers/realProvider.js` - VNAppMob API integration
- `providers/mockProvider.js` - Mock data (disabled)
- `providers/index.js` - Provider registry

### Controllers/Routes
- `controllers/goldController.js` - API logic
- `routes/gold.js` - API routes

## 🔑 Environment Variables

Thêm vào `.env` file:

```env
# VNAppMob Gold API Key (optional - có default key)
VNAPPMOB_GOLD_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Manual override prices (fallback when API fails)
MANUAL_SJC_9999_BUY=151200000
MANUAL_SJC_9999_SELL=153200000
MANUAL_SJC_24K_BUY=147200000
MANUAL_SJC_24K_SELL=150200000
MANUAL_DOJI_24K_BUY=150000000
MANUAL_DOJI_24K_SELL=152000000
MANUAL_XAU_USD=2650.50
```

## 📊 API Endpoints

### GET /api/gold/latest
Lấy giá vàng mới nhất

**Query params:**
- `types` - Filter theo loại vàng (optional)
- `sources` - Filter theo nguồn (optional)
- `limit` - Số records per type (default: 1)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "SJC_9999",
      "source": "real",
      "buy_price": "151200000.00",
      "sell_price": "153200000.00",
      "currency": "VND",
      "fetched_at": "2025-11-14T07:00:05.000Z",
      "meta": {
        "unit": "1 lượng (37.5g)",
        "provider": "VNAppMob API"
      }
    }
  ],
  "count": 8
}
```

### GET /api/gold/history
Lấy lịch sử giá vàng

**Query params:**
- `type` - Loại vàng (required)
- `period` - day|week|month|year (default: day)
- `from`, `to` - Date range (optional)
- `limit` - Max records (default: 1000)

### POST /api/gold/fetch
Trigger manual fetch (admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "fetched": 5,
    "saved": 8,
    "errors": 0
  }
}
```

### GET /api/gold/sources
Danh sách providers và stats

## 🎯 Độ tinh khiết vàng

| Loại | Độ tinh khiết | Đơn vị | Tính toán |
|------|---------------|--------|-----------|
| SJC_9999 | 99.99% (24K) | 1 lượng (37.5g) | API |
| SJC_24K | 99.9% (24K) | 1 lượng | API |
| DOJI_24K | 99.9% (24K) | 1 lượng | API |
| PNJ_24K | 99.9% (24K) | 1 chỉ (3.75g) | API |
| PNJ_18K | 75% (18K) | 1 chỉ | Calculated |
| GOLD_14K | 58.5% (14K) | 1 chỉ | Calculated |
| GOLD_10K | 41.7% (10K) | 1 chỉ | Calculated |
| XAU_USD | International | 1 troy oz (31.1g) | Manual/.env |

## 🐛 Troubleshooting

### Lỗi: "No gold prices fetched"
**Nguyên nhân**: API không khả dụng
**Giải pháp**: 
1. Check internet connection
2. Verify API key còn hợp lệ
3. Sử dụng manual override trong .env

### Lỗi: "Failed to save rate"
**Nguyên nhân**: Database connection issue
**Giải pháp**:
```bash
# Check database
psql -U postgres -d kadongsite -c "SELECT COUNT(*) FROM gold_rates;"

# Run migrations
npm run db:migrate:up
```

### Giá vàng không update
**Nguyên nhân**: Cron job không chạy
**Giải pháp**:
```bash
# Check PM2 status
pm2 list
pm2 logs gold-price-cron

# Restart cron job
pm2 restart gold-price-cron
```

## 📈 Performance

### Metrics
- API fetch time: ~2-5 giây
- Database save: ~100-200ms per record
- Total update cycle: ~5-10 giây

### Optimization
- Cache API response 5 phút
- Batch insert jewelry prices
- Use database indexes on `type`, `fetched_at`

## 🔐 Security

### Rate Limiting
- Public endpoints: 100 req/15min
- POST /fetch endpoint: Authentication required (production)

### Data Validation
- Price range validation (prevent extreme values)
- Currency validation (VND, USD only)
- Type whitelist validation

## 📝 Database Schema

```sql
CREATE TABLE gold_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    buy_price DECIMAL(15, 2),
    sell_price DECIMAL(15, 2),
    mid_price DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'VND',
    fetched_at TIMESTAMPTZ NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gold_rates_type ON gold_rates(type);
CREATE INDEX idx_gold_rates_fetched_at ON gold_rates(fetched_at DESC);
```

## 🚀 Deployment

### Railway/Render
1. Set environment variables
2. Deploy backend với PM2
3. Cron job tự động start

```bash
# Start all services
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit
```

## 📚 References

- [VNAppMob Gold API Docs](https://api.vnappmob.com)
- [SJC Official](https://sjc.com.vn)
- [DOJI Official](https://doji.vn)
- [PNJ Official](https://pnj.com.vn)
- [Kitco International Gold](https://kitco.com)

---

**Last Updated**: 2025-11-14
**Maintainer**: KaDong Team
