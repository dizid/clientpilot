import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Fonts and icons served from our own domain (were render-blocking stylesheets from
// Google Fonts and cdnjs, which also sent every visitor's IP to those servers).
// Same families, weights and Font Awesome version (6.5.1) as before.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
