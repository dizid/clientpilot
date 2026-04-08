<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useAuthStore } from '@/stores/auth'
import { track } from '@/lib/analytics'
import AppNav from '@/components/AppNav.vue'

const profileStore = useProfileStore()
const auth = useAuthStore()
const router = useRouter()
const step = ref(1)
const saving = ref(false)
const newSkill = ref('')
const newTech = ref('')
const showProjectForm = ref(false)

// Auto-save key
const STORAGE_KEY = 'clientpilot_onboarding_draft'

// Project form state
const newProject = ref({
  name: '',
  description: '',
  url: '',
  tech: '' as string,
  timeline: ''
})

// Step validation touched state — only show errors after user interacts
const touched = ref({
  headline: false,
  bio: false,
  experience_years: false,
  skills: false,
  tech_stack: false,
  projects: false,
  social_links: false,
  target_market: false,
  availability: false
})

// ─── Skill & tech suggestions ──────────────────────────────────────────────

const SKILL_SUGGESTIONS = [
  'AI Integration', 'API Development', 'Frontend', 'Backend',
  'DevOps', 'UI/UX', 'Mobile', 'E-commerce', 'Performance', 'Security'
]

const TECH_SUGGESTIONS = [
  'Vue 3', 'React', 'Node.js', 'TypeScript', 'Python',
  'PostgreSQL', 'AWS', 'Firebase', 'Docker', 'Next.js'
]

// ─── Validation ────────────────────────────────────────────────────────────

const errors = computed(() => {
  const p = profileStore.profile
  const sl = p.social_links as Record<string, string>
  const hasAnyLink = !!(sl.github || sl.linkedin || sl.twitter || sl.website || sl.devto)

  return {
    headline: p.headline.trim().length === 0
      ? 'Headline is required.'
      : p.headline.trim().length < 10
        ? 'At least 10 characters.'
        : '',
    bio: p.bio.trim().length === 0
      ? 'Bio is required.'
      : p.bio.trim().length < 30
        ? 'At least 30 characters — give a bit more detail.'
        : '',
    experience_years: p.experience_years < 0 || p.experience_years > 50
      ? 'Enter a value between 0 and 50.'
      : '',
    skills: p.skills.length < 2 ? 'Add at least 2 skills.' : '',
    tech_stack: p.tech_stack.length < 2 ? 'Add at least 2 technologies.' : '',
    projects: '', // optional — but nudge shown
    social_links: !hasAnyLink ? 'Add at least one link.' : '',
    target_market: p.target_market === '' ? 'Please select a target market.' : '',
    availability: p.availability === '' ? 'Please select your availability.' : ''
  }
})

const step1Valid = computed(() =>
  errors.value.headline === '' &&
  errors.value.bio === '' &&
  errors.value.experience_years === ''
)

const step2Valid = computed(() =>
  errors.value.skills === '' &&
  errors.value.tech_stack === ''
)

// Step 3: always passable (skip option shown)
const step3Valid = computed(() => true)

const step4Valid = computed(() =>
  errors.value.social_links === '' &&
  errors.value.target_market === '' &&
  errors.value.availability === ''
)

// ─── Completeness score ────────────────────────────────────────────────────

const completenessScore = computed(() => {
  const p = profileStore.profile
  const sl = p.social_links as Record<string, string>
  const checks = [
    p.headline.trim().length >= 10,
    p.bio.trim().length >= 30,
    p.skills.length >= 2,
    p.tech_stack.length >= 2,
    p.projects.length >= 1,
    !!(sl.github || sl.linkedin || sl.twitter || sl.website || sl.devto),
    p.target_market !== '',
    p.availability !== ''
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
})

// ─── Step completion status (for step indicators) ──────────────────────────

const stepComplete = computed(() => ({
  1: step1Valid.value,
  2: step2Valid.value,
  3: profileStore.profile.projects.length >= 1,
  4: step4Valid.value
}))

// ─── Estimated time remaining ──────────────────────────────────────────────

const timeRemaining = computed(() => {
  const mins = [5, 4, 2, 1]
  return mins[step.value - 1] ?? 1
})

// ─── Auto-save ─────────────────────────────────────────────────────────────

function saveDraft() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileStore.profile))
  } catch {
    // localStorage unavailable — ignore silently
  }
}

