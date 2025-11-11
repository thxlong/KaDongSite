/**
 * Gold Prices Tool Page
 * @description Main page for viewing gold prices and historical charts
 * @author KaDong Team
 * @created 2025-11-11
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, RefreshCw, Filter, Info } from 'lucide-react'
import { 
  GoldHeader, 
  GoldListCard, 
  GoldChart, 
  GoldFilters, 
  GoldProviderBadge 
} from '../components/gold'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const GoldPricesTool = () => {
  // State
  const [goldPrices, setGoldPrices] = useState([])
  const [selectedTypes, setSelectedTypes] = useState(['SJC_9999', 'XAU_USD'])
  const [historicalData, setHistoricalData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState('day')
  const [showChart, setShowChart] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Fetch latest gold prices
  const fetchLatestPrices = async () => {
    try {
      const response = await fetch(`${API_BASE}/gold/latest`)
      const data = await response.json()
      
      if (data.success) {
        setGoldPrices(data.data)
        setLastUpdate(new Date())
        setError(null)
      } else {
        throw new Error(data.error || 'Failed to fetch gold prices')
      }
    } catch (err) {
      console.error('Error fetching gold prices:', err)
      setError(err.message)
    }
  }

  // Fetch historical data for selected types
  const fetchHistoricalData = async (types, period) => {
    const data = {}
    
    for (const type of types) {
      try {
        const response = await fetch(
          `${API_BASE}/gold/history?type=${type}&period=${period}`
        )
        const result = await response.json()
        
        if (result.success) {
          data[type] = result.data
        }
      } catch (err) {
        console.error(`Error fetching history for ${type}:`, err)
      }
    }
    
    setHistoricalData(data)
  }

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchLatestPrices()
      await fetchHistoricalData(selectedTypes, period)
      setLoading(false)
    }
    
    loadData()
  }, [])

  // Refresh data when selected types or period changes
  useEffect(() => {
    if (!loading && selectedTypes.length > 0) {
      fetchHistoricalData(selectedTypes, period)
    }
  }, [selectedTypes, period])

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true)
    await fetchLatestPrices()
    await fetchHistoricalData(selectedTypes, period)
    setLoading(false)
  }

  // Toggle type selection
  const toggleType = (type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  // Get unique gold types
  const availableTypes = [...new Set(goldPrices.map(p => p.type))]

  if (loading && goldPrices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải giá vàng...</p>
        </div>
      </div>
    )
  }

  if (error && goldPrices.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌ Lỗi tải dữ liệu</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <GoldHeader
          onRefresh={handleRefresh}
          loading={loading}
          lastUpdate={lastUpdate}
        />

        {/* Filters */}
        <GoldFilters
          period={period}
          onPeriodChange={setPeriod}
          showChart={showChart}
          onShowChartChange={setShowChart}
          selectedTypes={selectedTypes}
          availableTypes={availableTypes}
          onTypeToggle={toggleType}
        />

        {/* Chart Section */}
        {showChart && selectedTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GoldChart
              data={historicalData}
              selectedTypes={selectedTypes}
              period={period}
              loading={loading}
            />
          </motion.div>
        )}

        {/* Price Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {goldPrices.map((price, index) => (
            <GoldListCard
              key={`${price.type}-${price.id}`}
              price={price}
              selected={selectedTypes.includes(price.type)}
              onSelect={() => toggleType(price.type)}
              delay={index * 0.05}
            />
          ))}
        </div>

        {/* Empty State */}
        {goldPrices.length === 0 && !loading && (
          <div className="text-center py-12">
            <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Chưa có dữ liệu giá vàng</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GoldPricesTool
