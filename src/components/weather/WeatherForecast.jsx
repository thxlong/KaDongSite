/**
 * Weather Forecast Component
 * @description 7-day weather forecast cards
 * @author KaDong Team
 * @created 2025-11-11
 */

import { motion } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { CloudRain } from 'lucide-react'

const WeatherForecast = ({ forecast, units }) => {
  if (!forecast || forecast.length === 0) {
    return null
  }

  const tempUnit = units === 'metric' ? '°C' : '°F'

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
      'Fog': '🌫️'
    }
    return emojiMap[condition] || '🌤️'
  }

  // Forecast card component
  const ForecastCard = ({ day, index }) => {
    const date = parseISO(day.date)
    const isToday = index === 0
    const dayName = isToday ? 'Today' : format(date, 'EEE')

    return (
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.05,
          y: -5
        }}
      >
        {/* Day Name */}
        <p className={`text-center font-semibold mb-3 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
          {dayName}
        </p>

        {/* Date */}
        <p className="text-center text-sm text-gray-500 mb-3">
          {format(date, 'MMM d')}
        </p>

        {/* Weather Icon */}
        <motion.div
          className="text-5xl text-center mb-3"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3 + index * 0.5
          }}
        >
          {getWeatherEmoji(day.weather.main)}
        </motion.div>

        {/* Weather Description */}
        <p className="text-center text-sm text-gray-600 capitalize mb-3 h-8">
          {day.weather.description}
        </p>

        {/* Temperature Range */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-800">
            {Math.round(day.temp_max)}{tempUnit}
          </span>
          <span className="text-lg text-gray-400">/</span>
          <span className="text-lg text-gray-500">
            {Math.round(day.temp_min)}{tempUnit}
          </span>
        </div>

        {/* Precipitation Probability */}
        {day.pop > 0 && (
          <div className="flex items-center justify-center gap-1 text-sm text-blue-600">
            <CloudRain className="w-4 h-4" />
            <span>{Math.round(day.pop * 100)}%</span>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        7-Day Forecast 📅
      </h2>

      {/* Forecast Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.slice(0, 7).map((day, index) => (
          <ForecastCard key={day.date} day={day} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

export default WeatherForecast
