/**
 * Application Constants
 */

// Development Test User UUID
// This user is created by the seed script
export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
};

export const GOLD_TYPES = {
  SJC: 'sjc',
  PNJ: 'pnj',
  DOJI: 'doji',
  BTG: 'btg',
};

export const CURRENCY_CODES = {
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY',
  GBP: 'GBP',
  VND: 'VND',
};

export const WEDDING_INVITATION = {
  BASE_URL: process.env.WEDDING_BASE_URL || 'https://wedding.kadong.site',
  ENCODING_SALT: process.env.ENCODING_SALT || 'kadong-wedding-2024',
  INVITATION_TYPES: {
    STANDARD: 'standard',
    VIP: 'vip',
    FAMILY: 'family',
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 24 * 60 * 60, // 24 hours
};

export const ERROR_MESSAGES = {
  INTERNAL_ERROR: 'Internal server error',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  VALIDATION_ERROR: 'Validation error',
  DATABASE_ERROR: 'Database error',
};

export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  RETRIEVED: 'Resource retrieved successfully',
};

export default {
  TEST_USER_ID,
  HTTP_STATUS,
  USER_ROLES,
  GOLD_TYPES,
  CURRENCY_CODES,
  WEDDING_INVITATION,
  PAGINATION,
  CACHE_TTL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
