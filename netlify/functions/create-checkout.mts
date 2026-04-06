import Stripe from 'stripe'
import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireString } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

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

    // Determine mode based on price type
    const price = await stripe.prices.retrieve(priceId)
    const mode = price.recurring ? 'subscription' : 'payment'

    // Never trust req.headers.get('origin') — attacker can redirect Stripe to malicious URL
    const origin = process.env.SITE_URL || 'https://clientpilot-app.netlify.app'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: mode as Stripe.Checkout.SessionCreateParams.Mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/generate?checkout=cancelled`,
      metadata: { user_id: user.id }
    })

    return Response.json({ url: session.url })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Checkout failed') }, { status: 500 })
  }
}
