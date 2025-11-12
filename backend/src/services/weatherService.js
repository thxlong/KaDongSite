/**
 * Weather Service
 * @description Service layer for OpenWeatherMap API integration and caching
 * @author KaDong Team
 * @created 2025-11-11
 */

import axios from 'axios'
import { query } from '#config/database.config.js'

const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5'
const OPENWEATHER_API_KEY = process.env.WEATHER_API_KEY

// Cache durations in milliseconds
const CACHE_DURATION_CURRENT = 30 * 60 * 1000 // 30 minutes
const CACHE_DURATION_FORECAST = 6 * 60 * 60 * 1000 // 6 hours

/**
 * Get weather data from cache if available and not expired
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} dataType - 'current' or 'forecast'
 * @returns {Promise<object|null>} Cached data or null
 */
const getFromCache = async (lat, lon, dataType) => {
  try {
    const result = await query(
      `SELECT weather_data, fetched_at, expires_at
       FROM weather_cache
       WHERE lat = $1 AND lon = $2 
       AND weather_data->>'type' = $3
       AND expires_at > NOW()
       ORDER BY fetched_at DESC
       LIMIT 1`,
      [lat, lon, dataType]
    )

    if (result.rows.length > 0) {
      console.log(`[Weather Cache] HIT for ${dataType} at ${lat},${lon}`)
      return result.rows[0].weather_data
    }

    console.log(`[Weather Cache] MISS for ${dataType} at ${lat},${lon}`)
    return null
  } catch (error) {
    console.error('[Weather Cache] Read error:', error.message)
    return null
  }
}

/**
 * Save weather data to cache
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} cityName - City name
 * @param {object} data - Weather data to cache
 * @param {string} dataType - 'current' or 'forecast'
 * @param {number} cacheDuration - Cache duration in ms
 */
const saveToCache = async (lat, lon, cityName, data, dataType, cacheDuration) => {
  try {
    const expiresAt = new Date(Date.now() + cacheDuration)
    const weatherData = {
      ...data,
      type: dataType,
      cached_at: new Date().toISOString()
    }

    // Upsert: update if exists, insert if not
    await query(
      `INSERT INTO weather_cache (city_name, lat, lon, weather_data, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (lat, lon, city_name)
       DO UPDATE SET
         weather_data = $4,
         fetched_at = NOW(),
         expires_at = $5`,
      [cityName, lat, lon, weatherData, expiresAt]
    )

    console.log(`[Weather Cache] SAVED ${dataType} for ${cityName} at ${lat},${lon}`)
  } catch (error) {
    console.error('[Weather Cache] Write error:', error.message)
  }
}

/**
 * Get location coordinates from city name using OpenWeather Geocoding API
 * @param {string} cityName - City name to geocode
 * @returns {Promise<object>} Location data {name, country, lat, lon}
 */
export const geocodeCity = async (cityName) => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: cityName,
          limit: 1,
          appid: OPENWEATHER_API_KEY
        },
        timeout: 5000
      }
    )

    if (!response.data || response.data.length === 0) {
      throw new Error(`City "${cityName}" not found`)
    }

    const location = response.data[0]
    return {
      name: location.name,
      country: location.country,
      state: location.state || null,
      lat: location.lat,
      lon: location.lon
    }
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid Weather API key')
    }
    throw new Error(error.message || 'Failed to geocode city')
  }
}

/**
 * Get current weather data from OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - 'metric' or 'imperial'
 * @returns {Promise<object>} Current weather data
 */
export const getCurrentWeather = async (lat, lon, units = 'metric') => {
  try {
    // Check cache first
    const cached = await getFromCache(lat, lon, 'current')
    if (cached && cached.units === units) {
      return cached
    }

    // Fetch from API
    const response = await axios.get(`${OPENWEATHER_API_URL}/weather`, {
      params: {
        lat,
        lon,
        units,
        appid: OPENWEATHER_API_KEY
      },
      timeout: 10000
    })

    const data = response.data
    const weatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      current: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind_speed: data.wind.speed,
        wind_deg: data.wind.deg,
        visibility: data.visibility,
        clouds: data.clouds.all,
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon
        },
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      },
      units,
      timestamp: new Date().toISOString()
    }

    // Save to cache
    await saveToCache(lat, lon, data.name, weatherData, 'current', CACHE_DURATION_CURRENT)

    return weatherData
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid Weather API key')
    }
    if (error.response?.status === 404) {
      throw new Error('Location not found')
    }
    throw new Error(error.message || 'Failed to fetch current weather')
  }
}

/**
 * Get 7-day weather forecast from OpenWeatherMap API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - 'metric' or 'imperial'
 * @returns {Promise<object>} Forecast data
 */
export const getForecast = async (lat, lon, units = 'metric') => {
  try {
    // Check cache first
    const cached = await getFromCache(lat, lon, 'forecast')
    if (cached && cached.units === units) {
      return cached
    }

    // Fetch from API - using onecall endpoint for daily forecast
    const response = await axios.get(`${OPENWEATHER_API_URL}/forecast`, {
      params: {
        lat,
        lon,
        units,
        appid: OPENWEATHER_API_KEY
      },
      timeout: 10000
    })

    const data = response.data

    // Group forecast by day (take first entry of each day)
    const dailyForecast = []
    const seenDates = new Set()

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]
      if (!seenDates.has(date) && dailyForecast.length < 7) {
        seenDates.add(date)
        dailyForecast.push({
          date,
          temp_day: item.main.temp,
          temp_night: item.main.temp_min,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          wind_speed: item.wind.speed,
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          pop: item.pop || 0 // Probability of precipitation
        })
      }
    })

    const weatherData = {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      forecast: dailyForecast,
      units,
      timestamp: new Date().toISOString()
    }

    // Save to cache
    await saveToCache(lat, lon, data.city.name, weatherData, 'forecast', CACHE_DURATION_FORECAST)

    return weatherData
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid Weather API key')
    }
    if (error.response?.status === 404) {
      throw new Error('Location not found')
    }
    throw new Error(error.message || 'Failed to fetch forecast')
  }
}

/**
 * Get hourly weather forecast (next 24 hours)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} units - 'metric' or 'imperial'
 * @returns {Promise<object>} Hourly forecast data
 */
export const getHourlyForecast = async (lat, lon, units = 'metric') => {
  try {
    const response = await axios.get(`${OPENWEATHER_API_URL}/forecast`, {
      params: {
        lat,
        lon,
        units,
        cnt: 8, // Next 24 hours (3-hour intervals)
        appid: OPENWEATHER_API_KEY
      },
      timeout: 10000
    })

    const data = response.data
    const hourlyData = data.list.map(item => ({
      time: new Date(item.dt * 1000).toISOString(),
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      },
      pop: item.pop || 0
    }))

    return {
      location: {
        name: data.city.name,
        country: data.city.country,
        lat: data.city.coord.lat,
        lon: data.city.coord.lon
      },
      hourly: hourlyData,
      units,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid Weather API key')
    }
    throw new Error(error.message || 'Failed to fetch hourly forecast')
  }
}

/**
 * Clean expired cache entries
 * Should be called periodically via cron job
 */
export const cleanExpiredCache = async () => {
  try {
    const result = await query(
      `DELETE FROM weather_cache WHERE expires_at < NOW()`
    )
    console.log(`[Weather Cache] Cleaned ${result.rowCount} expired entries`)
    return result.rowCount
  } catch (error) {
    console.error('[Weather Cache] Clean error:', error.message)
    throw error
  }
}
