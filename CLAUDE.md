# ClientPilot

AI-powered freelance client acquisition platform — generates personalized outreach content based on freelancer profile and target client context.

## Deployment

- **Netlify site ID:** `bb78ccb7-9663-4b41-bcd8-b3c2d6a23029`
- **Netlify site name:** `clientpilot-app`
- **Production URL:** https://clientpilot.dev (the old https://clientpilot-app.netlify.app 301-redirects there via netlify.toml)
- **GitHub repo:** `dizid/clientpilot`
- **Neon project ID:** `flat-meadow-93593842`
- **Neon database:** `neondb`
- **Firebase project:** `clientpilot-dizid`
- **Production domain:** https://clientpilot.dev
- **Stripe price IDs (LIVE):** Pro monthly `price_1TJr2B8gBja0qkMx2ZfnugJ4`, Lifetime `price_1TJr2H8gBja0qkMxM6sic98C`
- **Stripe product IDs (LIVE):** Pro `prod_UIRvS6cB4lWbzM`, Lifetime `prod_UIRwCCNZUq3vx6`
- **Stripe webhook (LIVE):** `we_1TJr2K8gBja0qkMxLfDqp29A` → `https://clientpilot.dev/.netlify/functions/stripe-webhook`

## Prerendered landing page (since 2026-11-10, T-0179)
`npm run build` also builds `src/entry-server.ts` with `vite build --ssr` (into `dist-ssr/`, gitignored) and runs `scripts/prerender.mjs`: it saves the untouched SPA shell as `dist/app-shell.html` (homepage canonical removed) and writes the rendered landing page into `dist/index.html` with `data-ssg-route="/"`. `netlify.toml`'s SPA fallback serves `app-shell.html`, so /login, /workspace etc. never show the landing HTML. `src/main.ts` hydrates (createSSRApp) only when `data-ssg-route` matches the path. The prerender fails the build if the landing page renders without an `<h1>`.
- Code that runs while rendering the landing page must not touch `window`/`localStorage` at render time (do it in `onMounted` or guard with `typeof window`); the router uses memory history in SSR.
- `App.vue` shows public routes without waiting for Firebase's login check (only `meta.requiresAuth` routes keep the spinner); before this the landing page was a spinner until Firebase answered.

## Blog (since 2026-11-11, T-0352)
Posts live in code, no database: one file per post in `src/content/posts/<slug>.ts` (shape in `types.ts`; registry `index.ts` picks up every file). `/blog` and `/blog/<slug>` are prerendered to `dist/blog.html` and `dist/blog/<slug>.html` (no trailing-slash redirect on Netlify) with their own title, description, canonical and BlogPosting JSON-LD.
- To add a post: add the file, add its URL to `public/sitemap.xml` and a line to `public/llms.txt`, build. The prerender stops the build if the post uses a tag outside the allowed list, has style/class attributes, a description outside 120-170 characters, no https sources, or is missing from the sitemap.
- Every fee, number or rule in a post links to the page it came from (`sources`) and the post shows its `checked` date. No invented stats.
- IndexNow key file: `public/3a21ab3ea1ff0c44abe9a7620a6dd10f.txt`. After a post goes live: POST `https://api.indexnow.org/indexnow` with host `clientpilot.dev`, that key and the new URLs.
- Footer link "Blog" on the landing page; posts end with a small "See how it works" box linking `/`.

## Database Schema

All IDs are UUID (`gen_random_uuid()`). Tables:

- **users** — `id`, `firebase_uid` (unique), `email`, `name`, `avatar_url`, `stripe_customer_id`, `plan` (free/pro/lifetime), `plan_expires_at`, `generations_used`, `created_at`, `updated_at`
- **profiles** — `id`, `user_id` FK, `headline`, `bio`, `skills` TEXT[], `tech_stack` TEXT[], `experience_years` INT, `projects` JSONB, `social_links` JSONB, `target_market`, `pricing_model`, `availability`, `created_at`, `updated_at`
- **generations** — `id`, `user_id` FK, `type`, `content` JSONB, `target_id` FK (nullable), `created_at`
- **targets** — `id`, `user_id` FK, `name`, `niche`, `platform`, `pain_point`, `created_at`
- **pieces** — `id`, `user_id` FK, `generation_id` FK, `type`, `label`, `content` TEXT, `status` (draft/used/replied), `updated_at`, `created_at`
- **rate_limit_events** — `id` BIGSERIAL, `user_id` FK (cascade), `action`, `created_at` — durable per-user rate limits (`lib/rate-limit.mts`), rows older than 1 day pruned automatically

