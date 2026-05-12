// =============================================================================
// GET /api/auth/instagram/callback
// Handles the OAuth redirect from Instagram. Verifies state, exchanges the code
// for a short-lived token, attempts the long-lived upgrade (best effort, doesn't
// block login — Part 3.5 of the build doc), fetches the IG profile, and stores
// an encrypted record in instagram_accounts.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { encryptToken } from "@/lib/crypto";
import { igScopes } from "@/lib/env";
import {
  exchangeCodeForShortLivedToken,
  exchangeForLongLivedToken,
  getMe,
  subscribeWebhooks,
} from "@/lib/instagram/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorReason = url.searchParams.get("error_reason");

  const jar = await cookies();
  const stateCookie = jar.get("ig_oauth_state")?.value;
  const returnTo = jar.get("ig_oauth_return")?.value || "/dashboard?ig=connected";

  // Clean up state cookies regardless
  jar.delete("ig_oauth_state");
  jar.delete("ig_oauth_return");

  if (error) {
    return redirectWithError(req, `Instagram denied access: ${errorReason || error}`);
  }
  if (!code) return redirectWithError(req, "Missing authorization code.");
  if (!stateParam || !stateCookie || stateParam !== stateCookie) {
    return redirectWithError(req, "OAuth state mismatch — possible CSRF.");
  }

  // The user must be logged in to Repliqo so we can attribute the IG account.
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return redirectWithError(req, "You must be signed in to Repliqo first.");
  }
  const userId = userData.user.id;

  // ---- Token exchange ----
  let accessToken: string;
  let expiresInSec: number | null = null;
  try {
    const short = await exchangeCodeForShortLivedToken(code);
    accessToken = short.access_token;
  } catch (err: any) {
    return redirectWithError(req, `Token exchange failed: ${err?.message || "unknown"}`);
  }

  // Try to upgrade to long-lived. If it fails, keep the short-lived and
  // surface a non-fatal warning — the user can refresh later.
  try {
    const long = await exchangeForLongLivedToken(accessToken);
    accessToken = long.access_token;
    expiresInSec = long.expires_in;
  } catch {
    // ignore — short-lived token still allows API calls for ~1 hour
  }

  // ---- Fetch IG profile ----
  let profile;
  try {
    profile = await getMe(accessToken);
  } catch (err: any) {
    return redirectWithError(req, `Could not fetch IG profile: ${err?.message || "unknown"}`);
  }

  const expiresAt = expiresInSec
    ? new Date(Date.now() + expiresInSec * 1000).toISOString()
    : null;

  // ---- Upsert instagram_accounts row ----
  const encrypted = encryptToken(accessToken);
  const { error: dbErr } = await supabase
    .from("instagram_accounts")
    .upsert(
      {
        user_id: userId,
        ig_user_id: profile.id,
        username: profile.username,
        account_type: profile.account_type ?? null,
        profile_picture_url: profile.profile_picture_url ?? null,
        followers_count: profile.followers_count ?? 0,
        follows_count: profile.follows_count ?? 0,
        media_count: profile.media_count ?? 0,
        access_token_encrypted: encrypted,
        token_expires_at: expiresAt,
        scopes: igScopes(),
        status: "active",
        last_synced_at: new Date().toISOString(),
      },
      { onConflict: "user_id,ig_user_id" }
    );

  if (dbErr) {
    return redirectWithError(req, `DB error: ${dbErr.message}`);
  }

  // ---- Subscribe webhooks (best effort) ----
  try {
    await subscribeWebhooks({ accessToken, igUserId: profile.id });
  } catch {
    // non-fatal — surface in dashboard
  }

  const target = new URL(returnTo, req.nextUrl.origin);
  return NextResponse.redirect(target);
}

function redirectWithError(req: NextRequest, message: string) {
  const url = new URL("/dashboard/accounts", req.nextUrl.origin);
  url.searchParams.set("ig_error", message);
  return NextResponse.redirect(url);
}
