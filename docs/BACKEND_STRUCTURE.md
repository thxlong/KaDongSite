# Backend Structure - KaDong Tools API

**Version:** 2.0.0  
**Last Updated:** 2025-11-12  
**Status:** ✅ Production Ready

---

## 📋 Tổng quan

Backend được thiết kế theo **Clean Architecture** với separation of concerns rõ ràng, dễ maintain và scale.

### Tech Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18.2
- **Database:** PostgreSQL 14+
- **ORM:** Raw SQL với pg driver (no ORM)
- **Authentication:** JWT (jsonwebtoken)
- **Testing:** Jest + Supertest
- **Process Manager:** PM2 (production)
- **Deployment:** Railway

---

## 📁 Cấu trúc thư mục (Recommended)

```
backend/
├── 📂 src/                          # Source code chính
│   ├── 📂 api/                      # API layer
│   │   ├── 📂 controllers/          # Request handlers
│   │   │   ├── events.controller.js
│   │   │   ├── fashion.controller.js
│   │   │   ├── feedback.controller.js
│   │   │   ├── gold.controller.js
│   │   │   ├── notes.controller.js
│   │   │   ├── tools.controller.js
│   │   │   ├── weather.controller.js
│   │   │   ├── wedding.controller.js
│   │   │   └── wishlist.controller.js
│   │   │
│   │   ├── 📂 routes/               # Route definitions
│   │   │   ├── index.js             # Main router (combines all)
│   │   │   ├── events.routes.js
│   │   │   ├── fashion.routes.js
│   │   │   ├── feedback.routes.js
│   │   │   ├── gold.routes.js
│   │   │   ├── notes.routes.js
│   │   │   ├── tools.routes.js
│   │   │   ├── weather.routes.js
│   │   │   ├── wedding.routes.js
│   │   │   └── wishlist.routes.js
│   │   │
│   │   └── 📂 middlewares/          # Express middlewares
│   │       ├── auth.middleware.js   # JWT authentication
│   │       ├── error.middleware.js  # Global error handler
│   │       ├── logger.middleware.js # Request logging
│   │       ├── rateLimit.middleware.js
│   │       └── validate.middleware.js
│   │
│   ├── 📂 services/                 # Business logic layer
│   │   ├── auth.service.js
│   │   ├── currency.service.js      # Currency rate logic
│   │   ├── email.service.js
│   │   ├── gold.service.js          # Gold price logic
│   │   └── weather.service.js       # Weather fetching logic
│   │
│   ├── 📂 providers/                # External API providers
│   │   ├── currency/
│   │   │   ├── vietcombank.provider.js
│   │   │   └── exchangerate.provider.js
│   │   ├── gold/
│   │   │   ├── sjc.provider.js
│   │   │   ├── pnj.provider.js
│   │   │   └── mock.provider.js
│   │   └── weather/
│   │       └── openweather.provider.js
│   │
│   ├── 📂 database/                 # Database layer
│   │   ├── 📂 migrations/           # Schema migrations
│   │   │   ├── 001_up_initial_schema.sql
│   │   │   ├── 001_down_rollback.sql
│   │   │   ├── 002_up_fashion_outfits.sql
│   │   │   ├── 002_down_fashion_outfits.sql
│   │   │   ├── 007_up_wedding_urls.sql
│   │   │   └── 007_down_wedding_urls.sql
│   │   │
│   │   ├── 📂 seeds/                # Seed data
│   │   │   ├── 001_test_user.sql
│   │   │   ├── 002_seed_gold_rates.sql
│   │   │   ├── 004_seed_wishlist.sql
│   │   │   └── 005_currency_rates.sql
│   │   │
│   │   ├── 📂 queries/              # Complex queries
│   │   │   └── example_queries.sql
│   │   │
│   │   └── 📂 repositories/         # Data access layer
│   │       ├── base.repository.js   # Base class with common CRUD
│   │       ├── user.repository.js
│   │       ├── gold.repository.js
│   │       ├── weather.repository.js
│   │       └── wedding.repository.js
│   │
│   ├── 📂 models/                   # Data models (POJOs)
│   │   ├── User.model.js
│   │   ├── GoldRate.model.js
│   │   ├── WeatherData.model.js
│   │   └── WeddingUrl.model.js
│   │
│   ├── 📂 config/                   # Configuration
│   │   ├── database.config.js       # DB connection pool
│   │   ├── constants.config.js      # App constants
│   │   ├── env.config.js            # Environment variables
│   │   └── logger.config.js         # Winston logger config
│   │
│   ├── 📂 utils/                    # Utility functions
│   │   ├── auth.util.js             # JWT helpers
│   │   ├── validation.util.js       # Input validation
│   │   ├── crypto.util.js           # Encryption helpers
│   │   ├── date.util.js             # Date formatting
│   │   └── response.util.js         # Standardized API responses
│   │
│   ├── 📄 app.js                    # Express app setup
│   └── 📄 server.js                 # Server entry point
│
├── 📂 scripts/                      # Utility scripts
│   ├── 📂 database/                 # DB scripts
│   │   ├── setup.js                 # Database initialization
│   │   ├── migrate.js               # Run migrations
│   │   ├── seed.js                  # Run seeds
│   │   ├── reset.js                 # Drop & recreate
│   │   └── backup.js                # Backup database
│   │
│   ├── 📂 cron/                     # Scheduled jobs
│   │   ├── fetch-gold-prices.js    # Fetch gold prices hourly
│   │   ├── fetch-currency-rates.js # Fetch currency daily
│   │   └── cleanup-old-data.js     # Delete old records
│   │
│   └── 📂 dev/                      # Development scripts
│       ├── check-user.js
│       ├── test-api.js
│       └── seed-test-data.js
│
├── 📂 tests/                        # Test files
│   ├── 📂 unit/                     # Unit tests
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── 📂 integration/              # Integration tests
│   │   ├── api/
│   │   │   ├── gold.test.js
│   │   │   ├── weather.test.js
│   │   │   └── wedding.test.js
│   │   └── database/
│   │
│   ├── 📂 e2e/                      # End-to-end tests
│   │   └── workflows/
│   │
│   └── 📂 fixtures/                 # Test data
│       ├── users.fixture.js
│       └── gold-rates.fixture.js
│
├── 📂 logs/                         # Application logs
│   ├── error.log
│   ├── combined.log
│   └── access.log
│
├── 📂 docs/                         # Backend documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── 📄 .env                          # Environment variables (gitignored)
├── 📄 .env.example                  # Example env file
├── 📄 .gitignore
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 jest.config.js                # Jest configuration
├── 📄 ecosystem.config.js           # PM2 configuration
├── 📄 docker-compose.yml            # Docker setup
├── 📄 Dockerfile
└── 📄 README.md
```

