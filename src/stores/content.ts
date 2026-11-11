import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getPieces,
  updatePiece as apiUpdatePiece,
  deletePiece as apiDeletePiece,
  regeneratePiece as apiRegeneratePiece,
  getStats as apiGetStats
} from '@/lib/api'
import type { ContentPiece, WorkspaceStats } from '@/lib/api'

export const useContentStore = defineStore('content', () => {
  const pieces = ref<ContentPiece[]>([])
  const stats = ref<WorkspaceStats>({
    total_pieces: 0,
    used_this_week: 0,
    total_replies: 0,
    content_types_generated: 0
  })
  const activeTab = ref('linkedin_posts')
  const loading = ref(false)
  // Using a plain object instead of Set for reactivity compatibility
  const savingIds = ref<Record<string, boolean>>({})

  const saving = computed(() => ({
    has: (id: string) => !!savingIds.value[id]
  }))

  const piecesByType = computed(() => {
    return pieces.value.filter(p => p.type === activeTab.value)
  })

  const typeCounts = computed(() => {
    const counts: Record<string, number> = {}
    for (const p of pieces.value) {
      counts[p.type] = (counts[p.type] || 0) + 1
    }
    return counts
  })

  async function loadPieces() {
    loading.value = true
    try {
      const { data } = await getPieces()
      pieces.value = data.pieces
    } catch {
      // ignore — pieces stays as-is
    } finally {
      loading.value = false
    }
  }

  async function loadStats() {
    try {
      const { data } = await apiGetStats()
      stats.value = data.stats
    } catch {
      // ignore — stats stays as defaults
    }
  }

  async function updatePiece(id: string, patch: { content?: string; status?: string }) {
    savingIds.value[id] = true
    // Optimistic update
    const idx = pieces.value.findIndex(p => p.id === id)
    const backup = idx >= 0 ? { ...pieces.value[idx] } : null
    if (idx >= 0) Object.assign(pieces.value[idx], patch)
    try {
      const { data } = await apiUpdatePiece(id, patch)
      // Merge: the update returns only the piece's own columns, and replacing the object
      // dropped the target tags (niche/platform from the list's JOIN) until a reload
      if (idx >= 0) pieces.value[idx] = { ...pieces.value[idx], ...data.piece }
    } catch (e) {
      // Roll back, then let the card show the error (it used to say 'saved' anyway)
      if (idx >= 0 && backup) pieces.value[idx] = backup as ContentPiece
      throw e
    } finally {
      delete savingIds.value[id]
    }
  }

  async function removePiece(id: string) {
    const idx = pieces.value.findIndex(p => p.id === id)
    const backup = idx >= 0 ? pieces.value[idx] : null
    if (idx >= 0) pieces.value.splice(idx, 1)
    try {
      await apiDeletePiece(id)
    } catch (e) {
      // Roll back, then let the card show the error (it used to say 'deleted' anyway)
      if (backup && idx >= 0) pieces.value.splice(idx, 0, backup)
      throw e
    }
  }

  async function regenerate(id: string, feedback?: string) {
    savingIds.value[id] = true
    try {
      const { data } = await apiRegeneratePiece(id, feedback)
      const idx = pieces.value.findIndex(p => p.id === id)
      if (idx >= 0) pieces.value[idx] = { ...pieces.value[idx], ...data.piece } // keep target tags
    } finally {
      delete savingIds.value[id]
    }
  }

  return {
    pieces,
    stats,
    activeTab,
    loading,
    saving,
    piecesByType,
    typeCounts,
    loadPieces,
    loadStats,
    updatePiece,
    removePiece,
    regenerate
  }
})
