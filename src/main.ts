import { createApp, createSSRApp } from 'vue'
import { createPinia } from 'pinia'
// Fonts and icons served from our own domain (were render-blocking stylesheets from
// Google Fonts and cdnjs, which also sent every visitor's IP to those servers).
// Same families, weights and Font Awesome version (6.5.1) as before.
// Font Awesome: only the icons the app uses, built by scripts/fa-subset.ts (Vite plugin)
// from the same 6.5.1 package; the full set was ~300 KB of fonts for ~55 icons.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './assets/fa-subset/fa-subset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { reloadOnStaleChunks } from './lib/stale-chunk-reload'

// The landing page is prerendered at build time (scripts/prerender.mjs) for crawlers that
// don't run JavaScript. When this HTML was prerendered for this exact path, hydrate it
// (reuse it) instead of rendering again; every other route gets the plain app shell.
const renderedFor = document.getElementById('app')?.dataset.ssgRoute
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const hydrate = renderedFor === path

const app = hydrate ? createSSRApp(App) : createApp(App)
app.use(createPinia())
app.use(router)
// Tabs still open from before a deploy: reload the target page instead of a dead tap
reloadOnStaleChunks(router)
if (hydrate) {
  // Hydration needs the route resolved first, so the first render matches the HTML.
  // Only public pages (landing, privacy, terms) are prerendered, so this never waits for a login check.
  router.isReady().then(() => app.mount('#app'))
} else {
  app.mount('#app')
}
