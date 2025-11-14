/**
 * Mock Gold Provider
 * @description Provides mock gold price data for development and testing
 * @author KaDong Team
 * @created 2025-11-11
 */

/**
 * Generate random price variation
 * @param {number} basePrice - Base price
 * @param {number} variation - Max variation percentage (default 2%)
 * @returns {number} Price with random variation
 */
const generatePrice = (basePrice, variation = 0.02) => {
  const change = basePrice * variation * (Math.random() - 0.5)
  return Math.round((basePrice + change) * 100) / 100
}

/**
 * Fetch mock gold prices
 * @returns {Promise<Array>} Array of gold rate objects
 */
export const fetchGoldPrices = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const now = new Date()

  // Base prices (VND per lượng for local gold, USD per oz for international)
  const basePrices = {
    SJC_9999: 78500000,
    SJC_24K: 78200000,
    PNJ_24K: 78000000,
    PNJ_18K: 58500000,
    DOJI_24K: 78100000,
    GOLD_14K: 45600000,
    XAU_USD: 2026.00
  }

  // Generate prices with realistic spreads
  const goldRates = [
    {
      type: 'SJC_9999',
      source: 'mock',
      buy_price: generatePrice(basePrices.SJC_9999, 0.01),
      sell_price: generatePrice(basePrices.SJC_9999 + 500000, 0.01),
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 lượng (37.5g)',
        location: 'TP.HCM',
        provider_url: 'https://sjc.com.vn',
        description: 'Vàng SJC 9999 - Vàng nguyên chất 24K'
      }
    },
    {
      type: 'SJC_24K',
      source: 'mock',
      buy_price: generatePrice(basePrices.SJC_24K, 0.01),
      sell_price: generatePrice(basePrices.SJC_24K + 500000, 0.01),
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 lượng (37.5g)',
        location: 'TP.HCM',
        provider_url: 'https://sjc.com.vn',
        description: 'Vàng miếng SJC 24K'
      }
    },
    {
      type: 'PNJ_24K',
      source: 'mock',
      buy_price: generatePrice(basePrices.PNJ_24K, 0.015),
      sell_price: generatePrice(basePrices.PNJ_24K + 500000, 0.015),
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 chỉ (3.75g)',
        location: 'Toàn quốc',
        provider_url: 'https://pnj.com.vn',
        brand: 'PNJ',
        description: 'Vàng 24K PNJ'
      }
    },
    {
      type: 'PNJ_18K',
      source: 'mock',
      buy_price: generatePrice(basePrices.PNJ_18K, 0.015),
      sell_price: generatePrice(basePrices.PNJ_18K + 500000, 0.015),
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 chỉ (3.75g)',
        location: 'Toàn quốc',
        provider_url: 'https://pnj.com.vn',
        brand: 'PNJ',
        purity: '75%',
        description: 'Vàng 18K PNJ (vàng tây)'
      }
    },
    {
      type: 'DOJI_24K',
      source: 'mock',
      buy_price: generatePrice(basePrices.DOJI_24K, 0.01),
      sell_price: generatePrice(basePrices.DOJI_24K + 500000, 0.01),
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 lượng (37.5g)',
        location: 'Hà Nội',
        provider_url: 'https://doji.vn',
        brand: 'DOJI',
        description: 'Vàng miếng DOJI 24K'
      }
    },
    {
      type: 'GOLD_14K',
      source: 'mock',
      buy_price: generatePrice(basePrices.GOLD_14K, 0.02),
      sell_price: generatePrice(basePrices.GOLD_14K + 500000, 0.02),
      currency: 'VND',
      fetched_at: now,
      meta: {
        unit: '1 chỉ (3.75g)',
        location: 'TP.HCM',
        purity: '58.5%',
        description: 'Vàng 14K (vàng trang sức)'
      }
    },
    {
      type: 'XAU_USD',
      source: 'mock',
      buy_price: generatePrice(basePrices.XAU_USD - 1, 0.005),
      sell_price: generatePrice(basePrices.XAU_USD + 1, 0.005),
      currency: 'USD',
      fetched_at: now,
      meta: {
        unit: '1 troy oz (31.1g)',
        market: 'International',
        provider: 'Mock Exchange',
        provider_url: 'https://kitco.com',
        description: 'Giá vàng quốc tế XAU/USD'
      }
    }
  ]

  // Calculate mid_price for each rate
  goldRates.forEach(rate => {
    rate.mid_price = (rate.buy_price + rate.sell_price) / 2
  })

  return goldRates
}

/**
 * Get provider information
 * @returns {Object} Provider metadata
 */
export const getProviderInfo = () => {
  return {
    name: 'mock',
    display_name: 'Mock Provider',
    description: 'Mock gold price provider for development and testing',
    types_supported: [
      'SJC_9999',
      'SJC_24K',
      'PNJ_24K',
      'PNJ_18K',
      'DOJI_24K',
      'GOLD_14K',
      'XAU_USD'
    ],
    update_frequency: 'Every 5 minutes',
    reliability: 'Testing only',
    enabled: false  // ❌ DISABLED - Use real provider instead
  }
}

export default {
  fetchGoldPrices,
  getProviderInfo
}
