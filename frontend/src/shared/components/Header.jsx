import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-3 group"
            aria-label="Về trang chủ KaDong Tools"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-pastel-pink to-pastel-purple p-3 rounded-2xl shadow-md"
            >
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold font-poppins bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                KaDong Tools
              </h1>
              <p className="text-xs text-gray-600 font-nunito">
                Tiện ích cho hai chúng mình ❤️
              </p>
            </div>
          </Link>

          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="hidden md:flex items-center gap-2 bg-pastel-cream px-4 py-2 rounded-full shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              Made with love
            </span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
