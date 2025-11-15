/**
 * Test Wedding URL Save Functionality
 * Manual test script to debug wedding URL saving
 */

const API_BASE = 'http://localhost:5000/api'
const USER_ID = '550e8400-e29b-41d4-a716-446655440000' // Admin user

async function testSaveUrl() {
  console.log('🧪 Testing Wedding URL Save...\n')

  const testUrl = 'https://wedding.example.com/invite'

  try {
    console.log('📤 Sending POST request to:', `${API_BASE}/wedding-urls?user_id=${USER_ID}`)
    console.log('📦 Payload:', { baseUrl: testUrl })

    const response = await fetch(`${API_BASE}/wedding-urls?user_id=${USER_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ baseUrl: testUrl })
    })

    console.log('\n📊 Response Status:', response.status, response.statusText)

    const data = await response.json()
    console.log('📊 Response Data:', JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('\n✅ SUCCESS! URL saved successfully')
      console.log('   ID:', data.data.id)
      console.log('   URL:', data.data.base_url)
      console.log('   Created:', data.data.created_at)
    } else {
      console.log('\n❌ FAILED!')
      console.log('   Error:', data.error?.message || data.message)
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
  }
}

async function testGetLatest() {
  console.log('\n\n🧪 Testing Get Latest URL...\n')

  try {
    console.log('📤 Sending GET request to:', `${API_BASE}/wedding-urls/latest?user_id=${USER_ID}`)

    const response = await fetch(`${API_BASE}/wedding-urls/latest?user_id=${USER_ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('\n📊 Response Status:', response.status, response.statusText)

    const data = await response.json()
    console.log('📊 Response Data:', JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('\n✅ SUCCESS! Got latest URL')
    } else if (response.status === 404) {
      console.log('\n⚠️ No URL found (this is normal if no URL was saved yet)')
    } else {
      console.log('\n❌ FAILED!')
      console.log('   Error:', data.error?.message || data.message)
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message)
  }
}

async function checkBackendHealth() {
  console.log('🏥 Checking backend health...\n')

  try {
    const response = await fetch(`${API_BASE}/health`)
    const data = await response.json()
    
    console.log('📊 Backend Status:', response.status)
    console.log('📊 Health Data:', JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('✅ Backend is running')
    } else {
      console.log('❌ Backend health check failed')
    }
  } catch (error) {
    console.error('❌ Cannot connect to backend:', error.message)
    console.log('\n⚠️ Make sure backend is running on http://localhost:5000')
    process.exit(1)
  }
}

// Run tests
(async () => {
  await checkBackendHealth()
  await testSaveUrl()
  await testGetLatest()
})()
