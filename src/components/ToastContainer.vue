<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
</script>

<template>
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-for="t in toast.toasts"
        :key="t.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[280px]"
        :class="{
          'bg-surface border-success/30 text-success-light': t.type === 'success',
          'bg-surface border-danger/30 text-danger': t.type === 'error',
          'bg-surface border-brand/30 text-brand-light': t.type === 'info'
        }"
      >
        <i :class="{
          'fa-solid fa-check-circle': t.type === 'success',
          'fa-solid fa-exclamation-circle': t.type === 'error',
          'fa-solid fa-info-circle': t.type === 'info'
        }"></i>
        <span class="text-sm">{{ t.message }}</span>
        <button
          @click="toast.remove(t.id)"
          class="ml-auto text-text-3 hover:text-text bg-transparent border-0 cursor-pointer"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
