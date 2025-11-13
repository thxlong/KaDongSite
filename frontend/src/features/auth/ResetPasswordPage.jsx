/**
 * Reset Password Page
 * Reset password using token from email
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../shared/contexts/AuthContext'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check for token on mount
  useEffect(() => {
    if (!token) {
      setApiError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn')
    }
  }, [token])

  /**
   * Calculate password strength
   */
  const getPasswordStrength = () => {
    const { newPassword } = formData
    if (!newPassword) return { score: 0, level: '', color: '' }

    let score = 0

    if (newPassword.length >= 8) score++
    if (newPassword.length >= 12) score++
    if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^A-Za-z0-9]/.test(newPassword)) score++

    const levels = [
      { level: '', color: '' },
      { level: 'Yếu', color: 'red' },
      { level: 'Trung bình', color: 'yellow' },
      { level: 'Khá', color: 'blue' },
      { level: 'Mạnh', color: 'green' }
    ]

    return { score, ...levels[Math.min(score, 4)] }
  }

  const passwordStrength = getPasswordStrength()

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = 'Mật khẩu mới là bắt buộc'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự'
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 chữ hoa'
    } else if (!/[a-z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 chữ thường'
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 1 chữ số'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!token) {
      setApiError('Link đặt lại mật khẩu không hợp lệ')
      return
    }

    if (!validate()) return

    try {
      setLoading(true)
      
      await resetPassword(token, formData.newPassword)
      
      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          replace: true,
          state: { message: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.' }
        })
      }, 3000)
    } catch (error) {
      setApiError(error.message || 'Không thể đặt lại mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Đặt lại mật khẩu thành công!
              </h1>
              <p className="text-gray-600 mb-6">
                Mật khẩu của bạn đã được thay đổi. Bạn sẽ được chuyển đến trang đăng nhập...
              </p>
              <Loader2 className="w-6 h-6 text-purple-600 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (!token || apiError.includes('không hợp lệ')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Link không hợp lệ
              </h1>
              <p className="text-gray-600 mb-6">
                Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. 
                Vui lòng yêu cầu link mới.
              </p>
              <Link
                to="/forgot-password"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition"
              >
                Yêu cầu link mới
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">
              ← Quay lại đăng nhập
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
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* API Error */}
          {apiError && !apiError.includes('không hợp lệ') && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12 ${
                    errors.newPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.color === 'red' ? 'bg-red-500' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                          passwordStrength.color === 'blue' ? 'bg-blue-500' :
                          passwordStrength.color === 'green' ? 'bg-green-500' : ''
                        }`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.color === 'red' ? 'text-red-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                      passwordStrength.color === 'blue' ? 'text-blue-600' :
                      passwordStrength.color === 'green' ? 'text-green-600' : ''
                    }`}>
                      {passwordStrength.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Tối thiểu 8 ký tự, có chữ hoa, chữ thường và số
                  </p>
                </div>
              )}

              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
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
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Đặt lại mật khẩu
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
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

export default ResetPasswordPage
