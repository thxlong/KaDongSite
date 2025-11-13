/**
 * Application Constants
 * Centralized configuration values for frontend
 */

// Administrator User UUID (Default user with full permissions)
// Email: admin@kadong.com | Password: admin123
// Created by seed script at backend/database/seeds/001_test_user.sql
export const ADMIN_USER_ID = '550e8400-e29b-41d4-a716-446655440000'

// Legacy constant for backward compatibility
export const TEST_USER_ID = ADMIN_USER_ID

// Guest User UUID (Read-only permissions)
// Email: guest@kadong.com | Password: guest123
export const GUEST_USER_ID = '550e8400-e29b-41d4-a716-446655440099'

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// TODO: In production, implement proper authentication
// TODO: Get user_id from JWT token or auth context
