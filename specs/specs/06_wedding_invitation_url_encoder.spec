# Wedding Invitation URL Encoder

**Spec ID:** `06_wedding_invitation_url_encoder`  
**Version:** 1.0.0  
**Status:** 📝 Draft  
**Created:** 2025-11-12  
**Last Updated:** 2025-11-12

---

## 📋 Overview

**Title:** Wedding Invitation URL Encoder Tool  
**Type:** Feature  
**Priority:** 🟡 Medium

**Purpose:**  
Tạo công cụ encode tên khách mời tiếng Việt có dấu thành URL parameters an toàn cho thiệp cưới online, hỗ trợ nhập nhiều tên cùng lúc và tự động tạo danh sách link thiệp cá nhân hóa.

**Problem Statement:**  
- Thiệp cưới online cần URL có tham số `?name=` chứa tên khách mời
- Tên tiếng Việt có dấu cần được encode đúng format URL (UTF-8 percent encoding)
- Cần gửi link cá nhân cho nhiều khách mời (hàng chục đến hàng trăm người)
- Việc encode thủ công từng tên tốn thời gian và dễ sai

**Example:**
- Input: `Bà Ngoại + Cậu Năm`
- Output: `https://invitations.jmiiwedding.com/longnhiwedding?name=B%C3%A0+Ngo%E1%BA%A1i+%2B+C%E1%BA%ADu+N%C3%A0m`

---

## 🎯 Goals

### 1. Primary Goal
- Encode danh sách tên khách mời tiếng Việt có dấu thành URL parameters chuẩn UTF-8
- Tự động tạo danh sách link thiệp cá nhân cho từng khách/nhóm khách
- Lưu trữ base URL thiệp cưới để tái sử dụng cho các lần sau

### 2. Secondary Goals
- Hỗ trợ import danh sách khách từ file Excel/TXT
- Hỗ trợ multiple separators (`,` `;` xuống dòng)
- Copy toàn bộ danh sách link với 1 click
- Preview link trước khi export

### 3. Non-Goals
- Không quản lý RSVP (guest responses)
- Không gửi email/SMS tự động
- Không tạo thiệp cưới (chỉ encode URL)
- Không quản lý guest list (chỉ encode tên)

---

## ✅ Acceptance Criteria

### Must Have (Required)

#### F1: Base URL Management
- [ ] **F1.1:** Input field để nhập base URL thiệp cưới (e.g., `https://invitations.jmiiwedding.com/longnhiwedding`)
- [ ] **F1.2:** Validate URL format (phải bắt đầu bằng `http://` hoặc `https://`)
- [ ] **F1.3:** Lưu base URL vào database `wedding_urls` table khi user nhập
- [ ] **F1.4:** Auto-load base URL từ lần cuối cùng khi user quay lại
- [ ] **F1.5:** Hiển thị timestamp "Last updated: YYYY-MM-DD HH:mm:ss"

#### F2: Guest Name Input (Text)
- [ ] **F2.1:** Textarea cho phép nhập danh sách tên khách mời
- [ ] **F2.2:** Hỗ trợ multiple separators: dấu phay (`,`), chấm phẩy (`;`), xuống dòng (`\n`)
- [ ] **F2.3:** Auto-detect separator và split names correctly
- [ ] **F2.4:** Trim whitespace từng tên trước khi encode
- [ ] **F2.5:** Placeholder text: "Nhập danh sách khách mời (phân cách bằng dấu phẩy, chấm phẩy hoặc xuống dòng)"

#### F3: Guest Name Input (File Upload)
- [ ] **F3.1:** File upload input chấp nhận `.txt`, `.csv`, `.xlsx`
- [ ] **F3.2:** Parse `.txt` file (mỗi dòng = 1 tên)
- [ ] **F3.3:** Parse `.csv` file (column đầu tiên = tên)
- [ ] **F3.4:** Parse `.xlsx` file (sheet đầu tiên, column A = tên)
- [ ] **F3.5:** Validate max file size: 2MB
- [ ] **F3.6:** Hiển thị số lượng tên đọc được: "Đã đọc 25 tên từ file"

#### F4: UTF-8 URL Encoding
- [ ] **F4.1:** Encode tiếng Việt có dấu sang percent encoding chuẩn UTF-8
- [ ] **F4.2:** Xử lý đúng các ký tự đặc biệt: `à á â ã è é ê ì í ò ó ô õ ù ú ư ý ă ạ ả ấ ầ ẩ ẫ ậ ắ ằ ẳ ẵ ặ đ ẹ ẻ ẽ ế ề ể ễ ệ ỉ ị ọ ỏ ố ồ ổ ỗ ộ ớ ờ ở ỡ ợ ụ ủ ứ ừ ử ữ ự ỳ ỵ ỷ ỹ`
- [ ] **F4.3:** Encode khoảng trắng thành `+` hoặc `%20`
- [ ] **F4.4:** Encode ký tự đặc biệt khác: `+ & ? # / : =`
- [ ] **F4.5:** Sử dụng `encodeURIComponent()` JavaScript built-in function

