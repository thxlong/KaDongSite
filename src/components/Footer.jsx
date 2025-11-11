import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/60 backdrop-blur-sm shadow-lg mt-8"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-sm font-nunito">
              © {currentYear} KaDong Tools
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
            </motion.div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a 
              href="mailto:contact@kadong.com"
              className="hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 rounded px-2 py-1"
              aria-label="Gửi email liên hệ"
            >
              Liên hệ
            </a>
            <span className="text-gray-400">|</span>
            <span className="font-nunito">
              Made with 💖 for us
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
