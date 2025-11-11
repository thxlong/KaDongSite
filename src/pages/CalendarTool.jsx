import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

const CalendarTool = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState({
    '2024-01-15': 'Sinh nhật Ka ❤️',
    '2024-02-14': 'Valentine 💕',
    '2024-03-08': 'Ngày Quốc tế Phụ nữ 🌹'
  })

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const getEventForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events[dateStr]
  }

  const renderCalendar = () => {
    const days = []
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const event = getEventForDay(day)
      const today = isToday(day)

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            aspect-square p-2 rounded-2xl cursor-pointer
            transition-all duration-200
            ${today 
              ? 'bg-gradient-to-br from-pastel-pink to-pastel-purple text-white shadow-lg' 
              : 'bg-white hover:bg-pastel-cream'
            }
            ${event ? 'ring-2 ring-purple-400' : ''}
          `}
        >
          <div className="h-full flex flex-col">
            <span className={`text-sm font-semibold ${today ? 'text-white' : 'text-gray-700'}`}>
              {day}
            </span>
            {event && (
              <span className="text-xs mt-1 line-clamp-2 text-gray-600">
                {event}
              </span>
            )}
          </div>
        </motion.div>
      )
    }

    return days
  }

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
          <CalendarIcon className="w-8 h-8 text-purple-500" />
          Lịch của chúng mình
        </h1>
        <p className="text-gray-600 mt-2 font-nunito">
          Xem lịch trình và những ngày đặc biệt
        </p>
      </div>

      {/* Calendar Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
      >
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={previousMonth}
            className="p-3 bg-gradient-to-br from-pastel-mint to-pastel-blue rounded-xl hover:shadow-md transition-shadow"
            aria-label="Tháng trước"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>

          <div className="text-center">
            <h2 className="text-2xl font-bold font-poppins text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-nunito">
              Hôm nay: {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextMonth}
            className="p-3 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-xl hover:shadow-md transition-shadow"
            aria-label="Tháng sau"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 font-poppins"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t-2 border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-3 font-poppins">
            Chú thích:
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-br from-pastel-pink to-pastel-purple" />
              <span className="text-sm text-gray-600 font-nunito">Hôm nay</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white ring-2 ring-purple-400" />
              <span className="text-sm text-gray-600 font-nunito">Có sự kiện</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-gradient-to-br from-pastel-cream to-pastel-peach rounded-3xl p-6 shadow-lg"
      >
        <h3 className="font-bold text-lg mb-4 font-poppins text-gray-800">
          Sự kiện sắp tới
        </h3>
        <div className="space-y-3">
          {Object.entries(events).map(([date, event]) => (
            <div
              key={date}
              className="bg-white/80 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="bg-gradient-to-br from-pastel-purple to-pastel-pink p-3 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 font-poppins">{event}</p>
                <p className="text-sm text-gray-600 font-nunito">
                  {new Date(date).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CalendarTool
