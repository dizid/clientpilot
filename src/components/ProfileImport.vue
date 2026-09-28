<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { importProfile, type ImportedProfile } from '@/lib/api'
import { track } from '@/lib/analytics'

/**
 * One-URL onboarding: user gives a portfolio URL / GitHub / pasted text,
 * the backend extracts a draft profile, the user reviews it on one screen
 * and answers the two questions a website can't (market + availability).
 *
 * Writes the draft into the profile store; the parent (OnboardingView) owns
 * validation + saving via the `save` event, and `manual` switches to the
 * classic 4-step form.
 */

defineProps<{ saving: boolean }>()
const emit = defineEmits<{ save: []; manual: [] }>()

const profileStore = useProfileStore()

const stage = ref<'input' | 'loading' | 'review'>('input')
const url = ref('')
const github = ref('')
const pastedText = ref('')
const showGithub = ref(false)
const showPaste = ref(false)
const importError = ref('')
const warnings = ref<string[]>([])
const sources = ref<string[]>([])

// ─── Options (values must match OnboardingView selects + backend) ──────────

const MARKET_OPTIONS = [
  { value: 'eu', label: 'Europe / EU' },
  { value: 'us', label: 'United States' },
  { value: 'global', label: 'Global / Remote' },
  { value: 'startups', label: 'Startups & Indie' }
]

const AVAILABILITY_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'sprints', label: 'Project sprints' },
  { value: 'flexible', label: 'Flexible' }
]

const PRICING_OPTIONS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'project', label: 'Per project' },
  { value: 'retainer', label: 'Retainer' },
  { value: 'mixed', label: 'Mixed' }
]

const SOCIAL_ICONS: Record<string, string> = {
  github: 'fa-brands fa-github',
  linkedin: 'fa-brands fa-linkedin',
  twitter: 'fa-brands fa-x-twitter',
  website: 'fa-solid fa-globe',
  devto: 'fa-brands fa-dev'
}

// ─── Loading messages (import takes ~5-15s) ────────────────────────────────

const LOADING_MESSAGES = [
  'Reading your site…',
  'Looking for your projects…',
  'Checking your GitHub…',
  'Picking out your skills and stack…',
  'Writing your headline and bio…'
]
const loadingIndex = ref(0)
let loadingTimer: ReturnType<typeof setInterval> | undefined

function startLoadingMessages() {
  loadingIndex.value = 0
  loadingTimer = setInterval(() => {
    loadingIndex.value = Math.min(loadingIndex.value + 1, LOADING_MESSAGES.length - 1)
  }, 2500)
}

function stopLoadingMessages() {
  if (loadingTimer) clearInterval(loadingTimer)
  loadingTimer = undefined
}

onUnmounted(stopLoadingMessages)

// ─── Import ────────────────────────────────────────────────────────────────

const canImport = computed(() =>
  url.value.trim() !== '' || github.value.trim() !== '' || pastedText.value.trim().length >= 50
)

async function runImport() {
  if (!canImport.value) return
  importError.value = ''
  stage.value = 'loading'
  startLoadingMessages()
  track('profile_import_start', {
    url: !!url.value.trim(), github: !!github.value.trim(), text: !!pastedText.value.trim()
  })

  try {
    const { data } = await importProfile({
      url: url.value.trim() || undefined,
      github: github.value.trim() || undefined,
      text: pastedText.value.trim() || undefined
    })
    mergeIntoProfile(data.profile)
    warnings.value = data.warnings
    sources.value = data.sources
    stage.value = 'review'
    track('profile_import_success', { sources: data.sources.length, projects: data.profile.projects.length })
  } catch (e: unknown) {
    const apiError = (e as { response?: { data?: { error?: string } } }).response?.data?.error
    importError.value = apiError || 'Import failed — please try again, or fill in the form manually.'
    stage.value = 'input'
    track('profile_import_failed')
  } finally {
    stopLoadingMessages()
  }
}

