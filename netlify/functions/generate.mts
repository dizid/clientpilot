import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { PROMPTS } from './lib/prompts.mjs'
import { validate, requireOneOf, requireUUID } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

/**
 * Sync enqueue endpoint.
 *
 * Authenticates the user, validates input, checks the free-tier limit,
 * inserts a `generations` row with status='queued', then invokes the
 * background worker with a shared-secret header.
 *
 * Returns immediately with { generation_id } so the frontend can poll
 * `get-generation-status`. Total latency target: <1s.
 *
 * This replaces the old inline-Claude-call approach, which couldn't fit
 * inside Netlify Starter's 10s sync-function ceiling.
 */

const INTERNAL_SECRET = process.env.INTERNAL_FUNCTION_SECRET

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const { type, target_id } = await req.json()

    // Validate inputs before any DB writes
    const validationError = validate(
      requireOneOf(type, 'type', Object.keys(PROMPTS)),
      (target_id !== undefined && target_id !== null)
        ? requireUUID(target_id, 'target_id')
        : null
    )
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Verify profile exists before we queue anything — cheap early-fail
    const profileCheck = await query(
      'SELECT 1 FROM profiles WHERE user_id = $1 LIMIT 1',
      [user.id]
    )
    if (profileCheck.rows.length === 0) {
      return Response.json({ error: 'Please set up your profile first' }, { status: 400 })
    }

    // Atomic free-tier limit: increment the counter NOW (at enqueue time) so
    // parallel requests can't all pass the check before any background worker
    // bumps the counter. The background worker decrements on failure so the
    // user gets their credit back if generation doesn't succeed.
    // Pro/lifetime users skip this — they have no limit.
    if (user.plan === 'free') {
      const limitResult = await query(
        `UPDATE users
         SET generations_used = generations_used + 1, updated_at = NOW()
         WHERE id = $1 AND generations_used < 1
         RETURNING id`,
        [user.id]
      )
      if (limitResult.rows.length === 0) {
        return Response.json({ error: 'Free tier limit reached. Please upgrade.' }, { status: 403 })
      }
    }

    // Insert the queued row
    const insertResult = await query(
      `INSERT INTO generations (user_id, type, target_id, status)
       VALUES ($1, $2, $3, 'queued')
       RETURNING id`,
      [user.id, type, target_id ?? null]
    )
    const generationId = insertResult.rows[0].id as string

    // Fire background worker — we await the invocation (not the work) so that
    // Netlify doesn't kill the request before the dispatch completes.
    // Background functions return 202 almost immediately.
    if (!INTERNAL_SECRET) {
      await markFailed(generationId, user.id, 'INTERNAL_FUNCTION_SECRET not configured')
      return Response.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const origin = process.env.SITE_URL || 'https://clientpilot.dev'
    const invokeUrl = `${origin}/.netlify/functions/generate-background`

    try {
      const invokeRes = await fetch(invokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': INTERNAL_SECRET,
        },
        body: JSON.stringify({
          generation_id: generationId,
          user_id: user.id,
          user_name: user.name,
          type,
          target_id: target_id ?? null,
        }),
      })

      // Background functions return 202 Accepted on successful dispatch
      if (invokeRes.status !== 202 && !invokeRes.ok) {
        const txt = await invokeRes.text()
        console.error('Background dispatch failed', invokeRes.status, txt)
        await markFailed(generationId, user.id, `Background dispatch failed: ${invokeRes.status}`)
        return Response.json({ error: 'Failed to start generation' }, { status: 500 })
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'dispatch failed'
      console.error('Background dispatch threw', msg)
      await markFailed(generationId, user.id, msg.slice(0, 500))
      return Response.json({ error: 'Failed to start generation' }, { status: 500 })
    }

    return Response.json({ generation_id: generationId, status: 'queued' }, { status: 202 })
  } catch (e: unknown) {
    return Response.json(
      { error: safeError(e, 'Generation failed') },
      { status: 500 }
    )
  }
}

async function markFailed(generationId: string, userId: string, reason: string): Promise<void> {
  try {
    await query(
      `UPDATE generations SET status = 'failed', error = $1, completed_at = NOW() WHERE id = $2`,
      [reason, generationId]
    )
    // Give the free-tier credit back — counter was incremented at enqueue time
    await query(
      'UPDATE users SET generations_used = GREATEST(generations_used - 1, 0), updated_at = NOW() WHERE id = $1',
      [userId]
    )
  } catch (e) {
    console.error('markFailed query error', e)
  }
}
