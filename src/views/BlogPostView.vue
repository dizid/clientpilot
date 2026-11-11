<script setup lang="ts">
// One blog post (public page, prerendered at build by scripts/prerender.mjs).
// The post body is trusted static HTML from src/content/posts (checked at build time).
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LegalFooter from '@/components/LegalFooter.vue'
import { findPost, formatPostDate } from '@/content/posts'

const route = useRoute()
const post = computed(() => findPost(String(route.params.slug ?? '')))

onMounted(() => {
  document.title = post.value ? `${post.value.title} | ClientPilot` : 'Post not found | ClientPilot'
})
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <article v-if="post" class="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <a href="/blog" class="text-sm text-brand-light hover:text-brand no-underline">&larr; Blog</a>
      <h1 class="text-3xl md:text-4xl font-bold mt-4 mb-3 leading-tight">{{ post.title }}</h1>
      <p class="text-sm text-text-3 mb-8">
        <time :datetime="post.date">{{ formatPostDate(post.date) }}</time> · {{ post.readingMinutes }} min read ·
        facts checked {{ formatPostDate(post.checked) }}
      </p>

      <div class="post-body text-text-2 leading-relaxed" v-html="post.html"></div>

      <section class="mt-10 bg-surface border border-border rounded-2xl p-6">
        <h2 class="text-lg font-semibold text-text mb-3">Sources</h2>
        <ul class="list-disc pl-5 space-y-1 text-sm text-text-2">
          <li v-for="source in post.sources" :key="source.url">
            <a :href="source.url" target="_blank" rel="noopener noreferrer" class="text-brand-light hover:text-brand">{{ source.label }}</a>
          </li>
        </ul>
      </section>

      <section class="mt-6 bg-surface border border-border rounded-2xl p-6">
        <p class="text-text mb-3">
          ClientPilot writes your LinkedIn posts, outreach emails and platform profiles from your own profile.
          Free preview, no card needed.
        </p>
        <a
          href="/"
          class="inline-block px-5 py-2.5 text-sm font-semibold bg-brand hover:bg-brand-dark text-white rounded-lg no-underline transition"
        >See how it works</a>
      </section>

      <LegalFooter />
    </article>

    <div v-else class="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <h1 class="text-3xl font-bold mb-4">Post not found</h1>
      <a href="/blog" class="text-brand-light hover:text-brand">See all posts</a>
    </div>
  </div>
</template>

<style scoped>
/* Typography for the post body (static HTML from src/content/posts). */
.post-body :deep(h2) {
  color: var(--color-text);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 2.25rem 0 0.75rem;
}
.post-body :deep(h3) {
  color: var(--color-text);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
}
.post-body :deep(p) {
  margin: 0 0 1rem;
}
.post-body :deep(ul),
.post-body :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 1.25rem;
}
.post-body :deep(ul) {
  list-style: disc;
}
.post-body :deep(ol) {
  list-style: decimal;
}
.post-body :deep(li) {
  margin: 0.25rem 0;
}
.post-body :deep(strong) {
  color: var(--color-text);
}
.post-body :deep(a) {
  color: var(--color-brand-light);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.post-body :deep(a:hover) {
  color: var(--color-brand);
}
.post-body :deep(blockquote) {
  margin: 0 0 1rem;
  padding: 1rem 1.25rem;
  border-left: 3px solid var(--color-brand);
  background: var(--color-surface);
  border-radius: 0.5rem;
}
.post-body :deep(blockquote p:last-child) {
  margin-bottom: 0;
}
.post-body :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  background: var(--color-surface-2);
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
}
/* Wide tables scroll inside their own box on phones instead of widening the page. */
.post-body :deep(table) {
  display: block;
  overflow-x: auto;
  border-collapse: collapse;
  margin: 0 0 1.25rem;
  font-size: 0.875rem;
}
.post-body :deep(th),
.post-body :deep(td) {
  border: 1px solid var(--color-border-2);
  padding: 0.5rem 0.75rem;
  text-align: left;
  vertical-align: top;
}
.post-body :deep(th) {
  color: var(--color-text);
  background: var(--color-surface);
  font-weight: 600;
}
</style>
