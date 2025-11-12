# API Testing Framework Specification

**Spec ID:** `04_api_testing_framework`  
**Version:** 1.0.0  
**Status:** 📝 Draft  
**Created:** 2025-11-12  
**Last Updated:** 2025-11-12

---

## 📋 Overview

**Title:** Comprehensive API Testing Framework  
**Type:** Feature - Testing Infrastructure  
**Priority:** 🟠 High

**Purpose:**  
Xây dựng một hệ thống automation testing toàn diện cho REST API của KaDong Tools, đảm bảo chất lượng code, phát hiện bugs sớm, và tạo nền tảng cho continuous integration/continuous deployment (CI/CD).

**Problem Statement:**  
Hiện tại project chưa có automated testing framework, dẫn đến:
- ❌ Manual testing tốn thời gian và dễ bỏ sót
- ❌ Khó phát hiện regression bugs khi thay đổi code
- ❌ Không có confidence khi deploy production
- ❌ Không có documentation về API behavior thông qua tests
- ❌ Khó maintain và scale khi thêm features mới

---

## 🎯 Goals

### 1. Primary Goals

**1.1. Comprehensive Test Coverage**
- Đạt >= 80% code coverage cho backend API
- Cover tất cả critical paths và edge cases
- Test cả happy paths và error scenarios

**1.2. Maintainable Architecture**
- Cấu trúc test dễ hiểu, dễ mở rộng
- Reusable test utilities và helpers
- Clear separation of concerns

**1.3. Fast & Reliable Execution**
- Test suite chạy < 5 phút
- Consistent results (no flaky tests)
- Parallel execution support

**1.4. Developer Experience**
- Easy to write new tests
- Clear error messages
- Good documentation và examples

### 2. Secondary Goals

**2.1. Integration Testing**
- Test interactions giữa components
- Database transactions
- External API mocks

**2.2. Performance Testing**
- Response time assertions
- Load testing basics
- Memory leak detection

**2.3. CI/CD Integration**
- GitHub Actions workflow
- Pre-commit hooks
- Automated reporting

### 3. Non-Goals

- ❌ **Frontend E2E Testing** - Sẽ là spec riêng (05_e2e_testing)
- ❌ **Load Testing Full** - Chỉ basic performance assertions
- ❌ **Security Penetration Testing** - Sẽ implement riêng
- ❌ **Mobile API Testing** - Chưa có mobile app

---

## ✅ Acceptance Criteria

### Must Have (Required)

**Test Framework Setup:**
- [x] Jest configured với TypeScript/ES6 support
- [x] Supertest cho HTTP assertions
- [x] Test database setup/teardown
- [x] Coverage reporting (Istanbul/NYC)

**Test Structure:**
- [ ] Unit tests cho tất cả controllers
- [ ] Unit tests cho utilities và validators
- [ ] Integration tests cho tất cả API endpoints
- [ ] Test fixtures và factories setup

**Quality Gates:**
- [ ] >= 80% code coverage
- [ ] 100% critical endpoints tested
- [ ] Zero skipped tests in CI
- [ ] All tests pass trước khi merge

**Documentation:**
- [ ] Testing guide cho developers
- [ ] Test writing conventions
- [ ] CI/CD integration docs
- [ ] Troubleshooting guide

### Should Have (Important)

**Advanced Testing:**
- [ ] Database transaction rollback per test
- [ ] Mock external APIs (weather, gold prices)
- [ ] Authentication flow testing
- [ ] File upload testing
- [ ] Rate limiting tests

**Developer Tools:**
- [ ] Watch mode cho development
- [ ] Test generators/templates
- [ ] VS Code test runner integration
- [ ] Coverage badges in README

**Performance:**
- [ ] Response time assertions (< 500ms)
- [ ] Database query count checks
- [ ] Memory usage monitoring

### Nice to Have (Optional)

**Enhancements:**
- [ ] Visual regression testing cho API responses
- [ ] Contract testing với Pact
- [ ] Mutation testing với Stryker
- [ ] Test data generators với Faker.js
- [ ] Snapshot testing cho complex responses

