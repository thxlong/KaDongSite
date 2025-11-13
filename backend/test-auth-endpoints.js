#!/usr/bin/env node

/**
 * Test auth endpoints
 */

const testAuth = async () => {
  const baseUrl = 'http://localhost:5000/api/auth'
  
  // Test 1: Register
  console.log('Testing POST /api/auth/register...')
  try {
    const registerRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testapi@example.com',
        password: 'Test1234',
        name: 'Test API User'
      })
    })
    
    const registerData = await registerRes.json()
    console.log('Register Response:', JSON.stringify(registerData, null, 2))
    console.log('Status:', registerRes.status)
  } catch (error) {
    console.error('Register Error:', error.message)
  }
  
  console.log('\n---\n')
  
  // Test 2: Login
  console.log('Testing POST /api/auth/login...')
  try {
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@kadong.com',
        password: 'KaDong2024!'
      })
    })
    
    const loginData = await loginRes.json()
    console.log('Login Response:', JSON.stringify(loginData, null, 2))
    console.log('Status:', loginRes.status)
  } catch (error) {
    console.error('Login Error:', error.message)
  }
}

testAuth()
