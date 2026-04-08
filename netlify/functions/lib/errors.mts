// Sanitize error messages — never expose internals (DB tables, API keys, query structure) to clients.
// Logs the full error for debugging, but only returns a vetted message to the user:
//   - AbortError → friendly timeout message
//   - Errors whose message starts with a known-safe prefix (auth/Anthropic surface errors) pass through
//   - Anything else → generic fallback
export function safeError(e: unknown, fallback: string): string {
  console.error(fallback, e)
  if (e instanceof Error) {
    if (e.name === 'AbortError') {
      return 'Generation took too long and was cancelled. Please try again or pick a faster content type.'
    }
    if (/^(Anthropic|Missing authorization|Invalid token|Please set up)/i.test(e.message)) {
      return e.message
    }
  }
  return fallback
}
