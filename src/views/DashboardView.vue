<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getGenerations, type Generation } from '@/lib/api'
import AppNav from '@/components/AppNav.vue'

const auth = useAuthStore()
const router = useRouter()
const generations = ref<Generation[]>([])
const loading = ref(true)

const contentTypes = [
  { type: 'linkedin_posts', icon: 'fa-brands fa-linkedin', title: 'LinkedIn Posts', desc: '10 posts to schedule 3x/week', color: 'text-blue-400' },
  { type: 'outreach_templates', icon: 'fa-solid fa-envelope-open-text', title: 'Outreach Templates', desc: '7 templates for cold & warm outreach', color: 'text-amber-400' },
  { type: 'devto_article', icon: 'fa-brands fa-dev', title: 'Dev.to Article', desc: 'Full case study article from your projects', color: 'text-green-400' },
  { type: 'platform_profile', icon: 'fa-solid fa-id-card', title: 'Platform Profiles', desc: 'For Toptal, freelance.nl, Arc.dev, etc.', color: 'text-purple-400' },
  { type: 'portfolio_page', icon: 'fa-solid fa-file-code', title: 'Portfolio / Hire Page', desc: 'Complete landing page content', color: 'text-pink-400' },
  { type: 'elevator_pitch', icon: 'fa-solid fa-bullhorn', title: 'Elevator Pitch & Bios', desc: 'Twitter bio, email signature, GitHub README', color: 'text-cyan-400' },
]

onMounted(async () => {
  try {
    const { data } = await getGenerations()
    generations.value = data.generations
  } catch {
    // No generations yet
  }
  loading.value = false
})

function hasGeneration(type: string) {
  return generations.value.some(g => g.type === type)
}

function viewContent(type: string) {
  router.push(`/content/${type}`)
}
</script>

<template>
  <AppNav />
  <div class="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
      <div>
        <h1 class="text-3xl font-bold mb-1">Dashboard</h1>
        <p class="text-text-2">Your AI-generated content for landing clients.</p>
      </div>
      <router-link to="/generate" class="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl no-underline transition">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        Generate Content
      </router-link>
    </div>

    <!-- Plan banner (free) -->
    <div v-if="!auth.isPro" class="bg-brand/10 border border-brand/20 rounded-xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="font-semibold text-brand-light mb-1">Upgrade to Pro</h3>
        <p class="text-sm text-text-2">Free tier: 1 preview generation. Upgrade for unlimited content and full export.</p>
      </div>
      <router-link to="/#pricing" class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg no-underline transition text-sm whitespace-nowrap">
        View Plans
      </router-link>
    </div>

    <!-- Content grid -->
    <div v-if="loading" class="text-center py-20 text-text-3">
      <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ct in contentTypes"
        :key="ct.type"
        class="bg-surface border border-border rounded-xl p-6 hover:border-brand/30 transition cursor-pointer group"
        @click="hasGeneration(ct.type) ? viewContent(ct.type) : router.push('/generate')"
      >
        <div class="flex items-start justify-between mb-4">
          <div :class="['text-2xl', ct.color]">
            <i :class="ct.icon"></i>
          </div>
          <span v-if="hasGeneration(ct.type)" class="text-xs font-medium px-2 py-1 bg-success/20 text-success-light rounded-full">
            Ready
          </span>
          <span v-else class="text-xs font-medium px-2 py-1 bg-surface-2 text-text-3 rounded-full">
            Not generated
          </span>
        </div>
        <h3 class="font-semibold mb-1 group-hover:text-brand-light transition">{{ ct.title }}</h3>
        <p class="text-sm text-text-3">{{ ct.desc }}</p>
      </div>
    </div>
  </div>
</template>
