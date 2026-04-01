<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { createCheckout } from '@/lib/api'
import AppNav from '@/components/AppNav.vue'

const auth = useAuthStore()
const profileStore = useProfileStore()

onMounted(() => profileStore.load())

async function handleUpgrade(priceId: string) {
  const { data } = await createCheckout(priceId)
  window.location.href = data.url
}
</script>

<template>
  <AppNav />
  <div class="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>

    <!-- Account -->
    <div class="bg-surface border border-border rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Account</h2>
      <div class="flex items-center gap-4">
        <img v-if="auth.user?.photoURL" :src="auth.user.photoURL" class="w-12 h-12 rounded-full" alt="" />
        <div>
          <p class="font-medium">{{ auth.user?.displayName }}</p>
          <p class="text-sm text-text-3">{{ auth.user?.email }}</p>
        </div>
      </div>
    </div>

    <!-- Subscription -->
    <div class="bg-surface border border-border rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Subscription</h2>
      <div class="flex items-center justify-between">
        <div>
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
            auth.isPro ? 'bg-brand/20 text-brand-light' : 'bg-surface-2 text-text-3'
          ]">
            {{ auth.plan === 'lifetime' ? 'Lifetime' : auth.plan === 'pro' ? 'Pro' : 'Free' }}
          </span>
          <p class="text-sm text-text-3 mt-2">Generations used: {{ auth.generationsUsed }}</p>
        </div>
        <div v-if="!auth.isPro" class="flex flex-col gap-2">
          <button @click="handleUpgrade('price_1THLUl8gBja0qkMxP8KOwmfc')" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg cursor-pointer border-0 transition">
            Pro — $9/mo
          </button>
          <button @click="handleUpgrade('price_1THLUn8gBja0qkMxskIJvm36')" class="px-4 py-2 bg-accent/20 text-accent-light text-sm font-semibold rounded-lg cursor-pointer border border-accent/30 transition">
            Lifetime — $69
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Profile -->
    <div class="bg-surface border border-border rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Profile</h2>
        <router-link to="/onboarding" class="text-sm text-brand hover:text-brand-light no-underline font-medium">
          <i class="fa-solid fa-pen mr-1"></i> Edit Profile
        </router-link>
      </div>
      <div v-if="profileStore.loaded && profileStore.profile.headline" class="space-y-3 text-sm">
        <p><span class="text-text-3">Headline:</span> {{ profileStore.profile.headline }}</p>
        <p><span class="text-text-3">Skills:</span> {{ profileStore.profile.skills.join(', ') || 'Not set' }}</p>
        <p><span class="text-text-3">Stack:</span> {{ profileStore.profile.tech_stack.join(', ') || 'Not set' }}</p>
        <p><span class="text-text-3">Projects:</span> {{ profileStore.profile.projects.length }} added</p>
      </div>
      <p v-else class="text-sm text-text-3">
        <router-link to="/onboarding" class="text-brand no-underline">Set up your profile</router-link> to start generating content.
      </p>
    </div>
  </div>
</template>
