// Blog registry: every post is a file in this folder (no database), newest first.
// Used by the blog views and by the build-time prerender (scripts/prerender.mjs via
// src/entry-server.ts), which also checks each post's tags and lengths.
import type { BlogPost } from './types'

const modules = import.meta.glob<{ default: BlogPost }>(['./*.ts', '!./index.ts', '!./types.ts'], {
  eager: true,
})

export const BLOG_POSTS: BlogPost[] = Object.values(modules)
  .map((mod) => mod.default)
  .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))

/** The post with this slug, or undefined. */
export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** "11 November 2026" from "2026-11-11"; fixed format so the prerendered HTML and the browser agree. */
export function formatPostDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}
