/**
 * WishlistCard Component
 * @description Individual wishlist item card with comments
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Edit2,
  Trash2,
  CheckCircle,
  ExternalLink,
  MoreVertical,
  X,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import CommentItem from './CommentItem'
import * as wishlistService from '../../services/wishlistService'

const WishlistCard = ({
  item,
  onHeart,
  onDelete,
  onEdit,
  onTogglePurchased,
  onCommentAdded
}) => {
  const [showActions, setShowActions] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Comments state
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  
  const currentUserId = '00000000-0000-0000-0000-000000000001' // Test user ID

  const handleHeartClick = (e) => {
    e.stopPropagation()
    onHeart?.(item.id, item.user_liked)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    if (confirm(`Xóa "${item.product_name}" khỏi wishlist?`)) {
      onDelete?.(item.id)
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    onEdit?.(item)
  }

  const handleTogglePurchased = (e) => {
    e.stopPropagation()
    onTogglePurchased?.(item.id)
  }

  /**
   * Load comments when expanded
   */
  useEffect(() => {
    if (showComments && comments.length === 0) {
      loadComments()
    }
  }, [showComments])

  /**
   * Fetch comments from API
   */
  const loadComments = async () => {
    setLoadingComments(true)
    try {
      const data = await wishlistService.getComments(item.id)
      setComments(data || [])
    } catch (err) {
      console.error('[WishlistCard] Error loading comments:', err)
      alert('Không thể tải bình luận: ' + err.message)
    } finally {
      setLoadingComments(false)
    }
  }

  /**
   * Toggle comments section
   */
  const handleToggleComments = (e) => {
    e.stopPropagation()
    setShowComments(!showComments)
  }

  /**
   * Submit new comment
   */
  const handleSubmitComment = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!commentText.trim()) {
      alert('Vui lòng nhập bình luận')
      return
    }

    setSubmittingComment(true)
    try {
      const newComment = await wishlistService.addComment(item.id, commentText.trim())
      setComments([...comments, newComment])
      setCommentText('')
      onCommentAdded?.() // Notify parent to refresh stats
    } catch (err) {
      console.error('[WishlistCard] Error submitting comment:', err)
      alert('Không thể gửi bình luận: ' + err.message)
    } finally {
      setSubmittingComment(false)
    }
  }

  /**
   * Edit comment
   */
  const handleEditComment = async (commentId, newText) => {
    try {
      const updatedComment = await wishlistService.updateComment(commentId, newText)
      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, ...updatedComment } : c))
      )
    } catch (err) {
      console.error('[WishlistCard] Error editing comment:', err)
      throw err
    }
  }

  /**
   * Delete comment
   */
  const handleDeleteComment = async (commentId) => {
    try {
      await wishlistService.deleteComment(commentId)
      setComments(comments.filter((c) => c.id !== commentId))
      onCommentAdded?.() // Notify parent to refresh stats
    } catch (err) {
      console.error('[WishlistCard] Error deleting comment:', err)
      throw err
    }
  }

  const formatPrice = (price, currency) => {
    if (!price) return 'Chưa có giá'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND'
    }).format(price)
  }

  const getCategoryColor = (category) => {
    const colors = {
      Electronics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Fashion: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      Home: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      Books: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      Games: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      Beauty: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
      Sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      Toys: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      Food: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200',
      Other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return colors[category] || colors.Other
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border ${
        item.is_purchased
          ? 'border-green-200 dark:border-green-700'
          : 'border-gray-100 dark:border-gray-700'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!imageError && item.product_image_url ? (
          <img
            src={item.product_image_url}
            alt={item.product_name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Package size={64} />
          </div>
        )}

        {/* Purchased Badge */}
        {item.is_purchased && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-lg">
            <CheckCircle size={16} />
            Đã mua
          </div>
        )}

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowActions(!showActions)
            }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            {showActions ? <X size={18} /> : <MoreVertical size={18} />}
          </button>

          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[160px]"
            >
              <button
                onClick={handleEditClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
              >
                <Edit2 size={16} />
                Chỉnh sửa
              </button>
              <button
                onClick={handleTogglePurchased}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
              >
                <CheckCircle size={16} />
                {item.is_purchased ? 'Chưa mua' : 'Đánh dấu đã mua'}
              </button>
              <button
                onClick={handleDeleteClick}
                className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
              >
                <Trash2 size={16} />
                Xóa
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        {item.category && (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getCategoryColor(
              item.category
            )}`}
          >
            {item.category}
          </span>
        )}

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
          {item.product_name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Price & Origin */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {formatPrice(item.price, item.currency)}
          </p>
          {item.origin && (
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
              {item.origin}
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Heart Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleHeartClick}
            className="flex items-center gap-1 group"
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              animate={item.user_liked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={20}
                className={`${
                  item.user_liked
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400 group-hover:text-red-400'
                } transition-colors`}
              />
            </motion.div>
            <span
              className={`text-sm font-semibold ${
                item.user_liked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {item.heart_count || 0}
            </span>
          </motion.button>

          {/* Comment Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleComments}
            className={`flex items-center gap-1 transition-colors ${
              showComments
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
            }`}
          >
            <MessageCircle size={20} />
            <span className="text-sm font-semibold">{comments.length || item.comment_count || 0}</span>
            {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>

          {/* External Link */}
          {item.product_url && (
            <a
              href={item.product_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Comments List */}
              <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chưa có bình luận nào</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onEdit={handleEditComment}
                        onDelete={handleDeleteComment}
                        isOwner={comment.user_id === currentUserId}
                        currentUserId={currentUserId}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  rows={2}
                  disabled={submittingComment}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSubmitComment(e)
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
                >
                  {submittingComment ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send size={16} />
                  )}
                </motion.button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Nhấn Ctrl+Enter để gửi nhanh
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Missing Package icon import
import { Package } from 'lucide-react'

export default WishlistCard
