import { query } from './lib/db.mjs'
import { buildProfileContext } from './lib/prompts.mjs'

/**
 * Background worker for single-piece regeneration.
 *
 * Called by regenerate-piece.mts after the piece has been marked
 * regen_status='running' and ownership verified.
 *
 * Same shared-secret trust model as generate-background.mts.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const INTERNAL_SECRET = process.env.INTERNAL_FUNCTION_SECRET
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'

const ANTHROPIC_TIMEOUT_MS = 12 * 60 * 1000

interface WorkerBody {
  piece_id: string
  user_id: string
  user_name: string
  feedback?: string
}

interface ProfileRow {
  headline: string
  bio: string
  skills: string[]
  tech_stack: string[]
  experience_years: number
  projects: Array<{ name: string; description: string; url: string; tech: string[]; timeline: string }>
  social_links: Record<string, string>
  target_market: string
  pricing_model: string
  availability: string
}

interface PieceRow {
  id: string
  user_id: string
  generation_id: string
  type: string
  label: string
  content: string
}

interface TargetRow {
  id: string
  niche: string
  platform: string
  pain_point: string
}

export default async (req: Request) => {
  const secret = req.headers.get('x-internal-secret')
  if (!INTERNAL_SECRET || secret !== INTERNAL_SECRET) {
    return new Response('Forbidden', { status: 403 })
  }

  let body: WorkerBody
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { piece_id, user_id, user_name, feedback } = body

  try {
    // Fetch the piece — ownership already verified by caller, but we re-read
    // fresh state here in case anything changed between enqueue and dispatch.
    const pieceResult = await query(
      'SELECT * FROM pieces WHERE id = $1 AND user_id = $2',
      [piece_id, user_id]
    )
    if (pieceResult.rows.length === 0) {
      return Response.json({ ok: false, reason: 'piece_not_found' })
    }
    const piece = pieceResult.rows[0] as PieceRow

    // Fetch the generation's target (may be null)
    const targetResult = await query(
      `SELECT t.*
       FROM generations g
       LEFT JOIN targets t ON g.target_id = t.id
       WHERE g.id = $1`,
      [piece.generation_id]
    )
    const target = (targetResult.rows[0]?.id ? targetResult.rows[0] : null) as TargetRow | null

    // Profile
    const profileResult = await query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [user_id]
    )
    if (profileResult.rows.length === 0) {
      await markFailed(piece_id, 'Profile not found')
      return Response.json({ ok: false })
    }
    const profile = profileResult.rows[0] as ProfileRow
    const profileContext = buildProfileContext(profile, user_name)

    const targetSection = target
      ? `Target Context:\nNiche: ${target.niche}\nPlatform: ${target.platform}\nKey Pain Point: ${target.pain_point}\n`
      : ''
    const feedbackSection = feedback ? `User feedback: ${feedback}\n` : ''

    const prompt = `You are rewriting a single piece of freelance marketing content.

Profile: ${profileContext}
${targetSection}
Content type: ${piece.type}
Original piece (label: "${piece.label}"): ${piece.content}
${feedbackSection}
Rewrite this single piece. Keep the same format and approximate length. Return ONLY the rewritten text, no JSON wrapper.`

    const controller = new AbortController()
    const abortTimer = setTimeout(() => controller.abort(), ANTHROPIC_TIMEOUT_MS)
    let response: Response
    try {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: 2048,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: controller.signal,
      })
    } finally {
      clearTimeout(abortTimer)
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error', response.status, errText)
      await markFailed(piece_id, `AI service returned ${response.status}`)
      return Response.json({ ok: false })
    }

    const data = await response.json() as { content: Array<{ text: string }> }
    const newContent = data.content[0].text.trim()

    // Persist updated content and clear regen_status
    await query(
      `UPDATE pieces
       SET content = $1, regen_status = NULL, regen_error = NULL, updated_at = NOW()
       WHERE id = $2 AND user_id = $3`,
      [newContent, piece_id, user_id]
    )

    return Response.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('Background regenerate failed', msg, e)
    await markFailed(piece_id, msg.slice(0, 500))
    return Response.json({ ok: false })
  }
}

async function markFailed(pieceId: string, reason: string): Promise<void> {
  try {
    await query(
      `UPDATE pieces
       SET regen_status = 'failed', regen_error = $1, updated_at = NOW()
       WHERE id = $2`,
      [reason, pieceId]
    )
  } catch (e) {
    console.error('Failed to mark piece as regen_failed', e)
  }
}
