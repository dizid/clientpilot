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
  'HN Who\'s Hiring',
  'Follow-up (3-day)',
  'Follow-up (7-day)',
]

function humanize(key: string): string {
  return KEY_LABELS[key] ?? key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
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
    content: typeof value === 'string' ? value : JSON.stringify(value, null, 2),
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
        const posts = content.posts as string[] | undefined
        if (!Array.isArray(posts)) return [{ label: 'Content', content: JSON.stringify(content) }]
        return posts.map((text, i) => ({ label: `Post ${i + 1}`, content: text }))
      }

      case 'outreach_templates': {
        const templates = content.templates as string[] | undefined
        if (!Array.isArray(templates)) return [{ label: 'Content', content: JSON.stringify(content) }]
        return templates.map((text, i) => ({
          label: OUTREACH_LABELS[i] ?? `Template ${i + 1}`,
          content: text,
        }))
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
