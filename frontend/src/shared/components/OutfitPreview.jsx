import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const colorMap = {
  red: '#EF4444',
  orange: '#F97316',
  yellow: '#EAB308',
  green: '#22C55E',
  blue: '#3B82F6',
  purple: '#A855F7',
  brown: '#92400E',
  black: '#1F2937',
  white: '#F9FAFB',
  gray: '#6B7280',
  pink: '#EC4899',
  peach: '#FB923C',
  cream: '#FEF3C7',
  mint: '#6EE7B7',
  sky: '#38BDF8'
}

const OutfitPreview = ({ outfit }) => {
  const {
    shirtColor = 'blue',
    pantsColor = 'gray',
    shoesColor = 'black',
    hatColor = null,
    bagColor = null
  } = outfit

  return (
    <div className="bg-gradient-to-br from-pastel-cream to-pastel-mint rounded-3xl p-8 shadow-lg">
      <h3 className="text-xl font-bold font-poppins text-gray-800 mb-6 text-center">
        🎨 Xem trước trang phục
      </h3>

      <div className="flex justify-center items-end gap-8">
        {/* Outfit Figure */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <svg
            width="200"
            height="350"
            viewBox="0 0 200 350"
            className="drop-shadow-lg"
          >
            {/* Hat */}
            {hatColor && (
              <motion.ellipse
                cx="100"
                cy="25"
                rx="35"
                ry="18"
                fill={colorMap[hatColor]}
                stroke="#374151"
                strokeWidth="2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              />
            )}

            {/* Head */}
            <circle
              cx="100"
              cy="60"
              r="30"
              fill="#FBBF24"
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Face */}
            <circle cx="92" cy="55" r="3" fill="#374151" />
            <circle cx="108" cy="55" r="3" fill="#374151" />
            <path
              d="M 90 68 Q 100 72 110 68"
              stroke="#374151"
              strokeWidth="2"
              fill="none"
            />

            {/* Shirt */}
            <motion.path
              d="M 70 90 L 70 170 Q 70 180 80 180 L 120 180 Q 130 180 130 170 L 130 90 L 100 95 Z"
              fill={colorMap[shirtColor]}
              stroke="#374151"
              strokeWidth="2"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2 }}
              style={{ transformOrigin: 'center 90px' }}
            />

            {/* Arms */}
            <motion.ellipse
              cx="60"
              cy="130"
              rx="12"
              ry="40"
              fill={colorMap[shirtColor]}
              stroke="#374151"
              strokeWidth="2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            />
            <motion.ellipse
              cx="140"
              cy="130"
              rx="12"
              ry="40"
              fill={colorMap[shirtColor]}
              stroke="#374151"
              strokeWidth="2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            />

            {/* Pants */}
            <motion.g
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 }}
              style={{ transformOrigin: 'center 180px' }}
            >
              {/* Left leg */}
              <rect
                x="75"
                y="180"
                width="20"
                height="90"
                fill={colorMap[pantsColor]}
                stroke="#374151"
                strokeWidth="2"
              />
              {/* Right leg */}
              <rect
                x="105"
                y="180"
                width="20"
                height="90"
                fill={colorMap[pantsColor]}
                stroke="#374151"
                strokeWidth="2"
              />
            </motion.g>

            {/* Shoes */}
            <motion.g
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Left shoe */}
              <ellipse
                cx="85"
                cy="280"
                rx="18"
                ry="10"
                fill={colorMap[shoesColor]}
                stroke="#374151"
                strokeWidth="2"
              />
              {/* Right shoe */}
              <ellipse
                cx="115"
                cy="280"
                rx="18"
                ry="10"
                fill={colorMap[shoesColor]}
                stroke="#374151"
                strokeWidth="2"
              />
            </motion.g>
          </svg>
        </motion.div>

        {/* Bag */}
        {bagColor && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg width="60" height="80" viewBox="0 0 60 80" className="drop-shadow-lg">
              {/* Bag body */}
              <rect
                x="10"
                y="20"
                width="40"
                height="50"
                rx="5"
                fill={colorMap[bagColor]}
                stroke="#374151"
                strokeWidth="2"
              />
              {/* Bag handle */}
              <path
                d="M 20 20 Q 30 5 40 20"
                stroke="#374151"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Color Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2 text-sm font-nunito">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colorMap[shirtColor] }}
          />
          <span>Áo</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colorMap[pantsColor] }}
          />
          <span>Quần</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: colorMap[shoesColor] }}
          />
          <span>Giày</span>
        </div>
        {hatColor && (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colorMap[hatColor] }}
            />
            <span>Mũ</span>
          </div>
        )}
        {bagColor && (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colorMap[bagColor] }}
            />
            <span>Túi</span>
          </div>
        )}
      </div>
    </div>
  )
}

OutfitPreview.propTypes = {
  outfit: PropTypes.shape({
    shirtColor: PropTypes.string,
    pantsColor: PropTypes.string,
    shoesColor: PropTypes.string,
    hatColor: PropTypes.string,
    bagColor: PropTypes.string
  }).isRequired
}

export default OutfitPreview
