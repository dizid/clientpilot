import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { safeError } from './lib/errors.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    // Check whether the user has completed onboarding (has a profile row)
    const profileResult = await query(
      'SELECT 1 FROM profiles WHERE user_id = $1 LIMIT 1',
      [user.id]
    )
    return Response.json({
      user: {
        plan: user.plan,
        generations_used: user.generations_used,
        has_profile: profileResult.rows.length > 0,
      }
    })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Authentication failed') }, { status: 401 })
  }
}
