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
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/generate',
      name: 'generate',
      component: () => import('@/views/GenerateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/content/:type',
      name: 'content',
      component: () => import('@/views/ContentView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    }
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
