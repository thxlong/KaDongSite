/**
 * WishlistStats Component
 * @description Statistics dashboard for wishlist
 * @author KaDong Team
 * @created 2025-11-12
 */

import { motion } from 'framer-motion'
import { Package, DollarSign, CheckCircle, Heart, TrendingUp } from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, color, trend }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-flex p-3 rounded-lg ${color} mb-3`}>
            <Icon size={24} className="text-white" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600 dark:text-green-400">
              <TrendingUp size={14} />
              <span>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const TopHeartedItem = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-32 md:w-40">
      <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square relative">
          <img
            src={item.product_image_url || '/placeholder-product.png'}
            alt={item.product_name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs">
            <Heart size={12} fill="currentColor" />
            {item.heart_count}
          </div>
        </div>
        <div className="p-2">
          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
            {item.product_name}
          </p>
          {item.price && (
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: item.currency || 'VND'
              }).format(item.price)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const WishlistStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const totalValue = stats.total_value || 0
  const purchasedCount = stats.purchased_count || 0
  const totalItems = stats.total_items || 0
  const topHearted = stats.top_hearted || []

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Package}
          label="Tổng sản phẩm"
          value={totalItems}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <StatCard
          icon={DollarSign}
          label="Tổng giá trị"
          value={new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(totalValue)}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />

        <StatCard
          icon={CheckCircle}
          label="Đã mua"
          value={purchasedCount}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend={totalItems > 0 ? `${((purchasedCount / totalItems) * 100).toFixed(0)}%` : '0%'}
        />

        <StatCard
          icon={Heart}
          label="Yêu thích nhất"
          value={topHearted[0]?.heart_count || 0}
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
      </div>

      {/* Top Hearted Items */}
      {topHearted.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Heart size={20} className="text-pink-500" />
            Top sản phẩm được yêu thích
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {topHearted.map((item) => (
              <TopHeartedItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WishlistStats
