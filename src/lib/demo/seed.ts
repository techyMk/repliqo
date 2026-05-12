// =============================================================================
// Demo seed
//
// Populates a user's workspace with a fake Instagram account, three example
// automations, keywords, and ~30 days of activity logs so the dashboard,
// analytics, and inbox all look alive.
//
// Idempotent: refuses to seed if the user already has any Instagram account.
// The fake IG account has a sentinel ig_user_id so it can be deleted later.
// Never makes real Meta API calls.
// =============================================================================

import { createSupabaseServiceClient } from "../supabase/server";
import { encryptToken } from "../crypto";
import type { AutomationLogEvent } from "../types";

export const DEMO_IG_USER_ID_PREFIX = "demo_";

// Build a stable, recognizable fake IG user id per Repliqo user so re-seeds
// land on the same row and we can cleanly delete demo data later.
function fakeIgUserId(userId: string) {
  return `${DEMO_IG_USER_ID_PREFIX}${userId.replace(/-/g, "").slice(0, 16)}`;
}

// True when the IG account row was created by the demo seeder rather than by
// the OAuth flow. Used to short-circuit any code path that would otherwise
// call Meta's API (the demo "token" is a sentinel, not a real one).
export function isDemoIgUserId(igUserId: string | null | undefined): boolean {
  return !!igUserId && igUserId.startsWith(DEMO_IG_USER_ID_PREFIX);
}

type SeedResult = {
  seeded: boolean;
  reason?: string;
  ig_account_id?: string;
  automation_ids?: string[];
  logs_inserted?: number;
};

