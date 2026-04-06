# ClientPilot Enhancement Plan

## Context

ClientPilot is functional MVP-grade (6.5/10). The product works — landing page is polished, generation flow delivers value, Pinia stores are well-designed. But there are **security holes that must be patched before any growth push**, missing analytics (flying completely blind), no email capture (losing ~90% of visitors), and UX rough edges that hurt retention. This plan prioritizes fixes that protect the business first, then enhancements that actually move revenue.

**Critical honest assessment:** The app generates good content but has no way to measure if anyone cares. No analytics, no email capture, no testimonials, no content strategy. The backend has real security issues (origin injection, XSS, no rate limiting). Fixing these isn't overengineering — it's table stakes.

---

## Phase 1: Security Fixes (P0 — non-negotiable)

These ship before ANY marketing or growth work. Estimated: ~2 hours total.

### 1.1 Fix Origin Header Injection in Stripe Checkout
- **File:** `netlify/functions/create-checkout.mts:51`
- **Problem:** `req.headers.get('origin')` is user-controlled → attacker redirects Stripe to malicious URL after payment
- **Fix:** Hardcode `const origin = process.env.SITE_URL || 'https://clientpilot-app.netlify.app'`
- **Effort:** 5 min

### 1.2 Fix DB SSL (MITM vulnerability)
- **File:** `netlify/functions/lib/db.mts:5`
- **Problem:** `rejectUnauthorized: false` accepts any cert
- **Fix:** Change to `ssl: true` (Neon has valid CA-signed certs)
- **Effort:** 5 min

### 1.3 Fix XSS in Markdown Renderer
- **File:** `src/lib/markdown.ts`
- **Problem:** Regex-based renderer used with `v-html` in ContentCard. Link replacement allows `javascript:` URLs. No HTML escaping.
- **Fix:** `npm install dompurify` + wrap output: `return DOMPurify.sanitize(result)`. Also block `javascript:` in href pattern.
- **Effort:** 30 min

### 1.4 Batch INSERT in Generate (N+1 fix)
- **File:** `netlify/functions/generate.mts:110-115`
- **Problem:** 10 LinkedIn posts = 10 sequential INSERT queries over the network. Slow + fragile on Netlify's 26s timeout.
- **Fix:** Single multi-row INSERT with parameterized VALUES
- **Effort:** 20 min

### 1.5 Sanitize Error Messages
- **Files:** All 14 functions in `netlify/functions/`
- **Problem:** `e.message` returned to client — leaks DB table names, Anthropic API details
- **Fix:** Create `lib/errors.mts` with `safeError(e, fallback)` that logs real error + returns generic message
- **Effort:** 30 min

### 1.6 Add Missing Stripe Webhook Events
- **File:** `netlify/functions/stripe-webhook.mts`
- **Problem:** Missing `invoice.payment_failed` — users with failed cards stay on Pro forever
- **Fix:** Add `invoice.payment_failed` (downgrade to free) and `customer.subscription.updated` (sync plan state)
- **Effort:** 30 min

### 1.7 Make Claude Model Configurable
- **Files:** `netlify/functions/generate.mts:81`, `regenerate-piece.mts`
- **Fix:** `const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514'`
- **Effort:** 5 min

---

## Phase 2: Analytics Foundation (P0 — @SEO + @Data)

Without analytics, every other enhancement is a guess. Estimated: ~3 hours.

### 2.1 GA4 Setup
- **File:** `index.html` — add `gtag.js` snippet in `<head>`
- **File:** New `src/lib/analytics.ts` — centralized `track(event, params?)` wrapper
- **File:** `src/router/index.ts` — add `router.afterEach()` pageview hook

### 2.2 Instrument Key Events (17 events)
| Event | Location |
|-------|----------|
| `cta_click_hero` | LandingView.vue hero button |
| `cta_click_pricing` | LandingView.vue pricing buttons (with plan param) |
| `login_success` | LoginView.vue after auth |
| `onboarding_step` | OnboardingView.vue nextStep() with step number |
| `onboarding_complete` | OnboardingView.vue finish() |
| `generate_start` / `generate_complete` | GenerateView.vue with content type |
| `upgrade_click` | GenerateView + SettingsView with plan |
| `piece_copy` / `piece_edit` / `piece_status_change` | ContentCard.vue |
| `checkout_success` | Detect `?checkout=success` URL param |