---

## 🔍 Chi tiết từng layer

### 1. API Layer (`src/api/`)

**Purpose:** Handle HTTP requests/responses, routing, validation

#### Controllers (`src/api/controllers/`)
- **Responsibility:** Parse request, call services, format response
- **Naming:** `{resource}.controller.js`
- **Example:**
```javascript
// src/api/controllers/gold.controller.js
const goldService = require('../../services/gold.service')
const { successResponse, errorResponse } = require('../../utils/response.util')

const getLatestPrices = async (req, res, next) => {
  try {
    const { types, sources, limit } = req.query
    const data = await goldService.getLatestPrices({ types, sources, limit })
    return successResponse(res, data, 'Gold prices fetched successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = { getLatestPrices }
```

#### Routes (`src/api/routes/`)
- **Responsibility:** Define endpoints, apply middlewares
- **Naming:** `{resource}.routes.js`
- **Example:**
```javascript
// src/api/routes/gold.routes.js
const express = require('express')
const router = express.Router()
const goldController = require('../controllers/gold.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const { rateLimitMiddleware } = require('../middlewares/rateLimit.middleware')

router.get('/latest', goldController.getLatestPrices)
router.get('/history', goldController.getHistory)
router.post('/fetch', authMiddleware, rateLimitMiddleware, goldController.fetchNow)

module.exports = router
```

#### Middlewares (`src/api/middlewares/`)
- **auth.middleware.js:** JWT verification
- **error.middleware.js:** Global error handling
- **logger.middleware.js:** Request/response logging
- **rateLimit.middleware.js:** Rate limiting
- **validate.middleware.js:** Input validation (Joi/express-validator)

---

### 2. Service Layer (`src/services/`)

**Purpose:** Business logic, orchestration, data processing

- **Responsibility:** 
  - Business rules enforcement
  - Data transformation
  - Calling multiple repositories
  - Calling external providers
  - Error handling

- **Naming:** `{domain}.service.js`

- **Example:**
```javascript
// src/services/gold.service.js
const goldRepository = require('../database/repositories/gold.repository')
const sjcProvider = require('../providers/gold/sjc.provider')
const pnjProvider = require('../providers/gold/pnj.provider')
const logger = require('../config/logger.config')

class GoldService {
  async getLatestPrices({ types, sources, limit = 10 }) {
    // Business logic: filter, transform, aggregate
    const prices = await goldRepository.findLatest({ types, sources, limit })
    return this.formatPrices(prices)
  }

  async fetchAndSave() {
    try {
      const sjcData = await sjcProvider.fetch()
      const pnjData = await pnjProvider.fetch()
      
      const allPrices = [...sjcData, ...pnjData]
      await goldRepository.bulkInsert(allPrices)
      
      logger.info(`Fetched ${allPrices.length} gold prices`)
      return allPrices
    } catch (error) {
      logger.error('Failed to fetch gold prices:', error)
      throw error
    }
  }

  formatPrices(prices) {
    // Transform data for API response
    return prices.map(price => ({
      type: price.gold_type,
      buy: price.buy_price,
      sell: price.sell_price,
      unit: price.unit,
      time: price.fetched_at
    }))
  }
}

module.exports = new GoldService()
```

