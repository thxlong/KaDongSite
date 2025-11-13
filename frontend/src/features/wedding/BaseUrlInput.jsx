/**
 * Base URL Input Component
 * @description Input field for wedding invitation base URL with validation and save
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState } from 'react'
import { Save, Check, AlertCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { isValidUrl } from '../../shared/utils/urlEncoder'

const BaseUrlInput = ({ value, onChange, onSave, lastUpdated, loading }) => {
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    // Validation
    if (!value.trim()) {
      setError('Vui lòng nhập URL thiệp cưới')
      return
    }

    if (!isValidUrl(value)) {
      setError('URL phải bắt đầu bằng http:// hoặc https://')
      return
    }

    if (value.length > 500) {
      setError('URL quá dài (tối đa 500 ký tự)')
      return
    }

    setError('')
    
    try {
      await onSave(value)
      setSaved(true)
      
      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message || 'Không thể lưu URL')
    }
  }

  const handleChange = (e) => {
    onChange(e.target.value)
    setError('')
    setSaved(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">🔗</span>
        Base URL Thiệp Cưới
      </h3>
      
      <div className="space-y-3">
        {/* Input Field */}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="https://invitations.jmiiwedding.com/longnhiwedding"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:outline-none transition-all ${
              error
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : saved
                ? 'border-green-300 focus:border-green-400 focus:ring-green-200'
                : 'border-gray-300 focus:border-pink-400 focus:ring-pink-200'
            }`}
            disabled={loading}
            data-testid="base-url-input"
          />
          
          {/* Success Indicator */}
          {saved && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="text-green-500" size={20} />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading || !value.trim()}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          data-testid="save-url-btn"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang lưu...
            </>
          ) : saved ? (
            <>
              <Check size={18} />
              Đã lưu!
            </>
          ) : (
            <>
              <Save size={18} />
              Lưu URL
            </>
          )}
        </button>

        {/* Last Updated Info */}
        {lastUpdated && !error && (
          <p className="text-sm text-gray-500">
            Cập nhật lần cuối: {new Date(lastUpdated).toLocaleString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}

        {/* Helper Text */}
        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium text-blue-700 mb-1">💡 Gợi ý:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>JMii Wedding: https://invitations.jmiiwedding.com/ten-su-kien</li>
            <li>Marry Wedding: https://www.marrywedding.vn/invitation/ten-su-kien</li>
            <li>The Wedding: https://thewedding.vn/ten-su-kien</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

BaseUrlInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  lastUpdated: PropTypes.string,
  loading: PropTypes.bool
}

BaseUrlInput.defaultProps = {
  lastUpdated: null,
  loading: false
}

export default BaseUrlInput
