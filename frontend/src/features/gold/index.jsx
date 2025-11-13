/**
 * Gold Components - All-in-One Export
 * @description Complete set of components for Gold Prices Tool
 */

import { motion } from 'framer-motion'
import { RefreshCw, TrendingUp, TrendingDown, Minus, Check } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

// ==================== GOLD HEADER ====================
export const GoldHeader = ({ onRefresh, loading, lastUpdate }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          💰 Giá Vàng Việt Nam
        </h1>
        <p className="text-gray-600 mt-1">
          {lastUpdate ? (
            <>Cập nhật: {format(lastUpdate, 'HH:mm:ss dd/MM/yyyy')}</>
          ) : (
            'Đang tải...'
          )}
        </p>
      </div>
      
      <button
        onClick={onRefresh}
        disabled={loading}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-2"
        aria-label="Làm mới dữ liệu"
      >
        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        Làm mới
      </button>
    </div>
  )
}

// ==================== GOLD LIST CARD ====================
export const GoldListCard = ({ price, selected, onSelect, delay }) => {
  const formatPrice = (val) => {
    if (price.currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(val) + ' đ'
    }
    return '$' + new Intl.NumberFormat('en-US').format(val)
  }

  const changePercent = price.mid_price 
    ? ((price.sell_price - price.buy_price) / price.buy_price * 100).toFixed(2)
    : 0

  const getTrend = () => {
    if (changePercent > 0) return { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' }
    if (changePercent < 0) return { icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-50' }
    return { icon: Minus, color: 'text-gray-500', bg: 'bg-gray-50' }
  }

  const trend = getTrend()
  const TrendIcon = trend.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl cursor-pointer transition-all
        ${selected ? 'ring-2 ring-yellow-500 bg-yellow-50' : 'bg-white hover:shadow-md'}
        shadow-sm
      `}
      role="button"
      tabIndex={0}
      aria-label={`${price.type} ${selected ? 'đã chọn' : 'chưa chọn'}`}
      onKeyPress={(e) => e.key === 'Enter' && onSelect()}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <Check className="w-5 h-5 text-yellow-600" />
        </div>
      )}

      <div className="mb-2">
        <h3 className="text-lg font-bold text-gray-800">{price.type}</h3>
        <p className="text-sm text-gray-500">{price.meta?.unit || price.currency}</p>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Mua vào:</span>
          <span className="font-semibold text-green-600">{formatPrice(price.buy_price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Bán ra:</span>
          <span className="font-semibold text-red-600">{formatPrice(price.sell_price)}</span>
        </div>
      </div>

      <div className={`flex items-center gap-2 p-2 rounded ${trend.bg}`}>
        <TrendIcon className={`w-4 h-4 ${trend.color}`} />
        <span className={`text-sm font-medium ${trend.color}`}>
          {changePercent > 0 ? '+' : ''}{changePercent}%
        </span>
      </div>

      {price.meta?.location && (
        <p className="text-xs text-gray-500 mt-2">📍 {price.meta.location}</p>
      )}
    </motion.div>
  )
}

// ==================== GOLD FILTERS ====================
export const GoldFilters = ({ 
  period, 
  onPeriodChange, 
  showChart, 
  onShowChartChange,
  selectedTypes,
  availableTypes,
  onTypeToggle 
}) => {
  const periods = [
    { value: 'day', label: 'Ngày' },
    { value: 'week', label: 'Tuần' },
    { value: 'month', label: 'Tháng' },
    { value: 'year', label: 'Năm' }
  ]

  return (
    <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Period Selection */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
          <div className="flex gap-2">
            {periods.map(p => (
              <button
                key={p.value}
                onClick={() => onPeriodChange(p.value)}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium transition-colors
                  ${period === p.value 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                aria-label={`Xem theo ${p.label}`}
                aria-pressed={period === p.value}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Show Chart Toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showChart}
              onChange={(e) => onShowChartChange(e.target.checked)}
              className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
              aria-label="Hiển thị biểu đồ"
            />
            <span className="text-sm font-medium text-gray-700">Hiển thị biểu đồ</span>
          </label>
        </div>

        {/* Selected Count */}
        {selectedTypes.length > 0 && (
          <div className="ml-auto text-sm text-gray-600">
            Đang so sánh: <span className="font-semibold">{selectedTypes.length}</span> loại
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== GOLD CHART ====================
export const GoldChart = ({ data, selectedTypes, period, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-yellow-500 mx-auto mb-2" />
          <p className="text-gray-600">Đang tải biểu đồ...</p>
        </div>
      </div>
    )
  }

  // Check if data exists and is not empty
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          📈 Biểu đồ giá vàng
        </h2>
        <div className="text-center py-8 text-gray-500">
          ⚠️ Chưa có dữ liệu lịch sử. Vui lòng chọn loại vàng để xem biểu đồ.
        </div>
      </div>
    )
  }

  // Transform data for recharts
  const chartData = []
  const typeData = {}

  // Collect all timestamps from all selected types
  Object.entries(data).forEach(([type, records]) => {
    if (!Array.isArray(records) || records.length === 0) {
      console.warn(`[GoldChart] No records for type: ${type}`)
      return
    }

    records.forEach(record => {
      // Get timestamp from time_bucket or period_start
      const timeField = record.time_bucket || record.period_start
      if (!timeField) {
        console.warn('[GoldChart] Missing time_bucket and period_start:', record)
        return
      }

      const timestamp = new Date(timeField).getTime()
      
      if (!typeData[timestamp]) {
        typeData[timestamp] = { timestamp }
      }

      // Get price value (avg_mid_price or mid_price)
      const priceValue = parseFloat(record.avg_mid_price || record.mid_price)
      if (!isNaN(priceValue)) {
        typeData[timestamp][type] = priceValue
      }
    })
  })

  // Convert to array and sort by timestamp
  Object.values(typeData).forEach(item => chartData.push(item))
  chartData.sort((a, b) => a.timestamp - b.timestamp)

  console.log('[GoldChart] Processed chart data:', {
    originalData: data,
    chartData: chartData.slice(0, 3),
    dataPoints: chartData.length,
    selectedTypes
  })

  const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']

  const formatXAxis = (timestamp) => {
    if (period === 'day') {
      return format(new Date(timestamp), 'HH:mm')
    } else if (period === 'week') {
      return format(new Date(timestamp), 'EEE')
    } else {
      return format(new Date(timestamp), 'dd/MM')
    }
  }

  const formatYAxis = (value) => {
    if (!value || value === 0) return '0'
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    }
    return value.toLocaleString()
  }

  // Check if we have any data to display
  const hasData = chartData.length > 0

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📈 Biểu đồ giá vàng - {period === 'day' ? 'Hôm nay' : period === 'week' ? 'Tuần này' : period === 'month' ? 'Tháng này' : 'Năm nay'}
      </h2>
      
      {hasData ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxis}
              stroke="#9ca3af"
            />
            <YAxis 
              tickFormatter={formatYAxis}
              stroke="#9ca3af"
            />
            <Tooltip 
              labelFormatter={(timestamp) => format(new Date(timestamp), 'dd/MM/yyyy HH:mm')}
              formatter={(value) => [formatYAxis(value), '']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {selectedTypes.map((type, index) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                name={type}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="mb-4 text-4xl">📊</div>
          <p className="text-lg font-medium mb-2">Chưa có dữ liệu lịch sử</p>
          <p className="text-sm">
            {selectedTypes.length === 0 
              ? 'Vui lòng chọn loại vàng để xem biểu đồ'
              : 'Dữ liệu lịch sử đang được thu thập. Vui lòng thử lại sau.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

// ==================== GOLD PROVIDER BADGE ====================
export const GoldProviderBadge = ({ provider, className = '' }) => {
  const providers = {
    mock: { name: 'Mock', color: 'bg-gray-100 text-gray-700' },
    sjc: { name: 'SJC', color: 'bg-yellow-100 text-yellow-700' },
    pnj: { name: 'PNJ', color: 'bg-pink-100 text-pink-700' },
    doji: { name: 'DOJI', color: 'bg-blue-100 text-blue-700' },
    international: { name: 'Intl', color: 'bg-green-100 text-green-700' }
  }

  const info = providers[provider] || providers.mock

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${info.color} ${className}`}>
      {info.name}
    </span>
  )
}

export default {
  GoldHeader,
  GoldListCard,
  GoldFilters,
  GoldChart,
  GoldProviderBadge
}
