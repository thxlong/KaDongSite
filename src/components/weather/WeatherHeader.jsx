/**
 * Weather Header Component
 * @description Header with location, refresh, and unit toggle
 * @author KaDong Team
 * @created 2025-11-11
 */

import { motion } from 'framer-motion'
import { RefreshCw, Thermometer } from 'lucide-react'

const WeatherHeader = ({ location, units, onRefresh, onToggleUnits, loading }) => {
  return (
    <motion.div
      className="flex items-center justify-between mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title & Location */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Weather Forecast ☀️
        </h1>
        {location && (
          <p className="text-gray-600 text-lg">
            📍 {location.name}, {location.country}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Unit Toggle */}
        <motion.button
          onClick={onToggleUnits}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Thermometer className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700">
            {units === 'metric' ? '°C' : '°F'}
          </span>
        </motion.button>

        {/* Refresh Button */}
        <motion.button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          <span className="font-medium">Refresh</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default WeatherHeader
