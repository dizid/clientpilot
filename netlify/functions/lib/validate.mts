// Validation helpers — return error string or null

export function requireString(value: unknown, field: string, min = 1, max = 5000): string | null {
  if (typeof value !== 'string' || value.trim().length < min) return `${field} is required (min ${min} chars)`
  if (value.length > max) return `${field} too long (max ${max} chars)`
  return null
}

export function requireOneOf(value: unknown, field: string, allowed: string[]): string | null {
  if (!allowed.includes(value as string)) return `${field} must be one of: ${allowed.join(', ')}`
  return null
}

export function optionalString(value: unknown, field: string, max = 5000): string | null {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string') return `${field} must be a string`
  if (value.length > max) return `${field} too long (max ${max} chars)`
  return null
}

export function requireUUID(value: unknown, field: string): string | null {
  if (typeof value !== 'string') return `${field} is required`
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return `${field} must be a valid UUID`
  return null
}

// Collect all checks, return first error found or null
export function validate(...checks: (string | null)[]): string | null {
  return checks.find(c => c !== null) ?? null
}
