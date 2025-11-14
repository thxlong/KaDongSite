/**
 * WishlistHeader Component
 * @description Header with search, filters, and add button
 * @author KaDong Team
 * @created 2025-11-12
 */

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, SortAsc, X } from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Electronics', label: 'Điện tử' },
  { value: 'Fashion', label: 'Thời trang' },
  { value: 'Home', label: 'Nhà cửa' },
  { value: 'Books', label: 'Sách' },
  { value: 'Games', label: 'Game' },
  { value: 'Beauty', label: 'Làm đẹp' },
  { value: 'Sports', label: 'Thể thao' },
  { value: 'Toys', label: 'Đồ chơi' },
  { value: 'Food', label: 'Thực phẩm' },
  { value: 'Other', label: 'Khác' }
]

const SORT_OPTIONS = [
  { value: 'date', label: 'Ngày thêm ↓' },
  { value: 'hearts', label: 'Lượt thích ↓' },
  { value: 'price', label: 'Giá ↓' },
  { value: 'name', label: 'Tên A-Z' }
]

const PURCHASED_FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'purchased', label: 'Đã mua' },
  { value: 'unpurchased', label: 'Chưa mua' }
]

const WishlistHeader = ({
  onSearch,
  onCategoryChange,
  onSortChange,
  onPurchasedFilterChange,
  onAddClick,
  itemCount = 0,
  isGuest = false
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('date')
  const [selectedPurchased, setSelectedPurchased] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, onSearch])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  const handleSortChange = (sort) => {
    setSelectedSort(sort)
    onSortChange?.(sort)
  }

  const handlePurchasedFilterChange = (filter) => {
    setSelectedPurchased(filter)
    onPurchasedFilterChange?.(filter)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Title & Add Button */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Wishlist
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {itemCount} sản phẩm
            </p>
          </div>

          {/* Add Button - Desktop */}
          <motion.button
            whileHover={{ scale: isGuest ? 1 : 1.05 }}
            whileTap={{ scale: isGuest ? 1 : 0.95 }}
            onClick={onAddClick}
            className={`hidden md:flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg transition-shadow ${
              isGuest
                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl'
            } text-white`}
            data-testid="add-item-button"
            title={isGuest ? 'Đăng ký để thêm wishlist' : 'Thêm sản phẩm mới'}
          >
            <Plus size={20} />
            Thêm sản phẩm
          </motion.button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Filter Toggle - Mobile */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter size={20} />
            <span>Lọc</span>
          </button>

          {/* Category Filter - Desktop */}
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="hidden md:block px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[150px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Purchased Filter - Desktop */}
          <select
            value={selectedPurchased}
            onChange={(e) => handlePurchasedFilterChange(e.target.value)}
            className="hidden md:block px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[140px]"
          >
            {PURCHASED_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>

          {/* Sort Dropdown - Desktop */}
          <select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="hidden md:block px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white min-w-[150px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filters - Collapsible */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-3 space-y-3"
          >
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Purchased Filter */}
            <select
              value={selectedPurchased}
              onChange={(e) => handlePurchasedFilterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {PURCHASED_FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      {/* FAB - Mobile Only */}
      <motion.button
        whileHover={{ scale: isGuest ? 1 : 1.1 }}
        whileTap={{ scale: isGuest ? 1 : 0.9 }}
        onClick={onAddClick}
        className={`md:hidden fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 ${
          isGuest
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'bg-gradient-to-r from-purple-600 to-pink-600'
        } text-white`}
        title={isGuest ? 'Đăng ký để thêm wishlist' : 'Thêm sản phẩm mới'}
      >
        <Plus size={24} />
      </motion.button>
    </div>
  )
}

export default WishlistHeader
