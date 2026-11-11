<script setup lang="ts">
// Blog index (public page, prerendered at build by scripts/prerender.mjs).
// Keep the title in sync with the /blog head in scripts/prerender.mjs.
import { onMounted } from 'vue'
import LegalFooter from '@/components/LegalFooter.vue'
import { BLOG_POSTS, formatPostDate } from '@/content/posts'

onMounted(() => {
  document.title = 'Blog: finding freelance clients | ClientPilot'
})
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <div class="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <a href="/" class="text-sm text-brand-light hover:text-brand no-underline">&larr; ClientPilot</a>
      <h1 class="text-3xl font-bold mt-4 mb-2">ClientPilot blog</h1>
      <p class="text-text-2 mb-8 leading-relaxed">
        Practical guides for freelance developers who want more clients: where to look, what to send,
        and the rules that apply.
      </p>

      <ul class="space-y-4 list-none p-0">
        <li
          v-for="post in BLOG_POSTS"
          :key="post.slug"
          class="bg-surface border border-border rounded-2xl p-6"
        >
          <h2 class="text-lg font-semibold mb-1">
            <a :href="`/blog/${post.slug}`" class="text-text hover:text-brand-light no-underline">{{ post.title }}</a>
          </h2>
          <p class="text-sm text-text-3 mb-2">
            <time :datetime="post.date">{{ formatPostDate(post.date) }}</time> · {{ post.readingMinutes }} min read
          </p>
          <p class="text-text-2 leading-relaxed">{{ post.description }}</p>
        </li>
      </ul>

      <LegalFooter />
    </div>
  </div>
</template>
