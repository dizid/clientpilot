// Shape of a blog post that lives in the code (no database).
// `html` is trusted, hand-checked static HTML rendered with v-html; allowed tags:
// h2, h3, p, ul, ol, li, a, strong, em, blockquote, code, table, thead, tbody, tr, th, td.
// Every number or rule in a post links to its source in `sources`.

export interface BlogSource {
  label: string
  url: string
}

export interface BlogPost {
  slug: string
  title: string
  /** Meta description, 140-160 characters. */
  description: string
  /** Publication date, YYYY-MM-DD. */
  date: string
  /** Date the facts were last checked, YYYY-MM-DD. */
  checked: string
  readingMinutes: number
  /**
   * Slugs of up to 3 hand-picked posts shown as "Related guides" under this post.
   * The prerender stops the build on an unknown slug, a duplicate or the post itself.
   * Without it the post shows the newest other posts.
   */
  related?: string[]
  html: string
  sources: BlogSource[]
}
