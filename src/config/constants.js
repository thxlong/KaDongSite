/**
 * Application Constants
 * Centralized configuration values for frontend
 */

// Development Test User UUID
// This must match the TEST_USER_ID in backend/config/constants.js
// This user is created by the seed script at backend/database/seeds/001_test_user.sql
export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001'

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// TODO: In production, remove TEST_USER_ID and use proper authentication
// TODO: Get user_id from JWT token or auth context
