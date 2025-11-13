import { test, expect } from '@playwright/test'
import { fixtures } from '../helpers/fixtures.js'

/**
 * Notes API Tests
 * Tests all CRUD operations and edge cases
 */

let createdNoteId

test.describe('Notes API @api', () => {
  
  test.describe('GET /api/notes', () => {
    
    test('should return all notes successfully', async ({ request }) => {
      const response = await request.get('/api/notes')
      
      expect(response.ok()).toBeTruthy()
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
    
    test('should handle pagination parameters', async ({ request }) => {
      const response = await request.get('/api/notes?limit=5&offset=0')
      
      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.data.length).toBeLessThanOrEqual(5)
    })
  })
  
  test.describe('POST /api/notes', () => {
    
    test('should create new note with valid data', async ({ request }) => {
      const newNote = fixtures.validNote()
      
      const response = await request.post('/api/notes', {
        data: newNote,
      })
      
      expect(response.status()).toBe(201)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('id')
      expect(data.data.title).toBe(newNote.title)
      expect(data.data.content).toBe(newNote.content)
      
      // Save for other tests
      createdNoteId = data.data.id
    })
    
    test('should reject note with missing title', async ({ request }) => {
      const invalidNote = fixtures.invalidNote()
      
      const response = await request.post('/api/notes', {
        data: invalidNote,
      })
      
      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
    })
    
    test('should sanitize HTML in content', async ({ request }) => {
      const noteWithHTML = {
        ...fixtures.validNote(),
        content: '<script>alert("XSS")</script>',
      }
      
      const response = await request.post('/api/notes', {
        data: noteWithHTML,
      })
      
      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      // Content should be escaped or sanitized
      expect(data.data.content).not.toContain('<script>')
    })
    
    test('should prevent SQL injection', async ({ request }) => {
      const maliciousNote = {
        ...fixtures.validNote(),
        title: "'; DROP TABLE notes; --",
      }
      
      const response = await request.post('/api/notes', {
        data: maliciousNote,
      })
      
      // Should succeed (parameterized queries prevent injection)
      expect(response.ok()).toBeTruthy()
      
      // Verify table still exists by fetching notes
      const verifyResponse = await request.get('/api/notes')
      expect(verifyResponse.ok()).toBeTruthy()
    })
  })
  
  test.describe('GET /api/notes/:id', () => {
    
    test('should return single note by ID', async ({ request }) => {
      const response = await request.get(`/api/notes/${createdNoteId}`)
      
      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(createdNoteId)
    })
    
    test('should return 404 for non-existent note', async ({ request }) => {
      const fakeId = fixtures.uuid()
      const response = await request.get(`/api/notes/${fakeId}`)
      
      expect(response.status()).toBe(404)
      const data = await response.json()
      expect(data.success).toBe(false)
    })
    
    test('should return 400 for invalid UUID format', async ({ request }) => {
      const response = await request.get('/api/notes/invalid-uuid')
      
      expect(response.status()).toBe(400)
    })
  })
  
  test.describe('PUT /api/notes/:id', () => {
    
    test('should update note successfully', async ({ request }) => {
      const updates = {
        title: 'Updated Title',
        content: 'Updated content',
      }
      
      const response = await request.put(`/api/notes/${createdNoteId}`, {
        data: updates,
      })
      
      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data.data.title).toBe(updates.title)
      expect(data.data.content).toBe(updates.content)
    })
    
    test('should return 404 for updating non-existent note', async ({ request }) => {
      const fakeId = fixtures.uuid()
      
      const response = await request.put(`/api/notes/${fakeId}`, {
        data: { title: 'New Title' },
      })
      
      expect(response.status()).toBe(404)
    })
  })
  
  test.describe('DELETE /api/notes/:id', () => {
    
    test('should soft delete note', async ({ request }) => {
      const response = await request.delete(`/api/notes/${createdNoteId}`)
      
      expect(response.ok()).toBeTruthy()
      
      // Verify note is soft deleted (not in list)
      const getResponse = await request.get(`/api/notes/${createdNoteId}`)
      expect(getResponse.status()).toBe(404)
    })
    
    test('should return 404 for deleting non-existent note', async ({ request }) => {
      const fakeId = fixtures.uuid()
      
      const response = await request.delete(`/api/notes/${fakeId}`)
      
      expect(response.status()).toBe(404)
    })
  })
  
  test.describe('Performance Tests', () => {
    
    test('should respond within 500ms', async ({ request }) => {
      const startTime = Date.now()
      
      await request.get('/api/notes')
      
      const duration = Date.now() - startTime
      expect(duration).toBeLessThan(500)
    })
  })
})
