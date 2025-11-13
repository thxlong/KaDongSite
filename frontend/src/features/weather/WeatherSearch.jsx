/**
 * Weather Search Component
 * @description Search bar with city input and geolocation button
 * @author KaDong Team
 * @created 2025-11-11
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin } from 'lucide-react'

const WeatherSearch = ({ onSearch, onGeolocation }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
      setSearchQuery('')
    }
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city... (e.g., Hanoi, Tokyo, Paris)"
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-colors text-gray-700"
          />
        </div>

        {/* Search Button */}
        <motion.button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>

        {/* Geolocation Button */}
        <motion.button
          type="button"
          onClick={onGeolocation}
          className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Use my location"
        >
          <MapPin className="w-6 h-6" />
        </motion.button>
      </form>
    </motion.div>
  )
}

export default WeatherSearch
