// =============================================================================
// POST /api/webhooks/stripe
//
// Stripe-fires-this-at-us. We verify the signature, then sync the user's plan
// and subscription state on `profiles`.
//
// Subscribed events (configure in Stripe Dashboard -> Webhooks):
//   checkout.session.completed         — user finished Checkout
//   customer.subscription.created      — new subscription on file
//   customer.subscription.updated      — plan switch, renewal, status change
//   customer.subscription.deleted      — canceled / unpaid
//   invoice.payment_failed             — alert path; we set status to past_due
//
// Signature verification reads the raw body bytes — express.json() would
// corrupt it. App Router's Request.text() returns the unparsed body, so we use
// that and JSON.parse separately.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { serverEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe/client";
import { planFromPriceId } from "@/lib/stripe/billing";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();

  if (!sig || !serverEnv.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, serverEnv.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[stripe webhook] invalid signature", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const sb = createSupabaseServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // We pull the subscription so we can read its priceId & period_end.
        if (session.mode === "subscription" && typeof session.subscription === "string") {
          const sub = await getStripe().subscriptions.retrieve(session.subscription);
          await syncSubscription(sb, sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sb, sub);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : null;
        if (customerId) {
          await sb
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
      default:
        // Ignore events we don't subscribe to.
        break;
    }
  } catch (err: any) {
    console.error("[stripe webhook] handler error", { event: event.type, msg: err?.message });
    // Return 500 so Stripe retries — this is the safe behavior for transient DB errors.
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// -----------------------------------------------------------------------------
// Sync a Stripe Subscription onto the matching profiles row.
// -----------------------------------------------------------------------------
async function syncSubscription(
  sb: ReturnType<typeof createSupabaseServiceClient>,
  sub: Stripe.Subscription
) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // Resolve to a Repliqo user — prefer metadata (set on checkout), fall back
  // to the unique stripe_customer_id on profiles.
  let userId = sub.metadata?.user_id;
  if (!userId) {
    const { data: profile } = await sb
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();
    userId = profile?.id;
  }
  if (!userId) {
    console.warn("[stripe webhook] could not resolve user for customer", customerId);
    return;
  }

  const priceId = sub.items.data[0]?.price?.id;
  const plan = planFromPriceId(priceId);
  const status = sub.status;
  const isCanceled = status === "canceled" || status === "incomplete_expired";

  // current_period_end is on the subscription item in newer API versions;
  // fall back to the legacy top-level field for safety.
  const periodEnd =
    (sub.items.data[0] as unknown as { current_period_end?: number })?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    null;

  await sb
    .from("profiles")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      subscription_status: status,
      // If the subscription was canceled or never activated, fall back to free.
      // Otherwise apply the plan we mapped from the price id.
      plan: isCanceled ? "free" : (plan ?? "free"),
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    })
    .eq("id", userId);
}
