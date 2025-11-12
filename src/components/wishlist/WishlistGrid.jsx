/**
 * WishlistGrid Component
 * @description Responsive grid layout for wishlist items
 * @author KaDong Team
 * @created 2025-11-12
 */

import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import WishlistCard from './WishlistCard'

const EmptyState = ({ message = 'Chưa có sản phẩm nào trong wishlist' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-full mb-6">
        <Package size={64} className="text-purple-600 dark:text-purple-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{message}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        Thêm sản phẩm yêu thích vào wishlist để theo dõi và quản lý dễ dàng
      </p>
    </motion.div>
  )
}

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
        >
          <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

const WishlistGrid = ({
  items = [],
  loading = false,
  error = null,
  onHeart,
  onDelete,
  onEdit,
  onTogglePurchased,
  onCommentAdded
}) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center"
        >
          <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
            Có lỗi xảy ra
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </motion.div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <WishlistCard
              item={item}
              onHeart={onHeart}
              onDelete={onDelete}
              onEdit={onEdit}
              onTogglePurchased={onTogglePurchased}
              onCommentAdded={onCommentAdded}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WishlistGrid