#### F5: Output Generation
- [ ] **F5.1:** Tạo danh sách URLs với format: `{base_url}?name={encoded_name}`
- [ ] **F5.2:** Hiển thị từng URL trong list dạng clickable links
- [ ] **F5.3:** Hiển thị tên gốc bên cạnh URL: `[Tên Khách] → [URL]`
- [ ] **F5.4:** Tổng số links tạo được: "Đã tạo 25 links"
- [ ] **F5.5:** Preview URL khi hover (tooltip)

#### F6: Copy to Clipboard
- [ ] **F6.1:** Button "Copy tất cả" để copy toàn bộ danh sách links
- [ ] **F6.2:** Button "Copy" riêng cho từng link
- [ ] **F6.3:** Toast notification khi copy thành công
- [ ] **F6.4:** Format khi copy toàn bộ: mỗi link một dòng

#### F7: Data Validation
- [ ] **F7.1:** Validate base URL không được rỗng
- [ ] **F7.2:** Validate ít nhất 1 tên khách được nhập
- [ ] **F7.3:** Validate tên không chứa toàn khoảng trắng
- [ ] **F7.4:** Loại bỏ duplicate names (case-insensitive)
- [ ] **F7.5:** Warning nếu tên quá dài (> 100 ký tự)

#### D1: Database Persistence
- [ ] **D1.1:** Lưu base URL vào database khi user nhập mới
- [ ] **D1.2:** Update base URL nếu user thay đổi
- [ ] **D1.3:** Soft delete: không xóa hẳn URL cũ (dùng `deleted_at`)
- [ ] **D1.4:** Chỉ giữ 1 active URL mới nhất cho mỗi user

### Should Have (Important)

#### S1: Export Features
- [ ] **S1.1:** Export danh sách links ra file `.txt`
- [ ] **S1.2:** Export ra file `.csv` với columns: `Name, URL`
- [ ] **S1.3:** Download file với tên: `wedding-invitation-links-YYYY-MM-DD.txt`

#### S2: Template Suggestions
- [ ] **S2.1:** Dropdown gợi ý popular wedding invitation platforms
  - JMii Wedding: `https://invitations.jmiiwedding.com/{your-event}`
  - Marry Wedding: `https://www.marrywedding.vn/invitation/{your-event}`
  - The Wedding: `https://thewedding.vn/{your-event}`
- [ ] **S2.2:** Auto-fill base URL khi chọn template

#### S3: Name Preview
- [ ] **S3.1:** Preview decoded name từ URL khi hover
- [ ] **S3.2:** Validation preview: hiển thị tên sẽ decode đúng không

#### S4: Bulk Actions
- [ ] **S4.1:** "Clear all" button để xóa danh sách khách
- [ ] **S4.2:** "Reset base URL" button để xóa URL đã lưu
- [ ] **S4.3:** Confirmation dialog trước khi clear data

### Nice to Have (Optional)

#### N1: History
- [ ] **N1.1:** Lưu lịch sử các base URLs đã sử dụng
- [ ] **N1.2:** Quick select từ history (max 5 recent URLs)

#### N2: QR Code Generation
- [ ] **N2.1:** Tạo QR code cho từng link
- [ ] **N2.2:** Download QR code dạng PNG

#### N3: URL Shortener
- [ ] **N3.1:** Tích hợp bit.ly hoặc tinyurl để rút gọn link
- [ ] **N3.2:** Option để enable/disable shortening

### Test Cases
- [ ] Unit test: UTF-8 encoding function với 20 test cases (all Vietnamese characters)
- [ ] Unit test: Name parser với separators `,` `;` `\n`
- [ ] Unit test: File parser cho `.txt`, `.csv`, `.xlsx`
- [ ] Integration test: POST /api/wedding-urls (create/update)
- [ ] Integration test: GET /api/wedding-urls/latest
- [ ] E2E test: User nhập base URL → nhập danh sách tên → copy links
- [ ] E2E test: User upload Excel file → verify names parsed correctly

---

