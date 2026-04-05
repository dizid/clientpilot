<script setup lang="ts">
import { ref } from 'vue'
import type { ContentPiece } from '@/lib/api'

const props = defineProps<{
  modelValue: boolean
  piece: ContentPiece
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'confirm', feedback: string): void
}>()

const feedback = ref('')

function close() {
  emit('update:modelValue', false)
}

function onConfirm() {
  emit('confirm', feedback.value)
  feedback.value = ''
  close()
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
            <div class="mb-5">
              <h2 class="text-xl font-bold mb-1">Regenerate Content</h2>
              <p class="text-xs text-text-3 uppercase tracking-wider">{{ piece.label }}</p>
            </div>

            <!-- Current content preview (3-line clamp) -->
            <div class="bg-surface-2 rounded-xl p-4 mb-5">
              <p class="text-sm text-text-2 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                {{ piece.content }}
              </p>
            </div>

            <!-- Feedback input -->
            <div class="space-y-2 mb-6">
              <label class="text-xs text-text-3 uppercase tracking-wider font-semibold block">
                What should be different? <span class="normal-case font-normal">(optional)</span>
              </label>
              <textarea
                v-model="feedback"
                rows="3"
                placeholder="e.g. Make it more concise, add a stronger call to action, use a friendlier tone..."
                class="w-full bg-surface-2 border border-border-2 rounded-lg px-3 py-2.5 text-sm text-text placeholder-text-3 resize-none focus:outline-none focus:border-brand transition-colors"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <button
                @click="onConfirm"
                class="w-full py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl transition-colors cursor-pointer border-0"
              >
                <i class="fa-solid fa-rotate-right mr-2"></i>
                Regenerate
              </button>
              <button
                @click="close"
                class="w-full text-sm text-text-3 hover:text-text-2 transition-colors cursor-pointer bg-transparent border-0 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
