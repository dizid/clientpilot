<script setup lang="ts">
import { ref } from 'vue'
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
  {
    icon: 'fa-brands fa-linkedin',
    title: 'LinkedIn Posts',
    desc: 'AI writes 10 engaging posts that establish your expertise and attract clients. Schedule 3x/week.',
    preview: [
      '🚀 Just shipped a real-time analytics dashboard...',
      '💡 3 things I learned building SaaS for clients...',
      '🔥 How I landed a $12k contract from a cold DM...',
    ],
    badge: null,
  },
  {
    icon: 'fa-solid fa-envelope-open-text',
    title: 'Outreach Templates',
    desc: '7 battle-tested templates — cold, warm, platform, and follow-ups. Personalized to your profile.',
    preview: [
      'Subject: Quick question about [Company] stack',
      'Hi Alex, I noticed you\'re scaling your...',
      '...I\'ve helped 3 similar teams cut infra costs by 40%.',
    ],
    badge: null,
  },
  {
    icon: 'fa-brands fa-dev',
    title: 'Dev.to Articles',
    desc: 'Full case study articles from your projects. Technical depth that attracts hiring managers.',
    preview: [
      'How I Built a Real-Time Dashboard in 48 Hours',
      'TypeScript Tips That Saved My Client $8k/mo',
      'Migrating a Legacy API: Lessons Learned',
    ],
    badge: '1,200 words',
  },
  {
    icon: 'fa-solid fa-id-card',
    title: 'Platform Profiles',
    desc: 'Copy-paste profiles for Toptal, freelance.nl, Arc.dev, and every major platform.',
    preview: [
      'Toptal profile',
      'Arc.dev profile',
      'freelance.nl profile',
    ],
    badge: '5 platform variants',
  },
  {
    icon: 'fa-solid fa-file-code',
    title: 'Portfolio Page',
    desc: 'A complete /hire landing page with services, case studies, pricing, and contact form.',
    preview: [
      'Services & stack',
      'Case studies',
      'Pricing + Contact',
    ],
    badge: null,
  },
  {
    icon: 'fa-solid fa-bullhorn',
    title: 'Elevator Pitch',
    desc: 'Your 30-second pitch, email signature, Twitter bio, and GitHub README — all consistent.',
    preview: [
      '30-sec verbal pitch',
      'Twitter / X bio',
      'LinkedIn headline',
    ],
    badge: '4 formats',
  },
]

const steps = [
  { num: '1', title: 'Enter Your Profile', desc: 'Skills, projects, stack, and links. Takes 5 minutes.' },
  { num: '2', title: 'AI Generates Everything', desc: 'LinkedIn posts, articles, templates, profiles — all tailored to you.' },
  { num: '3', title: 'Copy, Paste, Deploy', desc: 'Publish to LinkedIn, Dev.to, freelance platforms. Start getting clients.' },
]

// FAQ accordion state
interface FaqItem {
  q: string
  a: string
  open: boolean
}

const faqs = ref<FaqItem[]>([
  {
    q: 'What kind of content does ClientPilot generate?',
    a: 'ClientPilot generates 6 types of content: LinkedIn Posts (10 engagement-focused posts), Outreach Templates (7 cold/warm/follow-up email templates), Dev.to Articles (full case studies with technical depth), Platform Profiles (tailored bios for Toptal, Arc.dev, freelance.nl, and more), Portfolio Page copy (complete /hire landing page), and Elevator Pitch formats (30-sec pitch, Twitter bio, LinkedIn headline, GitHub README).',
    open: false,
  },
  {
    q: 'How is this different from just using ChatGPT?',
    a: 'ChatGPT gives generic output. ClientPilot uses your actual profile — your skills, stack, projects, and positioning — to generate content that sounds like you. The templates are built around freelance best practices, and everything stays consistent across all formats. No prompt engineering required.',
    open: false,
  },
  {
    q: 'Can I edit the generated content?',
    a: 'Yes. All generated content is fully editable inline in the dashboard. You can tweak tone, swap examples, or regenerate individual sections. The content is a starting point — polished and professional — that you make yours.',
    open: false,
  },
  {
    q: 'What if I want to target different niches or client types?',
    a: 'Use the Target Context feature when generating. Describe your ideal client — startup, agency, enterprise, specific industry — and the AI tailors the messaging, pain points, and positioning accordingly. You can run multiple targets from the same profile.',
    open: false,
  },
  {
    q: 'Is there an API or integrations?',
    a: 'Not yet. Direct publishing integrations (LinkedIn, Dev.to) and an API for automation are on the roadmap. Lifetime plan holders will get these features at no extra cost when they ship.',
    open: false,
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, anytime. Cancel from the Settings page — no hoops, no retention flows. You keep access until the end of your billing period. If you want a refund within 7 days of purchase, just email us.',
    open: false,
  },
])

