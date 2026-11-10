<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ToastContainer.vue'

const auth = useAuthStore()
const route = useRoute()
onMounted(() => auth.init())

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
