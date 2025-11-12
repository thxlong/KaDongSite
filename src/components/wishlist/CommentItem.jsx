/**
 * CommentItem Component
 * @description Individual comment display with edit/delete actions
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, Check, X, User } from 'lucide-react'

const CommentItem = ({ comment, onEdit, onDelete, isOwner, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.comment_text)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
    setEditText(comment.comment_text)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditText(comment.comment_text)
  }

  const handleSaveEdit = async () => {
    if (!editText.trim()) {
      alert('Bình luận không được để trống')
      return
    }

    try {
      await onEdit?.(comment.id, editText.trim())
      setIsEditing(false)
    } catch (err) {
      console.error('[CommentItem] Error saving edit:', err)
      alert('Không thể cập nhật bình luận: ' + err.message)
    }
  }

  const handleDeleteClick = async () => {
    if (!confirm('Xóa bình luận này?')) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete?.(comment.id)
    } catch (err) {
      console.error('[CommentItem] Error deleting:', err)
      alert('Không thể xóa bình luận: ' + err.message)
      setIsDeleting(false)
    }
  }

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`

    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name[0].toUpperCase()
  }

  if (isDeleting) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-3 py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Đang xóa...</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
          {comment.user_name ? getInitials(comment.user_name) : <User size={14} />}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <span className="font-semibold text-sm text-gray-900 dark:text-white truncate block">
              {comment.user_name || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(comment.created_at)}
              {comment.updated_at &&
                comment.updated_at !== comment.created_at &&
                ' (đã chỉnh sửa)'}
            </span>
          </div>

          {/* Actions - Only for owner */}
          {isOwner && !isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEditClick}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 size={14} className="text-gray-600 dark:text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDeleteClick}
                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Xóa"
              >
                <Trash2 size={14} className="text-red-600 dark:text-red-400" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Comment Text or Edit Input */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSaveEdit()
                  }
                  if (e.key === 'Escape') {
                    handleCancelEdit()
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                >
                  <Check size={14} />
                  Lưu
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg transition-colors"
                >
                  <X size={14} />
                  Hủy
                </motion.button>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  Ctrl+Enter để lưu
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words"
            >
              {comment.comment_text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CommentItem