export async function seedDemoData(userId: string): Promise<SeedResult> {
  const sb = createSupabaseServiceClient();

  // Self-heal: ensure a profiles row exists for this user before inserting
  // anything that FKs back to it. The handle_new_user trigger should already
  // have created the row at signup, but if the user signed up before the
  // trigger existed (or the schema was re-run since), we need to backfill.
  const { data: profile } = await sb
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    const { data: authData } = await sb.auth.admin.getUserById(userId);
    if (!authData?.user) {
      return { seeded: false, reason: "Auth user not found." };
    }
    const meta = (authData.user.user_metadata ?? {}) as Record<string, string>;
    const { error: profileErr } = await sb.from("profiles").insert({
      id: userId,
      email: authData.user.email ?? `${userId}@unknown.local`,
      full_name: meta.full_name ?? meta.name ?? null,
      avatar_url: meta.avatar_url ?? null,
    });
    if (profileErr) {
      return { seeded: false, reason: `Profile backfill failed: ${profileErr.message}` };
    }
  }

  // Guard: skip if the user already has any IG account (real or demo).
  const { count } = await sb
    .from("instagram_accounts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if ((count ?? 0) > 0) {
    return { seeded: false, reason: "Workspace already has Instagram accounts." };
  }

  // ---- 1. Fake Instagram account ----
  const { data: account, error: accErr } = await sb
    .from("instagram_accounts")
    .insert({
      user_id: userId,
      ig_user_id: fakeIgUserId(userId),
      username: "demo.creator",
      account_type: "BUSINESS",
      profile_picture_url: "https://picsum.photos/seed/repliqo-creator/200",
      followers_count: 18420,
      follows_count: 312,
      media_count: 87,
      // Real-looking ciphertext, but the underlying plaintext is just a label.
      // We never call Meta with this token — it's only here to satisfy the
      // not-null constraint and look realistic in the UI.
      access_token_encrypted: encryptToken("DEMO-MODE-TOKEN-NOT-REAL"),
      token_expires_at: new Date(Date.now() + 60 * 86400_000).toISOString(),
      scopes: [
        "instagram_business_basic",
        "instagram_business_manage_messages",
        "instagram_business_manage_comments",
      ],
      status: "active",
      last_synced_at: new Date().toISOString(),
    })
    .select("id, ig_user_id")
    .single();

  if (accErr || !account) {
    return { seeded: false, reason: accErr?.message || "Failed to insert demo account" };
  }

  // ---- 2. Three example automations ----
  const automationsToInsert = [
    {
      user_id: userId,
      ig_account_id: account.id,
      name: "The Drop · Comment → DM",
      description: "Send shop link to anyone who comments LINK on the launch post.",
      post_id: "demo_post_drop",
      post_thumbnail_url: "https://picsum.photos/seed/repliqo-drop/400",
      post_caption: "New drop. Limited stock. Comment LINK for early access.",
      status: "active" as const,
      match_mode: "contains" as const,
      case_sensitive: false,
      comment_reply: "Sent! Check your DMs 📩",
      dm_message: "Hey {username} 👋 here's the drop link — limited stock!",
      dm_button_label: "Shop the drop",
      dm_button_url: "https://example.com/the-drop",
      follow_gate_enabled: false,
      rate_limit_per_hour: 300,
      total_sends_limit: null,
    },
    {
      user_id: userId,
      ig_account_id: account.id,
      name: "Free guide · Follow gate",
      description: "Send the free PDF only if the user follows the account.",
      post_id: "demo_post_guide",
      post_thumbnail_url: "https://picsum.photos/seed/repliqo-guide/400",
      post_caption: "Free 30-page guide — comment GUIDE and follow to unlock.",
      status: "active" as const,
      match_mode: "contains" as const,
      case_sensitive: false,
      comment_reply: "DM'd you 👀",
      dm_message: "Locked content. Here's the guide 👇",
      dm_button_label: "Download guide",
      dm_button_url: "https://example.com/guide.pdf",
      follow_gate_enabled: true,
      follow_gate_message: "Almost there! Follow first, then tap to unlock 🔓",
      follow_gate_cta: "I'm following!",
      rate_limit_per_hour: 250,
      total_sends_limit: null,
    },
    {
      user_id: userId,
      ig_account_id: account.id,
      name: "Course inquiry · Lead qualifier",
      description: "Qualify course leads with a quick reply DM.",
      post_id: null,
      post_thumbnail_url: null,
      post_caption: null,
      status: "paused" as const,
      match_mode: "contains" as const,
      case_sensitive: false,
      comment_reply: "DM incoming!",
      dm_message:
        "Quick question — what platform are you on? 1) Solo  2) 2–10  3) 10+",
      dm_button_label: null,
      dm_button_url: null,
      follow_gate_enabled: false,
      rate_limit_per_hour: 150,
      total_sends_limit: null,
    },
  ];

  const { data: automations, error: autoErr } = await sb
    .from("automations")
    .insert(automationsToInsert)
    .select("id, name");

  if (autoErr || !automations) {
    return { seeded: false, reason: autoErr?.message || "Failed to insert automations" };
  }

  // ---- 3. Keywords ----
  const keywordRows = [
    ...["link", "price", "drop", "shop"].map((k) => ({ automation_id: automations[0].id, keyword: k })),
    ...["guide", "ebook", "free", "pdf"].map((k) => ({ automation_id: automations[1].id, keyword: k })),
    ...["course", "info", "pricing"].map((k) => ({ automation_id: automations[2].id, keyword: k })),
  ];
  await sb.from("automation_keywords").insert(keywordRows);

  // ---- 4. ~30 days of realistic activity ----
  const usernames = [
    "marisa.k", "jay.designs", "ali_runs", "noah.builds", "studio.east",
    "frame.co", "luna.maker", "kai_tan", "rae.studio", "ivy.shop",
    "south.house", "circuit_io", "leo.lab", "june_works", "ash.creates",
    "tide.ops", "nova.guild", "iris.design", "max.notes", "kit.kit",
  ];
  const keywords = ["link", "price", "guide", "info", "drop", "course"];
  const logs: any[] = [];

  // Per automation, generate a realistic stream of events going back 30 days.
  for (const auto of automations) {
    // Volume scales by which automation — first one is "live", third is paused.
    const idx = automations.indexOf(auto);
    const volumePerDay = idx === 0 ? 22 : idx === 1 ? 14 : 4;

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      // Skew newer days higher to create the "growth" curve charts love.
      const day = new Date(Date.now() - dayOffset * 86400_000);
      const dayVolume = Math.max(
        0,
        Math.round(volumePerDay * (1 - dayOffset / 60) + (Math.random() - 0.5) * 6)
      );

      for (let i = 0; i < dayVolume; i++) {
        // Spread events through the day
        const minuteOffset = Math.floor(Math.random() * 24 * 60);
        const ts = new Date(day);
        ts.setHours(0, minuteOffset, Math.floor(Math.random() * 60), 0);

        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const keyword = keywords[Math.floor(Math.random() * keywords.length)];
        const commentId = `demo_c_${auto.id.slice(0, 8)}_${ts.getTime()}_${i}`;

        // Each successful trigger emits 3 logs: comment_received, reply_sent, dm_sent.
        // ~3% fail somewhere; ~5% are duplicate_skipped.
        const roll = Math.random();
        const failed = roll < 0.03;
        const duplicate = roll >= 0.03 && roll < 0.08;

        if (duplicate) {
          logs.push(baseLog(auto.id, userId, account.id, ts, "duplicate_skipped", "skipped", { commentId, username }));
          continue;
        }

        logs.push(baseLog(auto.id, userId, account.id, ts, "comment_received", "success", { commentId, username, keyword, text: `${keyword} please!` }));

        // Reply
        const replyTs = addSec(ts, 1);
        logs.push(baseLog(auto.id, userId, account.id, replyTs, "reply_sent", failed && roll < 0.015 ? "failed" : "success", { commentId, username, keyword, errorMessage: failed && roll < 0.015 ? "Object does not exist (race)" : undefined }));

        if (failed && roll < 0.015) continue;

        // DM
        const dmTs = addSec(ts, 2);
        logs.push(baseLog(auto.id, userId, account.id, dmTs, "dm_sent", failed ? "failed" : "success", { commentId, username, keyword, errorMessage: failed ? "Rate limit by Meta" : undefined }));
      }
    }
  }

  // Bulk insert — split into batches to stay under Postgres parameter limits.
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < logs.length; i += BATCH) {
    const slice = logs.slice(i, i + BATCH);
    const { error: logErr } = await sb.from("automation_logs").insert(slice);
    if (!logErr) inserted += slice.length;
  }

  // ---- 5. Roll up the counters on each automation ----
  for (const auto of automations) {
    const { count: triggersCount } = await sb
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("automation_id", auto.id)
      .eq("event_type", "comment_received");
    const { count: repliesCount } = await sb
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("automation_id", auto.id)
      .eq("event_type", "reply_sent")
      .eq("status", "success");
    const { count: dmsCount } = await sb
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("automation_id", auto.id)
      .eq("event_type", "dm_sent")
      .eq("status", "success");

    await sb
      .from("automations")
      .update({
        triggers_count: triggersCount ?? 0,
        replies_sent_count: repliesCount ?? 0,
        dms_sent_count: dmsCount ?? 0,
        send_count: dmsCount ?? 0,
      })
      .eq("id", auto.id);
  }

  return {
    seeded: true,
    ig_account_id: account.id,
    automation_ids: automations.map((a) => a.id),
    logs_inserted: inserted,
  };
}

