import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'

interface DeletePieceBody {
  id: number
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const body = await req.json() as DeletePieceBody
    const { id } = body

    if (!id) {
      return Response.json({ error: 'Missing piece id' }, { status: 400 })
    }

    const result = await query(
      'DELETE FROM pieces WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user.id]
    )

    if (result.rows.length === 0) {
      return Response.json({ error: 'Piece not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Delete failed'
    console.error('delete-piece error:', e)
    return Response.json({ error: message }, { status: 500 })
  }
}
