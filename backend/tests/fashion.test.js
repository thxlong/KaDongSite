import request from 'supertest'
import app from '../app.js'

describe('Fashion API Endpoints', () => {
  let createdOutfitId

  // Test GET /api/fashion
  describe('GET /api/fashion', () => {
    it('should return all outfits for a user', async () => {
      const response = await request(app)
        .get('/api/fashion?user_id=test-user-id')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('data')
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body).toHaveProperty('count')
    })
  })

  // Test POST /api/fashion
  describe('POST /api/fashion', () => {
    it('should create a new outfit with valid data', async () => {
      const newOutfit = {
        user_id: 'test-user-id',
        name: 'Test Outfit',
        shirtColor: 'blue',
        pantsColor: 'black',
        shoesColor: 'white',
        hatColor: 'red',
        bagColor: 'brown'
      }

      const response = await request(app)
        .post('/api/fashion')
        .send(newOutfit)
        .expect('Content-Type', /json/)
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name', 'Test Outfit')
      expect(response.body.data).toHaveProperty('shirt_color', 'blue')
      expect(response.body.data).toHaveProperty('pants_color', 'black')
      expect(response.body.data).toHaveProperty('shoes_color', 'white')

      createdOutfitId = response.body.data.id
    })

    it('should return 400 when required fields are missing', async () => {
      const invalidOutfit = {
        user_id: 'test-user-id',
        name: 'Incomplete Outfit'
        // Missing shirtColor, pantsColor, shoesColor
      }

      const response = await request(app)
        .post('/api/fashion')
        .send(invalidOutfit)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body).toHaveProperty('error')
    })

    it('should return 400 when color is invalid', async () => {
      const invalidColorOutfit = {
        user_id: 'test-user-id',
        name: 'Invalid Color Outfit',
        shirtColor: 'rainbow', // Invalid color
        pantsColor: 'black',
        shoesColor: 'white'
      }

      const response = await request(app)
        .post('/api/fashion')
        .send(invalidColorOutfit)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error).toMatch(/Invalid.*color/i)
    })

    it('should return 400 when name is too long', async () => {
      const longNameOutfit = {
        user_id: 'test-user-id',
        name: 'A'.repeat(101), // 101 characters
        shirtColor: 'blue',
        pantsColor: 'black',
        shoesColor: 'white'
      }

      const response = await request(app)
        .post('/api/fashion')
        .send(longNameOutfit)
        .expect('Content-Type', /json/)
        .expect(400)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error).toMatch(/Name.*100/i)
    })

    it('should create outfit without optional fields (hat, bag)', async () => {
      const minimalOutfit = {
        user_id: 'test-user-id',
        name: 'Minimal Outfit',
        shirtColor: 'green',
        pantsColor: 'blue',
        shoesColor: 'brown'
      }

      const response = await request(app)
        .post('/api/fashion')
        .send(minimalOutfit)
        .expect(201)

      expect(response.body.data).toHaveProperty('hat_color', null)
      expect(response.body.data).toHaveProperty('bag_color', null)
    })
  })

  // Test GET /api/fashion/:id
  describe('GET /api/fashion/:id', () => {
    it('should return a specific outfit by ID', async () => {
      if (!createdOutfitId) {
        // Create outfit first
        const createResponse = await request(app)
          .post('/api/fashion')
          .send({
            user_id: 'test-user-id',
            name: 'Temp Outfit',
            shirtColor: 'pink',
            pantsColor: 'gray',
            shoesColor: 'black'
          })
        createdOutfitId = createResponse.body.data.id
      }

      const response = await request(app)
        .get(`/api/fashion/${createdOutfitId}?user_id=test-user-id`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('id', createdOutfitId)
    })

    it('should return 404 for non-existent outfit', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .get(`/api/fashion/${fakeId}?user_id=test-user-id`)
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
      expect(response.body.error).toMatch(/not found/i)
    })
  })

  // Test PUT /api/fashion/:id
  describe('PUT /api/fashion/:id', () => {
    it('should update an existing outfit', async () => {
      if (!createdOutfitId) {
        const createResponse = await request(app)
          .post('/api/fashion')
          .send({
            user_id: 'test-user-id',
            name: 'To Update',
            shirtColor: 'red',
            pantsColor: 'blue',
            shoesColor: 'white'
          })
        createdOutfitId = createResponse.body.data.id
      }

      const updates = {
        user_id: 'test-user-id',
        name: 'Updated Outfit',
        shirtColor: 'purple'
      }

      const response = await request(app)
        .put(`/api/fashion/${createdOutfitId}`)
        .send(updates)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body.data).toHaveProperty('name', 'Updated Outfit')
      expect(response.body.data).toHaveProperty('shirt_color', 'purple')
    })

    it('should return 404 when updating non-existent outfit', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .put(`/api/fashion/${fakeId}`)
        .send({
          user_id: 'test-user-id',
          name: 'Updated'
        })
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })

    it('should return 400 when no fields to update', async () => {
      if (!createdOutfitId) {
        const createResponse = await request(app)
          .post('/api/fashion')
          .send({
            user_id: 'test-user-id',
            name: 'No Update',
            shirtColor: 'yellow',
            pantsColor: 'green',
            shoesColor: 'blue'
          })
        createdOutfitId = createResponse.body.data.id
      }

      const response = await request(app)
        .put(`/api/fashion/${createdOutfitId}`)
        .send({ user_id: 'test-user-id' })
        .expect(400)

      expect(response.body.error).toMatch(/No fields to update/i)
    })
  })

  // Test DELETE /api/fashion/:id
  describe('DELETE /api/fashion/:id', () => {
    it('should soft delete an outfit', async () => {
      // Create outfit to delete
      const createResponse = await request(app)
        .post('/api/fashion')
        .send({
          user_id: 'test-user-id',
          name: 'To Delete',
          shirtColor: 'orange',
          pantsColor: 'brown',
          shoesColor: 'gray'
        })
      const outfitId = createResponse.body.data.id

      const response = await request(app)
        .delete(`/api/fashion/${outfitId}?user_id=test-user-id`)
        .expect(200)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('message')
      expect(response.body.data).toHaveProperty('id', outfitId)

      // Verify it's gone (soft deleted)
      const getResponse = await request(app)
        .get(`/api/fashion/${outfitId}?user_id=test-user-id`)
        .expect(404)

      expect(getResponse.body.error).toMatch(/not found/i)
    })

    it('should return 404 when deleting non-existent outfit', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000'
      const response = await request(app)
        .delete(`/api/fashion/${fakeId}?user_id=test-user-id`)
        .expect(404)

      expect(response.body).toHaveProperty('success', false)
    })
  })

  // Test all valid colors
  describe('Valid Color Values', () => {
    const validColors = [
      'red', 'orange', 'yellow', 'green', 'blue',
      'purple', 'brown', 'black', 'white', 'gray',
      'pink', 'peach', 'cream', 'mint', 'sky'
    ]

    validColors.forEach(color => {
      it(`should accept ${color} as valid color`, async () => {
        const outfit = {
          user_id: 'test-user-id',
          name: `${color} outfit`,
          shirtColor: color,
          pantsColor: 'black',
          shoesColor: 'white'
        }

        const response = await request(app)
          .post('/api/fashion')
          .send(outfit)
          .expect(201)

        expect(response.body.data.shirt_color).toBe(color)
      })
    })
  })

  // Test SQL injection prevention
  describe('Security - SQL Injection Prevention', () => {
    it('should prevent SQL injection in name field', async () => {
      const maliciousOutfit = {
        user_id: 'test-user-id',
        name: "'; DROP TABLE fashion_outfits; --",
        shirtColor: 'blue',
        pantsColor: 'black',
        shoesColor: 'white'
      }

      const response = await request(app)
        .post('/api/fashion')
        .send(maliciousOutfit)
        .expect(201)

      // Should create safely with parameterized query
      expect(response.body.data.name).toBe("'; DROP TABLE fashion_outfits; --")

      // Verify table still exists by fetching all
      const verifyResponse = await request(app)
        .get('/api/fashion?user_id=test-user-id')
        .expect(200)

      expect(verifyResponse.body.success).toBe(true)
    })
  })
})
