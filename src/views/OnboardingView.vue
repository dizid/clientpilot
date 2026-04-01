<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import AppNav from '@/components/AppNav.vue'

const profileStore = useProfileStore()
const router = useRouter()
const step = ref(1)
const saving = ref(false)
const newSkill = ref('')
const newTech = ref('')

// Project form
const newProject = ref({ name: '', description: '', url: '', tech: '' as string, timeline: '' })

onMounted(() => profileStore.load())

function addSkill() {
  const s = newSkill.value.trim()
  if (s && !profileStore.profile.skills.includes(s)) {
    profileStore.profile.skills.push(s)
    newSkill.value = ''
  }
}

function removeSkill(i: number) {
  profileStore.profile.skills.splice(i, 1)
}

function addTech() {
  const t = newTech.value.trim()
  if (t && !profileStore.profile.tech_stack.includes(t)) {
    profileStore.profile.tech_stack.push(t)
    newTech.value = ''
  }
}

function removeTech(i: number) {
  profileStore.profile.tech_stack.splice(i, 1)
}

function addProject() {
  const p = newProject.value
  if (p.name) {
    profileStore.profile.projects.push({
      name: p.name,
      description: p.description,
      url: p.url,
      tech: p.tech.split(',').map(t => t.trim()).filter(Boolean),
      timeline: p.timeline
    })
    newProject.value = { name: '', description: '', url: '', tech: '', timeline: '' }
  }
}

function removeProject(i: number) {
  profileStore.profile.projects.splice(i, 1)
}

async function finish() {
  saving.value = true
  await profileStore.save()
  saving.value = false
  router.push('/dashboard')
}
</script>

