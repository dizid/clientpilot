import Stripe from 'stripe'
import { query } from './lib/db.mjs'
import { safeError } from './lib/errors.mjs'

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

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      if (!userId) break

      if (session.mode === 'subscription') {
        // Pro monthly
        await query(
          "UPDATE users SET plan = 'pro', updated_at = NOW() WHERE id = $1",
          [userId]
        )
      } else if (session.mode === 'payment') {
        // Lifetime
        await query(
          "UPDATE users SET plan = 'lifetime', updated_at = NOW() WHERE id = $1",
          [userId]
        )
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await query(
        "UPDATE users SET plan = 'free', updated_at = NOW() WHERE stripe_customer_id = $1",
        [customerId]
      )
      break
    }

    case 'invoice.payment_failed': {
      // Card declined — downgrade to free so they can't keep using Pro for free
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      if (customerId) {
        await query(
          "UPDATE users SET plan = 'free', updated_at = NOW() WHERE stripe_customer_id = $1",
          [customerId]
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      // Sync plan state when subscription status changes (upgrade, downgrade, past_due)
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      if (subscription.status === 'active') {
        await query(
          "UPDATE users SET plan = 'pro', updated_at = NOW() WHERE stripe_customer_id = $1",
          [customerId]
        )
      } else if (subscription.status === 'past_due' || subscription.status === 'canceled' || subscription.status === 'unpaid') {
        await query(
          "UPDATE users SET plan = 'free', updated_at = NOW() WHERE stripe_customer_id = $1",
          [customerId]
        )
      }
      break
    }
  }

  return Response.json({ received: true })
}
