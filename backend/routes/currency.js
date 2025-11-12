import express from 'express'
import { query } from '../config/database.js'
import axios from 'axios'

const router = express.Router()

// Configuration
const CACHE_DURATION_HOURS = 1 // Cache rates for 1 hour

// Multiple API endpoints for redundancy (ordered by priority)
const API_ENDPOINTS = [
  {
    name: 'ExchangeRate-API',
    url: 'https://api.exchangerate-api.com/v4/latest/USD',
    timeout: 5000,
    parseResponse: (data) => data.rates
  },
  {
    name: 'Open ExchangeRates (Free)',
    url: 'https://open.er-api.com/v6/latest/USD',
    timeout: 5000,
    parseResponse: (data) => data.rates
  },
  {
    name: 'Fawaz Ahmed CDN',
    url: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
    timeout: 6000,
    parseResponse: (data) => {
      // Convert format: { usd: { vnd: 25000, ... } } -> { VND: 25000, ... }
      const rates = {}
      if (data.usd) {
        Object.keys(data.usd).forEach(key => {
          rates[key.toUpperCase()] = data.usd[key]
        })
      }
      return rates
    }
  },
  {
    name: 'ExchangeRate.host',
    url: 'https://api.exchangerate.host/latest?base=USD',
    timeout: 5000,
    parseResponse: (data) => data.rates
  },
  {
    name: 'Frankfurter (EU)',
    url: 'https://api.frankfurter.app/latest?from=USD',
    timeout: 5000,
    parseResponse: (data) => {
      // Frankfurter doesn't include USD in rates, add it manually
      return { ...data.rates, USD: 1.0 }
    }
  }
]

/**
 * Fetch latest exchange rates from API with multiple fallbacks
 */
async function fetchLatestRates() {
  console.log(`🔄 Fetching exchange rates... (${API_ENDPOINTS.length} APIs available)`)
  
  let lastError = null
  
  // Configure axios for corporate networks (skip SSL verification in development)
  const axiosConfig = {
    headers: {
      'User-Agent': 'KaDongTools/1.0',
      'Accept': 'application/json'
    }
  }
  
  // Skip SSL verification in development (for corporate proxies)
  if (process.env.NODE_ENV === 'development') {
    const https = await import('https')
    axiosConfig.httpsAgent = new https.Agent({ rejectUnauthorized: false })
  }
  
  // Try each API endpoint sequentially until one succeeds
  for (let i = 0; i < API_ENDPOINTS.length; i++) {
    const api = API_ENDPOINTS[i]
    
    try {
      console.log(`📡 Trying ${api.name} (${i + 1}/${API_ENDPOINTS.length})...`)
      
      const response = await axios.get(api.url, { 
        ...axiosConfig,
        timeout: api.timeout
      })

      // Validate response structure
      if (!response.data) {
        throw new Error('Empty response data')
      }

      // Parse rates using API-specific parser
      const rates = api.parseResponse(response.data)
      
      if (!rates || typeof rates !== 'object' || Object.keys(rates).length === 0) {
        throw new Error('Invalid rates structure')
      }

      console.log(`✅ Successfully fetched rates from ${api.name} (${Object.keys(rates).length} currencies)`)
      return rates
      
    } catch (error) {
      lastError = error
      const errorMsg = error.code === 'ECONNABORTED' ? 'Timeout' : error.message
      console.warn(`⚠️ ${api.name} failed: ${errorMsg}`)
      
      // Continue to next API (don't throw yet)
      if (i < API_ENDPOINTS.length - 1) {
        console.log(`⏩ Trying next API...`)
      }
    }
  }
  
  // All APIs failed
  console.error(`❌ All ${API_ENDPOINTS.length} APIs failed. Last error:`, lastError?.message)
  throw new Error(`Không thể lấy tỷ giá từ ${API_ENDPOINTS.length} APIs. Lỗi cuối: ${lastError?.message}`)
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
