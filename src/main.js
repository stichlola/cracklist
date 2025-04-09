import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'

// Registra il service worker per la PWA
registerSW({ immediate: true })

createApp(App).mount('#app')