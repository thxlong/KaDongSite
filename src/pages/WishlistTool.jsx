/**
 * Wishlist Tool
 * @description Main page for wishlist management
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Gift, RefreshCw } from 'lucide-react'
import {
  WishlistHeader,
  WishlistStats,
  WishlistGrid,
  WishlistAddModal,
  WishlistEditModal
} from '../components/wishlist'
import * as wishlistService from '../services/wishlistService'

const WishlistTool = () => {
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
      setItems(data.items || [])
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
   * Add new item
   */
  const handleAddClick = () => {
    setShowAddModal(true)
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
    </div>
  )
}

export default WishlistTool
