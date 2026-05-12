// =============================================================================
// GET /api/instagram/media?account=<instagram_accounts.id>&limit=25
//
// Returns the latest media for a connected Instagram account. Decrypts the
// stored access token server-side and proxies the Graph API call. The client
// never sees the token.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { decryptToken } from "@/lib/crypto";
import { listMedia, InstagramApiError } from "@/lib/instagram/client";
import { isDemoIgUserId } from "@/lib/demo/seed";
import { buildDemoMedia } from "@/lib/demo/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const accountId = req.nextUrl.searchParams.get("account");
  const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit")) || 25);
  if (!accountId) {
    return NextResponse.json({ error: "account is required" }, { status: 400 });
  }

  const { data: account, error } = await supabase
    .from("instagram_accounts")
    .select("id, ig_user_id, access_token_encrypted, status")
    .eq("id", accountId)
    .eq("user_id", userData.user.id)
    .single();

  if (error || !account) {
    return NextResponse.json({ error: "account not found" }, { status: 404 });
  }
  if (account.status !== "active") {
    return NextResponse.json({ error: `account status: ${account.status}` }, { status: 409 });
  }

  // Demo account → return mock posts without touching Meta. The "token" here
  // is a sentinel, not a real Graph API token.
  if (isDemoIgUserId(account.ig_user_id)) {
    const media = buildDemoMedia(account.ig_user_id, limit);
    return NextResponse.json({
      media: media.map((m) => ({
        id: m.id,
        caption: m.caption ?? null,
        media_type: m.media_type,
        thumbnail_url: m.thumbnail_url ?? m.media_url ?? null,
        permalink: m.permalink,
        timestamp: m.timestamp,
        comments_count: m.comments_count ?? 0,
        like_count: m.like_count ?? 0,
      })),
    });
  }

  try {
    const token = decryptToken(account.access_token_encrypted);
    const media = await listMedia(token, limit);
    // Trim the response — the token must never go to the client, and we only
    // need fields the picker actually renders.
    return NextResponse.json({
      media: media.map((m) => ({
        id: m.id,
        caption: m.caption ?? null,
        media_type: m.media_type,
        thumbnail_url: m.thumbnail_url ?? m.media_url ?? null,
        permalink: m.permalink,
        timestamp: m.timestamp,
        comments_count: m.comments_count ?? 0,
        like_count: m.like_count ?? 0,
      })),
    });
  } catch (err: any) {
    const status = err instanceof InstagramApiError ? err.status : 500;
    return NextResponse.json(
      { error: err?.message || "Failed to fetch media" },
      { status }
    );
  }
}
