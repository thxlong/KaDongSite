/**
 * Weather Controller
 * @description Handle weather API requests and favorite cities
 * @author KaDong Team
 * @created 2025-11-11
 */

import { query } from '../config/database.js'
import * as weatherService from '../services/weatherService.js'

/**
 * GET /api/weather/current
 * Get current weather by location
 * @query {string} city - City name (optional)
 * @query {number} lat - Latitude (optional)
 * @query {number} lon - Longitude (optional)
 * @query {string} units - 'metric' or 'imperial' (default: 'metric')
 */
export const getCurrentWeather = async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query

    // Validate units
    if (units && !['metric', 'imperial'].includes(units)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_UNITS',
          message: 'Units must be "metric" or "imperial"'
        }
      })
    }

    let latitude, longitude

    // If city is provided, geocode it first
    if (city) {
      try {
        const location = await weatherService.geocodeCity(city)
        latitude = location.lat
        longitude = location.lon
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CITY_NOT_FOUND',
            message: error.message
          }
        })
      }
    } else if (lat && lon) {
      // Use provided coordinates
      latitude = parseFloat(lat)
      longitude = parseFloat(lon)

      // Validate coordinates
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_COORDINATES',
            message: 'Invalid latitude or longitude'
          }
        })
      }

      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'OUT_OF_RANGE',
            message: 'Coordinates out of range'
          }
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_LOCATION',
          message: 'Please provide either city name or coordinates (lat, lon)'
        }
      })
    }

    // Get weather data
    const weatherData = await weatherService.getCurrentWeather(latitude, longitude, units)

    res.status(200).json({
      success: true,
      data: weatherData
    })
  } catch (error) {
    console.error('[Weather Controller] getCurrentWeather error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'WEATHER_FETCH_ERROR',
        message: error.message || 'Failed to fetch weather data'
      }
    })
  }
}

/**
 * GET /api/weather/forecast
 * Get 7-day weather forecast
 * @query {string} city - City name (optional)
 * @query {number} lat - Latitude (optional)
 * @query {number} lon - Longitude (optional)
 * @query {string} units - 'metric' or 'imperial' (default: 'metric')
 */
export const getForecast = async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query

    // Validate units
    if (units && !['metric', 'imperial'].includes(units)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_UNITS',
          message: 'Units must be "metric" or "imperial"'
        }
      })
    }

    let latitude, longitude

    // If city is provided, geocode it first
    if (city) {
      try {
        const location = await weatherService.geocodeCity(city)
        latitude = location.lat
        longitude = location.lon
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'CITY_NOT_FOUND',
            message: error.message
          }
        })
      }
    } else if (lat && lon) {
      latitude = parseFloat(lat)
      longitude = parseFloat(lon)

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_COORDINATES',
            message: 'Invalid latitude or longitude'
          }
        })
      }
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_LOCATION',
          message: 'Please provide either city name or coordinates (lat, lon)'
        }
      })
    }

    // Get forecast data
    const forecastData = await weatherService.getForecast(latitude, longitude, units)

    res.status(200).json({
      success: true,
      data: forecastData
    })
  } catch (error) {
    console.error('[Weather Controller] getForecast error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'FORECAST_FETCH_ERROR',
        message: error.message || 'Failed to fetch forecast data'
      }
    })
  }
}

/**
 * GET /api/weather/hourly
 * Get hourly forecast (next 24 hours)
 * @query {string} city - City name (optional)
 * @query {number} lat - Latitude (optional)
 * @query {number} lon - Longitude (optional)
 * @query {string} units - 'metric' or 'imperial' (default: 'metric')
 */
