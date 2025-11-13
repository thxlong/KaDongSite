/**
 * Favorite Cities Component
 * @description Manage and display favorite cities (placeholder for now)
 * @author KaDong Team
 * @created 2025-11-11
 */

import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'

const FavoriteCities = ({ onSelectCity, currentLocation }) => {
  // Placeholder favorite cities (would come from database)
  const favoriteCities = [
    { id: 1, name: 'Hanoi', country: 'VN', emoji: '🇻🇳' },
    { id: 2, name: 'Tokyo', country: 'JP', emoji: '🇯🇵' },
    { id: 3, name: 'Paris', country: 'FR', emoji: '🇫🇷' },
    { id: 4, name: 'New York', country: 'US', emoji: '🇺🇸' },
  ]

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800">
          Quick Access Cities
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {favoriteCities.map((city, index) => (
          <motion.button
            key={city.id}
            onClick={() => onSelectCity(city.name)}
            className={`
              p-4 rounded-xl transition-all text-left
              ${currentLocation?.name === city.name 
                ? 'bg-blue-500 text-white shadow-lg' 
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{city.emoji}</span>
              <MapPin className={`w-4 h-4 ${
                currentLocation?.name === city.name ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <p className="font-semibold">{city.name}</p>
            <p className={`text-sm ${
              currentLocation?.name === city.name ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {city.country}
            </p>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mt-4">
        💡 Tip: Use the search bar to find any city worldwide!
      </p>
    </motion.div>
  )
}

export default FavoriteCities
