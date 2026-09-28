import { lookup as dnsLookup, type LookupAddress } from 'node:dns'
import { isIP, type LookupFunction } from 'node:net'
import http, { type IncomingHttpHeaders } from 'node:http'
import https from 'node:https'

/**
 * SSRF-safe fetching of user-supplied URLs + HTML → text helpers.
 * Shared by import-profile and import-target.
 */

const MAX_HTML_BYTES = 1_500_000
const MAX_REDIRECTS = 3

// ─── URL safety (SSRF guard) ─────────────────────────────────────────────────

export function normalizeUrl(input: string): URL | null {
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

export function isPrivateIp(ip: string): boolean {
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
export async function fetchPage(startUrl: URL, timeoutMs: number): Promise<{ finalUrl: string; html: string } | null> {
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
export function findSubpages(html: string, base: URL, pattern: RegExp, max: number): URL[] {
  const found = new Map<string, URL>()
  for (const match of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["']/gi)) {
    try {
      const u = new URL(match[1], base)
      u.hash = ''
      u.search = ''
      if (u.hostname !== base.hostname) continue
      if (u.pathname === base.pathname) continue
      if (!pattern.test(u.pathname)) continue
      found.set(u.toString(), u)
      if (found.size >= max) break
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

export function htmlToText(html: string): string {
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
export function extractMeta(html: string): string {
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

export function formatPageSection(url: string, html: string): string {
  return `=== PAGE: ${url} ===\n${extractMeta(html)}\n\n${htmlToText(html).slice(0, 10_000)}`
}

/** Pull social profile links straight from anchors — more reliable than asking the model. */
export function extractSocialLinks(html: string): Record<string, string> {
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
