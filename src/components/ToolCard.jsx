import { motion } from 'framer-motion'

const ToolCard = ({ title, description, icon: Icon, color, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer
        bg-gradient-to-br ${color}
        rounded-3xl p-6 shadow-lg
        hover:shadow-2xl transition-shadow duration-300
        group
      `}
      role="button"
      tabIndex={0}
      aria-label={`Mở công cụ ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Decorative circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="bg-white/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
          <Icon className="w-7 h-7 text-white" />
        </div>
        
        <h3 className="text-xl font-bold font-poppins text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-white/90 font-nunito">
          {description}
        </p>
      </div>

      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"
        initial={false}
      />
    </motion.div>
  )
}

export default ToolCard
