import { createApp, createSSRApp } from 'vue'
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

// The landing page is prerendered at build time (scripts/prerender.mjs) for crawlers that
// don't run JavaScript. When this HTML was prerendered for this exact path, hydrate it
// (reuse it) instead of rendering again; every other route gets the plain app shell.
const renderedFor = document.getElementById('app')?.dataset.ssgRoute
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const hydrate = renderedFor === path

const app = hydrate ? createSSRApp(App) : createApp(App)
app.use(createPinia())
app.use(router)
if (hydrate) {
  // Hydration needs the route resolved first, so the first render matches the HTML.
  // Only the public landing page is prerendered, so this never waits for a login check.
  router.isReady().then(() => app.mount('#app'))
} else {
  app.mount('#app')
}
