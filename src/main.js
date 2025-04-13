import { createApp } from 'vue'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
// Font Awesome core
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import delle icone che ti servono
import { faStopwatch, faClock } from '@fortawesome/free-solid-svg-icons'

// Aggiungile alla libreria
library.add(faStopwatch, faClock)

// Registra il service worker per la PWA
registerSW({ immediate: true })


const app = createApp(App)

// Registra il componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')