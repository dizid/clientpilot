import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const result = await query(
      `SELECT
        COUNT(*)::int AS total_pieces,
        COUNT(*) FILTER (WHERE status = 'used' AND created_at > NOW() - INTERVAL '7 days')::int AS used_this_week,
        COUNT(*) FILTER (WHERE status = 'replied')::int AS total_replies,
        COUNT(DISTINCT type)::int AS content_types_generated
       FROM pieces
       WHERE user_id = $1`,
      [user.id]
    )

    return Response.json({ stats: result.rows[0] })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Fetch failed'
    console.error('get-stats error:', e)
    return Response.json({ error: message }, { status: 500 })
  }
}
