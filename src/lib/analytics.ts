// GA4 analytics wrapper — centralizes all event tracking
// GA4 Measurement ID is loaded via gtag.js in index.html

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

// typeof window guard: these also run during the build-time prerender (Node, no window)
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}

export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', { page_path: path })
  }
}
