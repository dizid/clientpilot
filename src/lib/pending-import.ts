// Carries a portfolio URL entered on the landing page through sign-in to
// onboarding, where the import starts automatically. localStorage can be
// unavailable (private mode, blocked storage) — then we just skip the handoff.

const KEY = 'clientpilot_pending_import_url'

export function savePendingImportUrl(url: string) {
  try {
    localStorage.setItem(KEY, url)
  } catch {
    // storage unavailable — onboarding will simply show the empty import box
  }
}

/** Returns the pending URL (if any) and clears it so it only auto-runs once. */
export function takePendingImportUrl(): string {
  try {
    const url = localStorage.getItem(KEY) || ''
    localStorage.removeItem(KEY)
    return url
  } catch {
    return ''
  }
}
