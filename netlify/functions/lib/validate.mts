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

// ─── Profile JSON fields (save-profile) ────────────────────────
// projects and social_links used to be stored unchecked. A project without a
// `tech` array (or projects that weren't an array) made every later generation
// fail (buildProfileContext calls p.tech.join), and a multi-megabyte blob ended
// up in every AI prompt. Limits sit far above what the onboarding form and
// import-profile produce (import: 6 projects, 600-char descriptions).

export const PROFILE_LIMITS = {
  projects: 20,
  projectName: 200,
  projectDescription: 2000,
  projectUrl: 500,
  projectTimeline: 100,
  projectTech: 20,
  techItem: 50,
  socialLinks: 10,
  socialKey: 30,
  socialValue: 500
} as const

export interface ProfileProject {
  name: string
  description: string
  url: string
  tech: string[]
  timeline: string
}

const UNSAFE_URL_SCHEME = /^\s*(javascript|data|vbscript):/i

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Array of short strings (tech_stack, a project's tech). Missing = empty list. */
export function checkStringList(v: unknown, field: string, maxItems: number, maxLen: number): string | null {
  if (v === undefined || v === null) return null
  if (!Array.isArray(v)) return `${field} must be an array`
  if (v.length > maxItems) return `${field}: max ${maxItems} items allowed`
  if (v.some(s => typeof s !== 'string' || s.length > maxLen)) return `${field}: each item must be text, max ${maxLen} chars`
  return null
}

/** Error message for the first bad project, or null. Missing projects = none. */
export function checkProjects(v: unknown): string | null {
  if (v === undefined || v === null) return null
  if (!Array.isArray(v)) return 'projects must be an array'
  if (v.length > PROFILE_LIMITS.projects) return `projects: max ${PROFILE_LIMITS.projects} allowed`
  for (const p of v) {
    if (!isPlainObject(p)) return 'each project must be an object'
    const error = validate(
      requireString(p.name, 'project name', 1, PROFILE_LIMITS.projectName),
      optionalString(p.description, 'project description', PROFILE_LIMITS.projectDescription),
      optionalString(p.url, 'project link', PROFILE_LIMITS.projectUrl),
      optionalString(p.timeline, 'project timeline', PROFILE_LIMITS.projectTimeline),
      checkStringList(p.tech, 'project tech', PROFILE_LIMITS.projectTech, PROFILE_LIMITS.techItem),
      typeof p.url === 'string' && UNSAFE_URL_SCHEME.test(p.url) ? 'project link must be a web address' : null
    )
    if (error) return error
  }
  return null
}

/** Projects in the exact shape the prompts expect. Call only after checkProjects passed. */
export function normalizeProjects(v: unknown): ProfileProject[] {
  if (!Array.isArray(v)) return []
  return v.map((p: Record<string, unknown>) => ({
    name: p.name as string,
    description: typeof p.description === 'string' ? p.description : '',
    url: typeof p.url === 'string' ? p.url : '',
    tech: Array.isArray(p.tech) ? p.tech as string[] : [],
    timeline: typeof p.timeline === 'string' ? p.timeline : ''
  }))
}

/** social_links: a small { name: text } object. Missing = no links. */
export function checkSocialLinks(v: unknown): string | null {
  if (v === undefined || v === null) return null
  if (!isPlainObject(v)) return 'social_links must be an object'
  const entries = Object.entries(v)
  if (entries.length > PROFILE_LIMITS.socialLinks) return `social_links: max ${PROFILE_LIMITS.socialLinks} links allowed`
  for (const [key, value] of entries) {
    if (key.length > PROFILE_LIMITS.socialKey) return 'social_links: link name too long'
    if (value !== null && (typeof value !== 'string' || value.length > PROFILE_LIMITS.socialValue)) {
      return `social_links: each link must be text, max ${PROFILE_LIMITS.socialValue} chars`
    }
  }
  return null
}

/** social_links with only the text values (null values dropped). Call only after checkSocialLinks passed. */
export function normalizeSocialLinks(v: unknown): Record<string, string> {
  if (!isPlainObject(v)) return {}
  return Object.fromEntries(
    Object.entries(v).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}

// ─── Sanitizers for AI output ──────────────────────────────────

export function cleanString(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export function cleanStringArray(v: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(v)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of v) {
    const s = cleanString(item, maxLen)
    if (s && !seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase())
      out.push(s)
    }
    if (out.length >= maxItems) break
  }
  return out
}

export function cleanHttpUrl(v: unknown): string {
  const s = cleanString(v, 500)
  return /^https?:\/\/\S+$/i.test(s) ? s : ''
}
