import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { signInWithGoogle, logOut, onAuthChange } from '@/lib/firebase'
import { getUser } from '@/lib/api'
import type { User } from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const plan = ref<string>('free')
  const generationsUsed = ref(0)
  const hasProfile = ref(false)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const isPro = computed(() => plan.value === 'pro' || plan.value === 'lifetime')
  const canGenerate = computed(() => isPro.value || generationsUsed.value < 1)

  function init() {
    onAuthChange(async (firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) {
        try {
          const { data } = await getUser()
          plan.value = data.user.plan
          generationsUsed.value = data.user.generations_used
          hasProfile.value = data.user.has_profile
        } catch {
          // New user, defaults are fine
          hasProfile.value = false
        }
      } else {
        hasProfile.value = false
      }
      loading.value = false
    })
  }

  async function login() {
    await signInWithGoogle()
  }

  async function logout() {
    await logOut()
    user.value = null
    plan.value = 'free'
    generationsUsed.value = 0
    hasProfile.value = false
  }

  async function refreshPlan() {
    try {
      const { data } = await getUser()
      plan.value = data.user.plan
      generationsUsed.value = data.user.generations_used
      hasProfile.value = data.user.has_profile
    } catch {
      // ignore
    }
  }

  // Call after onboarding completes so the router guard stops bouncing the user
  function markProfileSaved() {
    hasProfile.value = true
  }

  return {
    user, plan, generationsUsed, hasProfile, loading,
    isLoggedIn, isPro, canGenerate,
    init, login, logout, refreshPlan, markProfileSaved,
  }
})
