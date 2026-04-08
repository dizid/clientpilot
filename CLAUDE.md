# ClientPilot

AI-powered freelance client acquisition platform — generates personalized outreach content based on freelancer profile and target client context.

## Deployment

- **Netlify site ID:** `bb78ccb7-9663-4b41-bcd8-b3c2d6a23029`
- **Netlify site name:** `clientpilot-app`
- **Production URL:** https://clientpilot-app.netlify.app
- **GitHub repo:** `dizid/clientpilot`
- **Neon project ID:** `flat-meadow-93593842`
- **Neon database:** `neondb`
- **Firebase project:** `clientpilot-dizid`
- **Production domain:** https://clientpilot.dev
- **Stripe price IDs (LIVE):** Pro monthly `price_1TJr2B8gBja0qkMx2ZfnugJ4`, Lifetime `price_1TJr2H8gBja0qkMxM6sic98C`
- **Stripe product IDs (LIVE):** Pro `prod_UIRvS6cB4lWbzM`, Lifetime `prod_UIRwCCNZUq3vx6`
- **Stripe webhook (LIVE):** `we_1TJr2K8gBja0qkMxLfDqp29A` → `https://clientpilot.dev/.netlify/functions/stripe-webhook`

## Database Schema

All IDs are UUID (`gen_random_uuid()`). Tables:

- **users** — `id`, `firebase_uid` (unique), `email`, `name`, `avatar_url`, `stripe_customer_id`, `plan` (free/pro/lifetime), `plan_expires_at`, `generations_used`, `created_at`, `updated_at`
- **profiles** — `id`, `user_id` FK, `headline`, `bio`, `skills` TEXT[], `tech_stack` TEXT[], `experience_years` INT, `projects` JSONB, `social_links` JSONB, `target_market`, `pricing_model`, `availability`, `created_at`, `updated_at`
- **generations** — `id`, `user_id` FK, `type`, `content` JSONB, `target_id` FK (nullable), `created_at`
- **targets** — `id`, `user_id` FK, `name`, `niche`, `platform`, `pain_point`, `created_at`
- **pieces** — `id`, `user_id` FK, `generation_id` FK, `type`, `label`, `content` TEXT, `status` (draft/used/replied), `updated_at`, `created_at`

Indexes: `idx_pieces_user_type`, `idx_pieces_status`, `idx_targets_user`

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
- **Validation:** Shared `lib/validate.mts` (requireString, requireUUID, requireOneOf, optionalString) used by all mutating endpoints
- **Payments:** Stripe Checkout for Pro ($9/mo subscription) and Lifetime ($69 one-time), webhook handles plan updates

### Key Patterns
- All functions: `export default async (req: Request) => { ... }` with `authenticateRequest(req)` guard
- DB: `query(sql, params)` from shared pool, parameterized queries only
- Imports use `.mjs` extension in functions (esbuild resolves `.mts` → `.mjs`)
- Frontend API layer: Axios with Firebase token interceptor at `/.netlify/functions`
- Optimistic updates in content store with rollback on error
- Input validation via `validate()` helper at top of every mutating function, returns 400 on failure
