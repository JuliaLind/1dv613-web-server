import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import istanbul from 'vite-plugin-istanbul'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

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
    }),
    VitePWA({
      registerType: 'autoUpdate',  // Enable to automatically check for changes and update
      manifest: {
        name: 'SlimDreams',
        short_name: 'SlimDreams',
        theme_color: '#06b6d4',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/slimdreams/',
        scope: '/slimdreams/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0' // added to work with wait-on and Cypress
  },
  build: {
    sourcemap: true // this enables source maps for builds
  }
}))

