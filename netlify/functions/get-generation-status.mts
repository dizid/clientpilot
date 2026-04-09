import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { requireUUID, validate } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

/**
 * Polling endpoint for async generation.
 *
 * Client calls this every ~2s after POST /generate returns.
 * Returns { status, error?, generation?, pieces? }.
 *
 * When status === 'complete', pieces are included so the client can
 * render without a second round-trip.
 */

interface PieceRow {
  id: string
  generation_id: string
  type: string
  label: string
  content: string
  status: string
  updated_at: string
  created_at: string
}

interface GenerationRow {
  id: string
  user_id: string
  type: string
  content: Record<string, unknown> | null
  target_id: string | null
  status: 'queued' | 'running' | 'complete' | 'failed'
  error: string | null
  completed_at: string | null
  created_at: string
}

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)

    const url = new URL(req.url)
    const generationId = url.searchParams.get('id')

    const validationError = validate(requireUUID(generationId, 'id'))
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Fetch generation row — scoped to this user (prevents IDOR)
    const genResult = await query(
      `SELECT id, user_id, type, content, target_id, status, error, completed_at, created_at
       FROM generations
       WHERE id = $1 AND user_id = $2`,
      [generationId, user.id]
    )

    if (genResult.rows.length === 0) {
      return Response.json({ error: 'Generation not found' }, { status: 404 })
    }

    const gen = genResult.rows[0] as GenerationRow

    // Still running — return status only
    if (gen.status === 'queued' || gen.status === 'running') {
      return Response.json({ status: gen.status })
    }

    // Failed — return the error message so the client can show it
    if (gen.status === 'failed') {
      return Response.json({
        status: 'failed',
        error: gen.error || 'Generation failed',
      })
    }

    // Complete — include pieces for this generation
    const piecesResult = await query(
      `SELECT id, generation_id, type, label, content, status, updated_at, created_at
       FROM pieces
       WHERE generation_id = $1 AND user_id = $2
       ORDER BY created_at ASC`,
      [generationId, user.id]
    )

    const pieces = piecesResult.rows as PieceRow[]

    return Response.json({
      status: 'complete',
      generation: {
        id: gen.id,
        type: gen.type,
        content: gen.content,
        created_at: gen.created_at,
      },
      pieces,
    })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Status check failed') }, { status: 500 })
  }
}
