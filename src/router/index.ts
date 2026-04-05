import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
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
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.user) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }
})

export default router
