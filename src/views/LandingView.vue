<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function getStarted() {
  if (auth.isLoggedIn) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}

const features = [
  { icon: 'fa-brands fa-linkedin', title: 'LinkedIn Posts', desc: 'AI writes 10 engaging posts that establish your expertise and attract clients. Schedule 3x/week.' },
  { icon: 'fa-solid fa-envelope-open-text', title: 'Outreach Templates', desc: '7 battle-tested templates — cold, warm, platform, and follow-ups. Personalized to your profile.' },
  { icon: 'fa-brands fa-dev', title: 'Dev.to Articles', desc: 'Full case study articles from your projects. Technical depth that attracts hiring managers.' },
  { icon: 'fa-solid fa-id-card', title: 'Platform Profiles', desc: 'Copy-paste profiles for Toptal, freelance.nl, Arc.dev, and every major platform.' },
  { icon: 'fa-solid fa-file-code', title: 'Portfolio Page', desc: 'A complete /hire landing page with services, case studies, pricing, and contact form.' },
  { icon: 'fa-solid fa-bullhorn', title: 'Elevator Pitch', desc: 'Your 30-second pitch, email signature, Twitter bio, and GitHub README — all consistent.' },
]

const steps = [
  { num: '1', title: 'Enter Your Profile', desc: 'Skills, projects, stack, and links. Takes 5 minutes.' },
  { num: '2', title: 'AI Generates Everything', desc: 'LinkedIn posts, articles, templates, profiles — all tailored to you.' },
  { num: '3', title: 'Copy, Paste, Deploy', desc: 'Publish to LinkedIn, Dev.to, freelance platforms. Start getting clients.' },
]
</script>

