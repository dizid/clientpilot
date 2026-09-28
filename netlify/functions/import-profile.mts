import { authenticateRequest } from './lib/auth.mjs'
import { validate, optionalString, cleanString, cleanStringArray, cleanHttpUrl } from './lib/validate.mjs'
import { normalizeUrl, fetchPage, findSubpages, htmlToText, formatPageSection, extractSocialLinks } from './lib/web-fetch.mjs'
import { callClaudeJson } from './lib/claude-json.mjs'
import { safeError, errorStatus } from './lib/errors.mjs'
import { checkRateLimit, RATE_LIMIT_MESSAGE } from './lib/rate-limit.mjs'

/**
 * Import a freelancer profile from a portfolio URL, a GitHub username and/or
 * pasted text (CV, LinkedIn "About", ...).
 *
 * Flow: gather source text (fetch site + a few same-site subpages, GitHub
 * public API, pasted text) → one Claude call extracts the profile as JSON →
 * sanitize to the same limits save-profile enforces → return a DRAFT.
 * Nothing is saved here; the user reviews and saves via /save-profile.
 *
 * Synchronous function: everything must finish well inside Netlify's 26s
 * limit, so every network step has its own timeout and Claude gets whatever
 * budget is left (TOTAL_BUDGET_MS).
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN // optional — raises GitHub API rate limit

const TOTAL_BUDGET_MS = 23_000
const MAIN_PAGE_TIMEOUT_MS = 6_000
const SUBPAGE_TIMEOUT_MS = 4_000
const MIN_CLAUDE_BUDGET_MS = 8_000
const MAX_SUBPAGES = 3
const MAX_SOURCE_CHARS = 24_000
const MAX_PASTED_CHARS = 15_000

// Must match the <option> values in OnboardingView.vue
const TARGET_MARKETS = ['eu', 'us', 'global', 'startups']

// Subpages worth following from the portfolio home page
const SUBPAGE_PATTERN = /\/(about|work|projects?|portfolio|case-stud(y|ies)|resume|cv|services)(\/|$)/i

interface ImportedProject {
  name: string
  description: string
  url: string
  tech: string[]
  timeline: string
}

interface ImportedProfile {
  headline: string
  bio: string
  skills: string[]
  tech_stack: string[]
  experience_years: number
  projects: ImportedProject[]
  social_links: Record<string, string>
  target_market: string
}

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const startedAt = Date.now()

  try {
    const user = await authenticateRequest(req)
    const body = await req.json() as { url?: unknown; github?: unknown; text?: unknown }

    const validationError = validate(
      optionalString(body.url, 'url', 500),
      optionalString(body.github, 'github', 100),
      optionalString(body.text, 'text', MAX_PASTED_CHARS)
    )
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    const rawUrl = typeof body.url === 'string' ? body.url.trim() : ''
    const githubInput = typeof body.github === 'string' ? body.github.trim() : ''
    const pastedText = typeof body.text === 'string' ? body.text.trim() : ''

    if (!rawUrl && !githubInput && !pastedText) {
      return Response.json({ error: 'Give us a URL, a GitHub username or some text to import from.' }, { status: 400 })
    }

    if (!(await checkRateLimit(user.id, 'import_profile'))) {
      return Response.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 })
    }

    // ── Gather sources ────────────────────────────────────────────────────
    const sections: string[] = []
    const sources: string[] = []
    const foundLinks: Record<string, string> = {}
    const warnings: string[] = []

    let githubUser = parseGithubUsername(githubInput)
    if (githubInput && !githubUser) {
      warnings.push('That GitHub username looks invalid — skipped it.')
    }

    if (rawUrl) {
      const siteUrl = normalizeUrl(rawUrl)
      if (!siteUrl) {
        return Response.json({ error: 'That URL doesn\'t look valid. Try something like https://yoursite.com' }, { status: 400 })
      }

      const mainPage = await fetchPage(siteUrl, MAIN_PAGE_TIMEOUT_MS)
      if (!mainPage) {
        warnings.push('We couldn\'t load your website — check the URL or use GitHub / paste text instead.')
      } else {
        sections.push(formatPageSection(mainPage.finalUrl, mainPage.html))
        sources.push(mainPage.finalUrl)
        Object.assign(foundLinks, extractSocialLinks(mainPage.html))
        if (!foundLinks.website) foundLinks.website = siteUrl.origin

        // Portfolio links to a GitHub profile? Use it — also rescues JS-only sites.
        if (!githubUser && foundLinks.github) githubUser = parseGithubUsername(foundLinks.github)

        const subpageUrls = findSubpages(mainPage.html, new URL(mainPage.finalUrl), SUBPAGE_PATTERN, MAX_SUBPAGES)
        const subpages = await Promise.all(subpageUrls.map(u => fetchPage(u, SUBPAGE_TIMEOUT_MS)))
        for (const page of subpages) {
          if (!page) continue
          sections.push(formatPageSection(page.finalUrl, page.html))
          sources.push(page.finalUrl)
          Object.assign(foundLinks, { ...extractSocialLinks(page.html), ...foundLinks })
        }

        if (htmlToText(mainPage.html).length < 200) {
          warnings.push('Your site renders mostly with JavaScript, so we could only read part of it. Adding GitHub or pasted text will improve results.')
        }
      }
    }

    if (githubUser) {
      const gh = await fetchGithub(githubUser)
      if (gh) {
        sections.push(gh)
        sources.push(`github.com/${githubUser}`)
        foundLinks.github = `https://github.com/${githubUser}`
      } else {
        warnings.push(`We couldn't read GitHub profile "${githubUser}".`)
      }
    }

    if (pastedText) {
      sections.push(`=== PASTED BY USER ===\n${pastedText.slice(0, MAX_PASTED_CHARS)}`)
      sources.push('pasted text')
    }

    if (sections.length === 0) {
      return Response.json({ error: warnings[0] || 'Nothing to import from.', warnings }, { status: 422 })
    }

    // ── Extract with Claude ───────────────────────────────────────────────
    const sourceText = sections.join('\n\n').slice(0, MAX_SOURCE_CHARS)
    const remainingMs = TOTAL_BUDGET_MS - (Date.now() - startedAt)
    const extracted = await extractProfile(sourceText, Math.max(remainingMs, MIN_CLAUDE_BUDGET_MS))

    const profile = sanitizeProfile(extracted, foundLinks)

    return Response.json({ profile, sources, warnings })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Import failed — please try again or fill in the form manually.') }, { status: errorStatus(e) })
  }
}

// ─── GitHub ──────────────────────────────────────────────────────────────────

function parseGithubUsername(input: string): string | null {
  const cleaned = input.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?github\.com\//i, '').split(/[/?#]/)[0]
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(cleaned) ? cleaned : null
}

async function fetchGithub(username: string): Promise<string | null> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'ClientPilot'
  }
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SUBPAGE_TIMEOUT_MS)
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, signal: controller.signal }),
      fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=30`, { headers, signal: controller.signal })
    ])
    if (!userRes.ok) return null

    const u = await userRes.json() as Record<string, unknown>
    const repos = reposRes.ok ? await reposRes.json() as Array<Record<string, unknown>> : []

    const lines = [
      `=== GITHUB: ${username} ===`,
      `Name: ${u.name ?? ''}`,
      `Bio: ${u.bio ?? ''}`,
      `Company: ${u.company ?? ''}`,
      `Location: ${u.location ?? ''}`,
      `Blog/website: ${u.blog ?? ''}`,
      `Account created: ${u.created_at ?? ''}`,
      `Public repos: ${u.public_repos ?? ''}`,
      'Repositories (most recently pushed, forks excluded):'
    ]
    for (const r of repos.filter(r => !r.fork).slice(0, 20)) {
      const topics = Array.isArray(r.topics) ? (r.topics as string[]).join(', ') : ''
      lines.push(`- ${r.name} | ${r.description ?? 'no description'} | lang: ${r.language ?? '?'} | stars: ${r.stargazers_count ?? 0} | homepage: ${r.homepage ?? ''} | topics: ${topics}`)
    }
    return lines.join('\n')
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// ─── Claude extraction ───────────────────────────────────────────────────────

function buildExtractionPrompt(sourceText: string): string {
  return `You are extracting a freelancer's professional profile from their own website, GitHub and/or text they pasted. The profile will be used to write client outreach, so favor concrete, specific facts (numbers, outcomes, named technologies, real project names).

Rules:
- Only use facts present in the sources. Never invent projects, clients, metrics or years.
- If something is unknown, use "" / [] / 0.
- Write headline and bio in first person voice where appropriate, based on how the person describes themself.
- Pick the 2-6 most impressive, client-relevant projects. Skip trivial repos (dotfiles, forks, tutorials, configs).
- experience_years: only if stated or clearly derivable (e.g. "since 2012"); otherwise 0.
- target_market: one of "eu", "us", "global", "startups", or "" if unclear.

Return ONLY a JSON object, no markdown, with exactly this shape:
{
  "headline": "one-line professional headline, max 120 chars, e.g. 'Full-Stack Developer | Vue 3, Node.js & AI Integration'",
  "bio": "2-4 sentences: who they are, what they build, for whom, standout results. Max 600 chars.",
  "skills": ["up to 10 capability areas, e.g. 'API Development', 'AI Integration'"],
  "tech_stack": ["up to 15 concrete technologies, e.g. 'Vue 3', 'PostgreSQL'"],
  "experience_years": 0,
  "projects": [
    { "name": "", "description": "what it does + problem solved + outcome, 1-2 sentences", "url": "", "tech": [""], "timeline": "" }
  ],
  "target_market": ""
}

SOURCES:
${sourceText}`
}

function extractProfile(sourceText: string, timeoutMs: number): Promise<Record<string, unknown>> {
  return callClaudeJson(buildExtractionPrompt(sourceText), 2500, timeoutMs)
}

function sanitizeProfile(raw: Record<string, unknown>, foundLinks: Record<string, string>): ImportedProfile {
  const years = Math.round(Number(raw.experience_years))
  const projects = Array.isArray(raw.projects) ? raw.projects : []

  const socialLinks: Record<string, string> = {}
  for (const key of ['github', 'linkedin', 'twitter', 'website', 'devto']) {
    const url = cleanHttpUrl(foundLinks[key])
    if (url) socialLinks[key] = url
  }

  return {
    headline: cleanString(raw.headline, 200),
    bio: cleanString(raw.bio, 2000),
    skills: cleanStringArray(raw.skills, 20, 50),
    tech_stack: cleanStringArray(raw.tech_stack, 20, 50),
    experience_years: Number.isFinite(years) && years >= 0 && years <= 50 ? years : 0,
    projects: projects
      .filter((p): p is Record<string, unknown> => !!p && typeof p === 'object')
      .map(p => ({
        name: cleanString(p.name, 120),
        description: cleanString(p.description, 600),
        url: cleanHttpUrl(p.url),
        tech: cleanStringArray(p.tech, 10, 50),
        timeline: cleanString(p.timeline, 60)
      }))
      .filter(p => p.name)
      .slice(0, 6),
    social_links: socialLinks,
    target_market: TARGET_MARKETS.includes(raw.target_market as string) ? raw.target_market as string : ''
  }
}
