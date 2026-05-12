# Repliqo

> **Production-grade SaaS that turns Instagram comments into automated DMs.** Built as a portfolio piece — but it's not a mockup. The whole product works end-to-end against Meta's real APIs.

<!-- Replace <your-url> with your live Vercel deployment -->
[![Live demo](https://img.shields.io/badge/Live_demo-online-3FCF8E?style=for-the-badge)](https://repliqo.vercel.app)
&nbsp;
[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase)](https://supabase.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

```
Instagram comment → Meta webhook → Repliqo  →  public reply
                                            ↘  DM with smart link
                                            ↘  follow gate (optional)
```

<!--
  Drop your screenshots in /public/screenshots/ then uncomment the block below.
  Recommended captures (all in dark mode):
    01-hero.png             1600×900 — landing page hero
    02-dashboard.png        1600×900 — dashboard with demo data
    03-builder.png          1600×900 — automation builder + DM preview
    04-analytics.png        1600×900 — analytics page
-->
<!--
![Landing page](./public/screenshots/01-hero.png)

|                                                                |                                                                  |
| :------------------------------------------------------------: | :--------------------------------------------------------------: |
| ![Dashboard](./public/screenshots/02-dashboard.png) Dashboard   | ![Builder](./public/screenshots/03-builder.png) Automation builder |
| ![Analytics](./public/screenshots/04-analytics.png) Analytics   | ![Inbox](./public/screenshots/05-inbox.png) Inbox                  |
-->

---

## Try it without setting anything up

The dashboard ships with a **one-click demo seed**. Sign up, click *Load demo data*, and you'll see a populated workspace: a fake Instagram account, three live automations, 30 days of activity logs, real charts, real failure cases. No Meta credentials required.

When you're ready for the real thing, click *Connect Instagram* — same dashboard, real OAuth flow.

---

## What this demonstrates

This isn't a CRUD tutorial app. The interesting work lives in the parts you can't see from a screenshot:

| Surface | Technique |
| --- | --- |
| **OAuth + token storage** | Instagram Login flow with state-token CSRF protection, AES-256-GCM token encryption at rest, automatic short→long-lived exchange with multi-base-URL fallbacks |
| **Webhook reliability** | HMAC-SHA256 signature verification on raw bytes, SHA-256 body dedup, ACK-200-then-process pattern, propagation-race retries, 7-day private-reply window tracking |
| **Database** | 8 tables, RLS policies, atomic counter RPC, indexed rate-limit function, automatic profile-on-signup trigger |
| **Frontend** | Next.js 15 App Router, shadcn-style primitives hand-built (no copy-paste from a CLI), Framer Motion micro-interactions, ⌘K command palette, mobile-first sidebar |
| **Real production concerns** | Token-refresh cron with key-rotation path, automation pause/archive, soft-delete preserving analytics, validated env schema |

Every gotcha from the [build doc](instagram-bot_build.pdf) shipped with this repo is implemented and documented at the call site.

---

## Tech stack

| Layer        | Choice                                                       |
| ------------ | ------------------------------------------------------------ |
| Framework    | Next.js 15 (App Router) · React 18 · TypeScript (strict)     |
| Styling      | Tailwind CSS · shadcn-style primitives · Framer Motion       |
| Data         | Supabase (Postgres + Auth + RLS)                             |
| State        | TanStack Query · React Hook Form + Zod                       |
| Integrations | Instagram Graph API (Instagram Login) + Webhooks             |
| Charts       | Recharts                                                     |
| Hosting      | Railway, Vercel — both work out of the box                   |

---

## Run it locally in 5 minutes

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Fill in Supabase URL + keys (free tier).
# Generate TOKEN_ENCRYPTION_KEY:  openssl rand -hex 32
# Generate CRON_SECRET:           openssl rand -hex 24

# 3. Database (paste each in the Supabase SQL editor, in order)
#    supabase/schema.sql
#    supabase/policies.sql
#    supabase/functions.sql

# 4. Run
npm run dev
```

Visit <http://localhost:3000>. Sign up → click *Load demo data* → you're inside a fully-populated product.

**For the real Instagram flow** (not just demo data), you also need a Meta App and an HTTPS tunnel pointing at your dev server. See [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Project layout

```
repliqo/
├── public/                       # Favicon + static assets
├── supabase/
│   ├── schema.sql                # Tables, indexes, triggers
│   ├── policies.sql              # Row Level Security
│   ├── functions.sql             # Helper RPCs (rate limit, atomic counters)
│   └── teardown.sql              # Drop everything (for clean re-runs)
├── src/
│   ├── app/
│   │   ├── (auth)/               # /login, /signup (split layout)
│   │   ├── api/
│   │   │   ├── auth/instagram/   # OAuth initiate + callback
│   │   │   ├── automations/[id]/ # PATCH + DELETE
│   │   │   ├── cron/             # Token refresh
│   │   │   ├── demo/             # One-click demo seed
│   │   │   ├── instagram/media/  # IG media listing (post picker)
│   │   │   └── webhook/instagram # GET handshake + POST events
│   │   ├── about | customers | contact
│   │   ├── changelog
│   │   ├── privacy | terms | security
│   │   ├── dashboard/            # Gated, RLS-enforced workspace
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   ├── automation/           # Builder, post picker, templates
│   │   ├── brand/                # Logo
│   │   ├── dashboard/            # Sidebar, topbar, command palette, onboarding
│   │   ├── marketing/            # Hero, features, pricing, FAQ
│   │   └── ui/                   # Button, Card, Dialog, … (shadcn-style)
│   ├── lib/
│   │   ├── automation/templates.ts
│   │   ├── demo/seed.ts          # Demo data generator
│   │   ├── instagram/
│   │   │   ├── client.ts         # Graph API client + fallbacks
│   │   │   ├── matcher.ts        # Keyword + template rendering
│   │   │   ├── oauth.ts          # Authorize URL builder
│   │   │   └── processor.ts      # Webhook event processor
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   └── server.ts         # Server + service-role clients
│   │   ├── crypto.ts             # AES-256-GCM + HMAC verification
│   │   ├── env.ts                # Validated env schema (zod)
│   │   ├── types.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .env.example
├── DEPLOYMENT.md
├── README.md
├── instagram-bot_build.pdf       # Original spec
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Highlights

### One-click demo seed (`src/lib/demo/seed.ts`)
Creates a fake Instagram account, three example automations, and ~600 realistic log events spread over 30 days — including failures and duplicates — so the analytics and inbox screens look alive immediately. Idempotent, reversible from the UI.

### Webhook processor (`src/lib/instagram/processor.ts`)
Driven from `webhook_events` rows rather than the live request. Comment-trigger and follow-gate flows live side by side. Every operation is idempotent — re-running the processor on the same event is safe.

### Encrypted token storage (`src/lib/crypto.ts`)
AES-256-GCM. Layout: `iv || ciphertext || authTag`, base64-encoded. The encryption key is independent of any Meta-issued secret, so the two can be rotated separately. The token-refresh cron doubles as the key-rotation path: decrypt with the current key, refresh the IG token, encrypt with the (possibly new) current key, write back.

### Builder + Post picker (`src/components/automation/builder.tsx`)
Two modes (create + edit) from one component. Live DM preview that re-renders as you type. Post picker proxies a server-side IG media listing — the access token never reaches the browser.

### Database design (`supabase/`)
Schema is in the SQL files, not buried in an ORM. RLS policies are explicit. Atomic counter updates via Postgres functions. Designed so the service role only writes the bits that *have* to bypass RLS (webhooks, crons).

---

## Try the demo path (no Meta setup)

1. Sign up for a Supabase project (free)
2. Run the three SQL files
3. `cp .env.example .env.local` and fill in the Supabase URL + keys
4. `npm run dev`
5. Sign up at <http://localhost:3000/signup>
6. Click **Load demo data**

Total time: under 5 minutes. You can explore every screen, see real charts, click into automation detail, edit, pause, archive.

---

## Try the production path (real Meta integration)

You'll also need:
- A Meta App with the Instagram product enabled
- An HTTPS tunnel (cloudflared / ngrok) for the OAuth callback and webhook
- Your own IG account added as a Tester in the Meta App Dashboard

Full step-by-step in [DEPLOYMENT.md](DEPLOYMENT.md).

> **Note:** to let *anyone* sign up and use it (vs just Testers you've added), you need a verified Meta Business Portfolio and App Review approval. That's a real-world Meta requirement — not a code gap. For portfolio purposes, Development mode + the demo seed is enough.

---

## Scripts

```bash
npm run dev         # Next.js dev server
npm run build       # Production build (clean — verified)
npm run start       # Production server
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

---

## License

Private — built as a portfolio piece. Code is illustrative of how to architect a real SaaS against Meta's APIs. Don't redistribute the brand or copy as-is.
