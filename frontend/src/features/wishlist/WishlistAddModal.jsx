/**
 * WishlistAddModal Component
 * @description Modal form to add new wishlist item with URL auto-extract
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Link, Loader, Image as ImageIcon, DollarSign } from 'lucide-react'
import * as wishlistService from './wishlistService'

const CATEGORIES = [
  { value: '', label: '-- Chọn danh mục --' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Home', label: 'Home' },
  { value: 'Books', label: 'Books' },
  { value: 'Games', label: 'Games' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Food', label: 'Food' },
  { value: 'Other', label: 'Other' }
]

const CURRENCIES = ['VND', 'USD', 'EUR', 'JPY']

const WishlistAddModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    product_url: '',
    product_name: '',
    price: '',
    currency: 'VND',
    origin: '',
    category: '',
    description: '',
    product_image_url: ''
  })

  const [extracting, setExtracting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        product_url: '',
        product_name: '',
        price: '',
        currency: 'VND',
        origin: '',
        category: '',
        description: '',
        product_image_url: ''
      })
      setErrors({})
      setImagePreview(null)
    }
  }, [isOpen])

  // Update image preview when URL changes
  useEffect(() => {
    if (formData.product_image_url) {
      setImagePreview(formData.product_image_url)
    }
  }, [formData.product_image_url])

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  /**
   * Extract metadata from URL
   */
  const handleExtractMetadata = async () => {
    if (!formData.product_url.trim()) {
      setErrors({ product_url: 'Vui lòng nhập URL sản phẩm' })
      return
    }

    setExtracting(true)
    try {
      const metadata = await wishlistService.extractMetadata(formData.product_url)

      if (metadata) {
        setFormData((prev) => ({
          ...prev,
          product_name: metadata.title || prev.product_name,
          product_image_url: metadata.image || prev.product_image_url,
          description: metadata.description || prev.description,
          price: metadata.price || prev.price,
          currency: metadata.currency || prev.currency,
          origin: metadata.origin || prev.origin,
          // Only set category if API returns it, otherwise keep user's selection or empty
          category: metadata.category || prev.category
        }))
      } else {
        alert('Không thể trích xuất thông tin từ URL. Vui lòng nhập thủ công.')
      }
    } catch (err) {
      console.error('[WishlistAddModal] Error extracting metadata:', err)
      alert('Lỗi khi trích xuất: ' + err.message)
    } finally {
      setExtracting(false)
    }
  }

  /**
   * Validate form
   */
  const validateForm = () => {
    const newErrors = {}

    if (!formData.product_url.trim()) {
      newErrors.product_url = 'URL sản phẩm là bắt buộc'
    } else if (
      !formData.product_url.startsWith('http://') &&
      !formData.product_url.startsWith('https://')
    ) {
      newErrors.product_url = 'URL phải bắt đầu với http:// hoặc https://'
    }

    if (!formData.product_name.trim()) {
      newErrors.product_name = 'Tên sản phẩm là bắt buộc'
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Giá không được âm'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      // Convert price to number and handle empty category
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category || null // Send null if empty
      }

      const newItem = await wishlistService.createWishlistItem(payload)
      onSuccess?.(newItem)
      onClose()
    } catch (err) {
      console.error('[WishlistAddModal] Error creating item:', err)
      alert('Không thể thêm sản phẩm: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Handle image error
   */
  const handleImageError = () => {
    setImagePreview(null)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Thêm sản phẩm mới
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-4">
              {/* Product URL with Extract Button */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  URL sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="product_url"
                    value={formData.product_url}
                    onChange={handleChange}
                    placeholder="https://shopee.vn/product/..."
                    className={`flex-1 px-4 py-2 border ${
                      errors.product_url
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExtractMetadata}
                    disabled={extracting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {extracting ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Đang trích xuất...
                      </>
                    ) : (
                      <>
                        <Link size={18} />
                        Trích xuất
                      </>
                    )}
                  </motion.button>
                </div>
                {errors.product_url && (
                  <p className="text-red-500 text-sm mt-1">{errors.product_url}</p>
                )}
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="iPhone 15 Pro Max 256GB"
                  className={`w-full px-4 py-2 border ${
                    errors.product_name
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                />
                {errors.product_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.product_name}</p>
                )}
              </div>

              {/* Price and Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Giá
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="29990000"
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-2 border ${
                        errors.price
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tiền tệ
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Origin and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nguồn gốc
                  </label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    placeholder="Shopee, Tiki, Amazon..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Danh mục
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Thông tin chi tiết về sản phẩm..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>

              {/* Image URL with Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  name="product_image_url"
                  value={formData.product_image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Xem trước:
                    </p>
                    <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                )}
                {!imagePreview && formData.product_image_url && (
                  <div className="mt-3 flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="text-center text-gray-400">
                      <ImageIcon size={48} className="mx-auto mb-2" />
                      <p className="text-sm">Không thể tải hình ảnh</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Hủy
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Đang thêm...
                </>
              ) : (
                'Thêm sản phẩm'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default WishlistAddModal