<template>
  <AppNav />
  <div class="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold mb-2">Set Up Your Profile</h1>
      <p class="text-text-2">The more detail you provide, the better your generated content will be.</p>
      <!-- Progress -->
      <div class="flex gap-2 justify-center mt-6">
        <div v-for="s in 4" :key="s" :class="['h-1.5 w-16 rounded-full transition', s <= step ? 'bg-brand' : 'bg-surface-3']"></div>
      </div>
    </div>

    <!-- Step 1: Basic Info -->
    <div v-if="step === 1" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
      <h2 class="text-xl font-semibold">About You</h2>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Professional Headline</label>
        <input v-model="profileStore.profile.headline" type="text" placeholder="e.g. AI Web Developer | Vue 3 & Claude API" class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 focus:outline-none focus:border-brand" />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Short Bio</label>
        <textarea v-model="profileStore.profile.bio" rows="3" placeholder="What do you do? Who do you help? What makes you different?" class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 focus:outline-none focus:border-brand resize-y"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Years of Experience</label>
        <input v-model.number="profileStore.profile.experience_years" type="number" min="0" max="50" placeholder="10" class="w-32 px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 focus:outline-none focus:border-brand" />
      </div>

      <button @click="step = 2" class="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition">
        Next: Skills & Stack <i class="fa-solid fa-arrow-right ml-2"></i>
      </button>
    </div>

    <!-- Step 2: Skills & Stack -->
    <div v-if="step === 2" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
      <h2 class="text-xl font-semibold">Skills & Tech Stack</h2>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Skills</label>
        <div class="flex gap-2 mb-2">
          <input v-model="newSkill" @keyup.enter="addSkill" type="text" placeholder="e.g. AI Integration" class="flex-1 px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 text-sm focus:outline-none focus:border-brand" />
          <button @click="addSkill" class="px-4 py-2 bg-brand/20 text-brand-light rounded-lg cursor-pointer border-0 text-sm font-medium hover:bg-brand/30 transition">Add</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="(skill, i) in profileStore.profile.skills" :key="i" class="inline-flex items-center gap-1.5 px-3 py-1 bg-brand/10 text-brand-light rounded-full text-xs font-medium">
            {{ skill }}
            <button @click="removeSkill(i)" class="text-brand/50 hover:text-brand cursor-pointer bg-transparent border-0 text-xs">&times;</button>
          </span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Tech Stack</label>
        <div class="flex gap-2 mb-2">
          <input v-model="newTech" @keyup.enter="addTech" type="text" placeholder="e.g. Vue 3" class="flex-1 px-4 py-2 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 text-sm focus:outline-none focus:border-brand" />
          <button @click="addTech" class="px-4 py-2 bg-brand/20 text-brand-light rounded-lg cursor-pointer border-0 text-sm font-medium hover:bg-brand/30 transition">Add</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="(tech, i) in profileStore.profile.tech_stack" :key="i" class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 text-text-2 rounded-full text-xs font-medium border border-border">
            {{ tech }}
            <button @click="removeTech(i)" class="text-text-3 hover:text-text cursor-pointer bg-transparent border-0 text-xs">&times;</button>
          </span>
        </div>
      </div>

      <div class="flex gap-3">
        <button @click="step = 1" class="flex-1 py-3 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-lg cursor-pointer border-0 transition">Back</button>
        <button @click="step = 3" class="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition">
          Next: Projects <i class="fa-solid fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Step 3: Projects -->
    <div v-if="step === 3" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
      <h2 class="text-xl font-semibold">Your Best Projects</h2>
      <p class="text-sm text-text-2">Add 2-4 projects that showcase your skills. These become case studies.</p>

      <!-- Existing projects -->
      <div v-for="(project, i) in profileStore.profile.projects" :key="i" class="bg-surface-2 rounded-lg p-4 flex items-start justify-between">
        <div>
          <h4 class="font-medium text-sm">{{ project.name }}</h4>
          <p class="text-xs text-text-3">{{ project.tech.join(', ') }}</p>
        </div>
        <button @click="removeProject(i)" class="text-text-3 hover:text-danger cursor-pointer bg-transparent border-0 text-sm">&times;</button>
      </div>

      <!-- Add project form -->
      <div class="space-y-3 border border-border-2 rounded-lg p-4">
        <input v-model="newProject.name" type="text" placeholder="Project name" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        <textarea v-model="newProject.description" rows="2" placeholder="What does it do? What problem does it solve?" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand resize-y"></textarea>
        <div class="grid grid-cols-2 gap-3">
          <input v-model="newProject.url" type="url" placeholder="Live URL" class="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
          <input v-model="newProject.timeline" type="text" placeholder="e.g. 2 weeks" class="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        </div>
        <input v-model="newProject.tech" type="text" placeholder="Tech stack (comma separated)" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        <button @click="addProject" class="px-4 py-2 bg-success/20 text-success-light rounded-lg cursor-pointer border-0 text-sm font-medium hover:bg-success/30 transition">
          <i class="fa-solid fa-plus mr-1"></i> Add Project
        </button>
      </div>

      <div class="flex gap-3">
        <button @click="step = 2" class="flex-1 py-3 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-lg cursor-pointer border-0 transition">Back</button>
        <button @click="step = 4" class="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition">
          Next: Links & Market <i class="fa-solid fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Step 4: Links & Market -->
    <div v-if="step === 4" class="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6">
      <h2 class="text-xl font-semibold">Links & Target Market</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-text-3 mb-1">GitHub</label>
          <input v-model="(profileStore.profile.social_links as Record<string, string>).github" type="url" placeholder="https://github.com/you" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        </div>
        <div>
          <label class="block text-xs font-medium text-text-3 mb-1">LinkedIn</label>
          <input v-model="(profileStore.profile.social_links as Record<string, string>).linkedin" type="url" placeholder="https://linkedin.com/in/you" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        </div>
        <div>
          <label class="block text-xs font-medium text-text-3 mb-1">Twitter/X</label>
          <input v-model="(profileStore.profile.social_links as Record<string, string>).twitter" type="url" placeholder="https://x.com/you" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        </div>
        <div>
          <label class="block text-xs font-medium text-text-3 mb-1">Portfolio / Website</label>
          <input v-model="(profileStore.profile.social_links as Record<string, string>).website" type="url" placeholder="https://yoursite.com" class="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm placeholder-text-3 focus:outline-none focus:border-brand" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Target Market</label>
        <select v-model="profileStore.profile.target_market" class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:border-brand appearance-none">
          <option value="">Select your target market</option>
          <option value="eu">Europe / EU</option>
          <option value="us">United States</option>
          <option value="global">Global / Remote</option>
          <option value="startups">Startups & Indie</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Availability</label>
        <select v-model="profileStore.profile.availability" class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:border-brand appearance-none">
          <option value="">Select availability</option>
          <option value="full-time">Full-time freelance</option>
          <option value="part-time">Part-time (15-20 hrs/week)</option>
          <option value="sprints">Project sprints (2-4 weeks)</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-2 mb-2">Pricing Model</label>
        <select v-model="profileStore.profile.pricing_model" class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text focus:outline-none focus:border-brand appearance-none">
          <option value="">Select pricing model</option>
          <option value="hourly">Hourly</option>
          <option value="project">Project-based</option>
          <option value="retainer">Monthly retainer</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div class="flex gap-3">
        <button @click="step = 3" class="flex-1 py-3 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-lg cursor-pointer border-0 transition">Back</button>
        <button @click="finish" :disabled="saving" class="flex-1 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg cursor-pointer border-0 transition disabled:opacity-50">
          <i v-if="saving" class="fa-solid fa-spinner fa-spin mr-2"></i>
          {{ saving ? 'Saving...' : 'Save & Go to Dashboard' }}
        </button>
      </div>
    </div>
  </div>
</template>
