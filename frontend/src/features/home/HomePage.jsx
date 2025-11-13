import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ToolCard from '../../shared/components/ToolCard'
import { Clock, Calendar, StickyNote, DollarSign, Sparkles } from 'lucide-react'

const tools = [
  {
    id: 'countdown',
    title: 'Đếm ngày',
    description: 'Theo dõi những ngày đặc biệt và kỷ niệm',
    icon: Clock,
    color: 'from-pastel-purple to-pastel-blue',
    path: '/countdown'
  },
  {
    id: 'calendar',
    title: 'Lịch',
    description: 'Xem lịch trình và sự kiện sắp tới',
    icon: Calendar,
    color: 'from-pastel-mint to-pastel-blue',
    path: '/calendar'
  },
  {
    id: 'notes',
    title: 'Ghi chú',
    description: 'Lưu lại những ý tưởng và việc cần làm',
    icon: StickyNote,
    color: 'from-pastel-peach to-pastel-cream',
    path: '/notes'
  },
  {
    id: 'currency',
    title: 'Chuyển đổi tiền',
    description: 'Tính toán và chuyển đổi tiền tệ nhanh chóng',
    icon: DollarSign,
    color: 'from-pastel-mint to-pastel-purple',
    path: '/currency'
  },
  {
    id: 'fashion',
    title: 'Phối đồ',
    description: 'Chọn màu và phối trang phục hoàn hảo',
    icon: Sparkles,
    color: 'from-pastel-pink to-pastel-purple',
    path: '/fashion'
  }
]

const Home = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="inline-block mb-4"
        >
          <Sparkles className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          Chào mừng đến với KaDong Tools
        </h1>
        
        <p className="text-lg text-gray-700 font-nunito max-w-2xl mx-auto">
          Những công cụ nhỏ xinh được thiết kế dành riêng cho hai chúng mình ❤️
          <br />
          Chọn một công cụ bên dưới để bắt đầu!
        </p>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {tools.map((tool, index) => (
          <ToolCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            color={tool.color}
            delay={index * 0.1}
            onClick={() => navigate(tool.path)}
          />
        ))}
      </div>

      {/* Info Cards */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="text-3xl mb-2">🎨</div>
          <h3 className="font-bold font-poppins text-gray-800 mb-1">
            Thiết kế dễ thương
          </h3>
          <p className="text-sm text-gray-600 font-nunito">
            Giao diện pastel tươi mới và thân thiện
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="text-3xl mb-2">📱</div>
          <h3 className="font-bold font-poppins text-gray-800 mb-1">
            Responsive hoàn hảo
          </h3>
          <p className="text-sm text-gray-600 font-nunito">
            Sử dụng mượt mà trên mọi thiết bị
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold font-poppins text-gray-800 mb-1">
            Dễ mở rộng
          </h3>
          <p className="text-sm text-gray-600 font-nunito">
            Thêm công cụ mới bất cứ lúc nào
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Home
