# Tính năng Xem Giá Vàng (Gold Price Viewer)

## 📋 Tổng quan

Tính năng xem giá vàng Việt Nam với khả năng hiển thị:
- Giá vàng hiện tại của 7 loại vàng phổ biến
- Biểu đồ lịch sử giá (theo ngày/tuần/tháng/năm)
- So sánh nhiều loại vàng trên cùng biểu đồ
- Tự động cập nhật giá theo lịch (cron job)
- Hỗ trợ nhiều nguồn dữ liệu (providers)

## 🏆 Các loại vàng được hỗ trợ

| Loại | Mô tả | Đơn vị | Tiền tệ |
|------|-------|--------|---------|
| **SJC_9999** | Vàng miếng SJC 9999 | 1 lượng (37.5g) | VND |
| **SJC_24K** | Vàng SJC 24K | 1 lượng (37.5g) | VND |
| **PNJ_24K** | Vàng PNJ 24K | 1 chỉ (3.75g) | VND |
| **PNJ_18K** | Vàng PNJ 18K (75%) | 1 chỉ (3.75g) | VND |
| **DOJI_24K** | Vàng DOJI 24K | 1 lượng (37.5g) | VND |
| **GOLD_14K** | Vàng trang sức 14K (58.5%) | 1 chỉ (3.75g) | VND |
| **XAU_USD** | Giá vàng quốc tế | 1 troy oz (31.1g) | USD |

## 🚀 Hướng dẫn sử dụng

### 1. Khởi động Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

### 2. Khởi động Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000` (hoặc 3001 nếu 3000 bận)

### 3. Truy cập tính năng

Mở trình duyệt và truy cập: `http://localhost:3000/gold`

## 📊 API Endpoints

### 1. Lấy giá vàng mới nhất

```http
GET /api/gold/latest
```

**Query Parameters:**
- `types` (string, optional) - Danh sách loại vàng (cách nhau bởi dấu phẩy). Ví dụ: `SJC_9999,XAU_USD`
- `sources` (string, optional) - Danh sách nguồn dữ liệu. Ví dụ: `mock,sjc`
- `limit` (number, optional) - Số lượng bản ghi tối đa. Mặc định: không giới hạn

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "SJC_9999",
      "source": "mock",
      "buy_price": "78500000.00",
      "sell_price": "79000000.00",
      "mid_price": "78750000.00",
      "currency": "VND",
      "fetched_at": "2025-11-11T08:00:23.279Z",
      "meta": {
        "unit": "1 lượng (37.5g)",
        "location": "TP.HCM",
        "provider_url": "https://sjc.com.vn"
      },
      "created_at": "2025-11-11T09:00:23.279Z"
    }
  ],
  "count": 7,
  "timestamp": "2025-11-11T09:10:59.904Z"
}
```

### 2. Lấy lịch sử giá vàng

```http
GET /api/gold/history
```

**Query Parameters:**
- `types` (string, required) - Danh sách loại vàng. Ví dụ: `SJC_9999,XAU_USD`
- `period` (string, optional) - Khoảng thời gian: `day`, `week`, `month`, `year`. Mặc định: `day`
- `sources` (string, optional) - Danh sách nguồn dữ liệu

**Response:**
```json
{
  "success": true,
  "data": {
    "SJC_9999": [
      {
        "period_start": "2025-11-11T09:00:00.000Z",
        "avg_buy_price": "78500000.00",
        "avg_sell_price": "79000000.00",
        "avg_mid_price": "78750000.00",
        "min_buy_price": "78400000.00",
        "max_sell_price": "79100000.00",
        "record_count": 12
      }
    ]
  },
  "period": "day",
  "timestamp": "2025-11-11T09:10:59.904Z"
}
```

### 3. Kích hoạt fetch thủ công

```http
POST /api/gold/fetch
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully fetched and saved gold prices",
  "data": {
    "totalFetched": 7,
    "saved": 7,
    "failed": 0,
    "sources": ["mock"]
  },
  "timestamp": "2025-11-11T09:10:59.904Z"
}
```

### 4. Lấy danh sách nguồn dữ liệu

```http
GET /api/gold/sources
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "mock",
      "name": "Mock Gold Provider",
      "version": "1.0.0",
      "description": "Development mock provider",
      "active": true,
      "types": ["SJC_9999", "SJC_24K", "PNJ_24K", "PNJ_18K", "DOJI_24K", "GOLD_14K", "XAU_USD"],
      "lastFetch": "2025-11-11T09:00:23.279Z",
      "recordCount": 22
    }
  ],
  "timestamp": "2025-11-11T09:10:59.904Z"
}
```

## 🤖 Cron Job - Tự động cập nhật

### Cấu hình

File: `backend/scripts/fetch-gold.js`

**Biến môi trường:**

```env
# Cron schedule (mặc định: mỗi 5 phút)
GOLD_FETCH_CRON=0 */5 * * * *

# Số ngày giữ lại dữ liệu cũ (mặc định: 90 ngày)
GOLD_DATA_RETENTION_DAYS=90
```

**Cú pháp cron:**
```
┌────────────── giây (0-59)
│ ┌──────────── phút (0-59)
│ │ ┌────────── giờ (0-23)
│ │ │ ┌──────── ngày trong tháng (1-31)
│ │ │ │ ┌────── tháng (1-12)
│ │ │ │ │ ┌──── ngày trong tuần (0-6, 0=Chủ nhật)
│ │ │ │ │ │
* * * * * *
```

**Ví dụ:**
- `0 */5 * * * *` - Mỗi 5 phút
- `0 0 * * * *` - Mỗi giờ
- `0 0 9,12,15,18 * * *` - 9h, 12h, 15h, 18h mỗi ngày
- `0 30 8 * * 1-5` - 8:30 sáng thứ 2-6

### Khởi động Cron

```bash
# Chạy một lần
npm run gold:fetch

