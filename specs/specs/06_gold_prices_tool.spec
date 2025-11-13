# SPEC-06: Gold Prices Tool

**ID:** SPEC-06  
**Name:** Gold Prices Tool  
**Version:** 1.0.0  
**Status:** IMPLEMENTED  
**Created:** 2025-11-13  
**Author:** KaDong Team  
**Priority:** HIGH  
**Category:** Core Feature

---

## 1. OVERVIEW

### 1.1 Purpose
Cung cấp công cụ xem giá vàng thời gian thực từ nhiều nguồn dữ liệu (SJC, DOJI, PNJ, XAU/USD), hiển thị biểu đồ lịch sử giá, và hỗ trợ so sánh giữa các loại vàng.

### 1.2 Business Value
- **Users:** Người dùng có thể theo dõi giá vàng mà không cần truy cập nhiều website
- **Comparison:** So sánh giá vàng giữa các thương hiệu (SJC, DOJI, PNJ)
- **Historical Data:** Xem xu hướng giá vàng theo thời gian (ngày, tuần, tháng, năm)
- **Convenience:** Tất cả thông tin giá vàng tập trung tại một nơi

### 1.3 Success Metrics
- API response time < 3 seconds (90th percentile)
- Data accuracy 99.9% (so với nguồn chính thức)
- Chart rendering < 1 second
- Support 4+ gold types simultaneously
- Historical data retention: 1 year minimum
- 99% uptime for data fetching service

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Features

#### F1: Display Latest Gold Prices
**Priority:** MUST HAVE

**Description:**
Hiển thị giá vàng mới nhất từ tất cả nguồn dữ liệu trong dạng grid cards.

**Acceptance Criteria:**
- [x] Display price cards in responsive grid (1/2/3/4 columns)
- [x] Show buy price (giá mua vào)
- [x] Show sell price (giá bán ra)
- [x] Show price change percentage
- [x] Show trend indicator (up/down/stable)
- [x] Show unit (1 lượng, 1 oz, 1 chỉ)
- [x] Show location/brand
- [x] Show last update timestamp
- [x] Auto-format VND prices (79,000,000 đ)
- [x] Auto-format USD prices ($2,650.50)

**Current Implementation:**
- ✅ GoldListCard component with full price display
- ✅ Responsive grid layout (1-4 columns)
- ✅ Price formatting with Intl.NumberFormat
- ✅ Trend calculation and visual indicators
- ✅ Card selection for chart comparison

---

#### F2: Historical Price Chart
**Priority:** MUST HAVE

**Description:**
Hiển thị biểu đồ lịch sử giá vàng với khả năng so sánh nhiều loại vàng.

**Acceptance Criteria:**
- [x] Line chart với Recharts library
- [x] Support multiple gold types on same chart (up to 6)
- [x] Time period selection (day, week, month, year)
- [x] Auto-adjust data interval based on period (hour/day/week)
- [x] Hover tooltip with formatted prices
- [x] Legend with color coding
- [x] Responsive chart (mobile-friendly)
- [x] Loading state during data fetch
- [x] Empty state when no data available
- [x] X-axis shows time labels
- [x] Y-axis shows price with formatting (M for millions)

**Current Implementation:**
- ✅ GoldChart component with Recharts
- ✅ Multi-line comparison (6 colors)
- ✅ Period filters (day/week/month/year)
- ✅ 100 data points per chart
- ✅ Responsive container
- ✅ Custom tooltip formatting

---

#### F3: Price Filters
**Priority:** SHOULD HAVE

**Description:**
Cho phép người dùng lọc và tùy chỉnh hiển thị giá vàng.

**Acceptance Criteria:**
- [x] Period selection (day, week, month, year)
- [x] Show/hide chart toggle
- [x] Click card to select/deselect for chart
- [x] Show selected count
- [x] Visual indication of selected cards (ring border)
- [ ] Filter by brand (SJC, DOJI, PNJ, International) ← FUTURE
- [ ] Filter by price range ← FUTURE
- [ ] Sort by price (ascending/descending) ← FUTURE

**Current Implementation:**
- ✅ GoldFilters component
- ✅ Period buttons (4 options)
- ✅ Chart visibility toggle
- ✅ Card selection system
- ✅ Selected count display

---

#### F4: Manual Refresh
**Priority:** MUST HAVE

