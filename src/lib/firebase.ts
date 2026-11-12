import { initializeApp } from 'firebase/app'
import {
  getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, type User
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Local E2E tests only: point Auth at the Firebase emulator. Never set in production.
const authEmulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
if (authEmulatorHost) {
  connectAuthEmulator(auth, `http://${authEmulatorHost}`, { disableWarnings: true })
}

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

// ─── Email link sign-in ─────────────────────────────────────────────────────
// Google refuses sign-in inside apps' built-in browsers (LinkedIn, Facebook,
// Instagram), and many visitors arrive from those apps. A sign-in link by email
// works in any browser. The address is remembered on this device so the link
// can finish without asking again; on another device the page asks for it.
const EMAIL_FOR_SIGN_IN_KEY = 'cp_email_for_sign_in'

export async function sendEmailSignInLink(email: string, redirect: string | null) {
  const url = new URL('/login', window.location.origin)
  if (redirect) url.searchParams.set('redirect', redirect)
  await sendSignInLinkToEmail(auth, email, { url: url.toString(), handleCodeInApp: true })
  try { window.localStorage.setItem(EMAIL_FOR_SIGN_IN_KEY, email) } catch { /* storage blocked: the page asks */ }
}

export function isEmailSignInLink(href: string): boolean {
  return isSignInWithEmailLink(auth, href)
}

export function rememberedSignInEmail(): string | null {
  try { return window.localStorage.getItem(EMAIL_FOR_SIGN_IN_KEY) } catch { return null }
}

export async function finishEmailSignIn(email: string, href: string) {
  const result = await signInWithEmailLink(auth, email, href)
  try { window.localStorage.removeItem(EMAIL_FOR_SIGN_IN_KEY) } catch { /* nothing to clean */ }
  return result.user
}

export async function logOut() {
  await signOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}
