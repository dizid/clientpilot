<script setup lang="ts">
defineProps<{
  types: Array<{
    type: string
    label: string
    status: 'pending' | 'generating' | 'done' | 'failed'
  }>
}>()
</script>

<template>
  <div class="space-y-2">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-for="item in types"
        :key="item.type"
        class="flex items-center gap-3 p-3 bg-surface-2 rounded-xl border border-border"
        :class="{
          'border-brand/30': item.status === 'generating',
          'border-success/30': item.status === 'done',
          'border-danger/30': item.status === 'failed'
        }"
      >
        <!-- Status indicator -->
        <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm">
          <!-- Pending: gray circle outline -->
          <template v-if="item.status === 'pending'">
            <div class="w-5 h-5 rounded-full border-2 border-text-3"></div>
          </template>

          <!-- Generating: pulsing brand spinner -->
          <template v-else-if="item.status === 'generating'">
            <i class="fa-solid fa-circle-notch fa-spin text-brand"></i>
          </template>

          <!-- Done: green check -->
          <template v-else-if="item.status === 'done'">
            <div class="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
              <i class="fa-solid fa-check text-success text-xs"></i>
            </div>
          </template>

          <!-- Failed: red X -->
          <template v-else-if="item.status === 'failed'">
            <div class="w-5 h-5 rounded-full bg-danger/20 flex items-center justify-center">
              <i class="fa-solid fa-xmark text-danger text-xs"></i>
            </div>
          </template>
        </div>

        <!-- Label -->
        <span
          class="text-sm flex-1 transition-colors duration-300"
          :class="{
            'text-text-3': item.status === 'pending',
            'text-brand-light font-medium': item.status === 'generating',
            'text-text': item.status === 'done',
            'text-danger': item.status === 'failed'
          }"
        >
          {{ item.label }}
        </span>

        <!-- Right status text -->
        <span
          class="text-xs transition-colors duration-300"
          :class="{
            'text-text-3': item.status === 'pending',
            'text-brand animate-pulse': item.status === 'generating',
            'text-success': item.status === 'done',
            'text-danger': item.status === 'failed'
          }"
        >
          <template v-if="item.status === 'pending'">Waiting</template>
          <template v-else-if="item.status === 'generating'">Generating...</template>
          <template v-else-if="item.status === 'done'">Done</template>
          <template v-else-if="item.status === 'failed'">Failed</template>
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>
