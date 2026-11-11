import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from 'firebase/auth'
import { isChunkLoadError, reloadOnce } from '@/lib/stale-chunk-reload'

// Firebase and the API client load on first use instead of with the landing page. On phones,
// Firebase's Google sign-in setup also downloads Google's hidden sign-in frame (~140 KB), so
// public pages start it once they're idle (App.vue); login and app pages start it right away.
const loadFirebase = () => import('@/lib/firebase')
const loadApi = () => import('@/lib/api')

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const plan = ref<string>('free')
  const generationsUsed = ref(0)
  const hasProfile = ref(false)
  const loading = ref(true)
  let initStarted = false

  const isLoggedIn = computed(() => !!user.value)
  const isPro = computed(() => plan.value === 'pro' || plan.value === 'lifetime')
  const canGenerate = computed(() => isPro.value || generationsUsed.value < 1)

  // Safe to call more than once: only the first call starts Firebase's login check.
  async function init() {
    if (initStarted) return
    initStarted = true
    let onAuthChange: Awaited<ReturnType<typeof loadFirebase>>['onAuthChange']
    try {
      ;({ onAuthChange } = await loadFirebase())
    } catch (error) {
      // A tab left open across a deploy asks for a Firebase file that no longer exists:
      // load the page once more (fresh HTML, current files), like stale page chunks.
      if (isChunkLoadError(error) && reloadOnce(window.location.href)) return
      // Otherwise stop waiting, so pages behind login don't spin forever (they go to /login).
      loading.value = false
      return
    }
    onAuthChange(async (firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) {
        try {
          const { getUser } = await loadApi()
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
    // The login page already started init(), so this import is cached and the Google popup
    // still opens within the tap (phones block popups that open too long after it).
    const { signInWithGoogle } = await loadFirebase()
    await signInWithGoogle()
  }

  async function logout() {
    const { logOut } = await loadFirebase()
    await logOut()
    user.value = null
    plan.value = 'free'
    generationsUsed.value = 0
    hasProfile.value = false
  }

  async function refreshPlan() {
    try {
      const { getUser } = await loadApi()
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
