<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import AppNav from '@/components/AppNav.vue'
import StatsBar from '@/components/workspace/StatsBar.vue'
import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar.vue'
import ContentCard from '@/components/workspace/ContentCard.vue'
import DistributionGuide from '@/components/workspace/DistributionGuide.vue'

const content = useContentStore()
const profile = useProfileStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const tabLabels: Record<string, string> = {
  linkedin_posts: 'LinkedIn Posts',
  outreach_templates: 'Outreach Templates',
  devto_article: 'Dev.to Article',
  platform_profile: 'Platform Profiles',
  portfolio_page: 'Portfolio Page',
  elevator_pitch: 'Elevator Pitch & Bios',
}

onMounted(async () => {
  // Sync active tab from URL query param
  const tab = route.query.tab as string
  if (tab && tabLabels[tab]) {
    content.activeTab = tab
  }

  await Promise.all([
    content.loadPieces(),
    content.loadStats(),
    profile.load(),
  ])
})

// Keep URL in sync when active tab changes
watch(() => content.activeTab, (tab) => {
  router.replace({ query: { tab } })
})
</script>

<template>
  <AppNav />

  <!-- Full height layout after nav -->
  <div class="pt-16 min-h-screen bg-bg flex flex-col">

    <!-- Mobile tab strip (WorkspaceSidebar renders as a strip on mobile) -->
    <div class="md:hidden border-b border-border bg-surface overflow-x-auto">
      <WorkspaceSidebar mobile />
    </div>

    <!-- Desktop + mobile content area -->
    <div class="flex flex-1 max-w-6xl mx-auto w-full px-0 md:px-6 md:gap-6 md:py-8">

      <!-- Desktop sidebar -->
      <aside class="hidden md:block w-56 shrink-0">
        <WorkspaceSidebar />
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0 px-4 py-6 md:px-0 md:py-0">

        <!-- Stats bar -->
        <StatsBar class="mb-6" />

        <!-- Upgrade banner for free users -->
        <div
          v-if="!auth.isPro"
          class="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-6 flex items-center justify-between gap-4"
        >
          <div class="min-w-0">
            <p class="text-sm font-medium">Unlock unlimited content generation</p>
            <p class="text-xs text-text-3 mt-0.5">Upgrade to Pro for unlimited generations and full editing.</p>
          </div>
          <router-link
            to="/generate"
            class="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg no-underline transition shrink-0"
          >
            Upgrade
          </router-link>
        </div>

        <!-- Section header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold">
            {{ tabLabels[content.activeTab] ?? content.activeTab }}
          </h2>
          <span
            v-if="!content.loading"
            class="text-xs text-text-3 bg-surface-2 px-2.5 py-1 rounded-full"
          >
            {{ content.piecesByType.length }} {{ content.piecesByType.length === 1 ? 'piece' : 'pieces' }}
          </span>
        </div>

        <!-- Skeleton loading cards -->
        <div v-if="content.loading" class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-surface border border-border rounded-xl p-5 animate-pulse"
          >
            <div class="h-3 w-24 bg-surface-2 rounded mb-3"></div>
            <div class="h-4 w-full bg-surface-2 rounded mb-2"></div>
            <div class="h-4 w-3/4 bg-surface-2 rounded mb-2"></div>
            <div class="h-4 w-1/2 bg-surface-2 rounded"></div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="content.piecesByType.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <div class="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-2xl text-text-3 mb-4">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h3 class="text-lg font-semibold mb-2">
            No {{ tabLabels[content.activeTab] ?? content.activeTab }} yet
          </h3>
          <p class="text-text-3 text-sm mb-6">
            Generate your first batch of content to get started.
          </p>
          <router-link
            to="/generate"
            class="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl no-underline transition"
          >
            <i class="fa-solid fa-bolt mr-2"></i>
            Generate Content
          </router-link>
        </div>

        <!-- Content cards -->
        <div v-else class="space-y-4">
          <ContentCard
            v-for="piece in content.piecesByType"
            :key="piece.id"
            :piece="piece"
          />
        </div>

        <!-- Distribution guide — shown below cards when content exists -->
        <DistributionGuide
          :content-type="content.activeTab"
          :piece-count="content.piecesByType.length"
        />

      </main>
    </div>
  </div>
</template>
