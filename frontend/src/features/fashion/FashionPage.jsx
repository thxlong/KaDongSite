import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shirt, Plus, Save, Trash2, Edit2, Check, X } from 'lucide-react'
import ColorPicker from '../../shared/components/ColorPicker'
import OutfitPreview from '../../shared/components/OutfitPreview'
import { TEST_USER_ID, API_BASE_URL } from '../../shared/config/constants'

const FashionTool = () => {
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    shirtColor: 'blue',
    pantsColor: 'black',
    shoesColor: 'black',
    hatColor: '',
    bagColor: ''
  })

  // Load outfits from API
  useEffect(() => {
    fetchOutfits()
  }, [])

  const fetchOutfits = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/fashion?user_id=${TEST_USER_ID}`)
      const data = await response.json()
      if (data.success) {
        setOutfits(data.data)
      }
    } catch (error) {
      console.error('Error fetching outfits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên trang phục!')
      return
    }

    // Convert to snake_case for API (backend accepts both formats)
    const payload = {
      name: formData.name,
      shirt_color: formData.shirtColor,
      pants_color: formData.pantsColor,
      shoes_color: formData.shoesColor,
      hat_color: formData.hatColor || null,
      bag_color: formData.bagColor || null,
      user_id: TEST_USER_ID
    }

    try {
      setLoading(true)

      if (editingId) {
        // Update existing outfit
        const response = await fetch(`${API_BASE_URL}/fashion/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await response.json()
        if (data.success) {
          await fetchOutfits()
          setEditingId(null)
        } else {
          alert('Lỗi: ' + data.error)
        }
      } else {
        // Create new outfit
        const response = await fetch(`${API_BASE_URL}/fashion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await response.json()
        if (data.success) {
          await fetchOutfits()
        } else {
          alert('Lỗi: ' + data.error)
        }
      }

      // Reset form
      setFormData({
        name: '',
        shirtColor: 'blue',
        pantsColor: 'black',
        shoesColor: 'black',
        hatColor: '',
        bagColor: ''
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error saving outfit:', error)
      alert('Có lỗi xảy ra khi lưu trang phục!')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (outfit) => {
    setFormData({
      name: outfit.name,
      shirtColor: outfit.shirt_color,
      pantsColor: outfit.pants_color,
      shoesColor: outfit.shoes_color,
      hatColor: outfit.hat_color || '',
      bagColor: outfit.bag_color || ''
    })
    setEditingId(outfit.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa trang phục này?')) return

    try {
      setLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/fashion/${id}?user_id=${TEST_USER_ID}`,
        { method: 'DELETE' }
      )
      const data = await response.json()
      if (data.success) {
        await fetchOutfits()
      } else {
        alert('Lỗi: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting outfit:', error)
      alert('Có lỗi xảy ra khi xóa trang phục!')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      shirtColor: 'blue',
      pantsColor: 'black',
      shoesColor: 'black',
      hatColor: '',
      bagColor: ''
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-gray-800 flex items-center gap-3">
            <Shirt className="w-8 h-8 text-purple-500" />
            Phối đồ màu sắc
          </h1>
          <p className="text-gray-600 font-nunito mt-1">
            Tạo và lưu những bộ trang phục yêu thích của bạn
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow font-nunito font-semibold"
          disabled={loading}
        >
          <Plus className="w-5 h-5" />
          Tạo trang phục mới
        </motion.button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-8 overflow-hidden"
          >
            <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-6">
              {editingId ? '✏️ Chỉnh sửa trang phục' : '➕ Tạo trang phục mới'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Form Fields */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 font-nunito mb-2">
                      Tên trang phục <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Dạo phố cuối tuần"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-nunito"
                      maxLength={100}
                      required
                    />
                  </div>

                  {/* Shirt Color */}
                  <ColorPicker
                    label="🎽 Màu áo"
                    value={formData.shirtColor}
                    onChange={(color) => setFormData({ ...formData, shirtColor: color })}
                    required
                  />

                  {/* Pants Color */}
                  <ColorPicker
                    label="👖 Màu quần"
                    value={formData.pantsColor}
                    onChange={(color) => setFormData({ ...formData, pantsColor: color })}
                    required
                  />

                  {/* Shoes Color */}
                  <ColorPicker
                    label="👟 Màu giày"
                    value={formData.shoesColor}
                    onChange={(color) => setFormData({ ...formData, shoesColor: color })}
                    required
                  />

                  {/* Hat Color (Optional) */}
                  <ColorPicker
                    label="🎩 Màu mũ (tùy chọn)"
                    value={formData.hatColor}
                    onChange={(color) => setFormData({ ...formData, hatColor: color })}
                    required={false}
                  />

                  {/* Bag Color (Optional) */}
                  <ColorPicker
                    label="👜 Màu túi (tùy chọn)"
                    value={formData.bagColor}
                    onChange={(color) => setFormData({ ...formData, bagColor: color })}
                    required={false}
                  />
                </div>

                {/* Right: Preview */}
                <div className="lg:sticky lg:top-4 lg:self-start">
                  <OutfitPreview outfit={formData} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow font-nunito font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? 'Cập nhật' : 'Lưu trang phục'}
                    </>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-nunito font-semibold"
                >
                  <X className="w-5 h-5" />
                  Hủy
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Outfits Grid */}
      <div>
        <h2 className="text-2xl font-bold font-poppins text-gray-800 mb-4">
          💾 Trang phục đã lưu ({outfits.length})
        </h2>

        {loading && outfits.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600 font-nunito mt-4">Đang tải...</p>
          </div>
        ) : outfits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-pastel-cream rounded-3xl p-12 text-center"
          >
            <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-nunito text-lg">
              Chưa có trang phục nào. Hãy tạo bộ đầu tiên của bạn! 🎨
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Outfit Name */}
                <h3 className="text-lg font-bold font-poppins text-gray-800 mb-4">
                  {outfit.name}
                </h3>

                {/* Mini Preview */}
                <div className="mb-4">
                  <OutfitPreview
                    outfit={{
                      shirtColor: outfit.shirt_color,
                      pantsColor: outfit.pants_color,
                      shoesColor: outfit.shoes_color,
                      hatColor: outfit.hat_color,
                      bagColor: outfit.bag_color
                    }}
                  />
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 font-nunito mb-4">
                  Tạo lúc: {new Date(outfit.created_at).toLocaleDateString('vi-VN')}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(outfit)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-nunito text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Sửa
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(outfit.id)}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-nunito text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default FashionTool
