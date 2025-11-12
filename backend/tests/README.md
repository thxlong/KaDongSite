# API Testing Framework

## 📁 Structure

```
tests/
├── unit/              # Unit tests cho controllers, utils, middleware
│   ├── controllers/   # Test business logic
│   ├── utils/         # Test utility functions
│   └── middleware/    # Test middleware logic
├── integration/       # Integration tests cho API endpoints
│   ├── api/           # Test HTTP endpoints
│   └── database/      # Test database operations
├── security/          # Security tests (SQL injection, XSS, etc)
├── performance/       # Performance & concurrency tests
├── fixtures/          # Static test data
├── helpers/           # Test utilities
│   ├── setup.js       # Global test setup
│   ├── dbHelper.js    # Database utilities
│   ├── factories.js   # Test data generators
│   └── authHelper.js  # Authentication utilities
└── mocks/             # Mock external APIs
    └── externalAPIs.js
```

## 🚀 Quick Start

### Run All Tests
```bash
npm test
```

### Run in Watch Mode (Development)
```bash
npm run test:watch
```

### Run with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Suite
```bash
npm run test:unit          # Only unit tests
npm run test:integration   # Only integration tests
npm run test:security      # Only security tests
npm run test:performance   # Only performance tests
```

### Run Specific Test File
```bash
npm test tests/unit/controllers/notes.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should create note"
```

## ✍️ Writing Tests

### Unit Test Example

```javascript
import { dbHelper, factories } from '@tests/helpers';

describe('Notes Controller', () => {
  let userId;
  
  beforeEach(async () => {
    const user = await dbHelper.insert('users', factories.user());
    userId = user.id;
  });
  
  describe('createNote()', () => {
    it('should create note with valid data', async () => {
      // Arrange
      const noteData = {
        title: 'Test Note',
        content: 'Test Content',
        color: 'pink'
      };
      
      // Act
      const result = await createNote(userId, noteData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe('Test Note');
    });
  });
});
```

### Integration Test Example

```javascript
import request from 'supertest';
import app from '@/app.js';
import { authHelper, dbHelper, factories } from '@tests/helpers';

describe('Notes API', () => {
  let authUser, authToken;
  
  beforeEach(async () => {
    const auth = await authHelper.createAuthenticatedUser();
    authUser = auth.user;
    authToken = auth.token;
  });
  
  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      // Arrange
      await dbHelper.insert('notes', factories.note(authUser.id));
      
      // Act
      const response = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });
});
```

## 🎯 Best Practices

### 1. Test Independence
- Each test should be independent
- Use `beforeEach` to setup, `afterEach` to cleanup
- Don't share state between tests

### 2. Clear Test Names
- Format: `should [expected behavior] when [condition]`
- Example: `should return 404 when note does not exist`
- Be descriptive and specific

### 3. AAA Pattern
```javascript
it('should do something', async () => {
  // Arrange - Setup test data
  const testData = factories.note(userId);
  
  // Act - Execute the operation
  const result = await someFunction(testData);
  
  // Assert - Verify the outcome
  expect(result).toBeDefined();
});
```

### 4. Mock External APIs
```javascript
import { mockExternalAPIs } from '@tests/mocks/externalAPIs';

beforeEach(() => {
  mockExternalAPIs.mockWeatherAPI('Ho Chi Minh');
});

afterEach(() => {
  mockExternalAPIs.cleanAll();
});
```

### 5. Test Error Cases
```javascript
it('should return 400 when title is missing', async () => {
  const response = await request(app)
    .post('/api/notes')
    .send({ content: 'No title' });
  
  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});
```

## 🔧 Test Utilities

### dbHelper
```javascript
// Insert test data
const user = await dbHelper.insert('users', { email: 'test@example.com', ... });

// Find by ID
const note = await dbHelper.findById('notes', noteId);

// Count rows
const count = await dbHelper.count('notes', { user_id: userId });

// Truncate table
await dbHelper.truncate('notes');

// Raw query
await dbHelper.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
```

### factories
```javascript
// Generate user
const userData = factories.user({ role: 'admin' });

// Generate note
const noteData = factories.note(userId, { pinned: true });

// Generate event
const eventData = factories.event(userId);

// Generate wishlist item
const wishlistData = factories.wishlistItem(userId);
```

### authHelper
```javascript
// Create authenticated user
const { user, token } = await authHelper.createAuthenticatedUser('user');

// Get auth header
const headers = authHelper.getAuthHeader(token);

// Generate expired token
const expiredToken = authHelper.generateExpiredToken(userId);
```

## 🐛 Troubleshooting

### Tests fail with database error
- Check `.testenv` file exists
- Verify test database is running
- Run migrations: `npm run db:migrate:test`

### Tests are slow
- Use `--maxWorkers=50%` flag
- Check for missing `await` keywords
- Profile with `--detectLeaks`

### Flaky tests
- Add proper wait/sleep where needed
- Check for shared state between tests
- Verify database cleanup works

### Import errors
- Make sure to use ES modules syntax
- Check file extensions (should be .js)
- Verify module aliases in jest.config.js

## 📊 Coverage Report

After running tests with coverage:
```bash
npm run test:coverage
```

View HTML report:
```bash
open coverage/index.html  # Mac/Linux
start coverage/index.html # Windows
```

## 🎓 Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Nock Documentation](https://github.com/nock/nock)

---

**Maintained by:** QA & Backend Team  
**Last Updated:** 2025-11-12
