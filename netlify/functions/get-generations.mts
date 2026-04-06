import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { safeError } from './lib/errors.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const result = await query(
      'SELECT id, type, content, created_at FROM generations WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    )

    return Response.json({ generations: result.rows })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Failed to fetch generations') }, { status: 500 })
  }
}
