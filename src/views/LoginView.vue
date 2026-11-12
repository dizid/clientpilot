<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { track } from '@/lib/analytics'
import { detectInAppBrowser, chromeIntentUrl, type InAppBrowser } from '@/lib/in-app-browser'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')

// ─── Email link sign-in (T-0512) ─────────────────────────────────────────────
// Works in any browser, including LinkedIn/Facebook/Instagram's built-in ones
// where Google refuses. States: form -> sent; a link opened here -> finishing.
const email = ref('')
const emailSending = ref(false)
const emailSentTo = ref('')
const finishingLink = ref(false) // this page was opened from a sign-in link
const needEmailToFinish = ref(false) // link opened on another device/browser
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function friendlyAuthError(e: unknown, fallback: string): string {
  const code = (e as { code?: string })?.code || ''
  if (code === 'auth/invalid-email') return 'That email address doesn\'t look right.'
  if (code === 'auth/invalid-action-code' || code === 'auth/expired-action-code') {
    return 'This sign-in link has expired or was already used. Ask for a new one below.'
  }
  if (code === 'auth/operation-not-allowed') return 'Email sign-in isn\'t available right now. Please use Google.'
  if (code === 'auth/too-many-requests' || code === 'auth/quota-exceeded') return 'Too many attempts. Please wait a few minutes and try again.'
  return fallback
}

function afterSignIn() {
  const redirect = (route.query.redirect as string) || '/workspace'
  router.push(redirect)
}

async function handleSendEmailLink() {
  error.value = ''
  const address = email.value.trim()
  if (!EMAIL_RE.test(address)) {
    error.value = 'Enter your email address.'
    return
  }
  emailSending.value = true
  try {
    await auth.sendEmailLink(address, (route.query.redirect as string) || null)
    emailSentTo.value = address
    track('login_email_link_sent')
  } catch (e: unknown) {
    error.value = friendlyAuthError(e, "We couldn't send the link. Please try again.")
  } finally {
    emailSending.value = false
  }
}

async function finishWithEmail(address: string) {
  loading.value = true
  error.value = ''
  try {
    await auth.finishEmailLink(address, window.location.href)
    track('login_success', { method: 'email_link' })
    await auth.refreshPlan()
    afterSignIn()
  } catch (e: unknown) {
    finishingLink.value = false
    needEmailToFinish.value = false
    error.value = friendlyAuthError(e, 'Sign in failed. Please ask for a new link.')
  } finally {
    loading.value = false
  }
}

async function handleConfirmEmail() {
  const address = email.value.trim()
  if (!EMAIL_RE.test(address)) {
    error.value = 'Enter the email address the link was sent to.'
    return
  }
  await finishWithEmail(address)
}

// Load Firebase (on phones also Google's sign-in frame) before the tap, so the popup isn't blocked
onMounted(async () => {
  auth.init()
  // Opened from a sign-in link: finish signing in (asks for the address on another device)
  const linkState = await auth.emailLinkState(window.location.href).catch(() => null)
  if (linkState) {
    finishingLink.value = true
    if (linkState.rememberedEmail) {
      await finishWithEmail(linkState.rememberedEmail)
    } else {
      needEmailToFinish.value = true
    }
  }
  const nav = window.navigator as Navigator & { standalone?: boolean }
  inApp.value = detectInAppBrowser(nav.userAgent, nav.standalone === true)
  if (inApp.value) {
    androidChromeUrl.value = chromeIntentUrl(window.location.href, inApp.value.platform)
    track('login_in_app_browser', { app: inApp.value.appName ?? 'unknown' })
  }
})

// Google blocks its sign-in inside apps' built-in browsers (LinkedIn, Facebook, Instagram…),
// so there the page explains how to open it in a real browser first (T-0494).
const inApp = ref<InAppBrowser | null>(null)
const androidChromeUrl = ref<string | null>(null)
const tryAnyway = ref(false)
const linkCopied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
  } catch {
    // Clipboard blocked in this webview: show the address so it can be copied by hand.
    window.prompt('Copy this link and open it in your browser:', window.location.href)
  }
}

