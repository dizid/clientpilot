import { authenticateRequest } from './lib/auth.mjs'
import { query } from './lib/db.mjs'
import { validate, requireString, cleanString } from './lib/validate.mjs'
import { safeError, errorStatus } from './lib/errors.mjs'
import { checkRateLimit, RATE_LIMIT_MESSAGE } from './lib/rate-limit.mjs'
import { normalizeUrl, fetchPage, findSubpages, formatPageSection } from './lib/web-fetch.mjs'
import { callClaudeJson } from './lib/claude-json.mjs'

/**
 * Analyze a prospect's website and suggest target context (company name,
 * niche, best outreach platform, a pain point this freelancer can solve).
 *
 * Returns a DRAFT for the Generate screen's target modal — nothing is saved;
 * the user confirms and the modal saves it via /save-target.
 */

const TOTAL_BUDGET_MS = 23_000
const MAIN_PAGE_TIMEOUT_MS = 6_000
const SUBPAGE_TIMEOUT_MS = 4_000
const MIN_CLAUDE_BUDGET_MS = 8_000
const MAX_SOURCE_CHARS = 16_000
const MAX_SUBPAGES = 2
const SUBPAGE_PATTERN = /\/(about|company|services|products?|solutions|pricing|customers)(\/|$)/i

// Must match the <option> values in GenerateView's target modal
const PLATFORMS = ['LinkedIn', 'Cold Email', 'Upwork', 'Twitter/X', 'Warm Referrals', 'Mixed']

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const startedAt = Date.now()

  try {
    const user = await authenticateRequest(req)
    const { url } = await req.json() as { url?: unknown }

    const validationError = validate(requireString(url, 'url', 3, 500))
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    const siteUrl = normalizeUrl(url as string)
    if (!siteUrl) {
      return Response.json({ error: 'That URL doesn\'t look valid. Try something like https://theircompany.com' }, { status: 400 })
    }

    if (!(await checkRateLimit(user.id, 'import_target'))) {
      return Response.json({ error: RATE_LIMIT_MESSAGE }, { status: 429 })
    }

    const mainPage = await fetchPage(siteUrl, MAIN_PAGE_TIMEOUT_MS)
    if (!mainPage) {
      return Response.json({ error: 'We couldn\'t load that website — check the URL, or fill in the fields yourself.' }, { status: 422 })
    }

    const sections = [formatPageSection(mainPage.finalUrl, mainPage.html)]
    const subpageUrls = findSubpages(mainPage.html, new URL(mainPage.finalUrl), SUBPAGE_PATTERN, MAX_SUBPAGES)
    const subpages = await Promise.all(subpageUrls.map(u => fetchPage(u, SUBPAGE_TIMEOUT_MS)))
    for (const page of subpages) {
      if (page) sections.push(formatPageSection(page.finalUrl, page.html))
    }

    // Freelancer's skills make the pain point something THEY can actually fix
    const profileResult = await query(
      'SELECT headline, skills, tech_stack FROM profiles WHERE user_id = $1',
      [user.id]
    )
    const profile = profileResult.rows[0] as { headline: string; skills: string[]; tech_stack: string[] } | undefined

    const remainingMs = TOTAL_BUDGET_MS - (Date.now() - startedAt)
    const raw = await callClaudeJson(
      buildPrompt(sections.join('\n\n').slice(0, MAX_SOURCE_CHARS), profile),
      600,
      Math.max(remainingMs, MIN_CLAUDE_BUDGET_MS)
    )

    const platform = PLATFORMS.includes(raw.platform as string) ? raw.platform as string : 'Mixed'
    const target = {
      name: cleanString(raw.name, 100) || siteUrl.hostname.replace(/^www\./, ''),
      niche: cleanString(raw.niche, 100) || 'Other',
      platform,
      pain_point: cleanString(raw.pain_point, 500)
    }

    return Response.json({ target })
  } catch (e: unknown) {
    return Response.json({ error: safeError(e, 'Could not analyze that website — please fill in the fields yourself.') }, { status: errorStatus(e) })
  }
}

function buildPrompt(sourceText: string, profile?: { headline: string; skills: string[]; tech_stack: string[] }): string {
  const freelancer = profile
    ? `The freelancer: ${profile.headline}. Skills: ${(profile.skills || []).join(', ')}. Tech: ${(profile.tech_stack || []).join(', ')}.`
    : 'The freelancer is a web developer.'

  return `A freelance developer wants to pitch their services to the company whose website is below. Analyze it so the pitch can be tailored.

${freelancer}

Rules:
- Only use what the website shows. Don't invent facts, numbers or customers.
- pain_point: ONE specific, plausible problem this company likely has that THIS freelancer could solve, grounded in something visible on the site (e.g. slow/dated site, no online booking, manual quote process, no self-serve onboarding). 1-2 sentences, max 300 chars.
- niche: short description of what the company is, e.g. "B2B logistics SaaS", "Independent dental clinic", "Shopify fashion store". Max 60 chars.
- platform: the best channel to reach them, exactly one of: ${PLATFORMS.map(p => `"${p}"`).join(', ')}.

Return ONLY a JSON object, no markdown:
{ "name": "company name", "niche": "", "platform": "", "pain_point": "" }

WEBSITE:
${sourceText}`
}