/** Imported values win when present; anything the import didn't find keeps what the user already had. */
function mergeIntoProfile(imported: ImportedProfile) {
  const p = profileStore.profile
  if (imported.headline) p.headline = imported.headline
  if (imported.bio) p.bio = imported.bio
  if (imported.skills.length) p.skills = imported.skills
  if (imported.tech_stack.length) p.tech_stack = imported.tech_stack
  if (imported.experience_years > 0) p.experience_years = imported.experience_years
  if (imported.projects.length) p.projects = imported.projects
  if (imported.target_market) p.target_market = imported.target_market
  p.social_links = { ...p.social_links, ...imported.social_links }
}

// ─── Review ────────────────────────────────────────────────────────────────

const foundLinks = computed(() =>
  Object.entries(profileStore.profile.social_links as Record<string, string>).filter(([, v]) => !!v)
)

const readyToSave = computed(() =>
  profileStore.profile.target_market !== '' && profileStore.profile.availability !== ''
)

function removeSkill(i: number) {
  profileStore.profile.skills.splice(i, 1)
}

function removeTech(i: number) {
  profileStore.profile.tech_stack.splice(i, 1)
}

function removeProject(i: number) {
  profileStore.profile.projects.splice(i, 1)
}

function startOver() {
  stage.value = 'input'
  warnings.value = []
}

function chipClass(selected: boolean): string {
  return selected
    ? 'bg-brand text-white border-brand'
    : 'bg-surface-2 text-text-2 border-border hover:border-brand/60'
}
</script>