<template>
  <div class="min-h-screen">
    <!-- Nav -->
    <nav class="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div class="flex items-center gap-2 text-lg font-bold">
          <i class="fa-solid fa-rocket text-brand"></i>
          <span>Client<span class="text-brand">Pilot</span></span>
        </div>
        <div class="flex items-center gap-4">
          <a href="#pricing" class="text-sm text-text-2 hover:text-text no-underline transition hidden sm:block">Pricing</a>
          <button
            @click="getStarted"
            class="px-4 py-2 text-sm font-semibold bg-brand hover:bg-brand-dark text-white rounded-lg cursor-pointer border-0 transition"
          >
            {{ auth.isLoggedIn ? 'Dashboard' : 'Get Started Free' }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-32 pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
      <!-- Background glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="relative max-w-4xl mx-auto" style="animation: fade-up 0.8s ease both">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-brand-light text-sm font-medium mb-8">
          <i class="fa-solid fa-sparkles"></i>
          AI-powered client acquisition for freelance devs
        </div>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
          Stop Chasing Clients.<br />
          <span class="text-gradient">Let AI Bring Them to You.</span>
        </h1>

        <p class="text-lg sm:text-xl text-text-2 max-w-2xl mx-auto mb-10 leading-relaxed">
          Enter your skills and projects. Get AI-generated LinkedIn posts, outreach templates,
          Dev.to articles, and freelance platform profiles — ready to publish.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            @click="getStarted"
            class="px-8 py-4 text-base font-bold bg-brand hover:bg-brand-dark text-white rounded-xl cursor-pointer border-0 transition shadow-lg shadow-brand/20"
          >
            <i class="fa-solid fa-rocket mr-2"></i>
            Start Free — No Credit Card
          </button>
          <a
            href="#features"
            class="px-8 py-4 text-base font-semibold bg-transparent border border-border-2 text-text hover:border-brand rounded-xl no-underline transition text-center"
          >
            See What You Get
          </a>
        </div>

        <!-- Social proof -->
        <p class="text-sm text-text-3">
          Built by a dev who shipped 20+ products and landed freelance clients with this exact system.
        </p>
      </div>
    </section>

    <!-- How it works -->
    <section class="py-20 px-4 sm:px-6 border-t border-border">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">From Profile to Clients in 3 Steps</h2>
        <p class="text-text-2">5 minutes to set up. AI does the rest.</p>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="step in steps" :key="step.num" class="text-center">
          <div class="w-12 h-12 rounded-full bg-brand/20 text-brand font-bold text-lg flex items-center justify-center mx-auto mb-4">
            {{ step.num }}
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-text-2">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 px-4 sm:px-6 bg-surface/50 border-t border-border">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Everything You Need to Land Clients</h2>
        <p class="text-text-2">One profile generates all of this — tailored to your skills, projects, and market.</p>
      </div>

      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-surface border border-border rounded-xl p-6 hover:border-brand/30 transition group"
        >
          <div class="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand-light text-xl mb-4 group-hover:bg-brand/20 transition">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="text-base font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-sm text-text-2 leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-20 px-4 sm:px-6 border-t border-border">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Simple Pricing for Indie Devs</h2>
        <p class="text-text-2">Start free. Upgrade when you're ready.</p>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Free -->
        <div class="bg-surface border border-border rounded-2xl p-8">
          <h3 class="text-lg font-semibold mb-1">Free</h3>
          <p class="text-text-3 text-sm mb-6">See what ClientPilot can do</p>
          <div class="text-4xl font-bold mb-6">$0</div>
          <ul class="space-y-3 text-sm text-text-2 mb-8">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> 1 preview generation</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> See all content types</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-xmark text-text-3 mt-0.5"></i> <span class="text-text-3">Limited copy/export</span></li>
          </ul>
          <button
            @click="getStarted"
            class="w-full py-3 text-sm font-semibold bg-surface-2 hover:bg-surface-3 text-text rounded-lg cursor-pointer border-0 transition"
          >
            Get Started
          </button>
        </div>

        <!-- Pro -->
        <div class="bg-surface border-2 border-brand rounded-2xl p-8 relative">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full">
            MOST POPULAR
          </div>
          <h3 class="text-lg font-semibold mb-1">Pro</h3>
          <p class="text-text-3 text-sm mb-6">Unlimited client acquisition</p>
          <div class="text-4xl font-bold mb-1">$9<span class="text-lg text-text-3 font-normal">/mo</span></div>
          <p class="text-xs text-text-3 mb-6">Cancel anytime</p>
          <ul class="space-y-3 text-sm text-text-2 mb-8">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> Unlimited generations</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> All content types</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> Full copy/export</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> Weekly AI content refresh</li>
          </ul>
          <button
            @click="getStarted"
            class="w-full py-3 text-sm font-bold bg-brand hover:bg-brand-dark text-white rounded-lg cursor-pointer border-0 transition shadow-lg shadow-brand/20"
          >
            Start Pro
          </button>
        </div>

        <!-- Lifetime -->
        <div class="bg-surface border border-border rounded-2xl p-8 relative">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-black text-xs font-bold rounded-full">
            BEST VALUE
          </div>
          <h3 class="text-lg font-semibold mb-1">Lifetime</h3>
          <p class="text-text-3 text-sm mb-6">Pay once, use forever</p>
          <div class="text-4xl font-bold mb-1">$69</div>
          <p class="text-xs text-text-3 mb-6">One-time payment</p>
          <ul class="space-y-3 text-sm text-text-2 mb-8">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> Everything in Pro</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> Lifetime updates</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> No recurring fees</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5"></i> Priority support</li>
          </ul>
          <button
            @click="getStarted"
            class="w-full py-3 text-sm font-semibold bg-accent/20 hover:bg-accent/30 text-accent-light rounded-lg cursor-pointer border border-accent/30 transition"
          >
            Get Lifetime Access
          </button>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 px-4 sm:px-6 border-t border-border text-center">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-4">Your Next Client Is One Profile Away</h2>
        <p class="text-text-2 mb-8">5 minutes to set up. AI generates everything. You just publish and wait for DMs.</p>
        <button
          @click="getStarted"
          class="px-8 py-4 text-base font-bold bg-brand hover:bg-brand-dark text-white rounded-xl cursor-pointer border-0 transition shadow-lg shadow-brand/20"
        >
          <i class="fa-solid fa-rocket mr-2"></i>
          Get Started Free
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-4 sm:px-6 border-t border-border text-center text-sm text-text-3">
      <div class="flex items-center justify-center gap-2 mb-2">
        <i class="fa-solid fa-rocket text-brand"></i>
        <span class="font-semibold text-text-2">ClientPilot</span>
      </div>
      <p>Built by <a href="https://dizid.com" target="_blank" class="text-brand hover:text-brand-light no-underline">Dizid</a></p>
    </footer>
  </div>
</template>
