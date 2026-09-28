import { defineConfig, devices } from '@playwright/test'

/**
 * Local E2E: Vite dev server (real Netlify functions via @netlify/vite-plugin)
 * + Firebase Auth emulator for a throwaway test login.
 *
 * Safety: E2E_DATABASE_URL must point at a Neon *branch*, never production —
 * the test creates users, profiles and generations.
 *
 * Run (single browser, single worker — laptop friendly):
 *   E2E_DATABASE_URL=postgres://...branch... npx playwright test --project=chromium --workers=1
 */

const E2E_DATABASE_URL = process.env.E2E_DATABASE_URL
if (!E2E_DATABASE_URL) {
  throw new Error('Set E2E_DATABASE_URL to a Neon test branch (never the production database).')
}

const PORT = 5173
const AUTH_EMULATOR = '127.0.0.1:9099'

export default defineConfig({
  testDir: './e2e',
  timeout: 5 * 60 * 1000, // real Claude calls + background generation
  expect: { timeout: 30_000 },
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    // netlify.toml's CSP (applied by the Vite plugin) only allows the real
    // Firebase auth domain, not the local Auth emulator on 127.0.0.1:9099.
    // Production CSP is verified separately against the deployed site.
    bypassCSP: true,
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Pixel 7'] } }], // mobile-first
  webServer: [
    {
      command: `npx firebase emulators:start --only auth --project clientpilot-dizid --config e2e/firebase.json`,
      url: `http://${AUTH_EMULATOR}`,
      reuseExistingServer: true,
      timeout: 120_000
    },
    {
      command: `npx vite --port ${PORT} --strictPort`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        DATABASE_URL: E2E_DATABASE_URL,
        SITE_URL: `http://localhost:${PORT}`,
        FIREBASE_AUTH_EMULATOR_HOST: AUTH_EMULATOR,
        VITE_FIREBASE_AUTH_EMULATOR_HOST: AUTH_EMULATOR
      }
    }
  ]
})
