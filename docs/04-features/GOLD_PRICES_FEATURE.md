# 💰 Gold Prices Feature Documentation

## Tổng quan

Tính năng Giá Vàng cho phép người dùng xem giá vàng realtime và lịch sử từ nhiều nguồn khác nhau tại Việt Nam và quốc tế.

## Các loại vàng được hỗ trợ

### 1. Vàng nguyên chất (24K - 99.99%)

#### SJC_9999
- **Độ tinh khiết**: 99.99% (24K)
- **Đơn vị**: 1 lượng (37.5g)
- **Nguồn**: SJC (Công ty Vàng bạc Đá quý Sài Gòn)
- **Ghi chú**: Vàng SJC nguyên chất, được giao dịch rộng rãi nhất tại Việt Nam

#### SJC_24K
- **Độ tinh khiết**: 99.9% (24K)
- **Đơn vị**: 1 lượng (37.5g)
- **Nguồn**: SJC
- **Ghi chú**: Vàng miếng SJC 24K

#### DOJI_24K
- **Độ tinh khiết**: 99.9% (24K)
- **Đơn vị**: 1 lượng (37.5g)
- **Nguồn**: DOJI (Công ty Vàng bạc DOJI)
- **Địa điểm**: Hà Nội
- **Ghi chú**: Vàng DOJI 24K

#### PNJ_24K
- **Độ tinh khiết**: 99.9% (24K)
- **Đơn vị**: 1 chỉ (3.75g)
- **Nguồn**: PNJ (Công ty Phú Nhuận Jewelry)
- **Địa điểm**: Toàn quốc
- **Ghi chú**: Vàng 24K PNJ, đơn vị nhỏ hơn (per chỉ)

### 2. Vàng trang sức (Jewelry Gold)

#### PNJ_18K
- **Độ tinh khiết**: 75% (18K)
- **Đơn vị**: 1 chỉ (3.75g)
- **Nguồn**: PNJ
- **Địa điểm**: Toàn quốc
- **Ghi chú**: Vàng trang sức 18K, phổ biến cho nhẫn cưới và trang sức cao cấp

#### GOLD_14K
- **Độ tinh khiết**: 58.5% (14K)
- **Đơn vị**: 1 chỉ (3.75g)
- **Địa điểm**: TP.HCM
- **Ghi chú**: Vàng trang sức 14K, phổ biến cho trang sức hàng ngày

#### GOLD_10K
- **Độ tinh khiết**: 41.7% (10K)
- **Đơn vị**: 1 chỉ (3.75g)
- **Địa điểm**: TP.HCM
- **Ghi chú**: Vàng trang sức 10K, giá cả phải chăng, phù hợp cho trang sức phổ thông

### 3. Vàng quốc tế

#### XAU_USD
- **Đơn vị**: 1 troy oz (31.1g)
- **Đơn vị tiền tệ**: USD
- **Nguồn**: Thị trường quốc tế (Kitco)
- **Ghi chú**: Giá vàng thế giới, tham chiếu cho giá vàng Việt Nam

## Cấu trúc Database

### Bảng: `gold_rates`

