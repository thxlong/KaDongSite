import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Heart, Plus, Trash2, Edit2 } from 'lucide-react'
import { formatDistanceToNow, differenceInDays, parseISO } from 'date-fns'
import { vi } from 'date-fns/locale'

const CountdownTool = () => {
  const [countdowns, setCountdowns] = useState(() => {
    const saved = localStorage.getItem('countdowns')
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Ngày yêu nhau',
        date: '2020-01-01',
        color: 'from-pastel-pink to-pastel-purple'
      }
    ]
  })
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', date: '', color: 'from-pastel-pink to-pastel-purple' })
  const [editingId, setEditingId] = useState(null)

  const colors = [
    { name: 'Hồng-Tím', value: 'from-pastel-pink to-pastel-purple' },
    { name: 'Xanh mint-Xanh', value: 'from-pastel-mint to-pastel-blue' },
    { name: 'Cam-Kem', value: 'from-pastel-peach to-pastel-cream' },
    { name: 'Xanh-Tím', value: 'from-pastel-blue to-pastel-purple' },
  ]

  useEffect(() => {
    localStorage.setItem('countdowns', JSON.stringify(countdowns))
  }, [countdowns])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setCountdowns(countdowns.map(c => 
        c.id === editingId ? { ...formData, id: editingId } : c
      ))
      setEditingId(null)
    } else {
      setCountdowns([...countdowns, { ...formData, id: Date.now() }])
    }
    setFormData({ title: '', date: '', color: 'from-pastel-pink to-pastel-purple' })
    setShowForm(false)
  }

  const handleEdit = (countdown) => {
    setFormData({ title: countdown.title, date: countdown.date, color: countdown.color })
    setEditingId(countdown.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa sự kiện này?')) {
      setCountdowns(countdowns.filter(c => c.id !== id))
    }
  }

  const calculateDays = (date) => {
    const targetDate = parseISO(date)
    const days = differenceInDays(new Date(), targetDate)
    return Math.abs(days)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-gray-800 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" fill="currentColor" />
            Đếm ngày kỷ niệm
          </h1>
          <p className="text-gray-600 mt-2 font-nunito">
            Theo dõi những ngày đặc biệt của hai chúng mình
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 font-medium"
          aria-label="Thêm sự kiện mới"
        >
          <Plus className="w-5 h-5" />
          Thêm sự kiện
        </motion.button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 shadow-lg mb-6"
        >
          <h3 className="font-bold text-lg mb-4 font-poppins">
            {editingId ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                Tên sự kiện
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                placeholder="Ví dụ: Ngày yêu nhau"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                Ngày
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                Màu sắc
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`
                      bg-gradient-to-br ${color.value} p-4 rounded-xl text-white font-medium text-sm
                      ${formData.color === color.value ? 'ring-4 ring-purple-400' : 'opacity-70 hover:opacity-100'}
                      transition-all
                    `}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow"
            >
              {editingId ? 'Cập nhật' : 'Thêm'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingId(null)
                setFormData({ title: '', date: '', color: 'from-pastel-pink to-pastel-purple' })
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
            >
              Hủy
            </button>
          </div>
        </motion.form>
      )}

      {/* Countdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {countdowns.map((countdown, index) => (
          <motion.div
            key={countdown.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${countdown.color} rounded-3xl p-6 shadow-lg relative overflow-hidden group`}
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/20 rounded-full" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white font-poppins">
                    {countdown.title}
                  </h3>
                </div>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(countdown)}
                    className="p-2 bg-white/30 rounded-lg hover:bg-white/50 transition-colors"
                    aria-label={`Chỉnh sửa ${countdown.title}`}
                  >
                    <Edit2 className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(countdown.id)}
                    className="p-2 bg-white/30 rounded-lg hover:bg-white/50 transition-colors"
                    aria-label={`Xóa ${countdown.title}`}
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-white/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl font-bold text-white mb-2 font-poppins"
                  >
                    {calculateDays(countdown.date)}
                  </motion.div>
                  <p className="text-white/90 text-lg font-nunito">
                    ngày đã trải qua
                  </p>
                  <p className="text-white/70 text-sm mt-2">
                    Kể từ {new Date(countdown.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {countdowns.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-nunito">
            Chưa có sự kiện nào. Hãy thêm sự kiện đầu tiên!
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CountdownTool
