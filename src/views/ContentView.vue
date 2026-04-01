<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getGenerations, type Generation } from '@/lib/api'
import AppNav from '@/components/AppNav.vue'

const route = useRoute()
const generation = ref<Generation | null>(null)
const loading = ref(true)
const copied = ref(false)

const typeLabels: Record<string, string> = {
  linkedin_posts: 'LinkedIn Posts',
  outreach_templates: 'Outreach Templates',
  devto_article: 'Dev.to Article',
  platform_profile: 'Platform Profiles',
  portfolio_page: 'Portfolio / Hire Page',
  elevator_pitch: 'Elevator Pitch & Bios',
}

const typeIcons: Record<string, string> = {
  linkedin_posts: 'fa-brands fa-linkedin',
  outreach_templates: 'fa-solid fa-envelope-open-text',
  devto_article: 'fa-brands fa-dev',
  platform_profile: 'fa-solid fa-id-card',
  portfolio_page: 'fa-solid fa-file-code',
  elevator_pitch: 'fa-solid fa-bullhorn',
}

const contentType = computed(() => route.params.type as string)
const label = computed(() => typeLabels[contentType.value] || contentType.value)
const icon = computed(() => typeIcons[contentType.value] || 'fa-solid fa-file')

onMounted(async () => {
  try {
    const { data } = await getGenerations()
    generation.value = data.generations
      .filter(g => g.type === contentType.value)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null
  } catch {
    // No data
  }
  loading.value = false
})

function formatContent(content: Record<string, unknown>): string {
  if (typeof content === 'string') return content
  if (content.text) return content.text as string
  if (content.posts) return (content.posts as string[]).join('\n\n---\n\n')
  if (content.templates) return (content.templates as string[]).join('\n\n---\n\n')
  if (content.sections) return Object.entries(content.sections as Record<string, string>).map(([k, v]) => `## ${k}\n\n${v}`).join('\n\n')
  return JSON.stringify(content, null, 2)
}

async function copyAll() {
  if (!generation.value) return
  const text = formatContent(generation.value.content)
  await navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <AppNav />
  <div class="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-3">
        <router-link to="/dashboard" class="text-text-3 hover:text-text no-underline">
          <i class="fa-solid fa-arrow-left"></i>
        </router-link>
        <i :class="[icon, 'text-brand-light text-xl']"></i>
        <h1 class="text-2xl font-bold">{{ label }}</h1>
      </div>
      <button
        v-if="generation"
        @click="copyAll"
        class="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-text text-sm font-medium rounded-lg cursor-pointer border-0 transition"
      >
        <i :class="copied ? 'fa-solid fa-check text-success' : 'fa-solid fa-copy'" class="mr-1"></i>
        {{ copied ? 'Copied!' : 'Copy All' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-text-3">
      <i class="fa-solid fa-circle-notch fa-spin text-2xl"></i>
    </div>

    <div v-else-if="!generation" class="text-center py-20">
      <p class="text-text-3 mb-4">No content generated yet for this type.</p>
      <router-link to="/generate" class="text-brand hover:text-brand-light no-underline font-medium">
        <i class="fa-solid fa-wand-magic-sparkles mr-1"></i> Generate now
      </router-link>
    </div>

    <div v-else class="bg-surface border border-border rounded-2xl p-6 sm:p-8">
      <pre class="whitespace-pre-wrap text-sm text-text-2 leading-relaxed font-sans">{{ formatContent(generation.content) }}</pre>
    </div>
  </div>
</template>