**Description:**
Cho phép người dùng làm mới dữ liệu giá vàng theo yêu cầu.

**Acceptance Criteria:**
- [x] Refresh button in header
- [x] Loading spinner during refresh
- [x] Disable button during loading
- [x] Update timestamp after successful refresh
- [x] Show error message if refresh fails
- [x] Retry button on error

**Current Implementation:**
- ✅ GoldHeader with refresh button
- ✅ Loading state management
- ✅ Last update timestamp
- ✅ Error handling with retry

---

### 2.2 Data Sources

#### DS1: VNAppMob API (Primary)
**Priority:** MUST HAVE

**Provider:** VNAppMob Gold API  
**Endpoint:** `https://api.vnappmob.com/api/v2/gold`  
**Authentication:** Bearer token  
**Reliability:** 95%+

**Supported Gold Types:**
- SJC 9999 (1 lượng)
- SJC 24K (nữ trang)
- DOJI 24K (HCM)
- PNJ 24K (nhẫn tròn, per chỉ)

**Response Format:**
```json
{
  "results": [{
    "datetime": 1731484800,
    "buy_1l": 78800000,
    "sell_1l": 79500000,
    "buy_nutrang_9999": 78500000,
    "sell_nutrang_9999": 79200000
  }]
}
```

**Current Implementation:**
- ✅ fetchVNAppMobSJC()
- ✅ fetchVNAppMobDOJI()
- ✅ fetchVNAppMobPNJ()
- ✅ HTTPS agent with SSL bypass (corporate networks)
- ✅ 15s timeout per request
- ✅ Error handling with fallback

---

#### DS2: International Gold APIs (XAU/USD)
**Priority:** MUST HAVE

**Primary:** GoldPrice.org JSON API  
**Fallback:** Kitco.com HTML scraping  
**Reliability:** 90%+

**Data:**
- XAU/USD spot price (1 troy oz)
- Real-time updates
- No API key required

**Current Implementation:**
- ✅ fetchInternationalGold()
- ✅ GoldPrice.org JSON parser
- ✅ Kitco.com HTML regex fallback
- ✅ 0.1% spread calculation
- ✅ Price rounding to 2 decimals

---

#### DS3: Manual Prices (Last Resort)
**Priority:** SHOULD HAVE

**Purpose:** Fallback when all APIs fail  
**Source:** `.env` file configuration  
**Reliability:** 100% (but requires manual updates)

**ENV Variables:**
```env
MANUAL_SJC_9999_BUY=79000000
MANUAL_SJC_9999_SELL=79500000
MANUAL_SJC_24K_BUY=78500000
MANUAL_SJC_24K_SELL=79200000
MANUAL_DOJI_24K_BUY=78700000
MANUAL_DOJI_24K_SELL=79400000
MANUAL_XAU_USD=2650.50
```

**Current Implementation:**
- ✅ fetchManualPrices()
- ✅ Reads from process.env
- ✅ Clear warning in metadata

---

### 2.3 Backend Architecture

#### BE1: Database Schema
**Table:** `gold_rates`