export const getHourlyForecast = async (req, res) => {
  try {
    const { city, lat, lon, units = 'metric' } = req.query

    let latitude, longitude

    if (city) {
      const location = await weatherService.geocodeCity(city)
      latitude = location.lat
      longitude = location.lon
    } else if (lat && lon) {
      latitude = parseFloat(lat)
      longitude = parseFloat(lon)
    } else {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_LOCATION',
          message: 'Please provide either city name or coordinates (lat, lon)'
        }
      })
    }

    const hourlyData = await weatherService.getHourlyForecast(latitude, longitude, units)

    res.status(200).json({
      success: true,
      data: hourlyData
    })
  } catch (error) {
    console.error('[Weather Controller] getHourlyForecast error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'HOURLY_FORECAST_ERROR',
        message: error.message || 'Failed to fetch hourly forecast'
      }
    })
  }
}

/**
 * GET /api/weather/favorites
 * Get user's favorite cities
 * @query {string} user_id - User ID (required)
 */
export const getFavoriteCities = async (req, res) => {
  try {
    const { user_id } = req.query

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_USER_ID',
          message: 'user_id is required'
        }
      })
    }

    const result = await query(
      `SELECT id, city_name, country, lat, lon, is_default, created_at, updated_at
       FROM favorite_cities
       WHERE user_id = $1 AND deleted_at IS NULL
       ORDER BY is_default DESC, created_at DESC`,
      [user_id]
    )

    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length
    })
  } catch (error) {
    console.error('[Weather Controller] getFavoriteCities error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to fetch favorite cities'
      }
    })
  }
}

/**
 * POST /api/weather/favorites
 * Add city to favorites
 * @body {string} user_id - User ID (required)
 * @body {string} city_name - City name (required)
 * @body {string} country - Country code (optional)
 * @body {number} lat - Latitude (required)
 * @body {number} lon - Longitude (required)
 * @body {boolean} is_default - Set as default city (optional, default: false)
 */
export const addFavoriteCity = async (req, res) => {
  try {
    const { user_id, city_name, country, lat, lon, is_default = false } = req.body

    // Validation
    if (!user_id || !city_name || lat === undefined || lon === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Required fields: user_id, city_name, lat, lon'
        }
      })
    }

    // Validate coordinates
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_COORDINATES',
          message: 'Invalid latitude or longitude'
        }
      })
    }

    // If setting as default, unset other defaults first
    if (is_default) {
      await query(
        `UPDATE favorite_cities 
         SET is_default = false 
         WHERE user_id = $1 AND deleted_at IS NULL`,
        [user_id]
      )
    }

    // Insert favorite city
    const result = await query(
      `INSERT INTO favorite_cities (user_id, city_name, country, lat, lon, is_default)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, city_name, country, lat, lon, is_default, created_at`,
      [user_id, city_name, country, latitude, longitude, is_default]
    )

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Favorite city added successfully'
    })
  } catch (error) {
    console.error('[Weather Controller] addFavoriteCity error:', error)

    // Handle duplicate city error
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_CITY',
          message: 'This city is already in your favorites'
        }
      })
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to add favorite city'
      }
    })
  }
}

/**
 * DELETE /api/weather/favorites/:id
 * Remove city from favorites (soft delete)
 * @param {string} id - Favorite city ID
 */
export const removeFavoriteCity = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_ID',
          message: 'Favorite city ID is required'
        }
      })
    }

    // Soft delete
    const result = await query(
      `UPDATE favorite_cities
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, city_name`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Favorite city not found'
        }
      })
    }

    res.status(200).json({
      success: true,
      message: `${result.rows[0].city_name} removed from favorites`
    })
  } catch (error) {
    console.error('[Weather Controller] removeFavoriteCity error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Failed to remove favorite city'
      }
    })
  }
}

/**
 * POST /api/weather/cache/clean
 * Manually clean expired cache entries
 * (Can also be triggered by cron job)
 */
export const cleanCache = async (req, res) => {
  try {
    const count = await weatherService.cleanExpiredCache()
    
    res.status(200).json({
      success: true,
      message: `Cleaned ${count} expired cache entries`
    })
  } catch (error) {
    console.error('[Weather Controller] cleanCache error:', error)
    res.status(500).json({
      success: false,
      error: {
        code: 'CACHE_CLEAN_ERROR',
        message: 'Failed to clean cache'
      }
    })
  }
}