---

### 3. Database Layer (`src/database/`)

#### Repositories (`src/database/repositories/`)
- **Responsibility:** Data access, SQL queries, CRUD operations
- **Naming:** `{entity}.repository.js`
- **Pattern:** Repository pattern

- **Example:**
```javascript
// src/database/repositories/gold.repository.js
const pool = require('../../config/database.config')

class GoldRepository {
  async findLatest({ types, sources, limit = 10 }) {
    let query = `
      SELECT DISTINCT ON (gold_type, source)
        id, gold_type, source, buy_price, sell_price, unit, fetched_at
      FROM gold_rates
      WHERE deleted_at IS NULL
    `
    
    const conditions = []
    const params = []
    
    if (types) {
      params.push(types.split(','))
      conditions.push(`gold_type = ANY($${params.length})`)
    }
    
    if (sources) {
      params.push(sources.split(','))
      conditions.push(`source = ANY($${params.length})`)
    }
    
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ')
    }
    
    query += ` ORDER BY gold_type, source, fetched_at DESC LIMIT $${params.length + 1}`
    params.push(limit)
    
    const result = await pool.query(query, params)
    return result.rows
  }

  async bulkInsert(prices) {
    const values = prices.map(p => [
      p.gold_type, p.source, p.buy_price, p.sell_price, 
      p.unit, p.fetched_at, p.metadata
    ])
    
    const query = `
      INSERT INTO gold_rates (gold_type, source, buy_price, sell_price, unit, fetched_at, metadata)
      SELECT * FROM UNNEST($1::text[], $2::text[], $3::numeric[], $4::numeric[], 
                           $5::text[], $6::timestamp[], $7::jsonb[])
    `
    
    await pool.query(query, [
      values.map(v => v[0]), // gold_type
      values.map(v => v[1]), // source
      values.map(v => v[2]), // buy_price
      values.map(v => v[3]), // sell_price
      values.map(v => v[4]), // unit
      values.map(v => v[5]), // fetched_at
      values.map(v => v[6])  // metadata
    ])
  }
}

module.exports = new GoldRepository()
```

---

### 4. Provider Layer (`src/providers/`)

**Purpose:** External API integrations, data fetching

- **Organization:** Group by domain
- **Naming:** `{source}.provider.js`
- **Example:**
```javascript
// src/providers/gold/sjc.provider.js
const axios = require('axios')
const logger = require('../../config/logger.config')

class SJCProvider {
  constructor() {
    this.baseUrl = 'https://sjc.com.vn/api/gold-prices'
  }

  async fetch() {
    try {
      const response = await axios.get(this.baseUrl)
      return this.transform(response.data)
    } catch (error) {
      logger.error('SJC provider error:', error)
      throw error
    }
  }

  transform(rawData) {
    // Transform SJC data to our standard format
    return rawData.map(item => ({
      gold_type: item.type,
      source: 'SJC',
      buy_price: parseFloat(item.buy),
      sell_price: parseFloat(item.sell),
      unit: 'VND/chỉ',
      fetched_at: new Date(),
      metadata: { raw: item }
    }))
  }
}

module.exports = new SJCProvider()
```

---

### 5. Models Layer (`src/models/`)

**Purpose:** Data models, validation schemas

- **Naming:** `{Entity}.model.js`
- **Example:**
```javascript
// src/models/GoldRate.model.js
class GoldRate {
  constructor(data) {
    this.id = data.id
    this.goldType = data.gold_type
    this.source = data.source
    this.buyPrice = data.buy_price
    this.sellPrice = data.sell_price
    this.unit = data.unit
    this.fetchedAt = data.fetched_at
    this.metadata = data.metadata
    this.createdAt = data.created_at
  }

  static fromDB(row) {
    return new GoldRate(row)
  }

  toJSON() {
    return {
      id: this.id,
      type: this.goldType,
      buy: this.buyPrice,
      sell: this.sellPrice,
      unit: this.unit,
      time: this.fetchedAt
    }
  }
}

module.exports = GoldRate
```

---

### 6. Config Layer (`src/config/`)

- **database.config.js:** PostgreSQL pool
- **constants.config.js:** App-wide constants
- **env.config.js:** Environment variable parsing
- **logger.config.js:** Winston logger setup

---

### 7. Utils Layer (`src/utils/`)

