// =============================================================================
// POST /api/billing/checkout
//
// Creates a Stripe-hosted Checkout Session and redirects the browser to it.
// On success/cancel, Stripe redirects back to the dashboard. The actual plan
// switch happens in the webhook handler, NOT here — Checkout is async.
//
// Body: { plan: "growth" | "agency" }
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { priceIdFor, type PaidPlan } from "@/lib/stripe/plans";
import { publicEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  plan: z.enum(["growth", "agency"]),
});

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const plan: PaidPlan = parsed.data.plan;

  // Look up — or create — the Stripe customer for this user. We persist the
  // id on profiles so subsequent checkouts reuse it (avoiding duplicate
  // customer rows in Stripe).
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, stripe_customer_id")
    .eq("id", userData.user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const stripe = getStripe();
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

  let customerId = profile.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      name: profile.full_name ?? undefined,
      metadata: { user_id: profile.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", profile.id);
  }

  let priceId: string;
  try {
    priceId = priceIdFor(plan);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    // The user_id metadata is duplicated on subscription and customer so the
    // webhook can resolve a user from any payload shape.
    subscription_data: { metadata: { user_id: profile.id, plan } },
    success_url: `${baseUrl}/dashboard/settings?billing=success`,
    cancel_url: `${baseUrl}/dashboard/settings?billing=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