## 🏗️ Technical Design

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     WeddingInvitationTool.jsx                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 1. BaseUrlInput (input + save button)                   ││
│  │ 2. GuestNameInput (textarea + file upload)              ││
│  │ 3. EncodedUrlList (clickable links + copy buttons)      ││
│  │ 4. BulkActions (copy all, export, clear)                ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           ↓ API Calls ↓
┌─────────────────────────────────────────────────────────────┐
│             Backend Routes: /api/wedding-urls                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ POST /api/wedding-urls      → Create/Update base URL    ││
│  │ GET /api/wedding-urls/latest → Get latest URL           ││
│  │ DELETE /api/wedding-urls/:id → Soft delete URL          ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                           ↓ Database ↓
┌─────────────────────────────────────────────────────────────┐
│          PostgreSQL Table: wedding_urls                      │
│  id, user_id, base_url, created_at, updated_at, deleted_at  │
└─────────────────────────────────────────────────────────────┘
```

### Components

#### 1. WeddingInvitationTool.jsx (Main Page)
**Purpose:** Main container cho Wedding Invitation URL Encoder tool  
**Location:** `frontend/src/pages/WeddingInvitationTool.jsx`  
**State Management:**
```javascript
const [baseUrl, setBaseUrl] = useState('')
const [guestNames, setGuestNames] = useState([]) // Array of strings
const [encodedUrls, setEncodedUrls] = useState([]) // Array of {name, url}
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
```

#### 2. BaseUrlInput.jsx (Component)
**Purpose:** Input field + validation cho base URL  
**Location:** `frontend/src/components/wedding/BaseUrlInput.jsx`  
**Props:**
```javascript
interface BaseUrlInputProps {
  value: string
  onChange: (url: string) => void
  onSave: (url: string) => Promise<void>
  lastUpdated: string | null
}
```

#### 3. GuestNameInput.jsx (Component)
**Purpose:** Textarea + file upload cho danh sách khách mời  
**Location:** `frontend/src/components/wedding/GuestNameInput.jsx`  
**Props:**
```javascript
interface GuestNameInputProps {
  names: string[]
  onChange: (names: string[]) => void
  onFileUpload: (file: File) => Promise<string[]>
}
```

#### 4. EncodedUrlList.jsx (Component)
**Purpose:** Hiển thị danh sách URLs đã encode  
**Location:** `frontend/src/components/wedding/EncodedUrlList.jsx`  
**Props:**
```javascript
interface EncodedUrlListProps {
  urls: Array<{ name: string, url: string }>
  onCopyOne: (url: string) => void
  onCopyAll: () => void
}
```

#### 5. weddingService.js (API Service)
**Purpose:** API calls cho wedding URLs  
**Location:** `frontend/src/services/weddingService.js`  
**Functions:**
```javascript
export const saveWeddingUrl = async (baseUrl) => {
  // POST /api/wedding-urls
}

export const getLatestWeddingUrl = async () => {
  // GET /api/wedding-urls/latest
}

export const deleteWeddingUrl = async (id) => {
  // DELETE /api/wedding-urls/:id
}
```

#### 6. urlEncoder.js (Utility)
**Purpose:** UTF-8 URL encoding functions  
**Location:** `frontend/src/utils/urlEncoder.js`  
**Functions:**
```javascript
// Encode Vietnamese text to URL-safe format
export const encodeVietnameseName = (name) => {
  return encodeURIComponent(name.trim())
}

// Generate invitation URL
export const generateInvitationUrl = (baseUrl, guestName) => {
  const encoded = encodeVietnameseName(guestName)
  return `${baseUrl}?name=${encoded}`
}

// Parse guest names from text (support multiple separators)
export const parseGuestNames = (text) => {
  return text
    .split(/[,;\n]+/) // Split by comma, semicolon, or newline
    .map(name => name.trim())
    .filter(name => name.length > 0)
}

// Remove duplicates (case-insensitive)
export const removeDuplicateNames = (names) => {
  const seen = new Set()
  return names.filter(name => {
    const lower = name.toLowerCase()
    if (seen.has(lower)) return false
    seen.add(lower)
    return true
  })
}
```

#### 7. fileParser.js (Utility)
**Purpose:** Parse `.txt`, `.csv`, `.xlsx` files  
**Location:** `frontend/src/utils/fileParser.js`  
**Dependencies:** `xlsx` package (for Excel parsing)  
**Functions:**
```javascript
import * as XLSX from 'xlsx'

export const parseTextFile = async (file) => {
  const text = await file.text()
  return text.split('\n').map(line => line.trim()).filter(Boolean)
}

export const parseCsvFile = async (file) => {
  const text = await file.text()
  const lines = text.split('\n')
  return lines.map(line => line.split(',')[0].trim()).filter(Boolean)
}

export const parseExcelFile = async (file) => {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
  return data.map(row => row[0]).filter(Boolean)
}
```

### Database Changes

#### New Table: wedding_urls
```sql
CREATE TABLE wedding_urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  base_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_wedding_urls_user_id ON wedding_urls(user_id);
CREATE INDEX idx_wedding_urls_deleted_at ON wedding_urls(deleted_at);
```

**Constraints:**
- `base_url`: Max 500 characters (URLs can be long)
- `user_id`: Foreign key to `users` table (track who created URL)
- Soft delete pattern: `deleted_at` column

**Seed Data:**
```sql
-- No seed data (user-generated content)
```

### API Endpoints

#### POST /api/wedding-urls
**Purpose:** Create hoặc update base URL mới  
**Auth Required:** Yes (JWT token)  
**Request Body:**
```json
{
  "baseUrl": "https://invitations.jmiiwedding.com/longnhiwedding"
}
```

**Validation:**
- `baseUrl` required, not empty
- `baseUrl` must start with `http://` or `https://`
- `baseUrl` max length 500 characters

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "base_url": "https://invitations.jmiiwedding.com/longnhiwedding",
    "created_at": "2025-11-12T10:00:00.000Z"
  }
}
```

**Business Logic:**
- Soft delete previous active URL (set `deleted_at = NOW()`)
- Insert new URL record
- Return newly created record

#### GET /api/wedding-urls/latest
**Purpose:** Get base URL mới nhất của user  
**Auth Required:** Yes  
**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "base_url": "https://invitations.jmiiwedding.com/longnhiwedding",
    "created_at": "2025-11-12T10:00:00.000Z"
  }
}
```

