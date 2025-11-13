#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * 
 * This script checks if the application is ready for production deployment.
 * Run before deploying to production: node scripts/verify-production.js
 */

import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const checks = []
let passed = 0
let failed = 0

// Helper functions
const success = (message) => {
  checks.push({ status: '✅', message })
  passed++
}

const fail = (message) => {
  checks.push({ status: '❌', message })
  failed++
}

const warn = (message) => {
  checks.push({ status: '⚠️', message })
}

console.log('\n🔍 Production Readiness Check\n')
console.log('=' .repeat(60))

// 1. Check environment variables
console.log('\n📋 Checking Environment Variables...')

if (process.env.NODE_ENV === 'production') {
  success('NODE_ENV is set to production')
} else {
  warn(`NODE_ENV is "${process.env.NODE_ENV}" (expected: production)`)
}

if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.includes('localhost')) {
    fail('DATABASE_URL points to localhost (should be production DB)')
  } else if (process.env.DATABASE_URL.includes('sslmode=require')) {
    success('DATABASE_URL has SSL enabled')
  } else {
    warn('DATABASE_URL should include sslmode=require for production')
  }
} else {
  fail('DATABASE_URL is not set')
}

if (process.env.JWT_SECRET) {
  if (process.env.JWT_SECRET.length >= 32) {
    success('JWT_SECRET is strong (32+ characters)')
  } else {
    fail('JWT_SECRET is too short (min 32 characters required)')
  }
  
  if (process.env.JWT_SECRET.includes('your_') || process.env.JWT_SECRET.includes('example')) {
    fail('JWT_SECRET appears to be a placeholder - must be changed!')
  }
} else {
  fail('JWT_SECRET is not set')
}

if (process.env.SESSION_SECRET) {
  if (process.env.SESSION_SECRET.includes('your_') || process.env.SESSION_SECRET.includes('example')) {
    fail('SESSION_SECRET appears to be a placeholder - must be changed!')
  } else {
    success('SESSION_SECRET is set')
  }
} else {
  fail('SESSION_SECRET is not set')
}

if (process.env.ALLOWED_ORIGINS) {
  if (process.env.ALLOWED_ORIGINS.includes('localhost')) {
    warn('ALLOWED_ORIGINS includes localhost (should only have production domains)')
  } else {
    success('ALLOWED_ORIGINS configured for production')
  }
} else {
  fail('ALLOWED_ORIGINS is not set')
}

if (process.env.COOKIE_SECURE === 'true') {
  success('COOKIE_SECURE is enabled (HTTPS only)')
} else {
  fail('COOKIE_SECURE should be "true" in production')
}

// 2. Check required files
console.log('\n📁 Checking Required Files...')

const requiredFiles = [
  'package.json',
  'app.js',
  'railway.json',
  '.env.example'
]

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    success(`${file} exists`)
  } else {
    fail(`${file} is missing`)
  }
})

// 3. Check package.json
console.log('\n📦 Checking package.json...')

const packageJsonPath = path.join(__dirname, '..', 'package.json')
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  
  if (packageJson.scripts && packageJson.scripts.start) {
    success('npm start script is defined')
  } else {
    fail('npm start script is missing in package.json')
  }
  
  if (packageJson.type === 'module') {
    success('ES modules enabled (type: module)')
  } else {
    warn('Using CommonJS (consider ES modules for production)')
  }
  
  // Check critical dependencies
  const criticalDeps = ['express', 'pg', 'dotenv', 'cors', 'bcrypt', 'jsonwebtoken']
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      success(`Dependency: ${dep} installed`)
    } else {
      fail(`Missing critical dependency: ${dep}`)
    }
  })
} else {
  fail('package.json not found')
}

// 4. Check database migrations
console.log('\n🗄️  Checking Database Migrations...')

const migrationsPath = path.join(__dirname, '..', 'database', 'migrations')
if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'))
  if (migrations.length > 0) {
    success(`Found ${migrations.length} migration files`)
  } else {
    warn('No migration files found')
  }
} else {
  warn('Migrations directory not found')
}

// 5. Check security
console.log('\n🔐 Security Checks...')

// Check if .env is in .gitignore
const gitignorePath = path.join(__dirname, '..', '..', '.gitignore')
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8')
  if (gitignore.includes('.env')) {
    success('.env is in .gitignore (secrets safe)')
  } else {
    fail('.env is NOT in .gitignore - SECURITY RISK!')
  }
} else {
  warn('.gitignore not found')
}

// Check railway.json health check
const railwayJsonPath = path.join(__dirname, '..', 'railway.json')
if (fs.existsSync(railwayJsonPath)) {
  const railwayJson = JSON.parse(fs.readFileSync(railwayJsonPath, 'utf8'))
  if (railwayJson.healthcheck && railwayJson.healthcheck.path === '/api/health') {
    success('Health check endpoint configured in railway.json')
  } else {
    fail('Health check not properly configured in railway.json')
  }
} else {
  warn('railway.json not found (optional but recommended)')
}

// 6. Print results
console.log('\n' + '='.repeat(60))
console.log('\n📊 Results Summary:\n')

checks.forEach(check => {
  console.log(`${check.status} ${check.message}`)
})

console.log('\n' + '='.repeat(60))
console.log(`\n✅ Passed: ${passed}`)
console.log(`❌ Failed: ${failed}`)
console.log(`⚠️  Warnings: ${checks.filter(c => c.status === '⚠️').length}`)

if (failed > 0) {
  console.log('\n❌ Production readiness check FAILED!')
  console.log('   Please fix the issues above before deploying to production.\n')
  process.exit(1)
} else {
  console.log('\n✅ Production readiness check PASSED!')
  console.log('   Application is ready for deployment.\n')
  process.exit(0)
}
