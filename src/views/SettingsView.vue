<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { useContentStore } from '@/stores/content'
import { createCheckout } from '@/lib/api'
import { track } from '@/lib/analytics'
import AppNav from '@/components/AppNav.vue'

const auth = useAuthStore()
const profileStore = useProfileStore()
const content = useContentStore()

onMounted(() => {
  profileStore.load()
  content.loadStats()
})

const profileCompleteness = computed(() => {
  const p = profileStore.profile
  const fields = [
    !!p.headline, !!p.bio, p.skills.length > 0, p.tech_stack.length > 0,
    p.projects.length > 0, !!(p.social_links?.github || p.social_links?.linkedin),
    !!p.target_market, !!p.availability
  ]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
})

async function handleUpgrade(priceId: string) {
  track('upgrade_click', { source: 'settings', price_id: priceId })
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

    <!-- Subscription & Usage -->
    <div class="bg-surface border border-border rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">Subscription & Usage</h2>
      <div class="flex items-center justify-between mb-4">
        <div>
          <span :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
            auth.isPro ? 'bg-brand/20 text-brand-light' : 'bg-surface-2 text-text-3'
          ]">
            {{ auth.plan === 'lifetime' ? 'Lifetime' : auth.plan === 'pro' ? 'Pro' : 'Free' }}
          </span>
        </div>
        <div v-if="!auth.isPro" class="flex gap-2">
          <button @click="handleUpgrade('price_1THLUl8gBja0qkMxP8KOwmfc')" class="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg cursor-pointer border-0 transition">
            Pro — $9/mo
          </button>
          <button @click="handleUpgrade('price_1THLUn8gBja0qkMxskIJvm36')" class="px-4 py-2 bg-accent/20 text-accent-light text-sm font-semibold rounded-lg cursor-pointer border border-accent/30 transition">
            Lifetime — $69
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-surface-2 rounded-lg p-3 text-center">
          <p class="text-xl font-bold">{{ content.stats.total_pieces }}</p>
          <p class="text-xs text-text-3">Total Pieces</p>
        </div>
        <div class="bg-surface-2 rounded-lg p-3 text-center">
          <p class="text-xl font-bold">{{ content.stats.used_this_week }}</p>
          <p class="text-xs text-text-3">Used This Week</p>
        </div>
        <div class="bg-surface-2 rounded-lg p-3 text-center">
          <p class="text-xl font-bold">{{ content.stats.total_replies }}</p>
          <p class="text-xs text-text-3">Replies</p>
        </div>
        <div class="bg-surface-2 rounded-lg p-3 text-center">
          <p class="text-xl font-bold">{{ auth.generationsUsed }}</p>
          <p class="text-xs text-text-3">Generations</p>
        </div>
      </div>
    </div>

    <!-- Edit Profile -->
    <div class="bg-surface border border-border rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold">Profile</h2>
          <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="profileCompleteness === 100 ? 'bg-success/20 text-success-light' : 'bg-accent/20 text-accent-light'">
            {{ profileCompleteness }}% complete
          </span>
        </div>
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
