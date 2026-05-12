# Repliqo — Step-by-step Setup

Two paths. Pick the one that matches what you want.

| Path | What works | Time | Cost | Need Meta? |
| --- | --- | --- | --- | --- |
| **A. Demo only** | Whole dashboard, demo seed data | 15 min | $0 | No |
| **B. Real Instagram** | Demo + actual comment → DM via Meta | 60 min | $0–15 | Yes (free Meta App) |

Do **Path A first**. Even if you eventually want Path B, A is a prerequisite, and the demo seed already makes a recruiter-ready portfolio.

---

## Prerequisites

- Node.js 20+ (`node --version`)
- npm or pnpm
- A GitHub account (for deployment)
- A web browser

---

# PATH A — Demo only (15 min, $0)

## A1. Get the code running locally

```bash
# From the project root
npm install
```

That installs ~520 packages. ~1 minute.

## A2. Create a Supabase project

Repliqo uses Supabase as its database, auth provider, and storage layer. Free tier is enough.

1. Open <https://supabase.com> → click **Start your project** → sign in with GitHub (easiest).
2. Click **New project**.
3. Fill in:
   - **Name:** `repliqo`
   - **Database password:** click *Generate*, **copy it somewhere safe**. You won't need it for Repliqo (we use connection-string-less SDK keys) but you'll want it if you ever connect a SQL client.
   - **Region:** pick the one closest to you.
   - **Plan:** Free.
4. Click **Create new project**. Provisioning takes ~2 minutes.

## A3. Grab your Supabase keys

Once the project is ready:

1. Left sidebar → **Project Settings** (gear icon) → **API**.
2. Copy three values:

