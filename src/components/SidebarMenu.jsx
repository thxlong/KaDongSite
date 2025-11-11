import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Calendar, 
  Clock, 
  StickyNote, 
  DollarSign,
  ChevronRight 
} from 'lucide-react'

const tools = [
  {
    id: 'home',
    name: 'Trang chủ',
    path: '/',
    icon: Home,
    color: 'from-pastel-pink to-pastel-peach',
    description: 'Điểm bắt đầu'
  },
  {
    id: 'countdown',
    name: 'Đếm ngày',
    path: '/countdown',
    icon: Clock,
    color: 'from-pastel-purple to-pastel-blue',
    description: 'Kỷ niệm & sự kiện'
  },
  {
    id: 'calendar',
    name: 'Lịch',
    path: '/calendar',
    icon: Calendar,
    color: 'from-pastel-mint to-pastel-blue',
    description: 'Xem lịch trình'
  },
  {
    id: 'notes',
    name: 'Ghi chú',
    path: '/notes',
    icon: StickyNote,
    color: 'from-pastel-peach to-pastel-cream',
    description: 'Lưu ý kiến & việc cần làm'
  },
  {
    id: 'currency',
    name: 'Chuyển đổi tiền',
    path: '/currency',
    icon: DollarSign,
    color: 'from-pastel-mint to-pastel-purple',
    description: 'Tính toán tiền tệ'
  }
]

const SidebarMenu = () => {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full lg:w-80 bg-white/60 backdrop-blur-sm p-4 lg:p-6 shadow-xl"
      role="navigation"
      aria-label="Menu công cụ chính"
    >
      <h2 className="text-lg font-bold font-poppins text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full"></span>
        Công cụ của chúng mình
      </h2>

      <nav className="space-y-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <NavLink
              key={tool.id}
              to={tool.path}
              className={({ isActive }) => 
                `block group ${isActive ? 'scale-105' : ''}`
              }
              aria-label={`Mở công cụ ${tool.name}`}
            >
              {({ isActive }) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative overflow-hidden rounded-2xl p-4 cursor-pointer
                    transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-br ' + tool.color + ' shadow-lg' 
                      : 'bg-white hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        p-2 rounded-xl transition-colors
                        ${isActive 
                          ? 'bg-white/30' 
                          : 'bg-gradient-to-br ' + tool.color
                        }
                      `}>
                        <Icon 
                          className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-700'}`}
                        />
                      </div>
                      <div>
                        <h3 className={`
                          font-semibold font-poppins
                          ${isActive ? 'text-white' : 'text-gray-800'}
                        `}>
                          {tool.name}
                        </h3>
                        <p className={`
                          text-xs
                          ${isActive ? 'text-white/80' : 'text-gray-600'}
                        `}>
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight 
                      className={`
                        w-5 h-5 transition-transform group-hover:translate-x-1
                        ${isActive ? 'text-white' : 'text-gray-400'}
                      `}
                    />
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-white/10 rounded-2xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          )
        })}
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 bg-gradient-to-br from-pastel-pink/30 to-pastel-purple/30 rounded-2xl"
      >
        <p className="text-sm text-gray-700 text-center font-nunito">
          💡 Thêm công cụ mới bất cứ lúc nào!
        </p>
      </motion.div>
    </motion.aside>
  )
}

export default SidebarMenu