**Response (404 Not Found) - No URL saved:**
```json
{
  "success": false,
  "error": {
    "code": "URL_NOT_FOUND",
    "message": "No wedding invitation URL found. Please add one."
  }
}
```

**SQL Query:**
```sql
SELECT id, base_url, created_at
FROM wedding_urls
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1
```

#### DELETE /api/wedding-urls/:id
**Purpose:** Soft delete wedding URL  
**Auth Required:** Yes  
**URL Parameters:** `id` (UUID)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Wedding invitation URL deleted successfully"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "URL_NOT_FOUND",
    "message": "Wedding invitation URL not found"
  }
}
```

**SQL Query:**
```sql
UPDATE wedding_urls
SET deleted_at = NOW(), updated_at = NOW()
WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
```

---

## 🔄 Data Flow

### Flow 1: User saves base URL
1. User nhập base URL vào `BaseUrlInput` component
2. User click "Lưu" button
3. Frontend validate URL format (regex: `^https?://`)
4. Frontend gọi `weddingService.saveWeddingUrl(baseUrl)`
5. Backend validate input
6. Backend soft delete previous active URL (`UPDATE deleted_at = NOW()`)
7. Backend insert new URL record
8. Backend trả về URL record mới
9. Frontend update state `baseUrl` và hiển thị "Saved" toast
10. Frontend hiển thị timestamp "Last updated: ..."

### Flow 2: User inputs guest names (text)
1. User nhập danh sách tên vào textarea (separated by `,` `;` or newline)
2. User click "Tạo Links" button
3. Frontend gọi `parseGuestNames(text)` để split names
4. Frontend gọi `removeDuplicateNames(names)` để loại bỏ trùng
5. Frontend validate: baseUrl not empty, names.length > 0
6. Frontend loop qua từng name:
   - Call `generateInvitationUrl(baseUrl, name)`
   - Store result in `encodedUrls` array
7. Frontend render `EncodedUrlList` component với danh sách URLs
8. User có thể copy từng link hoặc copy all

### Flow 3: User uploads file (Excel/TXT)
1. User click file upload input
2. User chọn file `.txt`, `.csv`, or `.xlsx`
3. Frontend validate file size < 2MB
4. Frontend detect file type by extension
5. Frontend gọi appropriate parser:
   - `.txt` → `parseTextFile(file)`
   - `.csv` → `parseCsvFile(file)`
   - `.xlsx` → `parseExcelFile(file)`
6. Parser trả về array of names
7. Frontend hiển thị "Đã đọc X tên từ file"
8. **Continue to Flow 2 step 3** (same process)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant D as Database

    U->>F: Nhập base URL
    F->>F: Validate URL format
    F->>A: POST /api/wedding-urls
    A->>D: Soft delete old URL
    A->>D: INSERT new URL
    D-->>A: Return new record
    A-->>F: { success: true, data: {...} }
    F-->>U: Toast "Đã lưu URL"

    U->>F: Nhập danh sách tên (textarea)
    F->>F: parseGuestNames(text)
    F->>F: removeDuplicateNames()
    F->>F: Loop: generateInvitationUrl()
    F-->>U: Hiển thị danh sách encoded URLs

    U->>F: Click "Copy All"
    F->>F: navigator.clipboard.writeText()
    F-->>U: Toast "Đã copy 25 links"
```

---

## 🔐 Security Considerations

### S1: Input Validation
- [x] **S1.1:** Validate base URL format (must start with `http://` or `https://`)
- [x] **S1.2:** Validate base URL max length (500 characters) để tránh database overflow
- [x] **S1.3:** Sanitize tên khách mời (trim whitespace, remove null bytes)
- [x] **S1.4:** Validate file size < 2MB để tránh DOS attack
- [x] **S1.5:** Validate file extension (only `.txt`, `.csv`, `.xlsx`)

### S2: SQL Injection Prevention
- [x] **S2.1:** Sử dụng parameterized queries: `$1, $2, $3`
- [x] **S2.2:** KHÔNG concatenate user input vào SQL string
- [x] **S2.3:** Example:
  ```javascript
  // ✅ GOOD
  const query = 'SELECT * FROM wedding_urls WHERE user_id = $1 AND deleted_at IS NULL'
  const result = await pool.query(query, [userId])
  
  // ❌ BAD
  const query = `SELECT * FROM wedding_urls WHERE user_id = '${userId}'`
  ```

