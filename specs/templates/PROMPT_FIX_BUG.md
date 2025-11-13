# 🐛 PROMPT CHUẨN: FIX BUG

## 📋 Checklist Tổng Quan
- [ ] Đọc specs liên quan
- [ ] Reproduce bug
- [ ] Phân tích root cause
- [ ] Fix bug với defensive coding
- [ ] Update documentation
- [ ] Viết unit tests
- [ ] Viết integration tests (nếu cần)
- [ ] Run all tests
- [ ] Manual testing trong browser
- [ ] Update CHANGELOG.md

---

## 🎯 BƯỚC 1: ĐỌC SPECS & HIỂU YÊU CẦU

### Prompt Template:
```
TASK: Phân tích bug trong [TÊN_FEATURE]

CONTEXT:
- Feature: [TÊN_FEATURE]
- File specs: specs/specs/[TÊN_FILE].spec
- File plan: specs/plans/[TÊN_FILE].plan
- Bug report: [MÔ_TẢ_BUG]

ACTION:
1. Đọc file specs để hiểu requirement gốc
2. Đọc file plan để hiểu implementation design
3. Xác định expected behavior vs actual behavior
4. List các files liên quan cần check

OUTPUT: Summary về:
- Expected behavior (theo specs)
- Actual behavior (bug hiện tại)
- Files cần kiểm tra
```

### Ví dụ thực tế:
```
TASK: Phân tích bug trong Gold Prices Chart

CONTEXT:
- Feature: Gold Prices Tool
- File specs: specs/specs/06_gold_prices_tool.spec
- File plan: specs/plans/06_gold_prices_tool.plan
- Bug report: Chart không hiển thị biểu đồ giá vàng

ACTION:
1. Đọc specs/specs/06_gold_prices_tool.spec - section "Biểu đồ lịch sử"
2. Đọc specs/plans/06_gold_prices_tool.plan - Phase 1e implementation
3. Expected: Chart hiển thị line graph với data từ API
4. Actual: Chart blank, không render

OUTPUT:
- Expected: Recharts LineChart với data points từ /api/gold/history
- Actual: Component render nhưng không có chart
- Files cần check:
  - frontend/src/features/gold/GoldPricesPage.jsx
  - frontend/src/features/gold/index.jsx (GoldChart component)
  - backend/controllers/goldController.js
```

---

## 🔍 BƯỚC 2: REPRODUCE & KIỂM TRA LỖI

### Prompt Template:
```
TASK: Reproduce bug [TÊN_BUG]

ACTION:
1. Kiểm tra database có data không:
   - Query: SELECT * FROM [TABLE] WHERE [CONDITION] LIMIT 10
   - Verify data structure

2. Test API endpoints:
   - Endpoint: GET/POST [URL]
   - Expected response structure
   - Actual response

3. Kiểm tra frontend component:
   - Props passed vào component
   - State management
   - Console errors/warnings

4. Kiểm tra browser DevTools:
   - Console logs
   - Network tab (API calls)
   - React DevTools (component state)

OUTPUT:
- Database status: ✅/❌ + data sample
- API status: ✅/❌ + response sample
- Frontend status: ✅/❌ + error messages
- Root cause hypothesis
```

### Ví dụ thực tế:
```
TASK: Reproduce bug Gold Chart không hiển thị

ACTION:
1. Database check:
   Query: SELECT type, COUNT(*) FROM gold_rates GROUP BY type
   Result: ✅ 44 records, 7 gold types

2. API test:
   GET /api/gold/history?type=SJC_9999&period=day&limit=10
   Result: ⚠️ Returns {"data": []} - empty array (data quá cũ)
   
   POST /api/gold/fetch (trigger manual fetch)
   Result: ✅ Saved 5 new records
   
   Re-test history API: ✅ Returns 1 data point with correct structure

3. Frontend check:
   Component: GoldChart
   Props: data={}, loading=false
   Console: No errors but chart not rendering

4. Browser DevTools:
   - Console: No errors
   - Network: API returns data correctly
   - React DevTools: Component receives data but doesn't render chart

ROOT CAUSE: GoldChart component có bug xử lý data
```

---

## 🔬 BƯỚC 3: PHÂN TÍCH ROOT CAUSE

### Prompt Template:
```
TASK: Phân tích root cause của bug [TÊN_BUG]

ACTION:
1. Đọc source code component/function bị bug
2. Trace data flow từ API → Component → Render
3. Identify assumptions sai/missing validations
4. List tất cả edge cases không được handle

OUTPUT:
Root Causes (ưu tiên từ cao xuống thấp):
1. [ROOT_CAUSE_1] - Impact: HIGH/MEDIUM/LOW
   - Vị trí: [FILE:LINE]
   - Lý do: [EXPLANATION]
   - Fix suggestion: [SOLUTION]

2. [ROOT_CAUSE_2] - Impact: HIGH/MEDIUM/LOW
   ...

Edge Cases chưa handle:
- [ ] Null/undefined data
- [ ] Empty arrays
- [ ] Missing fields
- [ ] Invalid data types
- [ ] ...
```

