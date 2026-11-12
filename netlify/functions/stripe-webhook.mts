import Stripe from 'stripe'
import { query } from './lib/db.mjs'
import { safeError } from './lib/errors.mjs'
import { planForPrice, isProSubscription, hasOtherLiveProSubscription, UUID_PATTERN } from './lib/plans.mjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Webhook verification failed') }, { status: 400 })
  }

  // Subscription events below never touch a Lifetime plan: a $69 buyer may still have an old
  // Pro subscription whose late events (final failed retry, deletion) arrive after the purchase.
  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      // The shared Stripe account sends every app's checkouts here. Act only on a
      // paid checkout of a ClientPilot price, for the user whose Stripe customer it
      // is (another app's checkout naming a ClientPilot user id used to grant Pro).
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
      if (!userId || !UUID_PATTERN.test(userId) || !customerId) break
      if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') break

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 })
      const plan = lineItems.data.map((item) => planForPrice(item.price?.id)).find(Boolean)
      if (plan === 'pro') {
        await query(
          "UPDATE users SET plan = 'pro', updated_at = NOW() WHERE id = $1 AND stripe_customer_id = $2 AND plan IS DISTINCT FROM 'lifetime'",
          [userId, customerId]
        )
      } else if (plan === 'lifetime') {
        await query(
          "UPDATE users SET plan = 'lifetime', updated_at = NOW() WHERE id = $1 AND stripe_customer_id = $2",
          [userId, customerId]
        )
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      // Another app's subscription, or an old one while a newer Pro subscription pays
      if (!isProSubscription(subscription)) break
      if (await hasOtherLiveProSubscription(stripe, customerId, subscription.id)) break

      await query(
        "UPDATE users SET plan = 'free', updated_at = NOW() WHERE stripe_customer_id = $1 AND plan IS DISTINCT FROM 'lifetime'",
        [customerId]
      )
      break
    }

    case 'invoice.payment_failed': {
      // Card declined — downgrade to free so they can't keep using Pro for free
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      // Keep Pro when the customer still has a live Pro subscription (the failed
      // invoice belongs to an old one, or to another app)
      if (customerId && !(await hasOtherLiveProSubscription(stripe, customerId))) {
        await query(
          "UPDATE users SET plan = 'free', updated_at = NOW() WHERE stripe_customer_id = $1 AND plan IS DISTINCT FROM 'lifetime'",
          [customerId]
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      // Sync plan state when subscription status changes (upgrade, downgrade, past_due)
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      if (!isProSubscription(subscription)) break // another app's subscription
      if (subscription.status === 'active') {
        await query(
          "UPDATE users SET plan = 'pro', updated_at = NOW() WHERE stripe_customer_id = $1 AND plan IS DISTINCT FROM 'lifetime'",
          [customerId]
        )
      } else if (
        (subscription.status === 'past_due' || subscription.status === 'canceled' || subscription.status === 'unpaid') &&
        !(await hasOtherLiveProSubscription(stripe, customerId, subscription.id))
      ) {
        await query(
          "UPDATE users SET plan = 'free', updated_at = NOW() WHERE stripe_customer_id = $1 AND plan IS DISTINCT FROM 'lifetime'",
          [customerId]
        )
      }
      break
    }
  }

  return Response.json({ received: true })
}