function loadDraft(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const draft = JSON.parse(raw)
    // Merge into profile (keep store shape intact)
    Object.assign(profileStore.profile, draft)
    return true
  } catch {
    return false
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

watch(
  () => JSON.stringify(profileStore.profile),
  () => { saveDraft() },
  { deep: true }
)

// ─── Mount ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  // Try draft first (faster, prevents data loss on refresh)
  const hadDraft = loadDraft()
  // Always also fetch from API to get the latest saved state
  await profileStore.load()
  // If we had no draft, the API data is already in the store
  // If we had a draft, the draft was overwritten by load() above — re-apply
  if (hadDraft) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const draft = JSON.parse(raw)
        Object.assign(profileStore.profile, draft)
      }
    } catch {
      // ignore
    }
  }
})

// ─── Skills & Tech ─────────────────────────────────────────────────────────

function addSkill(value?: string) {
  const s = (value ?? newSkill.value).trim()
  if (s && !profileStore.profile.skills.includes(s)) {
    profileStore.profile.skills.push(s)
    newSkill.value = ''
  }
  touched.value.skills = true
}

function removeSkill(i: number) {
  profileStore.profile.skills.splice(i, 1)
  touched.value.skills = true
}

function addTech(value?: string) {
  const t = (value ?? newTech.value).trim()
  if (t && !profileStore.profile.tech_stack.includes(t)) {
    profileStore.profile.tech_stack.push(t)
    newTech.value = ''
  }
  touched.value.tech_stack = true
}

function removeTech(i: number) {
  profileStore.profile.tech_stack.splice(i, 1)
  touched.value.tech_stack = true
}

// ─── Projects ──────────────────────────────────────────────────────────────

function addProject() {
  const p = newProject.value
  if (!p.name.trim()) return
  profileStore.profile.projects.push({
    name: p.name.trim(),
    description: p.description.trim(),
    url: p.url.trim(),
    tech: p.tech.split(',').map(t => t.trim()).filter(Boolean),
    timeline: p.timeline.trim()
  })
  newProject.value = { name: '', description: '', url: '', tech: '', timeline: '' }
  showProjectForm.value = false
  touched.value.projects = true
}

function removeProject(i: number) {
  profileStore.profile.projects.splice(i, 1)
}

// ─── Step navigation ───────────────────────────────────────────────────────

function touchStep1() {
  touched.value.headline = true
  touched.value.bio = true
  touched.value.experience_years = true
}

function touchStep2() {
  touched.value.skills = true
  touched.value.tech_stack = true
}

function touchStep4() {
  touched.value.social_links = true
  touched.value.target_market = true
  touched.value.availability = true
}

function goToStep(target: number) {
  // Allow jumping to any step (clickable indicators)
  step.value = target
}