### 2.3 GA4 Funnel
Set up exploration: Landing → Login → Onboarding Complete → Generate → Upgrade

---

## Phase 3: SEO Quick Wins (P0 — @SEO)

Estimated: ~2 hours.

### 3.1 robots.txt + sitemap.xml
- Create both in `public/` directory (neither exists)

### 3.2 Fix OG Image
- `index.html:21,28` references `/og-image.svg` — most social platforms don't render SVG
- Replace with 1200x630 PNG

### 3.3 FAQPage Structured Data
- Add `@type: "FAQPage"` JSON-LD to index.html using existing FAQ data from LandingView

### 3.4 Privacy & Terms Pages
- Footer links to `/privacy` and `/terms` are silent 404s (router catch-all redirects to `/`)
- Create `PrivacyView.vue` and `TermsView.vue` with real content naming data processors (Firebase, Neon, Stripe, Anthropic)
- Add routes in router

---

## Phase 4: Conversion & Lead Capture (P1 — @Growth + @Content)

Estimated: ~8 hours.

### 4.1 Email Capture for Non-Converting Visitors
- **New component:** `LeadCaptureModal.vue` — exit-intent on desktop (mouseout), 45s timer on mobile
- **Offer:** "Get Our Free Cold Outreach Sequence for Developers"
- **Backend:** New `capture-lead.mts` function + `leads` table (email, source, created_at)
- **Also:** Inline email CTA below demo section in LandingView
- **Expected:** 3-8% capture rate of bouncing visitors

### 4.2 Pricing ROI Messaging
- **File:** `src/views/LandingView.vue:419-492`
- Add above pricing: "The average freelance project is worth $2,000-$15,000"
- Under Pro: "One coffee per month. One client pays for 10 years."
- Under Lifetime: Strikethrough "$108/yr" → "$69 one-time (save 36%)"
- **Expected:** 10-20% conversion lift for minimal effort

### 4.3 Replace Fake Social Proof with Real Numbers
- "500+ freelancers" on landing page is unverifiable
- New public endpoint `get-public-stats.mts`: `SELECT COUNT(*) FROM users` + total generations
- Display real numbers — "47 freelancers have generated 312 pieces" is more credible than a round fake number

### 4.4 Onboarding Value Messaging
- Add contextual hints at each step explaining WHY:
  - Step 1: "Your headline becomes the hook in every LinkedIn post and outreach email"
  - Step 2: "These appear as credibility markers in your generated content"
  - Step 3: "Real projects = real case studies. This makes your outreach believable"
  - Step 4: "Targeting a specific market makes outreach 3x more effective"

---

## Phase 5: Core UX Improvements (P1 — @FullStack)

Estimated: ~10 hours.

### 5.1 Target Delete & Edit
- New functions: `delete-target.mts`, `update-target.mts`
- Update `TargetContextModal.vue` with edit/delete icons
- Users currently can't manage targets — they accumulate forever

### 5.2 Content Export
- Add "Export" button in WorkspaceView section header
- "Copy all" (clipboard) and "Download as .txt/.md"
- Pure frontend — data already in Pinia store, no backend needed

### 5.3 Centralize Content Type Definitions
- Content types hardcoded as magic strings in 6+ files (WorkspaceSidebar, GenerateView, DistributionGuide, prompts.mts, etc.)
- Create `src/lib/content-types.ts` as single source of truth with type/label/icon metadata
- Unblocks adding new content types without touching 6 files

### 5.4 Add Pagination to Pieces Query
- `netlify/functions/get-pieces.mts` returns ALL pieces, no LIMIT
- Add `?limit=25&offset=0` query params
- Add "Load more" in WorkspaceView
- Prevents performance degradation as users accumulate content

