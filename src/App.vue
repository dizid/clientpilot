<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ToastContainer.vue'

const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <div class="min-h-screen bg-bg">
    <router-view v-if="!auth.loading" />
    <div v-else class="min-h-screen flex items-center justify-center">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-brand"></i>
    </div>
    <ToastContainer />
  </div>
</template>
