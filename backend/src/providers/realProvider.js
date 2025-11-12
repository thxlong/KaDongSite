/**
 * Real Gold Provider - VNAppMob API
 * @description Fetches real-time gold prices from VNAppMob API
 * @author KaDong Team
 * @created 2025-11-11
 * @updated 2025-11-12 - Integrated VNAppMob Gold API
 */

import axios from 'axios'
import * as cheerio from 'cheerio'

// VNAppMob Gold API
const VNAPPMOB_BASE_URL = 'https://api.vnappmob.com/api/v2/gold'
const VNAPPMOB_API_KEY = process.env.VNAPPMOB_GOLD_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjQxNzgwMjMsImlhdCI6MTc2Mjg4MjAyMywic2NvcGUiOiJnb2xkIiwicGVybWlzc2lvbiI6MH0.R3mC5btQgCtFUNFb5uX7RquZZzL6HTeSybitcVC4JgA'

// Fallback URLs
const GOLDAPI_URL = 'https://www.goldapi.io/api/XAU/VND'
const SJC_URL = 'https://sjc.com.vn/xml/tygiavang.xml'

/**
 * Fetch SJC gold prices from VNAppMob API
 */
const fetchVNAppMobSJC = async () => {
  try {
    const https = await import('https')
    const agent = new https.Agent({ rejectUnauthorized: false })
    
    const response = await axios.get(`${VNAPPMOB_BASE_URL}/sjc`, {
      timeout: 15000,
      httpsAgent: agent,
      headers: {
        'Authorization': `Bearer ${VNAPPMOB_API_KEY}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No SJC data from VNAppMob API')
    }
    
    const data = response.data.results[0]
    const results = []
    
    // SJC 9999 - 1 lượng (buy_1l, sell_1l)
    if (data.buy_1l && data.sell_1l) {
      const buy = parseFloat(data.buy_1l)
      const sell = parseFloat(data.sell_1l)
      
      results.push({
        type: 'SJC_9999',
        source: 'real',
        buy_price: buy,
        sell_price: sell,
        mid_price: (buy + sell) / 2,
        currency: 'VND',
        fetched_at: new Date(parseInt(data.datetime) * 1000),
        meta: {
          unit: '1 lượng (37.5g)',
          location: 'TP.HCM',
          provider: 'VNAppMob API',
          provider_url: 'https://api.vnappmob.com',
          description: 'Vàng SJC 9999 - Vàng nguyên chất',
          raw_data: {
            buy_1c: data.buy_1c,
            sell_1c: data.sell_1c,
            buy_5c: data.buy_5c,
            sell_5c: data.sell_5c
          }
        }
      })
    }
    
    // SJC 24K - Nữ trang 99.99 (buy_nutrang_9999, sell_nutrang_9999)
    if (data.buy_nutrang_9999 && data.sell_nutrang_9999) {
      const buy = parseFloat(data.buy_nutrang_9999)
      const sell = parseFloat(data.sell_nutrang_9999)
      
      results.push({
        type: 'SJC_24K',
        source: 'real',
        buy_price: buy,
        sell_price: sell,
        mid_price: (buy + sell) / 2,
        currency: 'VND',
        fetched_at: new Date(parseInt(data.datetime) * 1000),
        meta: {
          unit: '1 lượng (37.5g)',
          location: 'TP.HCM',
          provider: 'VNAppMob API',
          provider_url: 'https://api.vnappmob.com',
          description: 'Vàng nữ trang SJC 99.99%'
        }
      })
    }
    
    console.log(`[VNAppMob] ✅ Fetched ${results.length} SJC prices`)
    return results
    
  } catch (error) {
    console.error('[VNAppMob] Failed to fetch SJC:', error.message)
    throw error
  }
}

/**
 * Fetch DOJI gold prices from VNAppMob API
 */
const fetchVNAppMobDOJI = async () => {
  try {
    const https = await import('https')
    const agent = new https.Agent({ rejectUnauthorized: false })
    
    const response = await axios.get(`${VNAPPMOB_BASE_URL}/doji`, {
      timeout: 15000,
      httpsAgent: agent,
      headers: {
        'Authorization': `Bearer ${VNAPPMOB_API_KEY}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No DOJI data from VNAppMob API')
    }
    
    const data = response.data.results[0]
    
    // DOJI HCM prices
    if (data.buy_hcm && data.sell_hcm) {
      const buy = parseFloat(data.buy_hcm)
      const sell = parseFloat(data.sell_hcm)
      
      console.log(`[VNAppMob] ✅ Fetched DOJI prices`)
      return [{
        type: 'DOJI_24K',
        source: 'real',
        buy_price: buy,
        sell_price: sell,
        mid_price: (buy + sell) / 2,
        currency: 'VND',
        fetched_at: new Date(parseInt(data.datetime) * 1000),
        meta: {
          unit: '1 lượng (37.5g)',
          location: 'TP.HCM',
          provider: 'VNAppMob API',
          provider_url: 'https://api.vnappmob.com',
          description: 'Vàng DOJI 24K',
          brand: 'DOJI',
          raw_data: {
            buy_hn: data.buy_hn,
            sell_hn: data.sell_hn,
            buy_dn: data.buy_dn,
            sell_dn: data.sell_dn
          }
        }
      }]
    }
    
    throw new Error('Invalid DOJI data structure')
    
  } catch (error) {
    console.error('[VNAppMob] Failed to fetch DOJI:', error.message)
    throw error
  }
}

/**
 * Fetch PNJ gold prices from VNAppMob API
 */
const fetchVNAppMobPNJ = async () => {
  try {
    const https = await import('https')
    const agent = new https.Agent({ rejectUnauthorized: false })
    
    const response = await axios.get(`${VNAPPMOB_BASE_URL}/pnj`, {
      timeout: 15000,
      httpsAgent: agent,
      headers: {
        'Authorization': `Bearer ${VNAPPMOB_API_KEY}`,
        'Accept': 'application/json'
      }
    })
    
    if (!response.data || !response.data.results || response.data.results.length === 0) {
      throw new Error('No PNJ data from VNAppMob API')
    }
    
    const data = response.data.results[0]
    
    // PNJ 24K - Nhẫn tròn trơn 24K (per chỉ = per lượng / 10)
    if (data.buy_nhan_24k && data.sell_nhan_24k) {
      const buy = parseFloat(data.buy_nhan_24k)
      const sell = parseFloat(data.sell_nhan_24k)
      
      console.log(`[VNAppMob] ✅ Fetched PNJ prices`)
      return [{
        type: 'PNJ_24K',
        source: 'real',
        buy_price: buy,
        sell_price: sell,
        mid_price: (buy + sell) / 2,
        currency: 'VND',
        fetched_at: new Date(parseInt(data.datetime) * 1000),
        meta: {
          unit: '1 chỉ (3.75g)',
          location: 'Toàn quốc',
          provider: 'VNAppMob API',
          provider_url: 'https://api.vnappmob.com',
          description: 'Nhẫn tròn trơn PNJ 24K',
          brand: 'PNJ',
          note: 'Giá theo chỉ',
          raw_data: {
            buy_nt_24k: data.buy_nt_24k,
            sell_nt_24k: data.sell_nt_24k,
            buy_nt_18k: data.buy_nt_18k,
            sell_nt_18k: data.sell_nt_18k
          }
        }
      }]
    }
    
    throw new Error('Invalid PNJ data structure')
    
  } catch (error) {
    console.error('[VNAppMob] Failed to fetch PNJ:', error.message)
    throw error
  }
}

/**
 * Fetch international gold price (XAU/USD) from GoldPrice.org JSON API
 */
const fetchInternationalGold = async () => {
  try {
    // Using GoldPrice.org free JSON API (no key required)
    const response = await axios.get('https://www.goldprice.org/chart/gold.json', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    })
    
    if (!response.data) {
      throw new Error('Invalid response from GoldPrice.org API')
    }
    
    // GoldPrice.org returns array of [timestamp, price] pairs
    // Get the latest price (last element)
    const prices = response.data
    if (!Array.isArray(prices) || prices.length === 0) {
      throw new Error('No price data available from GoldPrice.org')
    }
    
    const latestPrice = prices[prices.length - 1][1] // [timestamp, price]
    const goldPriceUSD = parseFloat(latestPrice)
    
    if (isNaN(goldPriceUSD) || goldPriceUSD <= 0) {
      throw new Error(`Invalid gold price: ${latestPrice}`)
    }
    
    const spread = goldPriceUSD * 0.001 // 0.1% spread
    
    return {
      type: 'XAU_USD',
      source: 'real',
      buy_price: Math.round((goldPriceUSD - spread) * 100) / 100,
      sell_price: Math.round((goldPriceUSD + spread) * 100) / 100,
      mid_price: Math.round(goldPriceUSD * 100) / 100,
      currency: 'USD',
      fetched_at: new Date(),
      meta: {
        unit: '1 troy oz (31.1g)',
        market: 'International',
        provider: 'GoldPrice.org',
        provider_url: 'https://goldprice.org',
        description: 'Giá vàng quốc tế XAU/USD (real-time)',
        data_points: prices.length
      }
    }
  } catch (error) {
    console.error('[RealProvider] Failed to fetch from GoldPrice.org:', error.message)
    
    // Try alternative: Kitco.com price
    try {
      const kitcoResponse = await axios.get('https://www.kitco.com/market/gold', {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })
      
      // Simple regex to extract gold price from HTML
      const priceMatch = kitcoResponse.data.match(/Gold Spot Price.*?(\d+\.\d{2})/i)
      if (!priceMatch) {
        throw new Error('Could not extract price from Kitco')
      }
      
      const goldPriceUSD = parseFloat(priceMatch[1])
      const spread = goldPriceUSD * 0.001
      
      return {
        type: 'XAU_USD',
        source: 'real',
        buy_price: Math.round((goldPriceUSD - spread) * 100) / 100,
        sell_price: Math.round((goldPriceUSD + spread) * 100) / 100,
        mid_price: Math.round(goldPriceUSD * 100) / 100,
        currency: 'USD',
        fetched_at: new Date(),
        meta: {
          unit: '1 troy oz (31.1g)',
          market: 'International',
          provider: 'Kitco.com',
          provider_url: 'https://kitco.com',
          description: 'Giá vàng quốc tế XAU/USD (scraped)'
        }
      }
    } catch (kitcoError) {
      console.error('[RealProvider] Failed to fetch from Kitco:', kitcoError.message)
      throw new Error(`All international gold sources failed: ${error.message}, ${kitcoError.message}`)
    }
  }
}

/**
 * Fetch Vietcombank gold prices (backup for SJC)
 */
const fetchVietcombankGold = async () => {
  try {
    const response = await axios.get('https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx?b=68', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(response.data, { xmlMode: true })
    const results = []
    
    $('Exrate').each((i, elem) => {
      const code = $(elem).attr('CurrencyCode')
      const name = $(elem).attr('CurrencyName')
      const buy = parseFloat($(elem).attr('Buy'))
      const sell = parseFloat($(elem).attr('Sell'))
      
      // Find gold entries (usually marked with GOLD or SJC in name)
      if (name && name.includes('Vàng')) {
        results.push({
          type: 'SJC_9999',
          source: 'real',
          buy_price: buy * 1000, // VCB uses thousands
          sell_price: sell * 1000,
          mid_price: (buy + sell) / 2 * 1000,
          currency: 'VND',
          fetched_at: new Date(),
          meta: {
            unit: '1 lượng (37.5g)',
            location: 'Vietcombank',
            provider: 'Vietcombank',
            provider_url: 'https://portal.vietcombank.com.vn',
            description: name,
            code: code
          }
        })
      }
    })
    
    if (results.length === 0) {
      throw new Error('No gold data found in Vietcombank XML')
    }
    
    return results
  } catch (error) {
    console.error('[RealProvider] Failed to fetch Vietcombank gold:', error.message)
    throw error
  }
}

/**
 * Fetch SJC prices from official SJC website HTML
 */
const fetchSJCWebsite = async () => {
  try {
    // Try XML first
    const xmlResponse = await axios.get('https://sjc.com.vn/xml/tygiavang.xml', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(xmlResponse.data, { xmlMode: true })
    const results = []
    
    $('city').each((i, cityElem) => {
      const cityName = $(cityElem).attr('name')
      
      $(cityElem).find('item').each((j, item) => {
        const type = $(item).attr('type')
        const buy = parseFloat($(item).attr('buy'))
        const sell = parseFloat($(item).attr('sell'))
        
        // Get SJC gold from Ho Chi Minh City
        if (cityName === 'Hồ Chí Minh' && type && type.includes('SJC')) {
          const goldType = type.includes('9999') ? 'SJC_9999' : 'SJC_24K'
          
          results.push({
            type: goldType,
            source: 'real',
            buy_price: buy * 1000, // Convert to VND
            sell_price: sell * 1000,
            mid_price: (buy + sell) / 2 * 1000,
            currency: 'VND',
            fetched_at: new Date(),
            meta: {
              unit: '1 lượng (37.5g)',
              location: cityName,
              provider: 'SJC Official',
              provider_url: 'https://sjc.com.vn',
              description: `Vàng ${type}`,
              raw_type: type
            }
          })
        }
      })
    })
    
    if (results.length === 0) {
      throw new Error('No SJC gold data found in XML')
    }
    
    return results
  } catch (error) {
    console.error('[RealProvider] SJC XML failed, trying HTML scraping:', error.message)
    
    // Fallback: Scrape from HTML page
    try {
      const htmlResponse = await axios.get('https://sjc.com.vn/giavang/textContent.php', {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://sjc.com.vn'
        }
      })
      
      // Parse the plain text response (format: type|buy|sell)
      const lines = htmlResponse.data.trim().split('\n')
      const results = []
      
      lines.forEach(line => {
        const parts = line.split('|')
        if (parts.length >= 3) {
          const type = parts[0].trim()
          const buy = parseFloat(parts[1].replace(/[.,]/g, ''))
          const sell = parseFloat(parts[2].replace(/[.,]/g, ''))
          
          if (type.includes('SJC') && !isNaN(buy) && !isNaN(sell)) {
            const goldType = type.includes('9999') ? 'SJC_9999' : 'SJC_24K'
            
            results.push({
              type: goldType,
              source: 'real',
              buy_price: buy * 1000,
              sell_price: sell * 1000,
              mid_price: (buy + sell) / 2 * 1000,
              currency: 'VND',
              fetched_at: new Date(),
              meta: {
                unit: '1 lượng (37.5g)',
                location: 'TP.HCM',
                provider: 'SJC Official (HTML)',
                provider_url: 'https://sjc.com.vn',
                description: `Vàng ${type}`,
                raw_type: type
              }
            })
          }
        }
      })
      
      if (results.length === 0) {
        throw new Error('No SJC data found in HTML')
      }
      
      return results
    } catch (htmlError) {
      console.error('[RealProvider] SJC HTML scraping failed:', htmlError.message)
      throw new Error(`All SJC sources failed: XML: ${error.message}, HTML: ${htmlError.message}`)
    }
  }
}

/**
 * Fetch DOJI prices from their website
 */
const fetchDOJIPrices = async () => {
  try {
    // DOJI doesn't have public XML API, estimate from SJC with small discount
    throw new Error('DOJI API not available, manual update required')
  } catch (error) {
    console.error('[RealProvider] DOJI fetch failed:', error.message)
    throw error
  }
}

/**
 * Fetch PNJ prices
 */
const fetchPNJPrices = async () => {
  try {
    throw new Error('PNJ API not available, manual update required')
  } catch (error) {
    console.error('[RealProvider] PNJ fetch failed:', error.message)
    throw error
  }
}

/**
 * Fetch manual prices from .env as last resort
 */
const fetchManualPrices = () => {
  console.log('[RealProvider] Using manual prices from .env file')
  
  const results = []
  const now = new Date()
  
  // SJC_9999
  if (process.env.MANUAL_SJC_9999_BUY && process.env.MANUAL_SJC_9999_SELL) {
    results.push({
      type: 'SJC_9999',
      source: 'real',
      buy_price: parseFloat(process.env.MANUAL_SJC_9999_BUY),
      sell_price: parseFloat(process.env.MANUAL_SJC_9999_SELL),
      mid_price: (parseFloat(process.env.MANUAL_SJC_9999_BUY) + parseFloat(process.env.MANUAL_SJC_9999_SELL)) / 2,
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 lượng (37.5g)',
        location: 'TP.HCM',
        provider: 'Manual Override',
        provider_url: 'https://sjc.com.vn',
        description: 'Vàng SJC 9999 - Cập nhật thủ công',
        note: '⚠️ Giá được cập nhật thủ công từ .env'
      }
    })
  }
  
  // SJC_24K
  if (process.env.MANUAL_SJC_24K_BUY && process.env.MANUAL_SJC_24K_SELL) {
    results.push({
      type: 'SJC_24K',
      source: 'real',
      buy_price: parseFloat(process.env.MANUAL_SJC_24K_BUY),
      sell_price: parseFloat(process.env.MANUAL_SJC_24K_SELL),
      mid_price: (parseFloat(process.env.MANUAL_SJC_24K_BUY) + parseFloat(process.env.MANUAL_SJC_24K_SELL)) / 2,
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 lượng (37.5g)',
        location: 'TP.HCM',
        provider: 'Manual Override',
        provider_url: 'https://sjc.com.vn',
        description: 'Vàng SJC 24K - Cập nhật thủ công'
      }
    })
  }
  
  // DOJI_24K
  if (process.env.MANUAL_DOJI_24K_BUY && process.env.MANUAL_DOJI_24K_SELL) {
    results.push({
      type: 'DOJI_24K',
      source: 'real',
      buy_price: parseFloat(process.env.MANUAL_DOJI_24K_BUY),
      sell_price: parseFloat(process.env.MANUAL_DOJI_24K_SELL),
      mid_price: (parseFloat(process.env.MANUAL_DOJI_24K_BUY) + parseFloat(process.env.MANUAL_DOJI_24K_SELL)) / 2,
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 lượng (37.5g)',
        location: 'Hà Nội',
        provider: 'Manual Override',
        provider_url: 'https://doji.vn',
        description: 'Vàng DOJI 24K - Cập nhật thủ công',
        brand: 'DOJI'
      }
    })
  }
  
  // XAU_USD
  if (process.env.MANUAL_XAU_USD) {
    const price = parseFloat(process.env.MANUAL_XAU_USD)
    results.push({
      type: 'XAU_USD',
      source: 'real',
      buy_price: price - 1,
      sell_price: price + 1,
      mid_price: price,
      currency: 'USD',
      fetched_at: now,
      meta: {
        unit: '1 troy oz (31.1g)',
        market: 'International',
        provider: 'Manual Override',
        provider_url: 'https://kitco.com',
        description: 'Vàng quốc tế - Cập nhật thủ công'
      }
    })
  }
  
  return results
}