**Reporting:**
- [ ] HTML test reports
- [ ] Slack notifications on failure
- [ ] Historical trend analysis
- [ ] Flaky test detection

---

## 🏗️ Technical Design

### Architecture Overview

```
backend/
├── tests/
│   ├── unit/                      # Unit tests
│   │   ├── controllers/
│   │   │   ├── notes.test.js
│   │   │   ├── events.test.js
│   │   │   ├── currency.test.js
│   │   │   ├── gold.test.js
│   │   │   └── wishlist.test.js
│   │   ├── utils/
│   │   │   ├── validation.test.js
│   │   │   ├── urlExtractor.test.js
│   │   │   └── formatting.test.js
│   │   └── middleware/
│   │       ├── auth.test.js
│   │       └── errorHandler.test.js
│   │
│   ├── integration/               # Integration tests
│   │   ├── api/
│   │   │   ├── notes.api.test.js
│   │   │   ├── events.api.test.js
│   │   │   ├── currency.api.test.js
│   │   │   ├── gold.api.test.js
│   │   │   ├── wishlist.api.test.js
│   │   │   └── auth.api.test.js
│   │   └── database/
│   │       └── transactions.test.js
│   │
│   ├── fixtures/                  # Test data
│   │   ├── users.json
│   │   ├── notes.json
│   │   ├── events.json
│   │   └── products.json
│   │
│   ├── helpers/                   # Test utilities
│   │   ├── setup.js              # Global setup
│   │   ├── teardown.js           # Global teardown
│   │   ├── dbHelper.js           # DB test utilities
│   │   ├── authHelper.js         # Auth test utilities
│   │   ├── factories.js          # Data factories
│   │   └── assertions.js         # Custom assertions
│   │
│   ├── mocks/                    # Mock services
│   │   ├── weatherAPI.js
│   │   ├── goldAPI.js
│   │   └── shopeeAPI.js
│   │
│   └── performance/              # Performance tests
│       ├── responseTime.test.js
│       └── concurrency.test.js
│
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest global setup
└── .testenv                     # Test environment vars
```

### Test Framework Stack

**Core Testing:**
- **Jest** (v29.x) - Test runner và assertion library
- **Supertest** (v6.x) - HTTP assertions
- **@faker-js/faker** (v8.x) - Test data generation

**Database Testing:**
- **pg** - PostgreSQL client
- **pg-promise** - Advanced PostgreSQL features
- Test database: `kadong_tools_test`

**Mocking:**
- **nock** - HTTP mocking
- **sinon** - Function mocking/stubbing
- **jest.mock()** - Built-in mocking

**Coverage:**
- **Istanbul/NYC** - Code coverage
- **jest-coverage-badges** - Coverage badges

---

## 🔧 Implementation Components

### 1. Jest Configuration

**File:** `backend/jest.config.js`

```javascript
export default {
  // Environment
  testEnvironment: 'node',
  
  // Coverage
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Test patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.js'],
  globalSetup: '<rootDir>/tests/helpers/globalSetup.js',
  globalTeardown: '<rootDir>/tests/helpers/globalTeardown.js',
  
  // Timeouts
  testTimeout: 10000,
  
  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
}
```

### 2. Global Test Setup

**File:** `backend/tests/helpers/setup.js`

```javascript
import { Pool } from 'pg'
import dotenv from 'dotenv'

// Load test environment
dotenv.config({ path: '.testenv' })

// Global test database pool
let testPool

beforeAll(async () => {
  // Connect to test database
  testPool = new Pool({
    host: process.env.TEST_DB_HOST || 'localhost',
    port: process.env.TEST_DB_PORT || 5432,
    database: process.env.TEST_DB_NAME || 'kadong_tools_test',
    user: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || '123'
  })
  
  // Verify connection
  await testPool.query('SELECT NOW()')
  console.log('✅ Test database connected')
})

afterAll(async () => {
  // Close connections
  await testPool.end()
  console.log('🔌 Test database disconnected')
})

// Clean database between tests
afterEach(async () => {
  // Truncate tables (preserve structure)
  await testPool.query(`
    TRUNCATE TABLE 
      notes, 
      countdown_events, 
      fashion_outfits,
      gold_rates,
      weather_cache,
      favorite_cities,
      currency_rates,
      wishlist_items,
      wishlist_comments
    RESTART IDENTITY CASCADE
  `)
})

// Export for use in tests
export { testPool }
```

