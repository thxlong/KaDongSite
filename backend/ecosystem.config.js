/**
 * PM2 Ecosystem Configuration
 * 
 * Production deployment configuration for PM2 process manager
 * https://pm2.keymetrics.io/docs/usage/application-declaration/
 */

export default {
  apps: [
    {
      name: 'kadongsite-api',
      script: './src/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart
      autorestart: true,
      watch: false, // Disable in production, enable in dev if needed
      max_memory_restart: '1G',
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Advanced features
      instance_var: 'INSTANCE_ID',
      min_uptime: '10s',
      max_restarts: 10,
    },
    
    // Cron job for gold price auto-update (every 5 minutes)
    {
      name: 'gold-price-cron',
      script: './gold-cron.js',
      autorestart: true, // Keep cron job running
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/gold-cron-error.log',
      out_file: './logs/gold-cron-out.log',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/kadongsite.git',
      path: '/var/www/kadongsite',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