/**
 * Main fetch function - tries VNAppMob API first, then fallback
 */
export const fetchGoldPrices = async () => {
  console.log('[RealProvider] Fetching real-time gold prices from VNAppMob API...')
  
  const results = []
  const errors = []
  let usedManual = false
  let usedVNAppMob = false
  
  // 1. Try VNAppMob API for SJC
  try {
    const sjcData = await fetchVNAppMobSJC()
    results.push(...sjcData)
    console.log(`[RealProvider] ✅ VNAppMob SJC fetched (${sjcData.length} types)`)
    usedVNAppMob = true
  } catch (error) {
    errors.push(`VNAppMob SJC: ${error.message}`)
    console.error('[RealProvider] ❌ VNAppMob SJC failed, trying fallback...')
    
    // Fallback to old SJC sources
    try {
      const sjcData = await fetchSJCWebsite()
      results.push(...sjcData)
      console.log(`[RealProvider] ✅ SJC fallback fetched (${sjcData.length} types)`)
    } catch (sjcError) {
      errors.push(`SJC fallback: ${sjcError.message}`)
      console.error('[RealProvider] ❌ SJC fallback failed')
    }
  }
  
  // 2. Try VNAppMob API for DOJI
  try {
    const dojiData = await fetchVNAppMobDOJI()
    results.push(...dojiData)
    console.log(`[RealProvider] ✅ VNAppMob DOJI fetched`)
    usedVNAppMob = true
  } catch (error) {
    errors.push(`VNAppMob DOJI: ${error.message}`)
    console.error('[RealProvider] ❌ VNAppMob DOJI failed')
  }
  
  // 3. Try VNAppMob API for PNJ (optional, will be filtered by frontend)
  try {
    const pnjData = await fetchVNAppMobPNJ()
    results.push(...pnjData)
    console.log(`[RealProvider] ✅ VNAppMob PNJ fetched`)
    usedVNAppMob = true
  } catch (error) {
    errors.push(`VNAppMob PNJ: ${error.message}`)
    console.error('[RealProvider] ❌ VNAppMob PNJ failed')
  }
  
  // 4. Try international gold APIs
  try {
    const intGold = await fetchInternationalGold()
    results.push(intGold)
    console.log('[RealProvider] ✅ International gold fetched from API')
  } catch (error) {
    errors.push(`International API: ${error.message}`)
    console.error('[RealProvider] ❌ International gold API failed')
    
    // Use manual XAU_USD if available
    if (process.env.MANUAL_XAU_USD) {
      const price = parseFloat(process.env.MANUAL_XAU_USD)
      results.push({
        type: 'XAU_USD',
        source: 'real',
        buy_price: price - 1,
        sell_price: price + 1,
        mid_price: price,
        currency: 'USD',
        fetched_at: new Date(),
        meta: {
          unit: '1 troy oz (31.1g)',
          market: 'International',
          provider: 'Manual Override (.env)',
          provider_url: 'https://kitco.com',
          description: 'Vàng quốc tế - Cập nhật thủ công',
          note: '⚠️ API không khả dụng, sử dụng giá manual từ .env'
        }
      })
      console.log('[RealProvider] ⚠️ Using manual XAU_USD from .env')
      usedManual = true
    }
  }
  
  // 5. If VNAppMob failed and no results, use manual prices
  if (!usedVNAppMob && results.length === 0) {
    console.error('[RealProvider] ❌ All APIs failed, using manual prices from .env')
    const manualPrices = fetchManualPrices()
    results.push(...manualPrices)
    usedManual = true
  }
  
  // 4. Final check
  if (results.length === 0) {
    const errorMsg = `
❌ KHÔNG THỂ LẤY GIÁ VÀNG

Tất cả API đều không khả dụng:
${errors.join('\n')}

Giải pháp:
1. Thêm API key vào file .env:
   - GOLDAPI_KEY=xxx (https://goldapi.io)
   - METALSAPI_KEY=xxx (https://metals-api.com)

2. Hoặc cập nhật giá thủ công trong .env:
   - MANUAL_SJC_9999_BUY=79000000
   - MANUAL_SJC_9999_SELL=79500000
   - MANUAL_XAU_USD=2650.50

3. Lấy giá mới nhất từ:
   - https://sjc.com.vn (vàng trong nước)
   - https://kitco.com (vàng quốc tế)
`
    console.error(errorMsg)
    throw new Error(errorMsg)
  }
  
  // 5. Calculate mid_price if missing
  results.forEach(rate => {
    if (!rate.mid_price) {
      rate.mid_price = Math.round((rate.buy_price + rate.sell_price) / 2)
    }
  })
  
  const statusMsg = usedManual 
    ? `⚠️ PARTIAL SUCCESS: ${results.length} prices (some from .env manual override)`
    : `✅ SUCCESS: ${results.length} prices from live APIs`
  
  console.log(`[RealProvider] ${statusMsg}`)
  
  if (errors.length > 0) {
    console.warn(`[RealProvider] Some API errors: ${errors.join('; ')}`)
  }
  
  return results
}

/**
 * Get provider information
 */
export const getProviderInfo = () => {
  return {
    name: 'real',
    display_name: 'Real Market Data',
    description: 'Real-time gold prices from multiple sources',
    types_supported: [
      'SJC_9999',
      'SJC_24K',
      'DOJI_24K',
      'PNJ_24K',
      'XAU_USD'
    ],
    update_frequency: 'Every 5 minutes',
    reliability: 'Production',
    enabled: true,
    sources: [
      'ExchangeRate API',
      'Vietcombank',
      'Market Data (fallback)'
    ]
  }
}

export default {
  fetchGoldPrices,
  getProviderInfo
}