async function handleGoogleLogin() {
  loading.value = true
  error.value = ''
  try {
    await auth.login()
    track('login_success')
    // Load plan + profile state before navigating: the router guard reads hasProfile, which
    // was still false right after the popup, so returning users landed on the setup form.
    await auth.refreshPlan()
    // Default to the workspace; the guard sends users without a profile to onboarding.
    afterSignIn()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Sign in failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <router-link to="/" class="inline-flex items-center gap-2 text-2xl font-bold no-underline text-text">
          <i class="fa-solid fa-rocket text-brand"></i>
          Client<span class="text-brand">Pilot</span>
        </router-link>
        <p class="text-text-2 mt-2">Sign in to start getting clients</p>
      </div>

      <!-- Card -->
      <div class="bg-surface border border-border rounded-2xl p-8">
        <!-- Opened from an email sign-in link (T-0512) -->
        <div v-if="finishingLink" class="text-center" data-email-link-finish>
          <template v-if="needEmailToFinish">
            <p class="font-semibold text-text text-base">Confirm your email to sign in</p>
            <p class="text-text-2 text-sm mt-2">You opened the link on a different device or browser. Enter the address it was sent to.</p>
            <form class="mt-5 flex flex-col gap-3" @submit.prevent="handleConfirmEmail">
              <input
                v-model="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 focus:outline-none focus:border-brand"
              />
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 px-6 bg-brand hover:bg-brand-dark text-white font-semibold rounded-xl cursor-pointer border-0 transition disabled:opacity-50"
              >{{ loading ? 'Signing in...' : 'Sign in' }}</button>
            </form>
          </template>
          <p v-else class="text-text-2"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Signing you in&hellip;</p>
        </div>

        <!-- Link sent: tell them where to look -->
        <div v-else-if="emailSentTo" class="text-center" data-email-link-sent>
          <p class="font-semibold text-text text-base">Check your inbox</p>
          <p class="text-text-2 text-sm mt-2">
            We sent a sign-in link to <strong class="text-text">{{ emailSentTo }}</strong>. Open it on this phone or computer.
            It can take a minute; check spam if it doesn't show up.
          </p>
          <button
            type="button"
            @click="emailSentTo = ''"
            class="mt-5 text-sm text-text-2 hover:text-text underline bg-transparent border-0 cursor-pointer"
          >Use a different email</button>
        </div>

        <template v-else>
        <!-- In an app's built-in browser Google refuses the sign-in: explain first (T-0494) -->
        <div v-if="inApp && !tryAnyway" class="text-center" data-in-app-notice>
          <p class="font-semibold text-text text-base">Open this page in your browser to sign in</p>
          <p class="text-text-2 text-sm mt-2">
            Google doesn't allow sign-in inside {{ inApp.appName ? `the ${inApp.appName} app's` : "this app's" }} built-in browser.
          </p>
          <p class="text-text-2 text-sm mt-3" v-if="inApp.platform === 'ios'">
            Tap <strong>•••</strong> or the share icon, then <strong>Open in Safari</strong> (or Open in browser).
          </p>
          <p class="text-text-2 text-sm mt-3" v-else>
            Tap <strong>⋮</strong> (top right), then <strong>Open in browser</strong>.
          </p>
          <a
            v-if="androidChromeUrl"
            :href="androidChromeUrl"
            class="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-brand text-white font-semibold rounded-xl no-underline"
          >Open in Chrome</a>
          <button
            type="button"
            @click="copyLink"
            class="mt-4 w-full py-3 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl cursor-pointer border-0 transition text-base"
          >{{ linkCopied ? 'Link copied: paste it in your browser' : 'Copy link' }}</button>
          <button
            type="button"
            @click="tryAnyway = true"
            class="mt-4 text-xs text-text-3 hover:text-text-2 underline bg-transparent border-0 cursor-pointer"
          >Try Google sign-in here anyway</button>
        </div>
        <button
          v-else
          @click="handleGoogleLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl cursor-pointer border-0 transition text-base disabled:opacity-50"
        >
          <svg v-if="!loading" class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <i v-else class="fa-solid fa-spinner fa-spin"></i>
          {{ loading ? 'Signing in...' : 'Continue with Google' }}
        </button>

        <!-- Email link: the way in from apps' built-in browsers (Google refuses there) -->
        <div class="mt-6" data-email-link-form>
          <p v-if="inApp && !tryAnyway" class="text-text-2 text-sm text-center mb-3">Or stay here and get a sign-in link by email:</p>
          <div v-else class="flex items-center gap-3 mb-4 text-xs text-text-3">
            <span class="flex-1 h-px bg-border"></span>or<span class="flex-1 h-px bg-border"></span>
          </div>
          <form class="flex flex-col gap-3" @submit.prevent="handleSendEmailLink">
            <input
              v-model="email"
              type="email"
              inputmode="email"
              autocomplete="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              class="w-full px-4 py-3 bg-surface-2 border border-border rounded-lg text-text placeholder-text-3 focus:outline-none focus:border-brand"
            />
            <button
              type="submit"
              :disabled="emailSending"
              class="w-full py-3 px-6 bg-surface-2 hover:bg-surface-3 text-text font-semibold rounded-xl cursor-pointer border border-border transition disabled:opacity-50"
            >{{ emailSending ? 'Sending...' : 'Email me a sign-in link' }}</button>
          </form>
        </div>
        </template>

        <div v-if="error" class="mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm text-center">
          {{ error }}
        </div>

        <p class="text-xs text-text-3 text-center mt-6">
          By signing in you agree to our <a href="/terms" class="text-text-2 hover:text-text">Terms</a>.
          How we use your data: <a href="/privacy" class="text-text-2 hover:text-text">Privacy Policy</a>.
        </p>
      </div>
    </div>
  </div>
</template>
