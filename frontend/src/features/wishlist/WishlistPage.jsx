/**
 * Wishlist Tool
 * @description Main page for wishlist management
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gift, RefreshCw, UserPlus, Lock } from 'lucide-react'
import {
  WishlistHeader,
  WishlistStats,
  WishlistGrid,
  WishlistAddModal,
  WishlistEditModal
} from './index'
import * as wishlistService from './wishlistService'
import { useAuth } from '../../shared/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const WishlistTool = () => {
  // Auth context
  const { isGuest } = useAuth()
  const navigate = useNavigate()

  // State
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Filters & Sort
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [purchasedFilter, setPurchasedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showGuestWarning, setShowGuestWarning] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Polling
  const pollingIntervalRef = useRef(null)

  /**
   * Fetch wishlist items with filters
   */
  const fetchWishlistItems = async () => {
    try {
      const params = {
        limit: 100,
        offset: 0,
        sort_by: sortBy === 'date' ? 'created_at' : sortBy,
        sort_order: 'desc'
      }

      // Add search query
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }

      // Add category filter
      if (selectedCategory !== 'all') {
        params.category = selectedCategory
      }

      // Add purchased filter
      if (purchasedFilter === 'purchased') {
        params.purchased = 'true'
      } else if (purchasedFilter === 'unpurchased') {
        params.purchased = 'false'
      }

      const data = await wishlistService.getWishlistItems(params)
      // API returns {items: [...], pagination: {...}}
      const items = data?.items || []
      setItems(items)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      console.error('[WishlistTool] Error fetching items:', err)
      setError(err.message || 'Không thể tải danh sách wishlist')
    }
  }

  /**
   * Fetch statistics
   */
  const fetchStats = async () => {
    try {
      const data = await wishlistService.getWishlistStats()
      setStats(data)
    } catch (err) {
      console.error('[WishlistTool] Error fetching stats:', err)
    }
  }

  /**
   * Initial load
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchWishlistItems(), fetchStats()])
      setLoading(false)
    }

    loadData()
  }, [])

  /**
   * Reload when filters change
   */
  useEffect(() => {
    if (!loading) {
      fetchWishlistItems()
    }
  }, [searchQuery, selectedCategory, purchasedFilter, sortBy])

  /**
   * Setup polling (Milestone 3.8)
   * Poll every 30 seconds for updates
   */
  useEffect(() => {
    // Start polling
    pollingIntervalRef.current = setInterval(() => {
      // Only poll if page is visible (Page Visibility API)
      if (document.visibilityState === 'visible') {
        fetchWishlistItems()
        fetchStats()
      }
    }, 30000) // 30 seconds

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [searchQuery, selectedCategory, purchasedFilter, sortBy]) // Re-setup when filters change

  /**
   * Manual refresh
   */
  const handleRefresh = async () => {
    setLoading(true)
    await Promise.all([fetchWishlistItems(), fetchStats()])
    setLoading(false)
  }

  /**
   * Heart/Unheart item with optimistic update
   */
  const handleHeart = async (itemId, currentlyLiked) => {
    try {
      // Optimistic update
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                user_liked: !currentlyLiked,
                heart_count: currentlyLiked ? item.heart_count - 1 : item.heart_count + 1
              }
            : item
        )
      )

      // API call
      if (currentlyLiked) {
        await wishlistService.unheartItem(itemId)
      } else {
        await wishlistService.heartItem(itemId)
      }

      // Refresh stats
      fetchStats()
    } catch (err) {
      console.error('[WishlistTool] Error toggling heart:', err)

      // Revert on error
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                user_liked: currentlyLiked,
                heart_count: currentlyLiked ? item.heart_count + 1 : item.heart_count - 1
              }
            : item
        )
      )

      alert('Không thể thay đổi trạng thái yêu thích: ' + err.message)
    }
  }

  /**
   * Delete item
   */
  const handleDelete = async (itemId) => {
    try {
      await wishlistService.deleteWishlistItem(itemId)

      // Remove from list
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

      // Refresh stats
      fetchStats()
    } catch (err) {
      console.error('[WishlistTool] Error deleting item:', err)
      alert('Không thể xóa sản phẩm: ' + err.message)
    }
  }

  /**
   * Toggle purchased status
   */
  const handleTogglePurchased = async (itemId) => {
    try {
      const updatedItem = await wishlistService.togglePurchased(itemId)

      // Update in list
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === itemId ? { ...item, ...updatedItem } : item))
      )

      // Refresh stats
      fetchStats()
    } catch (err) {
      console.error('[WishlistTool] Error toggling purchased:', err)
      alert('Không thể cập nhật trạng thái: ' + err.message)
    }
  }

  /**
   * Edit item
   */
  const handleEdit = (item) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  /**
   * Add new item - Check if Guest user
   */
  const handleAddClick = () => {
    if (isGuest) {
      setShowGuestWarning(true)
    } else {
      setShowAddModal(true)
    }
  }

  /**
   * Handle item added successfully
   */
  const handleItemAdded = (newItem) => {
    // Add to list
    setItems([newItem, ...items])
    // Refresh stats
    fetchStats()
  }

  /**
   * Handle item updated successfully
   */
  const handleItemUpdated = (updatedItem) => {
    // Update in list
    setItems(
      items.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
    )
    // Refresh stats
    fetchStats()
  }

  /**
   * Handle comment added - refresh stats
   */
  const handleCommentAdded = () => {
    fetchStats()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <WishlistHeader
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onPurchasedFilterChange={setPurchasedFilter}
        onSortChange={setSortBy}
        onAddClick={handleAddClick}
        itemCount={items.length}
        isGuest={isGuest}
      />

      {/* Refresh Button */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Gift size={16} />
            <span>
              Cập nhật lần cuối:{' '}
              {lastUpdate
                ? new Intl.DateTimeFormat('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                  }).format(lastUpdate)
                : 'Chưa có'}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-semibold">Làm mới</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <WishlistStats stats={stats} loading={loading} />

      {/* Items Grid */}
      <WishlistGrid
        items={items}
        loading={loading}
        error={error}
        onHeart={handleHeart}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onTogglePurchased={handleTogglePurchased}
        onCommentAdded={handleCommentAdded}
      />

      {/* Modals */}
      <WishlistAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleItemAdded}
      />

      <WishlistEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingItem(null)
        }}
        onSuccess={handleItemUpdated}
        item={editingItem}
      />

      {/* Guest Warning Modal */}
      {showGuestWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                <Lock size={32} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Tính năng chỉ dành cho thành viên
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bạn cần đăng ký tài khoản để lưu wishlist vào hệ thống. Chế độ Guest không hỗ trợ lưu trữ dữ liệu lâu dài.
              </p>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowGuestWarning(false)
                    navigate('/register')
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  <UserPlus size={20} />
                  Đăng ký tài khoản miễn phí
                </motion.button>
                <button
                  onClick={() => setShowGuestWarning(false)}
                  className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default WishlistTool
