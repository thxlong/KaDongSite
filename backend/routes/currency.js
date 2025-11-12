import express from 'express'
import { query } from '../config/database.js'
import axios from 'axios'

const router = express.Router()

// Configuration
const CACHE_DURATION_HOURS = 1 // Cache rates for 1 hour
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD'
const FALLBACK_API_URL = 'https://open.er-api.com/v6/latest/USD'

/**
 * Fetch latest exchange rates from API
 */
async function fetchLatestRates() {
  try {
    console.log('Fetching latest exchange rates from API...')
    
    // Try primary API
    let response
    try {
      response = await axios.get(EXCHANGE_RATE_API_URL, { timeout: 5000 })
    } catch (primaryError) {
      console.warn('Primary API failed, trying fallback...')
      response = await axios.get(FALLBACK_API_URL, { timeout: 5000 })
    }

    if (!response.data || !response.data.rates) {
      throw new Error('Invalid API response structure')
    }

    return response.data.rates
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message)
    throw error
  }
}

/**
 * Update database with latest rates
 */
async function updateRatesInDatabase(rates) {
  const currencies = ['VND', 'EUR', 'GBP', 'JPY', 'KRW', 'CNY', 'THB']
  
  for (const currency of currencies) {
    if (rates[currency]) {
      await query(
        `INSERT INTO currency_rates (base_currency, target_currency, rate, source, last_updated)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (base_currency, target_currency)
         DO UPDATE SET
           rate = EXCLUDED.rate,
           last_updated = EXCLUDED.last_updated,
           source = EXCLUDED.source`,
        ['USD', currency, rates[currency], 'exchangerate-api']
      )
    }
  }

  // Always ensure USD to USD = 1
  await query(
    `INSERT INTO currency_rates (base_currency, target_currency, rate, source, last_updated)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (base_currency, target_currency)
     DO UPDATE SET last_updated = EXCLUDED.last_updated`,
    ['USD', 'USD', 1.0, 'fixed']
  )

  console.log('✅ Exchange rates updated successfully')
}

/**
 * Check if cache is stale
 */
async function isCacheStale() {
  const result = await query(
    `SELECT MAX(last_updated) as latest_update FROM currency_rates`
  )
  
  if (!result.rows[0].latest_update) {
    return true // No data, need to fetch
  }

  const lastUpdate = new Date(result.rows[0].latest_update)
  const now = new Date()
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60)

  return hoursSinceUpdate > CACHE_DURATION_HOURS
}

/**
 * GET /api/currency/rates
 * Get all exchange rates (from cache or refresh if stale)
 */
router.get('/rates', async (req, res) => {
  try {
    // Check if cache needs refresh
    const needsRefresh = await isCacheStale()

    if (needsRefresh) {
      console.log('⚠️ Cache stale, refreshing exchange rates...')
      try {
        const latestRates = await fetchLatestRates()
        await updateRatesInDatabase(latestRates)
      } catch (apiError) {
        console.warn('⚠️ API fetch failed, using cached rates:', apiError.message)
        // Continue with cached data if API fails
      }
    }

    // Get rates from database
    const result = await query(
      `SELECT base_currency, target_currency, rate, last_updated, source
       FROM currency_rates
       ORDER BY target_currency`
    )

    // Format as object for easy frontend consumption
    const rates = {}
    result.rows.forEach(row => {
      rates[row.target_currency] = parseFloat(row.rate)
    })

    const lastUpdate = result.rows[0]?.last_updated

    res.json({
      success: true,
      data: {
        base: 'USD',
        rates: rates,
        lastUpdated: lastUpdate,
        source: result.rows[0]?.source || 'database',
        cached: !needsRefresh
      }
    })
  } catch (error) {
    console.error('Error getting exchange rates:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'RATES_FETCH_ERROR',
        message: 'Không thể lấy tỷ giá',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})

/**
 * POST /api/currency/refresh
 * Force refresh exchange rates from API
 */
router.post('/refresh', async (req, res) => {
  try {
    console.log('🔄 Manual refresh requested')
    
    const latestRates = await fetchLatestRates()
    await updateRatesInDatabase(latestRates)

    // Get updated rates
    const result = await query(
      `SELECT base_currency, target_currency, rate, last_updated
       FROM currency_rates
       ORDER BY target_currency`
    )

    const rates = {}
    result.rows.forEach(row => {
      rates[row.target_currency] = parseFloat(row.rate)
    })

    res.json({
      success: true,
      data: {
        base: 'USD',
        rates: rates,
        lastUpdated: result.rows[0]?.last_updated,
        source: 'exchangerate-api',
        cached: false
      },
      message: 'Đã cập nhật tỷ giá mới nhất'
    })
  } catch (error) {
    console.error('Error refreshing exchange rates:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'REFRESH_ERROR',
        message: 'Không thể cập nhật tỷ giá',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})

/**
 * POST /api/currency/convert
 * Convert amount between currencies
 */
router.post('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.body

    if (!amount || !from || !to) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Thiếu thông tin: amount, from, to'
        }
      })
    }

    // Get rates from database
    const fromRate = await query(
      'SELECT rate FROM currency_rates WHERE base_currency = $1 AND target_currency = $2',
      ['USD', from]
    )

    const toRate = await query(
      'SELECT rate FROM currency_rates WHERE base_currency = $1 AND target_currency = $2',
      ['USD', to]
    )

    if (!fromRate.rows[0] || !toRate.rows[0]) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CURRENCY_NOT_FOUND',
          message: 'Không tìm thấy tỷ giá cho loại tiền này'
        }
      })
    }

    // Convert: amount (from) -> USD -> to
    const amountInUSD = amount / parseFloat(fromRate.rows[0].rate)
    const result = amountInUSD * parseFloat(toRate.rows[0].rate)

    res.json({
      success: true,
      data: {
        amount: parseFloat(amount),
        from,
        to,
        result: parseFloat(result.toFixed(2)),
        rate: parseFloat((toRate.rows[0].rate / fromRate.rows[0].rate).toFixed(6))
      }
    })
  } catch (error) {
    console.error('Error converting currency:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'CONVERSION_ERROR',
        message: 'Lỗi chuyển đổi tiền tệ',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})

export default router