<template>
  <!-- ──────────────────────────────────────────────────────────
       INPUT: one URL (plus optional GitHub / pasted text)
  ─────────────────────────────────────────────────────────── -->
  <div v-if="stage === 'input'" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-5">
    <div class="text-center">
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand/15 flex items-center justify-center">
        <i class="fa-solid fa-wand-magic-sparkles text-brand-light text-xl"></i>
      </div>
      <h2 class="text-xl font-bold">Skip the forms</h2>
      <p class="text-sm text-text-2 mt-1">Paste your portfolio link — we'll pull your projects, skills and bio from it. You just check it.</p>
    </div>

    <form @submit.prevent="runImport" class="space-y-3">
      <div class="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-3.5 focus-within:border-brand transition">
        <i class="fa-solid fa-globe text-text-3 shrink-0"></i>
        <input
          v-model="url"
          type="text"
          inputmode="url"
          autocomplete="url"
          autocapitalize="off"
          placeholder="yourportfolio.com"
          class="flex-1 bg-transparent text-text placeholder-text-3 focus:outline-none min-w-0 text-base"
        />
      </div>

      <!-- Optional extra sources -->
      <div v-if="showGithub" class="flex items-center gap-2 bg-surface-2 border border-border rounded-xl px-4 py-3 focus-within:border-brand transition">
        <i class="fa-brands fa-github text-text-3 shrink-0"></i>
        <input
          v-model="github"
          type="text"
          autocapitalize="off"
          placeholder="GitHub username"
          class="flex-1 bg-transparent text-text placeholder-text-3 focus:outline-none min-w-0 text-base"
        />
      </div>

      <textarea
        v-if="showPaste"
        v-model="pastedText"
        rows="5"
        placeholder="Paste your CV, LinkedIn 'About' section, or anything describing your work…"
        class="w-full px-4 py-3 bg-surface-2 border border-border rounded-xl text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition resize-y"
      ></textarea>

      <div class="flex flex-wrap gap-2 text-sm">
        <button
          v-if="!showGithub"
          type="button"
          @click="showGithub = true"
          class="px-3 py-1.5 rounded-full border border-border bg-transparent text-text-2 hover:border-brand/60 cursor-pointer transition"
        >
          <i class="fa-brands fa-github mr-1.5"></i>Add GitHub
        </button>
        <button
          v-if="!showPaste"
          type="button"
          @click="showPaste = true"
          class="px-3 py-1.5 rounded-full border border-border bg-transparent text-text-2 hover:border-brand/60 cursor-pointer transition"
        >
          <i class="fa-regular fa-paste mr-1.5"></i>Paste CV / LinkedIn
        </button>
      </div>

      <p v-if="importError" class="text-sm text-danger">
        <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ importError }}
      </p>

      <button
        type="submit"
        :disabled="!canImport"
        class="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl cursor-pointer border-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <i class="fa-solid fa-bolt mr-2"></i>Build my profile
      </button>
    </form>

    <p class="text-center text-xs text-text-3">
      No portfolio?
      <button
        type="button"
        @click="emit('manual')"
        class="text-brand-light hover:underline bg-transparent border-0 p-0 cursor-pointer text-xs"
      >Fill in the form manually</button>
    </p>
  </div>

  <!-- ──────────────────────────────────────────────────────────
       LOADING
  ─────────────────────────────────────────────────────────── -->
  <div v-else-if="stage === 'loading'" class="bg-surface border border-border rounded-2xl p-10 text-center" aria-live="polite">
    <i class="fa-solid fa-spinner fa-spin text-3xl text-brand-light mb-4"></i>
    <p class="font-semibold">{{ LOADING_MESSAGES[loadingIndex] }}</p>
    <p class="text-xs text-text-3 mt-2">Usually takes 5–15 seconds</p>
  </div>

  <!-- ──────────────────────────────────────────────────────────
       REVIEW: everything prefilled, two quick taps left
  ─────────────────────────────────────────────────────────── -->
  <div v-else class="space-y-4">
    <div class="bg-success/10 border border-success/30 rounded-xl px-4 py-3 text-sm">
      <p class="font-semibold text-success">
        <i class="fa-solid fa-circle-check mr-1.5"></i>Here's what we found — look right?
      </p>
      <p class="text-xs text-text-3 mt-1 break-words">Read from: {{ sources.join(' · ') }}</p>
    </div>

    <div v-for="w in warnings" :key="w" class="bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 text-xs text-text-2">
      <i class="fa-solid fa-circle-info text-accent mr-1.5"></i>{{ w }}
    </div>

    <!-- The two things a website can't tell us -->
    <div class="bg-surface border border-brand/40 rounded-2xl p-5 space-y-4">
      <h3 class="font-semibold">Two quick taps</h3>

      <div>
        <p class="text-sm text-text-2 mb-2">Who do you want as clients? <span class="text-danger">*</span></p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="o in MARKET_OPTIONS"
            :key="o.value"
            type="button"
            @click="profileStore.profile.target_market = o.value"
            :class="['px-3.5 py-2 rounded-full border text-sm cursor-pointer transition', chipClass(profileStore.profile.target_market === o.value)]"
          >{{ o.label }}</button>
        </div>
      </div>

      <div>
        <p class="text-sm text-text-2 mb-2">How available are you? <span class="text-danger">*</span></p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="o in AVAILABILITY_OPTIONS"
            :key="o.value"
            type="button"
            @click="profileStore.profile.availability = o.value"
            :class="['px-3.5 py-2 rounded-full border text-sm cursor-pointer transition', chipClass(profileStore.profile.availability === o.value)]"
          >{{ o.label }}</button>
        </div>
      </div>

      <div>
        <p class="text-sm text-text-2 mb-2">How do you charge? <span class="text-xs text-text-3">optional</span></p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="o in PRICING_OPTIONS"
            :key="o.value"
            type="button"
            @click="profileStore.profile.pricing_model = profileStore.profile.pricing_model === o.value ? '' : o.value"
            :class="['px-3.5 py-2 rounded-full border text-sm cursor-pointer transition', chipClass(profileStore.profile.pricing_model === o.value)]"
          >{{ o.label }}</button>
        </div>
      </div>
    </div>

    <!-- Prefilled profile (lightly editable) -->
    <div class="bg-surface border border-border rounded-2xl p-5 space-y-5">
      <div>
        <label class="block text-xs font-medium text-text-3 uppercase tracking-wide mb-1.5">Headline</label>
        <input
          v-model="profileStore.profile.headline"
          type="text"
          class="w-full px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-brand transition"
        />
      </div>

      <div>
        <label class="block text-xs font-medium text-text-3 uppercase tracking-wide mb-1.5">Bio</label>
        <textarea
          v-model="profileStore.profile.bio"
          rows="4"
          class="w-full px-3 py-2.5 bg-surface-2 border border-border rounded-lg text-text text-sm focus:outline-none focus:border-brand transition resize-y"
        ></textarea>
      </div>

      <div v-if="profileStore.profile.skills.length">
        <p class="text-xs font-medium text-text-3 uppercase tracking-wide mb-2">Skills</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(s, i) in profileStore.profile.skills"
            :key="s"
            class="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 bg-brand/15 text-brand-light rounded-full text-xs"
          >
            {{ s }}
            <button @click="removeSkill(i)" :aria-label="`Remove ${s}`" class="px-1 bg-transparent border-0 text-current opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
          </span>
        </div>
      </div>

      <div v-if="profileStore.profile.tech_stack.length">
        <p class="text-xs font-medium text-text-3 uppercase tracking-wide mb-2">Tech stack</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(t, i) in profileStore.profile.tech_stack"
            :key="t"
            class="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 bg-surface-3 text-text-2 rounded-full text-xs"
          >
            {{ t }}
            <button @click="removeTech(i)" :aria-label="`Remove ${t}`" class="px-1 bg-transparent border-0 text-current opacity-60 hover:opacity-100 cursor-pointer">&times;</button>
          </span>
        </div>
      </div>

      <div v-if="profileStore.profile.projects.length">
        <p class="text-xs font-medium text-text-3 uppercase tracking-wide mb-2">Projects</p>
        <div class="space-y-2">
          <div
            v-for="(project, i) in profileStore.profile.projects"
            :key="project.name"
            class="bg-surface-2 border border-border-2 rounded-xl p-3 flex items-start justify-between gap-3"
          >
            <div class="min-w-0">
              <p class="font-semibold text-sm truncate">{{ project.name }}</p>
              <p v-if="project.description" class="text-xs text-text-3 line-clamp-2 mt-0.5">{{ project.description }}</p>
              <p v-if="project.tech.length" class="text-xs text-text-3 mt-1 truncate">{{ project.tech.join(' · ') }}</p>
            </div>
            <button
              @click="removeProject(i)"
              :aria-label="`Remove ${project.name}`"
              class="text-text-3 hover:text-danger cursor-pointer bg-transparent border-0 p-1 shrink-0 text-lg leading-none"
            >&times;</button>
          </div>
        </div>
      </div>

      <div v-if="foundLinks.length">
        <p class="text-xs font-medium text-text-3 uppercase tracking-wide mb-2">Links</p>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="[key, href] in foundLinks"
            :key="key"
            :href="href"
            target="_blank"
            rel="noopener"
            :title="href"
            class="text-text-2 hover:text-brand-light text-lg"
          ><i :class="SOCIAL_ICONS[key] ?? 'fa-solid fa-link'"></i></a>
        </div>
      </div>
    </div>

    <button
      @click="emit('save')"
      :disabled="!readyToSave || saving"
      class="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl cursor-pointer border-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-2"></i>
      {{ saving ? 'Saving...' : readyToSave ? 'Looks good — go to workspace' : 'Pick your market & availability above' }}
      <i v-if="!saving && readyToSave" class="fa-solid fa-rocket ml-2"></i>
    </button>

    <div class="flex items-center justify-center gap-4 text-xs">
      <button type="button" @click="emit('manual')" class="text-brand-light hover:underline bg-transparent border-0 p-0 cursor-pointer">
        Edit everything in detail
      </button>
      <span class="text-text-3">·</span>
      <button type="button" @click="startOver" class="text-text-3 hover:text-text-2 bg-transparent border-0 p-0 cursor-pointer">
        Try another source
      </button>
    </div>
  </div>
</template>
