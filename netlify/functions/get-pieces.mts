import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { safeError } from './lib/errors.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const url = new URL(req.url)
    const type = url.searchParams.get('type')

    let sql: string
    let params: unknown[]

    if (type) {
      sql = `
        SELECT p.*, t.name AS target_name, t.niche, t.platform
        FROM pieces p
        LEFT JOIN generations g ON p.generation_id = g.id
        LEFT JOIN targets t ON g.target_id = t.id
        WHERE p.user_id = $1 AND p.type = $2
        ORDER BY p.type, p.created_at DESC
      `
      params = [user.id, type]
    } else {
      sql = `
        SELECT p.*, t.name AS target_name, t.niche, t.platform
        FROM pieces p
        LEFT JOIN generations g ON p.generation_id = g.id
        LEFT JOIN targets t ON g.target_id = t.id
        WHERE p.user_id = $1
        ORDER BY p.type, p.created_at DESC
      `
      params = [user.id]
    }

    const result = await query(sql, params)

    return Response.json({ pieces: result.rows })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Failed to fetch pieces') }, { status: 500 })
  }
}