function toggleFaq(index: number) {
  faqs.value[index].open = !faqs.value[index].open
}
</script>

<template>
  <div class="min-h-screen">

    <!-- ─── Nav ─────────────────────────────────────────────── -->
    <nav class="fixed top-0 inset-x-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div class="flex items-center gap-2 text-lg font-bold">
          <i class="fa-solid fa-rocket text-brand"></i>
          <span>Client<span class="text-brand">Pilot</span></span>
        </div>
        <div class="flex items-center gap-4 sm:gap-6">
          <a href="#features" class="text-sm text-text-2 hover:text-text no-underline transition hidden sm:block">Features</a>
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

    <!-- ─── Hero ─────────────────────────────────────────────── -->
    <section class="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
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
            class="btn-glow px-8 py-4 text-base font-bold bg-brand hover:bg-brand-dark text-white rounded-xl cursor-pointer border-0 transition shadow-lg shadow-brand/20"
          >
            <i class="fa-solid fa-rocket mr-2"></i>
            Start Free — No Credit Card
          </button>
          <a
            href="#demo"
            class="px-8 py-4 text-base font-semibold bg-transparent border border-border-2 text-text hover:border-brand rounded-xl no-underline transition text-center"
          >
            See It In Action
          </a>
        </div>

        <p class="text-sm text-text-3">
          Built by a dev who shipped 20+ products and landed freelance clients with this exact system.
        </p>
      </div>
    </section>

    <!-- ─── Social Proof Bar ──────────────────────────────────── -->
    <section class="py-5 px-4 sm:px-6 border-y border-border bg-surface/30">
      <div class="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-sm text-text-3">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-users text-brand/60 text-base"></i>
          <span>500+ freelancers using ClientPilot</span>
        </div>
        <div class="hidden sm:block w-px h-4 bg-border-2"></div>
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-layer-group text-brand/60 text-base"></i>
          <span>6 content types generated in one click</span>
        </div>
        <div class="hidden sm:block w-px h-4 bg-border-2"></div>
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-earth-europe text-brand/60 text-base"></i>
          <span>Used by devs from 20+ countries</span>
        </div>
      </div>
    </section>

    <!-- ─── How It Works ─────────────────────────────────────── -->
    <section class="py-20 px-4 sm:px-6 border-b border-border">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">From Profile to Clients in 3 Steps</h2>
        <p class="text-text-2">5 minutes to set up. AI does the rest.</p>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <!-- Connecting line (desktop only) -->
        <div class="hidden md:block absolute top-6 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gradient-to-r from-brand/20 via-brand/40 to-brand/20 pointer-events-none"></div>

        <div v-for="step in steps" :key="step.num" class="text-center relative">
          <div
            class="w-12 h-12 rounded-full border-2 border-brand/30 bg-brand/10 text-brand font-bold text-lg flex items-center justify-center mx-auto mb-4"
            style="animation: pulse-glow 3s ease-in-out infinite"
          >
            {{ step.num }}
          </div>
          <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-text-2">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ─── Live Demo (Before / After) ───────────────────────── -->
    <section id="demo" class="py-20 px-4 sm:px-6 border-b border-border bg-surface/30">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent-light text-sm font-medium mb-4">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            See It In Action
          </div>
          <h2 class="text-3xl font-bold mb-4">Input Profile. Get Client-Ready Content.</h2>
          <p class="text-text-2">This is what ClientPilot produces from a few paragraphs about your work.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          <!-- Left: Profile Input Card -->
          <div class="bg-surface border border-border rounded-2xl overflow-hidden" style="animation: fade-up 0.6s ease both">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2/50">
              <div class="w-3 h-3 rounded-full bg-danger/70"></div>
              <div class="w-3 h-3 rounded-full bg-accent/70"></div>
              <div class="w-3 h-3 rounded-full bg-success/70"></div>
              <span class="ml-2 text-xs text-text-3 font-mono">your-profile.json</span>
            </div>
            <div class="p-6 space-y-5">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center text-brand-light text-xl font-bold shrink-0">
                  JS
                </div>
                <div>
                  <p class="font-semibold text-text">Jordan Smith</p>
                  <p class="text-sm text-text-3">Full-Stack Developer · 6 yrs exp</p>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-text-3 uppercase tracking-wider mb-2">Headline</p>
                <p class="text-sm text-text-2 leading-relaxed bg-surface-2 rounded-lg px-3 py-2">
                  I build scalable SaaS products for B2B startups — React, Node.js, PostgreSQL.
                </p>
              </div>

              <div>
                <p class="text-xs font-semibold text-text-3 uppercase tracking-wider mb-2">Skills</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="skill in ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Stripe']" :key="skill"
                    class="px-2.5 py-1 bg-brand/10 text-brand-light text-xs rounded-md font-medium">
                    {{ skill }}
                  </span>
                </div>
              </div>

              <div>
                <p class="text-xs font-semibold text-text-3 uppercase tracking-wider mb-2">Recent Project</p>
                <p class="text-sm text-text-2 leading-relaxed bg-surface-2 rounded-lg px-3 py-2">
                  Built real-time analytics dashboard for a fintech startup. Cut reporting time by 80%. Used React, Recharts, and a Postgres event pipeline.
                </p>
              </div>
            </div>
          </div>

          <!-- Arrow separator -->
          <div class="hidden lg:flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          </div>

          <!-- Right: Generated Output Card -->
          <div class="bg-surface border border-brand/30 rounded-2xl overflow-hidden shadow-lg shadow-brand/10" style="animation: fade-up 0.6s 0.2s ease both; opacity: 0; animation-fill-mode: forwards">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-brand/20 bg-brand/5">
              <i class="fa-solid fa-sparkles text-brand-light text-xs"></i>
              <span class="text-xs text-brand-light font-semibold font-mono">ClientPilot — Generated Output</span>
              <span class="ml-auto px-2 py-0.5 bg-success/20 text-success text-xs rounded font-medium">Ready</span>
            </div>
            <div class="p-6 space-y-4">

              <!-- LinkedIn snippet -->
              <div class="bg-surface-2 rounded-xl p-4 border border-border">
                <div class="flex items-center gap-2 mb-3">
                  <i class="fa-brands fa-linkedin text-brand-light text-sm"></i>
                  <span class="text-xs font-semibold text-text-2">LinkedIn Post #1</span>
                </div>
                <p class="text-sm text-text leading-relaxed">
                  I just helped a fintech startup cut their reporting time by 80%.<br />
                  <span class="text-text-2">Here's the architecture decision that made it possible — and why most devs skip it...</span>
                </p>
                <div class="mt-3 flex gap-3 text-xs text-text-3">
                  <span><i class="fa-regular fa-thumbs-up mr-1"></i>142</span>
                  <span><i class="fa-regular fa-comment mr-1"></i>31</span>
                </div>
              </div>

              <!-- Outreach snippet -->
              <div class="bg-surface-2 rounded-xl p-4 border border-border">
                <div class="flex items-center gap-2 mb-3">
                  <i class="fa-solid fa-envelope-open-text text-accent text-sm"></i>
                  <span class="text-xs font-semibold text-text-2">Cold Outreach Template</span>
                </div>
                <p class="text-sm text-text-2 font-mono leading-relaxed">
                  <span class="text-text-3">Subject:</span> Quick question about [Company]'s data stack<br />
                  <span class="text-text-3">Hi [Name],</span> I noticed [Company] is scaling fast — I built a real-time pipeline for a similar fintech that cut infra costs by 40%...
                </p>
              </div>

              <!-- Badges row -->
              <div class="flex flex-wrap gap-2 pt-1">
                <span class="px-2.5 py-1 bg-surface-3/50 text-text-3 text-xs rounded-md">+ 9 more LinkedIn posts</span>
                <span class="px-2.5 py-1 bg-surface-3/50 text-text-3 text-xs rounded-md">+ 6 email templates</span>
                <span class="px-2.5 py-1 bg-surface-3/50 text-text-3 text-xs rounded-md">+ Dev.to article</span>
                <span class="px-2.5 py-1 bg-surface-3/50 text-text-3 text-xs rounded-md">+ 5 platform profiles</span>
              </div>
            </div>
          </div>

        </div>

        <!-- CTA below demo -->
        <div class="text-center mt-10">
          <button
            @click="getStarted"
            class="px-7 py-3.5 text-sm font-bold bg-brand hover:bg-brand-dark text-white rounded-xl cursor-pointer border-0 transition shadow-lg shadow-brand/20"
          >
            <i class="fa-solid fa-bolt mr-2"></i>
            Generate Mine Now — It's Free
          </button>
        </div>
      </div>
    </section>

    <!-- ─── Features ─────────────────────────────────────────── -->
    <section id="features" class="py-20 px-4 sm:px-6 border-b border-border">
      <div class="max-w-5xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Everything You Need to Land Clients</h2>
        <p class="text-text-2">One profile generates all of this — tailored to your skills, projects, and market.</p>
      </div>

      <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-surface border border-border rounded-xl p-5 hover:border-brand/40 hover:bg-surface/80 transition-all group flex flex-col gap-4"
        >
          <!-- Header -->
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand-light text-lg shrink-0 group-hover:bg-brand/20 transition">
              <i :class="feature.icon"></i>
            </div>
            <div>
              <h3 class="text-sm font-semibold leading-tight">{{ feature.title }}</h3>
              <p class="text-xs text-text-3 mt-1 leading-relaxed">{{ feature.desc }}</p>
            </div>
          </div>

          <!-- Mock preview -->
          <div class="bg-surface-2 rounded-lg p-3 border border-border mt-auto">
            <div v-if="feature.badge" class="mb-2">
              <span class="px-2 py-0.5 bg-brand/15 text-brand-light text-xs rounded font-medium">
                {{ feature.badge }}
              </span>
            </div>
            <ul class="space-y-1.5">
              <li
                v-for="line in feature.preview"
                :key="line"
                class="flex items-center gap-2 text-xs text-text-3"
              >
                <span class="w-1 h-1 rounded-full bg-brand/40 shrink-0"></span>
                {{ line }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Pricing ───────────────────────────────────────────── -->
    <section id="pricing" class="py-20 px-4 sm:px-6 border-b border-border bg-surface/20">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Simple Pricing for Indie Devs</h2>
        <p class="text-text-2">Start free. Upgrade when you're ready.</p>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Free -->
        <div class="bg-surface border border-border rounded-2xl p-8 flex flex-col">
          <h3 class="text-lg font-semibold mb-1">Free</h3>
          <p class="text-text-3 text-sm mb-6">See what ClientPilot can do</p>
          <div class="text-4xl font-bold mb-6">$0</div>
          <ul class="space-y-3 text-sm text-text-2 mb-8 flex-1">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> 1 preview generation</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> See all content types</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-xmark text-text-3 mt-0.5 shrink-0"></i> <span class="text-text-3">Limited copy/export</span></li>
          </ul>
          <button
            @click="getStarted"
            class="w-full py-3 text-sm font-semibold bg-surface-2 hover:bg-surface-3 text-text rounded-lg cursor-pointer border-0 transition"
          >
            Get Started
          </button>
        </div>

        <!-- Pro -->
        <div class="bg-surface border-2 border-brand rounded-2xl p-8 relative flex flex-col shadow-xl shadow-brand/10">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand text-white text-xs font-bold rounded-full whitespace-nowrap">
            MOST POPULAR
          </div>
          <h3 class="text-lg font-semibold mb-1">Pro</h3>
          <p class="text-text-3 text-sm mb-6">Unlimited client acquisition</p>
          <div class="text-4xl font-bold mb-1">$9<span class="text-lg text-text-3 font-normal">/mo</span></div>
          <p class="text-xs text-text-3 mb-6">Cancel anytime</p>
          <ul class="space-y-3 text-sm text-text-2 mb-8 flex-1">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> Unlimited generations</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> All content types</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> Full copy/export</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> Weekly AI content refresh</li>
          </ul>
          <button
            @click="getStarted"
            class="w-full py-3 text-sm font-bold bg-brand hover:bg-brand-dark text-white rounded-lg cursor-pointer border-0 transition shadow-lg shadow-brand/20"
          >
            Start Pro
          </button>
        </div>

        <!-- Lifetime -->
        <div class="bg-surface border border-border rounded-2xl p-8 relative flex flex-col">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-black text-xs font-bold rounded-full whitespace-nowrap">
            BEST VALUE
          </div>
          <h3 class="text-lg font-semibold mb-1">Lifetime</h3>
          <p class="text-text-3 text-sm mb-6">Pay once, use forever</p>
          <div class="text-4xl font-bold mb-1">$69</div>
          <p class="text-xs text-text-3 mb-6">One-time payment</p>
          <ul class="space-y-3 text-sm text-text-2 mb-8 flex-1">
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> Everything in Pro</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> Lifetime updates</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> No recurring fees</li>
            <li class="flex items-start gap-2"><i class="fa-solid fa-check text-success mt-0.5 shrink-0"></i> Priority support</li>
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

    <!-- ─── FAQ ──────────────────────────────────────────────── -->
    <section class="py-20 px-4 sm:px-6 border-b border-border">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-text-2">Everything you need to know before signing up.</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, index) in faqs"
            :key="index"
            class="bg-surface border rounded-xl overflow-hidden transition-all"
            :class="faq.open ? 'border-brand/30' : 'border-border'"
          >
            <!-- Question row -->
            <button
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-transparent border-0 cursor-pointer group"
            >
              <span class="text-sm font-semibold text-text group-hover:text-brand-light transition">
                {{ faq.q }}
              </span>
              <i
                class="fa-solid fa-chevron-down text-text-3 text-xs shrink-0 transition-transform duration-300"
                :class="faq.open ? 'rotate-180 text-brand-light' : ''"
              ></i>
            </button>

            <!-- Answer -->
            <div
              v-if="faq.open"
              class="px-5 pb-5"
              style="animation: fade-up 0.2s ease both"
            >
              <div class="h-px bg-border mb-4"></div>
              <p class="text-sm text-text-2 leading-relaxed">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── Final CTA ─────────────────────────────────────────── -->
    <section class="py-24 px-4 sm:px-6 text-center relative overflow-hidden">
      <!-- Glow behind CTA -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-[600px] h-[400px] bg-brand/5 rounded-full blur-[100px]"></div>
      </div>

      <div class="relative max-w-2xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-success/10 border border-success/20 rounded-full text-success-light text-sm font-medium mb-6">
          <i class="fa-solid fa-circle-check"></i>
          Free to start — no credit card required
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold mb-4">
          Your Next Client Is One Profile Away
        </h2>
        <p class="text-text-2 mb-10 text-lg">
          5 minutes to set up. AI generates everything. You just publish and wait for DMs.
        </p>
        <button
          @click="getStarted"
          class="btn-glow px-10 py-4 text-base font-bold bg-brand hover:bg-brand-dark text-white rounded-xl cursor-pointer border-0 transition shadow-xl shadow-brand/25"
        >
          <i class="fa-solid fa-rocket mr-2"></i>
          Get Started Free
        </button>
      </div>
    </section>

    <!-- ─── Footer ────────────────────────────────────────────── -->
    <footer class="py-10 px-4 sm:px-6 border-t border-border">
      <div class="max-w-5xl mx-auto">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-6">

          <!-- Brand -->
          <div class="flex items-center gap-2 text-base font-semibold">
            <i class="fa-solid fa-rocket text-brand"></i>
            <span>Client<span class="text-brand">Pilot</span></span>
          </div>

          <!-- Links -->
          <nav class="flex flex-wrap items-center justify-center gap-5 text-sm text-text-3">
            <a href="#features" class="hover:text-text no-underline transition">Features</a>
            <a href="#pricing" class="hover:text-text no-underline transition">Pricing</a>
            <a href="/privacy" class="hover:text-text no-underline transition">Privacy</a>
            <a href="/terms" class="hover:text-text no-underline transition">Terms</a>
            <a href="https://github.com/dizid/clientpilot" target="_blank" rel="noopener noreferrer" class="hover:text-text no-underline transition">
              <i class="fa-brands fa-github mr-1"></i>GitHub
            </a>
            <a href="https://twitter.com/diziddev" target="_blank" rel="noopener noreferrer" class="hover:text-text no-underline transition">
              <i class="fa-brands fa-x-twitter mr-1"></i>Twitter
            </a>
          </nav>

        </div>

        <div class="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-3">
          <p>
            Built by <a href="https://dizid.com" target="_blank" class="text-brand hover:text-brand-light no-underline">Dizid</a>
            &mdash; Web development that ships.
          </p>
          <div class="flex items-center gap-2 px-3 py-1.5 bg-surface-2 rounded-full border border-border">
            <i class="fa-solid fa-microchip text-brand/60 text-xs"></i>
            <span>Built with Claude AI</span>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>
