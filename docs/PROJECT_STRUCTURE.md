# 🧩 02. Project Structure - Cấu trúc dự án

## 2.1 Cấu trúc thư mục tổng thể

```
KaDongSite/
├── 📂 frontend/                    # React application
│   ├── public/                     # Static assets
│   ├── src/                        # Source code
│   ├── index.html                  # HTML template
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── tailwind.config.js          # Tailwind CSS config
│
├── 📂 backend/                     # Node.js + Express API
│   ├── config/                     # Configuration files
│   ├── controllers/                # Business logic
│   ├── routes/                     # API routes
│   ├── models/                     # Data models
│   ├── database/                   # Database files
│   │   ├── migrations/             # SQL migration scripts
│   │   ├── seeds/                  # Seed data
│   │   └── queries/                # SQL query examples
│   ├── scripts/                    # Utility scripts
│   ├── app.js                      # Express app entry
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables
│
├── 📂 docs/                        # Documentation
│   ├── wiki/                       # Wiki pages
│   ├── api/                        # API documentation
│   └── diagrams/                   # Architecture diagrams
│
├── 📄 README.md                    # Project overview
├── 📄 QUICKSTART.md                # Quick start guide
├── 📄 .gitignore                   # Git ignore rules
└── 📄 LICENSE                      # License file
```

---

## 2.2 Frontend Structure

### Cấu trúc chi tiết

```
frontend/src/
├── 📂 components/              # Reusable UI components
│   ├── Header.jsx              # Top navigation bar
│   ├── SidebarMenu.jsx         # Left sidebar with tools
│   ├── Footer.jsx              # Bottom footer
│   ├── ToolCard.jsx            # Tool display card
│   └── ...                     # Other shared components
│
├── 📂 pages/                   # Page components (Routes)
│   ├── Home.jsx                # Landing page
│   ├── CountdownTool.jsx       # Countdown events page
│   ├── CalendarTool.jsx        # Calendar page
│   ├── NotesTool.jsx           # Notes management page
│   ├── CurrencyTool.jsx        # Currency converter page
│   └── ...                     # Future tools
│
├── 📂 hooks/                   # Custom React hooks
│   ├── useLocalStorage.js      # LocalStorage hook
│   ├── useDebounce.js          # Debounce hook
│   └── useApi.js               # API call hook
│
├── 📂 utils/                   # Utility functions
│   ├── api.js                  # API client
│   ├── helpers.js              # Helper functions
│   ├── constants.js            # Constants
│   └── validators.js           # Form validators
│
├── 📂 assets/                  # Images, icons, fonts
│   ├── images/
│   └── icons/
│
├── 📄 App.jsx                  # Root component
├── 📄 main.jsx                 # Entry point
└── 📄 index.css                # Global styles
```

### Component Hierarchy

```
App
├── Header
├── SidebarMenu
│   └── NavLink (×5)
├── Router
│   ├── Home
│   │   └── ToolCard (×4)
│   ├── CountdownTool
│   │   ├── Form
│   │   └── EventCard (×N)
│   ├── CalendarTool
│   │   └── CalendarGrid
│   ├── NotesTool
│   │   ├── NoteForm
│   │   └── NoteCard (×N)
│   └── CurrencyTool
│       ├── CurrencySelect
│       └── ExchangeRateTable
└── Footer
```

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | PascalCase.jsx | `Header.jsx`, `ToolCard.jsx` |
| **Pages** | PascalCase.jsx | `Home.jsx`, `NotesTool.jsx` |
| **Hooks** | useCamelCase.js | `useLocalStorage.js` |
| **Utils** | camelCase.js | `api.js`, `helpers.js` |
| **Constants** | UPPER_CASE.js | `API_ENDPOINTS.js` |

---

## 2.3 Backend Structure

### Cấu trúc chi tiết

```
backend/
├── 📂 config/                      # Configuration
│   ├── database.js                 # DB connection pool
│   └── constants.js                # Server constants
│
├── 📂 controllers/                 # Business logic
│   ├── notesController.js          # Notes CRUD
│   ├── eventsController.js         # Countdown events CRUD
│   ├── feedbackController.js       # Feedback handling
│   ├── toolsController.js          # Tools metadata
│   └── usersController.js          # User management
│
├── 📂 routes/                      # Express routes
│   ├── notes.js                    # /api/notes
│   ├── events.js                   # /api/events
│   ├── feedback.js                 # /api/feedback
│   ├── tools.js                    # /api/tools
│   └── users.js                    # /api/users
│
├── 📂 models/                      # Data models (optional)
│   ├── Note.js                     # Note model
│   ├── Event.js                    # Event model
│   └── User.js                     # User model
│
├── 📂 middleware/                  # Express middleware
│   ├── auth.js                     # Authentication
│   ├── errorHandler.js             # Error handling
│   └── validation.js               # Request validation
│
├── 📂 database/                    # Database files
│   ├── 📂 migrations/              # SQL migrations
│   │   ├── 001_up_initial_schema.sql
│   │   └── 001_down_rollback.sql
│   ├── 📂 seeds/                   # Seed data
│   │   └── seed_data.sql
│   ├── 📂 queries/                 # SQL examples
│   │   └── example_queries.sql
│   ├── SCHEMA_DESIGN.md            # ERD documentation
│   ├── SETUP_GUIDE.md              # Setup instructions
│   └── BEST_PRACTICES.md           # DB best practices
│
├── 📂 scripts/                     # Utility scripts
│   ├── migrate.js                  # Migration runner
│   ├── seed.js                     # Seed runner
│   └── test-db.js                  # DB connection test
│
├── 📄 app.js                       # Express application
├── 📄 server.js                    # Server entry point (optional)
├── 📄 package.json                 # Dependencies
├── 📄 .env                         # Environment variables
├── 📄 .env.example                 # Environment template
└── 📄 README.md                    # Backend docs
```

