/**
 * API Endpoint Testing Script
 * Tests all migrated endpoints to verify functionality
 */

const TEST_BASE_URL = 'http://localhost:5000'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

/**
 * Test a single endpoint
 */
async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`${colors.cyan}Testing:${colors.reset} ${name}`)
    console.log(`${colors.blue}  URL:${colors.reset} ${url}`)
    
    const response = await fetch(url, options)
    const data = await response.json()
    
    if (response.ok) {
      console.log(`${colors.green}  ✅ PASS${colors.reset} (${response.status})`)
      console.log(`${colors.yellow}  Data:${colors.reset}`, JSON.stringify(data, null, 2).substring(0, 200) + '...')
      return { name, status: 'PASS', code: response.status, data }
    } else {
      console.log(`${colors.red}  ❌ FAIL${colors.reset} (${response.status})`)
      console.log(`${colors.yellow}  Error:${colors.reset}`, data)
      return { name, status: 'FAIL', code: response.status, error: data }
    }
  } catch (error) {
    console.log(`${colors.red}  ❌ ERROR${colors.reset}`)
    console.log(`${colors.yellow}  Message:${colors.reset}`, error.message)
    return { name, status: 'ERROR', error: error.message }
  } finally {
    console.log('') // Empty line
  }
}

/**
 * Run all endpoint tests
 */
async function runTests() {
  console.log(`\n${colors.cyan}╔═══════════════════════════════════════════════════╗${colors.reset}`)
  console.log(`${colors.cyan}║   🧪 API Endpoint Testing - Migration Verification   ║${colors.reset}`)
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════╝${colors.reset}\n`)
  
  const results = []

  // 1. Health & Info Endpoints
  console.log(`${colors.blue}═══ Health & Info Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Health Check', `${TEST_BASE_URL}/api/health`))
  results.push(await testEndpoint('API Info', `${TEST_BASE_URL}/`))

  // 2. Gold API
  console.log(`${colors.blue}═══ Gold API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Gold Sources', `${TEST_BASE_URL}/api/gold/sources`))
  results.push(await testEndpoint('Latest Gold Prices', `${TEST_BASE_URL}/api/gold/latest?types=SJC_9999&limit=2`))
  results.push(await testEndpoint('Gold History', `${TEST_BASE_URL}/api/gold/history?type=SJC_9999&period=day`))

  // 3. Weather API
  console.log(`${colors.blue}═══ Weather API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Current Weather (Hanoi)', `${TEST_BASE_URL}/api/weather/current?city=Hanoi`))
  results.push(await testEndpoint('Weather Forecast (Coords)', `${TEST_BASE_URL}/api/weather/forecast?lat=21.0285&lon=105.8542`))

  // 4. Currency API
  console.log(`${colors.blue}═══ Currency API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Currency Rates', `${TEST_BASE_URL}/api/currency/rates`))
  results.push(await testEndpoint('Currency Convert', `${TEST_BASE_URL}/api/currency/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100, from: 'USD', to: 'VND' })
  }))

  // 5. Tools API
  console.log(`${colors.blue}═══ Tools API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Get All Tools', `${TEST_BASE_URL}/api/tools`))
  results.push(await testEndpoint('Get Tool by ID', `${TEST_BASE_URL}/api/tools/countdown`))

  // 6. Notes API
  console.log(`${colors.blue}═══ Notes API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Get All Notes', `${TEST_BASE_URL}/api/notes`))

  // 7. Events API
  console.log(`${colors.blue}═══ Events API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Get All Events', `${TEST_BASE_URL}/api/events`))

  // 8. Fashion API
  console.log(`${colors.blue}═══ Fashion API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Get All Outfits', `${TEST_BASE_URL}/api/fashion`))

  // 9. Feedback API
  console.log(`${colors.blue}═══ Feedback API Endpoints ═══${colors.reset}\n`)
  results.push(await testEndpoint('Get All Feedback', `${TEST_BASE_URL}/api/feedback`))

  // 10. Wishlist API (requires auth - will fail gracefully)
  console.log(`${colors.blue}═══ Wishlist API Endpoints (Auth Required) ═══${colors.reset}\n`)
  results.push(await testEndpoint('Get Wishlist (No Auth)', `${TEST_BASE_URL}/api/wishlist`))

  // Summary
  console.log(`\n${colors.cyan}╔═══════════════════════════════════════════════════╗${colors.reset}`)
  console.log(`${colors.cyan}║              📊 Test Results Summary                  ║${colors.reset}`)
  console.log(`${colors.cyan}╚═══════════════════════════════════════════════════╝${colors.reset}\n`)

  const passed = results.filter(r => r.status === 'PASS').length
  const failed = results.filter(r => r.status === 'FAIL').length
  const errors = results.filter(r => r.status === 'ERROR').length
  const total = results.length

  console.log(`${colors.green}✅ Passed:${colors.reset} ${passed}/${total}`)
  console.log(`${colors.red}❌ Failed:${colors.reset} ${failed}/${total}`)
  console.log(`${colors.yellow}⚠️  Errors:${colors.reset} ${errors}/${total}`)
  console.log(`${colors.blue}📈 Success Rate:${colors.reset} ${((passed/total)*100).toFixed(1)}%\n`)

  // Detailed failures
  if (failed > 0 || errors > 0) {
    console.log(`${colors.red}Failed/Error Details:${colors.reset}`)
    results.filter(r => r.status !== 'PASS').forEach(r => {
      console.log(`  - ${r.name}: ${r.error || r.code}`)
    })
    console.log('')
  }

  // Exit with appropriate code
  process.exit(failed + errors > 0 ? 1 : 0)
}

// Run tests
runTests().catch(error => {
  console.error(`${colors.red}Test suite failed:${colors.reset}`, error)
  process.exit(1)
})
