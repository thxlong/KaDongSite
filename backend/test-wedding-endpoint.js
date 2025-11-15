/**
 * Test Wedding Endpoint
 * @description Test if wedding-urls endpoint exists and responds correctly
 */

import fetch from 'node-fetch'

const API_BASE = 'http://localhost:5000/api'
const USER_ID = '550e8400-e29b-41d4-a716-446655440000'

async function testWeddingEndpoint() {
  console.log('🧪 Testing Wedding Endpoint...\n')
  
  // Test 1: POST /wedding-urls (Create URL)
  console.log('📝 Test 1: POST /wedding-urls')
  try {
    const response = await fetch(`${API_BASE}/wedding-urls?user_id=${USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseUrl: 'https://test.example.com/invite' })
    })
    
    console.log(`   Status: ${response.status} ${response.statusText}`)
    
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))
    
    if (response.status === 404) {
      console.log('   ❌ ENDPOINT NOT FOUND!')
      console.log('   This means the wedding routes are NOT properly mounted in app.js')
    } else if (response.status === 201) {
      console.log('   ✅ Success - URL created')
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message)
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test 2: GET /wedding-urls/latest
  console.log('📖 Test 2: GET /wedding-urls/latest')
  try {
    const response = await fetch(`${API_BASE}/wedding-urls/latest?user_id=${USER_ID}`)
    
    console.log(`   Status: ${response.status} ${response.statusText}`)
    
    const data = await response.json()
    console.log('   Response:', JSON.stringify(data, null, 2))
    
    if (response.status === 404 && data.error?.code === 'ENDPOINT_NOT_FOUND') {
      console.log('   ❌ ENDPOINT NOT FOUND!')
    } else if (response.status === 404 && data.error?.code === 'NOT_FOUND') {
      console.log('   ✅ Endpoint exists - No URL saved yet')
    } else if (response.status === 200) {
      console.log('   ✅ Success - URL retrieved')
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message)
  }
  
  console.log('\n' + '='.repeat(60) + '\n')
  
  // Test 3: Check all available endpoints
  console.log('📋 Test 3: Check available API routes')
  try {
    const response = await fetch('http://localhost:5000/')
    const data = await response.json()
    
    console.log('   Available endpoints:')
    if (data.endpoints) {
      Object.entries(data.endpoints).forEach(([key, value]) => {
        console.log(`   - ${key}: ${value}`)
      })
    }
    
    // Check if wedding is mentioned
    const hasWedding = JSON.stringify(data).includes('wedding')
    console.log(`\n   Wedding mentioned in root: ${hasWedding ? '✅ YES' : '❌ NO'}`)
  } catch (error) {
    console.error('   ❌ Error:', error.message)
  }
}

testWeddingEndpoint().catch(console.error)
