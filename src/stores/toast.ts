import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = Date.now().toString()
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, add, remove }
})
