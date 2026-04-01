import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const result = await query(
      'SELECT headline, bio, skills, tech_stack, experience_years, projects, social_links, target_market, pricing_model, availability FROM profiles WHERE user_id = $1',
      [user.id]
    )

    return Response.json({ profile: result.rows[0] || null })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Fetch failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
