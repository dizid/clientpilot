<script setup lang="ts">
import { useContentStore } from '@/stores/content'

const content = useContentStore()

const tabs = [
  { type: 'linkedin_posts', icon: 'fa-brands fa-linkedin', label: 'LinkedIn Posts', shortLabel: 'LinkedIn' },
  { type: 'outreach_templates', icon: 'fa-solid fa-envelope-open-text', label: 'Outreach', shortLabel: 'Outreach' },
  { type: 'devto_article', icon: 'fa-brands fa-dev', label: 'Dev.to Article', shortLabel: 'Dev.to' },
  { type: 'platform_profile', icon: 'fa-solid fa-id-card', label: 'Profiles', shortLabel: 'Profiles' },
  { type: 'portfolio_page', icon: 'fa-solid fa-file-code', label: 'Portfolio', shortLabel: 'Portfolio' },
  { type: 'elevator_pitch', icon: 'fa-solid fa-bullhorn', label: 'Pitch & Bios', shortLabel: 'Pitch' },
]
</script>

<template>
  <!-- Desktop sidebar: vertical list -->
  <aside class="hidden md:flex flex-col w-56 shrink-0 border-r border-border h-full overflow-y-auto py-4">
    <button
      v-for="tab in tabs"
      :key="tab.type"
      @click="content.activeTab = tab.type"
      class="relative flex items-center gap-3 px-4 py-3 text-sm transition-colors cursor-pointer w-full text-left bg-transparent border-0"
      :class="content.activeTab === tab.type
        ? 'bg-brand/10 text-brand-light border-r-2 border-brand'
        : 'text-text-2 hover:text-text hover:bg-surface-2/50'"
    >
      <i :class="tab.icon" class="w-4 text-center shrink-0"></i>
      <span class="flex-1">{{ tab.label }}</span>
      <!-- Count badge -->
      <span
        v-if="content.typeCounts[tab.type]"
        class="text-xs px-1.5 py-0.5 rounded-full"
        :class="content.activeTab === tab.type
          ? 'bg-brand/20 text-brand-light'
          : 'bg-surface-3 text-text-3'"
      >
        {{ content.typeCounts[tab.type] }}
      </span>
    </button>
  </aside>

  <!-- Mobile: horizontal pill tabs -->
  <div class="flex md:hidden overflow-x-auto gap-2 px-4 py-3 border-b border-border bg-surface scrollbar-none">
    <button
      v-for="tab in tabs"
      :key="tab.type"
      @click="content.activeTab = tab.type"
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap shrink-0 border transition-colors cursor-pointer bg-transparent"
      :class="content.activeTab === tab.type
        ? 'bg-brand/20 text-brand-light border-brand/40'
        : 'text-text-2 border-border hover:text-text hover:border-border-2'"
    >
      <i :class="tab.icon" class="text-xs"></i>
      <span>{{ tab.shortLabel }}</span>
      <span
        v-if="content.typeCounts[tab.type]"
        class="text-xs px-1 rounded-full"
        :class="content.activeTab === tab.type ? 'text-brand-light' : 'text-text-3'"
      >
        {{ content.typeCounts[tab.type] }}
      </span>
    </button>
  </div>
</template>
