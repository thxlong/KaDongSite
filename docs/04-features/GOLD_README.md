# 💰 Gold Prices - Real-Time Integration ✅

## ✨ Tính năng

✅ **Real-time Gold Prices** - Giá vàng thực từ VNAppMob API
✅ **8 loại vàng** - SJC, DOJI, PNJ, Jewelry grades (10K, 14K, 18K), XAU/USD
✅ **Auto-update** - Cron job cập nhật mỗi 5 phút
✅ **Smart Calculation** - Tính giá vàng trang sức dựa trên độ tinh khiết
✅ **Fallback System** - Manual override khi API không khả dụng
✅ **Production Ready** - PM2 ecosystem config

## 🎯 Giá vàng hiện tại

### Vàng trong nước (VND)
- **SJC_9999**: 153.2tr - 151.2tr VND/lượng (99.99%)
- **SJC_24K**: 150.2tr - 147.2tr VND/lượng (99.9%)
- **DOJI_24K**: 152tr - 150tr VND/lượng (99.9%)
- **PNJ_24K**: 8.3tr VND/chỉ (99.9%)

### Vàng trang sức (VND/chỉ)
- **PNJ_18K**: 11.5tr - 11.3tr VND/chỉ (75%)
- **GOLD_14K**: 9tr - 8.8tr VND/chỉ (58.5%)
- **GOLD_10K**: 6.4tr - 6.3tr VND/chỉ (41.7%)

### Vàng quốc tế
- **XAU_USD**: $2651.50 - $2649.50/troy oz

## 🚀 Quick Start

### 1. Setup lần đầu

```bash
cd backend

# Xóa mock data cũ
npm run gold:clear-mock

# Fetch giá thực
npm run gold:fetch

# Thêm giá vàng trang sức
npm run gold:fetch:jewelry
```

### 2. Start cron job (Auto-update)

```bash
# Development
npm run gold:cron

# Production (PM2)
pm2 start ecosystem.config.js
pm2 logs gold-price-cron
```

### 3. Check giá vàng

```bash
# Web browser
open http://localhost:3000/gold

# API
curl http://localhost:5000/api/gold/latest

# PowerShell
Invoke-RestMethod http://localhost:5000/api/gold/latest
```

## 📁 Project Structure

```
backend/
├── providers/
│   ├── index.js              # Provider registry
│   ├── realProvider.js       # ✅ VNAppMob API (ACTIVE)
│   └── mockProvider.js       # ❌ Mock data (DISABLED)
├── controllers/
│   └── goldController.js     # API logic
├── routes/
│   └── gold.js               # API endpoints
├── clear-mock-data.js        # Script: Xóa mock data
├── fetch-real-gold.js        # Script: Fetch từ API
├── add-jewelry-gold.js       # Script: Thêm vàng trang sức
├── gold-cron.js              # Cron job auto-update
└── ecosystem.config.js       # PM2 config

docs/04-features/
├── GOLD_PRICES_FEATURE.md           # Feature overview
└── GOLD_REAL_PRICES_SETUP.md        # Setup guide
```

## 🔑 Environment Variables

Thêm vào `backend/.env`:

```env
# VNAppMob Gold API (optional - có default key)
VNAPPMOB_GOLD_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Manual fallback prices (khi API fail)
MANUAL_SJC_9999_BUY=151200000
MANUAL_SJC_9999_SELL=153200000
MANUAL_XAU_USD=2650.50
```

## 📊 API Endpoints

### GET /api/gold/latest
Lấy giá vàng mới nhất (tất cả loại)

```bash
curl http://localhost:5000/api/gold/latest
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "SJC_9999",
      "buy_price": "151200000.00",
      "sell_price": "153200000.00",
      "currency": "VND",
      "meta": {
        "unit": "1 lượng (37.5g)",
        "provider": "VNAppMob API"
      }
    }
  ],
  "count": 8
}
```

### GET /api/gold/history?type=SJC_9999&period=day
Lịch sử giá vàng theo loại và khoảng thời gian

### POST /api/gold/fetch
Trigger manual fetch (admin only)

### GET /api/gold/sources
Danh sách providers và statistics

## 🎨 Frontend Integration

