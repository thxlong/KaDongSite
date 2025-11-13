/**
 * Weather Current Component
 * @description Display current weather with large temperature and details
 * @author KaDong Team
 * @created 2025-11-11
 */

import { motion } from 'framer-motion'
import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun, 
  Moon,
  Thermometer,
  CloudRain
} from 'lucide-react'
import { format } from 'date-fns'

const WeatherCurrent = ({ data, units }) => {
  if (!data || !data.current) {
    return null
  }

  const { current } = data
  const tempUnit = units === 'metric' ? '°C' : '°F'
  const speedUnit = units === 'metric' ? 'km/h' : 'mph'

  // Get weather emoji
  const getWeatherEmoji = (condition) => {
    const emojiMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    }
    return emojiMap[condition] || '🌤️'
  }

  // Weather detail item component
  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 bg-white/50 rounded-xl p-3">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )

  return (
    <motion.div
      className="relative bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Main Temperature Display */}
      <div className="text-center mb-8">
        <motion.div
          className="text-8xl mb-4"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          {getWeatherEmoji(current.weather.main)}
        </motion.div>

        <motion.div
          className="text-7xl font-bold text-gray-800 mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            delay: 0.3 
          }}
        >
          {Math.round(current.temp)}{tempUnit}
        </motion.div>

        <p className="text-2xl text-gray-600 capitalize mb-1">
          {current.weather.description}
        </p>
        
        <p className="text-lg text-gray-500">
          Feels like {Math.round(current.feels_like)}{tempUnit}
        </p>

        {/* Min/Max Temperature */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <span className="text-gray-600">
              {Math.round(current.temp_min)}{tempUnit}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center gap-1">
            <Thermometer className="w-5 h-5 text-red-500" />
            <span className="text-gray-600">
              {Math.round(current.temp_max)}{tempUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DetailItem
          icon={Droplets}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <DetailItem
          icon={Wind}
          label="Wind Speed"
          value={`${Math.round(current.wind_speed)} ${speedUnit}`}
        />
        <DetailItem
          icon={Gauge}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
        <DetailItem
          icon={Eye}
          label="Visibility"
          value={`${(current.visibility / 1000).toFixed(1)} km`}
        />
      </div>

      {/* Sunrise & Sunset */}
      {current.sunrise && current.sunset && (
        <div className="flex items-center justify-around mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Sun className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sunrise</p>
              <p className="text-lg font-semibold text-gray-800">
                {format(new Date(current.sunrise * 1000), 'HH:mm')}
              </p>
            </div>
          </div>

          <div className="w-px h-12 bg-gray-200"></div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Moon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sunset</p>
              <p className="text-lg font-semibold text-gray-800">
                {format(new Date(current.sunset * 1000), 'HH:mm')}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default WeatherCurrent