### 3. Database Helper

**File:** `backend/tests/helpers/dbHelper.js`

```javascript
import { testPool } from './setup.js'

export const dbHelper = {
  /**
   * Insert test data
   */
  async insert(table, data) {
    const columns = Object.keys(data).join(', ')
    const values = Object.values(data)
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ')
    
    const result = await testPool.query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    )
    return result.rows[0]
  },
  
  /**
   * Find by ID
   */
  async findById(table, id) {
    const result = await testPool.query(
      `SELECT * FROM ${table} WHERE id = $1`,
      [id]
    )
    return result.rows[0]
  },
  
  /**
   * Count rows
   */
  async count(table, where = {}) {
    let query = `SELECT COUNT(*) FROM ${table}`
    const conditions = []
    const values = []
    
    Object.entries(where).forEach(([key, value], index) => {
      conditions.push(`${key} = $${index + 1}`)
      values.push(value)
    })
    
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`
    }
    
    const result = await testPool.query(query, values)
    return parseInt(result.rows[0].count)
  },
  
  /**
   * Truncate table
   */
  async truncate(table) {
    await testPool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`)
  }
}
```

### 4. Factories (Test Data Generators)

**File:** `backend/tests/helpers/factories.js`

```javascript
import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'

export const factories = {
  /**
   * Generate user data
   */
  user(overrides = {}) {
    return {
      id: uuidv4(),
      email: faker.internet.email(),
      password_hash: '$2b$10$test_hash_for_testing',
      name: faker.person.fullName(),
      role: 'user',
      created_at: new Date(),
      ...overrides
    }
  },
  
  /**
   * Generate note data
   */
  note(userId, overrides = {}) {
    return {
      id: uuidv4(),
      user_id: userId,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      color: faker.helpers.arrayElement(['pink', 'purple', 'mint', 'yellow', 'blue']),
      pinned: faker.datatype.boolean(),
      created_at: new Date(),
      ...overrides
    }
  },
  
  /**
   * Generate event data
   */
  event(userId, overrides = {}) {
    return {
      id: uuidv4(),
      user_id: userId,
      title: faker.lorem.words(3),
      event_date: faker.date.future(),
      recurring: faker.datatype.boolean(),
      color: 'from-pastel-pink to-pastel-purple',
      created_at: new Date(),
      ...overrides
    }
  },
  
  /**
   * Generate wishlist item
   */
  wishlistItem(userId, overrides = {}) {
    return {
      id: uuidv4(),
      user_id: userId,
      title: faker.commerce.productName(),
      url: faker.internet.url(),
      image_url: faker.image.url(),
      price: parseFloat(faker.commerce.price()),
      currency: 'VND',
      origin: 'Shopee',
      created_at: new Date(),
      ...overrides
    }
  }
}
```

### 5. Auth Helper

**File:** `backend/tests/helpers/authHelper.js`

```javascript
import jwt from 'jsonwebtoken'
import { factories } from './factories.js'
import { dbHelper } from './dbHelper.js'

export const authHelper = {
  /**
   * Create test user and return auth token
   */
  async createAuthenticatedUser(role = 'user') {
    const userData = factories.user({ role })
    const user = await dbHelper.insert('users', userData)
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'test_secret',
      { expiresIn: '1h' }
    )
    
    return { user, token }
  },
  
  /**
   * Get authorization header
   */
  getAuthHeader(token) {
    return { Authorization: `Bearer ${token}` }
  }
}
```

### 6. Mock Services

**File:** `backend/tests/mocks/externalAPIs.js`

```javascript
import nock from 'nock'

export const mockExternalAPIs = {
  /**
   * Mock Weather API
   */
  mockWeatherAPI(city = 'Ho Chi Minh', weatherData = {}) {
    const defaultData = {
      name: city,
      main: { temp: 28, humidity: 80 },
      weather: [{ main: 'Clear', description: 'clear sky' }],
      ...weatherData
    }
    
    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true)
      .reply(200, defaultData)
  },
  
  /**
   * Mock Exchange Rate API
   */
  mockExchangeRateAPI(rates = {}) {
    const defaultRates = {
      USD: 1,
      VND: 26345,
      EUR: 0.92,
      GBP: 0.79,
      ...rates
    }
    
    nock('https://api.exchangerate-api.com')
      .get('/v4/latest/USD')
      .reply(200, { rates: defaultRates })
  },
  
  /**
   * Mock Shopee API
   */
  mockShopeeAPI(productData = {}) {
    const defaultData = {
      item: {
        name: 'iPhone 15 Pro Max',
        price: 3499900000, // Shopee stores in smallest unit
        images: ['https://example.com/image.jpg'],
        ...productData
      }
    }
    
    nock('https://shopee.vn')
      .get('/api/v4/item/get')
      .query(true)
      .reply(200, defaultData)
  },
  
  /**
   * Clean all mocks
   */
  cleanAll() {
    nock.cleanAll()
  }
}
```

---

## 📝 Test Writing Conventions

### Test Structure (AAA Pattern)

```javascript
describe('Feature Name', () => {
  describe('Specific Function/Endpoint', () => {
    it('should do expected behavior when conditions', async () => {
      // Arrange - Setup test data
      const testData = factories.note(userId)
      
      // Act - Execute the operation
      const result = await someFunction(testData)
      
      // Assert - Verify the outcome
      expect(result).toBeDefined()
      expect(result.title).toBe(testData.title)
    })
  })
})
```

### Naming Conventions

**Test Files:**
- Unit tests: `{module}.test.js`
- Integration tests: `{feature}.api.test.js`
- Performance tests: `{feature}.perf.test.js`

**Test Cases:**
```javascript
// ✅ GOOD - Descriptive and specific
it('should return 404 when note does not exist', async () => {})
it('should create note with valid data', async () => {})
it('should prevent SQL injection in search query', async () => {})

// ❌ BAD - Vague and unclear
it('works', async () => {})
it('test note', async () => {})
it('handles errors', async () => {})
```

### Best Practices

**1. Independent Tests**
```javascript
// ✅ Each test is isolated
describe('Notes API', () => {
  beforeEach(async () => {
    // Clean slate for each test
    await dbHelper.truncate('notes')
  })
  
  it('should create note', async () => {
    // Test creates own data
    const note = await createNote()
    expect(note).toBeDefined()
  })
})
```

**2. Clear Assertions**
```javascript
// ✅ Specific assertions
expect(response.status).toBe(200)
expect(response.body.success).toBe(true)
expect(response.body.data).toHaveLength(5)
expect(response.body.data[0].title).toBe('Expected Title')

// ❌ Too vague
expect(response).toBeTruthy()
expect(result).toBeDefined()
```

**3. Test Error Cases**
```javascript
describe('Error Handling', () => {
  it('should return 400 when title is missing', async () => {
    const response = await request(app)
      .post('/api/notes')
      .send({ content: 'No title' })
    
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
  })
  
  it('should handle database connection failure', async () => {
    // Mock database failure
    jest.spyOn(dbHelper, 'insert').mockRejectedValue(new Error('Connection lost'))
    
    const response = await request(app)
      .post('/api/notes')
      .send(validNoteData)
    
    expect(response.status).toBe(500)
  })
})
```

---

## 🧪 Example Test Files

### Unit Test Example

**File:** `backend/tests/unit/controllers/notes.test.js`

```javascript
import { getNotes, createNote, updateNote, deleteNote } from '@/controllers/notesController.js'
import { dbHelper } from '@tests/helpers/dbHelper.js'
import { factories } from '@tests/helpers/factories.js'

describe('Notes Controller - Unit Tests', () => {
  let userId
  
  beforeEach(async () => {
    // Create test user
    const user = await dbHelper.insert('users', factories.user())
    userId = user.id
  })
  
  describe('getNotes()', () => {
    it('should return all notes for user', async () => {
      // Arrange
      await dbHelper.insert('notes', factories.note(userId, { title: 'Note 1' }))
      await dbHelper.insert('notes', factories.note(userId, { title: 'Note 2' }))
      
      const req = { query: {}, params: { userId } }
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      }
      
      // Act
      await getNotes(req, res)
      
      // Assert
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({ title: 'Note 1' }),
            expect.objectContaining({ title: 'Note 2' })
          ])
        })
      )
    })
    
    it('should filter by pinned status', async () => {
      // Arrange
      await dbHelper.insert('notes', factories.note(userId, { pinned: true }))
      await dbHelper.insert('notes', factories.note(userId, { pinned: false }))
      
      const req = { query: { pinned: 'true' }, params: { userId } }
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }
      
      // Act
      await getNotes(req, res)
      
      // Assert
      const result = res.json.mock.calls[0][0]
      expect(result.data).toHaveLength(1)
      expect(result.data[0].pinned).toBe(true)
    })
    
    it('should return 500 on database error', async () => {
      // Arrange
      jest.spyOn(dbHelper, 'query').mockRejectedValue(new Error('DB Error'))
      
      const req = { query: {}, params: { userId } }
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }
      
      // Act
      await getNotes(req, res)
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.any(Object)
        })
      )
    })
  })
  
  describe('createNote()', () => {
    it('should create note with valid data', async () => {
      // Arrange
      const noteData = {
        title: 'New Note',
        content: 'Content here',
        color: 'pink'
      }
      
      const req = { body: noteData, params: { userId } }
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }
      
      // Act
      await createNote(req, res)
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            id: expect.any(String),
            title: 'New Note',
            user_id: userId
          })
        })
      )
      
      // Verify in database
      const count = await dbHelper.count('notes', { user_id: userId })
      expect(count).toBe(1)
    })
    
    it('should validate required fields', async () => {
      // Arrange
      const req = { body: { content: 'No title' }, params: { userId } }
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }
      
      // Act
      await createNote(req, res)
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR'
          })
        })
      )
    })
    
    it('should prevent SQL injection', async () => {
      // Arrange
      const maliciousData = {
        title: "'; DROP TABLE notes; --",
        content: 'Malicious content'
      }
      
      const req = { body: maliciousData, params: { userId } }
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() }
      
      // Act
      await createNote(req, res)
      
      // Assert - Should create safely escaped note, not drop table
      expect(res.status).toHaveBeenCalledWith(201)
      
      // Verify table still exists
      const tableExists = await dbHelper.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'notes'
        )
      `)
      expect(tableExists.rows[0].exists).toBe(true)
    })
  })
})
```

### Integration Test Example

**File:** `backend/tests/integration/api/notes.api.test.js`

```javascript
import request from 'supertest'
import app from '@/app.js'
import { authHelper } from '@tests/helpers/authHelper.js'
import { factories } from '@tests/helpers/factories.js'
import { dbHelper } from '@tests/helpers/dbHelper.js'

