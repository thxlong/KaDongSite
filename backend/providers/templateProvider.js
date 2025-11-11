/**
 * Template Gold Provider
 * @description Template for implementing real gold price data providers
 * @author KaDong Team
 * @created 2025-11-11
 * 
 * HOW TO IMPLEMENT A NEW PROVIDER:
 * 
 * 1. Copy this file to a new file (e.g., sjcProvider.js, pnjProvider.js)
 * 2. Implement fetchGoldPrices() to fetch data from real API
 * 3. Implement getProviderInfo() to return provider metadata
 * 4. Update the returned data structure to match API response
 * 5. Handle errors appropriately
 * 6. Add provider to providers/index.js
 * 7. Test with npm run fetch-gold
 * 
 * REQUIRED DATA STRUCTURE:
 * 
 * Each provider must return an array of gold rate objects:
 * {
 *   type: string,           // Gold type identifier (e.g., 'SJC_9999', 'PNJ_24K')
 *   source: string,         // Provider name (e.g., 'sjc', 'pnj', 'doji')
 *   buy_price: number,      // Buy price (customer sells to shop)
 *   sell_price: number,     // Sell price (customer buys from shop)
 *   mid_price: number,      // Mid-market price (optional, will be calculated if missing)
 *   currency: string,       // 'VND' or 'USD'
 *   fetched_at: Date,       // Timestamp when data was fetched
 *   meta: object            // Additional metadata (unit, location, etc.)
 * }
 */

import fetch from 'node-fetch' // or axios

/**
 * Fetch gold prices from provider API
 * @returns {Promise<Array>} Array of gold rate objects
 * @throws {Error} If API request fails
 */
export const fetchGoldPrices = async () => {
  try {
    // TODO: Implement API call to fetch real gold prices
    // Example:
    // const response = await fetch('https://api.example.com/gold-prices', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.GOLD_PROVIDER_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // })
    // 
    // if (!response.ok) {
    //   throw new Error(`API request failed: ${response.statusText}`)
    // }
    // 
    // const data = await response.json()

    const now = new Date()

    // TODO: Transform API response to standard format
    const goldRates = [
      {
        type: 'EXAMPLE_TYPE',        // TODO: Map from API response
        source: 'template',           // Your provider name
        buy_price: 0,                 // TODO: Extract from API response
        sell_price: 0,                // TODO: Extract from API response
        mid_price: 0,                 // Optional: calculate or extract
        currency: 'VND',              // TODO: Determine from API
        fetched_at: now,
        meta: {
          unit: '1 lượng (37.5g)',    // TODO: Extract from API
          location: 'TP.HCM',         // TODO: Extract from API
          provider_url: 'https://...',// Provider website
          description: '',            // Description of gold type
          // Add any provider-specific metadata
        }
      }
      // Add more gold types as needed
    ]

    // Calculate mid_price if not provided
    goldRates.forEach(rate => {
      if (!rate.mid_price) {
        rate.mid_price = (rate.buy_price + rate.sell_price) / 2
      }
    })

    return goldRates

  } catch (error) {
    console.error(`[templateProvider] Failed to fetch gold prices:`, error)
    throw new Error(`Template provider fetch failed: ${error.message}`)
  }
}

/**
 * Get provider information and metadata
 * @returns {Object} Provider information
 */
export const getProviderInfo = () => {
  return {
    name: 'template',                    // Unique provider identifier
    display_name: 'Template Provider',   // Display name in UI
    description: 'Template for implementing real gold price providers',
    types_supported: [                   // Gold types this provider supports
      'EXAMPLE_TYPE'
      // Add all supported types
    ],
    update_frequency: 'Every N minutes', // How often data is updated
    reliability: 'Production/Testing',   // Reliability level
    enabled: false,                      // Enable/disable provider
    api_key_required: true,              // Does it need API key?
    rate_limit: '100 requests/hour',     // API rate limit (if any)
    documentation_url: 'https://...'     // Provider API documentation
  }
}

/**
 * EXAMPLE IMPLEMENTATIONS:
 * 
 * 1. SJC Provider (scraping or API):
 *    - Fetch from https://sjc.com.vn/xml/tygiavang.xml
 *    - Parse XML response
 *    - Map to standard format
 * 
 * 2. PNJ Provider:
 *    - Fetch from PNJ API or website
 *    - Parse JSON/HTML
 *    - Map to standard format
 * 
 * 3. International Gold (Kitco, GoldAPI, etc):
 *    - Fetch from https://www.goldapi.io/api/XAU/USD
 *    - Parse JSON
 *    - Convert units (troy oz to grams if needed)
 * 
 * 4. Multiple currencies:
 *    - Fetch exchange rates if needed
 *    - Convert prices to VND or USD
 * 
 * ERROR HANDLING:
 * - Throw descriptive errors
 * - Log errors for debugging
 * - Return empty array if partial failure is acceptable
 * - Use try/catch for network requests
 * 
 * TESTING:
 * - Create test file: tests/providers/yourProvider.test.js
 * - Mock API responses
 * - Test error handling
 * - Validate data structure
 */

export default {
  fetchGoldPrices,
  getProviderInfo
}
