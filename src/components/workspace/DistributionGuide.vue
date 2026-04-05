<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  contentType: string
  pieceCount: number
}>()

// Collapsible state — persisted per content type so each tab remembers independently
const storageKey = computed(() => `distribution-guide-collapsed-${props.contentType}`)

const isCollapsed = ref(false)

onMounted(() => {
  const stored = localStorage.getItem(storageKey.value)
  // Start expanded on first visit (stored is null), collapsed only if explicitly saved
  isCollapsed.value = stored === 'true'
})

function toggle() {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem(storageKey.value, String(isCollapsed.value))
}

// Guide content keyed by content type
interface GuideLink {
  label: string
  url: string
}

interface GuideContent {
  steps: string[]
  links: GuideLink[]
  tip: string
}

const guides: Record<string, GuideContent> = {
  linkedin_posts: {
    steps: [
      'Schedule 3 posts per week for maximum visibility',
      'Best times: Tue–Thu, 8–10am your audience\'s timezone',
    ],
    links: [
      { label: 'Open LinkedIn', url: 'https://www.linkedin.com/feed/' },
      { label: 'Schedule with Buffer', url: 'https://buffer.com/publish' },
    ],
    tip: 'Engage with 5 posts in your niche before publishing yours',
  },
  outreach_templates: {
    steps: [
      'Send 5–10 personalized messages per day',
      'Customize the [brackets] for each prospect',
    ],
    links: [
      { label: 'Find prospects on LinkedIn', url: 'https://www.linkedin.com/search/results/people/' },
      { label: 'Find startup leads on Crunchbase', url: 'https://www.crunchbase.com/discover/funding_rounds' },
    ],
    tip: 'Follow up after 3 days if no response',
  },
  devto_article: {
    steps: [
      'Publish on Dev.to for maximum developer reach',
      'Cross-post to Hashnode and Medium for wider distribution',
    ],
    links: [
      { label: 'Publish on Dev.to', url: 'https://dev.to/new' },
      { label: 'Publish on Hashnode', url: 'https://hashnode.com/draft' },
    ],
    tip: 'Add 3–4 relevant tags for discoverability',
  },
  platform_profile: {
    steps: [
      'Update all your freelance platform profiles',
    ],
    links: [
      { label: 'Toptal', url: 'https://www.toptal.com' },
      { label: 'Arc.dev', url: 'https://arc.dev' },
      { label: 'Freelancer.com', url: 'https://www.freelancer.com' },
      { label: 'Upwork', url: 'https://www.upwork.com/freelancers/settings/profile' },
    ],
    tip: 'Use the short bio for search results, full bio for your profile page',
  },
  portfolio_page: {
    steps: [
      'Add these sections to your personal website\'s /hire page',
      'Use the hero headline as your H1 for SEO',
    ],
    links: [],
    tip: 'Link to this page from all your platform profiles',
  },
  elevator_pitch: {
    steps: [
      'Practice your 30-second pitch out loud 3 times',
      'Update your Twitter bio, LinkedIn headline, and email signature now',
    ],
    links: [
      { label: 'Update Twitter bio', url: 'https://twitter.com/settings/profile' },
      { label: 'Update LinkedIn headline', url: 'https://www.linkedin.com/in/me/' },
    ],
    tip: 'Use the one-liner on every freelance platform',
  },
}

const guide = computed<GuideContent | null>(() => guides[props.contentType] ?? null)
</script>

<template>
  <!-- Only render when there is content and a guide exists for this type -->
  <div
    v-if="pieceCount > 0 && guide"
    class="bg-surface border border-border rounded-xl mt-6 overflow-hidden"
  >
    <!-- Header — clickable to collapse -->
    <button
      type="button"
      class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-2 transition-colors"
      @click="toggle"
    >
      <span class="font-semibold text-sm">
        <i class="fa-solid fa-compass text-brand mr-2"></i>
        What to Do Next
      </span>
      <i
        class="fa-solid fa-chevron-down text-text-3 text-xs transition-transform duration-200"
        :class="{ 'rotate-180': !isCollapsed }"
      ></i>
    </button>

    <!-- Collapsible body -->
    <div v-if="!isCollapsed" class="px-5 pb-5">
      <div class="border-t border-border mb-4"></div>

      <!-- Action steps -->
      <ul class="space-y-2 mb-4">
        <li
          v-for="(step, index) in guide.steps"
          :key="index"
          class="flex items-start gap-2 text-sm text-text-2"
        >
          <i class="fa-solid fa-circle-check text-success mt-0.5 shrink-0 text-xs"></i>
          {{ step }}
        </li>
      </ul>

      <!-- External links -->
      <div
        v-if="guide.links.length > 0"
        class="flex flex-wrap gap-2 mb-4"
      >
        <a
          v-for="link in guide.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 bg-surface-2 hover:bg-surface-3 rounded-lg px-3 py-2 text-sm text-text-2 hover:text-text no-underline transition-colors w-full sm:w-auto"
        >
          {{ link.label }}
          <i class="fa-solid fa-arrow-up-right-from-square text-text-3 text-xs"></i>
        </a>
      </div>

      <!-- Tip -->
      <p class="text-sm italic text-text-3">
        <i class="fa-solid fa-lightbulb mr-1.5"></i>
        {{ guide.tip }}
      </p>
    </div>
  </div>
</template>
