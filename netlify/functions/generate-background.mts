import { query } from './lib/db.mjs'
import { buildProfileContext, PROMPTS, Profile, MAX_TOKENS_BY_TYPE } from './lib/prompts.mjs'
import { parsePieces } from './lib/parse-pieces.mjs'

/**
 * Background worker for content generation.
 *
 * Called internally by `generate.mts` after it has already authenticated
 * the user and inserted a `generations` row with status='queued'.
 *
 * Trust model: the caller is another Netlify Function in the same deploy.
 * We verify a shared INTERNAL_FUNCTION_SECRET so this endpoint can't be hit
 * directly from the internet to kick off free Claude calls.
 *
 * Netlify Background Functions (*-background) have a 15 min hard timeout on
 * all plans (including Starter), which is why we use this pattern.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const INTERNAL_SECRET = process.env.INTERNAL_FUNCTION_SECRET
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'

// 12 minutes — well under Netlify's 15 min background function ceiling,
// but generous enough for Claude cold starts + long outputs.
const ANTHROPIC_TIMEOUT_MS = 12 * 60 * 1000

interface WorkerBody {
  generation_id: string
  user_id: string
  user_name: string
  type: string
  target_id: string | null
}

export default async (req: Request) => {
  // Auth: shared secret header
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

  const { generation_id, user_id, user_name, type, target_id } = body

  try {
    // Mark as running (from queued)
    await query(
      "UPDATE generations SET status = 'running' WHERE id = $1 AND status = 'queued'",
      [generation_id]
    )

    // Fetch profile
    const profileResult = await query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [user_id]
    )
    if (profileResult.rows.length === 0) {
      await markFailed(generation_id, 'Profile not found')
      return Response.json({ ok: false })
    }

    const profile = profileResult.rows[0] as Profile
    let profileContext = buildProfileContext(profile, user_name)

    // Append target context if target_id provided
    if (target_id) {
      const targetResult = await query(
        'SELECT * FROM targets WHERE id = $1 AND user_id = $2',
        [target_id, user_id]
      )
      if (targetResult.rows.length > 0) {
        const t = targetResult.rows[0]
        profileContext += `\nTarget Context:\nNiche: ${t.niche}\nPlatform: ${t.platform}\nKey Pain Point: ${t.pain_point}`
      }
    }

    const prompt = PROMPTS[type](profileContext)
    const maxTokens = MAX_TOKENS_BY_TYPE[type] ?? 4096

    // Call Claude with long timeout
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
          max_tokens: maxTokens,
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
      await markFailed(generation_id, `AI service returned ${response.status}`)
      return Response.json({ ok: false })
    }

    const data = await response.json() as { content: Array<{ text: string }> }
    const rawText = data.content[0].text

    // Parse JSON from response (Claude sometimes wraps in markdown)
    let content: Record<string, unknown>
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      content = jsonMatch ? JSON.parse(jsonMatch[0]) : { text: rawText }
    } catch {
      content = { text: rawText }
    }

    // Parse into individual pieces
    const parsedPieces = parsePieces(type, content)

    // Batch insert pieces + update generation row + bump user counter in one transaction-ish flow
    // (three separate queries — we don't have a BEGIN/COMMIT helper but ordering matters: pieces first, then mark complete)
    if (parsedPieces.length > 0) {
      const values = parsedPieces.map((_, i) =>
        `($1, $2, $3, $${4 + i * 2}, $${5 + i * 2})`
      ).join(', ')
      const params = [
        user_id, generation_id, type,
        ...parsedPieces.flatMap(p => [p.label, p.content])
      ]
      await query(
        `INSERT INTO pieces (user_id, generation_id, type, label, content) VALUES ${values}`,
        params
      )
    }

    // Save content JSON + mark complete
    await query(
      `UPDATE generations
       SET content = $1, status = 'complete', completed_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(content), generation_id]
    )

    // Only bump the free-tier counter on success — users get their credit back on failure
    await query(
      'UPDATE users SET generations_used = generations_used + 1, updated_at = NOW() WHERE id = $1',
      [user_id]
    )

    return Response.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('Background generate failed', msg, e)
    await markFailed(generation_id, msg.slice(0, 500))
    return Response.json({ ok: false })
  }
}

async function markFailed(generationId: string, reason: string): Promise<void> {
  try {
    await query(
      `UPDATE generations
       SET status = 'failed', error = $1, completed_at = NOW()
       WHERE id = $2 AND status IN ('queued', 'running')`,
      [reason, generationId]
    )
  } catch (e) {
    console.error('Failed to mark generation as failed', e)
  }
}
