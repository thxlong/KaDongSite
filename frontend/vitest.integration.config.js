import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/integration/**/*.test.{js,jsx}'],
    testTimeout: 30000,
    hookTimeout: 30000
  }
})
