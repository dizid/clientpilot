<script setup lang="ts">
// /upgrade/pro and /upgrade/lifetime: where the landing page's pricing buttons lead.
// The router guard signs the visitor in first (login keeps ?redirect=), and this route is
// allowed without a finished profile, so a buyer goes straight to Stripe Checkout for the
// plan they picked instead of landing in the free onboarding.
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { createCheckout } from '@/lib/api'
import { track } from '@/lib/analytics'

// Same Stripe price IDs as the upgrade buttons in SettingsView and GenerateView
const PRICE_IDS: Record<string, string> = {
  pro: 'price_1TJr2B8gBja0qkMx2ZfnugJ4', // $9/month
  lifetime: 'price_1TJr2H8gBja0qkMxM6sic98C', // $69 once
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const plan = String(route.params.plan || '')
const error = ref('')
const working = ref(true)

async function startCheckout() {
  error.value = ''
  working.value = true
  const priceId = PRICE_IDS[plan]
  if (!priceId) {
    // Unknown plan in the URL: show the pricing on the landing page
    router.replace({ path: '/', hash: '#pricing' })
    return
  }
  // Right after sign-in the plan may not be loaded yet: ask the server before charging anyone twice
  await auth.refreshPlan()
  if (auth.isPro) {
    router.replace('/workspace')
    return
  }
  track('upgrade_click', { source: 'pricing', price_id: priceId })
  try {
    const { data } = await createCheckout(priceId)
    window.location.href = data.url
  } catch {
    error.value = "We couldn't open the checkout. Please try again."
    working.value = false
  }
}

onMounted(startCheckout)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-surface border border-border rounded-2xl p-8 text-center">
      <template v-if="working">
        <i class="fa-solid fa-spinner fa-spin text-2xl text-brand mb-4"></i>
        <p class="text-text-2">Opening secure checkout&hellip;</p>
      </template>
      <template v-else>
        <p class="text-text mb-6">{{ error }}</p>
        <div class="flex flex-col gap-3">
          <button
            @click="startCheckout"
            class="w-full py-3 text-sm font-bold bg-brand hover:bg-brand-dark text-white rounded-lg cursor-pointer border-0 transition"
          >
            Try again
          </button>
          <router-link to="/settings" class="text-sm text-text-3 hover:text-text-2">
            Go to Settings
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>
