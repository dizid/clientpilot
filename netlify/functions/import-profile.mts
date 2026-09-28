import { lookup as dnsLookup, type LookupAddress } from 'node:dns'
import { isIP, type LookupFunction } from 'node:net'
import http, { type IncomingHttpHeaders } from 'node:http'
import https from 'node:https'
import { authenticateRequest } from './lib/auth.mjs'
import { validate, optionalString } from './lib/validate.mjs'
import { safeError } from './lib/errors.mjs'

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

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN // optional — raises GitHub API rate limit

const TOTAL_BUDGET_MS = 23_000
const MAIN_PAGE_TIMEOUT_MS = 6_000
const SUBPAGE_TIMEOUT_MS = 4_000
const MIN_CLAUDE_BUDGET_MS = 8_000
const MAX_HTML_BYTES = 1_500_000
const MAX_REDIRECTS = 3
const MAX_SUBPAGES = 3
const MAX_SOURCE_CHARS = 24_000
const MAX_PASTED_CHARS = 15_000

// Must match the <option> values in OnboardingView.vue
const TARGET_MARKETS = ['eu', 'us', 'global', 'startups']

// Best-effort per-instance rate limit (resets on cold start). Keeps a single
// user from hammering the endpoint; not a hard global guarantee.
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60 * 60 * 1000
const recentImports = new Map<string, number[]>()

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

    if (!checkRateLimit(user.id)) {
      return Response.json({ error: 'Too many imports — please try again in an hour.' }, { status: 429 })
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

        const subpageUrls = findSubpages(mainPage.html, new URL(mainPage.finalUrl))
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
    return Response.json({ error: safeError(e, 'Import failed — please try again or fill in the form manually.') }, { status: 500 })
  }
}

// ─── Rate limit ──────────────────────────────────────────────────────────────

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const recent = (recentImports.get(userId) || []).filter(t => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_LIMIT) return false
  recent.push(now)
  recentImports.set(userId, recent)
  return true
}

// ─── URL safety (SSRF guard) ─────────────────────────────────────────────────

