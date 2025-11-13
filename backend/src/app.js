/**
 * Express Application Setup
 * @description Main Express app configuration with routes and middleware
 * @author KaDong Team
 * @created 2025-11-12
 */

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from '#config/logger.config.js'
import { config } from '#config/env.config.js'

// Routes
import authRoutes from '#api/routes/auth.js'
import toolsRoutes from '#api/routes/tools.js'
import notesRoutes from '#api/routes/notes.js'
import eventsRoutes from '#api/routes/events.js'
import feedbackRoutes from '#api/routes/feedback.js'
import fashionRoutes from '#api/routes/fashion.js'
import goldRoutes from '#api/routes/gold.js'
import weatherRoutes from '#api/routes/weather.js'
import wishlistRoutes from '#api/routes/wishlist.js'
import currencyRoutes from '#api/routes/currency.js'
import weddingRoutes from '#api/routes/wedding.js'
import debugRoutes from '#api/routes/debug.js'

const app = express()

// ============ Middleware ============

// CORS
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}))

// Body parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Cookie parsing
app.use(cookieParser())

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  
  // Log request
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  })
  
  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.path} - ${res.statusCode}`, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    })
  })
  
  next()
})

// ============ API Routes ============

app.use('/api/auth', authRoutes)
app.use('/api/tools', toolsRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/feedback', feedbackRoutes)
app.use('/api/fashion', fashionRoutes)
app.use('/api/gold', goldRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/currency', currencyRoutes)
app.use('/api', weddingRoutes)

// Debug routes (development only)
if (config.NODE_ENV === 'development') {
  app.use('/api/debug', debugRoutes)
  logger.info('Debug routes enabled')
}

// ============ Health & Info Endpoints ============

/**
 * Health check endpoint
 * @route GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KaDong Tools API is running',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

/**
 * Root endpoint - API documentation
 * @route GET /
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KaDong Tools API 🎉',
    version: '2.0.0',
    architecture: 'Clean Architecture with ES6 Modules',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tools: '/api/tools',
      notes: '/api/notes',
      events: '/api/events',
      feedback: '/api/feedback',
      fashion: '/api/fashion',
      gold: '/api/gold',
      weather: '/api/weather',
      wishlist: '/api/wishlist',
      currency: '/api/currency',
      weddingUrls: '/api/wedding-urls'
    },
    documentation: '/api/docs' // TODO: Add Swagger/OpenAPI docs
  })
})

// ============ Error Handlers ============

/**
 * 404 Not Found handler
 */
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`)
  res.status(404).json({ 
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist'
    }
  })
})

/**
 * Global error handling middleware
 */
app.use((err, req, res, next) => {
  logger.error('Internal Server Error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })
  
  res.status(500).json({ 
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    }
  })
})

export default app
