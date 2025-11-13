/**
 * Test Fixtures - Reusable test data
 */

import { randomUUID } from 'crypto'

export const fixtures = {
  // Valid note data
  validNote: () => ({
    title: 'Test Note ' + Date.now(),
    content: 'This is test content',
    color: 'pink',
    user_id: '00000000-0000-0000-0000-000000000001',
  }),
  
  // Invalid note (missing required fields)
  invalidNote: () => ({
    content: 'Content without title',
  }),
  
  // Valid event data
  validEvent: () => ({
    title: 'Test Event',
    target_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    description: 'Test event description',
    color_theme: 'blue',
    user_id: '00000000-0000-0000-0000-000000000001',
  }),
  
  // Valid user data
  validUser: () => ({
    email: `test${Date.now()}@example.com`,
    name: 'Test User',
    password: 'Password123!',
  }),
  
  // Test authentication token
  authToken: () => 'Bearer test-token-placeholder',
  
  // Test user ID (admin)
  adminUserId: () => '00000000-0000-0000-0000-000000000001',
  
  // Generate random UUID
  uuid: () => randomUUID(),
}
