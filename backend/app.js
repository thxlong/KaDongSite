import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

// Routes
import toolsRoutes from './routes/tools.js'
import notesRoutes from './routes/notes.js'
import eventsRoutes from './routes/events.js'
import feedbackRoutes from './routes/feedback.js'
import fashionRoutes from './routes/fashion.js'
import goldRoutes from './routes/gold.js'
import weatherRoutes from './routes/weather.js'
import wishlistRoutes from './routes/wishlist.js'
import currencyRoutes from './routes/currency.js'
import weddingRoutes from './routes/wedding.js'
import debugRoutes from './routes/debug.js'
import adminRoutes from './src/api/routes/admin.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173']

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 minutes
}

// Middleware
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(` -  `)
  next()
})

// API Routes
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
app.use('/api/admin', adminRoutes)

// Debug routes (development only)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/debug', debugRoutes)
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'KaDong Tools API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KaDong Tools API ',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tools: '/api/tools',
      notes: '/api/notes',
      events: '/api/events',
      feedback: '/api/feedback',
      fashion: '/api/fashion',
      gold: '/api/gold',
      weather: '/api/weather',
      wishlist: '/api/wishlist',
      weddingUrls: '/api/wedding-urls'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`

   KaDong Tools API Server
   Running on http://localhost:${PORT}
   Environment: ${process.env.NODE_ENV}

    `)
  })
}

export default app
