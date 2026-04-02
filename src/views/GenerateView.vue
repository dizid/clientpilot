<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { generateContent, createCheckout } from '@/lib/api'
import AppNav from '@/components/AppNav.vue'

const auth = useAuthStore()
const router = useRouter()
const generating = ref<string | null>(null)
const error = ref('')
const completed = ref<string[]>([])

const contentTypes = [
  { type: 'linkedin_posts', icon: 'fa-brands fa-linkedin', title: 'LinkedIn Posts', time: '~30 sec' },
  { type: 'outreach_templates', icon: 'fa-solid fa-envelope-open-text', title: 'Outreach Templates', time: '~30 sec' },
  { type: 'devto_article', icon: 'fa-brands fa-dev', title: 'Dev.to Article', time: '~45 sec' },
  { type: 'platform_profile', icon: 'fa-solid fa-id-card', title: 'Platform Profiles', time: '~20 sec' },
  { type: 'portfolio_page', icon: 'fa-solid fa-file-code', title: 'Portfolio / Hire Page', time: '~30 sec' },
  { type: 'elevator_pitch', icon: 'fa-solid fa-bullhorn', title: 'Elevator Pitch & Bios', time: '~15 sec' },
]

async function generate(type: string) {
  if (!auth.canGenerate && !auth.isPro) {
    error.value = 'Free tier limit reached. Upgrade to Pro for unlimited generations.'
    return
  }

  generating.value = type
  error.value = ''
  try {
    await generateContent(type)
    completed.value.push(type)
    auth.refreshPlan()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Generation failed. Please try again.'
  } finally {
    generating.value = null
  }
}

async function generateAll() {
  for (const ct of contentTypes) {
    if (!completed.value.includes(ct.type)) {
      await generate(ct.type)
      if (error.value) break
    }
  }
}

async function handleUpgrade(priceId: string) {
  try {
    const { data } = await createCheckout(priceId)
    window.location.href = data.url
  } catch {
    error.value = 'Failed to start checkout. Please try again.'
  }
}

function viewAll() {
  router.push('/dashboard')
}
</script>

<template>
  <AppNav />
  <div class="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-wand-magic-sparkles text-brand mr-2"></i>
        Generate Content
      </h1>
      <p class="text-text-2">AI creates tailored content from your profile. Generate one at a time or all at once.</p>
    </div>

    <!-- Upgrade prompt for free users -->
    <div v-if="!auth.isPro && !auth.canGenerate" class="bg-surface border border-brand/30 rounded-2xl p-8 text-center mb-8">
      <h3 class="text-xl font-bold mb-2">Free Preview Used</h3>
      <p class="text-text-2 mb-6">Upgrade to unlock unlimited generations and full content export.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="handleUpgrade('price_1THLUl8gBja0qkMxP8KOwmfc')" class="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl cursor-pointer border-0 transition">
          Pro — $9/mo
        </button>
        <button @click="handleUpgrade('price_1THLUn8gBja0qkMxskIJvm36')" class="px-6 py-3 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold rounded-xl cursor-pointer border border-accent/30 transition">
          Lifetime — $69
        </button>
      </div>
    </div>

    <!-- Generate all button -->
    <div v-if="auth.canGenerate || auth.isPro" class="text-center mb-8">
      <button
        @click="generateAll"
        :disabled="!!generating"
        class="px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl cursor-pointer border-0 transition shadow-lg shadow-brand/20 disabled:opacity-50 text-base"
      >
        <i v-if="generating" class="fa-solid fa-spinner fa-spin mr-2"></i>
        <i v-else class="fa-solid fa-bolt mr-2"></i>
        {{ generating ? `Generating ${completed.length + 1} of ${contentTypes.length}...` : 'Generate All Content' }}
      </button>
      <p v-if="!generating" class="text-xs text-text-3 mt-2">Generates all 6 content types one by one. Takes 2-3 minutes.</p>
      <p v-if="generating" class="text-xs text-text-3 mt-2">{{ completed.length }} of {{ contentTypes.length }} done — please keep this tab open</p>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm text-center mb-6">
      {{ error }}
    </div>

    <!-- Content types list -->
    <div class="space-y-3">
      <div
        v-for="ct in contentTypes"
        :key="ct.type"
        class="bg-surface border border-border rounded-xl p-5 flex items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <div class="text-xl text-brand-light w-8 text-center">
            <i :class="ct.icon"></i>
          </div>
          <div>
            <h3 class="font-medium text-sm">{{ ct.title }}</h3>
            <p class="text-xs text-text-3">{{ ct.time }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span v-if="completed.includes(ct.type)" class="text-success-light text-sm font-medium">
            <i class="fa-solid fa-check mr-1"></i> Done
          </span>
          <button
            v-if="!completed.includes(ct.type) && (auth.canGenerate || auth.isPro)"
            @click="generate(ct.type)"
            :disabled="!!generating"
            class="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-text text-sm font-medium rounded-lg cursor-pointer border-0 transition disabled:opacity-50"
          >
            <i v-if="generating === ct.type" class="fa-solid fa-spinner fa-spin mr-1"></i>
            {{ generating === ct.type ? 'Working...' : 'Generate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View results -->
    <div v-if="completed.length > 0" class="text-center mt-8">
      <button @click="viewAll" class="px-6 py-3 bg-success/20 hover:bg-success/30 text-success-light font-semibold rounded-xl cursor-pointer border border-success/30 transition">
        <i class="fa-solid fa-eye mr-2"></i>
        View Generated Content
      </button>
    </div>
  </div>
</template>
