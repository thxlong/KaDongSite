const testAllEndpoints = async () => {
  const baseUrl = 'http://localhost:5000/api/auth'
  let token = null
  
  console.log('=== TESTING AUTHENTICATION SYSTEM ===\n')
  
  // 1. Register
  console.log('1. POST /api/auth/register')
  const email = `test${Date.now()}@example.com`
  const password = 'Test1234'
  
  const registerRes = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: 'Test User' })
  })
  const registerData = await registerRes.json()
  console.log('  Status:', registerRes.status)
  console.log('  Result:', registerData.success ? '✅ PASS' : '❌ FAIL')
  if (registerData.success) token = registerData.data.token
  console.log()
  
  //2. Login
  console.log('2. POST /api/auth/login')
  const loginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@kadong.com', password: 'KaDong2024!' })
  })
  const loginData = await loginRes.json()
  console.log('  Status:', loginRes.status)
  console.log('  Result:', loginData.success ? '✅ PASS' : '❌ FAIL')
  if (loginData.success) token = loginData.data.token
  console.log()
  
  // 3. Get Current User
  console.log('3. GET /api/auth/me')
  const meRes = await fetch(`${baseUrl}/me`, {
    headers: {  'Authorization': `Bearer ${token}` }
  })
  const meData = await meRes.json()
  console.log('  Status:', meRes.status)
  console.log('  Result:', meData.success ? '✅ PASS' : '❌ FAIL')
  if (meData.success) {
    console.log('  User:', meData.data.email, `(${meData.data.role})`)
  }
  console.log()
  
  // 4. Refresh Token
  console.log('4. POST /api/auth/refresh')
  const refreshRes = await fetch(`${baseUrl}/refresh`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const refreshData = await refreshRes.json()
  console.log('  Status:', refreshRes.status)
  console.log('  Result:', refreshData.success ? '✅ PASS' : '❌ FAIL')
  if (refreshData.success) token = refreshData.data.token
  console.log()
  
  // 5. Forgot Password
  console.log('5. POST /api/auth/forgot-password')
  const forgotRes = await fetch(`${baseUrl}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@kadong.com' })
  })
  const forgotData = await forgotRes.json()
  console.log('  Status:', forgotRes.status)
  console.log('  Result:', forgotData.success ? '✅ PASS' : '❌ FAIL')
  console.log()
  
  // 6. Logout
  console.log('6. POST /api/auth/logout')
  const logoutRes = await fetch(`${baseUrl}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const logoutData = await logoutRes.json()
  console.log('  Status:', logoutRes.status)
  console.log('  Result:', logoutData.success ? '✅ PASS' : '❌ FAIL')
  console.log()
  
  console.log('=== TEST SUMMARY ===')
  console.log('All core endpoints tested!')
}

testAllEndpoints().catch(console.error)
