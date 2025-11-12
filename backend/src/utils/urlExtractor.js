/**
 * URL Metadata Extractor
 * Extracts product information from URLs using web scraping
 */

import axios from 'axios'
import * as cheerio from 'cheerio'

/**
 * Extract metadata from Shopee URL
 * @param {string} url - Shopee product URL
 * @returns {Promise<Object|null>} Extracted metadata or null if failed
 */
async function extractShopeeMetadata(url) {
  try {
    // Parse Shopee URL to extract shop_id and item_id
    // Format 1: https://shopee.vn/product-name-i.{shop_id}.{item_id}
    // Format 2: https://shopee.vn/product/{shop_id}/{item_id}
    let shopId, itemId
    
    // Try format 1: product-name-i.{shop_id}.{item_id}
    let match = url.match(/i\.(\d+)\.(\d+)/)
    if (match) {
      [, shopId, itemId] = match
    } else {
      // Try format 2: product/{shop_id}/{item_id}
      match = url.match(/\/product\/(\d+)\/(\d+)/)
      if (match) {
        [, shopId, itemId] = match
      } else {
        console.error('[URLExtractor] Invalid Shopee URL format:', url)
        return null
      }
    }

    // Call Shopee API
    const apiUrl = `https://shopee.vn/api/v4/item/get?itemid=${itemId}&shopid=${shopId}`
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://shopee.vn/',
        'Accept': 'application/json'
      },
      httpsAgent: new (await import('https')).Agent({
        rejectUnauthorized: false
      })
    })

    const data = response.data?.data
    if (!data) {
      console.error('[URLExtractor] No data from Shopee API')
      return null
    }

    // Extract product info
    const price = data.price_max || data.price_min || data.price
    const priceInVND = price ? price / 100000 : null // Shopee price is in 100000 VND units

    // Get main image
    let imageUrl = null
    if (data.image) {
      imageUrl = `https://cf.shopee.vn/file/${data.image}`
    } else if (data.images && data.images.length > 0) {
      imageUrl = `https://cf.shopee.vn/file/${data.images[0]}`
    }

    console.log('[URLExtractor] Successfully extracted from Shopee:', data.name)

    return {
      title: data.name || '',
      image: imageUrl,
      description: data.description || '',
      price: priceInVND,
      currency: 'VND',
      origin: 'Shopee'
    }
  } catch (error) {
    console.error('[URLExtractor] Shopee API error:', error.message)
    return null
  }
}

/**
 * Extract metadata from Tiki URL
 * @param {string} url - Tiki product URL
 * @returns {Promise<Object|null>} Extracted metadata or null if failed
 */
async function extractTikiMetadata(url) {
  try {
    // Parse Tiki URL to extract product_id
    // Format: https://tiki.vn/product-name-p{product_id}.html
    const match = url.match(/p(\d+)\.html/)
    if (!match) {
      console.error('[URLExtractor] Invalid Tiki URL format:', url)
      return null
    }

    const [, productId] = match

    // Call Tiki API
    const apiUrl = `https://tiki.vn/api/v2/products/${productId}`
    
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://tiki.vn/',
        'Accept': 'application/json'
      },
      httpsAgent: new (await import('https')).Agent({
        rejectUnauthorized: false
      })
    })

    const data = response.data
    if (!data) {
      console.error('[URLExtractor] No data from Tiki API')
      return null
    }

    console.log('[URLExtractor] Successfully extracted from Tiki:', data.name)

    return {
      title: data.name || '',
      image: data.thumbnail_url || data.images?.[0]?.base_url,
      description: data.short_description || data.description || '',
      price: data.price || data.list_price,
      currency: 'VND',
      origin: 'Tiki'
    }
  } catch (error) {
    console.error('[URLExtractor] Tiki API error:', error.message)
    return null
  }
}

/**
 * Extract metadata from a product URL
 * @param {string} url - Product URL to extract metadata from
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<Object|null>} Extracted metadata or null if failed
 */
