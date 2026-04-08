import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { buildProfileContext, PROMPTS, Profile, MAX_TOKENS_BY_TYPE } from './lib/prompts.mjs'
import { parsePieces } from './lib/parse-pieces.mjs'
import { validate, requireOneOf, requireUUID } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
// Haiku 4.5 is ~2x faster than Sonnet 4.6 — required to fit comfortably under
// Netlify's 26s sync function timeout. Override with CLAUDE_MODEL env var
// if you want to trade speed for quality (and only if you also raise the timeout).
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'

// Abort the Anthropic call before Netlify kills the function (hard 26s timeout in netlify.toml).
// We give Claude 23s and reserve ~3s for response parsing + DB writes + cold start overhead.
const ANTHROPIC_TIMEOUT_MS = 23000

interface TargetRow {
  id: number
  niche: string
  platform: string
  pain_point: string
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    const { type, target_id } = await req.json()

    // Validate inputs before any DB queries
    const validationError = validate(
      requireOneOf(type, 'type', Object.keys(PROMPTS)),
      // target_id is optional — only validate format when provided
      (target_id !== undefined && target_id !== null)
        ? requireUUID(target_id, 'target_id')
        : null
    )

    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    // Check limits for free users
    if (user.plan === 'free' && user.generations_used >= 1) {
      return Response.json({ error: 'Free tier limit reached. Please upgrade.' }, { status: 403 })
    }

    // Get profile
    const profileResult = await query(
      'SELECT * FROM profiles WHERE user_id = $1',
      [user.id]
    )

    if (profileResult.rows.length === 0) {
      return Response.json({ error: 'Please set up your profile first' }, { status: 400 })
    }

    const profile = profileResult.rows[0] as Profile
    let profileContext = buildProfileContext(profile, user.name)

    // Append target context if a target_id was provided
    let target: TargetRow | null = null
    if (target_id) {
      const targetResult = await query(
        'SELECT * FROM targets WHERE id = $1 AND user_id = $2',
        [target_id, user.id]
      )

      if (targetResult.rows.length > 0) {
        target = targetResult.rows[0] as TargetRow
        profileContext += `\nTarget Context:\nNiche: ${target.niche}\nPlatform: ${target.platform}\nKey Pain Point: ${target.pain_point}`
      }
    }

    const prompt = PROMPTS[type](profileContext)
    const maxTokens = MAX_TOKENS_BY_TYPE[type] ?? 4096

    // Call Claude with an explicit abort so we can return a clean 504 before Netlify kills us.
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
      return Response.json(
        { error: `AI service returned ${response.status}. Please try again in a moment.` },
        { status: 502 }
      )
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

    // Save generation (include target_id if present)
    const generationResult = await query(
      'INSERT INTO generations (user_id, type, content, target_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [user.id, type, JSON.stringify(content), target_id ?? null]
    )

    const generationId = generationResult.rows[0].id as number

    // Parse into individual pieces and batch-insert
    const parsedPieces = parsePieces(type, content)

    // Batch insert all pieces in a single query instead of N+1 sequential INSERTs
    if (parsedPieces.length > 0) {
      const values = parsedPieces.map((_, i) =>
        `($1, $2, $3, $${4 + i * 2}, $${5 + i * 2})`
      ).join(', ')
      const params = [
        user.id, generationId, type,
        ...parsedPieces.flatMap(p => [p.label, p.content])
      ]
      await query(
        `INSERT INTO pieces (user_id, generation_id, type, label, content) VALUES ${values}`,
        params
      )
    }

    // Increment usage
    await query(
      'UPDATE users SET generations_used = generations_used + 1, updated_at = NOW() WHERE id = $1',
      [user.id]
    )

    return Response.json({ generation: { type, content }, pieces: parsedPieces })
  } catch (e: unknown) {
    // AbortError = our 24s safety timeout fired before Anthropic responded → return 504 not 500
    const isAbort = e instanceof Error && e.name === 'AbortError'
    return Response.json(
      { error: safeError(e, 'Generation failed') },
      { status: isAbort ? 504 : 500 }
    )
  }
}