describe('Notes API - Integration Tests', () => {
  let authUser, authToken
  
  beforeEach(async () => {
    // Create authenticated user
    const auth = await authHelper.createAuthenticatedUser()
    authUser = auth.user
    authToken = auth.token
  })
  
  describe('GET /api/notes', () => {
    it('should return all notes for authenticated user', async () => {
      // Arrange
      await dbHelper.insert('notes', factories.note(authUser.id, { title: 'Note 1' }))
      await dbHelper.insert('notes', factories.note(authUser.id, { title: 'Note 2' }))
      
      // Act
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
      
      // Assert
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.headers['content-type']).toMatch(/json/)
    })
    
    it('should return 401 without auth token', async () => {
      // Act
      const response = await request(app).get('/api/notes')
      
      // Assert
      expect(response.status).toBe(401)
      expect(response.body.error.code).toBe('UNAUTHORIZED')
    })
    
    it('should support pagination', async () => {
      // Arrange - Create 15 notes
      for (let i = 0; i < 15; i++) {
        await dbHelper.insert('notes', factories.note(authUser.id))
      }
      
      // Act
      const response = await request(app)
        .get('/api/notes')
        .query({ limit: 10, offset: 0 })
        .set('Authorization', `Bearer ${authToken}`)
      
      // Assert
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(10)
      expect(response.body.total).toBe(15)
    })
    
    it('should respond within 500ms', async () => {
      // Arrange
      await dbHelper.insert('notes', factories.note(authUser.id))
      
      // Act
      const startTime = Date.now()
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
      const endTime = Date.now()
      
      // Assert
      expect(response.status).toBe(200)
      expect(endTime - startTime).toBeLessThan(500)
    })
  })
  
  describe('POST /api/notes', () => {
    it('should create note with valid data', async () => {
      // Arrange
      const noteData = {
        title: 'Integration Test Note',
        content: 'Testing API endpoint',
        color: 'mint',
        pinned: false
      }
      
      // Act
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(noteData)
      
      // Assert
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        title: noteData.title,
        content: noteData.content,
        user_id: authUser.id
      })
      
      // Verify in database
      const savedNote = await dbHelper.findById('notes', response.body.data.id)
      expect(savedNote).toBeDefined()
      expect(savedNote.title).toBe(noteData.title)
    })
    
    it('should validate required fields', async () => {
      // Act
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Missing title' })
      
      // Assert
      expect(response.status).toBe(400)
      expect(response.body.error.message).toContain('title')
    })
    
    it('should sanitize XSS attempts', async () => {
      // Arrange
      const xssData = {
        title: '<script>alert("XSS")</script>',
        content: '<img src=x onerror=alert(1)>'
      }
      
      // Act
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(xssData)
      
      // Assert - Should create but sanitize
      expect(response.status).toBe(201)
      expect(response.body.data.title).not.toContain('<script>')
      expect(response.body.data.content).not.toContain('onerror')
    })
  })
  
  describe('PUT /api/notes/:id', () => {
    it('should update own note', async () => {
      // Arrange
      const note = await dbHelper.insert('notes', factories.note(authUser.id))
      const updates = { title: 'Updated Title' }
      
      // Act
      const response = await request(app)
        .put(`/api/notes/${note.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
      
      // Assert
      expect(response.status).toBe(200)
      expect(response.body.data.title).toBe('Updated Title')
      
      // Verify in database
      const updatedNote = await dbHelper.findById('notes', note.id)
      expect(updatedNote.title).toBe('Updated Title')
    })
    
    it('should not update other user note', async () => {
      // Arrange
      const otherUser = await dbHelper.insert('users', factories.user())
      const otherNote = await dbHelper.insert('notes', factories.note(otherUser.id))
      
      // Act
      const response = await request(app)
        .put(`/api/notes/${otherNote.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Hacked' })
      
      // Assert
      expect(response.status).toBe(403)
    })
  })
  
  describe('DELETE /api/notes/:id', () => {
    it('should soft delete note', async () => {
      // Arrange
      const note = await dbHelper.insert('notes', factories.note(authUser.id))
      
      // Act
      const response = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set('Authorization', `Bearer ${authToken}`)
      
      // Assert
      expect(response.status).toBe(200)
      
      // Verify soft delete in database
      const deletedNote = await dbHelper.findById('notes', note.id)
      expect(deletedNote.deleted_at).not.toBeNull()
    })
  })
})
```

---

## 📊 Performance Requirements

### Response Time Targets

| Endpoint Type | Target | Max Acceptable |
|---------------|--------|----------------|
| GET (list) | < 200ms | < 500ms |
| GET (single) | < 100ms | < 300ms |
| POST/PUT | < 300ms | < 500ms |
| DELETE | < 100ms | < 200ms |

### Resource Limits

- **Database Connections:** Max 20 in pool
- **Memory:** < 512MB per test suite
- **Test Execution:** < 5 minutes total
- **Coverage Calculation:** < 30 seconds

### Performance Tests

```javascript
describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill().map(() =>
      request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
    )
    
    const startTime = Date.now()
    const responses = await Promise.all(requests)
    const endTime = Date.now()
    
    expect(responses.every(r => r.status === 200)).toBe(true)
    expect(endTime - startTime).toBeLessThan(5000) // 5 seconds for 100 requests
  })
})
```

---

## 🔐 Security Testing

### SQL Injection Prevention

```javascript
describe('Security - SQL Injection', () => {
  const sqlInjectionPayloads = [
    "'; DROP TABLE notes; --",
    "1' OR '1'='1",
    "admin'--",
    "' UNION SELECT * FROM users--"
  ]
  
  sqlInjectionPayloads.forEach(payload => {
    it(`should prevent SQL injection: ${payload}`, async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: payload, content: 'Test' })
      
      // Should either validate and reject, or safely escape
      expect([201, 400]).toContain(response.status)
      
      // Verify database integrity
      const tablesExist = await dbHelper.query(`
        SELECT count(*) FROM information_schema.tables 
        WHERE table_name IN ('notes', 'users')
      `)
      expect(parseInt(tablesExist.rows[0].count)).toBe(2)
    })
  })
})
```

### XSS Prevention

```javascript
describe('Security - XSS', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<iframe src="javascript:alert(1)">',
    'javascript:alert(document.cookie)'
  ]
  
  xssPayloads.forEach(payload => {
    it(`should sanitize XSS: ${payload}`, async () => {
      const response = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: payload, content: payload })
      
      if (response.status === 201) {
        // Should escape or remove dangerous tags
        expect(response.body.data.title).not.toContain('<script>')
        expect(response.body.data.content).not.toContain('onerror')
      }
    })
  })
})
```

### Authentication Tests

```javascript
describe('Security - Authentication', () => {
  it('should reject requests without token', async () => {
    const response = await request(app).get('/api/notes')
    expect(response.status).toBe(401)
  })
  
  it('should reject invalid token', async () => {
    const response = await request(app)
      .get('/api/notes')
      .set('Authorization', 'Bearer invalid_token')
    
    expect(response.status).toBe(401)
  })
  
  it('should reject expired token', async () => {
    const expiredToken = jwt.sign(
      { userId: authUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '-1h' } // Expired 1 hour ago
    )
    
    const response = await request(app)
      .get('/api/notes')
      .set('Authorization', `Bearer ${expiredToken}`)
    
    expect(response.status).toBe(401)
  })
})
```

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: kadong_tools_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run database migrations
        env:
          TEST_DB_HOST: localhost
          TEST_DB_PORT: 5432
          TEST_DB_NAME: kadong_tools_test
          TEST_DB_USER: postgres
          TEST_DB_PASSWORD: postgres
        run: |
          cd backend
          npm run db:migrate:test
      
      - name: Run tests with coverage
        env:
          TEST_DB_HOST: localhost
          TEST_DB_PORT: 5432
          TEST_DB_NAME: kadong_tools_test
          TEST_DB_USER: postgres
          TEST_DB_PASSWORD: postgres
          JWT_SECRET: test_secret_key
        run: |
          cd backend
          npm test -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./backend/coverage/lcov.info
          flags: backend
          name: api-tests
      
      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./backend/coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Fail if coverage < 80%
        run: |
          cd backend
          npm run test:coverage-check
```

