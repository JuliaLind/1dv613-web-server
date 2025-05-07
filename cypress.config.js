import { defineConfig } from 'cypress'
import codeCoverageTask from '@cypress/code-coverage/task'

export default defineConfig({
  env: {
    VITE_AUTH_URL: "http://localhost:5053/api/v1",
    VITE_DATA_URL: "http://localhost:5054/api/v1"
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config)
      return config
    }
  },
})
