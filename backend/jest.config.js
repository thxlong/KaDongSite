export default {
  // Test environment
  testEnvironment: 'node',
  
  // Module resolution
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  
  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    'utils/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // Setup files - comment out for now to avoid ES module issues
  // setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.js'],
  
  // Timeouts
  testTimeout: 10000,
  
  // Verbose output for debugging
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Transform ES modules - use node experimental loader
  transform: {},
  
  // Coverage directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],
  
  // Force exit after tests
  forceExit: true,
  
  // Detect open handles
  detectOpenHandles: true
};
