/**
 * Gold Controller
 * @description Handle gold price API requests
 * @author KaDong Team
 * @created 2025-11-11
 */

import { query } from '#config/database.config.js'
import { getAllProviderInfo } from '#providers/index.js'

/**
 * GET /api/gold/latest
 * Get latest gold prices
 * @query {string} types - Comma-separated list of gold types (optional, defaults to all)
 * @query {string} sources - Comma-separated list of sources (optional)
 * @query {number} limit - Max number of results per type (default: 1)
 */
export const getLatestGoldPrices = async (req, res) => {
  try {
    const { types, sources, limit = 1 } = req.query

    // Build WHERE clauses
    const conditions = []
    const params = []
    let paramCount = 0

    if (types) {
      const typeList = types.split(',').map(t => t.trim()).filter(Boolean)
      if (typeList.length > 0) {
        paramCount++
        conditions.push(`type = ANY($${paramCount})`)
        params.push(typeList)
      }
    }

    if (sources) {
      const sourceList = sources.split(',').map(s => s.trim()).filter(Boolean)
      if (sourceList.length > 0) {
        paramCount++
        conditions.push(`source = ANY($${paramCount})`)
        params.push(sourceList)
      }
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : ''

    // Get distinct types first
    const typesQuery = `
      SELECT DISTINCT type 
      FROM gold_rates 
      ${whereClause}
      ORDER BY type
    `
    const { rows: typeRows } = await query(typesQuery, params)

    // Get latest rates for each type
    const results = []
    for (const { type } of typeRows) {
      const ratesQuery = `
        SELECT 
          id,
          type,
          source,
          buy_price,
          sell_price,
          mid_price,
          currency,
          fetched_at,
          meta,
          created_at
        FROM gold_rates
        WHERE type = $1
        ${sources ? `AND source = ANY($2)` : ''}
        ORDER BY fetched_at DESC
        LIMIT $${sources ? 3 : 2}
      `
      
      const ratesParams = sources 
        ? [type, sources.split(',').map(s => s.trim()), parseInt(limit)]
        : [type, parseInt(limit)]

      const { rows: rateRows } = await query(ratesQuery, ratesParams)
      results.push(...rateRows)
    }

    res.json({
      success: true,
      data: results,
      count: results.length,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('[Gold Controller] getLatestGoldPrices error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest gold prices',
      message: error.message
    })
  }
}

/**
 * GET /api/gold/history
 * Get historical gold price data
 * @query {string} type - Gold type (required)
 * @query {string} period - Time period: day|week|month|year (default: day)
 * @query {string} from - Start date ISO string (optional)
 * @query {string} to - End date ISO string (optional)
 * @query {string} interval - Data interval: hour|day|week (default: hour for day, day for longer)
 * @query {number} limit - Max records (default: 1000)
 */
export const getGoldPriceHistory = async (req, res) => {
  try {
    const { 
      type, 
      period = 'day', 
      from, 
      to, 
      interval, 
      limit = 1000 
    } = req.query

    // Validate required params
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: type'
      })
    }

    // Determine date range
    let startDate, endDate
    
    if (from && to) {
      startDate = new Date(from)
      endDate = new Date(to)
    } else {
      endDate = new Date()
      
      switch (period) {
        case 'day':
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
          break
        case 'week':
          startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'year':
          startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
      }
    }

    // Determine interval if not specified
    let dataInterval = interval
    if (!dataInterval) {
      const rangeDays = (endDate - startDate) / (24 * 60 * 60 * 1000)
      if (rangeDays <= 1) {
        dataInterval = 'hour'
      } else if (rangeDays <= 31) {
        dataInterval = 'day'
      } else {
        dataInterval = 'week'
      }
    }

    // Build query based on interval
    let intervalTrunc
    switch (dataInterval) {
      case 'hour':
        intervalTrunc = `date_trunc('hour', fetched_at)`
        break
      case 'day':
        intervalTrunc = `date_trunc('day', fetched_at)`
        break
      case 'week':
        intervalTrunc = `date_trunc('week', fetched_at)`
        break
      default:
        intervalTrunc = `date_trunc('hour', fetched_at)`
    }

    // Query with aggregation
    const historyQuery = `
      SELECT 
        ${intervalTrunc} as time_bucket,
        type,
        source,
        AVG(buy_price) as avg_buy_price,
        AVG(sell_price) as avg_sell_price,
        AVG(mid_price) as avg_mid_price,
        MIN(buy_price) as min_buy_price,
        MAX(sell_price) as max_sell_price,
        currency,
        COUNT(*) as data_points,
        MIN(fetched_at) as period_start,
        MAX(fetched_at) as period_end
      FROM gold_rates
      WHERE type = $1
        AND fetched_at >= $2
        AND fetched_at <= $3
      GROUP BY ${intervalTrunc}, type, source, currency
      ORDER BY time_bucket ASC
      LIMIT $4
    `

    const { rows } = await query(historyQuery, [
      type,
      startDate,
      endDate,
      parseInt(limit)
    ])

    res.json({
      success: true,
      data: rows,
      count: rows.length,
      meta: {
        type,
        period,
        interval: dataInterval,
        start_date: startDate,
        end_date: endDate,
        range_days: ((endDate - startDate) / (24 * 60 * 60 * 1000)).toFixed(1)
      },
      timestamp: new Date()
    })

  } catch (error) {
    console.error('[Gold Controller] getGoldPriceHistory error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gold price history',
      message: error.message
    })
  }
}