function nextStep() {
  if (step.value === 1) {
    touchStep1()
    if (!step1Valid.value) return
    track('onboarding_step', { step: 2 })
    step.value = 2
  } else if (step.value === 2) {
    touchStep2()
    if (!step2Valid.value) return
    track('onboarding_step', { step: 3 })
    step.value = 3
  } else if (step.value === 3) {
    track('onboarding_step', { step: 4 })
    step.value = 4
  } else if (step.value === 4) {
    touchStep4()
    if (!step4Valid.value) return
    finish()
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}

// ─── Finish ────────────────────────────────────────────────────────────────

async function finish() {
  saving.value = true
  try {
    await profileStore.save()
    auth.markProfileSaved()
    track('onboarding_complete')
    clearDraft()
    router.push('/workspace')
  } finally {
    saving.value = false
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function fieldClass(hasError: boolean, isTouched: boolean): string {
  if (!isTouched) return 'border-border focus:border-brand'
  if (hasError) return 'border-danger focus:border-danger'
  return 'border-success focus:border-success'
}
</script>

<template>
  <AppNav />

  <div class="pt-20 pb-20 px-4 sm:px-6 max-w-2xl mx-auto">

    <!-- Quick Start Banner -->
    <div class="mb-6 bg-accent/10 border border-accent/30 rounded-xl px-4 py-3 flex items-start gap-3">
      <i class="fa-solid fa-bolt text-accent mt-0.5 shrink-0"></i>
      <div class="text-sm">
        <span class="font-semibold text-accent">Just want to try it?</span>
        <span class="text-text-2 ml-1">Fill in your headline, 3 skills, and 1 project — that's enough to generate content.</span>
      </div>
    </div>

    <!-- Header + Completeness -->
    <div class="text-center mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold mb-1">Set Up Your Profile</h1>
      <p class="text-text-2 text-sm">The more detail you provide, the better your generated content will be.</p>

      <!-- Completeness bar -->
      <div class="mt-5">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-text-3 font-medium">Profile completeness</span>
          <span class="text-xs font-bold" :class="completenessScore >= 75 ? 'text-success' : completenessScore >= 40 ? 'text-accent' : 'text-text-3'">
            {{ completenessScore }}%
          </span>
        </div>
        <div class="h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="completenessScore >= 75 ? 'bg-success' : completenessScore >= 40 ? 'bg-accent' : 'bg-brand'"
            :style="{ width: completenessScore + '%' }"
          ></div>
        </div>
      </div>

      <!-- Step indicators -->
      <div class="flex items-center justify-center gap-2 mt-5">
        <template v-for="s in 4" :key="s">
          <button
            @click="goToStep(s)"
            class="flex items-center gap-1.5 cursor-pointer border-0 bg-transparent p-0"
          >
            <div
              :class="[
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                step === s
                  ? 'bg-brand text-white ring-2 ring-brand/40'
                  : stepComplete[s as 1|2|3|4]
                    ? 'bg-success text-white'
                    : 'bg-surface-2 text-text-3'
              ]"
            >
              <i v-if="stepComplete[s as 1|2|3|4] && step !== s" class="fa-solid fa-check text-xs"></i>
              <span v-else>{{ s }}</span>
            </div>
          </button>
          <div
            v-if="s < 4"
            :class="['h-px w-8 sm:w-12 transition-colors duration-300', stepComplete[s as 1|2|3|4] ? 'bg-success/50' : 'bg-surface-3']"
          ></div>
        </template>
      </div>

      <!-- Step label + time -->
      <div class="mt-2 flex items-center justify-center gap-3">
        <span class="text-xs text-text-3">
          Step {{ step }} of 4 —
          <span class="font-medium text-text-2">
            {{ ['About You', 'Skills & Stack', 'Projects', 'Links & Market'][step - 1] }}
          </span>
        </span>
        <span class="text-xs text-text-3">
          <i class="fa-regular fa-clock mr-1"></i>~{{ timeRemaining }} min left
        </span>
      </div>
    </div>

    <!-- ──────────────────────────────────────────────────────────
         STEP 1: About You
    ─────────────────────────────────────────────────────────── -->
    <Transition name="slide" mode="out-in">
      <div v-if="step === 1" key="step1" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-5">
        <h2 class="text-lg font-semibold">About You</h2>

        <!-- Headline -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Professional Headline
            <span class="text-danger ml-0.5">*</span>
          </label>
          <div class="relative">
            <input
              v-model="profileStore.profile.headline"
              @blur="touched.headline = true"
              type="text"
              placeholder="Full-Stack Developer | Vue 3, Node.js &amp; AI Integration"
              :class="['w-full px-4 py-3 bg-surface-2 border rounded-lg text-text placeholder-text-3 focus:outline-none transition pr-10', fieldClass(errors.headline !== '', touched.headline)]"
            />
            <i
              v-if="touched.headline && errors.headline === ''"
              class="fa-solid fa-circle-check absolute right-3 top-1/2 -translate-y-1/2 text-success text-sm"
            ></i>
          </div>
          <p v-if="touched.headline && errors.headline" class="mt-1 text-xs text-danger">{{ errors.headline }}</p>
          <p v-else class="mt-1 text-xs text-text-3">{{ profileStore.profile.headline.length }}/100 chars · Be specific about your specialty</p>
        </div>

        <!-- Bio -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Short Bio
            <span class="text-danger ml-0.5">*</span>
          </label>
          <div class="relative">
            <textarea
              v-model="profileStore.profile.bio"
              @blur="touched.bio = true"
              rows="4"
              placeholder="I build fast, reliable web apps for startups. Shipped 15+ projects using Vue 3 and Node.js. I specialize in turning ideas into MVPs in 2-4 weeks."
              :class="['w-full px-4 py-3 bg-surface-2 border rounded-lg text-text placeholder-text-3 focus:outline-none transition resize-y', fieldClass(errors.bio !== '', touched.bio)]"
            ></textarea>
          </div>
          <div class="flex items-center justify-between mt-1">
            <p v-if="touched.bio && errors.bio" class="text-xs text-danger">{{ errors.bio }}</p>
            <p v-else class="text-xs text-text-3">{{ profileStore.profile.bio.length }}/500 chars · What do you do? Who do you help?</p>
            <i
              v-if="touched.bio && errors.bio === '' && profileStore.profile.bio.length > 0"
              class="fa-solid fa-circle-check text-success text-sm shrink-0 ml-2"
            ></i>
          </div>
        </div>

        <!-- Experience years -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Years of Experience
            <span class="text-danger ml-0.5">*</span>
          </label>
          <div class="flex items-center gap-3">
            <input
              v-model.number="profileStore.profile.experience_years"
              @blur="touched.experience_years = true"
              type="number"
              min="0"
              max="50"
              placeholder="5"
              :class="['w-28 px-4 py-3 bg-surface-2 border rounded-lg text-text placeholder-text-3 focus:outline-none transition', fieldClass(errors.experience_years !== '', touched.experience_years)]"
            />
            <span class="text-sm text-text-3">years</span>
            <i
              v-if="touched.experience_years && errors.experience_years === ''"
              class="fa-solid fa-circle-check text-success text-sm"
            ></i>
          </div>
          <p v-if="touched.experience_years && errors.experience_years" class="mt-1 text-xs text-danger">{{ errors.experience_years }}</p>
        </div>

        <button
          @click="nextStep"
          :disabled="touched.headline && touched.bio && touched.experience_years && !step1Valid"
          class="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next: Skills &amp; Stack <i class="fa-solid fa-arrow-right ml-2"></i>
        </button>
      </div>
    </Transition>

    <!-- ──────────────────────────────────────────────────────────
         STEP 2: Skills & Stack
    ─────────────────────────────────────────────────────────── -->
    <Transition name="slide" mode="out-in">
      <div v-if="step === 2" key="step2" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold">Skills &amp; Tech Stack</h2>

        <!-- Skills -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Skills
            <span class="text-danger ml-0.5">*</span>
            <span class="ml-2 text-xs text-text-3 font-normal">min. 2 required</span>
          </label>

          <!-- Suggestions -->
          <div class="flex flex-wrap gap-1.5 mb-2.5">
            <button
              v-for="suggestion in SKILL_SUGGESTIONS"
              :key="suggestion"
              @click="addSkill(suggestion)"
              :disabled="profileStore.profile.skills.includes(suggestion)"
              :class="[
                'px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer',
                profileStore.profile.skills.includes(suggestion)
                  ? 'bg-brand/20 text-brand-light border-brand/30 opacity-50 cursor-default'
                  : 'bg-surface-2 text-text-3 border-border hover:border-brand hover:text-brand-light'
              ]"
            >
              <i v-if="profileStore.profile.skills.includes(suggestion)" class="fa-solid fa-check mr-1 text-xs"></i>
              {{ suggestion }}
            </button>
          </div>

          <!-- Add input -->
          <div class="flex gap-2 mb-2">
            <input
              v-model="newSkill"
              @keyup.enter="addSkill()"
              @blur="touched.skills = true"
              type="text"
              placeholder="Or type a custom skill..."
              class="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 text-sm focus:outline-none focus:border-brand transition"
            />
            <button
              @click="addSkill()"
              class="px-4 py-2 bg-brand/20 text-brand-light rounded-lg cursor-pointer border-0 text-sm font-medium hover:bg-brand/30 transition"
            >
              Add
            </button>
          </div>

          <!-- Added skills -->
          <div class="flex flex-wrap gap-1.5 min-h-8">
            <span
              v-for="(skill, i) in profileStore.profile.skills"
              :key="i"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 text-brand-light rounded-full text-xs font-medium border border-brand/20"
            >
              {{ skill }}
              <button @click="removeSkill(i)" class="text-brand/50 hover:text-danger cursor-pointer bg-transparent border-0 text-xs leading-none">&times;</button>
            </span>
          </div>
          <p v-if="touched.skills && errors.skills" class="mt-1 text-xs text-danger">{{ errors.skills }}</p>
          <p v-else-if="profileStore.profile.skills.length >= 2" class="mt-1 text-xs text-success">
            <i class="fa-solid fa-circle-check mr-1"></i>{{ profileStore.profile.skills.length }} skills added
          </p>
        </div>

        <!-- Tech Stack -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Tech Stack
            <span class="text-danger ml-0.5">*</span>
            <span class="ml-2 text-xs text-text-3 font-normal">min. 2 required</span>
          </label>

          <!-- Suggestions -->
          <div class="flex flex-wrap gap-1.5 mb-2.5">
            <button
              v-for="suggestion in TECH_SUGGESTIONS"
              :key="suggestion"
              @click="addTech(suggestion)"
              :disabled="profileStore.profile.tech_stack.includes(suggestion)"
              :class="[
                'px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer',
                profileStore.profile.tech_stack.includes(suggestion)
                  ? 'bg-surface-3 text-text-2 border-border-2 opacity-50 cursor-default'
                  : 'bg-surface-2 text-text-3 border-border hover:border-brand-light hover:text-text'
              ]"
            >
              <i v-if="profileStore.profile.tech_stack.includes(suggestion)" class="fa-solid fa-check mr-1 text-xs"></i>
              {{ suggestion }}
            </button>
          </div>

          <!-- Add input -->
          <div class="flex gap-2 mb-2">
            <input
              v-model="newTech"
              @keyup.enter="addTech()"
              @blur="touched.tech_stack = true"
              type="text"
              placeholder="Or type a technology..."
              class="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 text-sm focus:outline-none focus:border-brand transition"
            />
            <button
              @click="addTech()"
              class="px-4 py-2 bg-brand/20 text-brand-light rounded-lg cursor-pointer border-0 text-sm font-medium hover:bg-brand/30 transition"
            >
              Add
            </button>
          </div>

          <!-- Added tech -->
          <div class="flex flex-wrap gap-1.5 min-h-8">
            <span
              v-for="(tech, i) in profileStore.profile.tech_stack"
              :key="i"
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 text-text-2 rounded-full text-xs font-medium border border-border"
            >
              {{ tech }}
              <button @click="removeTech(i)" class="text-text-3 hover:text-danger cursor-pointer bg-transparent border-0 text-xs leading-none">&times;</button>
            </span>
          </div>
          <p v-if="touched.tech_stack && errors.tech_stack" class="mt-1 text-xs text-danger">{{ errors.tech_stack }}</p>
          <p v-else-if="profileStore.profile.tech_stack.length >= 2" class="mt-1 text-xs text-success">
            <i class="fa-solid fa-circle-check mr-1"></i>{{ profileStore.profile.tech_stack.length }} technologies added
          </p>
        </div>

        <div class="flex gap-3">
          <button @click="prevStep" class="flex-1 py-3 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-lg cursor-pointer border-0 transition">
            <i class="fa-solid fa-arrow-left mr-2"></i>Back
          </button>
          <button
            @click="nextStep"
            class="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition"
          >
            Next: Projects <i class="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- ──────────────────────────────────────────────────────────
         STEP 3: Projects
    ─────────────────────────────────────────────────────────── -->
    <Transition name="slide" mode="out-in">
      <div v-if="step === 3" key="step3" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-5">
        <div>
          <h2 class="text-lg font-semibold">Your Best Projects</h2>
          <p class="text-sm text-text-2 mt-1">Add 2-4 projects that showcase your skills — these become case studies in your outreach.</p>
        </div>

        <!-- Existing projects as cards -->
        <div v-if="profileStore.profile.projects.length > 0" class="space-y-3">
          <div
            v-for="(project, i) in profileStore.profile.projects"
            :key="i"
            class="bg-surface-2 border border-border-2 rounded-xl p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <i class="fa-solid fa-folder text-brand text-xs shrink-0"></i>
                  <h4 class="font-semibold text-sm truncate">{{ project.name }}</h4>
                </div>
                <p v-if="project.description" class="text-xs text-text-3 line-clamp-2 mb-2">{{ project.description }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="t in project.tech"
                    :key="t"
                    class="px-2 py-0.5 bg-surface-3 text-text-3 rounded text-xs"
                  >{{ t }}</span>
                </div>
                <div class="flex items-center gap-3 mt-2">
                  <span v-if="project.timeline" class="text-xs text-text-3">
                    <i class="fa-regular fa-clock mr-1"></i>{{ project.timeline }}
                  </span>
                  <a
                    v-if="project.url"
                    :href="project.url"
                    target="_blank"
                    rel="noopener"
                    class="text-xs text-brand-light hover:underline"
                  >
                    <i class="fa-solid fa-arrow-up-right-from-square mr-1 text-xs"></i>View
                  </a>
                </div>
              </div>
              <button
                @click="removeProject(i)"
                class="text-text-3 hover:text-danger cursor-pointer bg-transparent border-0 p-1 shrink-0 text-lg leading-none"
              >&times;</button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="border border-dashed border-border-2 rounded-xl p-6 text-center">
          <i class="fa-regular fa-folder-open text-2xl text-text-3 mb-2"></i>
          <p class="text-sm text-text-3">No projects yet — add your first one below.</p>
        </div>

        <!-- Add project form toggle -->
        <div>
          <button
            v-if="!showProjectForm"
            @click="showProjectForm = true"
            class="w-full py-3 border border-dashed border-brand/40 text-brand-light text-sm font-medium rounded-xl hover:border-brand hover:bg-brand/5 transition cursor-pointer bg-transparent"
          >
            <i class="fa-solid fa-plus mr-2"></i>Add Project
          </button>

          <!-- Project form -->
          <div v-if="showProjectForm" class="border border-border-2 rounded-xl p-4 space-y-3 bg-surface-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-semibold text-text-2">New Project</span>
              <button @click="showProjectForm = false" class="text-text-3 hover:text-text cursor-pointer bg-transparent border-0 text-lg leading-none">&times;</button>
            </div>

            <input
              v-model="newProject.name"
              type="text"
              placeholder="Project name (e.g. E-commerce Dashboard)"
              class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition"
            />

            <textarea
              v-model="newProject.description"
              rows="2"
              placeholder="What does it do? What problem does it solve? (e.g. Inventory management SaaS that reduced manual work by 80%)"
              class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition resize-y"
            ></textarea>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <input
                  v-model="newProject.url"
                  type="url"
                  placeholder="Live URL (optional)"
                  class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition"
                />
                <p class="mt-1 text-xs text-text-3">
                  <i class="fa-solid fa-link-slash mr-1 opacity-50"></i>Import from URL — coming soon
                </p>
              </div>
              <input
                v-model="newProject.timeline"
                type="text"
                placeholder="Timeline (e.g. 3 weeks)"
                class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition"
              />
            </div>

            <input
              v-model="newProject.tech"
              type="text"
              placeholder="Tech stack — comma separated (e.g. Vue 3, Node.js, PostgreSQL)"
              class="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand transition"
            />

            <div class="flex gap-2 pt-1">
              <button
                @click="showProjectForm = false"
                class="px-4 py-2 bg-surface-3 text-text-2 rounded-lg cursor-pointer border-0 text-sm hover:bg-surface-2 transition"
              >
                Cancel
              </button>
              <button
                @click="addProject"
                :disabled="!newProject.name.trim()"
                class="px-5 py-2 bg-success/20 text-success rounded-lg cursor-pointer border-0 text-sm font-medium hover:bg-success/30 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i class="fa-solid fa-plus mr-1"></i>Add Project
              </button>
            </div>
          </div>
        </div>

        <!-- Skip note -->
        <p class="text-center text-xs text-text-3">
          <i class="fa-solid fa-info-circle mr-1"></i>
          Projects are optional for now — you can add them from your profile later.
        </p>

        <div class="flex gap-3">
          <button @click="prevStep" class="flex-1 py-3 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-lg cursor-pointer border-0 transition">
            <i class="fa-solid fa-arrow-left mr-2"></i>Back
          </button>
          <button
            @click="nextStep"
            class="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition"
          >
            Next: Links &amp; Market <i class="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- ──────────────────────────────────────────────────────────
         STEP 4: Links & Market
    ─────────────────────────────────────────────────────────── -->
    <Transition name="slide" mode="out-in">
      <div v-if="step === 4" key="step4" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-semibold">Links &amp; Target Market</h2>

        <!-- Social links -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Your Links
            <span class="text-danger ml-0.5">*</span>
            <span class="ml-2 text-xs text-text-3 font-normal">at least 1 required</span>
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2.5 focus-within:border-brand transition">
              <i class="fa-brands fa-github text-text-3 shrink-0"></i>
              <input
                v-model="(profileStore.profile.social_links as Record<string, string>).github"
                @blur="touched.social_links = true"
                type="url"
                placeholder="github.com/you"
                class="flex-1 bg-transparent text-text text-sm placeholder-text-3 focus:outline-none min-w-0"
              />
            </div>
            <div class="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2.5 focus-within:border-brand transition">
              <i class="fa-brands fa-linkedin text-text-3 shrink-0"></i>
              <input
                v-model="(profileStore.profile.social_links as Record<string, string>).linkedin"
                @blur="touched.social_links = true"
                type="url"
                placeholder="linkedin.com/in/you"
                class="flex-1 bg-transparent text-text text-sm placeholder-text-3 focus:outline-none min-w-0"
              />
            </div>
            <div class="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2.5 focus-within:border-brand transition">
              <i class="fa-brands fa-x-twitter text-text-3 shrink-0"></i>
              <input
                v-model="(profileStore.profile.social_links as Record<string, string>).twitter"
                @blur="touched.social_links = true"
                type="url"
                placeholder="x.com/you"
                class="flex-1 bg-transparent text-text text-sm placeholder-text-3 focus:outline-none min-w-0"
              />
            </div>
            <div class="flex items-center gap-2 bg-surface-2 border border-border rounded-lg px-3 py-2.5 focus-within:border-brand transition">
              <i class="fa-solid fa-globe text-text-3 shrink-0"></i>
              <input
                v-model="(profileStore.profile.social_links as Record<string, string>).website"
                @blur="touched.social_links = true"
                type="url"
                placeholder="yoursite.com"
                class="flex-1 bg-transparent text-text text-sm placeholder-text-3 focus:outline-none min-w-0"
              />
            </div>
          </div>
          <p v-if="touched.social_links && errors.social_links" class="mt-1.5 text-xs text-danger">
            <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ errors.social_links }}
          </p>
          <p v-else-if="touched.social_links && !errors.social_links" class="mt-1.5 text-xs text-success">
            <i class="fa-solid fa-circle-check mr-1"></i>Link added
          </p>
        </div>

        <!-- Target Market -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Target Market
            <span class="text-danger ml-0.5">*</span>
          </label>
          <div class="relative">
            <select
              v-model="profileStore.profile.target_market"
              @blur="touched.target_market = true"
              :class="['w-full px-4 py-3 bg-surface-2 border rounded-lg text-text focus:outline-none transition appearance-none pr-9', fieldClass(errors.target_market !== '', touched.target_market)]"
            >
              <option value="">Select your target market</option>
              <option value="eu">Europe / EU</option>
              <option value="us">United States</option>
              <option value="global">Global / Remote</option>
              <option value="startups">Startups &amp; Indie</option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-text-3 text-xs pointer-events-none"></i>
          </div>
          <p v-if="touched.target_market && errors.target_market" class="mt-1 text-xs text-danger">{{ errors.target_market }}</p>
        </div>

        <!-- Availability -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Availability
            <span class="text-danger ml-0.5">*</span>
          </label>
          <div class="relative">
            <select
              v-model="profileStore.profile.availability"
              @blur="touched.availability = true"
              :class="['w-full px-4 py-3 bg-surface-2 border rounded-lg text-text focus:outline-none transition appearance-none pr-9', fieldClass(errors.availability !== '', touched.availability)]"
            >
              <option value="">Select availability</option>
              <option value="full-time">Full-time freelance</option>
              <option value="part-time">Part-time (15-20 hrs/week)</option>
              <option value="sprints">Project sprints (2-4 weeks)</option>
              <option value="flexible">Flexible</option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-text-3 text-xs pointer-events-none"></i>
          </div>
          <p v-if="touched.availability && errors.availability" class="mt-1 text-xs text-danger">{{ errors.availability }}</p>
        </div>

        <!-- Pricing Model (optional) -->
        <div>
          <label class="block text-sm font-medium text-text-2 mb-1.5">
            Pricing Model
            <span class="ml-2 text-xs text-text-3 font-normal">optional</span>
          </label>
          <div class="relative">
            <select
              v-model="profileStore.profile.pricing_model"
              class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:border-brand transition appearance-none pr-9"
            >
              <option value="">Select pricing model</option>
              <option value="hourly">Hourly</option>
              <option value="project">Project-based</option>
              <option value="retainer">Monthly retainer</option>
              <option value="mixed">Mixed</option>
            </select>
            <i class="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-text-3 text-xs pointer-events-none"></i>
          </div>
        </div>

        <div class="flex gap-3">
          <button @click="prevStep" class="flex-1 py-3 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-lg cursor-pointer border-0 transition">
            <i class="fa-solid fa-arrow-left mr-2"></i>Back
          </button>
          <button
            @click="nextStep"
            :disabled="saving"
            class="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-2"></i>
            {{ saving ? 'Saving...' : 'Save & Go to Workspace' }}
            <i v-if="!saving" class="fa-solid fa-rocket ml-2"></i>
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
/* Slide transition between steps */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
