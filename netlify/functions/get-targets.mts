import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const result = await query(
      'SELECT * FROM targets WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    )

    return Response.json({ targets: result.rows })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Fetch failed'
    console.error('get-targets error:', e)
    return Response.json({ error: message }, { status: 500 })
  }
}
