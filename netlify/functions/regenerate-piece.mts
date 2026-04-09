import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireUUID, optionalString } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

/**
 * Sync enqueue for single-piece regeneration.
 *
 * Marks the piece as regen_status='running', dispatches the background
 * worker, returns { piece_id, status: 'running' }.
 *
 * Client should poll /get-piece-status until regen_status clears.
 */

const INTERNAL_SECRET = process.env.INTERNAL_FUNCTION_SECRET

interface RegeneratePieceBody {
  pieceId: string
  feedback?: string
}

interface PieceRow {
  id: string
  user_id: string
  type: string
  regen_status: string | null
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const body = await req.json() as RegeneratePieceBody
    const { pieceId, feedback } = body

    const validationError = validate(
      requireUUID(pieceId, 'pieceId'),
      optionalString(feedback, 'feedback', 500)
    )
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Verify ownership + check not already running
    const pieceResult = await query(
      'SELECT id, user_id, type, regen_status FROM pieces WHERE id = $1 AND user_id = $2',
      [pieceId, user.id]
    )
    if (pieceResult.rows.length === 0) {
      return Response.json({ error: 'Piece not found' }, { status: 404 })
    }

    const piece = pieceResult.rows[0] as PieceRow
    if (piece.regen_status === 'running') {
      return Response.json({ error: 'Regeneration already in progress' }, { status: 409 })
    }

    // Mark as running, clear any previous error
    await query(
      `UPDATE pieces
       SET regen_status = 'running', regen_error = NULL, updated_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [pieceId, user.id]
    )

    // Dispatch background worker
    if (!INTERNAL_SECRET) {
      await clearRegenStatus(pieceId, 'INTERNAL_FUNCTION_SECRET not configured')
      return Response.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const origin = process.env.SITE_URL || 'https://clientpilot.dev'
    const invokeUrl = `${origin}/.netlify/functions/regenerate-piece-background`

    try {
      const invokeRes = await fetch(invokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': INTERNAL_SECRET,
        },
        body: JSON.stringify({
          piece_id: pieceId,
          user_id: user.id,
          user_name: user.name,
          feedback: feedback ?? null,
        }),
      })

      if (invokeRes.status !== 202 && !invokeRes.ok) {
        const txt = await invokeRes.text()
        console.error('Background dispatch failed', invokeRes.status, txt)
        await clearRegenStatus(pieceId, `Background dispatch failed: ${invokeRes.status}`)
        return Response.json({ error: 'Failed to start regeneration' }, { status: 500 })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'dispatch failed'
      console.error('Background dispatch threw', msg)
      await clearRegenStatus(pieceId, msg.slice(0, 500))
      return Response.json({ error: 'Failed to start regeneration' }, { status: 500 })
    }

    return Response.json({ piece_id: pieceId, status: 'running' }, { status: 202 })
  } catch (e: unknown) {
    return Response.json(
      { error: safeError(e, 'Regeneration failed') },
      { status: 500 }
    )
  }
}

async function clearRegenStatus(pieceId: string, reason: string): Promise<void> {
  try {
    await query(
      `UPDATE pieces
       SET regen_status = 'failed', regen_error = $1, updated_at = NOW()
       WHERE id = $2`,
      [reason, pieceId]
    )
  } catch (e) {
    console.error('clearRegenStatus query error', e)
  }
}
