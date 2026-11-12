import Stripe from 'stripe'
import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireString } from './lib/validate.mjs'
import { safeError, errorStatus } from './lib/errors.mjs'
import { planForPrice, hasOtherLiveProSubscription } from './lib/plans.mjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const { priceId } = await req.json()

    // Validate inputs before any Stripe calls
    const validationError = validate(
      requireString(priceId, 'priceId', 1, 500),
      // Stripe price IDs always start with 'price_'
      (typeof priceId === 'string' && !priceId.startsWith('price_'))
        ? "priceId must start with 'price_'"
        : null
    )

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Only ClientPilot's two prices: the Stripe account is shared with other apps,
    // and any one-off price there (e.g. a $9.90 product) used to buy Lifetime.
    const plan = planForPrice(priceId)
    if (!plan) {
      return Response.json({ error: 'Unknown plan' }, { status: 400 })
    }

    // Already paying: never open a second checkout (e.g. right after a purchase, before the
    // app has seen the webhook's plan change, the upgrade buttons can still be on screen).
    if (user.plan === 'pro' || user.plan === 'lifetime') {
      return Response.json(
        { error: `You already have ClientPilot ${user.plan === 'lifetime' ? 'Lifetime' : 'Pro'}`, alreadyPro: true },
        { status: 409 }
      )
    }

    // Get or create Stripe customer
    let customerId = user.stripe_customer_id as string | null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { user_id: user.id, firebase_uid: user.firebase_uid }
      })
      customerId = customer.id

      await query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, user.id]
      )
    }

    // A Pro subscription already paid in another tab (the webhook may not have
    // switched the plan yet): no second subscription. Also fixes the plan.
    if (plan === 'pro' && await hasOtherLiveProSubscription(stripe, customerId)) {
      await query("UPDATE users SET plan = 'pro', updated_at = NOW() WHERE id = $1 AND plan IS DISTINCT FROM 'lifetime'", [user.id])
      return Response.json({ error: 'You already have ClientPilot Pro', alreadyPro: true }, { status: 409 })
    }

    const mode = plan === 'pro' ? 'subscription' : 'payment'

    // Never trust req.headers.get('origin') — attacker can redirect Stripe to malicious URL
    const origin = process.env.SITE_URL || 'https://clientpilot-app.netlify.app'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/generate?checkout=cancelled`,
      metadata: { user_id: user.id, app: 'clientpilot', plan }
    })

    return Response.json({ url: session.url })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Checkout failed') }, { status: errorStatus(e) })
  }
}
