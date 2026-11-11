<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ToastContainer.vue'

const auth = useAuthStore()
const route = useRoute()
// Start Firebase's login check once the page has loaded and the browser is idle: public pages
// don't need it to show, and it costs phones ~140 KB of Google sign-in code. The login page
// and the router guard (pages behind login) start it right away instead.
onMounted(() => {
  const startAuth = () => void auth.init()
  const whenIdle = () =>
    'requestIdleCallback' in window ? window.requestIdleCallback(startAuth, { timeout: 2000 }) : setTimeout(startAuth, 200)
  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
})

// Public pages (the landing page, /login) don't need to wait for Firebase's login check;
// only pages behind login keep the spinner until it's done. The landing page used to show
// just a spinner until Firebase answered (~7 s on phones in Lighthouse).
const showPage = computed(
  () => !auth.loading || (route.matched.length > 0 && !route.meta.requiresAuth),
)
</script>

<template>
  <div class="min-h-screen bg-bg">
    <router-view v-if="showPage" />
    <div v-else class="min-h-screen flex items-center justify-center">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-brand"></i>
    </div>
    <ToastContainer />
  </div>
</template>
