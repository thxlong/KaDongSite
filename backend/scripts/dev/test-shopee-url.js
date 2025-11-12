/**
 * Test Shopee URL Extraction
 * Test script to verify Shopee URL metadata extraction
 */

import { extractMetadata } from '../../src/utils/urlExtractor.js'

const testUrls = [
  // Format 1: product-name-i.{shop_id}.{item_id}
  'https://shopee.vn/product-name-i.337138040.40512542180',
  
  // Format 2: product/{shop_id}/{item_id}
  'https://shopee.vn/product/337138040/40512542180?',
  'https://shopee.vn/product/337138040/40512542180',
]

async function testShopeeExtraction() {
  console.log('🧪 Testing Shopee URL Extraction\n')
  console.log('=' .repeat(80))
  
  for (const url of testUrls) {
    console.log(`\n📝 Testing URL: ${url}`)
    console.log('-'.repeat(80))
    
    try {
      const metadata = await extractMetadata(url)
      
      if (metadata) {
        console.log('✅ Extraction successful!')
        console.log(`   Title: ${metadata.title}`)
        console.log(`   Price: ${metadata.price} ${metadata.currency}`)
        console.log(`   Image: ${metadata.image ? metadata.image.substring(0, 60) + '...' : 'N/A'}`)
        console.log(`   Origin: ${metadata.origin}`)
        console.log(`   Description: ${metadata.description ? metadata.description.substring(0, 100) + '...' : 'N/A'}`)
      } else {
        console.log('❌ Extraction failed - returned null')
      }
    } catch (error) {
      console.log(`❌ Extraction error: ${error.message}`)
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 Test completed!\n')
}

// Run test
testShopeeExtraction()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
