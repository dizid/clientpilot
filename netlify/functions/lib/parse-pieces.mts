export interface Piece {
  label: string
  content: string
}

// Maps object keys to human-readable labels
const KEY_LABELS: Record<string, string> = {
  // platform_profile
  short_bio: 'Short Bio',
  full_bio: 'Full Bio',
  skills_list: 'Skills List',
  availability: 'Availability',
  pricing: 'Pricing',
  // portfolio_page
  hero_headline: 'Hero Headline',
  hero_subtitle: 'Hero Subtitle',
  services: 'Services',
  case_studies: 'Case Studies',
  why_hire: 'Why Hire Me',
  process: 'Process',
  cta: 'CTA',
  // elevator_pitch
  elevator_pitch: 'Elevator Pitch',
  twitter_bio: 'Twitter Bio',
  linkedin_headline: 'LinkedIn Headline',
  email_signature: 'Email Signature',
  github_readme: 'GitHub README',
  one_liner: 'One-Liner',
}

const OUTREACH_LABELS = [
  'Cold - Funded Startup',
  'Cold - CTO/Tech Lead',
  'Cold - Agency',
  'Warm - Former Colleague',
  'LinkedIn Engagement',
  'Platform Response',
]

function humanize(key: string): string {
  return KEY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Render an arbitrary JSON value as readable plain-text / light markdown.
 * Claude sometimes returns structured objects where the prompt asked for strings —
 * e.g. `services` as `[{title, description, timeline, price_range}, ...]` instead
 * of a single string. Dumping raw JSON into the user's workspace is unusable;
 * this renders the data as something a human can actually paste into LinkedIn / email.
 */
function renderValue(value: unknown, depth = 0): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  if (Array.isArray(value)) {
    // Array of strings → bullet list
    if (value.every(v => typeof v === 'string')) {
      return value.map(v => `• ${v}`).join('\n')
    }
    // Array of objects → numbered sections, each rendered recursively
    return value
      .map((v, i) => {
        const rendered = renderValue(v, depth + 1)
        // If the item is an object, show its first string field as a title if possible
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          return `${i + 1}. ${rendered}`
        }
        return `${i + 1}. ${rendered}`
      })
      .join('\n\n')
  }

  if (typeof value === 'object') {
    // Object → render each entry as "Label: value", skipping empty ones
    const obj = value as Record<string, unknown>
    return Object.entries(obj)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => {
        const label = humanize(k)
        const rendered = renderValue(v, depth + 1)
        // Multi-line values get a newline after the label; scalars stay inline
        if (rendered.includes('\n')) return `${label}:\n${rendered}`
        return `${label}: ${rendered}`
      })
      .join(depth === 0 ? '\n\n' : '\n')
  }

  // Fallback — should be unreachable
  return String(value)
}

function parseSections(sections: unknown): Piece[] {
  // sections may arrive as a plain object or as a JSON string
  let obj: Record<string, unknown>

  if (typeof sections === 'string') {
    try {
      obj = JSON.parse(sections)
    } catch {
      return [{ label: 'Content', content: sections }]
    }
  } else if (sections && typeof sections === 'object' && !Array.isArray(sections)) {
    obj = sections as Record<string, unknown>
  } else {
    return [{ label: 'Content', content: String(sections) }]
  }

  return Object.entries(obj).map(([key, value]) => ({
    label: humanize(key),
    content: renderValue(value),
  }))
}

/**
 * Splits a Claude AI response blob into individual labelled pieces.
 * Returns an array of { label, content } objects ready for DB insertion.
 */
export function parsePieces(type: string, content: Record<string, unknown>): Piece[] {
  try {
    switch (type) {
      case 'linkedin_posts': {
        const posts = content.posts as unknown
        if (!Array.isArray(posts)) return [{ label: 'Content', content: JSON.stringify(content) }]
        // Same unwrap pattern as outreach_templates — handle {text} / {content} wrappers
        return posts.map((p: unknown, i: number) => {
          let text: string
          if (typeof p === 'string') {
            text = p
          } else if (p && typeof p === 'object') {
            const obj = p as Record<string, unknown>
            if (typeof obj.content === 'string') text = obj.content
            else if (typeof obj.text === 'string') text = obj.text
            else if (typeof obj.post === 'string') text = obj.post
            else text = renderValue(obj)
          } else {
            text = String(p)
          }
          return { label: `Post ${i + 1}`, content: text }
        })
      }

      case 'outreach_templates': {
        const templates = content.templates as unknown
        if (!Array.isArray(templates)) return [{ label: 'Content', content: JSON.stringify(content) }]
        // Claude often returns either ["template1", ...] (desired) OR
        // [{name, content}, ...] (unhelpful wrapper). Unwrap both shapes into plain text
        // so the user sees a usable template, not a JSON blob, in the workspace.
        return templates.map((t: unknown, i: number) => {
          let text: string
          if (typeof t === 'string') {
            text = t
          } else if (t && typeof t === 'object') {
            const obj = t as Record<string, unknown>
            // Prefer an explicit content field if present; otherwise fall back
            // to the first string value; otherwise render the whole object.
            if (typeof obj.content === 'string') text = obj.content
            else if (typeof obj.text === 'string') text = obj.text
            else if (typeof obj.body === 'string') text = obj.body
            else {
              const firstString = Object.values(obj).find(v => typeof v === 'string' && v.length > 30)
              text = (firstString as string) ?? renderValue(obj)
            }
          } else {
            text = String(t)
          }
          return {
            label: OUTREACH_LABELS[i] ?? `Template ${i + 1}`,
            content: text,
          }
        })
      }

      case 'devto_article': {
        const text = content.text as string | undefined
        if (typeof text !== 'string') return [{ label: 'Article', content: JSON.stringify(content) }]
        return [{ label: 'Article', content: text }]
      }

      case 'platform_profile': {
        const sections = content.sections
        if (!sections) return [{ label: 'Content', content: JSON.stringify(content) }]
        return parseSections(sections)
      }

      case 'portfolio_page': {
        const sections = content.sections
        if (!sections) return [{ label: 'Content', content: JSON.stringify(content) }]
        return parseSections(sections)
      }

      case 'elevator_pitch': {
        const sections = content.sections
        if (!sections) return [{ label: 'Content', content: JSON.stringify(content) }]
        return parseSections(sections)
      }

      default:
        return [{ label: 'Content', content: JSON.stringify(content) }]
    }
  } catch {
    // If anything blows up, return a safe fallback
    return [{ label: 'Content', content: JSON.stringify(content) }]
  }
}
