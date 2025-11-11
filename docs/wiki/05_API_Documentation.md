# 📡 05. API Documentation - Tài liệu API

## 5.1 API Overview

**Base URL**: `http://localhost:5000/api`  
**Protocol**: HTTP/HTTPS  
**Data Format**: JSON  
**Authentication**: Bearer Token (JWT)  
**CORS**: Enabled for `http://localhost:5173`

### API Architecture

```
Client (Frontend)
    ↓ HTTP Request (JSON)
Express Server
    ↓
CORS Middleware
    ↓
Authentication Middleware (if protected)
    ↓
Route Handler
    ↓
Controller (Business Logic)
    ↓
Database (PostgreSQL)
    ↓ Query Result
Controller
    ↓ JSON Response
Client
```

---

## 5.2 Response Format Standards

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully" // Optional
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional, for validation errors
  }
}
```

### Pagination Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 5.3 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| **200** | OK | Successful GET, PUT, DELETE |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE (no response body) |
| **400** | Bad Request | Invalid request data |
| **401** | Unauthorized | Missing or invalid authentication |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Resource already exists (e.g., duplicate email) |
| **422** | Unprocessable Entity | Validation errors |
| **500** | Internal Server Error | Server-side error |

---

## 5.4 Authentication

### Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "ka@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-1234",
      "email": "ka@example.com",
      "username": "Ka"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-11-18T15:30:00Z"
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

### Using Bearer Token

**All protected routes require Authorization header**:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example with curl**:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     http://localhost:5000/api/notes
```

**Example with JavaScript fetch**:
```javascript
fetch('http://localhost:5000/api/notes', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 5.5 Notes API

### Get All Notes

**Endpoint**: `GET /api/notes`  
**Authentication**: Required  
**Description**: Lấy tất cả notes của user hiện tại

**Query Parameters**:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | integer | Page number | 1 |
| `limit` | integer | Items per page | 20 |
| `pinned` | boolean | Filter pinned notes | - |
| `color` | string | Filter by color | - |
| `search` | string | Search in title/content | - |

**Example Request**:
```http
GET /api/notes?page=1&limit=10&pinned=true
Authorization: Bearer YOUR_TOKEN
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "note-uuid-1",
      "user_id": "user-uuid",
      "title": "Shopping List",
      "content": "- Milk\n- Bread\n- Eggs",
      "color": "mint",
      "is_pinned": true,
      "created_at": "2024-11-10T09:00:00Z",
      "updated_at": "2024-11-11T10:30:00Z"
    },
    {
      "id": "note-uuid-2",
      "user_id": "user-uuid",
      "title": "Meeting Notes",
      "content": "Discuss Q4 planning...",
      "color": "pink",
      "is_pinned": false,
      "created_at": "2024-11-09T14:00:00Z",
      "updated_at": "2024-11-09T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### Get Single Note

**Endpoint**: `GET /api/notes/:id`  
**Authentication**: Required

**Example Request**:
```http
GET /api/notes/note-uuid-1234
Authorization: Bearer YOUR_TOKEN
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "note-uuid-1234",
    "user_id": "user-uuid",
    "title": "Shopping List",
    "content": "- Milk\n- Bread",
    "color": "mint",
    "is_pinned": true,
    "created_at": "2024-11-10T09:00:00Z",
    "updated_at": "2024-11-11T10:30:00Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "Note with ID note-uuid-1234 not found"
  }
}
```

---

### Create Note

**Endpoint**: `POST /api/notes`  
**Authentication**: Required

**Request Body**:
```json
{
  "title": "New Note",
  "content": "Note content here",
  "color": "pink",
  "is_pinned": false
}
```

**Validation Rules**:
- `title`: required, max 200 characters
- `content`: required, max 10000 characters
- `color`: optional, one of: pink, purple, mint, yellow
- `is_pinned`: optional, boolean

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "note-uuid-5678",
    "user_id": "user-uuid",
    "title": "New Note",
    "content": "Note content here",
    "color": "pink",
    "is_pinned": false,
    "created_at": "2024-11-11T15:30:00Z",
    "updated_at": "2024-11-11T15:30:00Z"
  },
  "message": "Note created successfully"
}
```

**Error Response** (422 Unprocessable Entity):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "title": "Title is required",
      "content": "Content must be less than 10000 characters"
    }
  }
}
```

---

### Update Note

