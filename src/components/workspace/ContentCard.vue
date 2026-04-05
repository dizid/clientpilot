<script setup lang="ts">
import { ref, computed } from 'vue'
import { useContentStore } from '@/stores/content'
import { useToastStore } from '@/stores/toast'
import type { ContentPiece } from '@/lib/api'
import { renderMarkdown } from '@/lib/markdown'

const props = defineProps<{
  piece: ContentPiece
}>()

const content = useContentStore()
const toast = useToastStore()

// Edit state
const isEditing = ref(false)
const editValue = ref('')

// Copy state
const copied = ref(false)

// Regenerate state
const showRegenerateInput = ref(false)
const regenerateFeedback = ref('')

// Computed
const isSaving = computed(() => content.saving.has(props.piece.id))

const renderedContent = computed(() => {
  if (props.piece.type === 'devto_article') {
    return renderMarkdown(props.piece.content)
  }
  return null
})

const statusOptions: Array<{ value: ContentPiece['status']; label: string }> = [
  { value: 'draft', label: 'Draft' },
  { value: 'used', label: 'Used' },
  { value: 'replied', label: 'Replied' },
]

function startEdit() {
  editValue.value = props.piece.content
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
  editValue.value = ''
}

async function saveEdit() {
  await content.updatePiece(props.piece.id, { content: editValue.value })
  isEditing.value = false
  toast.add('Content saved', 'success')
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.piece.content)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    toast.add('Copy failed — please try manually', 'error')
  }
}

async function onStatusChange(event: Event) {
  const select = event.target as HTMLSelectElement
  await content.updatePiece(props.piece.id, { status: select.value })
  toast.add('Status updated', 'success')
}

async function confirmRegenerate() {
  await content.regenerate(props.piece.id, regenerateFeedback.value || undefined)
  showRegenerateInput.value = false
  regenerateFeedback.value = ''
  toast.add('Content regenerated', 'success')
}

async function confirmDelete() {
  if (!window.confirm('Delete this piece? This cannot be undone.')) return
  await content.removePiece(props.piece.id)
  toast.add('Piece deleted', 'info')
}
</script>

<template>
  <div class="bg-surface border border-border rounded-xl p-5 space-y-3">
    <!-- Header row: label + status badge + saving indicator -->
    <div class="flex items-center justify-between gap-2">
      <span class="text-xs font-semibold text-text-3 uppercase tracking-wider">
        {{ piece.label }}
      </span>
      <div class="flex items-center gap-2">
        <!-- Saving spinner -->
        <i v-if="isSaving" class="fa-solid fa-circle-notch fa-spin text-brand text-xs"></i>

        <!-- Status badge / selector -->
        <select
          :value="piece.status"
          @change="onStatusChange"
          class="text-xs px-2 py-1 rounded-full border-0 cursor-pointer appearance-none"
          :class="{
            'bg-surface-2 text-text-3': piece.status === 'draft',
            'bg-brand/20 text-brand-light': piece.status === 'used',
            'bg-success/20 text-success-light': piece.status === 'replied'
          }"
        >
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Target context tags -->
    <div v-if="piece.niche || piece.platform" class="flex items-center gap-2 flex-wrap">
      <span v-if="piece.niche" class="text-xs bg-surface-2 text-text-3 px-2 py-0.5 rounded">
        {{ piece.niche }}
      </span>
      <span v-if="piece.platform" class="text-xs bg-surface-2 text-text-3 px-2 py-0.5 rounded">
        {{ piece.platform }}
      </span>
    </div>

    <!-- Content: view or edit -->
    <div v-if="!isEditing">
      <!-- Dev.to article: rendered markdown -->
      <div
        v-if="piece.type === 'devto_article' && renderedContent"
        class="text-sm text-text-2 leading-relaxed prose-sm"
        v-html="renderedContent"
      ></div>
      <!-- All other types: plain text -->
      <p v-else class="text-sm text-text-2 leading-relaxed whitespace-pre-wrap">
        {{ piece.content }}
      </p>
    </div>

    <!-- Edit textarea -->
    <div v-else class="space-y-2">
      <textarea
        v-model="editValue"
        rows="8"
        class="w-full bg-surface-2 border border-border-2 rounded-lg p-3 text-sm text-text resize-y focus:outline-none focus:border-brand transition-colors"
      ></textarea>
      <div class="flex items-center gap-2">
        <button
          @click="saveEdit"
          :disabled="isSaving"
          class="px-3 py-1.5 bg-brand text-white text-xs rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer border-0"
        >
          <i class="fa-solid fa-check mr-1"></i>Save
        </button>
        <button
          @click="cancelEdit"
          class="px-3 py-1.5 text-text-3 hover:text-text text-xs transition-colors cursor-pointer bg-transparent border-0"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Regenerate feedback input -->
    <div v-if="showRegenerateInput && !isEditing" class="space-y-2 pt-2 border-t border-border">
      <p class="text-xs text-text-3">What should be different? (optional)</p>
      <textarea
        v-model="regenerateFeedback"
        rows="2"
        placeholder="e.g. Make it shorter, more casual tone..."
        class="w-full bg-surface-2 border border-border-2 rounded-lg p-3 text-sm text-text resize-none focus:outline-none focus:border-brand transition-colors"
      ></textarea>
      <div class="flex items-center gap-2">
        <button
          @click="confirmRegenerate"
          :disabled="isSaving"
          class="px-3 py-1.5 bg-brand text-white text-xs rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50 cursor-pointer border-0"
        >
          <i class="fa-solid fa-rotate-right mr-1"></i>Regenerate
        </button>
        <button
          @click="showRegenerateInput = false; regenerateFeedback = ''"
          class="px-3 py-1.5 text-text-3 hover:text-text text-xs transition-colors cursor-pointer bg-transparent border-0"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Action bar -->
    <div class="flex items-center gap-2 pt-3 border-t border-border flex-wrap">
      <!-- Copy -->
      <button
        @click="copyToClipboard"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-2 hover:text-text bg-surface-2 hover:bg-surface-3 rounded-lg transition-colors cursor-pointer border-0"
      >
        <i :class="copied ? 'fa-solid fa-check text-success' : 'fa-solid fa-copy'"></i>
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>

      <!-- Edit -->
      <button
        v-if="!isEditing"
        @click="startEdit"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-2 hover:text-text bg-surface-2 hover:bg-surface-3 rounded-lg transition-colors cursor-pointer border-0"
      >
        <i class="fa-solid fa-pen"></i>
        Edit
      </button>

      <!-- Regenerate toggle -->
      <button
        v-if="!isEditing && !showRegenerateInput"
        @click="showRegenerateInput = true"
        :disabled="isSaving"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-2 hover:text-text bg-surface-2 hover:bg-surface-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer border-0"
      >
        <i class="fa-solid fa-rotate-right"></i>
        Regenerate
      </button>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Delete -->
      <button
        @click="confirmDelete"
        :disabled="isSaving"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-danger/70 hover:text-danger bg-transparent hover:bg-danger/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer border-0"
      >
        <i class="fa-solid fa-trash"></i>
        Delete
      </button>
    </div>
  </div>
</template>