Indexes: `idx_pieces_user_type`, `idx_pieces_status`, `idx_targets_user`, `idx_rate_limit_user_action_time`

## Architecture

### Frontend (Vue 3 + Pinia)
- **Views:** Landing, Login, Onboarding (4-step with validation + auto-save), Workspace (content management), Generate (with target context modal), Settings
- **Stores:** `auth` (Firebase + plan), `profile` (user profile), `content` (pieces + stats + CRUD), `toast` (notifications)
- **Key components:** ContentCard (edit/copy/status/regenerate/delete per piece), WorkspaceSidebar (type tabs), StatsBar, TargetContextModal, DistributionGuide (per-type next steps)

### Backend (Netlify Functions)
- **Auth:** Firebase Admin SDK verifies ID tokens, upserts user in DB
- **AI:** Anthropic Claude API (`claude-sonnet-4-20250514`) generates content, responses parsed into individual pieces
- **Content types:** `linkedin_posts` (10), `outreach_templates` (9), `devto_article` (1), `platform_profile` (5), `portfolio_page` (7), `elevator_pitch` (6)
- **Piece lifecycle:** Generated → individual pieces stored → edit/regenerate/status track → stats aggregation
- **Import (no forms):** `import-profile` (portfolio URL / GitHub / pasted CV → draft profile) and `import-target` (prospect URL → niche/platform/pain point). Both return drafts only; URL fetching goes through `lib/web-fetch.mts` (SSRF guard runs inside the socket DNS lookup — keep using it for any user-supplied URL)
- **Rate limits:** `checkRateLimit(userId, action)` on generate (30/h), regenerate (60/h), import_profile (10/h), import_target (20/h)
- **Validation:** Shared `lib/validate.mts` (requireString, requireUUID, requireOneOf, optionalString) used by all mutating endpoints
- **Payments:** Stripe Checkout for Pro ($9/mo subscription) and Lifetime ($69 one-time), webhook handles plan updates
- **Pricing buttons → checkout (since 2026-11-11, T-0427):** the landing page's 'Start Pro' / 'Get Lifetime Access' go to `/upgrade/pro` / `/upgrade/lifetime` (`src/views/UpgradeView.vue`): sign-in first if needed (`/login?redirect=`), then straight to Stripe Checkout for that plan; this route is allowed without a finished profile (router guard exception), already-Pro users go to `/workspace`. Other landing buttons still go login → onboarding. Price IDs are hard-coded in UpgradeView, SettingsView and GenerateView: change all three together.
- **Webhook and Lifetime (since 2026-11-11, T-0430):** `stripe-webhook.mts` subscription events (deleted, updated, invoice.payment_failed) only change users whose plan isn't 'lifetime' (`AND plan IS DISTINCT FROM 'lifetime'`), so an old Pro subscription's late events can't drop a $69 Lifetime buyer to Free.

### Key Patterns
- All functions: `export default async (req: Request) => { ... }` with `authenticateRequest(req)` guard; top-level catch returns `{ status: errorStatus(e) }` (401 for `AuthError`, else 500)
- Security headers + CSP live in `netlify.toml`; the CSP hash covers the inline gtag script in `index.html` — recompute if that script changes
- DB: `query(sql, params)` from shared pool, parameterized queries only
- Imports use `.mjs` extension in functions (esbuild resolves `.mts` → `.mjs`)
- Frontend API layer: Axios with Firebase token interceptor at `/.netlify/functions`
- Optimistic updates in content store with rollback on error
- Input validation via `validate()` helper at top of every mutating function, returns 400 on failure

## E2E Tests

`e2e/new-user-journey.spec.ts` drives the full no-forms journey (landing URL → Google sign-in → auto import → first targeted outreach) against the local Vite dev server with real functions and real Claude calls.

- Login: Firebase **Auth emulator** (throwaway users, prod auth untouched) — `VITE_FIREBASE_AUTH_EMULATOR_HOST` is set only by `playwright.config.ts`
- Database: **must** be a Neon branch — `E2E_DATABASE_URL` is required, the config refuses to run without it
- Run: `NODE_OPTIONS=--network-family-autoselection-attempt-timeout=3000 E2E_DATABASE_URL=<branch url> npm run test:e2e` (the NODE_OPTIONS flag is needed on slow networks; Node's default 250ms per-address connect timeout fails against Neon)
- CSP is bypassed locally (it only allows the real Firebase auth domain); verify production CSP separately after deploy
