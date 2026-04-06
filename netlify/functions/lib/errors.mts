// Sanitize error messages — never expose internals (DB tables, API keys, query structure) to clients
export function safeError(e: unknown, fallback: string): string {
  console.error(fallback, e)
  return fallback
}