### 5.5 Rate Limiting
- New `lib/rate-limit.mts` with sliding-window check against DB
- New `rate_limits` table (user_id, action, created_at)
- Apply to: `/generate` (5/hr free, 30/hr pro), `/regenerate-piece` (20/hr), `/create-checkout` (10/hr)
- Protects against API cost abuse

### 5.6 Delete Dead Code
- `src/components/workspace/GenerationProgress.vue` — never imported anywhere. Delete it.

---

## Phase 6: Revenue & Retention (P2 — @FullStack + @Growth)

Estimated: ~12 hours.

### 6.1 Settings Page: Cancel Subscription + Delete Account
- Currently a minimal display. Add:
  - "Cancel Subscription" button (new `cancel-subscription.mts` → Stripe API)
  - "Delete Account" button (cascade delete all user data in transaction)
  - "Export All Data" button
- Cancel + delete are GDPR requirements

### 6.2 "Generate More" from Workspace
- Add button in workspace section header that opens TargetContextModal for current content type
- Reuses existing components — this is the core retention loop (quick re-generation for new targets)

### 6.3 Content Analytics
- Enhance `get-stats.mts` with per-type breakdown (which types have most "used"/"replied" pieces)
- Show in StatsBar: "Your outreach templates have a 23% reply rate"
- Tells freelancers what's working → keeps them coming back

### 6.4 Usage Nudge Banners
- On login, check for draft pieces older than 3 days
- Show dismissible banner: "You have 12 unused LinkedIn posts. Publish them this week."
- Zero API cost, drives engagement

### 6.5 Email Sequences (@Email)
- Integrate Resend (free tier: 3k emails/month)
- Welcome sequence (3 emails: day 0/1/3) triggered on new user creation
- Post-generation upgrade sequence (3 emails: day 0/3/7) for free users
- Re-engagement at day 14/21/30 for dormant users

### 6.6 Blog Infrastructure (@Content + @SEO)
- Use Vite `import.meta.glob` to load `.md` files from `src/content/blog/`
- Create BlogView + BlogPostView, add routes
- Priority posts targeting freelancer keywords:
  1. "How to Write Cold Outreach Emails That Get Freelance Clients"
  2. "LinkedIn Profile Tips for Freelance Developers (2026)"
  3. "Freelance Developer Portfolio: What to Include"
- Expected: 500-2000 monthly organic visits within 3-6 months

---

## What We're NOT Doing (anti-scope)

- **No shared UI component library** — yes there's button/modal duplication, but extracting a design system for 6 views is premature. Fix when adding new views.
- **No splitting OnboardingView** into sub-components — it's 1000 lines but it works. Refactor when adding new steps.
- **No WebSocket real-time generation progress** — polling or simple progress bar is fine. Users wait 30s, not 30 min.
- **No dark/light mode toggle** — dark-only is fine for dev audience.
- **No GitHub OAuth import** — nice but not essential. Profile form works.
- **No referral program** — premature before 200+ active users.

---

## Implementation Sequence

| Week | Focus | Team | Hours |
|------|-------|------|-------|
| 1 | Phase 1 (Security) + Phase 2 (Analytics) + Phase 3 (SEO) | @FullStack + @SEO | ~7h |
| 2 | Phase 4 (Conversion/Lead Capture) + Phase 5.1-5.3 (UX) | @Growth + @FullStack | ~12h |
| 3 | Phase 5.4-5.6 (UX) + Phase 6.1-6.4 (Revenue/Retention) | @FullStack | ~12h |
| 4 | Phase 6.5 (Email) + Phase 6.6 (Blog) | @Email + @Content + @SEO | ~10h |

## Verification

After each phase:
- `npm run build` passes
- Manual test of changed flows (generate, checkout, workspace)
- For security fixes: verify with curl (origin injection, error messages)
- For analytics: check GA4 real-time view
- For SEO: validate structured data with Google Rich Results Test
- For Stripe: test webhook with `stripe listen --forward-to`