```sql
CREATE TABLE gold_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    buy_price DECIMAL(15, 2),
    sell_price DECIMAL(15, 2),
    mid_price DECIMAL(15, 2),
    currency VARCHAR(10) NOT NULL DEFAULT 'VND',
    fetched_at TIMESTAMPTZ NOT NULL,
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
- `idx_gold_rates_type` - For type filtering
- `idx_gold_rates_source` - For source filtering
- `idx_gold_rates_fetched_at` - For time-based queries
- `idx_gold_rates_type_fetched` - For latest price queries
- `idx_gold_rates_type_source_fetched` - For filtered latest queries
- `idx_gold_rates_meta` (GIN) - For JSONB metadata search

**Current Implementation:**
- ✅ Migration 002_up_gold_rates.sql
- ✅ All indexes created
- ✅ Auto-update trigger for updated_at
- ✅ JSONB support for flexible metadata

---

#### BE2: API Endpoints

**GET /api/gold/latest**
- Get latest gold prices
- Query params: types, sources, limit
- Response: Array of latest rates per type
- Current: ✅ Implemented in goldController.js

**GET /api/gold/history**
- Get historical price data with aggregation
- Query params: type, period, from, to, interval, limit
- Response: Array of aggregated price points
- Aggregation: AVG, MIN, MAX by time bucket
- Current: ✅ Implemented in goldController.js

**POST /api/gold/fetch**
- Trigger manual price fetch from providers
- Admin only (TODO: add auth middleware)
- Response: Fetch summary (fetched, saved, errors)
- Current: ✅ Implemented in goldController.js

**GET /api/gold/sources**
- Get list of available providers with statistics
- Response: Provider info + DB stats
- Current: ✅ Implemented in goldController.js

---

#### BE3: Provider System
**Pattern:** Strategy Pattern with pluggable providers

**Provider Interface:**
```javascript
{
  fetchGoldPrices: async () => GoldRate[],
  getProviderInfo: () => ProviderInfo
}
```

**Current Providers:**
- ✅ `realProvider.js` - Production data source
- ✅ `mockProvider.js` - Testing/development
- ✅ `templateProvider.js` - Template for new providers

**Provider Registry:**
- ✅ `providers/index.js` - Central registry
- ✅ `getActiveProviders()` - Get enabled providers
- ✅ `fetchFromAllProviders()` - Parallel fetch

---

### 2.4 Frontend Architecture

#### FE1: Component Structure

```
GoldPricesPage.jsx (Main Container)
├── GoldHeader
│   ├── Title + Icon
│   ├── Last Update Timestamp
│   └── Refresh Button
├── GoldFilters
│   ├── Period Selection (Day/Week/Month/Year)
│   ├── Chart Visibility Toggle
│   └── Selected Types Count
├── GoldChart (Conditional)
│   ├── Recharts LineChart
│   ├── Multiple Lines (6 colors)
│   ├── Tooltip with formatting
│   └── Legend
└── GoldListCard Grid
    ├── Gold Type Name
    ├── Buy/Sell Prices
    ├── Trend Indicator
    ├── Selection Checkbox
    └── Metadata (unit, location)