**Endpoint**: `PUT /api/notes/:id`  
**Authentication**: Required

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "content": "Updated content",
  "color": "purple",
  "is_pinned": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "note-uuid-1234",
    "title": "Updated Title",
    "content": "Updated content",
    "color": "purple",
    "is_pinned": true,
    "updated_at": "2024-11-11T16:00:00Z"
  },
  "message": "Note updated successfully"
}
```

---

### Delete Note (Soft Delete)

**Endpoint**: `DELETE /api/notes/:id`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "error": {
    "code": "NOTE_NOT_FOUND",
    "message": "Note not found or already deleted"
  }
}
```

---

## 5.6 Countdown Events API

### Get All Events

**Endpoint**: `GET /api/events`  
**Authentication**: Required

**Query Parameters**:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `active` | boolean | Filter active events | - |
| `past` | boolean | Get past events | false |
| `upcoming` | boolean | Get upcoming events | false |

**Example Request**:
```http
GET /api/events?upcoming=true
Authorization: Bearer YOUR_TOKEN
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "event-uuid-1",
      "user_id": "user-uuid",
      "title": "💕 Ngày yêu nhau",
      "description": "Ngày đầu tiên gặp nhau",
      "target_date": "2020-01-15T00:00:00Z",
      "color": "pink",
      "is_active": true,
      "days_until": 1520,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-11-11T15:00:00Z"
    }
  ]
}
```

---

### Create Event

**Endpoint**: `POST /api/events`  
**Authentication**: Required

**Request Body**:
```json
{
  "title": "💍 Wedding Day",
  "description": "Our special day",
  "target_date": "2025-06-15T10:00:00Z",
  "color": "purple",
  "is_active": true
}
```

**Validation Rules**:
- `title`: required, max 200 characters
- `target_date`: required, ISO 8601 format
- `description`: optional, max 1000 characters
- `color`: optional, one of: pink, purple, mint, yellow
- `is_active`: optional, boolean

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "event-uuid-9012",
    "title": "💍 Wedding Day",
    "target_date": "2025-06-15T10:00:00Z",
    "days_until": 216,
    "created_at": "2024-11-11T15:30:00Z"
  }
}
```

---

### Update Event

**Endpoint**: `PUT /api/events/:id`  
**Authentication**: Required

**Request Body**:
```json
{
  "title": "Updated Title",
  "target_date": "2025-07-01T00:00:00Z",
  "is_active": false
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "event-uuid-1234",
    "title": "Updated Title",
    "target_date": "2025-07-01T00:00:00Z",
    "is_active": false,
    "updated_at": "2024-11-11T16:00:00Z"
  }
}
```

---

### Delete Event

**Endpoint**: `DELETE /api/events/:id`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## 5.7 Tools API

### Get All Tools

**Endpoint**: `GET /api/tools`  
**Authentication**: Optional (public)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "tool-uuid-1",
      "name": "notes",
      "display_name": "Notes Tool",
      "description": "Manage personal notes with color coding",
      "icon": "StickyNote",
      "config": {
        "max_length": 5000,
        "allowed_colors": ["pink", "purple", "mint", "yellow"]
      },
      "is_active": true
    },
    {
      "id": "tool-uuid-2",
      "name": "countdown",
      "display_name": "Countdown Tool",
      "description": "Track important dates and events",
      "icon": "Clock",
      "config": {
        "max_events": 50
      },
      "is_active": true
    }
  ]
}
```

---

### Get Tool by Name

**Endpoint**: `GET /api/tools/:name`  
**Authentication**: Optional

**Example Request**:
```http
GET /api/tools/notes
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "tool-uuid-1",
    "name": "notes",
    "display_name": "Notes Tool",
    "description": "Manage personal notes",
    "icon": "StickyNote",
    "config": {
      "max_length": 5000
    }
  }
}
```

---

## 5.8 Feedback API

### Submit Feedback

**Endpoint**: `POST /api/feedback`  
**Authentication**: Required

**Request Body**:
```json
{
  "type": "feature",
  "message": "Add dark mode support",
  "rating": 5
}
```

**Validation Rules**:
- `type`: required, one of: bug, feature, general
- `message`: required, max 2000 characters
- `rating`: optional, integer 1-5

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "feedback-uuid-1234",
    "type": "feature",
    "message": "Add dark mode support",
    "rating": 5,
    "status": "pending",
    "created_at": "2024-11-11T15:30:00Z"
  },
  "message": "Feedback submitted successfully. Thank you!"
}
```

---

### Get User's Feedback

**Endpoint**: `GET /api/feedback/me`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "feedback-uuid-1",
      "type": "feature",
      "message": "Add dark mode",
      "rating": 5,
      "status": "pending",
      "created_at": "2024-11-11T15:30:00Z"
    }
  ]
}
```