- **auth.util.js:** JWT sign/verify helpers
- **validation.util.js:** UUID, email, phone validation
- **response.util.js:** Standardized API responses
- **date.util.js:** Date formatting helpers

---

## 🔄 Migration Plan

### Phase 1: Create New Structure
```bash
# Tạo folders
mkdir -p src/api/{controllers,routes,middlewares}
mkdir -p src/services
mkdir -p src/providers/{currency,gold,weather}
mkdir -p src/database/repositories
mkdir -p src/models
mkdir -p src/config
mkdir -p src/utils
mkdir -p scripts/{database,cron,dev}
mkdir -p tests/{unit,integration,e2e,fixtures}
```

### Phase 2: Move Files
```bash
# Controllers
mv controllers/*.js src/api/controllers/
rename to {resource}.controller.js

# Routes
mv routes/*.js src/api/routes/
rename to {resource}.routes.js

# Config
mv config/*.js src/config/
rename to {name}.config.js

# Utils
mv utils/*.js src/utils/
rename to {name}.util.js

# Database
# Already in good structure, just move migrations/seeds
```

### Phase 3: Update Imports
- Update all require() paths
- Use absolute paths with module-alias

### Phase 4: Create New Files
- Create repositories for each entity
- Create services for business logic
- Create middlewares
- Create models

### Phase 5: Update package.json
```json
{
  "_moduleAliases": {
    "@": "src",
    "@api": "src/api",
    "@services": "src/services",
    "@database": "src/database",
    "@config": "src/config",
    "@utils": "src/utils",
    "@models": "src/models",
    "@providers": "src/providers"
  }
}
```

### Phase 6: Testing
- Run all tests
- Manual testing
- Fix broken imports

---

## 📝 Naming Conventions

### Files
- **Controllers:** `{resource}.controller.js` (plural)
- **Services:** `{domain}.service.js` (singular)
- **Repositories:** `{entity}.repository.js` (singular)
- **Routes:** `{resource}.routes.js` (plural)
- **Models:** `{Entity}.model.js` (PascalCase)
- **Providers:** `{source}.provider.js` (lowercase)
- **Middlewares:** `{name}.middleware.js`
- **Utils:** `{name}.util.js`
- **Config:** `{name}.config.js`

### Functions
- **Controllers:** HTTP verbs - `getLatest`, `create`, `update`, `delete`
- **Services:** Business actions - `fetchAndSave`, `calculateTotal`, `sendEmail`
- **Repositories:** Data operations - `findById`, `findAll`, `create`, `update`, `delete`

### Variables
- **camelCase:** JavaScript variables/functions
- **PascalCase:** Classes, Models
- **snake_case:** Database columns
- **UPPER_SNAKE_CASE:** Constants

---

## 🎯 Benefits của cấu trúc mới

### 1. Separation of Concerns
- Controllers chỉ handle HTTP
- Services chứa business logic
- Repositories chỉ access database
- Providers chỉ call external APIs

### 2. Testability
- Unit test services riêng
- Mock repositories dễ dàng
- Integration test từng layer

### 3. Scalability
- Thêm feature mới dễ dàng
- Không ảnh hưởng code cũ
- Clear boundaries

### 4. Maintainability
- Dễ tìm file (organized by domain)
- Naming convention rõ ràng
- Documentation tốt

### 5. Reusability
- Services có thể reuse
- Repositories có thể share
- Utils/helpers centralized

---

## 🔧 Development Workflow

### 1. Thêm Feature Mới
```
1. Create migration: src/database/migrations/
2. Create model: src/models/
3. Create repository: src/database/repositories/
4. Create service: src/services/
5. Create controller: src/api/controllers/
6. Create routes: src/api/routes/
7. Update main router: src/api/routes/index.js
8. Write tests: tests/
9. Update docs
```

### 2. Fix Bug
```
1. Identify layer (controller/service/repository)
2. Write failing test
3. Fix code
4. Verify test passes
5. Update docs if needed
```

### 3. Refactor
```
1. Write tests first (preserve behavior)
2. Move code to appropriate layer
3. Update imports
4. Run tests
5. Clean up old code
```

---

## 📊 Metrics & Monitoring

### Code Quality
- **Lines of Code:** Track per layer
- **Test Coverage:** >= 80%
- **Complexity:** Cyclomatic complexity < 10
- **Duplication:** < 5%

### Performance
- **Response Time:** < 500ms
- **Database Queries:** < 100ms
- **Memory Usage:** < 512MB
- **CPU Usage:** < 70%

---

## 🚀 Next Steps

1. **Week 1:** Create new folder structure
2. **Week 2:** Move and refactor files
3. **Week 3:** Update imports and test
4. **Week 4:** Documentation and deployment

---

**Maintained By:** KaDong Development Team  
**Contact:** tech@kadong.tools  
**Version:** 2.0.0 (Clean Architecture)
