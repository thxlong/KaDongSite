/**
 * Guest Warning Banner Component
 * Warning banner for Guest users about data loss risk
 * Shows CTA to upgrade to registered account
 */

import { useState } from 'react'
import { AlertTriangle, X, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import * as guestStorage from '../utils/guestStorage'

/**
 * GuestWarningBanner Component
 * @param {object} props
 * @param {function} props.onUpgrade - Callback when user clicks "Tạo tài khoản"
 */
const GuestWarningBanner = ({ onUpgrade }) => {
  const { isGuest } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [storageInfo, setStorageInfo] = useState(guestStorage.getGuestStorageInfo())

  // Don't show if not guest or dismissed
  if (!isGuest || dismissed) {
    return null
  }

  /**
   * Handle dismiss (hide for this session)
   */
  const handleDismiss = () => {
    setDismissed(true)
    // Could save to sessionStorage to persist across page reloads
    sessionStorage.setItem('guest_banner_dismissed', 'true')
  }

  /**
   * Handle upgrade button click
   */
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade()
    }
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Icon & Message */}
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-800">
                Bạn đang sử dụng chế độ Guest
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Dữ liệu của bạn ({storageInfo.notes} ghi chú, {storageInfo.countdowns} đếm ngược, {storageInfo.wishlist} wishlist) 
                sẽ bị mất nếu xóa cache trình duyệt. 
                <span className="font-medium"> Dung lượng: {storageInfo.totalSize}/{storageInfo.maxSize} MB</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Upgrade Button */}
            <button
              onClick={handleUpgrade}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition shadow-sm hover:shadow"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Tạo tài khoản để lưu vĩnh viễn
            </button>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition"
              title="Ẩn thông báo này"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestWarningBanner
