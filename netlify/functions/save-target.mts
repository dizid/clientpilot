import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireString } from './lib/validate.mjs'

interface SaveTargetBody {
  name: string
  niche: string
  platform: string
  pain_point: string
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const body = await req.json() as SaveTargetBody
    const { name, niche, platform, pain_point } = body

    // Validate inputs before any DB queries
    const validationError = validate(
      requireString(name, 'name', 1, 100),
      requireString(niche, 'niche', 1, 100),
      requireString(platform, 'platform', 1, 50),
      requireString(pain_point, 'pain_point', 1, 500)
    )

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    const result = await query(
      'INSERT INTO targets (user_id, name, niche, platform, pain_point) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user.id, name, niche, platform, pain_point]
    )

    return Response.json({ target: result.rows[0] })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Save failed'
    console.error('save-target error:', e)
    return Response.json({ error: message }, { status: 500 })
  }
}