function baseLog(
  automationId: string,
  userId: string,
  accountId: string,
  ts: Date,
  event: AutomationLogEvent,
  status: "success" | "failed" | "pending" | "skipped",
  extra: {
    commentId?: string;
    username?: string;
    keyword?: string;
    text?: string;
    errorMessage?: string;
  }
) {
  return {
    automation_id: automationId,
    ig_account_id: accountId,
    user_id: userId,
    event_type: event,
    comment_id: extra.commentId ?? null,
    commenter_ig_id: extra.username ? `igsid_${extra.username}` : null,
    commenter_username: extra.username ?? null,
    matched_keyword: extra.keyword ?? null,
    raw_comment_text: extra.text ?? null,
    status,
    error_code: extra.errorMessage ? "demo_error" : null,
    error_message: extra.errorMessage ?? null,
    created_at: ts.toISOString(),
  };
}

function addSec(d: Date, sec: number) {
  return new Date(d.getTime() + sec * 1000);
}

// Cleanup helper — used by the dashboard "Reset demo data" action.
export async function resetDemoData(userId: string) {
  const sb = createSupabaseServiceClient();
  const prefix = fakeIgUserId(userId);
  const { data: account } = await sb
    .from("instagram_accounts")
    .select("id")
    .eq("user_id", userId)
    .eq("ig_user_id", prefix)
    .maybeSingle();
  if (!account) return { cleared: false };
  // Cascades to automations, keywords, logs via FK on delete cascade.
  await sb.from("instagram_accounts").delete().eq("id", account.id);
  return { cleared: true };
}
