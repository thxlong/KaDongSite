/**
 * Gold Providers Index
 * @description Central registry of all gold price data providers
 * @author KaDong Team
 * @created 2025-11-11
 */

import mockProvider from './mockProvider.js'
import realProvider from './realProvider.js'
// import sjcProvider from './sjcProvider.js'
// import pnjProvider from './pnjProvider.js'
// import dojiProvider from './dojiProvider.js'
// import internationalProvider from './internationalProvider.js'

/**
 * Registry of all available providers
 * Add new providers here after implementation
 */
export const providers = {
  real: realProvider,  // ← Real market data provider
  mock: mockProvider,  // Keep for testing
  // sjc: sjcProvider,
  // pnj: pnjProvider,
  // doji: dojiProvider,
  // international: internationalProvider,
}

/**
 * Get active providers (enabled only)
 * @returns {Object} Active providers
 */
export const getActiveProviders = () => {
  const active = {}
  
  for (const [name, provider] of Object.entries(providers)) {
    const info = provider.getProviderInfo()
    if (info.enabled) {
      active[name] = provider
    }
  }
  
  return active
}

/**
 * Get provider by name
 * @param {string} providerName - Provider name
 * @returns {Object|null} Provider object or null if not found
 */
export const getProvider = (providerName) => {
  return providers[providerName] || null
}

/**
 * Get all provider information
 * @returns {Array} Array of provider info objects
 */
export const getAllProviderInfo = () => {
  return Object.values(providers).map(provider => provider.getProviderInfo())
}

/**
 * Fetch gold prices from all active providers
 * @returns {Promise<Array>} Combined array of gold rates from all providers
 */
export const fetchFromAllProviders = async () => {
  const active = getActiveProviders()
  const results = []
  const errors = []

  for (const [name, provider] of Object.entries(active)) {
    try {
      console.log(`[Providers] Fetching from ${name}...`)
      const data = await provider.fetchGoldPrices()
      results.push(...data)
      console.log(`[Providers] ✅ Fetched ${data.length} rates from ${name}`)
    } catch (error) {
      console.error(`[Providers] ❌ Failed to fetch from ${name}:`, error.message)
      errors.push({ provider: name, error: error.message })
    }
  }

  if (errors.length > 0) {
    console.warn(`[Providers] ⚠️  ${errors.length} provider(s) failed`)
  }

  return { rates: results, errors }
}

export default {
  providers,
  getActiveProviders,
  getProvider,
  getAllProviderInfo,
  fetchFromAllProviders
}
