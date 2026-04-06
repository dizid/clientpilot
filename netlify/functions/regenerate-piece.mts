import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { buildProfileContext } from './lib/prompts.mjs'
import { validate, requireUUID, optionalString } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514'

interface RegeneratePieceBody {
  pieceId: string
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

interface TargetRow {
  id: number
  niche: string
  platform: string
  pain_point: string
}

interface PieceRow {
  id: number
  user_id: number
  generation_id: number
  type: string
  label: string
  content: string
  status: string
  updated_at: string
  created_at: string
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const body = await req.json() as RegeneratePieceBody
    const { pieceId, feedback } = body

    // Validate inputs before any DB queries
    const validationError = validate(
      requireUUID(pieceId, 'pieceId'),
      optionalString(feedback, 'feedback', 500)
    )

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Fetch the piece and verify ownership
    const pieceResult = await query(
      'SELECT * FROM pieces WHERE id = $1 AND user_id = $2',
      [pieceId, user.id]
    )

    if (pieceResult.rows.length === 0) {
      return Response.json({ error: 'Piece not found' }, { status: 404 })
    }

    const piece = pieceResult.rows[0] as PieceRow

    // Fetch the generation's target (may be null if no target was linked)
    const targetResult = await query(
      `SELECT t.*
       FROM generations g
       LEFT JOIN targets t ON g.target_id = t.id
       WHERE g.id = $1`,
      [piece.generation_id]
    )

    const target = (targetResult.rows[0]?.id ? targetResult.rows[0] : null) as TargetRow | null

    // Fetch user profile
    const profileResult = await query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [user.id]
    )

    if (profileResult.rows.length === 0) {
      return Response.json({ error: 'Profile not found' }, { status: 400 })
    }

    const profile = profileResult.rows[0] as ProfileRow
    const profileContext = buildProfileContext(profile, user.name)

    // Build the focused rewrite prompt
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

    // Call Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      })
    })

    const data = await response.json() as { content: Array<{ text: string }> }
    const newContent = data.content[0].text.trim()

    // Persist the updated content
    const updateResult = await query(
      'UPDATE pieces SET content = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [newContent, pieceId, user.id]
    )

    return Response.json({ piece: updateResult.rows[0] })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Regeneration failed') }, { status: 500 })
  }
}
