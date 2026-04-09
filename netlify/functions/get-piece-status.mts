import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { requireUUID, validate } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

/**
 * Polling endpoint for single-piece regeneration.
 *
 * Returns the current piece row including regen_status. When regen_status
 * is NULL and the row was recently updated, regeneration succeeded and the
 * fresh content is included.
 */

interface PieceRow {
  id: string
  generation_id: string
  type: string
  label: string
  content: string
  status: string
  regen_status: 'running' | 'failed' | null
  regen_error: string | null
  updated_at: string
  created_at: string
}

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const url = new URL(req.url)
    const pieceId = url.searchParams.get('id')

    const validationError = validate(requireUUID(pieceId, 'id'))
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    const result = await query(
      `SELECT id, generation_id, type, label, content, status,
              regen_status, regen_error, updated_at, created_at
       FROM pieces
       WHERE id = $1 AND user_id = $2`,
      [pieceId, user.id]
    )

    if (result.rows.length === 0) {
      return Response.json({ error: 'Piece not found' }, { status: 404 })
    }

    const piece = result.rows[0] as PieceRow

    return Response.json({ piece })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Status check failed') }, { status: 500 })
  }
}
