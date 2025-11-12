/**
 * Direct test for Shopee URL extractor
 */

import { extractMetadata } from './utils/urlExtractor.js'

const testUrl = 'https://shopee.vn/%C4%90i%E1%BB%87n-tho%E1%BA%A1i-Apple-iPhone-17-Pro-Max-256GB-i.88201679.27041370670'

console.log('Testing Shopee URL extraction...')
console.log('URL:', testUrl)
console.log('---')

extractMetadata(testUrl)
  .then(result => {
    console.log('✅ Success!')
    console.log('Result:', JSON.stringify(result, null, 2))
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  })
