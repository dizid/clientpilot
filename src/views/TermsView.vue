<script setup lang="ts">
// Terms of service (public page, prerendered at build by scripts/prerender.mjs).
// Plans and prices must match the pricing section in LandingView.vue.
import { onMounted } from 'vue'
import LegalFooter from '@/components/LegalFooter.vue'

const LAST_UPDATED = '10 November 2026'
const CONTACT_EMAIL = 'dev@dizid.com'

onMounted(() => {
  document.title = 'Terms of Service | ClientPilot'
})
</script>

<template>
  <div class="min-h-screen bg-bg text-text">
    <div class="max-w-3xl mx-auto px-4 py-10 md:py-16">
      <a href="/" class="text-sm text-brand-light hover:text-brand no-underline">&larr; ClientPilot</a>
      <h1 class="text-3xl font-bold mt-4 mb-2">Terms of Service</h1>
      <p class="text-sm text-text-3 mb-8">Last updated: {{ LAST_UPDATED }}</p>

      <div class="space-y-6 text-text-2 leading-relaxed">
        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">1. Acceptance of these terms</h2>
          <p>
            ClientPilot (clientpilot.dev) is operated by Dizid Web Development ("we", "us"). By signing in or
            using ClientPilot, you agree to these terms. If you don't agree, don't use the service.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">2. What ClientPilot does</h2>
          <p>
            ClientPilot uses AI (Anthropic's Claude) to write outreach content from your freelancer profile:
            LinkedIn posts, outreach emails, articles, platform profiles, portfolio page copy and pitches. You
            copy and publish the content yourself; ClientPilot doesn't post or send anything for you.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">3. Plans, billing and refunds</h2>
          <ul class="list-disc pl-5 space-y-2">
            <li><span class="text-text">Free:</span> one preview generation, no card needed.</li>
            <li>
              <span class="text-text">Pro:</span> $9 a month, billed monthly through Stripe until you cancel.
              Unlimited generations, within fair use and the rate limits that protect the service.
            </li>
            <li>
              <span class="text-text">Lifetime:</span> $69, paid once. The Pro features for as long as we run
              ClientPilot, with no monthly fee.
            </li>
          </ul>
          <p class="mt-3">
            You can cancel Pro at any time by emailing
            <a :href="`mailto:${CONTACT_EMAIL}`" class="text-brand-light hover:text-brand">{{ CONTACT_EMAIL }}</a>.
            Cancelling stops the next payment; you keep Pro until the end of the period you paid for. If you
            want a refund within 7 days of a payment, email us and we'll refund it in full. Apart from that we
            don't refund partial periods, except where the law requires it.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">4. AI-written content</h2>
          <p>
            ClientPilot's content is written by AI from what you give it. It can contain mistakes, or details
            that aren't true about you or your work. Read and edit everything before you use it. You're
            responsible for what you publish or send, including following the rules of the platforms you post
            on and the laws on sending messages to people (for example anti-spam and email marketing rules).
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">5. Your content</h2>
          <p>
            Your profile, targets and the content ClientPilot writes for you are yours. You allow us to store
            and process them only to run ClientPilot for you, as described in the
            <a href="/privacy" class="text-brand-light hover:text-brand">Privacy Policy</a>.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">6. Acceptable use</h2>
          <p class="mb-3">You agree not to:</p>
          <ul class="list-disc pl-5 space-y-2">
            <li>Use ClientPilot for spam or other unlawful messages.</li>
            <li>Add other people's personal data without a lawful reason to use it.</li>
            <li>Try to get around plan limits, rate limits or sign-in.</li>
            <li>Disrupt, overload or reverse-engineer the service.</li>
          </ul>
          <p class="mt-3">We may suspend or close accounts that break these terms.</p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">7. Your account</h2>
          <p>
            You sign in with your Google account. Keep it secure: you're responsible for what happens under
            your ClientPilot account. Tell us right away if you think someone else has used it.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">8. Limitation of liability</h2>
          <p>
            ClientPilot is provided "as is", without warranties of any kind. We can't promise that its content
            will win you clients. To the maximum extent the law allows, we aren't liable for indirect,
            incidental or consequential damages from using ClientPilot. Our total liability for any claim
            about ClientPilot is limited to the amount you paid us in the twelve months before the claim.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">9. Ending your use</h2>
          <p>
            You can stop using ClientPilot at any time, and ask us to delete your account. We may suspend or end
            your access if you break these terms or if the law requires it.
          </p>
        </section>

        <section class="bg-surface border border-border rounded-2xl p-6">
          <h2 class="text-lg font-semibold text-text mb-2">10. Changes and contact</h2>
          <p>
            We may update these terms as ClientPilot changes. If a change is material, we'll update the "Last
            updated" date above. Questions? Email
            <a :href="`mailto:${CONTACT_EMAIL}`" class="text-brand-light hover:text-brand">{{ CONTACT_EMAIL }}</a>.
          </p>
        </section>
      </div>

      <LegalFooter />
    </div>
  </div>
</template>
