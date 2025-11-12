/**
 * Test API Endpoint for Shopee URL Extraction
 * This tests the actual API endpoint without killing the server
 */

async function testApiEndpoint() {
  console.log('🧪 Testing API Endpoint: POST /api/wishlist/extract-metadata\n')
  console.log('=' .repeat(80))
  
  const testUrl = 'https://shopee.vn/product/337138040/40512542180?'
  
  console.log(`\n📝 Testing URL: ${testUrl}`)
  console.log('-'.repeat(80))
  
  try {
    const response = await fetch('http://localhost:5000/api/wishlist/extract-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: testUrl })
    })
    
    const result = await response.json()
    
    console.log(`\n📊 Response Status: ${response.status}`)
    console.log(`📊 Response:`)
    console.log(JSON.stringify(result, null, 2))
    
    if (result.success && result.data) {
      console.log(`\n✅ API Test PASSED!`)
      console.log(`   Title: ${result.data.title}`)
      console.log(`   Price: ${result.data.price} ${result.data.currency}`)
      console.log(`   Origin: ${result.data.origin}`)
      console.log(`   Image: ${result.data.image ? 'Yes' : 'No'}`)
    } else {
      console.log(`\n❌ API Test FAILED!`)
    }
    
  } catch (error) {
    console.log(`\n❌ Error: ${error.message}`)
    console.log('⚠️  Make sure server is running on port 5000')
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 Test completed!\n')
}

// Run test
testApiEndpoint()
