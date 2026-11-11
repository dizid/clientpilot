// Build-time prerender (same pattern as TestSwap). Runs last in `npm run build`, after
// the client build (dist/) and the SSR build of src/entry-server.ts (dist-ssr/).
// It writes the real HTML of the public pages into dist/ (the landing page into
// dist/index.html, /privacy into dist/privacy.html, /terms into dist/terms.html), so
// crawlers that don't run JavaScript (GPTBot, ClaudeBot, PerplexityBot, link previews,
// payment and sign-in reviews that open the privacy and terms URLs) can read them.
// Netlify serves privacy.html for /privacy before the SPA fallback.
// In the browser, src/main.ts hydrates that HTML.
//
// The untouched SPA shell is saved first as dist/app-shell.html; netlify.toml's SPA
// fallback serves it for every other route (/login, /workspace, ...), so those never
// flash the landing page. The shell drops the homepage canonical, which would otherwise
// mark those pages as duplicates of the homepage.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const { render, BLOG_POSTS } = await import(pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href)

const SITE_URL = 'https://clientpilot.dev'
const APP_DIV = '<div id="app"></div>'
const CANONICAL_TAG = /<link\s+rel="canonical"[^>]*>\s*/i

// Public pages to prerender. `head` replaces the landing page's title, description,
// canonical and share tags (keep the titles in sync with the views' document.title).
const PAGES = [
  { path: '/', file: 'index.html' },
  {
    path: '/privacy',
    file: 'privacy.html',
    head: {
      title: 'Privacy Policy | ClientPilot',
      description: 'What ClientPilot collects when you sign in with Google and build your profile, how AI writes your content, which services process it, and how to delete your data.',
    },
  },
  {
    path: '/terms',
    file: 'terms.html',
    head: {
      title: 'Terms of Service | ClientPilot',
      description: 'The terms for using ClientPilot: the Free, Pro and Lifetime plans, cancelling and refunds, AI-written content, acceptable use and how to contact us.',
    },
  },
]

// Blog (posts live in src/content/posts, no database): the index plus one page per post,
// each with BlogPosting JSON-LD. checkBlogPost() stops the build on a post that breaks
// the content rules, and every post must be listed in public/sitemap.xml.
const ALLOWED_POST_TAGS = new Set(['h2', 'h3', 'p', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'blockquote', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'])

/** Throws if a blog post breaks the content rules (tags, lengths, sources, dates). */
function checkBlogPost(post) {
  const where = `blog post "${post.slug}"`
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(post.slug)) throw new Error(`prerender: ${where}: bad slug`)
  if (!post.title || post.title.length > 70) throw new Error(`prerender: ${where}: title missing or over 70 characters`)
  if (post.description.length < 120 || post.description.length > 170) {
    throw new Error(`prerender: ${where}: description is ${post.description.length} characters (want 120-170)`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date) || !/^\d{4}-\d{2}-\d{2}$/.test(post.checked)) {
    throw new Error(`prerender: ${where}: date and checked must be YYYY-MM-DD`)
  }
  for (const [, tag] of post.html.matchAll(/<\/?([a-zA-Z0-9]+)/g)) {
    if (!ALLOWED_POST_TAGS.has(tag.toLowerCase())) throw new Error(`prerender: ${where}: tag <${tag}> is not allowed`)
  }
  if (/\s(style|class|on[a-z]+)=/i.test(post.html)) throw new Error(`prerender: ${where}: no style, class or event attributes`)
  if (!post.sources?.length || post.sources.some((source) => !source.url.startsWith('https://'))) {
    throw new Error(`prerender: ${where}: needs sources, all https`)
  }
}

/** BlogPosting structured data for one post. */
function blogPostJsonLd(post) {
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.checked,
    url,
    mainEntityOfPage: url,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Marc de Ruijter', url: 'https://dizid.com' },
    publisher: { '@type': 'Organization', name: 'ClientPilot', url: `${SITE_URL}/` },
  }
}