### Request Flow

```
HTTP Request
    ↓
Express Server (app.js)
    ↓
Middleware (auth, validation)
    ↓
Route Handler (routes/notes.js)
    ↓
Controller (controllers/notesController.js)
    ↓
Database Query (config/database.js)
    ↓
PostgreSQL Database
    ↓
Response (JSON)
    ↓
Client (Frontend)
```

### API Route Structure

```javascript
// routes/notes.js
import express from 'express'
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js'

const router = express.Router()

router.get('/', getNotes)           // GET /api/notes
router.post('/', createNote)         // POST /api/notes
router.put('/:id', updateNote)       // PUT /api/notes/:id
router.delete('/:id', deleteNote)    // DELETE /api/notes/:id

export default router
```

---

## 2.4 Mô tả chức năng từng thư mục

### Frontend Directories

#### 📂 `components/`
**Mục đích**: Chứa các React components có thể tái sử dụng

**Đặc điểm**:
- Pure components hoặc có logic nhỏ
- Có thể dùng ở nhiều pages
- Props-driven (nhận data qua props)

**Example**:
```jsx
// components/ToolCard.jsx
import { motion } from 'framer-motion'

const ToolCard = ({ title, description, icon, color, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} rounded-3xl p-6`}
      onClick={onClick}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}
```

---

#### 📂 `pages/`
**Mục đích**: Chứa các page components (route-level)

**Đặc điểm**:
- Một page = một route
- Có thể fetch data
- Compose nhiều components
- Manage state riêng

**Example**:
```jsx
// pages/NotesTool.jsx
import { useState, useEffect } from 'react'
import NoteCard from '../components/NoteCard'

const NotesTool = () => {
  const [notes, setNotes] = useState([])
  
  useEffect(() => {
    fetchNotes()
  }, [])
  
  return (
    <div>
      <h1>My Notes</h1>
      {notes.map(note => <NoteCard key={note.id} {...note} />)}
    </div>
  )
}
```

---

#### 📂 `hooks/`
**Mục đích**: Custom React hooks cho logic tái sử dụng

**Đặc điểm**:
- Bắt đầu với prefix `use`
- Encapsulate stateful logic
- Có thể compose với hooks khác

**Example**:
```javascript
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])
  
  return [value, setValue]
}
```

---

#### 📂 `utils/`
**Mục đích**: Utility functions và helpers

**Đặc điểm**:
- Pure functions (no side effects)
- Independent (không depend vào React)
- Testable

**Example**:
```javascript
// utils/api.js
const API_BASE = 'http://localhost:5000/api'

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE}${endpoint}`)
    return res.json()
  },
  
  post: async (endpoint, data) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  }
}
```

---

### Backend Directories

#### 📂 `controllers/`
**Mục đích**: Business logic và data processing

**Trách nhiệm**:
- Xử lý request từ routes
- Validate input data
- Gọi database queries
- Format response
- Handle errors

**Example**:
```javascript
// controllers/notesController.js
import { query } from '../config/database.js'

export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id
    const result = await query(
      'SELECT * FROM notes WHERE user_id = $1 AND deleted_at IS NULL',
      [userId]
    )
    res.json({ success: true, data: result.rows })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

---

#### 📂 `routes/`
**Mục đích**: Define API endpoints

**Trách nhiệm**:
- Map HTTP methods to controllers
- Apply middleware (auth, validation)
- Group related endpoints

**Example**:
```javascript
// routes/notes.js
import express from 'express'
import { getNotes, createNote } from '../controllers/notesController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.use(authenticate)  // Apply to all routes

router.get('/', getNotes)
router.post('/', createNote)

