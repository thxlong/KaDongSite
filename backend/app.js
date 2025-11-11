import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

// Routes
import toolsRoutes from './routes/tools.js'
import notesRoutes from './routes/notes.js'
import eventsRoutes from './routes/events.js'
import feedbackRoutes from './routes/feedback.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// API Routes
app.use('/api/tools', toolsRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/feedback', feedbackRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KaDong Tools API is running',
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to KaDong Tools API ❤️',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tools: '/api/tools',
      notes: '/api/notes',
      events: '/api/events',
      feedback: '/api/feedback'
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

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🌸 KaDong Tools API Server 🌸      ║
║   Running on http://localhost:${PORT}   ║
║   Environment: ${process.env.NODE_ENV}           ║
╚═══════════════════════════════════════╝
  `)
})

export default app
