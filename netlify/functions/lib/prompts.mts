export interface Profile {
  headline: string
  bio: string
  skills: string[]
  tech_stack: string[]
  experience_years: number
  projects: Array<{ name: string; description: string; url: string; tech: string[]; timeline: string }>
  social_links: Record<string, string>
  target_market: string
  pricing_model: string
  availability: string
}

export const CONTENT_TYPES = [
  'linkedin_posts',
  'outreach_templates',
  'devto_article',
  'platform_profile',
  'portfolio_page',
  'elevator_pitch'
] as const

// Per-type max output tokens. Tuned empirically against Haiku 4.5 throughput
// (~80 tok/s measured) so every type finishes within Netlify's 26s sync-function
// timeout with margin for cold start + DB writes. See e2e test at
// /tmp/clientpilot-e2e-test.mjs — numbers are the result of measuring real calls.
export const MAX_TOKENS_BY_TYPE: Record<string, number> = {
  linkedin_posts: 2500,
  outreach_templates: 2500,
  devto_article: 2000,
  platform_profile: 1800,
  portfolio_page: 2000,
  elevator_pitch: 1500,
}

export function buildProfileContext(profile: Profile, userName: string): string {
  const projects = profile.projects.map(p =>
    `- ${p.name}: ${p.description} (${p.tech.join(', ')}) ${p.url ? `[${p.url}]` : ''} ${p.timeline ? `Built in ${p.timeline}` : ''}`
  ).join('\n')

  return `
Name: ${userName}
Headline: ${profile.headline}
Bio: ${profile.bio}
Skills: ${profile.skills.join(', ')}
Tech Stack: ${profile.tech_stack.join(', ')}
Experience: ${profile.experience_years} years
Target Market: ${profile.target_market}
Pricing Model: ${profile.pricing_model}
Availability: ${profile.availability}
Social Links: ${Object.entries(profile.social_links || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}

Projects:
${projects}
`.trim()
}

export const PROMPTS: Record<string, (ctx: string) => string> = {
  linkedin_posts: (ctx) => `You are writing LinkedIn posts for a freelance developer looking to attract clients.

Profile:
${ctx}

Write 7 LinkedIn posts (keep each 80-140 words — concise, no filler) that:
1. Establish technical expertise
2. Show shipping speed and real results
3. Include a soft CTA (DM me, check my work, etc.)
4. Use line breaks for readability
5. Sound human, not AI-generated
6. Each has a different angle (case study, insight, availability, tutorial teaser, etc.)
7. Maximum 3 hashtags per post

Return as JSON: { "posts": ["post1 text", "post2 text", ...] }`,

  outreach_templates: (ctx) => `You are writing outreach templates for a freelance developer.

Profile:
${ctx}

Write 6 concise outreach templates (keep each 80-130 words):
1. Cold outreach to a recently funded startup (LinkedIn DM)
2. Cold outreach to a CTO/tech lead (LinkedIn DM)
3. Cold outreach to an agency/studio (email)
4. Warm outreach to a former colleague (email)
5. LinkedIn network activation (DM after engaging with someone's post)
6. Freelance platform inquiry response

Each should be personalized with [brackets] for customization, reference their specific skills/projects briefly, and end with a clear CTA.

Return as JSON: { "templates": ["template1", "template2", ...] }`,

  devto_article: (ctx) => `You are writing a Dev.to technical article for a freelance developer.

Profile:
${ctx}

Pick their most impressive project and write a focused case study article (600-900 words — tight, no filler) that:
1. Has a catchy, SEO-friendly title
2. Opens with a hook (what was built, how fast, the result)
3. Covers the problem, tech decisions, architecture, and ONE key code insight
4. Includes ONE realistic code snippet (10-20 lines, not a toy example)
5. Ends with lessons learned and a soft CTA about their freelance work
6. Has Dev.to frontmatter (title, description, tags)

Return as JSON: { "text": "the full article in markdown" }`,

  platform_profile: (ctx) => `You are writing freelance platform profiles.

Profile:
${ctx}

Write reusable profile content for freelance platforms (Toptal, freelance.nl, Arc.dev, Gun.io, Freelancermap):

1. Short bio (100 words) — for search results
2. Full bio (300 words) — for profile page
3. List of skills to select
4. Availability description
5. Rate/pricing description

Return as JSON: { "sections": { "short_bio": "...", "full_bio": "...", "skills_list": "...", "availability": "...", "pricing": "..." } }`,

  portfolio_page: (ctx) => `You are writing content for a freelance developer's /hire landing page.

Profile:
${ctx}

Write all the content needed for a professional hire page:
1. Hero headline + subheadline
2. Services section (3 services with title, description, timeline, price range)
3. Case studies (use their projects — title, subtitle, description, key metric)
4. "Why hire me" section (4 bullet points)
5. Process steps (4 steps)
6. CTA section text

Return as JSON: { "sections": { "hero_headline": "...", "hero_subtitle": "...", "services": "...", "case_studies": "...", "why_hire": "...", "process": "...", "cta": "..." } }`,

  elevator_pitch: (ctx) => `You are writing short-form bios and pitches for a freelance developer.

Profile:
${ctx}

Write:
1. 30-second elevator pitch (spoken, casual)
2. Twitter/X bio (160 chars max)
3. LinkedIn headline (120 chars max)
4. Email signature block
5. GitHub profile README summary (200 words)
6. One-liner for freelance platforms

Return as JSON: { "sections": { "elevator_pitch": "...", "twitter_bio": "...", "linkedin_headline": "...", "email_signature": "...", "github_readme": "...", "one_liner": "..." } }`
}
