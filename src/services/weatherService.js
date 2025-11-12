/**
 * Weather Service (Frontend)
 * @description API calls to backend weather endpoints
 * @author KaDong Team
 * @created 2025-11-11
 */

const API_URL = 'http://localhost:5000/api/weather'

/**
 * Get current weather by city name or coordinates
 * @param {object} params - Query parameters
 * @param {string} params.city - City name (optional)
 * @param {number} params.lat - Latitude (optional)
 * @param {number} params.lon - Longitude (optional)
 * @param {string} params.units - 'metric' or 'imperial' (default: 'metric')
 * @returns {Promise<object>} Weather data
 */
export const getCurrentWeather = async ({ city, lat, lon, units = 'metric' }) => {
  try {
    const params = new URLSearchParams()
    
    if (city) {
      params.append('city', city)
    } else if (lat !== undefined && lon !== undefined) {
      params.append('lat', lat)
      params.append('lon', lon)
    } else {
      throw new Error('Please provide either city name or coordinates')
    }
    
    params.append('units', units)

    const response = await fetch(`${API_URL}/current?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch weather')
    }

    return data
  } catch (error) {
    console.error('[Weather Service] getCurrentWeather error:', error)
    throw error
  }
}

/**
 * Get 7-day weather forecast
 * @param {object} params - Query parameters
 * @param {string} params.city - City name (optional)
 * @param {number} params.lat - Latitude (optional)
 * @param {number} params.lon - Longitude (optional)
 * @param {string} params.units - 'metric' or 'imperial' (default: 'metric')
 * @returns {Promise<object>} Forecast data
 */
export const getForecast = async ({ city, lat, lon, units = 'metric' }) => {
  try {
    const params = new URLSearchParams()
    
    if (city) {
      params.append('city', city)
    } else if (lat !== undefined && lon !== undefined) {
      params.append('lat', lat)
      params.append('lon', lon)
    } else {
      throw new Error('Please provide either city name or coordinates')
    }
    
    params.append('units', units)

    const response = await fetch(`${API_URL}/forecast?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch forecast')
    }

    return data
  } catch (error) {
    console.error('[Weather Service] getForecast error:', error)
    throw error
  }
}

/**
 * Get hourly forecast (next 24 hours)
 * @param {object} params - Query parameters
 * @returns {Promise<object>} Hourly forecast data
 */
export const getHourlyForecast = async ({ city, lat, lon, units = 'metric' }) => {
  try {
    const params = new URLSearchParams()
    
    if (city) {
      params.append('city', city)
    } else if (lat !== undefined && lon !== undefined) {
      params.append('lat', lat)
      params.append('lon', lon)
    }
    
    params.append('units', units)

    const response = await fetch(`${API_URL}/hourly?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch hourly forecast')
    }

    return data
  } catch (error) {
    console.error('[Weather Service] getHourlyForecast error:', error)
    throw error
  }
}

/**
 * Get user's favorite cities
 * @param {string} userId - User ID
 * @returns {Promise<array>} Array of favorite cities
 */
export const getFavoriteCities = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/favorites?user_id=${userId}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch favorites')
    }

    return data.data || []
  } catch (error) {
    console.error('[Weather Service] getFavoriteCities error:', error)
    throw error
  }
}

/**
 * Add city to favorites
 * @param {object} cityData - City data to add
 * @returns {Promise<object>} Added city data
 */
export const addFavoriteCity = async (cityData) => {
  try {
    const response = await fetch(`${API_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cityData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to add favorite city')
    }

    return data
  } catch (error) {
    console.error('[Weather Service] addFavoriteCity error:', error)
    throw error
  }
}

/**
 * Remove city from favorites
 * @param {string} cityId - Favorite city ID
 * @returns {Promise<object>} Response data
 */
export const removeFavoriteCity = async (cityId) => {
  try {
    const response = await fetch(`${API_URL}/favorites/${cityId}`, {
      method: 'DELETE'
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to remove favorite city')
    }

    return data
  } catch (error) {
    console.error('[Weather Service] removeFavoriteCity error:', error)
    throw error
  }
}
