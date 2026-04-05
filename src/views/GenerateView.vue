<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { generateContent, createCheckout, saveTarget } from '@/lib/api'
import AppNav from '@/components/AppNav.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

// Generation state
const generating = ref<string | null>(null)
const error = ref('')
const completed = ref<string[]>([])
const failed = ref<string[]>([])
const cancelled = ref(false)

// Target modal state
const showTargetModal = ref(false)
const pendingAction = ref<'single' | 'all'>('single')
const pendingType = ref('')
const targetNiche = ref('')
const targetPlatform = ref('')
const targetPainPoint = ref('')
const savingTarget = ref(false)

const contentTypes = [
  { type: 'linkedin_posts', icon: 'fa-brands fa-linkedin', title: 'LinkedIn Posts', time: '~30 sec' },
  { type: 'outreach_templates', icon: 'fa-solid fa-envelope-open-text', title: 'Outreach Templates', time: '~30 sec' },
  { type: 'devto_article', icon: 'fa-brands fa-dev', title: 'Dev.to Article', time: '~45 sec' },
  { type: 'platform_profile', icon: 'fa-solid fa-id-card', title: 'Platform Profiles', time: '~20 sec' },
  { type: 'portfolio_page', icon: 'fa-solid fa-file-code', title: 'Portfolio / Hire Page', time: '~30 sec' },
  { type: 'elevator_pitch', icon: 'fa-solid fa-bullhorn', title: 'Elevator Pitch & Bios', time: '~15 sec' },
]

// Computed: seconds-per-type average used for time estimate
const AVG_SECONDS_PER_TYPE = 30

function getStatus(type: string): 'pending' | 'generating' | 'done' | 'failed' {
  if (completed.value.includes(type)) return 'done'
  if (failed.value.includes(type)) return 'failed'
  if (generating.value === type) return 'generating'
  return 'pending'
}

function estimatedSecondsRemaining(): number {
  const remaining = contentTypes.filter(
    ct => !completed.value.includes(ct.type) && generating.value !== ct.type
  ).length
  return remaining * AVG_SECONDS_PER_TYPE
}

// ── Modal triggers ──────────────────────────────────────────────────────────

function startGenerate(type: string) {
  pendingType.value = type
  pendingAction.value = 'single'
  showTargetModal.value = true
}

function startGenerateAll() {
  pendingAction.value = 'all'
  showTargetModal.value = true
}

function closeModal() {
  showTargetModal.value = false
}

async function confirmTarget() {
  let targetId: string | undefined

  if (targetNiche.value || targetPlatform.value || targetPainPoint.value) {
    savingTarget.value = true
    try {
      const { data } = await saveTarget({
        name: `${targetNiche.value || 'General'} via ${targetPlatform.value || 'Mixed'}`,
        niche: targetNiche.value || 'General',
        platform: targetPlatform.value || 'Mixed',
        pain_point: targetPainPoint.value || ''
      })
      targetId = data.target.id
    } catch {
      // proceed without target — non-fatal
    }
    savingTarget.value = false
  }

  showTargetModal.value = false

  if (pendingAction.value === 'all') {
    generateAll(targetId)
  } else {
    generate(pendingType.value, targetId)
  }
}

function skipTarget() {
  showTargetModal.value = false
  if (pendingAction.value === 'all') {
    generateAll()
  } else {
    generate(pendingType.value)
  }
}

// ── Core generation ─────────────────────────────────────────────────────────

async function generate(type: string, targetId?: string) {
  if (!auth.canGenerate && !auth.isPro) {
    error.value = 'Free tier limit reached. Upgrade to Pro for unlimited generations.'
    return
  }

  generating.value = type
  error.value = ''

  try {
    await generateContent(type, targetId)
    completed.value.push(type)
    auth.refreshPlan()
    const ct = contentTypes.find(c => c.type === type)
    toast.add(`${ct?.title ?? type} generated!`, 'success')
  } catch (e: unknown) {
    failed.value.push(type)
    error.value = e instanceof Error ? e.message : 'Generation failed. Please try again.'
  } finally {
    generating.value = null
  }
}

async function generateAll(targetId?: string) {
  cancelled.value = false

  for (const ct of contentTypes) {
    if (cancelled.value) break
    if (completed.value.includes(ct.type)) continue
    await generate(ct.type, targetId)
    // Stop on hard errors that aren't just "already done"
    if (error.value) break
  }
}

