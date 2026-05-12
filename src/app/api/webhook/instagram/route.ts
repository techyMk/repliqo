// =============================================================================
// /api/webhook/instagram
//
//   GET — Meta's verification handshake. We echo back hub.challenge iff
//         hub.verify_token matches what we configured in Meta's dashboard.
//
//   POST — Inbound event payloads (comments, messages, postbacks).
//          We validate the HMAC signature, persist the raw event, and
//          ACK 200 IMMEDIATELY (Part 4.5 of the build doc). Processing
//          happens asynchronously after the response is sent.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { verifyMetaSignature } from "@/lib/crypto";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { processWebhookEvent } from "@/lib/instagram/processor";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- GET: handshake ----
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const mode = sp.get("hub.mode");
  const token = sp.get("hub.verify_token");
  const challenge = sp.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    serverEnv.INSTAGRAM_WEBHOOK_VERIFY_TOKEN &&
    token === serverEnv.INSTAGRAM_WEBHOOK_VERIFY_TOKEN
  ) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }
  return new NextResponse("forbidden", { status: 403 });
}

// ---- POST: event ----
export async function POST(req: NextRequest) {
  // Read the raw body BEFORE parsing JSON so HMAC verification works
  // against the exact bytes Meta sent.
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  const appSecret =
    serverEnv.INSTAGRAM_WEBHOOK_APP_SECRET || serverEnv.META_APP_SECRET || "";

  const valid = appSecret
    ? verifyMetaSignature(rawBody, signature, appSecret)
    : false;

  let payload: any = null;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    // bad payload — still 200 so Meta doesn't retry; we'll skip processing.
    return new NextResponse("ok", { status: 200 });
  }

  // Compute a deterministic external_id so redeliveries get deduped on the
  // unique (source, external_id) index in webhook_events.
  const externalId = crypto
    .createHash("sha256")
    .update(rawBody)
    .digest("hex");

  const sb = createSupabaseServiceClient();

  // Insert the raw event. If it conflicts (already received), skip.
  const { data, error } = await sb
    .from("webhook_events")
    .insert({
      source: "instagram",
      ig_user_id: payload?.entry?.[0]?.id ?? null,
      event_type: payload?.entry?.[0]?.changes?.[0]?.field ?? null,
      signature_valid: valid,
      payload,
      external_id: externalId,
      processing_status: valid ? "pending" : "skipped",
    })
    .select("id")
    .single();

  // Ack Meta immediately. Process out-of-band.
  // We don't await processing — Vercel/Railway will keep the function alive
  // long enough for "fire and forget" within the ~25s function budget.
  // For real production, swap this with a queue (Inngest, BullMQ, etc).
  if (valid && data?.id) {
    void processWebhookEvent(data.id).catch((err) => {
      console.error("[webhook] processing failed", { id: data.id, err: err?.message });
    });
  }

  if (!valid) {
    // Signature failed — log but still 200 so Meta doesn't retry endlessly.
    console.warn("[webhook] invalid signature", { error: error?.message });
  }

  return new NextResponse("ok", { status: 200 });
}
