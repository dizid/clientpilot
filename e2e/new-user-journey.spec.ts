import { test, expect, type Page } from '@playwright/test'

/**
 * Full new-user journey, no forms:
 *   landing URL box → Google sign-in (Auth emulator) → auto profile import →
 *   review + two taps → welcome card → prospect import → first outreach → workspace
 *
 * Uses real Netlify functions, real Claude calls and a Neon test branch.
 */

const PORTFOLIO_URL = 'dizid.com'
const PROSPECT_URL = 'basecamp.com'

/** Complete the Firebase Auth emulator's fake Google popup with a fresh test user. */
async function signInWithEmulatorPopup(page: Page) {
  const popupPromise = page.waitForEvent('popup')
  await page.getByRole('button', { name: /continue with google/i }).click()
  const popup = await popupPromise
  await popup.waitForLoadState()
  await popup.getByText(/add new account/i).click()
  await popup.getByRole('button', { name: /auto-generate user information/i }).click()
  await popup.getByRole('button', { name: /sign in with google/i }).click()
  await popup.waitForEvent('close')
}

test('unauthenticated API calls get 401, not 500', async ({ request }) => {
  const res = await request.get('/.netlify/functions/get-profile')
  expect(res.status()).toBe(401)
})

test('new user: portfolio URL → profile → first outreach', async ({ page }) => {
  // 1. Landing page: paste portfolio URL
  await page.goto('/')
  await page.getByLabel(/your portfolio or github url/i).fill(PORTFOLIO_URL)
  await page.getByRole('button', { name: /build my profile/i }).click()

  // 2. Sign in with a throwaway emulator account
  await expect(page).toHaveURL(/\/login/)
  await signInWithEmulatorPopup(page)

  // 3. Onboarding auto-imports the URL from the landing page (no typing)
  await expect(page).toHaveURL(/\/onboarding/)
  await expect(page.getByText(/here's what we found/i)).toBeVisible({ timeout: 60_000 })

  // Imported data is real, not empty
  const headline = page.locator('input').first()
  await expect(headline).not.toHaveValue('')
  await expect(page.getByText('LaunchPilot', { exact: false }).first()).toBeVisible()

  // Save stays disabled until the two taps are done
  const saveButton = page.getByRole('button', { name: /pick your market|looks good/i })
  await expect(saveButton).toBeDisabled()
  await page.getByRole('button', { name: 'Europe / EU' }).click()
  await page.getByRole('button', { name: 'Full-time' }).click()
  await page.getByRole('button', { name: /looks good/i }).click()

  // 4. Welcome card on Generate; free users don't get "Generate All"
  await expect(page).toHaveURL(/\/generate\?welcome=1/)
  await expect(page.getByText(/your profile is ready/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /generate all content/i })).toHaveCount(0)
  await page.getByRole('button', { name: /write my first outreach/i }).click()

  // 5. Prospect import fills the target modal
  await page.getByPlaceholder('theircompany.com').fill(PROSPECT_URL)
  await page.getByRole('button', { name: /analyze/i }).click()
  await expect(page.getByText(/targeting .*basecamp/i)).toBeVisible({ timeout: 60_000 })
  await expect(page.getByPlaceholder(/what problem do they have/i)).not.toHaveValue('')
  await page.getByRole('button', { name: /generate with target/i }).click()

  // 6. Background generation completes
  await expect(page.getByText(/outreach templates generated/i)).toBeVisible({ timeout: 3 * 60_000 })
  await page.getByRole('button', { name: /view generated content/i }).click()

  // 7. Workspace opens on the new outreach, written TO the prospect (not generic templates)
  await expect(page).toHaveURL(/\/workspace\?tab=outreach_templates/)
  await expect(page.getByText(/cold email - founder/i)).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText(/basecamp/i).first()).toBeVisible()
})