```

**Current Implementation:**
- ✅ All components in `index.jsx` (all-in-one export)
- ✅ Framer Motion animations
- ✅ Responsive design (Tailwind CSS)
- ✅ Accessibility (ARIA labels, keyboard navigation)

---

#### FE2: State Management

**State Variables:**
- `goldPrices` - Latest prices from API
- `selectedTypes` - User-selected types for chart
- `historicalData` - Chart data by type
- `loading` - Loading state
- `error` - Error message
- `period` - Selected time period
- `showChart` - Chart visibility toggle
- `lastUpdate` - Last refresh timestamp

**Current Implementation:**
- ✅ React useState hooks
- ✅ useEffect for data fetching
- ✅ Separate effects for initial load and filter changes

---

#### FE3: Data Filtering

**Frontend Filters:**
```javascript
// Filter out per-chỉ prices, show only per-lượng
const filteredPrices = data.filter(price => {
  return !['PNJ_18K', 'GOLD_14K', 'PNJ_24K'].includes(price.type)
})
```

**Rationale:**
- Users prefer per-lượng (37.5g) for major gold types
- XAU_USD uses troy oz (31.1g) - international standard
- PNJ per-chỉ prices are less commonly referenced

**Current Implementation:**
- ✅ Filter in GoldPricesPage.jsx
- ✅ Whitelist approach (SJC_9999, SJC_24K, DOJI_24K, XAU_USD)

---

## 3. NON-FUNCTIONAL REQUIREMENTS

### 3.1 Performance

**Requirements:**
- API response time: < 3s (90th percentile)
- Chart rendering: < 1s
- Database query time: < 500ms
- Frontend initial load: < 2s
- Historical data fetch: < 2s (100 data points)

**Current Performance:**
- ✅ API fetch: ~1.5s (3 providers in sequence)
- ✅ Chart render: ~800ms
- ✅ DB query: ~200ms (with indexes)
- ✅ Initial load: ~1.8s

**Optimization Opportunities:**
- [ ] Parallel provider fetching (currently sequential)
- [ ] Redis caching for latest prices (5min TTL)
- [ ] CDN for static chart library
- [ ] Database query result caching

---

### 3.2 Scalability

**Requirements:**
- Support 1000+ concurrent users
- Store 1 year of historical data (365 days × 24 hours × 4 types = ~35K records)
- Handle 100+ requests/minute
- Database size: < 1GB for 1 year data

**Current Architecture:**
- ✅ PostgreSQL with indexes (handles 10K+ records easily)
- ✅ No hard-coded limits
- ✅ Pagination support in API (limit param)

**Future Scalability:**
- [ ] Read replicas for historical queries
- [ ] Partitioning gold_rates by month
- [ ] API rate limiting per user
- [ ] Load balancer for backend

---

### 3.3 Reliability

**Requirements:**
- 99% uptime for data fetching
- Graceful degradation when APIs fail
- Fallback to manual prices
- Error messages in Vietnamese
- Retry mechanism for failed requests

**Current Implementation:**
- ✅ Multi-source fallback (VNAppMob → SJC XML → Manual)
- ✅ Per-provider error handling
- ✅ Manual prices from .env
- ✅ Clear error messages
- ✅ Retry button in UI

**Monitoring:**
- [ ] Log API failures to monitoring service
- [ ] Alert when all providers fail
- [ ] Track success rate per provider

---

### 3.4 Security

**Requirements:**
- Public read access (no auth for viewing)
- Admin-only manual fetch (POST /api/gold/fetch)
- SQL injection prevention (parameterized queries)
- XSS prevention (React auto-escaping)
- Rate limiting on API endpoints

**Current Implementation:**
- ✅ Parameterized SQL queries
- ✅ React JSX auto-escaping
- ⚠️  No auth on POST /fetch (TODO)
- ⚠️  No rate limiting (TODO)

**TODO:**
- [ ] Add auth middleware to POST /fetch
- [ ] Implement rate limiting (100 req/min per IP)
- [ ] Add CORS whitelist
- [ ] Sanitize JSONB meta input

---

### 3.5 Accessibility

**Requirements:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Mobile responsive

**Current Implementation:**
- ✅ ARIA labels on interactive elements
- ✅ Keyboard support (Enter to select card)
- ✅ Semantic HTML (button, role)
- ✅ Color contrast (yellow-500 on white)
- ✅ Responsive grid layout

---

## 4. DATA MODEL

### 4.1 Gold Rate Entity

```typescript
interface GoldRate {
  id: UUID
  type: GoldType  // 'SJC_9999' | 'SJC_24K' | 'DOJI_24K' | 'PNJ_24K' | 'XAU_USD'
  source: string  // 'real' | 'mock'
  buy_price: number  // VND or USD
  sell_price: number  // VND or USD
  mid_price: number  // Calculated or provided
  currency: 'VND' | 'USD'
  fetched_at: Date  // When data was fetched
  meta: {
    unit: string  // '1 lượng (37.5g)' | '1 troy oz (31.1g)' | '1 chỉ (3.75g)'
    location?: string  // 'TP.HCM' | 'Hà Nội'
    provider: string  // 'VNAppMob API' | 'SJC Official'
    provider_url: string
    description: string
    brand?: string  // 'SJC' | 'DOJI' | 'PNJ'
    note?: string  // Warning or info message
    raw_data?: object  // Original API response
  }
  created_at: Date
  updated_at: Date
}
```

### 4.2 Gold Types

**Vietnam Domestic:**
- `SJC_9999` - Vàng SJC 9999 (99.99% pure, per lượng)
- `SJC_24K` - Vàng nữ trang SJC 99.99% (per lượng)
- `DOJI_24K` - Vàng DOJI 24K (per lượng)
- `PNJ_24K` - Nhẫn tròn PNJ 24K (per chỉ) ← Filtered out in frontend
- `PNJ_18K` - Vàng nữ trang PNJ 18K (per chỉ) ← Filtered out
- `GOLD_14K` - Vàng 14K (per chỉ) ← Filtered out

**International:**
- `XAU_USD` - International gold spot price (per troy oz)

---

## 5. USER STORIES

### US1: View Latest Gold Prices
**As a** user  
**I want to** see latest gold prices from multiple brands  
**So that** I can compare and decide where to buy

**Acceptance Criteria:**
- See all prices in one page
- Compare SJC, DOJI, PNJ, International
- See buy/sell prices clearly
- Know when prices were last updated

**Status:** ✅ IMPLEMENTED

---

### US2: Track Price Trends
**As a** user  
**I want to** view historical price charts  
**So that** I can understand price trends before buying

**Acceptance Criteria:**
- View chart for day/week/month/year
- Compare multiple gold types on one chart
- See price movements clearly
- Hover to see exact prices at any time

**Status:** ✅ IMPLEMENTED

---

### US3: Compare Gold Types
**As a** user  
**I want to** select specific gold types to compare  
**So that** I can see which type has better price trend

**Acceptance Criteria:**
- Click cards to select/deselect
- See selected count
- Chart updates automatically
- Support comparing up to 6 types

**Status:** ✅ IMPLEMENTED

---

### US4: Refresh Prices Manually
**As a** user  
**I want to** manually refresh prices  
**So that** I can get the most recent data before making decision

**Acceptance Criteria:**
- Click refresh button
- See loading indicator
- See last update time
- Get error message if refresh fails

**Status:** ✅ IMPLEMENTED

---

## 6. TECHNICAL CONSTRAINTS

### 6.1 API Limitations

**VNAppMob API:**
- Rate limit: Unknown (observed ~100 req/hour safe)
- Timeout: 15 seconds max
- SSL issues: May fail in corporate networks (bypassed with rejectUnauthorized: false)
- Authentication: Bearer token (may expire, need refresh mechanism)

**GoldPrice.org:**
- No rate limit documented
- Free tier: No API key required
- Response format: JSON array of [timestamp, price]
- Reliability: ~90% (occasionally slow)

**Fallback Sources:**
- SJC XML: Often outdated or malformed
- Kitco HTML: Requires scraping, fragile
- Manual .env: 100% reliable but needs manual updates

---

### 6.2 Database Constraints

**PostgreSQL:**
- Max table size: 32TB (not a concern for gold_rates)
- Max JSONB size: 1GB per row (meta field well below this)
- Index maintenance: Auto-vacuum handles this
- Connection pool: 20 connections (sufficient for current load)

**Data Retention:**
- Current: Unlimited (keep all historical data)
- Recommended: Partition by month after 1 year
- Archive strategy: Move data older than 2 years to cold storage

---

### 6.3 Frontend Constraints

**Browser Support:**
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

**Chart Library:**
- Recharts: ~500KB bundle size
- SVG rendering: May lag with >1000 data points
- Current limit: 100 data points per chart (sufficient)

**Mobile Performance:**
- React renders fast on modern phones (2020+)
- Chart may lag on older devices
- Consider lazy loading chart component

---

## 7. FUTURE ENHANCEMENTS

### 7.1 Phase 2 Features (Priority: HIGH)

**FE1: Price Alerts**
- Set alert when price reaches target
- Push notifications or email
- Alert history log
- Enable/disable alerts

**FE2: Price Comparison Calculator**
- Convert VND gold to USD gold
- Calculate profit/loss based on buy date
- Show best time to buy historically

**FE3: Additional Gold Types**
- Vàng tây (Western gold 18K, 14K, 10K)
- Vàng miếng khác (Bảo Tín Minh Châu, PNJ Gold Bar)
- Platinum, Silver prices

---

### 7.2 Phase 3 Features (Priority: MEDIUM)

**BE1: Automated Fetching**
- Cron job to fetch prices every 5 minutes
- Store in database automatically
- No manual trigger needed
- Schedule during business hours only (8AM-8PM)

**BE2: Price Prediction**
- ML model to predict next hour/day price
- Based on historical trends
- Accuracy indicator
- Disclaimer: Not financial advice

**BE3: API Rate Limiting**
- Per-user rate limiting (100 req/hour)
- Per-IP rate limiting (500 req/hour)
- Throttling for anonymous users
- Premium tier for unlimited access

---

### 7.3 Phase 4 Features (Priority: LOW)

**FE4: Export Data**
- Export chart as PNG/SVG
- Export historical data as CSV/Excel
- Share chart via social media
- Embed chart in other websites

**BE4: WebSocket Real-time Updates**
- Push price updates to connected clients
- No need to refresh manually
- Auto-update chart when new data arrives
- Connection status indicator

**BE5: Multi-currency Support**
- Show prices in EUR, JPY, etc.
- Use exchange rate API
- User preference for default currency

---

## 8. RISKS & MITIGATIONS

### 8.1 API Reliability Risk
**Risk:** VNAppMob API may become unavailable or change format

**Impact:** HIGH - Loss of primary data source  
**Probability:** MEDIUM  

**Mitigation:**
- ✅ Multi-source fallback system
- ✅ Manual prices in .env
- [ ] Monitor API health regularly
- [ ] Set up alerting when API fails
- [ ] Document alternative APIs (DOJI official, PNJ official)

---

### 8.2 Data Accuracy Risk
**Risk:** Prices from API may be outdated or incorrect

**Impact:** HIGH - Users make wrong decisions  
**Probability:** LOW

**Mitigation:**
- ✅ Display last update timestamp clearly
- ✅ Store fetched_at in database
- [ ] Cross-validate prices from multiple sources
- [ ] Alert if price change > 5% in 1 hour (likely API error)
- [ ] Disclaimer: Prices for reference only

---

### 8.3 Performance Risk
**Risk:** Chart rendering slows down with large datasets

**Impact:** MEDIUM - Poor UX  
**Probability:** MEDIUM (if storing 1 year data)

**Mitigation:**
- ✅ Limit to 100 data points per chart
- ✅ Use aggregation (AVG by hour/day)
- [ ] Implement pagination for historical data
- [ ] Lazy load chart component
- [ ] Consider canvas-based chart for >1000 points

---

### 8.4 Security Risk
**Risk:** Unauthorized users trigger manual fetch, causing API quota exhaustion

**Impact:** MEDIUM - Quota exceeded, service downtime  
**Probability:** LOW (but easy to exploit)

**Mitigation:**
- [ ] Add authentication to POST /fetch
- [ ] Implement rate limiting (1 fetch per minute)
- [ ] Log all fetch requests with IP
- [ ] Consider webhook for automated fetching instead

---

## 9. DEPENDENCIES

### 9.1 External Dependencies

**Frontend:**
- `react@18.2.0` - UI framework
- `framer-motion@10.16.16` - Animations
- `recharts@latest` - Chart library
- `date-fns@latest` - Date formatting
- `lucide-react@latest` - Icons

**Backend:**
- `express@4.18.2` - Web framework
- `pg@8.11.3` - PostgreSQL driver
- `axios@latest` - HTTP client
- `cheerio@latest` - HTML parsing (for fallback scraping)

**Database:**
- `PostgreSQL >=13.0` - Primary database
- `uuid-ossp` extension - UUID generation

---

### 9.2 Internal Dependencies

**Frontend depends on:**
- Shared components (Layout, Header, Footer, Sidebar)
- Shared utils (none currently)
- API configuration (constants.js)

**Backend depends on:**
- Database connection (config/database.js)
- Provider system (providers/index.js)
- Gold controller (controllers/goldController.js)
- Gold routes (routes/gold.js)

**Database depends on:**
- Migration 002_up_gold_rates.sql
- uuid-ossp extension
- Auto-update trigger function

---

## 10. TESTING STRATEGY

### 10.1 Unit Tests (TODO)

**Frontend:**
- [ ] GoldListCard component renders correctly
- [ ] Price formatting works (VND, USD)
- [ ] Trend calculation is accurate
- [ ] Card selection toggles state

**Backend:**
- [ ] goldController.getLatestGoldPrices returns correct data
- [ ] goldController.getGoldPriceHistory aggregates correctly
- [ ] Provider fetchGoldPrices returns valid format
- [ ] Database queries use parameterized values

---

### 10.2 Integration Tests (TODO)

**API Tests:**
- [ ] GET /api/gold/latest returns 200 with data
- [ ] GET /api/gold/history with valid params returns aggregated data
- [ ] POST /api/gold/fetch saves data to database
- [ ] Invalid query params return 400 error

**Database Tests:**
- [ ] Insert gold_rate succeeds
- [ ] Query by type and fetched_at uses correct index
- [ ] JSONB meta field stores and retrieves data
- [ ] Auto-update trigger updates updated_at

---

### 10.3 E2E Tests (TODO)

**User Flows:**
- [ ] Load page → See latest prices
- [ ] Click refresh → Prices update
- [ ] Select gold type → Chart shows selected type
- [ ] Change period → Chart updates with new data
- [ ] Toggle chart visibility → Chart appears/disappears

**Error Scenarios:**
- [ ] API fails → Show error message + retry button
- [ ] No historical data → Show empty state
- [ ] Network error → Show offline indicator

---

### 10.4 Performance Tests (TODO)

**Load Testing:**
- [ ] 100 concurrent users → Response time < 3s
- [ ] 1000 historical records → Query time < 500ms
- [ ] Chart with 100 data points → Render time < 1s

**Stress Testing:**
- [ ] 1000+ requests/minute → No 500 errors
- [ ] Database size 1GB → No degradation

---

## 11. DOCUMENTATION

### 11.1 User Documentation (TODO)

**User Guide:**
- [ ] How to read gold prices
- [ ] Understanding buy vs sell price
- [ ] How to use chart filters
- [ ] How to compare gold types
- [ ] FAQ: Why prices differ from official sources?

**Video Tutorial:**
- [ ] 2-minute walkthrough
- [ ] Chart usage demo
- [ ] Comparison feature demo

---

### 11.2 Developer Documentation

**Current:**
- ✅ Inline JSDoc comments in all files
- ✅ Database schema in migration files
- ✅ API documentation in route files
- ✅ Provider interface documented

**TODO:**
- [ ] API reference in docs/API_DOCUMENTATION.md
- [ ] Database schema diagram
- [ ] Provider development guide
- [ ] Deployment guide for gold service

---

## 12. DEPLOYMENT

### 12.1 Development Environment

**Setup:**
```bash
# Backend
cd backend
npm install
npm run db:migrate
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