/**
 * POST /api/gold/fetch
 * Trigger manual gold price fetch (admin/cron only)
 * Requires authentication in production
 */
export const triggerGoldFetch = async (req, res) => {
  try {
    // In production, add authentication check here
    // if (!req.user || !req.user.isAdmin) {
    //   return res.status(403).json({ error: 'Forbidden' })
    // }

    const { fetchFromAllProviders } = await import('#providers/index.js')
    
    console.log('[Gold Controller] Manual fetch triggered')
    const { rates, errors } = await fetchFromAllProviders()

    // Save to database
    let savedCount = 0
    for (const rate of rates) {
      try {
        await query(`
          INSERT INTO gold_rates (
            type, source, buy_price, sell_price, mid_price, 
            currency, fetched_at, meta
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          rate.type,
          rate.source,
          rate.buy_price,
          rate.sell_price,
          rate.mid_price,
          rate.currency,
          rate.fetched_at,
          JSON.stringify(rate.meta)
        ])
        savedCount++
      } catch (saveError) {
        console.error(`[Gold Controller] Failed to save rate:`, saveError.message)
      }
    }

    res.json({
      success: true,
      message: 'Gold prices fetched successfully',
      data: {
        fetched: rates.length,
        saved: savedCount,
        errors: errors.length,
        provider_errors: errors
      },
      timestamp: new Date()
    })

  } catch (error) {
    console.error('[Gold Controller] triggerGoldFetch error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to trigger gold price fetch',
      message: error.message
    })
  }
}

/**
 * GET /api/gold/sources
 * Get list of available data sources/providers
 */
export const getGoldSources = async (req, res) => {
  try {
    const providerInfo = getAllProviderInfo()

    // Get statistics from database
    const statsQuery = `
      SELECT 
        source,
        COUNT(*) as total_records,
        MAX(fetched_at) as last_updated,
        COUNT(DISTINCT type) as types_count
      FROM gold_rates
      GROUP BY source
    `
    const { rows: stats } = await query(statsQuery)

    // Merge provider info with stats
    const sources = providerInfo.map(provider => {
      const stat = stats.find(s => s.source === provider.name)
      return {
        ...provider,
        statistics: stat ? {
          total_records: parseInt(stat.total_records),
          last_updated: stat.last_updated,
          types_count: parseInt(stat.types_count)
        } : null
      }
    })

    res.json({
      success: true,
      data: sources,
      count: sources.length,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('[Gold Controller] getGoldSources error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch gold sources',
      message: error.message
    })
  }
}

export default {
  getLatestGoldPrices,
  getGoldPriceHistory,
  triggerGoldFetch,
  getGoldSources
}
