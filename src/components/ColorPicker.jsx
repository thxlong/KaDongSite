import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const colorMap = {
  red: { bg: '#EF4444', name: 'Đỏ' },
  orange: { bg: '#F97316', name: 'Cam' },
  yellow: { bg: '#EAB308', name: 'Vàng' },
  green: { bg: '#22C55E', name: 'Xanh lá' },
  blue: { bg: '#3B82F6', name: 'Xanh dương' },
  purple: { bg: '#A855F7', name: 'Tím' },
  brown: { bg: '#92400E', name: 'Nâu' },
  black: { bg: '#1F2937', name: 'Đen' },
  white: { bg: '#F9FAFB', name: 'Trắng', border: '#E5E7EB' },
  gray: { bg: '#6B7280', name: 'Xám' },
  pink: { bg: '#EC4899', name: 'Hồng' },
  peach: { bg: '#FB923C', name: 'Đào' },
  cream: { bg: '#FEF3C7', name: 'Kem', border: '#FCD34D' },
  mint: { bg: '#6EE7B7', name: 'Bạc hà' },
  sky: { bg: '#38BDF8', name: 'Xanh da trời' }
}

const ColorPicker = ({ label, value, onChange, required = true }) => {
  const colors = Object.keys(colorMap)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 font-nunito">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => {
          const isSelected = value === color
          const { bg, border } = colorMap[color]

          return (
            <motion.button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative h-12 rounded-lg transition-all
                ${isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : 'ring-2 ring-gray-200'}
              `}
              style={{
                backgroundColor: bg,
                borderColor: border || bg,
                borderWidth: border ? '2px' : '0'
              }}
              aria-label={`Chọn màu ${colorMap[color].name}`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  </div>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 font-nunito">
        Đã chọn: <span className="font-semibold">{colorMap[value]?.name || 'Chưa chọn'}</span>
      </p>
    </div>
  )
}

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool
}

export default ColorPicker