# Chạy liên tục (cron mode)
npm run gold:fetch:cron
```

### Monitor logs

```bash
# Theo dõi logs
tail -f logs/gold-fetch.log
```

## 🔌 Provider System

### Tạo Provider mới

1. Tạo file trong `backend/providers/`:

```javascript
// backend/providers/sjcProvider.js

/**
 * SJC Gold Price Provider
 * Fetches prices from SJC official website
 */

import axios from 'axios'

const SJC_API_URL = 'https://sjc.com.vn/api/gold-prices'

export const fetchGoldPrices = async () => {
  try {
    const response = await axios.get(SJC_API_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'KaDongSite/1.0'
      }
    })

    // Transform data to standard format
    return response.data.prices.map(item => ({
      type: item.code, // 'SJC_9999', 'SJC_24K'
      source: 'sjc',
      buy_price: parseFloat(item.buyPrice),
      sell_price: parseFloat(item.sellPrice),
      mid_price: (parseFloat(item.buyPrice) + parseFloat(item.sellPrice)) / 2,
      currency: 'VND',
      fetched_at: new Date(),
      meta: {
        unit: item.unit,
        location: item.location,
        provider_url: 'https://sjc.com.vn'
      }
    }))
  } catch (error) {
    console.error('SJC Provider Error:', error.message)
    throw error
  }
}

export const getProviderInfo = () => ({
  id: 'sjc',
  name: 'SJC Gold Provider',
  version: '1.0.0',
  description: 'Official SJC gold prices',
  active: true,
  types: ['SJC_9999', 'SJC_24K']
})
```

2. Đăng ký trong `backend/providers/index.js`:

```javascript
import * as sjcProvider from './sjcProvider.js'

export const providers = {
  mock: mockProvider,
  sjc: sjcProvider  // Thêm provider mới
}
```

### Template Provider

File `backend/providers/templateProvider.js` chứa hướng dẫn chi tiết và best practices để tạo provider mới.

## 📦 Migration từ localStorage

Nếu bạn có dữ liệu giá vàng cũ trong localStorage, có thể import vào database:

### 1. Export data từ trình duyệt

Mở Console (F12) và chạy:

```javascript
// Export tất cả gold rates
const data = JSON.parse(localStorage.getItem('goldRates'))
console.log(JSON.stringify(data, null, 2))
```

Lưu output vào file `backend/data/gold-export.json`

### 2. Chạy migration

```bash
cd backend
npm run gold:migrate data/gold-export.json
```

**Options:**
```bash
# Bỏ qua duplicates
node scripts/migrate-gold-localstorage.js data/gold-export.json --skip-duplicates

# Dry run (chỉ xem trước, không lưu)
node scripts/migrate-gold-localstorage.js data/gold-export.json --dry-run
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test

# Test cụ thể cho gold module
npm test -- gold.test.js
```

### Frontend Tests

```bash
npm test

# Test component cụ thể
npm test -- GoldChart.test.jsx
```

## 🔧 Troubleshooting

### 1. Không có dữ liệu hiển thị

**Nguyên nhân:** Database chưa có dữ liệu

**Giải pháp:**
```bash
cd backend
npm run db:seed
# Hoặc kích hoạt fetch thủ công
curl -X POST http://localhost:5000/api/gold/fetch
```

### 2. Biểu đồ không hiển thị

**Nguyên nhân:** Chưa có dữ liệu lịch sử hoặc chưa chọn loại vàng

**Giải pháp:**
- Đợi cron chạy ít nhất 3-4 lần (15-20 phút)
- Chọn loại vàng từ danh sách bằng cách click vào card
- Kiểm tra console để xem lỗi API

### 3. CORS Error

**Nguyên nhân:** Backend và Frontend chạy trên domain khác nhau

**Giải pháp:** Backend đã cấu hình CORS, kiểm tra file `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Cron không chạy

**Nguyên nhân:** Biến môi trường sai format

**Giải pháp:** Kiểm tra format cron expression:
```bash
# Test cron expression
npm run gold:fetch:cron

# Xem logs
tail -f logs/gold-fetch.log
```

## 📚 Tài nguyên

- [Node-cron Documentation](https://www.npmjs.com/package/node-cron)
- [Recharts Documentation](https://recharts.org/)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [SJC Gold Prices](https://sjc.com.vn)
- [PNJ Gold Prices](https://pnj.com.vn)
- [DOJI Gold Prices](https://doji.vn)

## 🔐 Security Notes

- API không yêu cầu authentication (nếu cần, thêm middleware)
- Rate limiting: 100 requests/15 phút per IP (đã cấu hình trong backend)
- Input validation: Tất cả query params được validate
- SQL Injection: Sử dụng parameterized queries
- XSS: React tự động escape HTML

## 📝 Changelog

### v1.0.0 (2025-11-11)
- ✅ Database schema với 6 indexes
- ✅ 4 API endpoints (latest, history, fetch, sources)
- ✅ Provider system (mock + template)
- ✅ Cron scheduler tự động fetch
- ✅ Frontend với React + recharts
- ✅ Migration script từ localStorage
- ✅ Seed data với 22 mẫu records

## 🎯 Roadmap

### Phase 2 (Tương lai)
- [ ] Implement real providers (SJC, PNJ, DOJI)
- [ ] Redis caching cho latest prices
- [ ] WebSocket real-time updates
- [ ] Alert system (giá lên/xuống)
- [ ] Export chart as PNG/CSV
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Multi-language (EN/VI)

## 👥 Contributors

- KaDong Team

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.