---

## 5.9 Currency API

### Get Latest Rates

**Endpoint**: `GET /api/currency/rates`  
**Authentication**: Optional

**Query Parameters**:
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `base` | string | Base currency code | USD |

**Example Request**:
```http
GET /api/currency/rates?base=USD
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "base_currency": "USD",
    "rates": {
      "VND": 24500,
      "EUR": 0.92,
      "GBP": 0.79,
      "JPY": 149.50,
      "CNY": 7.23
    },
    "fetched_at": "2024-11-11T12:00:00Z"
  }
}
```

---

### Convert Currency

**Endpoint**: `POST /api/currency/convert`  
**Authentication**: Optional

**Request Body**:
```json
{
  "from": "USD",
  "to": "VND",
  "amount": 100
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "VND",
    "amount": 100,
    "result": 2450000,
    "rate": 24500,
    "timestamp": "2024-11-11T15:30:00Z"
  }
}
```

---

## 5.10 Users API

### Get Current User

**Endpoint**: `GET /api/users/me`  
**Authentication**: Required

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "user-uuid-1234",
    "email": "ka@example.com",
    "username": "Ka",
    "preferences": {
      "theme": "pastel-pink",
      "language": "vi",
      "notifications": true
    },
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

---

### Update User Profile

**Endpoint**: `PUT /api/users/me`  
**Authentication**: Required

**Request Body**:
```json
{
  "username": "Ka Nguyen",
  "preferences": {
    "theme": "pastel-purple",
    "language": "en"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "user-uuid-1234",
    "username": "Ka Nguyen",
    "preferences": {
      "theme": "pastel-purple",
      "language": "en"
    },
    "updated_at": "2024-11-11T16:00:00Z"
  }
}
```

---

### Update Password

**Endpoint**: `PUT /api/users/me/password`  
**Authentication**: Required

**Request Body**:
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword456"
}
```

**Validation Rules**:
- `current_password`: required
- `new_password`: required, min 8 characters, must contain uppercase, lowercase, number

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "Current password is incorrect"
  }
}
```

---

## 5.11 Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `TOKEN_EXPIRED` | 401 | JWT token expired |
| `TOKEN_INVALID` | 401 | JWT token invalid |
| `UNAUTHORIZED` | 401 | No authentication token |
| `FORBIDDEN` | 403 | Not allowed to access resource |
| `NOT_FOUND` | 404 | Resource not found |
| `NOTE_NOT_FOUND` | 404 | Note not found |
| `EVENT_NOT_FOUND` | 404 | Event not found |
| `USER_NOT_FOUND` | 404 | User not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `INTERNAL_ERROR` | 500 | Server internal error |

---

## 5.12 Rate Limiting

**Current Limits**:
- **General**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **API Writes**: 50 POST/PUT/DELETE per hour per user

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1699707600
```

**Error Response** (429 Too Many Requests):
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 10 minutes."
  }
}
```

---

## 5.13 API Testing with Postman

### Import Collection

1. Download Postman collection: `docs/postman/KaDong_API.postman_collection.json`
2. Import vào Postman: File → Import
3. Setup environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (your JWT token)

### Example Collection Structure

```
KaDong API Collection
├── Auth
│   ├── Login
│   └── Logout
├── Notes
│   ├── Get All Notes
│   ├── Get Single Note
│   ├── Create Note
│   ├── Update Note
│   └── Delete Note
├── Events
│   ├── Get All Events
│   ├── Create Event
│   ├── Update Event
│   └── Delete Event
└── Tools
    └── Get All Tools
```

---

## 5.14 API Testing with curl

### Notes Examples

```bash
# Get all notes
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/notes

# Create note
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Note","content":"Test content"}' \
     http://localhost:5000/api/notes

# Update note
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"Updated Title"}' \
     http://localhost:5000/api/notes/note-uuid-1234

# Delete note
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/notes/note-uuid-1234
```

---

## 📎 Related Links

- **[Database Schema](04_DatabaseSchema.md)** - Database structure
- **[Frontend Overview](06_FrontendOverview.md)** - How frontend uses API
- **[Setup Guide](03_SetupAndInstallation.md)** - Start API server
- **[Troubleshooting](09_Troubleshooting.md)** - API errors

---

**Version**: 1.0  
**Last Updated**: November 11, 2024  
**Author**: KaDong Team
