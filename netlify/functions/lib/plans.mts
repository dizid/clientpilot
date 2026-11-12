import type Stripe from 'stripe'

/**
 * ClientPilot's own live Stripe prices (also in the client views and CLAUDE.md).
 * The Stripe account is shared with ~10 other apps: every app's checkouts and
 * subscription events reach this webhook, and any app's price id could be sent
 * to create-checkout. So both only act on these two prices.
 */
export const PRO_PRICE_ID = 'price_1TJr2B8gBja0qkMx2ZfnugJ4' // $9/month
export const LIFETIME_PRICE_ID = 'price_1TJr2H8gBja0qkMxM6sic98C' // $69 once

export type PaidPlan = 'pro' | 'lifetime'

export function planForPrice(priceId: unknown): PaidPlan | null {
  if (priceId === PRO_PRICE_ID) return 'pro'
  if (priceId === LIFETIME_PRICE_ID) return 'lifetime'
  return null
}

/** True when a subscription is for ClientPilot Pro (not another app's product). */
export function isProSubscription(subscription: Stripe.Subscription): boolean {
  return subscription.items.data.some((item) => item.price?.id === PRO_PRICE_ID)
}

/**
 * True when the customer has a live (active or trialing) ClientPilot Pro
 * subscription other than `exceptId`. Late events from an OLD subscription
 * (final failed retry, deletion) must not drop a user who already pays for a
 * newer one; the users table keeps no subscription id, so Stripe is asked.
 */
export async function hasOtherLiveProSubscription(
  stripe: Stripe,
  customerId: string,
  exceptId?: string
): Promise<boolean> {
  try {
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 20 })
    return subscriptions.data.some(
      (s) => s.id !== exceptId && (s.status === 'active' || s.status === 'trialing') && isProSubscription(s)
    )
  } catch (err) {
    // ClientPilot's restricted Stripe key (Nov 12 2026) may not read subscriptions
    // ("Subscriptions: Read" off). Then behave as before this check existed
    // instead of failing the webhook or the checkout.
    console.warn('Could not list Stripe subscriptions:', err instanceof Error ? err.message.slice(0, 120) : err)
    return false
  }
}

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
