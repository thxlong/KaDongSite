/**
 * Gold API Integration Tests
 * @description Tests for gold history API endpoint bug fixes
 * @created 2025-11-13
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'

const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

describe('Gold History API - Integration Tests', () => {
  describe('GET /api/gold/history', () => {
    it('should return 400 when type parameter is missing', async () => {
      const response = await fetch(`${API_BASE}/gold/history?period=day`)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toContain('Missing required parameter: type')
    })

    it('should return 200 with valid type parameter', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('count')
      expect(data).toHaveProperty('meta')
    })

    it('should return correct data structure', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // Check required fields from bug fix
        expect(record).toHaveProperty('time_bucket')
        expect(record).toHaveProperty('type')
        expect(record).toHaveProperty('avg_mid_price')
        expect(record).toHaveProperty('currency')
        expect(record).toHaveProperty('period_start')
        expect(record).toHaveProperty('period_end')
      }
    })

    it('should handle period=day correctly', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=100`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.meta.period).toBe('day')
      expect(data.meta.interval).toBe('hour') // Day period should use hour interval

      // Check date range is ~1 day
      const rangeDays = parseFloat(data.meta.range_days)
      expect(rangeDays).toBeCloseTo(1.0, 1)
    })

    it('should handle period=week correctly', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=week&limit=100`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.meta.period).toBe('week')
      expect(data.meta.interval).toBe('day') // Week period should use day interval

      // Check date range is ~7 days
      const rangeDays = parseFloat(data.meta.range_days)
      expect(rangeDays).toBeCloseTo(7.0, 1)
    })

    it('should handle period=month correctly', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=month&limit=100`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.meta.period).toBe('month')
      expect(data.meta.interval).toBe('day') // Month period should use day interval

      // Check date range is ~30 days
      const rangeDays = parseFloat(data.meta.range_days)
      expect(rangeDays).toBeCloseTo(30.0, 5)
    })

    it('should handle period=year correctly', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=year&limit=100`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.meta.period).toBe('year')
      expect(data.meta.interval).toBe('week') // Year period should use week interval

      // Check date range is ~365 days
      const rangeDays = parseFloat(data.meta.range_days)
      expect(rangeDays).toBeCloseTo(365.0, 10)
    })

    it('should respect limit parameter', async () => {
      const limit = 5
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=${limit}`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.length).toBeLessThanOrEqual(limit)
    })

    it('should handle multiple gold types', async () => {
      const types = ['SJC_9999', 'DOJI_24K', 'XAU_USD']
      
      for (const type of types) {
        const response = await fetch(`${API_BASE}/gold/history?type=${type}&period=day&limit=10`)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        
        if (data.data.length > 0) {
          expect(data.data[0].type).toBe(type)
        }
      }
    })

    it('should return data sorted by time ascending', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=week&limit=100`)
      const data = await response.json()

      if (data.data.length > 1) {
        for (let i = 1; i < data.data.length; i++) {
          const prevTime = new Date(data.data[i-1].time_bucket).getTime()
          const currTime = new Date(data.data[i].time_bucket).getTime()
          expect(currTime).toBeGreaterThanOrEqual(prevTime)
        }
      }
    })

    it('should handle custom date range', async () => {
      const now = new Date()
      const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const to = now.toISOString()

      const response = await fetch(
        `${API_BASE}/gold/history?type=SJC_9999&from=${from}&to=${to}&limit=100`
      )
      const data = await response.json()

      expect(data.success).toBe(true)
      
      if (data.data.length > 0) {
        const firstRecord = new Date(data.data[0].period_start)
        const lastRecord = new Date(data.data[data.data.length - 1].period_end)

        expect(firstRecord.getTime()).toBeGreaterThanOrEqual(new Date(from).getTime())
        expect(lastRecord.getTime()).toBeLessThanOrEqual(new Date(to).getTime())
      }
    })
  })

  describe('GET /api/gold/latest', () => {
    it('should return latest prices for all types', async () => {
      const response = await fetch(`${API_BASE}/gold/latest`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)

      // Check data structure
      const record = data.data[0]
      expect(record).toHaveProperty('type')
      expect(record).toHaveProperty('buy_price')
      expect(record).toHaveProperty('sell_price')
      expect(record).toHaveProperty('currency')
      expect(record).toHaveProperty('fetched_at')
    })

    it('should filter by types parameter', async () => {
      const types = 'SJC_9999,DOJI_24K'
      const response = await fetch(`${API_BASE}/gold/latest?types=${types}`)
      const data = await response.json()

      expect(data.success).toBe(true)
      
      data.data.forEach(record => {
        expect(['SJC_9999', 'DOJI_24K']).toContain(record.type)
      })
    })

    it('should return most recent data first', async () => {
      const response = await fetch(`${API_BASE}/gold/latest?limit=10`)
      const data = await response.json()

      if (data.data.length > 1) {
        // Group by type and check within each type
        const typeGroups = {}
        data.data.forEach(record => {
          if (!typeGroups[record.type]) {
            typeGroups[record.type] = []
          }
          typeGroups[record.type].push(record)
        })

        Object.values(typeGroups).forEach(records => {
          if (records.length > 1) {
            for (let i = 1; i < records.length; i++) {
              const prevTime = new Date(records[i-1].fetched_at).getTime()
              const currTime = new Date(records[i].fetched_at).getTime()
              expect(prevTime).toBeGreaterThanOrEqual(currTime)
            }
          }
        })
      }
    })
  })

  describe('POST /api/gold/fetch', () => {
    it('should trigger manual fetch and save to database', async () => {
      const response = await fetch(`${API_BASE}/gold/fetch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data).toHaveProperty('data')
      expect(data.data).toHaveProperty('fetched')
      expect(data.data).toHaveProperty('saved')
      expect(data.data).toHaveProperty('errors')

      // Should fetch some data
      expect(data.data.fetched).toBeGreaterThan(0)
    })

    it('should save fetched data to database', async () => {
      // Trigger fetch
      const fetchResponse = await fetch(`${API_BASE}/gold/fetch`, {
        method: 'POST'
      })
      const fetchData = await fetchResponse.json()

      expect(fetchData.success).toBe(true)
      expect(fetchData.data.saved).toBeGreaterThanOrEqual(0)

      // Verify data in database via latest API
      const latestResponse = await fetch(`${API_BASE}/gold/latest`)
      const latestData = await latestResponse.json()

      expect(latestData.success).toBe(true)
      expect(latestData.data.length).toBeGreaterThan(0)
      
      // Verify data structure is correct
      const latest = latestData.data[0]
      expect(latest).toHaveProperty('type')
      expect(latest).toHaveProperty('buy_price')
      expect(latest).toHaveProperty('sell_price')
      expect(latest).toHaveProperty('fetched_at')
      
      // Verify fetched_at is a valid date
      const fetchedAt = new Date(latest.fetched_at)
      expect(fetchedAt.toString()).not.toBe('Invalid Date')
    })
  })

  describe('Bug Fix Verification', () => {
    it('should return time_bucket field for chart component', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // Critical: time_bucket must exist for chart
        expect(record.time_bucket).toBeDefined()
        expect(record.time_bucket).not.toBeNull()
        
        // Should be valid ISO date string
        const date = new Date(record.time_bucket)
        expect(date.toString()).not.toBe('Invalid Date')
      }
    })

    it('should return avg_mid_price as string for precision', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // avg_mid_price should be string (from DECIMAL type)
        expect(typeof record.avg_mid_price).toBe('string')
        
        // Should be parseable as float
        const price = parseFloat(record.avg_mid_price)
        expect(price).toBeGreaterThan(0)
        expect(isNaN(price)).toBe(false)
      }
    })

    it('should return period_start and period_end for fallback', async () => {
      const response = await fetch(`${API_BASE}/gold/history?type=SJC_9999&period=day&limit=10`)
      const data = await response.json()

      if (data.data.length > 0) {
        const record = data.data[0]
        
        // Fallback fields must exist
        expect(record.period_start).toBeDefined()
        expect(record.period_end).toBeDefined()
        
        // Should be valid dates
        expect(new Date(record.period_start).toString()).not.toBe('Invalid Date')
        expect(new Date(record.period_end).toString()).not.toBe('Invalid Date')
      }
    })

    it('should handle empty results gracefully', async () => {
      // Try to get data for future date (should be empty)
      const future = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      const response = await fetch(
        `${API_BASE}/gold/history?type=SJC_9999&from=${future}&to=${future}&limit=10`
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
      expect(data.count).toBe(0)
    })
  })
})
