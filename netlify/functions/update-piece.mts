import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireUUID, requireOneOf, optionalString } from './lib/validate.mjs'

const VALID_STATUSES = ['draft', 'used', 'replied'] as const
type Status = typeof VALID_STATUSES[number]

interface UpdatePieceBody {
  id: string
  content?: string
  status?: string
}

export default async (req: Request) => {
  if (req.method !== 'PATCH') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const body = await req.json() as UpdatePieceBody
    const { id, content, status } = body

    // Validate inputs before any DB queries
    const validationError = validate(
      requireUUID(id, 'id'),
      status !== undefined ? requireOneOf(status, 'status', [...VALID_STATUSES]) : null,
      content !== undefined ? optionalString(content, 'content', 10000) : null
    )

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Build SET clause dynamically from provided fields
    const setClauses: string[] = ['updated_at = NOW()']
    const params: unknown[] = []
    let paramIndex = 1

    if (content !== undefined) {
      setClauses.push(`content = $${paramIndex}`)
      params.push(content)
      paramIndex++
    }

    if (status !== undefined) {
      setClauses.push(`status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (setClauses.length === 1) {
      // Only updated_at — nothing actually changed
      return Response.json({ error: 'No fields to update' }, { status: 400 })
    }

    // id and user_id go at the end for the WHERE clause
    params.push(id)
    params.push(user.id)

    const sql = `
      UPDATE pieces
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
      RETURNING *
    `

    const result = await query(sql, params)

    if (result.rows.length === 0) {
      return Response.json({ error: 'Piece not found' }, { status: 404 })
    }

    return Response.json({ piece: result.rows[0] })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Update failed'
    console.error('update-piece error:', e)
    return Response.json({ error: message }, { status: 500 })
  }
}
