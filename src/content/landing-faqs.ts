// Landing page FAQ. One list for two uses: LandingView.vue shows it as an accordion,
// and scripts/prerender.mjs turns it into the homepage's FAQPage JSON-LD (via
// src/entry-server.ts). Answers must match what the app does: content counts come
// from netlify/functions/lib/prompts.mts, regeneration is Pro-only
// (regenerate-piece.mts), cancelling is by email (no button in Settings).

export interface LandingFaq {
  q: string
  a: string
}

export const LANDING_FAQS: LandingFaq[] = [
  {
    q: 'What kind of content does ClientPilot generate?',
    a: 'ClientPilot generates 6 types of content: LinkedIn Posts (7 posts), Outreach Templates (6: cold messages to a funded startup, a CTO and an agency, a warm note to a former colleague, a LinkedIn message after engaging with someone\'s post, and a reply to a freelance platform inquiry), a Dev.to Article (a 600-900 word case study of your strongest project), Platform Profile text (short bio, full bio, skills, availability and rate wording for Toptal, Arc.dev, freelance.nl and similar platforms), Portfolio Page copy (a complete /hire page), and Elevator Pitch formats (30-sec pitch, X bio, LinkedIn headline, email signature, GitHub README and a one-liner).',
  },
  {
    q: 'How is this different from just using ChatGPT?',
    a: 'ChatGPT gives generic output. ClientPilot uses your actual profile — your skills, stack, projects, and positioning — to generate content that sounds like you. The templates are built around freelance best practices, and everything stays consistent across all formats. No prompt engineering required.',
  },
  {
    q: 'Can I edit the generated content?',
    a: 'Yes. All generated content is fully editable inline in the dashboard, and every piece copies with one click. On Pro and Lifetime you can also regenerate any piece with your own feedback. The content is a starting point that you make yours.',
  },
  {
    q: 'What if I want to target different niches or client types?',
    a: 'Use the Target Context feature when generating. Describe your ideal client — startup, agency, enterprise, specific industry — and the AI tailors the messaging, pain points, and positioning accordingly. You can run multiple targets from the same profile.',
  },
  {
    q: 'Is there an API or integrations?',
    a: 'Not yet. Direct publishing integrations (LinkedIn, Dev.to) and an API for automation are on the roadmap. Lifetime plan holders will get these features at no extra cost when they ship.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, anytime. Email dev@dizid.com and we cancel it, no hoops, no retention flows. You keep access until the end of your billing period. If you want a refund within 7 days of purchase, email the same address.',
  },
]
