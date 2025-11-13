/**
 * Logout Button Component
 * Renders logout button with confirmation dialog
 * Supports both dropdown and standalone button variants
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

/**
 * LogoutButton Component
 * @param {object} props
 * @param {'dropdown' | 'button'} props.variant - Button variant
 * @param {function} props.onLogoutComplete - Callback after successful logout
 */
const LogoutButton = ({ variant = 'dropdown', onLogoutComplete }) => {
  const navigate = useNavigate()
  const { logout, isGuest } = useAuth()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handle logout confirmation
   */
  const handleLogoutClick = () => {
    setShowConfirmDialog(true)
  }

  /**
   * Handle logout
   */
  const handleConfirmLogout = async () => {
    try {
      setLoading(true)
      setError('')

      await logout()

      // Close dialog
      setShowConfirmDialog(false)

      // Callback
      if (onLogoutComplete) {
        onLogoutComplete()
      }

      // Redirect to login
      navigate('/login', { 
        replace: true,
        state: { message: 'Đã đăng xuất thành công' }
      })
    } catch (err) {
      setError('Không thể đăng xuất. Vui lòng thử lại.')
      console.error('Logout error:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    setShowConfirmDialog(false)
    setError('')
  }

  // Dropdown variant (for use in menu)
  if (variant === 'dropdown') {
    return (
      <>
        <button
          onClick={handleLogoutClick}
          disabled={loading}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Đăng xuất
        </button>

        {showConfirmDialog && (
          <ConfirmDialog
            loading={loading}
            error={error}
            isGuest={isGuest}
            onConfirm={handleConfirmLogout}
            onCancel={handleCancel}
          />
        )}
      </>
    )
  }

  // Button variant (standalone)
  return (
    <>
      <button
        onClick={handleLogoutClick}
        disabled={loading}
        className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4 mr-2" />
        )}
        Đăng xuất
      </button>

      {showConfirmDialog && (
        <ConfirmDialog
          loading={loading}
          error={error}
          isGuest={isGuest}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}

/**
 * Confirmation Dialog Component
 */
const ConfirmDialog = ({ loading, error, isGuest, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-scale-in">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <LogOut className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">
            Xác nhận đăng xuất
          </h3>
        </div>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {isGuest ? (
            <>
              Bạn có chắc muốn đăng xuất khỏi chế độ Guest?
              <br />
              <span className="text-sm text-yellow-600 font-medium">
                ⚠️ Dữ liệu của bạn sẽ bị xóa
              </span>
            </>
          ) : (
            'Bạn có chắc muốn đăng xuất khỏi tài khoản?'
          )}
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              'Đăng xuất'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutButton
