import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireString, optionalString } from './lib/validate.mjs'

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const profile = await req.json()

    // Validate required and optional fields
    const validationError = validate(
      requireString(profile.headline, 'headline', 1, 200),
      requireString(profile.bio, 'bio', 1, 2000),
      // experience_years: must be a number between 0 and 70
      (typeof profile.experience_years !== 'number' || profile.experience_years < 0 || profile.experience_years > 70)
        ? 'experience_years must be a number between 0 and 70'
        : null,
      // skills: array, max 20 items, each string max 50 chars
      (!Array.isArray(profile.skills))
        ? 'skills must be an array'
        : profile.skills.length > 20
          ? 'skills: max 20 items allowed'
          : (profile.skills as unknown[]).some(s => typeof s !== 'string' || s.length > 50)
            ? 'skills: each item must be a string max 50 chars'
            : null,
      // tech_stack: array, max 20 items
      (!Array.isArray(profile.tech_stack))
        ? 'tech_stack must be an array'
        : profile.tech_stack.length > 20
          ? 'tech_stack: max 20 items allowed'
          : null,
      optionalString(profile.target_market, 'target_market'),
      optionalString(profile.pricing_model, 'pricing_model'),
      optionalString(profile.availability, 'availability')
    )

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

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
