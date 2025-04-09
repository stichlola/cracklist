import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Crack List',
        short_name: 'CrackList',
        start_url: '/index.html',
        display: 'standalone',
        background_color: "#F5E1C8",
        theme_color: '#42b983',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            "src": "/screenshots/screenshot-320x480.png",
            "sizes": "320x480",
            "type": "image/png"
          },
          {
            "src": "/screenshots/screenshot-1280x800.png",
            "sizes": "1280x800",
            "type": "image/png"
          },
          {
            "src": "/screenshots/screenshot-1920x1080.png",  // Added wide screenshot
            "sizes": "1920x1080",
            "form_factor": "wide",
            "type": "image/png"
          }
        ]
      },
   
      
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true
  }
})
