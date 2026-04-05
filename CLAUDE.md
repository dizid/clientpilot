# ClientPilot

AI-powered freelance client acquisition tool — generates personalized outreach content based on freelancer profile and target client details.

## Deployment

- **Netlify site ID:** `bb78ccb7-9663-4b41-bcd8-b3c2d6a23029`
- **Netlify site name:** `clientpilot-app`
- **Production URL:** https://clientpilot-app.netlify.app
- **GitHub repo:** `dizid/clientpilot`
- **Neon project ID:** `flat-meadow-93593842`
- **Neon database:** `neondb`
- **Firebase project:** `clientpilot-dizid`

## Database Schema

All IDs are UUID (gen_random_uuid()). Tables:
- `users` — firebase_uid, email, name, plan, generations_used, stripe_customer_id
- `profiles` — user_id FK, headline, bio, skills[], tech_stack[], experience_years, projects JSONB, social_links JSONB, target_market, pricing_model, availability
- `generations` — user_id FK, type, content JSONB, target_id FK, created_at
- `targets` — user_id FK, name, niche, platform, pain_point, created_at
- `pieces` — user_id FK, generation_id FK, type, label, content, status (draft/used/replied), updated_at, created_at
