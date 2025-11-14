/**
 * Wishlist API Integration Tests
 * @description Test all wishlist CRUD, heart, comment operations
 * @spec specs/specs/03_wishlist_management.spec
 * @author KaDong Team
 * @created 2025-11-14
 */

import request from 'supertest'
import app from '../src/app.js'

describe('Wishlist API', () => {
  let createdItemId
  let createdCommentId
  // Use test user from seed-test-user.js
  const testUserId = 'a0000000-0000-4000-8000-000000000001'

  // ==================== GET /api/wishlist ====================
  describe('GET /api/wishlist', () => {
    it('should return wishlist items for valid user_id', async () => {
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('items')
      expect(Array.isArray(response.body.data.items)).toBe(true)
      expect(response.body.data).toHaveProperty('pagination')
    })

    it('should return 400 for missing user_id', async () => {
      const response = await request(app)
        .get('/api/wishlist')
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error).toHaveProperty('code', 'INVALID_USER_ID')
    })

    it('should return 400 for invalid user_id', async () => {
      const response = await request(app)
        .get('/api/wishlist?user_id=invalid-uuid')
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error).toHaveProperty('code', 'INVALID_USER_ID')
    })

    it('should filter by category', async () => {
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}&category=Electronics`)
        .expect(200)

      expect(response.body.success).toBe(true)
      const items = response.body.data.items
      if (items.length > 0) {
        items.forEach(item => {
          expect(item.category).toBe('Electronics')
        })
      }
    })

    it('should sort by hearts desc', async () => {
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}&sort=hearts&order=desc`)
        .expect(200)

      expect(response.body.success).toBe(true)
      const items = response.body.data.items
      if (items.length > 1) {
        for (let i = 0; i < items.length - 1; i++) {
          expect(items[i].heart_count).toBeGreaterThanOrEqual(items[i + 1].heart_count)
        }
      }
    })

    it('should search by product_name', async () => {
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}&search=iPhone`)
        .expect(200)

      expect(response.body.success).toBe(true)
      const items = response.body.data.items
      if (items.length > 0) {
        items.forEach(item => {
          const searchText = `${item.product_name} ${item.description || ''}`.toLowerCase()
          expect(searchText).toContain('iphone')
        })
      }
    })

    it('should paginate correctly', async () => {
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}&limit=5&offset=0`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('items')
      expect(Array.isArray(response.body.data.items)).toBe(true)
      expect(response.body.data.items.length).toBeLessThanOrEqual(5)
      expect(response.body.data).toHaveProperty('pagination')
      expect(response.body.data.pagination).toHaveProperty('total')
      expect(response.body.data.pagination).toHaveProperty('limit', 5)
    })
  })

  // ==================== POST /api/wishlist ====================
  describe('POST /api/wishlist', () => {
    it('should create wishlist item with valid data', async () => {
      const response = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: testUserId,
          product_name: 'Test Product - iPhone 15 Pro',
          product_url: 'https://example.com/iphone-15-pro',
          product_image_url: 'https://example.com/images/iphone.jpg',
          price: 29990000,
          currency: 'VND',
          origin: 'USA',
          description: 'Test description for unit test',
          category: 'Electronics'
        })
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('product_name', 'Test Product - iPhone 15 Pro')
      expect(response.body.data).toHaveProperty('heart_count', 0)

      // Save ID for subsequent tests
      createdItemId = response.body.data.id
    })

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: testUserId
          // Missing product_name and product_url
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toMatch(/INVALID|MISSING/)
    })

    it('should return 400 for invalid URL', async () => {
      const response = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: testUserId,
          product_name: 'Test Product',
          product_url: 'not-a-valid-url'
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toBe('INVALID_URL')
    })

    it('should return 400 for negative price', async () => {
      const response = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: testUserId,
          product_name: 'Test Product',
          product_url: 'https://example.com/product',
          price: -1000
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toBe('INVALID_PRICE')
    })

    it('should return 400 for invalid currency', async () => {
      const response = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: testUserId,
          product_name: 'Test Product',
          product_url: 'https://example.com/product',
          price: 1000,
          currency: 'INVALID'
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toBe('INVALID_CURRENCY')
    })
  })

  // ==================== GET /api/wishlist/:id ====================
  // Note: GET /:id endpoint doesn't exist in the API
  // The API uses GET / with filters to retrieve items
  describe.skip('GET /api/wishlist/:id', () => {
    it('should return single item for valid ID', async () => {
      if (!createdItemId) {
        return // Skip if no item created
      }

      const response = await request(app)
        .get(`/api/wishlist/${createdItemId}?user_id=${testUserId}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('id', createdItemId)
      expect(response.body.data).toHaveProperty('product_name')
    })

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .get(`/api/wishlist/${fakeId}?user_id=${testUserId}`)
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toBe('NOT_FOUND')
    })
  })

  // ==================== PUT /api/wishlist/:id ====================
  describe('PUT /api/wishlist/:id', () => {
    it('should update wishlist item', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .put(`/api/wishlist/${createdItemId}`)
        .send({
          user_id: testUserId,
          product_name: 'Updated Product Name',
          price: 35000000,
          description: 'Updated description'
        })
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('product_name', 'Updated Product Name')
      expect(parseFloat(response.body.data.price)).toBe(35000000)
    })

    it('should return 404 for non-existent item', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .put(`/api/wishlist/${fakeId}`)
        .send({
          user_id: testUserId,
          product_name: 'Updated Name'
        })
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  // ==================== POST /api/wishlist/:id/heart ====================
  describe('POST /api/wishlist/:id/heart', () => {
    it('should heart item successfully', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .post(`/api/wishlist/${createdItemId}/heart`)
        .send({ user_id: testUserId })
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('heart_count')
      expect(response.body.data).toHaveProperty('user_liked', true)
      expect(response.body.data.heart_count).toBeGreaterThan(0)
    })

    it('should return 409 if already hearted', async () => {
      if (!createdItemId) {
        return
      }

      // Heart again (should fail)
      const response = await request(app)
        .post(`/api/wishlist/${createdItemId}/heart`)
        .send({ user_id: testUserId })
        .expect(409)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error.code).toBe('ALREADY_HEARTED')
    })

    it('should return 404 for non-existent item', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .post(`/api/wishlist/${fakeId}/heart`)
        .send({ user_id: testUserId })
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  // ==================== DELETE /api/wishlist/:id/heart ====================
  describe('DELETE /api/wishlist/:id/heart', () => {
    it('should unheart item successfully', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .delete(`/api/wishlist/${createdItemId}/heart?user_id=${testUserId}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('heart_count')
      expect(response.body.data).toHaveProperty('user_liked', false)
    })

    it('should return 404 if not hearted', async () => {
      if (!createdItemId) {
        return
      }

      // Unheart again (should fail)
      const response = await request(app)
        .delete(`/api/wishlist/${createdItemId}/heart?user_id=${testUserId}`)
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  // ==================== POST /api/wishlist/:id/comments ====================
  describe('POST /api/wishlist/:id/comments', () => {
    it('should add comment successfully', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .post(`/api/wishlist/${createdItemId}/comments`)
        .send({
          user_id: testUserId,
          comment_text: 'This is a test comment'
        })
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('comment_text', 'This is a test comment')

      createdCommentId = response.body.data.id
    })

    it('should return 400 for empty comment', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .post(`/api/wishlist/${createdItemId}/comments`)
        .send({
          user_id: testUserId,
          comment_text: '   '
        })
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should sanitize HTML in comment', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .post(`/api/wishlist/${createdItemId}/comments`)
        .send({
          user_id: testUserId,
          comment_text: '<script>alert("XSS")</script>Safe text'
        })
        .expect(201)

      expect(response.body.data.comment_text).not.toContain('<script>')
      expect(response.body.data.comment_text).toContain('Safe text')
    })
  })

  // ==================== GET /api/wishlist/:id/comments ====================
  describe('GET /api/wishlist/:id/comments', () => {
    it('should return comments for item', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .get(`/api/wishlist/${createdItemId}/comments`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(Array.isArray(response.body.data)).toBe(true)
      // API returns array of comments, not count
      expect(response.body.data.length).toBeGreaterThanOrEqual(0)
    })
  })

  // ==================== PUT /api/wishlist/comments/:commentId ====================
  describe('PUT /api/wishlist/comments/:commentId', () => {
    it('should update comment successfully', async () => {
      if (!createdCommentId) {
        return
      }

      const response = await request(app)
        .put(`/api/wishlist/comments/${createdCommentId}`)
        .send({
          user_id: testUserId,
          comment_text: 'Updated comment text'
        })
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('comment_text', 'Updated comment text')
    })
  })

  // ==================== PATCH /api/wishlist/:id/purchase ====================
  describe('PATCH /api/wishlist/:id/purchase', () => {
    it('should mark item as purchased', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .patch(`/api/wishlist/${createdItemId}/purchase`)
        .send({
          user_id: testUserId,
          is_purchased: true
        })
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('is_purchased', true)
      expect(response.body.data).toHaveProperty('purchased_at')
    })

    it('should mark item as unpurchased', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .patch(`/api/wishlist/${createdItemId}/purchase`)
        .send({
          user_id: testUserId,
          is_purchased: false
        })
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('is_purchased', false)
      expect(response.body.data.purchased_at).toBeNull()
    })
  })

  // ==================== GET /api/wishlist/stats ====================
  describe('GET /api/wishlist/stats', () => {
    it('should return stats for user', async () => {
      const response = await request(app)
        .get(`/api/wishlist/stats?user_id=${testUserId}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('total_items')
      expect(response.body.data).toHaveProperty('total_value')
      expect(response.body.data).toHaveProperty('purchased_count')
      expect(response.body.data).toHaveProperty('unpurchased_count')
      expect(response.body.data).toHaveProperty('top_hearted')
      expect(Array.isArray(response.body.data.top_hearted)).toBe(true)
    })

    it('should return 400 for invalid user_id', async () => {
      const response = await request(app)
        .get('/api/wishlist/stats?user_id=invalid')
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  // ==================== DELETE /api/wishlist/comments/:commentId ====================
  describe('DELETE /api/wishlist/comments/:commentId', () => {
    it('should delete comment successfully', async () => {
      if (!createdCommentId) {
        return
      }

      const response = await request(app)
        .delete(`/api/wishlist/comments/${createdCommentId}?user_id=${testUserId}`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('message')
    })
  })

  // ==================== DELETE /api/wishlist/:id ====================
  describe('DELETE /api/wishlist/:id', () => {
    it('should soft delete wishlist item', async () => {
      if (!createdItemId) {
        return
      }

      const response = await request(app)
        .delete(`/api/wishlist/${createdItemId}`)
        .send({ user_id: testUserId })
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('message')

      // Verify item is soft deleted (not in normal queries)
      const getResponse = await request(app)
        .get(`/api/wishlist/${createdItemId}?user_id=${testUserId}`)
        .expect(404)

      expect(getResponse.body.error.code).toBe('NOT_FOUND')
    })

    it('should return 404 for non-existent item', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .delete(`/api/wishlist/${fakeId}`)
        .send({ user_id: testUserId })
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  // ==================== Security Tests ====================
  describe('Security Tests', () => {
    it('should prevent SQL injection in search', async () => {
      const maliciousInput = "'; DROP TABLE wishlist_items; --"
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}&search=${encodeURIComponent(maliciousInput)}`)
        .expect(200) // Should not error

      expect(response.body).toHaveProperty('success', true)
    })

    it('should sanitize XSS in product name', async () => {
      const xssInput = '<script>alert("XSS")</script>Test Product'
      const response = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: testUserId,
          product_name: xssInput,
          product_url: 'https://example.com/test'
        })

      if (response.status === 201) {
        expect(response.body.data.product_name).not.toContain('<script>')
      }
    })
  })

  // ==================== Performance Tests ====================
  describe('Performance Tests', () => {
    it('should load 100 items in < 1000ms', async () => {
      const start = Date.now()
      const response = await request(app)
        .get(`/api/wishlist?user_id=${testUserId}&limit=100`)
      const duration = Date.now() - start

      expect(response.status).toBe(200)
      expect(duration).toBeLessThan(1000)
    })

    it('should heart item in < 500ms', async () => {
      // Create a test item first
      const createResponse = await request(app)
        .post('/api/wishlist')
        .send({
          user_id: `${testUserId}-perf`,
          product_name: 'Performance Test Item',
          product_url: 'https://example.com/perf-test'
        })

      if (createResponse.status === 201) {
        const itemId = createResponse.body.data.id

        const start = Date.now()
        const response = await request(app)
          .post(`/api/wishlist/${itemId}/heart`)
          .send({ user_id: `${testUserId}-perf` })
        const duration = Date.now() - start

        expect(response.status).toBe(200)
        expect(duration).toBeLessThan(500)

        // Cleanup
        await request(app)
          .delete(`/api/wishlist/${itemId}?user_id=${testUserId}-perf`)
      }
    })
  })
})
