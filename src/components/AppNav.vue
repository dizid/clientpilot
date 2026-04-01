<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

async function handleLogout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/90 backdrop-blur-lg">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
      <router-link to="/dashboard" class="flex items-center gap-2 text-lg font-bold text-text no-underline">
        <i class="fa-solid fa-rocket text-brand"></i>
        <span>Client<span class="text-brand">Pilot</span></span>
      </router-link>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        <router-link to="/dashboard" class="text-sm text-text-2 hover:text-text no-underline transition">Dashboard</router-link>
        <router-link to="/generate" class="text-sm text-text-2 hover:text-text no-underline transition">Generate</router-link>
        <router-link to="/settings" class="text-sm text-text-2 hover:text-text no-underline transition">Settings</router-link>

        <div class="flex items-center gap-3 ml-4 pl-4 border-l border-border">
          <span v-if="auth.isPro" class="text-xs font-semibold px-2 py-1 rounded-full bg-brand/20 text-brand-light">
            {{ auth.plan === 'lifetime' ? 'LIFETIME' : 'PRO' }}
          </span>
          <span v-else class="text-xs font-semibold px-2 py-1 rounded-full bg-surface-2 text-text-3">FREE</span>

          <img v-if="auth.user?.photoURL" :src="auth.user.photoURL" class="w-8 h-8 rounded-full" alt="" />
          <button @click="handleLogout" class="text-xs text-text-3 hover:text-text cursor-pointer bg-transparent border-0">
            Sign out
          </button>
        </div>
      </div>

      <!-- Mobile toggle -->
      <button class="md:hidden text-text bg-transparent border-0 text-xl cursor-pointer" @click="mobileOpen = !mobileOpen">
        <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-border bg-surface p-4 flex flex-col gap-3">
      <router-link to="/dashboard" class="text-text-2 no-underline" @click="mobileOpen = false">Dashboard</router-link>
      <router-link to="/generate" class="text-text-2 no-underline" @click="mobileOpen = false">Generate</router-link>
      <router-link to="/settings" class="text-text-2 no-underline" @click="mobileOpen = false">Settings</router-link>
      <button @click="handleLogout" class="text-left text-text-3 bg-transparent border-0 cursor-pointer">Sign out</button>
    </div>
  </nav>
</template>