```sql
CREATE TABLE gold_rates (
    id UUID PRIMARY KEY,
    type VARCHAR(100) NOT NULL,           -- Loại vàng (SJC_9999, GOLD_10K, etc.)
    source VARCHAR(100) NOT NULL,         -- Nguồn data ('mock', 'sjc', 'pnj', etc.)
    buy_price DECIMAL(15, 2),             -- Giá mua vào
    sell_price DECIMAL(15, 2),            -- Giá bán ra
    mid_price DECIMAL(15, 2),             -- Giá trung bình
    currency VARCHAR(10) DEFAULT 'VND',   -- Đơn vị tiền tệ
    fetched_at TIMESTAMPTZ NOT NULL,      -- Thời điểm lấy data
    meta JSONB DEFAULT '{}',              -- Metadata (unit, purity, location, etc.)
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

### Metadata Structure

```json
{
  "unit": "1 chỉ (3.75g)",
  "purity": "41.7%",
  "location": "TP.HCM",
  "brand": "PNJ",
  "note": "Vàng trang sức phổ thông",
  "provider": "Manual Override",
  "provider_url": "https://pnj.com.vn"
}
```

## API Endpoints

### 1. Lấy giá vàng mới nhất
```http
GET /api/gold/latest
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "GOLD_10K",
      "source": "mock",
      "buy_price": "32500000.00",
      "sell_price": "33000000.00",
      "mid_price": "32750000.00",
      "currency": "VND",
      "fetched_at": "2025-11-14T09:00:00.000Z",
      "meta": {
        "unit": "1 chỉ (3.75g)",
        "purity": "41.7%",
        "location": "TP.HCM",
        "note": "Vàng trang sức phổ thông"
      },
      "created_at": "2025-11-14T09:00:00.000Z"
    }
  ],
  "count": 8,
  "timestamp": "2025-11-14T09:00:00.000Z"
}
```

### 2. Lấy lịch sử giá vàng
```http
GET /api/gold/history?type=GOLD_10K&period=day&limit=100
```

**Query Parameters:**
- `type` (required): Loại vàng (GOLD_10K, GOLD_14K, PNJ_18K, etc.)
- `period` (optional): `day` | `week` | `month` | `year` (default: `day`)
- `limit` (optional): Số lượng records (default: 1000, max: 10000)

## Frontend Components

### GoldPricesPage
- Component chính hiển thị giá vàng
- Location: `frontend/src/features/gold/GoldPricesPage.jsx`

### GoldListCard
- Component hiển thị từng loại vàng dạng card
- Hiển thị giá mua/bán, đơn vị, độ tinh khiết
- Có thể click để chọn so sánh

### GoldChart
- Component hiển thị biểu đồ lịch sử giá
- Hỗ trợ so sánh nhiều loại vàng
- Có thể toggle bật/tắt

### GoldFilters
- Component filter theo khoảng thời gian (ngày/tuần/tháng/năm)
- Toggle hiển thị/ẩn biểu đồ

## Tính năng

### ✅ Đã implement
1. Hiển thị giá vàng real-time từ 8 loại vàng
2. So sánh giá giữa các loại vàng
3. Biểu đồ lịch sử giá theo thời gian
4. Filter theo khoảng thời gian (ngày/tuần/tháng/năm)
5. Refresh manual
6. Responsive design (mobile, tablet, desktop)
7. Hiển thị metadata đầy đủ (đơn vị, độ tinh khiết, địa điểm)

### 🔄 Đang phát triển
- Tích hợp API thực từ SJC, PNJ, DOJI
- Notification khi giá thay đổi lớn
- Lưu lịch sử giá tự động (cron job)
- Export dữ liệu (CSV, Excel)

### 📝 Kế hoạch tương lai
- So sánh với giá vàng quốc tế
- Tính toán lợi nhuận/lỗ
- Alerts khi giá đạt mức mong muốn
- Dự đoán xu hướng giá (AI/ML)

## Testing

### E2E Tests
Location: `frontend/tests/e2e/gold-prices.e2e.spec.js`

**Test cases:**
1. ✅ Page load successfully
2. ✅ Display all gold types (including 10K, 14K, 18K)
3. ✅ Display buy/sell prices
4. ✅ Filter by period
5. ✅ Chart display and toggle
6. ✅ Refresh functionality
7. ✅ Error handling
8. ✅ Responsive design
9. ✅ Accessibility

### Chạy tests
```bash
# Chạy tất cả gold tests
npm run test:e2e:gold

# Chạy test cụ thể
npx playwright test gold-prices.e2e.spec.js -g "should load gold prices page successfully"

# Chạy với UI
npx playwright test gold-prices.e2e.spec.js --headed
```

## Cấu hình

### Environment Variables

```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000

# Backend (.env)
# Gold API keys (khi có API thực)
SJC_API_KEY=your_sjc_key
PNJ_API_KEY=your_pnj_key
DOJI_API_KEY=your_doji_key
KITCO_API_KEY=your_kitco_key
```

## Performance

### Tối ưu hóa
1. **Caching**: Cache API response 5 phút
2. **Indexes**: Có indexes trên `type`, `fetched_at` để query nhanh
3. **Pagination**: API support limit để tránh load quá nhiều data
4. **Lazy loading**: Components load lazy khi cần

### Metrics
- API response time: < 200ms
- Page load time: < 2s
- Chart render time: < 500ms

## Troubleshooting

### Lỗi thường gặp

#### 1. "API error: 404 Not Found"
**Nguyên nhân**: Backend không chạy hoặc route sai
**Giải pháp**: 
- Check backend đang chạy: `curl http://localhost:5000/api/gold/latest`
- Verify VITE_API_BASE_URL trong `.env`

#### 2. "Không có dữ liệu giá vàng"
**Nguyên nhân**: Database chưa có seed data
**Giải pháp**: Run seed script
```bash
cd backend
node add-gold-10k.js
```

#### 3. Login failed trong E2E tests
**Nguyên nhân**: Frontend hoặc backend không chạy
**Giải pháp**:
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend  
cd frontend && npm run dev

# Terminal 3: Run tests
cd frontend && npx playwright test gold-prices.e2e.spec.js
```

## Bảo mật

### Considerations
1. ✅ Public endpoints (không cần auth để xem giá)
2. ✅ Rate limiting (5 req/15min cho sensitive endpoints)
3. ✅ Input validation (type, period parameters)
4. ⏳ CORS configured properly
5. ⏳ API key rotation cho external APIs

## Monitoring

### Logs
- API requests được log với timestamp
- Errors được log với stack trace
- Performance metrics được track

### Health checks
```bash
# Check API health
curl http://localhost:5000/api/gold/latest

# Check database connection
psql -U postgres -d kadongsite -c "SELECT COUNT(*) FROM gold_rates;"
```

## Credits

**Developers**: KaDong Team
**Created**: 2025-11-11
**Last Updated**: 2025-11-14

---

For more information, see:
- [Gold API Routes](../../backend/routes/gold.js)
- [Gold Controller](../../backend/controllers/goldController.js)
- [Database Schema](../../backend/database/SCHEMA_DESIGN.md)
