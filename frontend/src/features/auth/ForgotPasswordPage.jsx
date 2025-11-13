/**
 * Forgot Password Page
 * Request password reset via email
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../../shared/contexts/AuthContext'

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  /**
   * Validate email
   */
  const validate = () => {
    if (!email) {
      setError('Email là bắt buộc')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ')
      return false
    }
    return true
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validate()) return

    try {
      setLoading(true)
      
      await forgotPassword(email)
      
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Không thể gửi email đặt lại mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle email input change
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Email đã được gửi!
              </h1>
              <p className="text-gray-600">
                Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ. 
                Vui lòng kiểm tra cả thư mục spam nếu không thấy email.
              </p>
            </div>

            {/* Back to Login */}
            <Link
              to="/login"
              className="block w-full text-center bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition"
            >
              Quay lại đăng nhập
            </Link>
          </div>

          {/* Home Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Gửi link đặt lại mật khẩu
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>

        {/* Home Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
