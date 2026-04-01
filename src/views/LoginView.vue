<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')

async function handleGoogleLogin() {
  loading.value = true
  error.value = ''
  try {
    await auth.login()
    const redirect = (route.query.redirect as string) || '/onboarding'
    router.push(redirect)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Sign in failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <router-link to="/" class="inline-flex items-center gap-2 text-2xl font-bold no-underline text-text">
          <i class="fa-solid fa-rocket text-brand"></i>
          Client<span class="text-brand">Pilot</span>
        </router-link>
        <p class="text-text-2 mt-2">Sign in to start getting clients</p>
      </div>

      <!-- Card -->
      <div class="bg-surface border border-border rounded-2xl p-8">
        <button
          @click="handleGoogleLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl cursor-pointer border-0 transition text-base disabled:opacity-50"
        >
          <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <i v-else class="fa-solid fa-spinner fa-spin"></i>
          {{ loading ? 'Signing in...' : 'Continue with Google' }}
        </button>

        <div v-if="error" class="mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm text-center">
          {{ error }}
        </div>

        <p class="text-xs text-text-3 text-center mt-6">
          By signing in you agree to our terms. We only use your email and name.
        </p>
      </div>
    </div>
  </div>
</template>
