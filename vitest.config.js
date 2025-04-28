import { fileURLToPath, URL } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [
    vue(),
    istanbul({
      include: 'src/**/*',
      exclude: ['node_modules', '**/__tests__/**'],
      extension: ['.js', '.vue'],
      cypress: true,
      requireEnv: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8', // use v8 (faster and better)
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{vue,js}'],
      exclude: [
        'src/main.js',
        'src/colors.js',
        'src/router/index.js',
        'src/services/__tests__/helpers.js',
      ],
      all: true
    },
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
})
