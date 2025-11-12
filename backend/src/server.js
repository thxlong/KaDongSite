/**
 * Server Entry Point
 * @description Start the Express server and initialize database connection
 * @author KaDong Team
 * @created 2025-11-12
 */

import app from './app.js'
import { config, validateEnv } from '#config/env.config.js'
import { testConnection } from '#config/database.config.js'
import logger from '#config/logger.config.js'

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv()
    logger.info('Environment variables validated')

    // Test database connection
    const dbConnected = await testConnection()
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...')
      process.exit(1)
    }

    // Start Express server
    const server = app.listen(config.PORT, () => {
      logger.info(`
╔═══════════════════════════════════════╗
║   🚀 KaDong Tools API Server         ║
║   Running on http://localhost:${config.PORT}  ║
║   Environment: ${config.NODE_ENV.padEnd(20)} ║
╚═══════════════════════════════════════╝
      `)
      
      logger.info('Server started successfully', {
        port: config.PORT,
        environment: config.NODE_ENV,
        nodeVersion: process.version
      })
    })

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`)
      
      server.close(async () => {
        logger.info('HTTP server closed')
        
        // Close database connections
        // await closePool() // Uncomment if needed
        
        logger.info('Graceful shutdown completed')
        process.exit(0)
      })

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', {
        reason,
        promise
      })
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
      })
      process.exit(1)
    })

  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    })
    process.exit(1)
  }
}

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export default app
