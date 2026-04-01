import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const profile = await req.json()

    await query(
      `INSERT INTO profiles (user_id, headline, bio, skills, tech_stack, experience_years, projects, social_links, target_market, pricing_model, availability)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (user_id)
       DO UPDATE SET
         headline = EXCLUDED.headline,
         bio = EXCLUDED.bio,
         skills = EXCLUDED.skills,
         tech_stack = EXCLUDED.tech_stack,
         experience_years = EXCLUDED.experience_years,
         projects = EXCLUDED.projects,
         social_links = EXCLUDED.social_links,
         target_market = EXCLUDED.target_market,
         pricing_model = EXCLUDED.pricing_model,
         availability = EXCLUDED.availability,
         updated_at = NOW()`,
      [
        user.id,
        profile.headline,
        profile.bio,
        profile.skills || [],
        profile.tech_stack || [],
        profile.experience_years || 0,
        JSON.stringify(profile.projects || []),
        JSON.stringify(profile.social_links || {}),
        profile.target_market,
        profile.pricing_model,
        profile.availability
      ]
    )

    return Response.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Save failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