export default router
```

---

#### 📂 `models/`
**Mục đích**: Data models và schemas (optional với raw SQL)

**Đặc điểm**:
- Define data structure
- Validation rules
- Relationships
- Methods cho business logic

**Note**: Với PostgreSQL + pg driver, models là optional. Có thể dùng raw SQL trực tiếp trong controllers.

---

#### 📂 `middleware/`
**Mục đích**: Express middleware functions

**Trách nhiệm**:
- Authentication
- Authorization
- Request validation
- Error handling
- Logging

**Example**:
```javascript
// middleware/auth.js
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // Verify token
  const user = verifyToken(token)
  req.user = user
  next()
}
```

---

#### 📂 `database/`
**Mục đích**: Database-related files

**Chứa**:
- SQL migration scripts
- Seed data
- Query examples
- Schema documentation

**Workflow**:
```
1. Design schema (ERD)
2. Write migration SQL
3. Run migration → Create tables
4. Run seed → Insert test data
5. Use queries in controllers
```

---

#### 📂 `scripts/`
**Mục đích**: Utility scripts cho development

**Chứa**:
- `migrate.js` - Run database migrations
- `seed.js` - Load seed data
- `test-db.js` - Test database connection

**Usage**:
```bash
npm run db:migrate:up    # Run migrations
npm run db:seed          # Load seed data
npm run db:test          # Test connection
```

---

## 2.5 Quy ước đặt tên & Code Style

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| React Components | PascalCase | `Header.jsx`, `ToolCard.jsx` |
| Hooks | useCamelCase | `useLocalStorage.js` |
| Utils | camelCase | `api.js`, `helpers.js` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.js` |
| Routes | lowercase | `notes.js`, `events.js` |
| Controllers | camelCase | `notesController.js` |

### Variable Naming

```javascript
// ✅ Good
const userName = 'Ka'
const isActive = true
const NOTE_MAX_LENGTH = 500
const userProfile = { name: 'Ka', age: 30 }

// ❌ Bad
const user_name = 'Ka'         // Use camelCase
const active = true            // Use is/has prefix for booleans
const noteMaxLength = 500      // Constants should be UPPER_CASE
```

### Function Naming

```javascript
// ✅ Good - Verb + Noun
const getNotes = () => {}
const createNote = (data) => {}
const isValidEmail = (email) => {}
const handleSubmit = (e) => {}

// ❌ Bad
const notes = () => {}          // Missing verb
const note = (data) => {}       // Unclear action
const checkEmail = (email) => {} // Less clear than isValid
```

### Component Structure

```jsx
// ✅ Good structure
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * Component description
 * @param {Object} props - Component props
 */
const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState(initial)
  
  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  // 3. Event handlers
  const handleClick = () => {
    // Handle event
  }
  
  // 4. Render helpers
  const renderItem = (item) => {
    return <div>{item}</div>
  }
  
  // 5. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
}

export default ComponentName
```

### Import Order

```javascript
// 1. External libraries
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

// 2. Internal components
import Header from './components/Header'
import ToolCard from './components/ToolCard'

// 3. Utilities
import { api } from './utils/api'
import { formatDate } from './utils/helpers'

// 4. Styles
import './styles.css'
```

### Comment Style

```javascript
// ✅ Good comments

// Single-line comment for simple explanation
const userId = getUserId()

/**
 * Multi-line JSDoc for functions
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User object
 */
const loginUser = async (email, password) => {
  // Implementation
}

// TODO: Add email validation
// FIXME: Fix memory leak in useEffect
// NOTE: This is temporary workaround
```

### Folder Organization Rules

#### 1. **Co-location**
Đặt files liên quan gần nhau

```
components/
├── Header/
│   ├── Header.jsx
│   ├── Header.css
│   └── Header.test.js
```

#### 2. **Index Files**
Sử dụng `index.js` để export

```javascript
// components/index.js
export { default as Header } from './Header'
export { default as Footer } from './Footer'

// Usage
import { Header, Footer } from './components'
```

#### 3. **Feature Folders**
Group by feature, not by type

```
// ✅ Good - Grouped by feature
features/
├── notes/
│   ├── NotesPage.jsx
│   ├── NoteCard.jsx
│   ├── useNotes.js
│   └── notes.api.js

// ❌ Bad - Grouped by type (harder to find related files)
pages/NotesPage.jsx
components/NoteCard.jsx
hooks/useNotes.js
api/notes.api.js
```

### Code Formatting

#### ESLint + Prettier
```json
// .eslintrc.json
{
  "extends": ["react-app", "prettier"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error"
  }
}

// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### Git Commit Messages

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat: Add new currency converter tool
fix: Fix countdown calculation bug
docs: Update API documentation
style: Format code with prettier
refactor: Refactor notes controller
test: Add tests for user auth
chore: Update dependencies

# Examples:
feat(notes): add search functionality
fix(calendar): correct month navigation
docs(wiki): add deployment guide
```

---

## 📎 Related Links

- **[Introduction](01_Introduction.md)** - Giới thiệu dự án
- **[Setup Guide](03_SetupAndInstallation.md)** - Cài đặt và chạy dự án
- **[Database Schema](04_DatabaseSchema.md)** - Chi tiết database
- **[API Documentation](05_API_Documentation.md)** - API endpoints

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