### S3: XSS Prevention
- [x] **S3.1:** React auto-escapes output (safe by default)
- [x] **S3.2:** KHÔNG dùng `dangerouslySetInnerHTML`
- [x] **S3.3:** URLs displayed as text, not executed as scripts

### S4: Authentication
- [x] **S4.1:** Tất cả API endpoints require JWT authentication
- [x] **S4.2:** Middleware `authenticateToken` check Bearer token
- [x] **S4.3:** User chỉ access được URLs của chính mình (`WHERE user_id = $1`)

### S5: Rate Limiting
- [x] **S5.1:** Apply rate limit cho POST /api/wedding-urls (max 10 requests/hour)
- [x] **S5.2:** Tránh spam tạo URLs
- [x] **S5.3:** Use Express rate limiter middleware

### S6: File Upload Security
- [x] **S6.1:** Validate MIME type (text/plain, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
- [x] **S6.2:** Scan file content for malicious patterns (optional)
- [x] **S6.3:** Parse file in isolated context (không execute code)
- [x] **S6.4:** Max file size: 2MB

---

## 📊 Performance Requirements

### Response Time
- API response (POST /api/wedding-urls): < 200ms
- API response (GET /api/wedding-urls/latest): < 100ms
- File parsing (.txt 1000 lines): < 500ms
- File parsing (.xlsx 1000 rows): < 2 seconds
- URL encoding (100 names): < 100ms (client-side)

### Scalability
- Support 1000+ names in single batch (textarea or file)
- Database: Index on `user_id` và `deleted_at` cho performance
- Frontend: Virtualized list nếu > 500 URLs (use `react-window`)

### Caching
- No caching needed (URLs generated real-time client-side)
- Database caching: PostgreSQL query cache automatic

### Limitations
- Max guest names per batch: 1000 (soft limit, warning shown)
- Max base URL length: 500 characters
- Max guest name length: 100 characters (warning shown)
- Max file size: 2MB

---

## 🧪 Testing Strategy

### Unit Tests

#### urlEncoder.test.js
```javascript
describe('encodeVietnameseName', () => {
  it('should encode Vietnamese characters with diacritics', () => {
    expect(encodeVietnameseName('Bà Ngoại')).toBe('B%C3%A0%20Ngo%E1%BA%A1i')
  })
  
  it('should encode special characters', () => {
    expect(encodeVietnameseName('Cậu Năm + Dì')).toBe('C%E1%BA%ADu%20N%C4%83m%20%2B%20D%C3%AC')
  })
  
  it('should trim whitespace', () => {
    expect(encodeVietnameseName('  John Doe  ')).toBe('John%20Doe')
  })
  
  it('should handle empty string', () => {
    expect(encodeVietnameseName('')).toBe('')
  })
})

describe('parseGuestNames', () => {
  it('should parse comma-separated names', () => {
    const text = 'John, Jane, Bob'
    expect(parseGuestNames(text)).toEqual(['John', 'Jane', 'Bob'])
  })
  
  it('should parse semicolon-separated names', () => {
    const text = 'John; Jane; Bob'
    expect(parseGuestNames(text)).toEqual(['John', 'Jane', 'Bob'])
  })
  
  it('should parse newline-separated names', () => {
    const text = 'John\nJane\nBob'
    expect(parseGuestNames(text)).toEqual(['John', 'Jane', 'Bob'])
  })
  
  it('should handle mixed separators', () => {
    const text = 'John, Jane; Bob\nAlice'
    expect(parseGuestNames(text)).toEqual(['John', 'Jane', 'Bob', 'Alice'])
  })
})

describe('removeDuplicateNames', () => {
  it('should remove case-insensitive duplicates', () => {
    const names = ['John', 'jane', 'JOHN', 'Jane', 'Bob']
    expect(removeDuplicateNames(names)).toEqual(['John', 'jane', 'Bob'])
  })
})
```

#### fileParser.test.js
```javascript
describe('parseTextFile', () => {
  it('should parse text file with newline-separated names', async () => {
    const blob = new Blob(['John\nJane\nBob'], { type: 'text/plain' })
    const file = new File([blob], 'guests.txt')
    const names = await parseTextFile(file)
    expect(names).toEqual(['John', 'Jane', 'Bob'])
  })
})

describe('parseCsvFile', () => {
  it('should parse CSV file and extract first column', async () => {
    const csv = 'Name,Phone\nJohn,123\nJane,456'
    const blob = new Blob([csv], { type: 'text/csv' })
    const file = new File([blob], 'guests.csv')
    const names = await parseCsvFile(file)
    expect(names).toEqual(['Name', 'John', 'Jane'])
  })
})

describe('parseExcelFile', () => {
  it('should parse Excel file and extract first column', async () => {
    // Mock XLSX data
    const names = await parseExcelFile(mockExcelFile)
    expect(names).toEqual(['John', 'Jane', 'Bob'])
  })
})
```

### Integration Tests

#### wedding-urls.test.js
```javascript
const request = require('supertest')
const app = require('../app')
const pool = require('../config/database')

describe('Wedding URL API Endpoints', () => {
  let token
  let userId
  
  beforeAll(async () => {
    // Setup test user and get JWT token
    token = 'mock-jwt-token'
    userId = 'test-user-uuid'
  })
  
  describe('POST /api/wedding-urls', () => {
    it('should create new wedding URL', async () => {
      const res = await request(app)
        .post('/api/wedding-urls')
        .set('Authorization', `Bearer ${token}`)
        .send({ baseUrl: 'https://example.com/wedding' })
      
      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.base_url).toBe('https://example.com/wedding')
    })
    
    it('should reject invalid URL format', async () => {
      const res = await request(app)
        .post('/api/wedding-urls')
        .set('Authorization', `Bearer ${token}`)
        .send({ baseUrl: 'not-a-url' })
      
      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
    })
    
    it('should soft delete old URL when creating new one', async () => {
      // Create first URL
      await request(app)
        .post('/api/wedding-urls')
        .set('Authorization', `Bearer ${token}`)
        .send({ baseUrl: 'https://example.com/wedding1' })
      
      // Create second URL
      await request(app)
        .post('/api/wedding-urls')
        .set('Authorization', `Bearer ${token}`)
        .send({ baseUrl: 'https://example.com/wedding2' })
      
      // Verify old URL is soft deleted
      const result = await pool.query(
        'SELECT deleted_at FROM wedding_urls WHERE base_url = $1',
        ['https://example.com/wedding1']
      )
      expect(result.rows[0].deleted_at).not.toBeNull()
    })
  })
  
  describe('GET /api/wedding-urls/latest', () => {
    it('should return latest active URL', async () => {
      const res = await request(app)
        .get('/api/wedding-urls/latest')
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.base_url).toBeDefined()
    })
    
    it('should return 404 if no URL found', async () => {
      // Delete all URLs first
      await pool.query('UPDATE wedding_urls SET deleted_at = NOW()')
      
      const res = await request(app)
        .get('/api/wedding-urls/latest')
        .set('Authorization', `Bearer ${token}`)
      
      expect(res.status).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })
})
```

### E2E Tests (Playwright)

#### wedding-invitation.cy.js
```javascript
describe('Wedding Invitation URL Encoder Tool', () => {
  beforeEach(() => {
    cy.login() // Custom command to login
    cy.visit('/wedding-invitation')
  })
  
  it('should save base URL and persist on reload', () => {
    const baseUrl = 'https://invitations.jmiiwedding.com/longnhiwedding'
    
    cy.get('[data-testid="base-url-input"]').type(baseUrl)
    cy.get('[data-testid="save-url-btn"]').click()
    cy.contains('Đã lưu URL').should('be.visible')
    
    // Reload page
    cy.reload()
    
    // Verify URL persisted
    cy.get('[data-testid="base-url-input"]').should('have.value', baseUrl)
  })
  
  it('should generate invitation URLs from textarea input', () => {
    const baseUrl = 'https://example.com/wedding'
    const guests = 'Bà Ngoại + Cậu Năm, GD Em Phong Vân, GĐ Em Sang Bình'
    
    cy.get('[data-testid="base-url-input"]').type(baseUrl)
    cy.get('[data-testid="save-url-btn"]').click()
    
    cy.get('[data-testid="guest-names-textarea"]').type(guests)
    cy.get('[data-testid="generate-links-btn"]').click()
    
    // Verify 3 links generated
    cy.get('[data-testid="encoded-url-item"]').should('have.length', 3)
    
    // Verify first link contains encoded Vietnamese
    cy.get('[data-testid="encoded-url-item"]').first()
      .should('contain', 'B%C3%A0+Ngo%E1%BA%A1i')
  })
  
  it('should copy all links to clipboard', () => {
    const baseUrl = 'https://example.com/wedding'
    const guests = 'John, Jane, Bob'
    
    cy.get('[data-testid="base-url-input"]').type(baseUrl)
    cy.get('[data-testid="save-url-btn"]').click()
    cy.get('[data-testid="guest-names-textarea"]').type(guests)
    cy.get('[data-testid="generate-links-btn"]').click()
    
    cy.get('[data-testid="copy-all-btn"]').click()
    cy.contains('Đã copy').should('be.visible')
    
    // Verify clipboard content (requires cypress-real-events plugin)
    cy.window().then(win => {
      win.navigator.clipboard.readText().then(text => {
        expect(text).to.contain('https://example.com/wedding?name=John')
        expect(text).to.contain('https://example.com/wedding?name=Jane')
        expect(text).to.contain('https://example.com/wedding?name=Bob')
      })
    })
  })
  
  it('should upload Excel file and generate links', () => {
    const baseUrl = 'https://example.com/wedding'
    
    cy.get('[data-testid="base-url-input"]').type(baseUrl)
    cy.get('[data-testid="save-url-btn"]').click()
    
    // Upload fixture file
    cy.get('[data-testid="file-upload-input"]').attachFile('guests.xlsx')
    
    // Wait for parsing
    cy.contains('Đã đọc', { timeout: 5000 }).should('be.visible')
    
    // Generate links
    cy.get('[data-testid="generate-links-btn"]').click()
    
    // Verify links generated
    cy.get('[data-testid="encoded-url-item"]').should('have.length.greaterThan', 0)
  })
})
```

**Coverage Target:** 85%

---

## 📝 Implementation Notes

### Technical Decisions

#### Decision 1: URL Encoding Strategy
**Context:** Cần encode tiếng Việt có dấu thành URL-safe format  
**Options Considered:**
1. Manual encoding (replace à → %C3%A0 manually)
2. `encodeURI()` - Encodes full URL
3. `encodeURIComponent()` - Encodes component only

**Decision:** Option 3 - `encodeURIComponent()`  
**Reasoning:**
- Built-in JavaScript function, well-tested
- Encodes tất cả ký tự đặc biệt (including `,` `;` `+` `&`)
- Chuẩn UTF-8 percent encoding
- Không cần maintain custom encoding table

**Trade-offs:**
- Encodes tất cả, kể cả `/` (nhưng đây là điều tốt cho query params)

#### Decision 2: File Parsing Library
**Context:** Cần parse `.xlsx` Excel files  
**Options Considered:**
1. `xlsx` package (SheetJS) - 30MB unpacked, full-featured
2. `exceljs` - 10MB, modern API
3. `node-xlsx` - 5MB, simpler

**Decision:** Option 1 - `xlsx` (SheetJS)  
**Reasoning:**
- Most popular (100M+ downloads/month)
- Best browser support (client-side parsing)
- Handles complex Excel files
- MIT license

**Trade-offs:**
- Large bundle size (30MB) nhưng chấp nhận được vì feature quan trọng

#### Decision 3: Database Schema - One URL Per User
**Context:** Có nên lưu multiple URLs cho 1 user?  
**Options Considered:**
1. Multiple URLs - User có thể có nhiều event URLs
2. Single URL - Chỉ giữ 1 URL mới nhất

**Decision:** Option 2 - Single URL (soft delete old ones)  
**Reasoning:**
- User thường chỉ có 1 event active tại 1 thời điểm
- Đơn giản hóa UX (không cần dropdown select URL)
- Vẫn có history (soft delete) nếu cần restore

**Trade-offs:**
- Nếu user có nhiều events, phải switch base URL mỗi lần

#### Decision 4: Client-side vs Server-side Encoding
**Context:** Nên encode URLs ở frontend hay backend?  
**Options Considered:**
1. Client-side (JavaScript `encodeURIComponent()`)
2. Server-side (Node.js `encodeURIComponent()`)
3. Hybrid (encode client, re-validate server)

**Decision:** Option 1 - Client-side only  
**Reasoning:**
- Không cần network round-trip (instant feedback)
- Giảm load cho backend
- Encoding là pure function (no side effects)
- Không cần lưu encoded URLs (chỉ lưu base URL)

**Trade-offs:**
- Không có server validation (nhưng encoding không có lỗi với `encodeURIComponent()`)

### Dependencies
**Frontend:**
- `xlsx` (^0.18.5) - Excel file parsing
- `react` (18.2.0) - existing
- `lucide-react` (latest) - icons

**Backend:**
- `express` (4.18.2) - existing
- `pg` (8.11.3) - existing
- `jsonwebtoken` - existing (auth)

**No new backend dependencies needed!**

### Known Limitations
1. **L1: File Size Limit (2MB)**
   - Workaround: Split large files thành nhiều files nhỏ
   - Future: Increase limit to 10MB if server can handle

2. **L2: Max 1000 Names Per Batch**
   - Workaround: Process in multiple batches
   - Future: Background job processing for 10,000+ names

3. **L3: No RSVP Tracking**
   - Out of scope: Đây chỉ là URL encoder, không phải guest management system
   - Future: Separate RSVP tracking feature

4. **L4: Browser Clipboard API**
   - Limitation: Requires HTTPS or localhost (security restriction)
   - Workaround: Fallback to manual copy nếu clipboard API không available

---

## 🚀 Rollout Plan

### Phase 1: Backend Development (2 days)
- [x] **Day 1:** Database & API
  - [ ] Create migration `007_up_wedding_urls.sql`
  - [ ] Create `weddingController.js` with 3 endpoints
  - [ ] Create `backend/routes/wedding.js`
  - [ ] Add route to `backend/app.js`
  - [ ] Write integration tests
- [x] **Day 2:** Testing & Docs
  - [ ] Test all API endpoints
  - [ ] Update `docs/API_DOCUMENTATION.md`
  - [ ] Update `docs/DATABASE_SCHEMA.md`

### Phase 2: Frontend Development (3 days)
- [x] **Day 1:** Main Page & Components
  - [ ] Create `WeddingInvitationTool.jsx` page
  - [ ] Create `BaseUrlInput.jsx` component
  - [ ] Add route in `App.jsx`
  - [ ] Add menu item in `SidebarMenu.jsx`

- [x] **Day 2:** Input & Encoding
  - [ ] Create `GuestNameInput.jsx` component
  - [ ] Create `urlEncoder.js` utility
  - [ ] Create `fileParser.js` utility
  - [ ] Install `xlsx` package
  - [ ] Write unit tests for utilities

- [x] **Day 3:** Output & Polish
  - [ ] Create `EncodedUrlList.jsx` component
  - [ ] Implement copy to clipboard
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Add toast notifications

### Phase 3: Testing (2 days)
- [x] **Day 1:** Integration Tests
  - [ ] Test API calls with `weddingService.js`
  - [ ] Test file upload with sample files
  - [ ] Test URL encoding with Vietnamese characters
  - [ ] Coverage check >= 85%

- [x] **Day 2:** E2E Tests
  - [ ] Cypress test: Save base URL
  - [ ] Cypress test: Generate links from textarea
  - [ ] Cypress test: Upload Excel file
  - [ ] Cypress test: Copy all links

### Phase 4: Documentation (1 day)
- [ ] Create `docs/WEDDING_INVITATION_TOOL.md` user guide
- [ ] Update `README.md` with new tool
- [ ] Update `CHANGELOG.md` with v1.5.0
- [ ] Add screenshots and examples

### Phase 5: Deployment (1 day)
- [ ] Run migration on production DB
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Smoke test production
- [ ] Monitor for 24h

### Rollback Plan
- If issues found: Revert to previous version (1-click rollback Vercel)
- Database: Run rollback migration `007_down_wedding_urls.sql`
- No data loss: Soft delete pattern allows recovery

**Total Estimated Time:** 9 days (1.5 weeks)

---

## 📚 Documentation

### User Documentation
- [ ] Create `docs/WEDDING_INVITATION_TOOL.md` với step-by-step guide:
  - How to save base URL
  - How to input guest names (textarea)
  - How to upload Excel file
  - How to copy links
  - Troubleshooting common issues

### Developer Documentation
- [ ] Update `docs/API_DOCUMENTATION.md`:
  - Add section "Wedding Invitation URLs"
  - Document 3 endpoints với examples
  
- [ ] Update `docs/DATABASE_SCHEMA.md`:
  - Add `wedding_urls` table schema
  - Add ERD diagram showing relationship với `users`

- [ ] Update `README.md`:
  - Add "Wedding Invitation URL Encoder" to tools list
  - Add screenshot

- [ ] Update `CHANGELOG.md`:
  ```markdown
  ## [1.5.0] - 2025-11-XX
  
  ### ✨ New Features
  - **Wedding Invitation URL Encoder**: Generate personalized invitation links
    - UTF-8 encoding for Vietnamese names with diacritics
    - Batch input via textarea (comma/semicolon/newline separated)
    - File upload support (.txt, .csv, .xlsx)
    - One-click copy all links
    - Base URL persistence in database
  ```

---

## 🔗 Related

- **Parent Spec:** None (standalone feature)
- **Related Specs:** None
- **Implementation Plan:** `specs/plans/06_wedding_invitation_url_encoder.plan`
- **Design Mockups:** To be created in Figma
- **Example URLs:**
  - https://invitations.jmiiwedding.com/longnhiwedding
  - https://www.marrywedding.vn/invitation/sample
  - https://thewedding.vn/sample

---

## 📅 Timeline

**Estimated Effort:** 9 days (1.5 weeks)  
**Start Date:** TBD  
**Target Date:** TBD  
**Actual Completion:** TBD

**Milestones:**
- Day 2: Backend API complete
- Day 5: Frontend UI complete
- Day 7: Testing complete
- Day 8: Documentation complete
- Day 9: Production deployment

---

## ✍️ Stakeholders

**Author:** KaDong Development Team  
**Reviewers:** Product Owner, Technical Lead  
**Approver:** Product Owner  
**Implementers:** Full-stack Developer

---

## 📊 Success Metrics

### Quantitative
- **Adoption:** 50+ users within first month
- **Usage:** 100+ invitation URLs generated within first week
- **Performance:** URL encoding < 100ms for 100 names
- **Reliability:** 99.9% uptime
- **Error Rate:** < 0.1% API errors

### Qualitative
- Users find tool intuitive and easy to use
- No critical bugs reported in first 2 weeks
- Positive feedback on UTF-8 encoding accuracy
- Vietnamese characters display correctly on invitation sites

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-11-12 | 1.0.0 | Initial draft | KaDong Team |

---

**Maintained By:** KaDong Development Team  
**Review Cycle:** After implementation  
**Next Review:** After Phase 1 completion