function cancelGeneration() {
  cancelled.value = true
}

// ── Upgrade ─────────────────────────────────────────────────────────────────

async function handleUpgrade(priceId: string) {
  try {
    const { data } = await createCheckout(priceId)
    window.location.href = data.url
  } catch {
    error.value = 'Failed to start checkout. Please try again.'
  }
}

function viewWorkspace() {
  router.push('/workspace')
}

// ── Escape key closes modal ──────────────────────────────────────────────────

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showTargetModal.value) closeModal()
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <AppNav />
  <div class="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold mb-2">
        <i class="fa-solid fa-wand-magic-sparkles text-brand mr-2"></i>
        Generate Content
      </h1>
      <p class="text-text-2">AI creates tailored content from your profile. Generate one at a time or all at once.</p>
    </div>

    <!-- Upgrade banner for free users who hit the limit -->
    <div v-if="!auth.isPro && !auth.canGenerate" class="bg-surface border border-brand/30 rounded-2xl p-8 text-center mb-8">
      <h3 class="text-xl font-bold mb-2">Free Preview Used</h3>
      <p class="text-text-2 mb-6">Upgrade to unlock unlimited generations and full content export.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="handleUpgrade('price_1THLUl8gBja0qkMxP8KOwmfc')"
          class="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl cursor-pointer border-0 transition"
        >
          Pro — $9/mo
        </button>
        <button
          @click="handleUpgrade('price_1THLUn8gBja0qkMxskIJvm36')"
          class="px-6 py-3 bg-accent/20 hover:bg-accent/30 text-accent-light font-semibold rounded-xl cursor-pointer border border-accent/30 transition"
        >
          Lifetime — $69
        </button>
      </div>
    </div>

    <!-- Generate All button -->
    <div v-if="auth.canGenerate || auth.isPro" class="text-center mb-8 space-y-2">
      <div class="flex items-center justify-center gap-3">
        <button
          @click="startGenerateAll"
          :disabled="!!generating"
          class="px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl cursor-pointer border-0 transition shadow-lg shadow-brand/20 disabled:opacity-50 text-base"
        >
          <i v-if="generating" class="fa-solid fa-spinner fa-spin mr-2"></i>
          <i v-else class="fa-solid fa-bolt mr-2"></i>
          {{ generating ? `Generating ${completed.length + 1} of ${contentTypes.length}...` : 'Generate All Content' }}
        </button>

        <!-- Cancel button during generateAll -->
        <button
          v-if="generating && pendingAction === 'all'"
          @click="cancelGeneration"
          class="px-4 py-4 bg-surface-2 hover:bg-surface-3 text-text-2 hover:text-text text-sm font-medium rounded-xl cursor-pointer border border-border transition"
        >
          <i class="fa-solid fa-xmark mr-1"></i> Cancel
        </button>
      </div>

      <!-- Progress hint -->
      <p v-if="!generating" class="text-xs text-text-3">
        Generates all 6 content types one by one — takes 2–3 minutes.
      </p>
      <p v-if="generating" class="text-xs text-text-3">
        {{ completed.length }} of {{ contentTypes.length }} done
        <span v-if="estimatedSecondsRemaining() > 0">
          — ~{{ Math.ceil(estimatedSecondsRemaining() / 60) }} min remaining — keep this tab open
        </span>
      </p>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="bg-danger/10 border border-danger/30 rounded-lg p-4 text-danger text-sm text-center mb-6"
    >
      {{ error }}
    </div>

    <!-- Content types — visual progress list -->
    <div class="space-y-3">
      <div
        v-for="ct in contentTypes"
        :key="ct.type"
        class="bg-surface border border-border rounded-xl p-5 flex items-center justify-between gap-4"
        :class="{
          'border-success/40 bg-success/5': getStatus(ct.type) === 'done',
          'border-danger/40 bg-danger/5': getStatus(ct.type) === 'failed',
          'border-brand/40': getStatus(ct.type) === 'generating',
        }"
      >
        <!-- Left: icon + name + time -->
        <div class="flex items-center gap-4 min-w-0">
          <div class="text-xl text-brand-light w-8 text-center shrink-0">
            <i :class="ct.icon"></i>
          </div>
          <div class="min-w-0">
            <h3 class="font-medium text-sm">{{ ct.title }}</h3>
            <p class="text-xs text-text-3">{{ ct.time }}</p>
          </div>
        </div>

        <!-- Right: status indicator + action button -->
        <div class="flex items-center gap-3 shrink-0">
          <!-- Status icon -->
          <span v-if="getStatus(ct.type) === 'generating'" class="text-brand-light">
            <i class="fa-solid fa-spinner fa-spin text-base"></i>
          </span>
          <span v-else-if="getStatus(ct.type) === 'done'" class="text-success-light text-sm font-medium">
            <i class="fa-solid fa-circle-check mr-1"></i> Done
          </span>
          <span v-else-if="getStatus(ct.type) === 'failed'" class="text-danger text-sm font-medium">
            <i class="fa-solid fa-circle-xmark mr-1"></i> Failed
          </span>
          <span v-else class="w-2 h-2 rounded-full bg-text-3 inline-block"></span>

          <!-- Generate button (only when not done) -->
          <button
            v-if="getStatus(ct.type) !== 'done' && (auth.canGenerate || auth.isPro)"
            @click="startGenerate(ct.type)"
            :disabled="!!generating"
            class="px-4 py-2 bg-surface-2 hover:bg-surface-3 text-text text-sm font-medium rounded-lg cursor-pointer border-0 transition disabled:opacity-50"
          >
            {{ getStatus(ct.type) === 'failed' ? 'Retry' : getStatus(ct.type) === 'generating' ? 'Working…' : 'Generate' }}
          </button>
        </div>
      </div>
    </div>

    <!-- View workspace button -->
    <div v-if="completed.length > 0" class="text-center mt-8">
      <button
        @click="viewWorkspace"
        class="px-6 py-3 bg-success/20 hover:bg-success/30 text-success-light font-semibold rounded-xl cursor-pointer border border-success/30 transition"
      >
        <i class="fa-solid fa-eye mr-2"></i>
        View Generated Content
      </button>
    </div>
  </div>

  <!-- ── Target Context Modal (inline Teleport) ──────────────────────────── -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showTargetModal"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl">

          <!-- Title -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-lg font-bold">Who Are You Targeting?</h2>
              <p class="text-text-3 text-sm mt-1">Tailor content for a specific audience or skip for general output.</p>
            </div>
            <button
              @click="closeModal"
              class="text-text-3 hover:text-text transition ml-4 mt-0.5 cursor-pointer border-0 bg-transparent p-1"
              aria-label="Close"
            >
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Fields -->
          <div class="space-y-4 mb-6">
            <!-- Niche -->
            <div>
              <label class="block text-sm font-medium text-text-2 mb-1.5">Niche</label>
              <select
                v-model="targetNiche"
                class="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-brand transition appearance-none cursor-pointer"
              >
                <option value="">— Select niche —</option>
                <option value="SaaS Startups">SaaS Startups</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Agencies">Agencies</option>
                <option value="Consulting">Consulting</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- Platform -->
            <div>
              <label class="block text-sm font-medium text-text-2 mb-1.5">Platform</label>
              <select
                v-model="targetPlatform"
                class="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-brand transition appearance-none cursor-pointer"
              >
                <option value="">— Select platform —</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Cold Email">Cold Email</option>
                <option value="Upwork">Upwork</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="Warm Referrals">Warm Referrals</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            <!-- Pain Point -->
            <div>
              <label class="block text-sm font-medium text-text-2 mb-1.5">Pain Point</label>
              <input
                v-model="targetPainPoint"
                type="text"
                placeholder="What problem do they have?"
                class="w-full bg-surface-2 border border-border rounded-lg px-3 py-2.5 text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3">
            <button
              @click="confirmTarget"
              :disabled="savingTarget"
              class="w-full px-5 py-3 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white font-semibold rounded-xl cursor-pointer border-0 transition"
            >
              <i v-if="savingTarget" class="fa-solid fa-spinner fa-spin mr-2"></i>
              <i v-else class="fa-solid fa-bullseye mr-2"></i>
              Generate with Target
            </button>
            <button
              @click="skipTarget"
              :disabled="savingTarget"
              class="w-full px-5 py-3 bg-transparent hover:bg-surface-2 text-text-2 hover:text-text text-sm font-medium rounded-xl cursor-pointer border border-border transition"
            >
              Skip — use general profile
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-surface,
.modal-leave-active .bg-surface {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-surface {
  transform: translateY(12px);
  opacity: 0;
}
</style>
