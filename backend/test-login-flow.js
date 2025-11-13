const testLogin = async () => {
  const baseUrl = 'http://localhost:5000/api/auth'
  
  // First register
  console.log('1. Registering new user...')
  const registerRes = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `test${Date.now()}@example.com`,
      password: 'Test1234',
      name: 'Test User'
    })
  })
  
  const registerData = await registerRes.json()
  console.log('Register:', registerData.success ? '✅' : '❌', registerData.message || registerData.error?.message)
  
  if (registerData.success) {
    console.log('Token received:', registerData.data.token ? 'Yes' : 'No')
  }
  
  console.log('\n2. Testing login with existing user...')
  const loginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@kadong.com',
      password: 'KaDong2024!'
    })
  })
  
  const loginData = await loginRes.json()
  console.log('Login:', loginData.success ? '✅' : '❌', loginData.message || loginData.error?.message)
  console.log('Full response:', JSON.stringify(loginData, null, 2))
}

testLogin().catch(console.error)
