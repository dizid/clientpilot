# ClientPilot

AI-powered freelance client acquisition platform. Generate personalized outreach content — LinkedIn posts, cold emails, Dev.to articles, platform profiles, portfolio pages, and elevator pitches — all tailored to your skills, projects, and target clients.

## Links

| Resource | URL |
|----------|-----|
| **Production** | https://clientpilot-app.netlify.app |
| **Netlify** | https://app.netlify.com/projects/clientpilot-app |
| **GitHub** | https://github.com/dizid/clientpilot |

## Features

- **Content Workspace** — manage individual content pieces with copy, edit, status tracking, and regeneration
- **Target Context** — specify who you're targeting (niche, platform, pain point) for truly personalized content
- **6 Content Types** — LinkedIn posts (10), outreach templates (9), Dev.to articles, platform profiles (5), portfolio page sections, elevator pitches & bios (6)
- **Individual Piece Management** — edit inline, regenerate with feedback, mark as Used/Got Reply, delete
- **Smart Dashboard** — total pieces, used this week, replies tracked, profile completeness
- **Stripe Payments** — Free (1 preview), Pro ($9/mo), Lifetime ($69)

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Vite + Tailwind CSS 4 + Pinia
- **Auth:** Firebase Authentication (Google OAuth)
- **AI:** Anthropic Claude API
- **Backend:** Netlify Functions (Node.js)
- **Database:** Neon PostgreSQL (UUID primary keys)
- **Payments:** Stripe (subscriptions + one-time)
- **Hosting:** Netlify

## Project Structure

```
src/
├── views/              # 6 views: Landing, Login, Onboarding, Workspace, Generate, Settings
├── components/
│   ├── AppNav.vue      # Navigation with active route highlighting
│   ├── ToastContainer.vue
│   └── workspace/      # ContentCard, StatsBar, WorkspaceSidebar, TargetContextModal, etc.
├── stores/             # Pinia: auth, profile, content, toast
├── lib/                # api.ts, firebase.ts, markdown.ts
└── router/             # Vue Router with auth guards

netlify/functions/
├── lib/                # Shared: db, auth, prompts, parse-pieces
├── generate.mts        # AI content generation with target context + piece splitting
├── get-pieces.mts      # Individual content pieces (filterable by type)
├── update-piece.mts    # Edit content or change status
├── delete-piece.mts    # Delete individual pieces
├── regenerate-piece.mts # Regenerate single piece with feedback
├── save-target.mts     # Save reusable target contexts
├── get-targets.mts     # List saved targets
├── get-stats.mts       # Dashboard stats aggregation
├── save-profile.mts    # User profile CRUD
├── get-profile.mts
├── get-user.mts
├── create-checkout.mts # Stripe checkout session
├── stripe-webhook.mts  # Stripe event handler
└── get-generations.mts # Legacy generation list
```

## Development

```bash
npm install
npm run dev      # Start dev server (Vite + Netlify plugin)
npm run build    # Production build (vue-tsc + Vite)
```

## Environment Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
DATABASE_URL=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```