function normalizeUrl(input: string): URL | null {
  try {
    const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`
    const url = new URL(withScheme)
    if (!['http:', 'https:'].includes(url.protocol)) return null
    if (url.username || url.password) return null
    if (url.port && !['80', '443'].includes(url.port)) return null
    if (!url.hostname.includes('.')) return null
    url.hash = ''
    return url
  } catch {
    return null
  }
}

function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split('.').map(Number)
    return (
      a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19))
    )
  }
  const v6 = ip.toLowerCase()
  if (v6.startsWith('::ffff:')) {
    const mapped = v6.slice(7)
    return isIP(mapped) === 4 ? isPrivateIp(mapped) : true
  }
  return (
    v6 === '::' || v6 === '::1' ||
    v6.startsWith('fc') || v6.startsWith('fd') ||
    v6.startsWith('fe8') || v6.startsWith('fe9') || v6.startsWith('fea') || v6.startsWith('feb')
  )
}

/**
 * DNS lookup used by the actual socket connection. Rejects if ANY resolved
 * address is private, so the IP we validate is the IP we connect to — no
 * check-then-fetch gap for DNS rebinding to exploit.
 */
const safeLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, '', 4)
    const list = addresses as LookupAddress[]
    if (list.length === 0 || list.some(a => isPrivateIp(a.address))) {
      return callback(new Error(`Blocked non-public address for ${hostname}`), '', 4)
    }
    if (options.all) return (callback as unknown as (e: null, a: LookupAddress[]) => void)(null, list)
    callback(null, list[0].address, list[0].family)
  })
}

// ─── Page fetching ───────────────────────────────────────────────────────────

interface RawResponse {
  status: number
  headers: IncomingHttpHeaders
  body: string
}

/** One HTTP(S) GET through safeLookup, no redirect following, body capped at MAX_HTML_BYTES. */
function requestOnce(url: URL, signal: AbortSignal): Promise<RawResponse> {
  return new Promise((resolve, reject) => {
    // IP literals skip DNS, so validate them directly
    const literal = url.hostname.replace(/^\[|\]$/g, '')
    if (isIP(literal) && isPrivateIp(literal)) return reject(new Error('Blocked private IP'))

    const client = url.protocol === 'https:' ? https : http
    const req = client.request(url, {
      method: 'GET',
      lookup: safeLookup,
      signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClientPilotBot/1.0; +https://clientpilot.dev)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    }, res => {
      const status = res.statusCode ?? 0
      const contentType = String(res.headers['content-type'] || '')
      // Redirects and non-HTML: don't bother reading the body
      if (status >= 300 && status < 400 || !contentType.includes('html')) {
        res.destroy()
        return resolve({ status, headers: res.headers, body: '' })
      }
      const chunks: Buffer[] = []
      let total = 0
      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
        total += chunk.length
        if (total >= MAX_HTML_BYTES) res.destroy()
      })
      const finish = () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks).subarray(0, MAX_HTML_BYTES).toString('utf8') })
      res.on('end', finish)
      res.on('close', finish) // fires after destroy() at the size cap
      res.on('error', reject)
    })
    req.on('error', reject)
    req.end()
  })
}

/** Fetch an HTML page with per-hop SSRF checks, size cap and timeout. Returns null on any failure. */
async function fetchPage(startUrl: URL, timeoutMs: number): Promise<{ finalUrl: string; html: string } | null> {
  const signal = AbortSignal.timeout(timeoutMs)
  try {
    let url = startUrl
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const res = await requestOnce(url, signal)

      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.location
        if (!location) return null
        const next = normalizeUrl(new URL(location, url).toString())
        if (!next) return null
        url = next
        continue
      }

      if (res.status < 200 || res.status >= 300 || !res.body) return null
      return { finalUrl: url.toString(), html: res.body }
    }
    return null
  } catch {
    return null
  }
}

/** Same-site links that look like about/projects/portfolio pages. */
function findSubpages(html: string, base: URL): URL[] {
  const found = new Map<string, URL>()
  for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi)) {
    try {
      const u = new URL(match[1], base)
      u.hash = ''
      u.search = ''
      if (u.hostname !== base.hostname) continue
      if (u.pathname === base.pathname) continue
      if (!SUBPAGE_PATTERN.test(u.pathname)) continue
      found.set(u.toString(), u)
      if (found.size >= MAX_SUBPAGES) break
    } catch {
      // ignore malformed hrefs
    }
  }
  return [...found.values()]
}

// ─── HTML → text ─────────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/section|\/article)\b[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim()
}

/** Title, meta/OG tags and JSON-LD — often the only content on JS-rendered sites. */
function extractMeta(html: string): string {
  const parts: string[] = []
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
  if (title) parts.push(`Title: ${decodeEntities(title.trim())}`)

  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = m[0]
    const key = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    const content = tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1]
    if (key && content && /^(description|keywords|author|og:title|og:description|twitter:description)$/.test(key)) {
      parts.push(`${key}: ${decodeEntities(content)}`)
    }
  }

  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    parts.push(`JSON-LD: ${m[1].trim().slice(0, 3000)}`)
  }
  return parts.join('\n')
}

function formatPageSection(url: string, html: string): string {
  return `=== PAGE: ${url} ===\n${extractMeta(html)}\n\n${htmlToText(html).slice(0, 10_000)}`
}

/** Pull social profile links straight from anchors — more reliable than asking the model. */
function extractSocialLinks(html: string): Record<string, string> {
  const links: Record<string, string> = {}
  const patterns: Record<string, RegExp> = {
    github: /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9-]+\/?$/i,
    linkedin: /^https?:\/\/([a-z]+\.)?linkedin\.com\/in\/[^/?#]+\/?$/i,
    twitter: /^https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]+\/?$/i,
    devto: /^https?:\/\/(www\.)?dev\.to\/[A-Za-z0-9_-]+\/?$/i
  }
  for (const match of html.matchAll(/\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/gi)) {
    const href = match[1]
    for (const [key, re] of Object.entries(patterns)) {
      if (!links[key] && re.test(href)) links[key] = href.replace(/\/$/, '')
    }
  }
  return links
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

async function extractProfile(sourceText: string, timeoutMs: number): Promise<Record<string, unknown>> {
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
        max_tokens: 2500,
        messages: [{ role: 'user', content: buildExtractionPrompt(sourceText) }]
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
  if (!jsonMatch) throw new Error('Anthropic returned an unreadable profile — please try again.')
  return JSON.parse(jsonMatch[0])
}

// ─── Sanitize (same limits as save-profile) ──────────────────────────────────

function cleanString(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function cleanStringArray(v: unknown, maxItems: number, maxLen: number): string[] {
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

function cleanHttpUrl(v: unknown): string {
  const s = cleanString(v, 500)
  return /^https?:\/\/\S+$/i.test(s) ? s : ''
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