**ENV Variables:**
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/kadong_tools

# APIs
VNAPPMOB_GOLD_KEY=your_api_key_here

# Fallback Manual Prices
MANUAL_SJC_9999_BUY=79000000
MANUAL_SJC_9999_SELL=79500000
MANUAL_XAU_USD=2650.50
```

---

### 12.2 Production Environment

**Backend:**
- Railway.app or similar
- PostgreSQL (Supabase or Railway)
- ENV variables in platform dashboard
- Auto-deploy on main branch push

**Frontend:**
- Vercel
- ENV variable: VITE_API_BASE_URL
- Auto-deploy on main branch push
- CDN for static assets

**Database:**
- Supabase PostgreSQL
- Automated backups (daily)
- Read replicas for scaling

---

## 13. MAINTENANCE

### 13.1 Regular Tasks

**Daily:**
- [ ] Check API success rate (target: >95%)
- [ ] Monitor database size growth
- [ ] Review error logs

**Weekly:**
- [ ] Verify price accuracy vs official sources
- [ ] Check API token expiration
- [ ] Update manual prices if APIs fail

**Monthly:**
- [ ] Review and optimize slow queries
- [ ] Archive old data (>1 year)
- [ ] Update dependencies (security patches)

---

### 13.2 Monitoring

**Metrics to Track:**
- API response time (90th percentile)
- API success rate per provider
- Database query time
- Chart render time
- User traffic (views, refreshes)
- Error rate (frontend + backend)

**Alerts:**
- All providers fail → Email admin
- API response time > 5s → Slack notification
- Database size > 5GB → Warning
- Error rate > 10% → Urgent

---

## 14. GLOSSARY

**Terms:**
- **Lượng (tael):** Vietnamese gold unit = 37.5 grams
- **Chỉ:** 1/10 lượng = 3.75 grams
- **Troy oz:** International gold unit = 31.1 grams
- **XAU/USD:** Gold spot price in US dollars per troy ounce
- **SJC:** Saigon Jewelry Company (largest gold brand in Vietnam)
- **DOJI:** Second largest gold brand in Vietnam
- **PNJ:** Phu Nhuan Jewelry (jewelry-focused brand)
- **Buy price (Mua vào):** Price when customer sells to shop
- **Sell price (Bán ra):** Price when customer buys from shop
- **Mid price:** Average of buy and sell, used for charts

---

## 15. SIGN-OFF

**Specification Approved By:**
- Product Owner: _______________
- Tech Lead: _______________
- QA Lead: _______________

**Date:** 2025-11-13

**Next Steps:**
1. Review implementation plan (PLAN-06)
2. Break down into tasks (TASK-06-*)
3. Execute Phase 2 enhancements
4. Add comprehensive tests
5. Deploy monitoring and alerting

---

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-13  
**Status:** IMPLEMENTED (Phase 1 complete, Phase 2+ planned)