const sitemap = await readFile(join(root, 'public', 'sitemap.xml'), 'utf8')
for (const post of BLOG_POSTS) {
  checkBlogPost(post)
  if (!sitemap.includes(`<loc>${SITE_URL}/blog/${post.slug}</loc>`)) {
    throw new Error(`prerender: blog post "${post.slug}" is missing from public/sitemap.xml`)
  }
}

PAGES.push(
  {
    path: '/blog',
    file: 'blog.html',
    head: {
      title: 'Blog: finding freelance clients | ClientPilot',
      description: 'Practical guides for freelance developers who want more clients: where to look, what to send, and the rules that apply to platforms and cold email.',
    },
  },
  ...BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    // <path>.html (not <path>/index.html) so Netlify serves it without a trailing-slash redirect (TestSwap pattern)
    file: `blog/${post.slug}.html`,
    head: { title: `${post.title} | ClientPilot`, description: post.description, jsonLd: blogPostJsonLd(post) },
  })),
)

const template = await readFile(join(distDir, 'index.html'), 'utf8')
if (!template.includes(APP_DIV)) {
  throw new Error(`prerender: ${APP_DIV} not found in dist/index.html`)
}

/** Escape text for an HTML attribute or element body. */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Replace the value between the two groups of `tagPattern`; throws if the tag is missing. */
function setTagValue(html, tagPattern, value, label) {
  if (!tagPattern.test(html)) throw new Error(`prerender: ${label} not found in dist/index.html`)
  return html.replace(tagPattern, (_match, before, after) => `${before}${escapeHtml(value)}${after}`)
}

/** The landing page's <head>, rewritten for another public page. */
function headFor(html, path, { title, description, jsonLd }) {
  const url = `${SITE_URL}${path}`
  let page = setTagValue(html, /(<title>)[^<]*(<\/title>)/, title, 'title')
  page = setTagValue(page, /(<meta name="title" content=")[^"]*(")/, title, 'meta title')
  page = setTagValue(page, /(<meta name="description" content=")[^"]*(")/, description, 'meta description')
  page = setTagValue(page, /(<meta property="og:url" content=")[^"]*(")/, url, 'og:url')
  page = setTagValue(page, /(<meta property="og:title" content=")[^"]*(")/, title, 'og:title')
  page = setTagValue(page, /(<meta property="og:description" content=")[^"]*(")/, description, 'og:description')
  page = setTagValue(page, /(<meta property="twitter:url" content=")[^"]*(")/, url, 'twitter:url')
  page = setTagValue(page, /(<meta property="twitter:title" content=")[^"]*(")/, title, 'twitter:title')
  page = setTagValue(page, /(<meta property="twitter:description" content=")[^"]*(")/, description, 'twitter:description')
  page = setTagValue(page, /(<link rel="canonical" href=")[^"]*(")/, url, 'canonical')
  if (jsonLd) {
    // "<" escaped so no value can close the script tag early
    const script = `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`
    page = page.replace('</head>', () => `  ${script}\n  </head>`)
  }
  return page
}

// 1. The plain app shell for all other routes
await writeFile(join(distDir, 'app-shell.html'), template.replace(CANONICAL_TAG, ''))

// 2. The public pages, rendered. data-ssg-route tells src/main.ts it may hydrate.
for (const { path, file, head } of PAGES) {
  const appHtml = await render(path)
  if (!appHtml.includes('<h1')) {
    throw new Error(`prerender: ${path} rendered without an <h1>; refusing to ship it`)
  }
  const pageTemplate = head ? headFor(template, path, head) : template
  const page = pageTemplate.replace(APP_DIV, () => `<div id="app" data-ssg-route="${path}">${appHtml}</div>`)
  await mkdir(dirname(join(distDir, file)), { recursive: true })
  await writeFile(join(distDir, file), page)
  console.log(`prerender: ${path} -> ${file} (${Math.round(appHtml.length / 1024)} KB of HTML)`)
}

console.log('prerender: app-shell.html for other routes')
