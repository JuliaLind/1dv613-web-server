import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import istanbul from 'vite-plugin-istanbul'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/slimdreams/' : '/',
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
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
  server: {
    host: '0.0.0.0' // added to work with wait-on and Cypress
  }
}))

