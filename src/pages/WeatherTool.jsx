/**
 * Weather Tool Page
 * @description Main page for weather forecast with animations
 * @author KaDong Team
 * @created 2025-11-11
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, MapPin, Loader } from 'lucide-react'
import * as weatherService from '../services/weatherService'

// Components (will be created)
import WeatherHeader from '../components/weather/WeatherHeader'
import WeatherSearch from '../components/weather/WeatherSearch'
import WeatherCurrent from '../components/weather/WeatherCurrent'
import WeatherAnimation from '../components/weather/WeatherAnimation'
import WeatherForecast from '../components/weather/WeatherForecast'
import FavoriteCities from '../components/weather/FavoriteCities'

const WeatherTool = () => {
  // State
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [units, setUnits] = useState('metric') // metric or imperial
  const [location, setLocation] = useState(null)
  const [defaultCity, setDefaultCity] = useState('Hanoi') // Default city

  // Load weather on mount
  useEffect(() => {
    loadWeather(defaultCity)
  }, [])

  /**
   * Load weather data by city name or coordinates
   */
  const loadWeather = async (city = null, lat = null, lon = null) => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch both current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        city 
          ? weatherService.getCurrentWeather({ city, units })
          : weatherService.getCurrentWeather({ lat, lon, units }),
        city
          ? weatherService.getForecast({ city, units })
          : weatherService.getForecast({ lat, lon, units })
      ])

      setCurrentWeather(currentResponse.data)
      setForecast(forecastResponse.data.forecast || [])
      setLocation(currentResponse.data.location)
    } catch (err) {
      console.error('Error loading weather:', err)
      setError(err.message || 'Could not load weather data')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle city search
   */
  const handleSearch = (searchCity) => {
    if (searchCity && searchCity.trim()) {
      loadWeather(searchCity.trim())
    }
  }

  /**
   * Handle geolocation
   */
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeather(null, position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError('Could not get your location. Please search for a city instead.')
        setLoading(false)
      }
    )
  }

  /**
   * Toggle temperature units
   */
  const toggleUnits = () => {
    const newUnits = units === 'metric' ? 'imperial' : 'metric'
    setUnits(newUnits)
    
    // Reload weather with new units
    if (location?.name) {
      loadWeather(location.name)
    }
  }

  /**
   * Refresh weather data
   */
  const handleRefresh = () => {
    if (location?.name) {
      loadWeather(location.name)
    } else {
      loadWeather(defaultCity)
    }
  }

  /**
   * Select city from favorites
   */
  const handleSelectFavorite = (cityName) => {
    loadWeather(cityName)
  }

  // Loading state
  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading weather data...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error && !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-lg max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">😔</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <WeatherHeader 
          location={location}
          units={units}
          onRefresh={handleRefresh}
          onToggleUnits={toggleUnits}
          loading={loading}
        />

        {/* Search */}
        <WeatherSearch
          onSearch={handleSearch}
          onGeolocation={handleGeolocation}
        />

        {/* Main Weather Display with Animation */}
        <div className="relative mt-8">
          {/* Background Animation */}
          <WeatherAnimation 
            condition={currentWeather?.current?.weather?.main}
          />

          {/* Current Weather Card */}
          <WeatherCurrent
            data={currentWeather}
            units={units}
          />
        </div>

        {/* 7-Day Forecast */}
        {forecast.length > 0 && (
          <WeatherForecast
            forecast={forecast}
            units={units}
          />
        )}

        {/* Favorite Cities */}
        <FavoriteCities
          onSelectCity={handleSelectFavorite}
          currentLocation={location}
        />
      </div>
    </motion.div>
  )
}

export default WeatherTool
