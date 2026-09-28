/**
 * One Claude call that must return a JSON object (sync functions — caller
 * passes the time budget it has left). Throws "Anthropic…" errors, which
 * safeError passes through to the user.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'

export async function callClaudeJson(prompt: string, maxTokens: number, timeoutMs: number): Promise<Record<string, unknown>> {
  if (!ANTHROPIC_API_KEY) throw new Error('Anthropic API key is not configured')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let response: Response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }]
      }),
      signal: controller.signal
    })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    console.error('Anthropic API error', response.status, await response.text())
    throw new Error(`Anthropic service returned ${response.status} — please try again.`)
  }

  const data = await response.json() as { content: Array<{ text: string }> }
  const jsonMatch = data.content[0]?.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Anthropic returned an unreadable response — please try again.')
  return JSON.parse(jsonMatch[0])
}
