<script setup lang="ts">
// Privacy policy (public page, prerendered at build by scripts/prerender.mjs).
// Facts here must match the code: Google sign-in via Firebase, Anthropic for writing
// and imports, Stripe, Neon, Netlify, Google Analytics (index.html), rate-limit log
// pruned after 1 day (netlify/functions/lib/rate-limit.mts).
import { onMounted } from 'vue'
import LegalFooter from '@/components/LegalFooter.vue'

const LAST_UPDATED = '10 November 2026'
const CONTACT_EMAIL = 'dev@dizid.com'

onMounted(() => {
  document.title = 'Privacy Policy | ClientPilot'
})
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <div class="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <a href="/" class="text-sm text-brand-light hover:text-brand no-underline">&larr; ClientPilot</a>
      <h1 class="text-3xl font-bold mt-4 mb-2">Privacy Policy</h1>
      <p class="text-sm text-text-3 mb-8">Last updated: {{ LAST_UPDATED }}</p>

      <div class="space-y-6 text-text-2 leading-relaxed">
        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">Overview</h2>
          <p>
            ClientPilot (clientpilot.dev, "we", "us") is operated by Dizid Web Development. It turns your
            freelancer profile into outreach content (LinkedIn posts, outreach emails, articles, platform
            profiles and pitches) with AI. This policy explains what we collect, why, and how it's handled.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">What we collect</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <span class="text-text">Your account:</span> when you sign in with Google, Google (through
              Firebase Authentication) gives us your name, email address, profile picture and an account ID.
              We never see your Google password.
            </li>
            <li>
              <span class="text-text">Your profile:</span> what you enter or import about your work: headline,
              bio, skills, tech stack, years of experience, projects, social links, target market, pricing
              model and availability.
            </li>
            <li>
              <span class="text-text">Imports:</span> if you give us a portfolio URL, a GitHub username or
              pasted text such as a CV, we fetch that page (and a few pages of the same site) or your public
              GitHub profile, and send the text to Anthropic to draft your profile. You see the draft first;
              it's only stored when you save it.
            </li>
            <li>
              <span class="text-text">Targets:</span> the prospects you add (a name, niche, platform and pain
              point), typed in or drafted from a web page you give us. Only add business information you're
              allowed to use.
            </li>
            <li>
              <span class="text-text">Generated content:</span> the content ClientPilot writes for you, your
              edits, and the status you set (draft, used, replied).
            </li>
            <li>
              <span class="text-text">Usage:</span> how many generations you've used, and a short log of
              actions (generate, regenerate, import) that we keep for one day to enforce rate limits.
            </li>
            <li>
              <span class="text-text">Payments:</span> if you upgrade to Pro or Lifetime, Stripe collects and
              processes your card details directly. We store your Stripe customer ID, your plan and when it
              ends. We never see or store your card number.
            </li>
            <li>
              <span class="text-text">Site analytics:</span> Google Analytics records which pages are viewed
              and which steps people take (for example signing in, finishing onboarding, generating, copying or
              editing a piece, upgrading), with the content type but never the content itself, so we can see how
              ClientPilot is used. See "Cookies" below.
            </li>
          </ul>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">How we use it</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li>Writing your content: your profile, the target you pick and the content type are sent to Anthropic's Claude API.</li>
            <li>Showing and managing your content, profile and targets in your workspace.</li>
            <li>Billing and plan management, handled through Stripe.</li>
            <li>Enforcing the free-plan and rate limits, and keeping the service safe from abuse.</li>
            <li>Operating and improving ClientPilot, for example finding out why a generation failed.</li>
          </ul>
          <p class="mt-3">We do not sell your data, and we do not use it to train AI models of our own.</p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">Who we share it with</h2>
          <p class="mb-3">These service providers process data for us, only as needed to run ClientPilot:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li><span class="text-text">Anthropic</span>: receives your profile, target details and imported page text to write your content and draft imports.</li>
            <li><span class="text-text">Google</span>: Firebase Authentication for signing in, and Google Analytics for page views.</li>
            <li><span class="text-text">Stripe</span>: handles all payments for Pro and Lifetime.</li>
            <li><span class="text-text">Neon</span>: hosts our database.</li>
            <li><span class="text-text">Netlify</span>: hosts the site and runs its backend functions.</li>
          </ul>
          <p class="mt-3">
            We don't share your data with anyone else. These providers are based outside your country (most
            are US-based), so using ClientPilot means your data is processed internationally. Each provider
            has its own safeguards for that transfer under its privacy and data-processing terms.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">Cookies</h2>
          <p>
            Firebase keeps you signed in by storing your login in your browser; that's needed for the app to
            work. Google Analytics sets cookies (their names start with <code>_ga</code>) to tell visits
            apart. ClientPilot works without them: you can block them in your browser settings or with a
            content blocker. We don't use advertising cookies.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">How long we keep it</h2>
          <p>
            We keep your account, profile, targets and generated content for as long as your account exists,
            so your workspace is there when you come back. The rate-limit log is deleted after one day. If you
            want your account and its data deleted, email us (below) and we'll delete it within 30 days,
            except records we must keep by law, such as billing records for tax.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">Security</h2>
          <p>
            Data is encrypted in transit (HTTPS) between your browser, our servers and our providers. Every
            request to your data is checked against your login, and database access is limited to what the
            app needs. No system is perfectly secure, but we take reasonable, industry-standard measures to
            protect your data.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">Your rights</h2>
          <p>
            You can ask for a copy of your data, ask us to correct it, object to how we use it, or ask us to
            delete your account at any time by emailing us. If you think we handle your data wrongly, you can
            also complain to your data protection authority (in the Netherlands: the Autoriteit
            Persoonsgegevens).
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">Changes and contact</h2>
          <p>
            If this policy changes materially, we'll update the "Last updated" date above. Questions about
            this policy or your data? Email
            <a :href="`mailto:${CONTACT_EMAIL}`" class="text-brand-light hover:text-brand">{{ CONTACT_EMAIL }}</a>.
          </p>
        </section>
      </div>

      <LegalFooter />
    </div>
  </div>
</template>
