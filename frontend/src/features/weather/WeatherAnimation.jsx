/**
 * Weather Animation Component
 * @description Framer Motion animations for different weather conditions
 * @author KaDong Team
 * @created 2025-11-11
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

/**
 * Sunny Animation - Mặt trời lấp lánh với tia sáng
 */
const SunnyAnimation = () => {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Sun */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.9, 1, 0.9],
          rotate: [0, 360]
        }}
        transition={{
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          },
          opacity: {
            duration: 2,
            repeat: Infinity
          }
        }}
      >
        {/* Sun rays */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-1 h-16 bg-gradient-to-t from-yellow-300 to-transparent origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 30}deg)`
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scaleY: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Sparkles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-2 h-2 bg-yellow-300 rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 40}%`
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  )
}

/**
 * Rainy Animation - Giọt mưa rơi từ trên xuống
 */
const RainyAnimation = () => {
  const raindrops = useMemo(() => {
    return [...Array(80)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.4,
      width: Math.random() > 0.5 ? 'w-0.5' : 'w-1'
    }))
  }, [])

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Dark clouds */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute w-64 h-32 bg-gray-400 rounded-full opacity-30 blur-xl"
          style={{
            top: `${-10 + i * 8}%`,
            left: `${10 + i * 20}%`
          }}
          animate={{
            x: [-50, window.innerWidth + 50]
          }}
          transition={{
            duration: 30 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Raindrops */}
      {raindrops.map(drop => (
        <motion.div
          key={drop.id}
          className={`absolute ${drop.width} h-12 bg-gradient-to-b from-blue-400 to-blue-500 opacity-60 rounded-full`}
          style={{
            left: `${drop.x}%`,
            top: -50
          }}
          animate={{
            y: ['0vh', '120vh'],
            opacity: [0.4, 0.7, 0]
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Splash effects (subtle) */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`splash-${i}`}
          className="absolute w-4 h-1 bg-blue-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: 0
          }}
          animate={{
            scaleX: [0, 1.5, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  )
}

/**
 * Cloudy Animation - Mây di chuyển chậm rãi
 */
const CloudyAnimation = () => {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            width: `${150 + i * 50}px`,
            height: `${80 + i * 20}px`,
            top: `${15 + i * 12}%`,
            left: `-${100 + i * 20}px`,
            background: `linear-gradient(135deg, rgba(200, 200, 220, 0.6), rgba(180, 180, 200, 0.8))`
          }}
          animate={{
            x: [0, window.innerWidth + 200]
          }}
          transition={{
            duration: 25 + i * 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2
          }}
        >
          {/* Cloud puffs */}
          <motion.div
            className="absolute w-24 h-24 bg-gray-300 rounded-full -top-4 left-8 opacity-70"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute w-20 h-20 bg-gray-300 rounded-full -top-2 right-12 opacity-70"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * Snowy Animation - Bông tuyết rơi nhẹ nhàng
 */
const SnowyAnimation = () => {
  const snowflakes = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
      size: 4 + Math.random() * 8,
      drift: (Math.random() - 0.5) * 100
    }))
  }, [])

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {snowflakes.map(flake => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white shadow-lg"
          style={{
            width: flake.size,
            height: flake.size,
            left: `${flake.x}%`,
            top: -20
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: [0, flake.drift, -flake.drift / 2, 0],
            rotate: [0, 360, 720],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "easeInOut"
          }}
        >
          {/* Snowflake details */}
          <svg className="w-full h-full" viewBox="0 0 10 10">
            <motion.path
              d="M5,0 L5,10 M0,5 L10,5 M2,2 L8,8 M8,2 L2,8"
              stroke="white"
              strokeWidth="1"
              fill="none"
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </svg>
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * Thunderstorm Animation - Sấm chớp và mưa to
 */
const ThunderstormAnimation = () => {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Heavy rain */}
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={`rain-${i}`}
          className="absolute w-1 h-16 bg-blue-500 opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20
          }}
          animate={{
            y: ['0vh', '110vh']
          }}
          transition={{
            duration: 0.4 + Math.random() * 0.3,
            repeat: Infinity,
            delay: Math.random() * 0.5,
            ease: "linear"
          }}
        />
      ))}

      {/* Dark storm clouds */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`storm-cloud-${i}`}
          className="absolute w-96 h-48 bg-gray-700 rounded-full opacity-50 blur-2xl"
          style={{
            top: `${-5 + i * 10}%`,
            left: `${i * 25}%`
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Lightning flashes */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-blue-100 to-transparent"
        animate={{
          opacity: [0, 0.7, 0, 0, 0]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 3 + Math.random() * 5,
          times: [0, 0.1, 0.2, 0.3, 1]
        }}
      />

      {/* Lightning bolts */}
      {[...Array(2)].map((_, i) => (
        <motion.svg
          key={`lightning-${i}`}
          className="absolute"
          style={{
            left: `${30 + i * 40}%`,
            top: '10%',
            width: '60px',
            height: '200px'
          }}
          viewBox="0 0 30 100"
          animate={{
            opacity: [0, 1, 0, 0, 0]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 4 + i * 2,
            times: [0, 0.05, 0.1, 0.2, 1]
          }}
        >
          <motion.path
            d="M15,0 L10,30 L18,30 L12,60 L20,60 L15,100"
            fill="yellow"
            stroke="white"
            strokeWidth="1"
            filter="drop-shadow(0 0 8px yellow)"
          />
        </motion.svg>
      ))}

      {/* Thunder glow */}
      <motion.div
        className="absolute inset-0 bg-purple-500 opacity-0"
        animate={{
          opacity: [0, 0.15, 0]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 5 + Math.random() * 3
        }}
      />
    </motion.div>
  )
}

/**
 * Foggy Animation - Sương mù di chuyển
 */
const FoggyAnimation = () => {
  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-full h-48 bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30 blur-3xl"
          style={{
            top: `${10 + i * 15}%`
          }}
          animate={{
            x: ['-100%', '100%'],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2
          }}
        />
      ))}

      {/* Fog particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`fog-${i}`}
          className="absolute w-32 h-32 bg-gray-200 rounded-full opacity-20 blur-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80}%`
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
        />
      ))}
    </motion.div>
  )
}

/**
 * Main WeatherAnimation Component
 * Selects appropriate animation based on weather condition
 */
const WeatherAnimation = ({ condition }) => {
  // Map weather conditions to animations
  const getAnimation = () => {
    if (!condition) return null

    switch (condition) {
      case 'Clear':
        return <SunnyAnimation />
      
      case 'Rain':
      case 'Drizzle':
        return <RainyAnimation />
      
      case 'Clouds':
        return <CloudyAnimation />
      
      case 'Snow':
        return <SnowyAnimation />
      
      case 'Thunderstorm':
        return <ThunderstormAnimation />
      
      case 'Mist':
      case 'Fog':
      case 'Haze':
        return <FoggyAnimation />
      
      default:
        return <CloudyAnimation /> // Default fallback
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {getAnimation()}
    </div>
  )
}

export default WeatherAnimation
