import { createRouter, createWebHistory } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { trackPageView } from '@/lib/analytics'
import LandingView from '@/views/LandingView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/OnboardingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/workspace',
      name: 'workspace',
      component: () => import('@/views/WorkspaceView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('@/views/GenerateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    // Backward compatibility redirects
    { path: '/dashboard', redirect: '/workspace' },
    { path: '/content/:type', redirect: '/workspace' },
    // 404 catch-all
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return

  const auth = useAuthStore()

  // Wait for the initial Firebase auth check before deciding (avoids a flash of /login).
  if (auth.loading) {
    await new Promise<void>((resolve) => {
      const unwatch = watch(
        () => auth.loading,
        (l) => {
          if (!l) {
            unwatch()
            resolve()
          }
        }
      )
    })
  }

  if (!auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Force users without a profile through onboarding before they can hit /generate etc.
  if (!auth.hasProfile && to.name !== 'onboarding') {
    return { name: 'onboarding' }
  }
})

// Track pageviews on every route change
router.afterEach((to) => {
  trackPageView(to.fullPath)
})

export default router