### Ví dụ thực tế:
```
TASK: Phân tích root cause của Gold Chart bug

ACTION:
1. Đọc frontend/src/features/gold/index.jsx - GoldChart component
2. Trace: API returns data → data prop → Transform for Recharts → Render
3. Found issues trong data transformation logic
4. Missing validations ở nhiều bước

ROOT CAUSES:
1. No null/empty data check - Impact: HIGH
   - Vị trí: index.jsx:210
   - Lý do: Không check if (!data || Object.keys(data).length === 0)
   - Fix: Add early return với empty state

2. No Array.isArray validation - Impact: HIGH
   - Vị trí: index.jsx:215
   - Lý do: forEach on undefined crashes
   - Fix: Add if (!Array.isArray(records)) check

3. Missing time field validation - Impact: HIGH
   - Vị trí: index.jsx:220
   - Lý do: Dùng record.time_bucket nhưng có API trả period_start
   - Fix: Add fallback const timeField = record.time_bucket || record.period_start

4. Missing price field validation - Impact: MEDIUM
   - Vị trí: index.jsx:225
   - Lý do: parseFloat có thể return NaN
   - Fix: Add if (!isNaN(priceValue)) check

5. Empty state sau khi crash - Impact: LOW
   - Vị trí: index.jsx:280
   - Lý do: Check hasData sau khi đã render chart
   - Fix: Move check lên trước

EDGE CASES chưa handle:
✅ Null data → Cần add check
✅ Empty object {} → Cần add check
✅ Empty arrays [] → Cần add check
✅ Missing time_bucket field → Cần fallback period_start
✅ Missing avg_mid_price field → Cần fallback mid_price
✅ NaN price values → Cần filter
✅ Very large/small numbers → Cần format
```

---

## 🛠️ BƯỚC 4: FIX BUG VỚI DEFENSIVE CODING

### Prompt Template:
```
TASK: Fix bug [TÊN_BUG] với defensive programming

PRINCIPLES:
1. Validate inputs - Không tin tưởng data từ bên ngoài
2. Early returns - Fail fast với clear error messages
3. Fallback values - Luôn có plan B
4. Type checking - Verify data types trước khi dùng
5. Error logging - Console.warn/error để debug

ACTION:
1. Fix root cause #1 (highest priority)
   - Add validation
   - Add error handling
   - Add fallback

2. Fix root cause #2
   ...

3. Add debug logging:
   - console.log('[ComponentName] Processing data:', summary)
   - console.warn('[ComponentName] Warning:', issue)

CODE STYLE:
- Keep changes minimal and focused
- Add comments explaining WHY not WHAT
- Maintain existing code style
- Don't mix refactoring with bug fixes

OUTPUT:
List of changes:
- File: [PATH]
  - Line [X]: Added [CHANGE] để fix [ISSUE]
  - Line [Y]: Added [CHANGE] để prevent [EDGE_CASE]
```

### Ví dụ thực tế:
```
TASK: Fix Gold Chart bug với defensive programming

CHANGES:

File: frontend/src/features/gold/index.jsx

1. Line 200-205: Added null/empty data check
   ```javascript
   // Early return for null/empty data
   if (!data || Object.keys(data).length === 0) {
     return (
       <div className="bg-white rounded-xl shadow-sm p-6">
         <div className="text-center py-8 text-gray-500">
           ⚠️ Chưa có dữ liệu lịch sử.
         </div>
       </div>
     )
   }
   ```

2. Line 215-220: Added Array validation
   ```javascript
   Object.entries(data).forEach(([type, records]) => {
     if (!Array.isArray(records) || records.length === 0) {
       console.warn(`[GoldChart] No records for type: ${type}`)
       return // Skip this type
     }
     // ... process records
   })
   ```

3. Line 225-230: Added time field validation with fallback
   ```javascript
   records.forEach(record => {
     // Fallback: time_bucket → period_start
     const timeField = record.time_bucket || record.period_start
     if (!timeField) {
       console.warn('[GoldChart] Missing time_bucket and period_start:', record)
       return // Skip invalid record
     }
     const timestamp = new Date(timeField).getTime()
     // ...
   })
   ```

4. Line 235-240: Added price field validation with NaN check
   ```javascript
   // Fallback: avg_mid_price → mid_price
   const priceValue = parseFloat(record.avg_mid_price || record.mid_price)
   
   // Only add valid prices (filter out NaN)
   if (!isNaN(priceValue)) {
     typeData[timestamp][type] = priceValue
   }
   ```

5. Line 250-255: Moved empty state check before render
   ```javascript
   const hasData = chartData.length > 0
   
   return (
     <div className="bg-white rounded-xl shadow-sm p-6">
       <h2>📈 Biểu đồ giá vàng - {periodTitle}</h2>
       
       {hasData ? (
         <ResponsiveContainer>...</ResponsiveContainer>
       ) : (
         <EmptyState />
       )}
     </div>
   )
   ```

6. Line 260: Added debug logging
   ```javascript
   console.log('[GoldChart] Processed chart data:', {
     originalData: data,
     chartData: chartData.slice(0, 3),
     dataPoints: chartData.length,
     selectedTypes
   })
   ```

TOTAL: ~110 lines modified across 6 sections
```

---

