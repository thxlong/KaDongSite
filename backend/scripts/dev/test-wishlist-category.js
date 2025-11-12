/**
 * Test Wishlist Category Enhancement
 * Verify that category can be null/empty
 */

async function testWishlistCategoryHandling() {
  console.log('🧪 Testing Wishlist Category Handling\n')
  console.log('=' .repeat(80))
  
  const BASE_URL = 'http://localhost:5000'
  const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'
  
  // Test 1: Create item with empty category
  console.log('\n📝 Test 1: Create item with empty category')
  console.log('-'.repeat(80))
  
  try {
    const response1 = await fetch(`${BASE_URL}/api/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        product_name: 'Test Product - No Category',
        product_url: 'https://example.com/test-product',
        category: null, // Explicitly null
        price: 100000,
        currency: 'VND'
      })
    })
    
    const result1 = await response1.json()
    
    if (result1.success) {
      console.log('✅ Test 1 PASSED: Item created with null category')
      console.log(`   Item ID: ${result1.data.id}`)
      console.log(`   Category: ${result1.data.category}`)
      
      // Clean up - delete the test item
      await fetch(`${BASE_URL}/api/wishlist/${result1.data.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: TEST_USER_ID })
      })
      console.log('   🗑️  Test item deleted')
    } else {
      console.log('❌ Test 1 FAILED:', result1.error)
    }
  } catch (error) {
    console.log('❌ Test 1 ERROR:', error.message)
  }
  
  // Test 2: Create item with empty string category
  console.log('\n📝 Test 2: Create item with empty string category')
  console.log('-'.repeat(80))
  
  try {
    const response2 = await fetch(`${BASE_URL}/api/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        product_name: 'Test Product - Empty Category',
        product_url: 'https://example.com/test-product-2',
        category: '', // Empty string
        price: 200000,
        currency: 'VND'
      })
    })
    
    const result2 = await response2.json()
    
    if (result2.success) {
      console.log('✅ Test 2 PASSED: Item created with empty category')
      console.log(`   Item ID: ${result2.data.id}`)
      console.log(`   Category: ${result2.data.category}`)
      
      // Clean up
      await fetch(`${BASE_URL}/api/wishlist/${result2.data.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: TEST_USER_ID })
      })
      console.log('   🗑️  Test item deleted')
    } else {
      console.log('❌ Test 2 FAILED:', result2.error)
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error.message)
  }
  
  // Test 3: Create item with valid category
  console.log('\n📝 Test 3: Create item with valid category')
  console.log('-'.repeat(80))
  
  try {
    const response3 = await fetch(`${BASE_URL}/api/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        product_name: 'Test Product - Electronics',
        product_url: 'https://example.com/test-product-3',
        category: 'Electronics',
        price: 300000,
        currency: 'VND'
      })
    })
    
    const result3 = await response3.json()
    
    if (result3.success && result3.data.category === 'Electronics') {
      console.log('✅ Test 3 PASSED: Item created with Electronics category')
      console.log(`   Item ID: ${result3.data.id}`)
      console.log(`   Category: ${result3.data.category}`)
      
      // Clean up
      await fetch(`${BASE_URL}/api/wishlist/${result3.data.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: TEST_USER_ID })
      })
      console.log('   🗑️  Test item deleted')
    } else {
      console.log('❌ Test 3 FAILED:', result3.error || 'Category mismatch')
    }
  } catch (error) {
    console.log('❌ Test 3 ERROR:', error.message)
  }
  
  // Test 4: Extract metadata from Shopee (should not have category in API response)
  console.log('\n📝 Test 4: Extract metadata from Shopee URL')
  console.log('-'.repeat(80))
  
  try {
    const response4 = await fetch(`${BASE_URL}/api/wishlist/extract-metadata`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://shopee.vn/product/337138040/40512542180'
      })
    })
    
    const result4 = await response4.json()
    
    if (result4.success) {
      console.log('✅ Test 4 PASSED: Metadata extracted')
      console.log(`   Title: ${result4.data.title}`)
      console.log(`   Price: ${result4.data.price} ${result4.data.currency}`)
      console.log(`   Category: ${result4.data.category || 'undefined (expected)'}`)
      
      if (!result4.data.category) {
        console.log('   ✅ Category is undefined/null as expected')
      }
    } else {
      console.log('❌ Test 4 FAILED:', result4.error)
    }
  } catch (error) {
    console.log('❌ Test 4 ERROR:', error.message)
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 Category handling tests completed!\n')
  console.log('📋 Summary:')
  console.log('   - Frontend default category: "" (empty string)')
  console.log('   - Backend accepts: null, "", or valid category name')
  console.log('   - API metadata: category is optional (undefined for Shopee)')
  console.log('   - User can select "-- Chọn danh mục --" to leave it empty\n')
}

// Run test
testWishlistCategoryHandling()
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
