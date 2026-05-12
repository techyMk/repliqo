// =============================================================================
// Automation processor
//
// Called from the webhook handler AFTER we've ack'd 200 to Meta.
// Reads the persisted webhook_events row and dispatches comment / messaging
// events to the right automation. Idempotency comes from the unique constraints
// on automation_logs (automation_id, comment_id, event_type).
//
// Designed to be safe to invoke twice for the same event — duplicate writes
// fail at the DB layer and we log a `duplicate_skipped` event.
// =============================================================================

import { createSupabaseServiceClient } from "../supabase/server";
import { decryptToken } from "../crypto";
import {
  InstagramApiError,
  replyToComment,
  sendPrivateReply,
  sendDirectMessage,
  checkFollowStatus,
} from "./client";
import { matchKeyword, renderTemplate } from "./matcher";
import { sleep } from "../utils";
import type {
  Automation,
  AutomationKeyword,
  IGWebhookEntry,
  IGCommentChange,
  IGMessagingEvent,
} from "../types";

const FOLLOW_GATE_PAYLOAD_PREFIX = "REPLIQO_FOLLOW_GATE:";

// -----------------------------------------------------------------------------
// Entry point
// -----------------------------------------------------------------------------

export async function processWebhookEvent(eventId: string): Promise<void> {
  const sb = createSupabaseServiceClient();

  const { data: ev, error } = await sb
    .from("webhook_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error || !ev) return;
  if (ev.processing_status === "processed") return;

  await sb
    .from("webhook_events")
    .update({ processing_status: "processing", attempts: ev.attempts + 1 })
    .eq("id", eventId);

  try {
    const payload = ev.payload as { object: string; entry: IGWebhookEntry[] };
    for (const entry of payload.entry || []) {
      // Comment events
      for (const change of entry.changes || []) {
        if (change.field === "comments") {
          await handleCommentEvent(entry.id, change);
        }
      }
      // Messaging events (postbacks for follow gate)
      for (const msg of entry.messaging || []) {
        await handleMessagingEvent(entry.id, msg);
      }
    }
    await sb
      .from("webhook_events")
      .update({ processing_status: "processed", processed_at: new Date().toISOString() })
      .eq("id", eventId);
  } catch (err: any) {
    await sb
      .from("webhook_events")
      .update({
        processing_status: "failed",
        last_error: err?.message?.slice(0, 1000) || "unknown",
      })
      .eq("id", eventId);
    throw err;
  }
}

// -----------------------------------------------------------------------------
// Comment handler
// -----------------------------------------------------------------------------

async function handleCommentEvent(igUserId: string, change: IGCommentChange) {
  const sb = createSupabaseServiceClient();
  const comment = change.value;

  // Skip the business commenting on its own post
  if (comment.from?.id === igUserId) return;

  // Find the connected Repliqo account for this IG business id
  const { data: account } = await sb
    .from("instagram_accounts")
    .select("*")
    .eq("ig_user_id", igUserId)
    .eq("status", "active")
    .maybeSingle();

  if (!account) return;

  // Find active automations for this account (post-specific first, then global)
  const { data: automations } = await sb
    .from("automations")
    .select("*, automation_keywords(*)")
    .eq("ig_account_id", account.id)
    .eq("status", "active");

  if (!automations || automations.length === 0) return;

  const eligible = (automations as (Automation & { automation_keywords: AutomationKeyword[] })[])
    .filter((a) => !a.post_id || a.post_id === comment.media.id);

  for (const automation of eligible) {
    const keywords = automation.automation_keywords.map((k) => k.keyword);
    const matched = matchKeyword({
      text: comment.text,
      keywords,
      mode: automation.match_mode,
      caseSensitive: automation.case_sensitive,
    });
    if (!matched) continue;

    // Dedup: try inserting comment_received. If it conflicts, we've seen this comment.
    const { error: dupErr } = await sb.from("automation_logs").insert({
      automation_id: automation.id,
      ig_account_id: account.id,
      user_id: automation.user_id,
      event_type: "comment_received",
      comment_id: comment.id,
      commenter_ig_id: comment.from?.id,
      commenter_username: comment.from?.username,
      matched_keyword: matched,
      raw_comment_text: comment.text,
      status: "success",
    });
    if (dupErr) {
      await sb.from("automation_logs").insert({
        automation_id: automation.id,
        ig_account_id: account.id,
        user_id: automation.user_id,
        event_type: "duplicate_skipped",
        comment_id: comment.id,
        status: "skipped",
      });
      continue;
    }

    // Rate limit check — count DMs in the last hour via Postgres function.
    // Uses the composite (automation_id, created_at desc) index for O(log n).
    const { data: rateCount } = await sb.rpc("count_recent_dms_for_automation", {
      p_automation_id: automation.id,
      p_window_minutes: 60,
    });
    const count = (rateCount as number | null) ?? 0;

    if (count >= automation.rate_limit_per_hour) {
      await sb.from("automation_logs").insert({
        automation_id: automation.id,
        ig_account_id: account.id,
        user_id: automation.user_id,
        event_type: "rate_limited",
        comment_id: comment.id,
        status: "skipped",
      });
      continue;
    }

    // Total cap check
    if (automation.total_sends_limit && automation.send_count >= automation.total_sends_limit) {
      continue;
    }

    await dispatchCommentTrigger(account, automation, comment, matched);
  }
}

async function dispatchCommentTrigger(
  account: any,
  automation: Automation,
  comment: IGCommentChange["value"],
  matched: string
) {
  const sb = createSupabaseServiceClient();
  const accessToken = decryptToken(account.access_token_encrypted);
  const vars = {
    username: comment.from?.username,
    keyword: matched,
    first_name: comment.from?.username?.split(".")[0] || comment.from?.username,
  };

  // 1) Public reply to the comment (with one retry for the propagation race — Part 4.3)
  if (automation.comment_reply) {
    const body = renderTemplate(automation.comment_reply, vars);
    let attempt = 0;
    let lastErr: any = null;
    while (attempt < 2) {
      try {
        const res = await replyToComment({
          accessToken,
          commentId: comment.id,
          message: body,
        });
        await sb.from("automation_logs").insert({
          automation_id: automation.id,
          ig_account_id: account.id,
          user_id: automation.user_id,
          event_type: "reply_sent",
          comment_id: comment.id,
          commenter_ig_id: comment.from?.id,
          matched_keyword: matched,
          comment_reply_id: res.id,
          status: "success",
        });
        await sb.rpc("increment_automation_counters", {
          p_automation_id: automation.id,
          p_replies: 1,
        });
        lastErr = null;
        break;
      } catch (err: any) {
        lastErr = err;
        attempt++;
        if (attempt < 2) await sleep(2500);
      }
    }
    if (lastErr) {
      await logFailure(automation, account, comment, "reply_sent", lastErr);
    }
  }

  // 2) DM via Private Reply (within the 7-day window — Part 4.4)
  const useFollowGate = automation.follow_gate_enabled;
  try {
    if (useFollowGate) {
      const gateBody = renderTemplate(
        automation.follow_gate_message || automation.dm_message,
        vars
      );
      const res = await sendPrivateReply({
        accessToken,
        igUserId: account.ig_user_id,
        commentId: comment.id,
        message: gateBody,
        buttons: [
          {
            title: automation.follow_gate_cta || "I'm following!",
            payload: `${FOLLOW_GATE_PAYLOAD_PREFIX}${automation.id}`,
          },
        ],
      });
      await sb.from("automation_logs").insert({
        automation_id: automation.id,
        ig_account_id: account.id,
        user_id: automation.user_id,
        event_type: "follow_gate_sent",
        comment_id: comment.id,
        commenter_ig_id: comment.from?.id,
        commenter_username: comment.from?.username,
        matched_keyword: matched,
        dm_message_id: res.message_id,
        status: "success",
      });
    } else {
      const body = renderTemplate(automation.dm_message, vars);
      const buttons =
        automation.dm_button_label && automation.dm_button_url
          ? [{ title: automation.dm_button_label, url: automation.dm_button_url }]
          : undefined;
      const res = await sendPrivateReply({
        accessToken,
        igUserId: account.ig_user_id,
        commentId: comment.id,
        message: body,
        buttons,
      });
      await sb.from("automation_logs").insert({
        automation_id: automation.id,
        ig_account_id: account.id,
        user_id: automation.user_id,
        event_type: "dm_sent",
        comment_id: comment.id,
        commenter_ig_id: comment.from?.id,
        commenter_username: comment.from?.username,
        matched_keyword: matched,
        dm_message_id: res.message_id,
        status: "success",
      });
      await sb.rpc("increment_automation_counters", {
        p_automation_id: automation.id,
        p_triggers: 1,
        p_dms: 1,
        p_sends: 1,
      });
    }
  } catch (err: any) {
    await logFailure(automation, account, comment, "dm_sent", err);
  }
}

// -----------------------------------------------------------------------------
// Messaging handler — follow-gate postback
// -----------------------------------------------------------------------------

async function handleMessagingEvent(igUserId: string, msg: IGMessagingEvent) {
  if (msg.message?.is_echo) return;

  const payload = msg.postback?.payload || msg.message?.quick_reply?.payload;
  if (!payload?.startsWith(FOLLOW_GATE_PAYLOAD_PREFIX)) return;

  const automationId = payload.slice(FOLLOW_GATE_PAYLOAD_PREFIX.length);
  const recipientIgsid = msg.sender.id;

  const sb = createSupabaseServiceClient();

  const { data: automation } = await sb
    .from("automations")
    .select("*, instagram_accounts!inner(*)")
    .eq("id", automationId)
    .single<Automation & { instagram_accounts: any }>();

  if (!automation) return;
  const account = (automation as any).instagram_accounts;
  const accessToken = decryptToken(account.access_token_encrypted);

  const { isFollowing } = await checkFollowStatus({
    accessToken,
    igUserId,
    recipientIgsid,
  });

  if (!isFollowing) {
    // Re-send the gate
    try {
      await sendDirectMessage({
        accessToken,
        igUserId,
        recipientIgsid,
        message:
          "Almost there! Follow the account first, then tap the button again to unlock the link.",
        buttons: [
          {
            title: automation.follow_gate_cta || "I'm following!",
            payload: `${FOLLOW_GATE_PAYLOAD_PREFIX}${automation.id}`,
          },
        ],
      });
    } catch {
      // swallow — best effort
    }
    return;
  }

  // Following: send the unlocked DM
  try {
    const body = automation.dm_message;
    const buttons =
      automation.dm_button_label && automation.dm_button_url
        ? [{ title: automation.dm_button_label, url: automation.dm_button_url }]
        : undefined;
    const res = await sendDirectMessage({
      accessToken,
      igUserId,
      recipientIgsid,
      message: body,
      buttons,
    });
    await sb.from("automation_logs").insert({
      automation_id: automation.id,
      ig_account_id: account.id,
      user_id: automation.user_id,
      event_type: "follow_gate_passed",
      commenter_ig_id: recipientIgsid,
      dm_message_id: res.message_id,
      status: "success",
    });
    await sb.from("automation_logs").insert({
      automation_id: automation.id,
      ig_account_id: account.id,
      user_id: automation.user_id,
      event_type: "dm_sent",
      commenter_ig_id: recipientIgsid,
      dm_message_id: res.message_id,
      status: "success",
    });
    await sb.rpc("increment_automation_counters", {
      p_automation_id: automation.id,
      p_dms: 1,
      p_sends: 1,
    });
  } catch (err: any) {
    const sb = createSupabaseServiceClient();
    await sb.from("automation_logs").insert({
      automation_id: automation.id,
      ig_account_id: account.id,
      user_id: automation.user_id,
      event_type: "error",
      commenter_ig_id: recipientIgsid,
      status: "failed",
      error_code: err instanceof InstagramApiError ? String(err.code || err.status) : "unknown",
      error_message: err?.message?.slice(0, 500),
    });
  }
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function logFailure(
  automation: Automation,
  account: any,
  comment: IGCommentChange["value"],
  eventType: "reply_sent" | "dm_sent",
  err: any
) {
  const sb = createSupabaseServiceClient();
  await sb.from("automation_logs").insert({
    automation_id: automation.id,
    ig_account_id: account.id,
    user_id: automation.user_id,
    event_type: "error",
    comment_id: comment.id,
    commenter_ig_id: comment.from?.id,
    commenter_username: comment.from?.username,
    status: "failed",
    error_code:
      err instanceof InstagramApiError
        ? String(err.code || err.subcode || err.status)
        : "unknown",
    error_message: `${eventType}: ${err?.message?.slice(0, 480) || "unknown"}`,
  });
}
