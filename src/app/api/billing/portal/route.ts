// =============================================================================
// POST /api/billing/portal
//
// Creates a Stripe Customer Portal session and redirects the user there.
// The portal lets them update payment method, switch plans, cancel, or
// download invoices — all hosted by Stripe, no UI to maintain.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { publicEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", userData.user.id)
      .single();

    if (profileErr) {
      return NextResponse.json(
        {
          error: profileErr.message?.includes("stripe_customer_id")
            ? "Database missing billing columns. Run supabase/migrations/002_billing.sql."
            : profileErr.message,
        },
        { status: 500 }
      );
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer for this user. Upgrade first." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[billing/portal] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to open billing portal" },
      { status: 500 }
    );
  }
}