### Pre-commit Hook

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🧪 Running tests before commit..."

cd backend
npm test -- --bail --findRelatedTests

if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Commit aborted."
  exit 1
fi

echo "✅ All tests passed!"
```

---

## 📚 Documentation

### Testing Guide for Developers

**File:** `docs/TESTING_GUIDE.md`

```markdown
# API Testing Guide

## Quick Start

```bash
# Install dependencies
cd backend
npm install

# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test tests/unit/controllers/notes.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should create note"
```

## Writing Tests

### 1. Create Test File

Follow naming convention: `{feature}.test.js` or `{feature}.api.test.js`

### 2. Import Helpers

```javascript
import request from 'supertest'
import app from '@/app.js'
import { authHelper } from '@tests/helpers/authHelper.js'
import { factories } from '@tests/helpers/factories.js'
import { dbHelper } from '@tests/helpers/dbHelper.js'
```

### 3. Write Test Cases

Use AAA pattern: Arrange, Act, Assert

### 4. Run and Verify

```bash
npm test path/to/your.test.js
```

## Best Practices

1. ✅ Keep tests independent
2. ✅ Use factories for test data
3. ✅ Clean database after each test
4. ✅ Test both success and error cases
5. ✅ Write descriptive test names
6. ✅ Assert specific values
7. ✅ Mock external APIs
8. ✅ Verify database state