| Supabase label | Goes into `.env.local` as |
| --- | --- |
| **Project URL** (e.g. `https://abcd1234.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
| **Project API keys → `anon` `public`** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Project API keys → `service_role` `secret`** | `SUPABASE_SERVICE_ROLE_KEY` |

**Important:** the `service_role` key bypasses Row-Level Security. Never paste it in client-side code, never commit it. Only the webhook handler and crons use it (server-side only).

## A4. Configure Supabase auth

Still in the Supabase dashboard:

1. Left sidebar → **Authentication** → **URL Configuration**.
2. Set:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs** (one per line):
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/**
     ```
   You'll add your production URL here later.
3. *(Optional but recommended for dev)* **Authentication → Providers → Email** → toggle **"Confirm email"** **OFF**. Lets you sign up and log in immediately without an inbox round-trip.

## A5. Generate local secrets

Two secrets you create yourself. From the project root:

```bash
# Generate TOKEN_ENCRYPTION_KEY (encrypts IG tokens at rest)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate CRON_SECRET (protects the token-refresh endpoint)
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Each prints one long hex string. Copy them — you'll paste them into `.env.local` in the next step.

## A6. Create `.env.local`

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in **only these** for Path A:

```dotenv
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Repliqo
NODE_ENV=development

# Supabase (from step A3)
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Local secrets (from step A5)
TOKEN_ENCRYPTION_KEY=replace-with-64-hex-chars-from-node-command
CRON_SECRET=replace-with-48-hex-chars-from-node-command
```

Leave every `META_*`, `INSTAGRAM_*` line untouched / commented — you don't need them for Path A.

## A7. Run the database SQL

In the Supabase dashboard:

1. Left sidebar → **SQL Editor** → click **+ New query**.
2. Open `supabase/schema.sql` in your editor, copy the **whole** contents, paste, click **Run** (bottom right).
3. Repeat for `supabase/policies.sql`.
4. Repeat for `supabase/functions.sql`.

> That's it for SQL setup. Demo data is seeded from inside the app via the **Load demo data** button on the dashboard — there's no `seed.sql` to run here.

After each run you should see **Success. No rows returned**. If any fails, the error tells you which line.

Verify: left sidebar → **Database** → **Tables**. You should see 8 tables: `profiles`, `instagram_accounts`, `automations`, `automation_keywords`, `automation_logs`, `dm_templates`, `webhook_events`, `analytics_events`.

## A8. Start the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

## A9. Try it end-to-end

1. Click **Get started** (top right).
2. Sign up with any email + password (8 chars minimum). Because you turned off email confirmation, you're logged in immediately.
3. You land in the dashboard. Empty state with two cards.
4. Click **Load demo data**.
5. ~2 seconds later: dashboard is alive with 3 automations, real charts, and 30 days of activity.
6. Click into **Inbox**, **Analytics**, the **Automations** list, one automation's **Edit** page. All wired.

**Path A done.** You have a fully working portfolio piece running locally.

---

# Deploy Path A to the public internet (10 min, $0)

So a recruiter can visit `repliqo-you.vercel.app`.

## D1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com first, then:
git remote add origin https://github.com/<your-username>/repliqo.git
git branch -M main
git push -u origin main
```

`.env.local` is in `.gitignore` — it won't go to GitHub. Good.

## D2. Deploy to Vercel

1. Go to <https://vercel.com> → sign in with GitHub.
2. Click **Add New** → **Project**.
3. Find your `repliqo` repo → click **Import**.
4. **Framework Preset:** Next.js (auto-detected).
5. Click **Environment Variables**. Add each of these (copy from your `.env.local`):

   ```
   NEXT_PUBLIC_APP_URL              (set this in step D3 below)
   NEXT_PUBLIC_APP_NAME             Repliqo
   NODE_ENV                         production
   NEXT_PUBLIC_SUPABASE_URL         (same as local)
   NEXT_PUBLIC_SUPABASE_ANON_KEY    (same as local)
   SUPABASE_SERVICE_ROLE_KEY        (same as local)
   TOKEN_ENCRYPTION_KEY             (same as local — DO NOT regenerate)
   CRON_SECRET                      (same as local)
   ```

   > Reusing `TOKEN_ENCRYPTION_KEY` matters if you want to share an encrypted DB between local and prod. For separate dev/prod databases (recommended), you can generate a new one per environment.

6. Click **Deploy**. Takes ~2 minutes.

## D3. Update the app URL

Vercel gives you a URL like `https://repliqo-username.vercel.app`.

1. Back in Vercel: **Project → Settings → Environment Variables** → edit `NEXT_PUBLIC_APP_URL` to that URL.
2. **Deployments → latest → ⋯ → Redeploy** so the change picks up.

## D4. Update Supabase auth URLs

Back in Supabase dashboard:

1. **Authentication → URL Configuration**.
2. **Site URL:** change to `https://repliqo-username.vercel.app`.
3. **Redirect URLs:** add:
   ```
   https://repliqo-username.vercel.app/auth/callback
   https://repliqo-username.vercel.app/**
   ```

Done. Visit your Vercel URL, sign up, click **Load demo data**, share the link with a recruiter.

---

# PATH B — Real Instagram integration (60 min, $0)

Do this **only after Path A works**. Path B is layered on top.

## B1. Convert your Instagram to a Business/Creator account

Personal accounts can't use the API at all.

1. Open Instagram on your phone.
2. **Settings and activity → Account type and tools → Switch to professional account**.
3. Pick **Creator** (or **Business** if you have a brand). Either works.

You can switch back any time. This costs nothing.

## B2. Create a Meta App

1. Open <https://developers.facebook.com> → **My Apps** → **Create App**.
2. **What do you want your app to do?** → **Other**.
3. **App type:** **Business**.
4. **App name:** `Repliqo Dev` (anything works).
5. **App contact email:** your email.
6. **Business Portfolio:** skip / select existing. Not required for Development mode.
7. Click **Create app**.

You land on the App Dashboard. Note the **App ID** at the top — you'll need it.

## B3. Get App ID + App Secret

1. Left sidebar → **App settings → Basic**.
2. Copy:

| Meta label | Goes into `.env.local` as |
| --- | --- |
| **App ID** | `META_APP_ID` and `INSTAGRAM_CLIENT_ID` (same value) |
| **App secret** (click *Show*, may require password) | `META_APP_SECRET`, `INSTAGRAM_CLIENT_SECRET`, and `INSTAGRAM_WEBHOOK_APP_SECRET` (same value, three places) |

## B4. Add the Instagram product

1. Left sidebar → **Add products** (or the **+** button).
2. Find **Instagram** → click **Set up**.
3. You'll see two options. Pick **API setup with Instagram login** (the newer flow — *not* the legacy "Instagram Graph API" or the deprecated "Basic Display").

## B5. Configure OAuth redirect URIs

Still in the Instagram product page:

1. Scroll to **3. Set up Instagram business login**.
2. **Business login settings → Edit**.
3. **Valid OAuth Redirect URIs**, add:
   - For local dev (we'll set up the tunnel in step B8): `https://<your-tunnel>.trycloudflare.com/api/auth/instagram/callback`
   - For production: `https://repliqo-username.vercel.app/api/auth/instagram/callback`
   - You can add both. Meta requires exact match.
4. Click **Save changes**.

Set in `.env.local`:

```dotenv
INSTAGRAM_REDIRECT_URI=https://repliqo-username.vercel.app/api/auth/instagram/callback
```

> Use the production URL once you've deployed. For pure-local testing with a tunnel, use the tunnel URL.

## B6. Add yourself as an Instagram Tester

In Development mode, only users you've added as Testers can authorize the app.

1. In the Instagram product page → scroll to **2. Generate access tokens**.
2. Click **Add or remove Instagram testers**.
3. Search for your Instagram username → **Add**.
4. **On your phone**: open Instagram → **Settings and activity → Apps and websites → Tester Invites** → accept.

You're now allowed to authorize Repliqo with your own IG account.

## B7. Set up the webhook

In the Instagram product page:

1. Scroll to **4. Configure webhooks**.
2. **Callback URL:** `https://<your-app-domain>/api/webhook/instagram`
   - For local dev: your tunnel URL.
   - For production: `https://repliqo-username.vercel.app/api/webhook/instagram`.
3. **Verify token:** invent any long random string. Same string goes into `.env.local`:

   ```dotenv
   INSTAGRAM_WEBHOOK_VERIFY_TOKEN=any-long-random-string-you-like-1f9a8c3b
   ```

4. Click **Verify and save**. Meta will GET your endpoint with `hub.challenge`. If the verify token matches, Meta saves. If it fails: your tunnel/deploy isn't reachable, or the token doesn't match.
5. Under **Webhook fields**, subscribe to:
   - `comments`
   - `messages`
   - `messaging_postbacks`
   - `message_reactions`

## B8. (Local dev only) Set up an HTTPS tunnel

Meta won't talk to `http://localhost:3000`. For local testing you need a public HTTPS URL pointing at your dev server.

**Cloudflared (free, no signup):**

```bash
# Install (Windows): scoop install cloudflared
# Install (Mac):     brew install cloudflared

# Run (in a separate terminal — leave it running)
cloudflared tunnel --url http://localhost:3000
```

It prints something like:
```
https://eight-pretty-words.trycloudflare.com
```

Use that URL in steps B5 and B7 (OAuth redirect + webhook callback).

Alternative: **ngrok** (`ngrok http 3000` after signing up at ngrok.com).

For production you don't need a tunnel — Vercel gives you `*.vercel.app` directly.

## B9. Set the remaining env vars

Fill in the Meta-related lines in `.env.local`:

```dotenv
META_APP_ID=1234567890
META_APP_SECRET=abc123...
INSTAGRAM_CLIENT_ID=1234567890                      # same as META_APP_ID
INSTAGRAM_CLIENT_SECRET=abc123...                   # same as META_APP_SECRET
INSTAGRAM_REDIRECT_URI=https://eight-pretty-words.trycloudflare.com/api/auth/instagram/callback
INSTAGRAM_SCOPES=instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=any-long-random-string-you-like-1f9a8c3b
INSTAGRAM_WEBHOOK_APP_SECRET=abc123...              # same as META_APP_SECRET
```

In production, mirror these into Vercel's env vars and redeploy.

## B10. Test the real flow

1. `npm run dev` (and keep cloudflared running in another terminal).
2. Visit your tunnel URL → sign in → go to `/dashboard`.
3. Click **Connect Instagram** in the empty state.
4. You bounce through Instagram's authorize page → grant permissions → come back to the dashboard.
5. You should see your real `@username` in the Connected accounts page.
6. Comment a trigger keyword on one of your IG posts (from a **different** account, not the one connected).
7. Watch the **Inbox** — the event appears within seconds.
8. The other account receives a DM.

---

# Summary of every key you need

| Key | Where it comes from | Used by |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Browser + server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon public | Browser + server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role | **Server only** |
| `TOKEN_ENCRYPTION_KEY` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` | Server only |
| `CRON_SECRET` | `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"` | Server only |
| `META_APP_ID` | Meta Dashboard → App settings → Basic | Server only |
| `META_APP_SECRET` | Meta Dashboard → App settings → Basic → Show | Server only |
| `INSTAGRAM_CLIENT_ID` | Same value as `META_APP_ID` | Server only |
| `INSTAGRAM_CLIENT_SECRET` | Same value as `META_APP_SECRET` | Server only |
| `INSTAGRAM_REDIRECT_URI` | You choose — must match exactly in Meta's OAuth settings | Server only |
| `INSTAGRAM_SCOPES` | Pre-filled — don't change unless you have App Review for more | Server only |
| `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` | You invent — must match what you typed in Meta's webhook config | Server only |
| `INSTAGRAM_WEBHOOK_APP_SECRET` | Same value as `META_APP_SECRET` | Server only |

---

# Common gotchas

| Symptom | Fix |
| --- | --- |
| Supabase signup says "Email not confirmed" | Turn off email confirmation in Supabase Auth settings, OR check the Supabase **Auth → Users** tab and click **Confirm** manually. |
| OAuth callback shows "OAuth state mismatch" | You opened the authorize link in one browser and the callback hit another. Restart in the same browser. |
| OAuth callback shows "Token exchange failed" | `INSTAGRAM_REDIRECT_URI` in `.env.local` doesn't match exactly what's saved in Meta's OAuth settings. Trailing slash matters. |
| Webhook verify fails ("forbidden") | The verify token you typed in Meta's webhook config doesn't match `INSTAGRAM_WEBHOOK_VERIFY_TOKEN` in your env. |
| Webhook fires but nothing happens | The IG account on the comment isn't connected in Repliqo, OR there's no active automation with a matching keyword. Check **Inbox** for `duplicate_skipped` or no event at all. |
| "Cannot parse access token" from Meta | You sent an `IGQVJ…` token (issued by `graph.instagram.com`) to `graph.facebook.com`. The client library handles this — if you see this in logs, you're calling it manually somewhere. |
| Long-lived token exchange fails on signup | Non-fatal. We fall back to the short-lived token. The user can re-authorize when it expires. |
| Dashboard works locally but blank on Vercel | You didn't add the env vars in Vercel, or you didn't redeploy after adding them. |

---

# Optional · Enable "Continue with Google" sign-in (10 min, $0)

Repliqo's login/signup pages already have a **Continue with Google** button. To make it work, configure Google OAuth in two places: Google Cloud Console (create credentials) and Supabase (enable + paste credentials).

## Google Cloud Console

1. <https://console.cloud.google.com> → top bar → **New Project** → name `Repliqo` → **Create**. Switch into it.
2. **APIs & Services → OAuth consent screen**:
   - **User Type:** **External** → **Create**
   - App name: `Repliqo`. Support email + developer email: yours. Skip everything else → **Save and Continue**
   - **Scopes:** **Save and Continue** (defaults: email + profile)
   - **Test users → Add Users → your Gmail → Save and Continue**
3. **APIs & Services → Credentials → + Create Credentials → OAuth client ID**:
   - **Application type:** Web application
   - **Name:** `Repliqo Web`
   - **Authorized JavaScript origins:** `http://localhost:3000` and `https://<your-vercel-url>`
   - Leave **Authorized redirect URIs** empty for now → **Create**
4. Copy the **Client ID** and **Client Secret** that appear.

## Supabase

1. Supabase dashboard → **Authentication → Providers → Google** → expand
2. Toggle **Enable Sign in with Google** ON
3. Paste **Client ID** and **Client Secret** from step 4 above
4. **Copy** the **Callback URL (for OAuth)** shown there — looks like `https://<project-id>.supabase.co/auth/v1/callback`
5. **Save**

## Back in Google Cloud Console

1. **Credentials → click your OAuth client → Authorized redirect URIs → Add URI**
2. Paste the Supabase callback URL exactly → **Save**

## Test

Sign up at `/signup` → click **Continue with Google** → pick the Gmail you added as a Test user → land in `/dashboard`.

> Google OAuth in **Testing** mode allows up to 100 Test users without Google's verification process. Plenty for a portfolio. If you ever want public Google sign-in, click **Publish app** on the OAuth consent screen (no review required for basic email+profile scopes).

---

# What you still don't need (and won't, for portfolio)

- ❌ Meta Business Portfolio verification
- ❌ App Review submission
- ❌ Privacy policy / Terms URL submission to Meta (the pages exist on your site; Meta only checks them during App Review)
- ❌ A custom domain (`*.vercel.app` is fine)
- ❌ Stripe / payments
- ❌ An LLC or sole proprietorship

You only need these if you want **non-Tester users** to be able to sign up — i.e., commercializing it.
