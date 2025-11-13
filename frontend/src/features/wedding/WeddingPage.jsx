/**
 * Wedding Invitation URL Encoder Tool
 * @description Main page for generating personalized wedding invitation URLs
 * @author KaDong Team
 * @created 2025-11-12
 * @spec specs/specs/06_wedding_invitation_url_encoder.spec
 */

import { useState, useEffect } from 'react'
import { Mail, AlertCircle } from 'lucide-react'
import BaseUrlInput from './BaseUrlInput'
import GuestNameInput from './GuestNameInput'
import EncodedUrlList from './EncodedUrlList'
import { saveWeddingUrl, getLatestWeddingUrl } from './weddingService'
import { generateInvitationUrl } from '../../shared/utils/urlEncoder'

const WeddingInvitationTool = () => {
  // State
  const [baseUrl, setBaseUrl] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [guestNames, setGuestNames] = useState([])
  const [encodedUrls, setEncodedUrls] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Load saved URL on mount
  useEffect(() => {
    loadSavedUrl()
  }, [])

  // Generate URLs when base URL or guest names change
  useEffect(() => {
    if (baseUrl && guestNames.length > 0) {
      generateLinks()
    } else {
      setEncodedUrls([])
    }
  }, [baseUrl, guestNames])

  /**
   * Load saved base URL from backend
   */
  const loadSavedUrl = async () => {
    try {
      const result = await getLatestWeddingUrl()
      if (result?.data) {
        setBaseUrl(result.data.base_url)
        setLastUpdated(result.data.created_at)
      }
    } catch (err) {
      console.error('Failed to load URL:', err)
      // Don't show error toast for 404 (no URL saved yet)
    }
  }

  /**
   * Save base URL to backend
   */
  const handleSaveUrl = async (url) => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await saveWeddingUrl(url)
      setLastUpdated(result.data.created_at)
      setSuccess('✅ Đã lưu URL thiệp cưới')
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(`❌ ${err.message}`)
      throw err // Re-throw to let BaseUrlInput show error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle guest names change from input component
   */
  const handleNamesChange = (names) => {
    setGuestNames(names)
  }

  /**
   * Generate invitation URLs for all guests
   */
  const generateLinks = () => {
    if (!baseUrl.trim()) {
      setError('❌ Vui lòng lưu Base URL trước')
      return
    }

    if (guestNames.length === 0) {
      setEncodedUrls([])
      return
    }

    try {
      const urls = guestNames.map(name => ({
        name,
        url: generateInvitationUrl(baseUrl, name)
      }))

      setEncodedUrls(urls)
      setError(null)
    } catch (err) {
      setError(`❌ Lỗi tạo links: ${err.message}`)
    }
  }

  /**
   * Handle copy all action
   */
  const handleCopyAll = () => {
    setSuccess(`✅ Đã copy ${encodedUrls.length} links vào clipboard`)
    setTimeout(() => setSuccess(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mb-4 shadow-lg">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Wedding Invitation URL Encoder
          </h1>
          <p className="text-gray-600 text-lg">
            Tạo links thiệp cưới cá nhân hóa cho từng khách mời
          </p>
        </div>

        {/* Global Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <div className="text-green-600 text-2xl">✅</div>
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Global Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-sm text-red-600 hover:text-red-700 underline mt-1"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Base URL Input */}
            <BaseUrlInput
              value={baseUrl}
              onChange={setBaseUrl}
              onSave={handleSaveUrl}
              lastUpdated={lastUpdated}
              loading={loading}
            />

            {/* Guest Name Input */}
            <GuestNameInput onNamesChange={handleNamesChange} />
          </div>

          {/* Right Column - Output */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <EncodedUrlList urls={encodedUrls} onCopyAll={handleCopyAll} />
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔗</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Base URL</p>
                <p className="text-sm font-medium text-gray-700">
                  {baseUrl ? '✓ Đã lưu' : 'Chưa lưu'}
                </p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-gray-200"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Khách mời</p>
                <p className="text-sm font-medium text-gray-700">
                  {guestNames.length} người
                </p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-gray-200"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">Links</p>
                <p className="text-sm font-medium text-gray-700">
                  {encodedUrls.length} links
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📖 Cách sử dụng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Nhập Base URL</p>
                <p className="text-sm text-gray-600">
                  Nhập URL thiệp cưới của bạn và nhấn "Lưu URL"
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Nhập danh sách khách</p>
                <p className="text-sm text-gray-600">
                  Gõ tên hoặc upload file Excel/TXT với danh sách khách mời
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">Copy và gửi</p>
                <p className="text-sm text-gray-600">
                  Copy từng link hoặc tất cả links để gửi cho khách mời
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeddingInvitationTool
