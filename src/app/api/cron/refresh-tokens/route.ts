// =============================================================================
// /api/cron/refresh-tokens
//
// Daily cron. Long-lived Instagram tokens last ~60 days; we refresh anything
// expiring in the next 7 days. Re-encrypts with the current TOKEN_ENCRYPTION_KEY
// so this also doubles as the path for key rotation (run after rotating).
//
// Protect with a shared bearer secret in the Authorization header — required
// because this endpoint mutates encrypted token rows using the service-role
// client (RLS bypass).
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { encryptToken, decryptToken } from "@/lib/crypto";
import { refreshLongLivedToken, InstagramApiError } from "@/lib/instagram/client";
import { isDemoIgUserId } from "@/lib/demo/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function authorized(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const auth = req.headers.get("authorization") || "";
  return auth === `Bearer ${cronSecret}`;
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sb = createSupabaseServiceClient();
  const cutoff = new Date(Date.now() + SEVEN_DAYS_MS).toISOString();

  // Pull every active account that expires in the next 7 days OR has never been refreshed.
  const { data: accounts, error } = await sb
    .from("instagram_accounts")
    .select("id, ig_user_id, access_token_encrypted, token_expires_at, status")
    .eq("status", "active")
    .or(`token_expires_at.lt.${cutoff},token_expires_at.is.null`);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let refreshed = 0;
  let failed = 0;
  let skippedDemo = 0;
  const errors: Array<{ id: string; message: string }> = [];

  for (const acc of accounts || []) {
    // Never call Meta for demo accounts — they hold a sentinel token, not a real one.
    if (isDemoIgUserId(acc.ig_user_id)) {
      skippedDemo++;
      continue;
    }
    try {
      const plaintext = decryptToken(acc.access_token_encrypted);
      const long = await refreshLongLivedToken(plaintext);
      const reEncrypted = encryptToken(long.access_token);
      const expiresAt = long.expires_in
        ? new Date(Date.now() + long.expires_in * 1000).toISOString()
        : null;

      const { error: updateErr } = await sb
        .from("instagram_accounts")
        .update({
          access_token_encrypted: reEncrypted,
          token_expires_at: expiresAt,
          last_synced_at: new Date().toISOString(),
        })
        .eq("id", acc.id);
      if (updateErr) throw updateErr;
      refreshed++;
    } catch (err: any) {
      failed++;
      const msg =
        err instanceof InstagramApiError
          ? `${err.code ?? err.status}: ${err.message}`
          : err?.message || "unknown";
      errors.push({ id: acc.id, message: msg });

      // If the token is irrecoverable (revoked / invalid grant), mark the account.
      const status = err instanceof InstagramApiError ? err.status : 0;
      if (status === 400 || status === 401) {
        await sb
          .from("instagram_accounts")
          .update({ status: "expired" })
          .eq("id", acc.id);
      }
    }
  }

  return NextResponse.json({
    scanned: accounts?.length ?? 0,
    refreshed,
    skipped_demo: skippedDemo,
    failed,
    errors: errors.slice(0, 20),
  });
}
