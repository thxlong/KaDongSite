import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StickyNote, Plus, Trash2, Edit2, Check, X } from 'lucide-react'

const NotesTool = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : []
  })
  
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', color: 'pink' })
  const [editingId, setEditingId] = useState(null)

  const colors = [
    { name: 'pink', value: 'from-pastel-pink to-pink-200', text: 'Hồng' },
    { name: 'purple', value: 'from-pastel-purple to-purple-200', text: 'Tím' },
    { name: 'mint', value: 'from-pastel-mint to-green-200', text: 'Xanh mint' },
    { name: 'blue', value: 'from-pastel-blue to-blue-200', text: 'Xanh dương' },
    { name: 'peach', value: 'from-pastel-peach to-orange-200', text: 'Cam' },
    { name: 'cream', value: 'from-pastel-cream to-yellow-200', text: 'Kem' },
  ]

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setNotes(notes.map(n => 
        n.id === editingId 
          ? { ...formData, id: editingId, updatedAt: new Date().toISOString() } 
          : n
      ))
      setEditingId(null)
    } else {
      setNotes([
        ...notes, 
        { 
          ...formData, 
          id: Date.now(), 
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ])
    }
    setFormData({ title: '', content: '', color: 'pink' })
    setShowForm(false)
  }

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content, color: note.color })
    setEditingId(note.id)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa ghi chú này?')) {
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  const getColorClass = (colorName) => {
    return colors.find(c => c.name === colorName)?.value || colors[0].value
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-gray-800 flex items-center gap-3">
            <StickyNote className="w-8 h-8 text-yellow-500" />
            Ghi chú của chúng mình
          </h1>
          <p className="text-gray-600 mt-2 font-nunito">
            Lưu lại những ý tưởng và việc cần làm
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 font-medium"
          aria-label="Thêm ghi chú mới"
        >
          <Plus className="w-5 h-5" />
          Thêm ghi chú
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 shadow-lg mb-6 overflow-hidden"
          >
            <h3 className="font-bold text-lg mb-4 font-poppins">
              {editingId ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors"
                  placeholder="Tiêu đề ghi chú..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                  Nội dung
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                  placeholder="Viết gì đó..."
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-nunito">
                  Màu sắc
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.name })}
                      className={`
                        bg-gradient-to-br ${color.value} p-4 rounded-xl text-gray-700 font-medium text-sm
                        ${formData.color === color.name ? 'ring-4 ring-yellow-400 scale-105' : 'opacity-70 hover:opacity-100'}
                        transition-all
                      `}
                    >
                      {color.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {editingId ? 'Cập nhật' : 'Lưu'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({ title: '', content: '', color: 'pink' })
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Hủy
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              className={`
                bg-gradient-to-br ${getColorClass(note.color)}
                rounded-3xl p-6 shadow-md hover:shadow-xl
                transition-shadow group relative
              `}
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(note)}
                  className="p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                  aria-label={`Chỉnh sửa ${note.title}`}
                >
                  <Edit2 className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                  aria-label={`Xóa ${note.title}`}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Note Content */}
              <h3 className="font-bold text-lg mb-3 font-poppins text-gray-800 pr-16">
                {note.title}
              </h3>
              <p className="text-gray-700 font-nunito whitespace-pre-wrap mb-4">
                {note.content}
              </p>
              
              {/* Timestamp */}
              <p className="text-xs text-gray-600 font-nunito">
                {new Date(note.updatedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {notes.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <StickyNote className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-nunito text-lg mb-4">
            Chưa có ghi chú nào
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="text-yellow-600 hover:text-yellow-700 font-medium underline"
          >
            Tạo ghi chú đầu tiên
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default NotesTool
