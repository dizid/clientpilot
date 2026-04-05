<script setup lang="ts">
import { ref, watch } from 'vue'
import { getTargets, saveTarget } from '@/lib/api'
import type { TargetContext } from '@/lib/api'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', targetId?: string): void
  (e: 'skip'): void
}>()

// Existing targets
const targets = ref<TargetContext[]>([])
const selectedTargetId = ref<string | null>(null)
const loadingTargets = ref(false)

// New target form
const showNewForm = ref(false)
const newNiche = ref('')
const newPlatform = ref('')
const newPainPoint = ref('')
const newName = ref('')
const saving = ref(false)

const niches = ['SaaS Startups', 'E-commerce', 'Agencies', 'Consulting', 'Enterprise', 'Other']
const platforms = ['LinkedIn', 'Cold Email', 'Upwork', 'Twitter/X', 'Warm Referrals', 'Mixed']

// Load targets when modal opens
watch(() => props.modelValue, async (open) => {
  if (!open) return
  // Reset state
  selectedTargetId.value = null
  showNewForm.value = false
  newNiche.value = ''
  newPlatform.value = ''
  newPainPoint.value = ''
  newName.value = ''

  loadingTargets.value = true
  try {
    const { data } = await getTargets()
    targets.value = data.targets
    // Auto-show new form if no existing targets
    if (data.targets.length === 0) {
      showNewForm.value = true
    }
  } catch {
    showNewForm.value = true
  } finally {
    loadingTargets.value = false
  }
})

function close() {
  emit('update:modelValue', false)
}

function onSkip() {
  close()
  emit('skip')
}

async function onConfirm() {
  // If user selected an existing target
  if (selectedTargetId.value) {
    close()
    emit('confirm', selectedTargetId.value)
    return
  }

  // If user is creating a new target
  if (showNewForm.value) {
    if (!newNiche.value || !newPlatform.value || !newPainPoint.value) return

    saving.value = true
    try {
      const { data } = await saveTarget({
        name: newName.value || `${newNiche.value} via ${newPlatform.value}`,
        niche: newNiche.value,
        platform: newPlatform.value,
        pain_point: newPainPoint.value
      })
      close()
      emit('confirm', data.target.id)
    } catch {
      // emit confirm without target id as fallback
      close()
      emit('confirm', undefined)
    } finally {
      saving.value = false
    }
    return
  }

  // Neither selected nor creating — skip
  onSkip()
}

function selectTarget(id: string) {
  selectedTargetId.value = id
  showNewForm.value = false
}

function isNewFormValid() {
  return !!newNiche.value && !!newPlatform.value && !!newPainPoint.value.trim()
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            v-if="modelValue"
            class="bg-surface border border-border rounded-2xl p-6 sm:p-8 w-full max-w-lg mx-4"
          >
            <!-- Header -->
            <div class="mb-6">
              <h2 class="text-xl font-bold mb-1">Who Are You Targeting?</h2>
              <p class="text-sm text-text-3">Personalize your content for a specific client type.</p>
            </div>

            <!-- Loading -->
            <div v-if="loadingTargets" class="flex justify-center py-6">
              <i class="fa-solid fa-circle-notch fa-spin text-brand text-xl"></i>
            </div>

            <template v-else>
              <!-- Saved targets -->
              <div v-if="targets.length > 0" class="space-y-2 mb-4">
                <p class="text-xs font-semibold text-text-3 uppercase tracking-wider mb-2">Saved Targets</p>
                <button
                  v-for="t in targets"
                  :key="t.id"
                  @click="selectTarget(t.id!)"
                  class="w-full text-left p-3 rounded-xl border transition-colors cursor-pointer bg-transparent"
                  :class="selectedTargetId === t.id
                    ? 'border-brand bg-brand/10 text-brand-light'
                    : 'border-border hover:border-border-2 text-text-2'"
                >
                  <div class="font-medium text-sm">{{ t.name }}</div>
                  <div class="text-xs text-text-3 mt-0.5">{{ t.niche }} · {{ t.platform }}</div>
                  <div class="text-xs text-text-3 mt-1 line-clamp-1">{{ t.pain_point }}</div>
                </button>

                <!-- "Or create new" toggle -->
                <button
                  @click="showNewForm = !showNewForm; selectedTargetId = null"
                  class="w-full text-sm text-brand-light hover:text-brand-light/80 py-2 transition-colors cursor-pointer bg-transparent border-0"
                >
                  <i class="fa-solid fa-plus mr-1"></i>
                  {{ showNewForm ? 'Use a saved target instead' : 'Or create new target' }}
                </button>
              </div>

              <!-- New target form -->
              <div v-if="showNewForm" class="space-y-3">
                <p v-if="targets.length > 0" class="text-xs font-semibold text-text-3 uppercase tracking-wider">New Target</p>

                <!-- Niche -->
                <div>
                  <label class="text-xs text-text-3 mb-1 block">Niche</label>
                  <select
                    v-model="newNiche"
                    class="w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-brand transition-colors"
                  >
                    <option value="" disabled>Select niche...</option>
                    <option v-for="n in niches" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>

                <!-- Platform -->
                <div>
                  <label class="text-xs text-text-3 mb-1 block">Platform</label>
                  <select
                    v-model="newPlatform"
                    class="w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-brand transition-colors"
                  >
                    <option value="" disabled>Select platform...</option>
                    <option v-for="p in platforms" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>

                <!-- Pain point -->
                <div>
                  <label class="text-xs text-text-3 mb-1 block">Their Pain Point</label>
                  <input
                    v-model="newPainPoint"
                    type="text"
                    placeholder="One sentence: what problem do they have?"
                    class="w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2 text-sm text-text placeholder-text-3 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                <!-- Optional name -->
                <div>
                  <label class="text-xs text-text-3 mb-1 block">Save as (optional)</label>
                  <input
                    v-model="newName"
                    type="text"
                    placeholder="e.g. SaaS founders via LinkedIn"
                    class="w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2 text-sm text-text placeholder-text-3 focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
            </template>

            <!-- Actions -->
            <div class="mt-6 space-y-3">
              <button
                @click="onConfirm"
                :disabled="saving || loadingTargets || (showNewForm && !isNewFormValid()) || (!showNewForm && !selectedTargetId && targets.length > 0)"
                class="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-0"
              >
                <i v-if="saving" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                Generate with Target
              </button>

              <button
                @click="onSkip"
                class="w-full text-sm text-text-3 hover:text-text-2 transition-colors cursor-pointer bg-transparent border-0"
              >
                Skip — use general profile
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