## 📝 BƯỚC 5: UPDATE DOCUMENTATION

### Prompt Template:
```
TASK: Update documentation sau khi fix bug [TÊN_BUG]

FILES CẦN UPDATE:
1. CHANGELOG.md
2. README.md (nếu ảnh hưởng API/usage)
3. Specs (nếu requirements thay đổi)
4. Code comments
5. API documentation (nếu có)

ACTION:

1. Update CHANGELOG.md:
   ```markdown
   ## [Version] - YYYY-MM-DD
   
   ### 🐛 Bug Fixes
   - **[Feature]**: Fixed [BUG_DESCRIPTION] ([#issue])
     - Root cause: [EXPLANATION]
     - Solution: [SOLUTION_SUMMARY]
     - Impact: [WHO_AFFECTED]
   ```

2. Update code comments:
   - Add JSDoc cho functions mới
   - Explain WHY cho complex logic
   - Document assumptions/limitations

3. Update specs (nếu cần):
   - Implementation notes section
   - Known issues section
   - Testing section

OUTPUT: List of updated files
```

### Ví dụ thực tế:
```
TASK: Update documentation sau khi fix Gold Chart bug

UPDATES:

1. CHANGELOG.md:
   ```markdown
   ## [1.1.0] - 2025-11-13
   
   ### 🐛 Bug Fixes
   - **Gold Prices Chart**: Fixed chart not displaying bug (#42)
     - Root cause: Missing null/empty data validation, no field fallbacks
     - Solution: Added defensive programming với 5 validations:
       1. Null/empty data check
       2. Array.isArray() validation
       3. time_bucket → period_start fallback
       4. avg_mid_price → mid_price fallback
       5. NaN price filtering
     - Impact: All users using Gold Prices feature
     - Tests: Added 19 unit tests + 20 integration tests (all passing)
   ```

2. frontend/src/features/gold/index.jsx:
   ```javascript
   /**
    * GoldChart Component
    * 
    * Displays historical gold price chart using Recharts
    * 
    * @param {Object} data - Chart data grouped by gold type
    *   Format: { [type]: [{ time_bucket?, period_start?, avg_mid_price?, mid_price? }] }
    * @param {string[]} selectedTypes - Array of selected gold types
    * @param {string} period - Time period: 'day' | 'week' | 'month' | 'year'
    * @param {boolean} loading - Loading state
    * 
    * @important Data validation:
    *   - Checks for null/empty data before processing
    *   - Validates Array.isArray() before forEach
    *   - Fallback: time_bucket → period_start
    *   - Fallback: avg_mid_price → mid_price
    *   - Filters NaN price values
    * 
    * @bugfix 2025-11-13: Added defensive coding for data handling
    */
   export const GoldChart = ({ data, selectedTypes, period, loading }) => {
     // Early return for null/empty data (Bug fix #1)
     if (!data || Object.keys(data).length === 0) {
       return <EmptyState />
     }
     
     // ... rest of code
   }
   ```

3. specs/specs/06_gold_prices_tool.spec:
   ```markdown
   ## Implementation Notes

   ### Known Issues (Resolved)
   ~~- Chart không hiển thị khi data empty~~ ✅ Fixed 2025-11-13
   ~~- Missing field validation~~ ✅ Fixed 2025-11-13

   ### Bug Fixes Log
   **2025-11-13**: Gold Chart Display Bug
   - Issue: Chart không render với empty/invalid data
   - Root causes: 5 validation issues
   - Solution: Defensive programming + field fallbacks
   - Tests: 19 unit + 20 integration tests
   - Files: frontend/src/features/gold/index.jsx
   ```

FILES UPDATED:
✅ CHANGELOG.md - Added bug fix entry
✅ frontend/src/features/gold/index.jsx - Added JSDoc + inline comments
✅ specs/specs/06_gold_prices_tool.spec - Updated implementation notes
```

---

## ✅ BƯỚC 6: VIẾT UNIT TESTS

### Prompt Template:
```
TASK: Viết unit tests cho bug fix [TÊN_BUG]

TEST COVERAGE:
1. Test bug đã fix (regression tests)
2. Test edge cases đã handle
3. Test happy path vẫn hoạt động
4. Test error handling

STRUCTURE:
```javascript
describe('[ComponentName]', () => {
  describe('[Feature] - Bug Fix: [BUG_DESCRIPTION]', () => {
    it('should handle [EDGE_CASE_1]', () => {
      // Arrange: Setup test data
      const data = { /* ... */ }
      
      // Act: Render/call function
      render(<Component data={data} />)
      
      // Assert: Verify expected behavior
      expect(screen.getByText(/expected/i)).toBeInTheDocument()
    })
    
    it('should handle [EDGE_CASE_2]', () => { /* ... */ })
  })
  
  describe('[Feature] - Original Functionality', () => {
    it('should work with valid data', () => { /* ... */ })
  })
})
```

TARGET:
- Coverage: 80%+ của code bị sửa
- Test names: Clear và descriptive
- Test data: Realistic và varied
- Assertions: Specific và meaningful

OUTPUT:
- Test file path
- Number of tests
- Coverage percentage
```

### Ví dụ thực tế:
```
TASK: Viết unit tests cho Gold Chart bug fix

FILE: frontend/tests/unit/GoldChart.test.jsx

TESTS (19 total):

1. Loading State (1 test)
   ✅ should display loading state

2. Empty Data Handling - Bug Fix (4 tests)
   ✅ should handle empty data object
   ✅ should handle null data
   ✅ should handle undefined data
   ✅ should handle empty records array

3. Time Field Handling - Bug Fix (3 tests)
   ✅ should use time_bucket when available
   ✅ should fallback to period_start when time_bucket missing
   ✅ should skip records without time_bucket or period_start

4. Price Field Handling - Bug Fix (3 tests)
   ✅ should use avg_mid_price when available
   ✅ should fallback to mid_price when avg_mid_price missing
   ✅ should skip records with invalid price (NaN)

5. Chart Display (2 tests)
   ✅ should display correct period title
   ✅ should merge data points at same timestamp from different types

6. Edge Cases (3 tests)
   ✅ should handle very large price values
   ✅ should handle very small price values
   ✅ should handle different timezone date formats

7. Console Logging (3 tests)
   ✅ should log processed chart data
   ✅ should warn when no records for a type
   ✅ should warn when time fields are missing

EXAMPLE TEST:
```javascript
describe('GoldChart Component', () => {
  describe('Empty Data Handling - Bug Fix: Null/Undefined Check', () => {
    it('should handle empty data object', () => {
      render(<GoldChart loading={false} data={{}} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
    })

    it('should handle null data', () => {
      render(<GoldChart loading={false} data={null} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
    })

    it('should handle empty records array', () => {
      const data = { SJC_9999: [] }
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      
      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('No records for type'))
      expect(screen.getByText(/Chưa có dữ liệu lịch sử/i)).toBeInTheDocument()
      
      consoleWarnSpy.mockRestore()
    })
  })

  describe('Time Field Handling - Bug Fix: time_bucket/period_start fallback', () => {
    it('should use time_bucket when available', () => {
      const data = {
        SJC_9999: [{
          time_bucket: '2025-11-13T09:00:00.000Z',
          avg_mid_price: '153500000'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['SJC_9999']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })

    it('should fallback to period_start when time_bucket missing', () => {
      const data = {
        XAU_USD: [{
          period_start: '2025-11-13T09:00:00.000Z',
          mid_price: '2650.50'
        }]
      }
      
      render(<GoldChart loading={false} data={data} selectedTypes={['XAU_USD']} period="day" />)
      expect(screen.getByText(/📈 Biểu đồ giá vàng/i)).toBeInTheDocument()
    })
  })
})
```

RESULT:
✅ 19/19 tests passing
✅ Coverage: 85% của GoldChart component
✅ Test execution: 235ms
```

---

## 🔧 BƯỚC 7: VIẾT INTEGRATION TESTS (NẾU CẦN)

### Prompt Template:
```
TASK: Viết integration tests cho bug fix [TÊN_BUG]

KHI NÀO CẦN INTEGRATION TESTS:
- Bug liên quan đến API endpoints
- Bug liên quan đến database queries
- Bug liên quan đến data flow giữa nhiều layers
- Bug về authentication/authorization

STRUCTURE:
```javascript
describe('[API/Feature] Integration Tests', () => {
  describe('[Endpoint/Flow]', () => {
    it('should [expected behavior]', async () => {
      // Arrange: Setup test data
      const requestData = { /* ... */ }
      
      // Act: Call API/execute flow
      const response = await fetch(`${API_BASE}/endpoint`, {
        method: 'POST',
        body: JSON.stringify(requestData)
      })
      const data = await response.json()
      
      // Assert: Verify response
      expect(response.status).toBe(200)
      expect(data).toHaveProperty('expectedField')
    })
  })
  
  describe('Bug Fix Verification', () => {
    it('should return [required field] for bug fix', async () => { /* ... */ })
  })
})
```

OUTPUT:
- Test file path
- Number of integration tests
- API endpoints covered
```

### Ví dụ thực tế:
```
TASK: Viết integration tests cho Gold Chart bug fix

FILE: frontend/tests/integration/goldApi.integration.test.js

TESTS (20 total):

1. GET /api/gold/history (11 tests)
   ✅ should return 400 when type parameter is missing
   ✅ should return 200 with valid type parameter
   ✅ should return correct data structure
   ✅ should handle period=day correctly
   ✅ should handle period=week correctly
   ✅ should handle period=month correctly
   ✅ should handle period=year correctly
   ✅ should respect limit parameter
   ✅ should handle multiple gold types
   ✅ should return data sorted by time ascending
   ✅ should handle custom date range

2. GET /api/gold/latest (3 tests)
   ✅ should return latest prices for all types
   ✅ should filter by types parameter
   ✅ should return most recent data first

3. POST /api/gold/fetch (2 tests)
   ✅ should trigger manual fetch and save to database
   ✅ should save fetched data to database

4. Bug Fix Verification (4 tests)
   ✅ should return time_bucket field for chart component
   ✅ should return avg_mid_price as string for precision
   ✅ should return period_start and period_end for fallback
   ✅ should handle empty results gracefully

EXAMPLE TEST:
```javascript
describe('Gold History API - Integration Tests', () => {
  describe('Bug Fix Verification', () => {
    it('should return time_bucket field for chart component', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // Critical: time_bucket must exist for chart
        expect(record.time_bucket).toBeDefined()
        expect(record.time_bucket).not.toBeNull()
        
        // Should be valid ISO date string
        const date = new Date(record.time_bucket)
        expect(date.toString()).not.toBe('Invalid Date')
      }
    })

    it('should return avg_mid_price as string for precision', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // avg_mid_price should be string (from DECIMAL type)
        expect(typeof record.avg_mid_price).toBe('string')
        
        // Should be parseable as float
        const price = parseFloat(record.avg_mid_price)
        expect(price).toBeGreaterThan(0)
        expect(isNaN(price)).toBe(false)
      }
    })

    it('should return period_start and period_end for fallback', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // Fallback fields must exist
        expect(record.period_start).toBeDefined()
        expect(record.period_end).toBeDefined()
        
        // Should be valid dates
        expect(new Date(record.period_start).toString()).not.toBe('Invalid Date')
        expect(new Date(record.period_end).toString()).not.toBe('Invalid Date')
      }
    })
  })
})
```

RESULT:
✅ 20/20 tests passing
✅ API coverage: 100% of gold endpoints
✅ Test execution: 9.5s (includes API calls)
```

---

## 🚀 BƯỚC 8: RUN ALL TESTS

### Prompt Template:
```
TASK: Run tất cả tests để verify bug fix

TEST COMMANDS:
1. Unit tests: npm run test:unit
2. Integration tests: npm run test:integration
3. E2E tests: npm run test:e2e (nếu có)
4. Coverage: npm run test:coverage

ACTION:
1. Chạy unit tests
   - Expected: All tests pass
   - Check coverage >= 80%

2. Chạy integration tests
   - Expected: All API tests pass
   - Verify data flow end-to-end

3. Chạy existing tests (regression)
   - Expected: No tests broken by changes
   - All green

4. Generate coverage report
   - Highlight files changed
   - Verify coverage thresholds

OUTPUT:
```
Test Results Summary:
✅ Unit Tests: X/X passing (Coverage: Y%)
✅ Integration Tests: X/X passing
✅ Regression Tests: X/X passing
✅ Total: X tests, all passing

Files Changed:
- [file1]: Coverage X% → Y%
- [file2]: Coverage X% → Y%

Commands to reproduce:
$ npm run test:unit
$ npm run test:integration
```
```

### Ví dụ thực tế:
```
TASK: Run all tests cho Gold Chart bug fix

RESULTS:

1. Unit Tests:
   $ npm run test:unit
   ✅ 19/19 tests passing
   ✅ Coverage: 85% (threshold: 80%)
   ✅ Duration: 6.78s

2. Integration Tests:
   $ npm run test:integration
   ✅ 20/20 tests passing
   ✅ All API endpoints verified
   ✅ Duration: 10.77s

3. Regression Tests:
   $ npm run test:e2e
   ✅ All existing E2E tests still passing
   ✅ No breaking changes detected

SUMMARY:
✅ Total: 39 new tests, all passing
✅ No regression (0 tests broken)
✅ Coverage increased: 65% → 85%

FILES CHANGED:
- frontend/src/features/gold/index.jsx: 45% → 85%
- backend/controllers/goldController.js: 80% → 80% (no change)

COMMANDS TO REPRODUCE:
$ cd frontend
$ npm run test:unit              # 19 unit tests
$ npm run test:integration       # 20 integration tests
$ npm run test:unit:watch        # Watch mode for development
```

---

## 🌐 BƯỚC 9: MANUAL TESTING TRONG BROWSER

### Prompt Template:
```
TASK: Manual testing bug fix trong browser

CHECKLIST:
- [ ] Start dev servers (frontend + backend)
- [ ] Navigate to feature page
- [ ] Test bug scenario (should be fixed)
- [ ] Test happy path (should still work)
- [ ] Test edge cases
- [ ] Check console for errors/warnings
- [ ] Check Network tab (API calls)
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test responsive design (mobile/tablet)

ACTION:
1. Start servers:
   $ npm run dev:all

2. Navigate to: http://localhost:[PORT]/[PATH]

3. Test scenarios:
   a) Bug scenario: [STEPS]
      Expected: [RESULT]
      Actual: ✅/❌
   
   b) Happy path: [STEPS]
      Expected: [RESULT]
      Actual: ✅/❌
   
   c) Edge case 1: [STEPS]
      Expected: [RESULT]
      Actual: ✅/❌

4. Browser DevTools:
   - Console: No errors ✅/❌
   - Network: All APIs 200 OK ✅/❌
   - Performance: No lag ✅/❌

OUTPUT:
Manual Test Report:
- Scenario A: ✅ PASS - [description]
- Scenario B: ✅ PASS - [description]
- Console: ✅ No errors
- Network: ✅ All green
- Browsers tested: Chrome ✅, Firefox ✅
```

### Ví dụ thực tế:
```
TASK: Manual testing Gold Chart bug fix

SETUP:
$ cd frontend
$ npm run dev:all
→ Frontend: http://localhost:3001
→ Backend: http://localhost:5000

TEST SCENARIOS:

1. Bug Scenario - Empty Data:
   Steps:
   a) Navigate to http://localhost:3001/gold
   b) Deselect all gold types
   c) Observe chart area
   
   Expected: Show "Vui lòng chọn loại vàng để xem biểu đồ"
   Actual: ✅ PASS - Empty state displayed correctly

2. Happy Path - Normal Chart Display:
   Steps:
   a) Select SJC_9999 gold type
   b) Select period = "Ngày"
   c) Observe chart renders
   
   Expected: Chart displays with line graph
   Actual: ✅ PASS - Chart renders with data points

3. Edge Case - Multiple Types:
   Steps:
   a) Select SJC_9999, DOJI_24K, XAU_USD
   b) Observe multiple lines on chart
   c) Check legend shows all types
   
   Expected: 3 colored lines, legend with 3 items
   Actual: ✅ PASS - All types displayed correctly

4. Edge Case - Period Changes:
   Steps:
   a) Change period: Ngày → Tuần → Tháng → Năm
   b) Observe X-axis format changes
   c) Check chart title updates
   
   Expected: 
   - Ngày: "Hôm nay", X-axis = HH:mm
   - Tuần: "Tuần này", X-axis = EEE
   - Tháng: "Tháng này", X-axis = dd/MM
   - Năm: "Năm nay", X-axis = dd/MM
   Actual: ✅ PASS - All periods work correctly

5. Edge Case - Fresh Data Fetch:
   Steps:
   a) Click "Cập nhật giá" button
   b) Wait for API call
   c) Observe chart updates
   
   Expected: Loading indicator → New data displayed
   Actual: ✅ PASS - Chart updates with fresh data

BROWSER DEVTOOLS:

Console:
✅ No errors
✅ Debug logs working: [GoldChart] Processed chart data
⚠️ 1 warning (expected): [GoldChart] No records for type: GOLD_14K (old data)

Network:
✅ GET /api/gold/latest - 200 OK (45ms)
✅ GET /api/gold/history?type=SJC_9999&period=day - 200 OK (291ms)
✅ POST /api/gold/fetch - 200 OK (5066ms)

Performance:
✅ Initial load: 917ms
✅ Chart render: <50ms
✅ No lag when changing periods

CROSS-BROWSER TESTING:
✅ Chrome 142.0 - All scenarios pass
✅ Firefox 120.0 - All scenarios pass
⚠️ Safari - Not tested (macOS only)

RESPONSIVE DESIGN:
✅ Desktop (1920x1080) - Perfect
✅ Tablet (768x1024) - Good, chart scales
✅ Mobile (375x667) - Chart still readable

MANUAL TEST SUMMARY:
✅ 5/5 test scenarios passing
✅ No console errors
✅ All API calls successful
✅ Cross-browser compatible
✅ Responsive design works

CONCLUSION: Bug fix verified, feature working as expected! 🎉
```

---

## 📊 BƯỚC 10: UPDATE CHANGELOG & COMMIT

### Prompt Template:
```
TASK: Finalize bug fix với CHANGELOG update và commit

ACTION:

1. Update CHANGELOG.md:
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD
   
   ### 🐛 Bug Fixes
   - **[Feature]**: [BUG_DESCRIPTION] ([#issue])
     - Root cause: [BRIEF_EXPLANATION]
     - Solution: [SOLUTION_SUMMARY]
     - Files changed: [LIST]
     - Tests added: [COUNT] unit + [COUNT] integration
     - Coverage: [BEFORE]% → [AFTER]%
   ```

2. Git commit:
   ```bash
   git add .
   git commit -m "fix: [brief description]
   
   - Fixed [bug] in [component]
   - Root cause: [explanation]
   - Added [X] tests
   - Coverage: [before]% → [after]%
   
   Closes #[issue]"
   ```

3. Create PR (nếu làm việc team):
   - Title: fix: [Brief description]
   - Description: Template below

PR TEMPLATE:
```markdown
## 🐛 Bug Fix: [Title]

### Issue
Closes #[issue-number]

### Root Cause
[Explanation of what caused the bug]

### Solution
[Brief description of how you fixed it]

### Changes
- `[file1]`: [what changed]
- `[file2]`: [what changed]

### Tests
- ✅ [X] unit tests added
- ✅ [X] integration tests added
- ✅ All existing tests passing
- ✅ Manual testing completed

### Coverage
- Before: [X]%
- After: [Y]%

### Screenshots
[If applicable, add before/after screenshots]

### Checklist
- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] Tests added and passing
- [x] No breaking changes
```
```

### Ví dụ thực tế:
```
TASK: Finalize Gold Chart bug fix

1. CHANGELOG.md Update:
   ```markdown
   ## [1.1.0] - 2025-11-13
   
   ### 🐛 Bug Fixes
   - **Gold Prices Chart**: Fixed chart not displaying (#42)
     - Root cause: Missing data validation and field fallbacks in GoldChart component
     - Solution: Added defensive programming with 5 validation layers:
       1. Null/empty data early return
       2. Array.isArray() validation before forEach
       3. time_bucket → period_start fallback
       4. avg_mid_price → mid_price fallback
       5. NaN price value filtering
     - Files changed:
       - frontend/src/features/gold/index.jsx (~110 lines)
       - frontend/tests/unit/GoldChart.test.jsx (new, 19 tests)
       - frontend/tests/integration/goldApi.integration.test.js (new, 20 tests)
       - frontend/vitest.config.js (new)
       - frontend/package.json (test scripts)
     - Tests added: 19 unit + 20 integration (39 total)
     - Coverage: 45% → 85% (+40%)
     - Manual testing: ✅ All scenarios pass
   ```

2. Git Commit:
   ```bash
   git add frontend/src/features/gold/index.jsx \
           frontend/tests/unit/GoldChart.test.jsx \
           frontend/tests/integration/goldApi.integration.test.js \
           frontend/vitest.config.js \
           frontend/vitest.integration.config.js \
           frontend/tests/setup.js \
           frontend/package.json \
           CHANGELOG.md
   
   git commit -m "fix: gold chart not displaying with empty/invalid data
   
   - Fixed GoldChart component crash on null/empty data
   - Root cause: Missing data validation and field fallbacks
   - Added 5 defensive programming validations
   - Added 19 unit tests + 20 integration tests (all passing)
   - Coverage increased: 45% → 85%
   
   Changes:
   - Added null/empty data early return
   - Added Array.isArray() check before forEach
   - Added time_bucket → period_start fallback
   - Added avg_mid_price → mid_price fallback
   - Added NaN price filtering
   - Added debug logging for troubleshooting
   
   Closes #42"
   ```

3. Pull Request:
   ```markdown
   ## 🐛 Bug Fix: Gold Chart Not Displaying
   
   ### Issue
   Closes #42
   
   Gold Prices chart component không hiển thị biểu đồ khi:
   - Data rỗng hoặc null
   - API trả về empty array
   - Missing required fields (time_bucket, avg_mid_price)
   
   ### Root Cause
   GoldChart component thiếu data validation ở nhiều bước:
   1. Không check null/empty data trước khi process
   2. Không validate Array.isArray() trước forEach → crash
   3. Không có fallback cho time_bucket → period_start
   4. Không có fallback cho avg_mid_price → mid_price
   5. Không filter NaN price values
   6. Empty state check SAU khi chart đã crash
   
   ### Solution
   Applied defensive programming với validation layers:
   - Layer 1: Early return cho null/empty data
   - Layer 2: Array validation trước khi iterate
   - Layer 3: Field fallback logic (primary → secondary)
   - Layer 4: Type validation (NaN filtering)
   - Layer 5: Empty state rendering trước chart
   
   ### Changes
   - `frontend/src/features/gold/index.jsx`:
     - Added 6 validation sections (~110 lines modified)
     - Added debug logging (console.log/warn)
     - Added JSDoc documentation
   
   - `frontend/tests/unit/GoldChart.test.jsx` (NEW):
     - 19 unit tests covering all validations
     - Tests for loading, empty data, fallbacks, edge cases
   
   - `frontend/tests/integration/goldApi.integration.test.js` (NEW):
     - 20 integration tests for API endpoints
     - Tests for /latest, /history, /fetch endpoints
     - Bug fix verification tests
   
   - `frontend/vitest.config.js` (NEW):
     - Vitest configuration for unit tests
   
   - `frontend/package.json`:
     - Added test:unit, test:integration scripts
     - Added vitest, @testing-library dependencies
   
   ### Tests
   - ✅ 19 unit tests added (all passing)
   - ✅ 20 integration tests added (all passing)
   - ✅ All existing E2E tests still passing (no regression)
   - ✅ Manual testing completed in Chrome & Firefox
   
   **Test Coverage:**
   ```
   Unit Tests: 19/19 passing (6.78s)
   - Loading states
   - Empty data handling
   - Time field fallbacks
   - Price field fallbacks
   - Edge cases
   
   Integration Tests: 20/20 passing (10.77s)
   - GET /api/gold/history
   - GET /api/gold/latest
   - POST /api/gold/fetch
   - Bug fix verification
   ```
   
   ### Coverage
   - Before: 45%
   - After: 85%
   - Increase: +40%
   
   ### Screenshots
   **Before (Bug):**
   ![image](https://user-images.../before.png)
   _Chart không hiển thị, chỉ có title_
   
   **After (Fixed):**
   ![image](https://user-images.../after.png)
   _Chart hiển thị đầy đủ với line graph_
   
   **Empty State:**
   ![image](https://user-images.../empty.png)
   _Empty state message khi chưa chọn loại vàng_
   
   ### Manual Test Scenarios
   ✅ Empty data → Shows empty state message
   ✅ Valid data → Chart displays correctly
   ✅ Multiple types → All lines render
   ✅ Period changes → X-axis format updates
   ✅ Fresh fetch → Chart updates with new data
   
   ### Browser Compatibility
   ✅ Chrome 142.0
   ✅ Firefox 120.0
   ⚠️ Safari (not tested, no macOS environment)
   
   ### Performance
   - Initial load: 917ms
   - Chart render: <50ms
   - No lag when changing periods
   
   ### Checklist
   - [x] Code follows project style guidelines
   - [x] Self-review completed
   - [x] JSDoc comments added for complex logic
   - [x] CHANGELOG.md updated
   - [x] specs/specs/06_gold_prices_tool.spec updated
   - [x] Unit tests added and passing (19/19)
   - [x] Integration tests added and passing (20/20)
   - [x] Manual testing completed
   - [x] No breaking changes
   - [x] No console errors in browser
   - [x] Responsive design verified
   ```

COMMIT SHA: abc123def456
PR #: 43
STATUS: ✅ Ready for review
```

---

## 📋 QUICK REFERENCE CHECKLIST

```
BUG FIX WORKFLOW CHECKLIST:

□ Step 1: Đọc Specs
  □ specs/specs/[feature].spec
  □ specs/plans/[feature].plan
  □ Expected vs Actual behavior

□ Step 2: Reproduce Bug
  □ Database check
  □ API test
  □ Frontend test
  □ Browser DevTools

□ Step 3: Phân Tích Root Cause
  □ Read source code
  □ Trace data flow
  □ Identify missing validations
  □ List edge cases

□ Step 4: Fix Bug
  □ Apply defensive programming
  □ Add validations
  □ Add error handling
  □ Add debug logging

□ Step 5: Update Documentation
  □ CHANGELOG.md
  □ Code comments (JSDoc)
  □ Specs implementation notes
  □ README (if needed)

□ Step 6: Unit Tests
  □ Test bug scenarios
  □ Test edge cases
  □ Test happy path
  □ Coverage >= 80%

□ Step 7: Integration Tests
  □ API endpoints
  □ Data flow
  □ Bug fix verification

□ Step 8: Run All Tests
  □ npm run test:unit
  □ npm run test:integration
  □ npm run test:e2e
  □ No regression

□ Step 9: Manual Testing
  □ Start dev servers
  □ Test bug scenario
  □ Test happy path
  □ Check console
  □ Check network
  □ Cross-browser

□ Step 10: Finalize
  □ Update CHANGELOG
  □ Git commit
  □ Create PR
  □ Request review

DONE! ✅
```

---

## 🎓 BEST PRACTICES

### 1. Defensive Programming
```javascript
// ❌ BAD: Trust external data
function processData(data) {
  data.forEach(item => {
    const price = parseFloat(item.price)
    results.push(price)
  })
}

// ✅ GOOD: Validate everything
function processData(data) {
  // Early return for invalid input
  if (!data || !Array.isArray(data)) {
    console.warn('[processData] Invalid data:', data)
    return []
  }
  
  const results = []
  data.forEach(item => {
    // Validate item structure
    if (!item || typeof item !== 'object') {
      console.warn('[processData] Invalid item:', item)
      return
    }
    
    // Validate price field
    const price = parseFloat(item.price)
    if (isNaN(price)) {
      console.warn('[processData] Invalid price:', item.price)
      return
    }
    
    results.push(price)
  })
  
  return results
}
```

### 2. Meaningful Error Messages
```javascript
// ❌ BAD: Generic error
console.warn('No data')

// ✅ GOOD: Specific and actionable
console.warn('[GoldChart] Missing time_bucket and period_start fields:', {
  record,
  type,
  timestamp: record.fetched_at
})
```

### 3. Test Names
```javascript
// ❌ BAD: Vague test name
it('should work', () => { /* ... */ })

// ✅ GOOD: Descriptive test name
it('should fallback to period_start when time_bucket is missing', () => { /* ... */ })
```

### 4. Debug Logging
```javascript
// ✅ GOOD: Log summary, not full objects
console.log('[ComponentName] Processing data:', {
  inputKeys: Object.keys(data),
  outputLength: results.length,
  selectedTypes,
  timestamp: Date.now()
})

// ❌ BAD: Log massive objects
console.log(data) // Don't do this in production
```

### 5. Commit Messages
```
# ❌ BAD
git commit -m "fix bug"

# ✅ GOOD
git commit -m "fix: gold chart not displaying with empty data

- Added null/empty data validation
- Added time_bucket → period_start fallback
- Added 19 unit tests + 20 integration tests
- Coverage: 45% → 85%

Closes #42"
```

---

## ⏱️ ESTIMATED TIME

```
Bug Fix Process Timeline:
├─ Step 1: Đọc Specs          → 15-30 min
├─ Step 2: Reproduce Bug       → 30-60 min
├─ Step 3: Phân Tích           → 30-45 min
├─ Step 4: Fix Bug             → 60-120 min
├─ Step 5: Update Docs         → 15-30 min
├─ Step 6: Unit Tests          → 60-90 min
├─ Step 7: Integration Tests   → 30-60 min
├─ Step 8: Run All Tests       → 10-20 min
├─ Step 9: Manual Testing      → 30-45 min
└─ Step 10: Finalize           → 15-30 min

TOTAL: 4-7 hours (simple bug)
       8-16 hours (complex bug)
```

---

**VERSION:** 1.0.0
**CREATED:** 2025-11-13
**AUTHOR:** KaDongSite Team
**STATUS:** ✅ Production Ready