## Troubleshooting

**Tests fail with database error:**
- Check `.testenv` file exists
- Verify test database is running
- Run migrations: `npm run db:migrate:test`

**Tests are slow:**
- Use `--maxWorkers=50%` flag
- Check for missing `await` keywords
- Profile with `--detectLeaks`

**Flaky tests:**
- Add proper wait/sleep where needed
- Check for shared state between tests
- Verify database cleanup works
```

---

## 📋 NPM Scripts

Add to `backend/package.json`:

```json
{
  "scripts": {
    "test": "NODE_ENV=test jest",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage",
    "test:coverage-check": "NODE_ENV=test jest --coverage --coverageThreshold='{\"global\":{\"lines\":80,\"functions\":80,\"branches\":80,\"statements\":80}}'",
    "test:unit": "NODE_ENV=test jest tests/unit",
    "test:integration": "NODE_ENV=test jest tests/integration",
    "test:ci": "NODE_ENV=test jest --ci --coverage --maxWorkers=2",
    "db:migrate:test": "NODE_ENV=test node scripts/migrate-test-db.js"
  }
}
```

---

## ✅ Success Metrics

### Quantitative Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Code Coverage | >= 80% | 0% | 🔴 |
| Test Execution Time | < 5 min | N/A | ⏳ |
| Flaky Tests | 0% | N/A | ⏳ |
| Critical Endpoints Tested | 100% | 0% | 🔴 |
| Security Tests | >= 20 | 0 | 🔴 |
| Performance Tests | >= 10 | 0 | 🔴 |

### Qualitative Metrics

- [ ] Developer satisfaction with testing workflow
- [ ] Reduced bug reports in production
- [ ] Faster feature development
- [ ] Increased confidence in deployments

---

## 🔗 Related

- **Parent Spec:** `01_init.spec` (Project initialization)
- **Related Specs:** 
  - `05_e2e_testing.spec` (Frontend E2E tests) - To be created
  - `06_load_testing.spec` (Performance/load tests) - To be created
- **Implementation Plan:** `plans/04_api_testing_framework.plan` - To be created
- **Dependencies:**
  - All existing API endpoints
  - Database schema
  - Authentication system

---

## 📅 Timeline

**Estimated Effort:** 3-4 weeks  
**Start Date:** 2025-11-13  
**Target Date:** 2025-12-08

**Milestones:**
- Week 1: Setup framework, write helpers, create 20% tests
- Week 2: Write remaining unit tests, reach 50% coverage
- Week 3: Write integration tests, reach 80% coverage
- Week 4: Security tests, performance tests, documentation, CI/CD

---

## ✍️ Stakeholders

**Author:** Senior Automation Test Engineer  
**Reviewers:** Tech Lead, Backend Developers  
**Approver:** CTO / Engineering Manager  
**Implementers:** QA Team + Backend Team

---

## 🔄 Review & Updates

| Date | Version | Changes | Updated By |
|------|---------|---------|------------|
| 2025-11-12 | 1.0.0 | Initial specification | AI Senior Test Engineer |

---

**Maintained By:** QA & Backend Team  
**Review Cycle:** Bi-weekly during implementation  
**Next Review:** 2025-11-26
