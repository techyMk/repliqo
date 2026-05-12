# Repliqo — Deployment guide

The realistic order to ship this product to production.

## TL;DR

1. Verify a Meta Business Portfolio (2–10 days).
2. Create a Meta App (Instagram → API setup with Instagram login).
3. Create a Supabase project; run the SQL.
4. Deploy the app to Railway / Vercel with HTTPS.
5. Wire up OAuth + webhook URLs in Meta.
6. Submit App Review for the advanced scopes.

---

## 1. Meta Business Portfolio verification

Per the build doc: **start this first** — it doesn't block development but App Review *needs* it.

- `business.facebook.com` → create a Portfolio
- Add legal entity name, address, phone, business email
- Upload a verification document (incorporation, GST, business license, utility bill)
- Wait 1–7 business days

If you're a solo dev: register a sole proprietorship / LLC / Pvt Ltd first. Without a legal entity, Meta will reject verification.

## 2. Meta App

`developers.facebook.com → My Apps → Create App`

- **Type:** Business
- **Connect:** Your verified Portfolio
- **Add product:** Instagram → *API setup with Instagram login* (not the legacy Graph API + FB Login flow, and not the deprecated Basic Display)
- **OAuth Redirect URI:** `https://app.yourdomain.com/api/auth/instagram/callback`
- **Webhook callback URL:** `https://app.yourdomain.com/api/webhook/instagram`
- **Verify token:** any long random string — paste it into `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`

Add yourself as a Tester (App Roles → Roles → Add People) so you can authorize advanced scopes during development.

## 3. Supabase

1. `supabase.com` → New project → pick a region close to your users.
2. Disable email confirmations during dev (Auth → Settings) if you want quicker onboarding.
3. SQL editor → run **in order**:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/functions.sql`
4. Copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` into your env.

## 4. Deploy

### Option A — Railway (recommended, git-push deploys)

```bash
railway init
railway link
railway up
```

Add a custom domain (`app.yourdomain.com`), pin the env vars, push.

### Option B — Vercel

```bash
vercel --prod
```

Add env vars in the Vercel project settings.

### Required env vars in production

| Var                                 | Notes                                          |
| ----------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`               | `https://app.yourdomain.com`                   |
| `NEXT_PUBLIC_SUPABASE_URL`          | from Supabase                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | from Supabase                                  |
| `SUPABASE_SERVICE_ROLE_KEY`         | from Supabase (server only — never expose)     |
| `META_APP_ID`                       | from Meta Dashboard                            |
| `META_APP_SECRET`                   | from Meta Dashboard                            |
| `INSTAGRAM_CLIENT_ID`               | usually same as `META_APP_ID`                  |
| `INSTAGRAM_CLIENT_SECRET`           | usually same as `META_APP_SECRET`              |
| `INSTAGRAM_REDIRECT_URI`            | must exactly match the value in Meta Dashboard |
| `INSTAGRAM_SCOPES`                  | comma-separated; only request what's approved  |
| `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`    | the value you typed into Meta's webhook config |
| `INSTAGRAM_WEBHOOK_APP_SECRET`      | usually same as `META_APP_SECRET`              |
| `TOKEN_ENCRYPTION_KEY`              | `openssl rand -hex 32` — encrypts IG tokens    |

## 5. Connect the dots in Meta

1. Webhooks → Instagram → set callback URL + verify token. Subscribe to: `comments`, `messages`, `messaging_postbacks`, `message_reactions`.
2. Click *Verify and Save*. Meta will GET your `/api/webhook/instagram` and expect the `hub.challenge` echoed back.
3. App Roles → add Testers (you, your team, and a Meta reviewer if you want sandbox access).

## 6. App Review

Required for `instagram_business_manage_messages` and `instagram_business_manage_comments` to work for non-Tester accounts.

For each scope, prepare:

- **Use case statement** — one paragraph, factual. Example:
  > "Repliqo replies to comments on the connected business account's posts based on keyword triggers configured by the account owner. The account owner is the same person whose Instagram account is connected to Repliqo. We do not message anyone outside this scoped flow."
- **Screencast** (Loom / OBS, narrated):
  1. New user signs up to Repliqo
  2. Clicks *Connect Instagram* → goes through OAuth
  3. Creates an automation with a keyword
  4. A test commenter writes the keyword
  5. The comment receives a reply and the test commenter gets a DM
- **Test credentials** — a working Repliqo login Meta reviewers can use without setting up their own IG

Expect 3–14 days per submission. Plan for at least one rejection — read the rejection email carefully and resubmit.

## 7. Token refresh (cron, already implemented)

IG long-lived tokens last ~60 days. Repliqo ships with `/api/cron/refresh-tokens` — call it daily and it will refresh any account whose token expires within 7 days, mark revoked tokens as `expired`, and re-encrypt with the current `TOKEN_ENCRYPTION_KEY` (so it doubles as the path for key rotation).

**Protected by a bearer secret.** Set `CRON_SECRET` in your env, then:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
     https://app.yourdomain.com/api/cron/refresh-tokens
```

Response:

```json
{ "scanned": 14, "refreshed": 12, "failed": 2, "errors": [...] }
```

**Schedule it once a day:**

- **Vercel:** add to `vercel.json` → `crons: [{ path: "/api/cron/refresh-tokens", schedule: "0 3 * * *" }]` (Vercel passes its own bearer; mirror the secret).
- **Railway:** create a separate cron service that runs the curl call.
- **Supabase Edge Functions / pg_cron:** also fine; the endpoint accepts GET or POST.

If `failed > 0` for the same account on 2+ consecutive runs, the user needs to re-authorize Instagram from the dashboard.

## 8. Privacy & legal

App Review will block you without:

- A privacy policy URL (required field)
- A terms of service URL (required field)
- A data deletion URL (required field; can be a form that emails you)

Spin these up before submission, even as Notion pages.

## 9. Production hygiene

- **Rotate the `TOKEN_ENCRYPTION_KEY`** never casually — there's no zero-downtime re-encryption flow built in yet. If you do need to, write a one-shot script: decrypt with old key, encrypt with new, update row.
- **Webhook subscription monitoring** — Meta silently disables endpoints that fail enough times. Set up an alarm on `webhook_events.processing_status = 'failed'` ratio.
- **Log every DM send + error to `automation_logs`** — already done, but make sure you query it.
- **Spam discipline** — keep per-automation rate caps reasonable. Don't combine Repliqo with auto-follower or auto-DM scrapers from the same account.

That's it. Most of the timeline is waiting on Meta, not coding.