export async function extractMetadata(url, timeout = 5000) {
  try {
    // Validate URL
    if (!url || typeof url !== 'string') {
      console.error('[URLExtractor] Invalid URL:', url)
      return null
    }

    // Check if it's a Shopee URL
    if (url.includes('shopee.vn')) {
      console.log('[URLExtractor] Detected Shopee URL, using Shopee API')
      return await extractShopeeMetadata(url)
    }

    // Check if it's a Tiki URL
    if (url.includes('tiki.vn')) {
      console.log('[URLExtractor] Detected Tiki URL, using Tiki API')
      return await extractTikiMetadata(url)
    }

    // Fetch the page
    const response = await axios.get(url, {
      timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      validateStatus: (status) => status === 200
    })

    // Parse HTML
    const $ = cheerio.load(response.data)

    // Extract Open Graph metadata (most reliable)
    const ogTitle = $('meta[property="og:title"]').attr('content')
    const ogImage = $('meta[property="og:image"]').attr('content')
    const ogDescription = $('meta[property="og:description"]').attr('content')
    const ogSiteName = $('meta[property="og:site_name"]').attr('content')

    // Extract product-specific metadata
    const productPrice = $('meta[property="product:price:amount"]').attr('content')
    const productCurrency = $('meta[property="product:price:currency"]').attr('content')

    // Fallbacks if Open Graph not available
    const title = ogTitle || 
                  $('meta[name="title"]').attr('content') || 
                  $('title').text() ||
                  $('h1').first().text() ||
                  ''

    const image = ogImage || 
                  $('meta[property="twitter:image"]').attr('content') ||
                  $('meta[name="twitter:image"]').attr('content') ||
                  $('img[itemprop="image"]').attr('src') ||
                  $('img').first().attr('src') ||
                  ''

    const description = ogDescription || 
                        $('meta[name="description"]').attr('content') ||
                        $('meta[property="twitter:description"]').attr('content') ||
                        $('p').first().text() ||
                        ''

    // Try to extract price from JSON-LD schema
    let jsonLdPrice = null
    let jsonLdCurrency = null
    
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const json = JSON.parse($(elem).html())
        if (json['@type'] === 'Product' && json.offers) {
          jsonLdPrice = json.offers.price || json.offers.lowPrice
          jsonLdCurrency = json.offers.priceCurrency
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    })

    // Extract origin/site name
    const origin = ogSiteName || 
                   $('meta[name="application-name"]').attr('content') ||
                   new URL(url).hostname.replace('www.', '') ||
                   ''

    // Clean up extracted data
    const metadata = {
      title: cleanText(title),
      image: resolveUrl(image, url),
      description: cleanText(description, 500),
      price: parsePrice(productPrice || jsonLdPrice),
      currency: parseCurrency(productCurrency || jsonLdCurrency),
      origin: cleanText(origin, 100)
    }

    console.log('[URLExtractor] Successfully extracted metadata from:', url)
    return metadata

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('[URLExtractor] Timeout:', url)
    } else if (error.response) {
      console.error('[URLExtractor] HTTP Error:', error.response.status, url)
    } else if (error.request) {
      console.error('[URLExtractor] Network Error:', url)
    } else {
      console.error('[URLExtractor] Error:', error.message, url)
    }
    return null
  }
}

/**
 * Clean text by trimming, removing extra whitespace, and limiting length
 * @param {string} text - Text to clean
 * @param {number} maxLength - Maximum length (optional)
 * @returns {string} Cleaned text
 */
function cleanText(text, maxLength = null) {
  if (!text) return ''
  
  let cleaned = text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, ' ') // Replace newlines with space
  
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength).trim() + '...'
  }
  
  return cleaned
}

/**
 * Resolve relative URLs to absolute URLs
 * @param {string} url - URL to resolve
 * @param {string} baseUrl - Base URL
 * @returns {string} Absolute URL or empty string
 */
function resolveUrl(url, baseUrl) {
  if (!url) return ''
  
  try {
    // Already absolute URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    
    // Resolve relative URL
    const base = new URL(baseUrl)
    return new URL(url, base.origin).href
  } catch (error) {
    return url // Return as-is if resolution fails
  }
}

/**
 * Parse price string to number
 * @param {string} priceStr - Price string
 * @returns {number|null} Parsed price or null
 */
function parsePrice(priceStr) {
  if (!priceStr) return null
  
  // Remove currency symbols and commas
  const cleaned = String(priceStr)
    .replace(/[₫$€£¥,]/g, '')
    .replace(/\s/g, '')
    .trim()
  
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

/**
 * Parse currency code
 * @param {string} currencyStr - Currency string
 * @returns {string|null} Currency code (VND, USD, EUR, JPY) or null
 */
function parseCurrency(currencyStr) {
  if (!currencyStr) return null
  
  const upper = String(currencyStr).toUpperCase()
  
  // Map common currency codes
  const currencyMap = {
    'VND': 'VND',
    'VNĐ': 'VND',
    'DONG': 'VND',
    'USD': 'USD',
    'DOLLAR': 'USD',
    'EUR': 'EUR',
    'EURO': 'EUR',
    'JPY': 'JPY',
    'YEN': 'JPY'
  }
  
  return currencyMap[upper] || null
}

export default extractMetadata