```javascript
// frontend/src/services/goldService.js
const API_BASE = import.meta.env.VITE_API_BASE_URL

export const getLatestGoldPrices = async () => {
  const response = await fetch(`${API_BASE}/api/gold/latest`, {
    credentials: 'include'
  })
  return response.json()
}
```

Component: `frontend/src/features/gold/GoldPricesPage.jsx`

## 🔄 Data Flow

```
VNAppMob API → realProvider.js → goldController.js → Database
                                        ↓
                                 Calculation Logic
                                   (10K, 14K, 18K)
                                        ↓
                                  Frontend API
                                        ↓
                                 GoldPricesPage.jsx
```

## ⚙️ Cron Job Schedule

```javascript
// gold-cron.js
const CRON_SCHEDULE = '*/5 * * * *' // Every 5 minutes

// Alternative schedules:
// '0 */1 * * *'           // Every hour
// '0 9,12,15,18 * * *'    // At 9am, 12pm, 3pm, 6pm
// '0 0 * * *'             // Daily at midnight
```

## 🧪 Testing

### E2E Tests
```bash
cd frontend
npx playwright test gold-prices.e2e.spec.js
```

Test cases:
- ✅ Page loads successfully
- ✅ Display all 8 gold types
- ✅ Show buy/sell prices correctly
- ✅ Filter by period (day/week/month/year)
- ✅ Chart display and toggle
- ✅ Refresh functionality

### API Tests
```bash
# Test latest endpoint
curl http://localhost:5000/api/gold/latest

# Test history endpoint
curl "http://localhost:5000/api/gold/history?type=SJC_9999&period=day"

# Test manual fetch
curl -X POST http://localhost:5000/api/gold/fetch
```

## 🐛 Troubleshooting

### Lỗi: API không trả về data
```bash
# Check provider status
curl http://localhost:5000/api/gold/sources

# Manual fetch
cd backend
npm run gold:fetch
```

### Lỗi: Jewelry gold prices missing
```bash
# Recalculate jewelry prices
cd backend
npm run gold:fetch:jewelry
```

### Lỗi: Cron job không chạy
```bash
# Check PM2 status
pm2 list
pm2 logs gold-price-cron

# Restart
pm2 restart gold-price-cron
```

## 📈 Performance

- **API Response Time**: < 200ms
- **Data Freshness**: Updated every 5 minutes
- **Database Size**: ~10KB per update (8 records)
- **Storage/Day**: ~2.3MB (288 updates x 8KB)
- **Storage/Month**: ~70MB

### Optimization Tips
1. Clean old data (keep last 30 days only)
2. Use database indexes on `fetched_at`, `type`
3. Cache API responses 5 minutes

## 🔐 Security

- ✅ Rate limiting on public endpoints
- ✅ Authentication required for POST /fetch (production)
- ✅ Input validation (type, period, limit)
- ✅ HTTPS only in production
- ✅ CORS configured properly

## 📚 Documentation

- **Feature Overview**: `docs/04-features/GOLD_PRICES_FEATURE.md`
- **Setup Guide**: `docs/04-features/GOLD_REAL_PRICES_SETUP.md`
- **API Docs**: See goldController.js comments

## 🎯 Roadmap

### ✅ Completed
- [x] VNAppMob API integration
- [x] Real-time gold prices (SJC, DOJI, PNJ)
- [x] Jewelry gold calculation (10K, 14K, 18K)
- [x] Auto-update cron job
- [x] Fallback manual override
- [x] Frontend display all types
- [x] E2E tests

### 🔜 Coming Soon
- [ ] Price alerts (notify when price changes > 1%)
- [ ] Gold price prediction (ML/AI)
- [ ] Compare with international gold
- [ ] Export to CSV/Excel
- [ ] Mobile app (React Native)

## 👥 Contributors

- **KaDong Team** - Initial work and maintenance
- **VNAppMob** - Gold price API provider

## 📄 License

MIT License - See LICENSE file

---

**Last Updated**: 2025-11-14
**Status**: ✅ Production Ready
**Version**: 1.0.0

For support: [GitHub Issues](https://github.com/thxlong/KaDongSite/issues)
