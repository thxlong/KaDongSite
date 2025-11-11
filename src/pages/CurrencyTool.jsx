import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRightLeft, TrendingUp, RefreshCw } from 'lucide-react'

const CurrencyTool = () => {
  const [amount, setAmount] = useState(100)
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('VND')
  const [result, setResult] = useState(0)
  const [rates, setRates] = useState({
    USD: 1,
    VND: 24000,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 148.5,
    KRW: 1320,
    CNY: 7.24,
    THB: 35.5
  })

  const currencies = [
    { code: 'USD', name: 'Đô la Mỹ', symbol: '$', flag: '🇺🇸' },
    { code: 'VND', name: 'Việt Nam Đồng', symbol: '₫', flag: '🇻🇳' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'Bảng Anh', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Yên Nhật', symbol: '¥', flag: '🇯🇵' },
    { code: 'KRW', name: 'Won Hàn Quốc', symbol: '₩', flag: '🇰🇷' },
    { code: 'CNY', name: 'Nhân dân tệ', symbol: '¥', flag: '🇨🇳' },
    { code: 'THB', name: 'Baht Thái', symbol: '฿', flag: '🇹🇭' },
  ]

  useEffect(() => {
    calculateConversion()
  }, [amount, fromCurrency, toCurrency, rates])

  const calculateConversion = () => {
    // Convert from source currency to USD first, then to target currency
    const amountInUSD = amount / rates[fromCurrency]
    const convertedAmount = amountInUSD * rates[toCurrency]
    setResult(convertedAmount)
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const getFromCurrencyInfo = () => currencies.find(c => c.code === fromCurrency)
  const getToCurrencyInfo = () => currencies.find(c => c.code === toCurrency)

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const quickAmounts = [100, 500, 1000, 5000, 10000]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-poppins text-gray-800 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-500" />
          Chuyển đổi tiền tệ
        </h1>
        <p className="text-gray-600 mt-2 font-nunito">
          Tính toán và chuyển đổi tiền tệ nhanh chóng
        </p>
      </div>

      {/* Main Converter Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl shadow-xl p-6 md:p-8"
      >
        {/* From Currency */}
        <div className="bg-white rounded-2xl p-6 mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-3 font-nunito">
            Từ
          </label>
          <div className="flex items-center gap-4">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-colors font-medium text-lg"
              aria-label="Chọn tiền tệ nguồn"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-40 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-colors font-bold text-xl text-right"
              min="0"
              step="0.01"
              aria-label="Số tiền cần chuyển đổi"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={swapCurrencies}
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white p-4 rounded-full shadow-lg"
            aria-label="Hoán đổi tiền tệ"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </motion.button>
        </div>

        {/* To Currency */}
        <div className="bg-white rounded-2xl p-6 mt-4">
          <label className="block text-sm font-medium text-gray-600 mb-3 font-nunito">
            Sang
          </label>
          <div className="flex items-center gap-4">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:outline-none transition-colors font-medium text-lg"
              aria-label="Chọn tiền tệ đích"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag} {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
            <div className="w-40 px-4 py-3 rounded-xl bg-gradient-to-r from-green-100 to-blue-100 font-bold text-xl text-right">
              {formatNumber(result)}
            </div>
          </div>
        </div>

        {/* Result Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium font-nunito">Kết quả</span>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold font-poppins">
              {getFromCurrencyInfo()?.symbol} {formatNumber(amount)} = {getToCurrencyInfo()?.symbol} {formatNumber(result)}
            </p>
            <p className="text-sm mt-2 text-white/80 font-nunito">
              1 {fromCurrency} = {formatNumber(rates[toCurrency] / rates[fromCurrency])} {toCurrency}
            </p>
          </div>
        </motion.div>

        {/* Quick Amount Buttons */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-600 mb-3 font-nunito">
            Số tiền nhanh:
          </p>
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((quickAmount) => (
              <motion.button
                key={quickAmount}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAmount(quickAmount)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all
                  ${amount === quickAmount 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {quickAmount.toLocaleString()}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Exchange Rates Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-white rounded-3xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg font-poppins text-gray-800 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-gray-600" />
            Tỷ giá hôm nay
          </h3>
          <span className="text-sm text-gray-500 font-nunito">
            Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{currency.flag}</span>
                <span className="font-bold text-gray-800">{currency.code}</span>
              </div>
              <p className="text-sm text-gray-600 font-nunito mb-1">
                {currency.name}
              </p>
              <p className="font-bold text-green-600">
                {currency.symbol} {formatNumber(rates[currency.code])}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center font-nunito">
          * Tỷ giá tham khảo so với USD. Dữ liệu chỉ mang tính chất tham khảo.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default CurrencyTool
