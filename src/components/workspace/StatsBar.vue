<script setup lang="ts">
import { useContentStore } from '@/stores/content'
import { useProfileStore } from '@/stores/profile'
import { computed } from 'vue'

const content = useContentStore()
const profile = useProfileStore()

const profileCompleteness = computed(() => {
  const p = profile.profile
  const fields = [
    !!p.headline,
    !!p.bio,
    p.skills.length > 0,
    p.tech_stack.length > 0,
    p.projects.length > 0,
    !!(p.social_links?.github || p.social_links?.linkedin),
    !!p.target_market,
    !!p.availability
  ]
  return Math.round((fields.filter(Boolean).length / fields.length) * 100)
})

const stats = [
  { key: 'total', icon: 'fa-solid fa-layer-group', label: 'Total Pieces' },
  { key: 'used', icon: 'fa-solid fa-paper-plane', label: 'Used This Week' },
  { key: 'replies', icon: 'fa-solid fa-reply', label: 'Replies Tracked' },
  { key: 'profile', icon: 'fa-solid fa-user-check', label: 'Profile' },
]

function getValue(key: string): string | number {
  switch (key) {
    case 'total': return content.stats.total_pieces
    case 'used': return content.stats.used_this_week
    case 'replies': return content.stats.total_replies
    case 'profile': return profileCompleteness.value + '%'
    default: return 0
  }
}
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    <div v-for="s in stats" :key="s.key" class="bg-surface border border-border rounded-xl p-4">
      <div class="flex items-center gap-2 text-text-3 text-xs mb-1">
        <i :class="s.icon"></i>
        <span>{{ s.label }}</span>
      </div>
      <div class="text-2xl font-bold">{{ getValue(s.key) }}</div>
    </div>
  </div>
</template>
