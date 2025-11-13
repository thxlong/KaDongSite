/**
 * Authentication API Integration Tests
 * Tests all auth endpoints: register, login, logout, me, refresh, forgot-password, reset-password
 */

import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'
const API_AUTH_URL = `${API_BASE_URL}/api/auth`

// Test data
let testUser = {
  email: '',
  password: 'TestPassword123!',
  name: 'Test User'
}

let authToken = ''
let resetToken = ''

test.describe('Authentication API', () => {
  
  test.beforeEach(() => {
    // Generate unique email for each test
    testUser.email = faker.internet.email().toLowerCase()
  })

  test.describe('POST /api/auth/register', () => {
    
    test('should register a new user successfully', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      expect(response.status()).toBe(201)
      const data = await response.json()
      
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('user')
      expect(data.data.user).toHaveProperty('id')
      expect(data.data.user).toHaveProperty('email', testUser.email)
      expect(data.data.user).toHaveProperty('name', testUser.name)
      expect(data.data.user).toHaveProperty('role', 'user')
      expect(data.data.user).not.toHaveProperty('password_hash')
      
      // Check cookie is set
      const cookies = response.headers()['set-cookie']
      expect(cookies).toBeTruthy()
      expect(cookies).toContain('token=')
    })

    test('should reject registration with duplicate email', async ({ request }) => {
      // Register first time
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      // Try to register again with same email
      const response = await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: 'DifferentPassword123!',
          name: 'Different Name'
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message).toContain('email')
    })

    test('should reject registration with invalid email', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: 'invalid-email',
          password: testUser.password,
          name: testUser.name
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message).toContain('email')
    })

    test('should reject registration with weak password', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: 'weak',
          name: testUser.name
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message.toLowerCase()).toMatch(/password|mật khẩu/)
    })

    test('should reject registration with missing required fields', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email
          // Missing password
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('POST /api/auth/login', () => {
    
    test.beforeEach(async ({ request }) => {
      // Register a user before login tests
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })
    })

    test('should login successfully with correct credentials', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      expect(response.status()).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('user')
      expect(data.data.user.email).toBe(testUser.email)
      expect(data.data).toHaveProperty('expiresIn')
      
      // Check cookie
      const cookies = response.headers()['set-cookie']
      expect(cookies).toBeTruthy()
      expect(cookies).toContain('token=')
      
      // Save token for other tests
      const tokenMatch = cookies.match(/token=([^;]+)/)
      if (tokenMatch) {
        authToken = tokenMatch[1]
      }
    })

    test('should login with rememberMe and get longer session', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: true
        }
      })

      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data.data.expiresIn).toContain('30d')
    })

    test('should reject login with wrong password', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: 'WrongPassword123!',
          rememberMe: false
        }
      })

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message.toLowerCase()).toMatch(/invalid|sai|không đúng/)
    })

    test('should reject login with non-existent user', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: 'nonexistent@example.com',
          password: testUser.password,
          rememberMe: false
        }
      })

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })

    test('should reject login with missing credentials', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email
          // Missing password
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('GET /api/auth/me', () => {
    
    test.beforeEach(async ({ request }) => {
      // Register and login
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      const loginResponse = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const cookies = loginResponse.headers()['set-cookie']
      const tokenMatch = cookies.match(/token=([^;]+)/)
      if (tokenMatch) {
        authToken = tokenMatch[1]
      }
    })

    test('should get current user with valid token', async ({ request }) => {
      const response = await request.get(`${API_AUTH_URL}/me`, {
        headers: {
          'Cookie': `token=${authToken}`
        }
      })

      expect(response.status()).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('user')
      expect(data.data.user.email).toBe(testUser.email)
      expect(data.data.user.name).toBe(testUser.name)
      expect(data.data.user).not.toHaveProperty('password_hash')
    })

    test('should reject request without token', async ({ request }) => {
      const response = await request.get(`${API_AUTH_URL}/me`)

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message.toLowerCase()).toMatch(/token|xác thực|unauthorized/)
    })

    test('should reject request with invalid token', async ({ request }) => {
      const response = await request.get(`${API_AUTH_URL}/me`, {
        headers: {
          'Cookie': 'token=invalid_token_xyz'
        }
      })

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('POST /api/auth/logout', () => {
    
    test.beforeEach(async ({ request }) => {
      // Register and login
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      const loginResponse = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const cookies = loginResponse.headers()['set-cookie']
      const tokenMatch = cookies.match(/token=([^;]+)/)
      if (tokenMatch) {
        authToken = tokenMatch[1]
      }
    })

    test('should logout successfully', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/logout`, {
        headers: {
          'Cookie': `token=${authToken}`
        }
      })

      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('success', true)
      
      // Verify token is revoked - subsequent request should fail
      const meResponse = await request.get(`${API_AUTH_URL}/me`, {
        headers: {
          'Cookie': `token=${authToken}`
        }
      })
      
      expect(meResponse.status()).toBe(401)
    })

    test('should reject logout without token', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/logout`)

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('POST /api/auth/refresh', () => {
    
    test.beforeEach(async ({ request }) => {
      // Register and login
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      const loginResponse = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const cookies = loginResponse.headers()['set-cookie']
      const tokenMatch = cookies.match(/token=([^;]+)/)
      if (tokenMatch) {
        authToken = tokenMatch[1]
      }
    })

    test('should refresh token successfully', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/refresh`, {
        headers: {
          'Cookie': `token=${authToken}`
        }
      })

      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('success', true)
      expect(data.data).toHaveProperty('expiresIn')
      
      // Check new cookie
      const cookies = response.headers()['set-cookie']
      expect(cookies).toBeTruthy()
      expect(cookies).toContain('token=')
    })

    test('should reject refresh without token', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/refresh`)

      expect(response.status()).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('POST /api/auth/forgot-password', () => {
    
    test.beforeEach(async ({ request }) => {
      // Register a user
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })
    })

    test('should send reset email successfully', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/forgot-password`, {
        data: {
          email: testUser.email
        }
      })

      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('success', true)
      expect(data.message).toBeTruthy()
      
      // Note: In production, email would be sent. In tests, we just verify response.
    })

    test('should return success even for non-existent email (security)', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/forgot-password`, {
        data: {
          email: 'nonexistent@example.com'
        }
      })

      // Should return success to not reveal if email exists
      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('success', true)
    })

    test('should reject request with invalid email format', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/forgot-password`, {
        data: {
          email: 'invalid-email'
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })

    test('should reject request without email', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/forgot-password`, {
        data: {}
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('POST /api/auth/reset-password', () => {
    
    test.beforeEach(async ({ request }) => {
      // Register user and request password reset
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      // In real scenario, we'd get token from email. For testing, we need to query DB or mock.
      // For now, we'll test with a mock token scenario
    })

    test('should reject reset with invalid token', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/reset-password`, {
        data: {
          token: 'invalid_token_12345',
          newPassword: 'NewPassword123!'
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message.toLowerCase()).toMatch(/token|invalid|hết hạn/)
    })

    test('should reject reset with weak password', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/reset-password`, {
        data: {
          token: 'some_valid_token',
          newPassword: 'weak'
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
      expect(data.message.toLowerCase()).toMatch(/password|mật khẩu/)
    })

    test('should reject reset without required fields', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/reset-password`, {
        data: {
          token: 'some_token'
          // Missing newPassword
        }
      })

      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('success', false)
    })
  })

  test.describe('Security & Rate Limiting', () => {
    
    test('should not reveal if user exists in error messages', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: 'nonexistent@example.com',
          password: 'SomePassword123!'
        }
      })

      const data = await response.json()
      // Error message should be generic, not "User not found"
      expect(data.message.toLowerCase()).not.toContain('user not found')
      expect(data.message.toLowerCase()).not.toContain('không tồn tại')
    })

    test('should not return password hash in any response', async ({ request }) => {
      // Register
      const registerResponse = await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      const registerData = await registerResponse.json()
      expect(JSON.stringify(registerData)).not.toContain('password_hash')
      expect(JSON.stringify(registerData)).not.toContain('passwordHash')

      // Login
      const loginResponse = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const loginData = await loginResponse.json()
      expect(JSON.stringify(loginData)).not.toContain('password_hash')
      expect(JSON.stringify(loginData)).not.toContain('passwordHash')
    })

    test('should set httpOnly cookie for security', async ({ request }) => {
      const response = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const cookies = response.headers()['set-cookie']
      expect(cookies.toLowerCase()).toContain('httponly')
    })
  })

  test.describe('Performance', () => {
    
    test('login should respond within 500ms', async ({ request }) => {
      // Register first
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      const startTime = Date.now()
      
      await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(500)
    })

    test('token verification should be fast (<100ms)', async ({ request }) => {
      // Register and login
      await request.post(`${API_AUTH_URL}/register`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          name: testUser.name
        }
      })

      const loginResponse = await request.post(`${API_AUTH_URL}/login`, {
        data: {
          email: testUser.email,
          password: testUser.password,
          rememberMe: false
        }
      })

      const cookies = loginResponse.headers()['set-cookie']
      const tokenMatch = cookies.match(/token=([^;]+)/)
      const token = tokenMatch ? tokenMatch[1] : ''

      const startTime = Date.now()
      
      await request.get(`${API_AUTH_URL}/me`, {
        headers: {
          'Cookie': `token=${token}`
        }
      })

      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(100)
    })
  })
})
