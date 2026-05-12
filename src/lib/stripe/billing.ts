// =============================================================================
// Server-only billing helpers — resolve plan <-> Stripe Price ID via the
// validated server env. Importing this file in a client component would bundle
// serverEnv into the browser, so keep it confined to route handlers + webhooks.
// =============================================================================

import { serverEnv } from "../env";
import type { PaidPlan } from "./plans";

// Map paid plan -> Stripe Price ID. Throws if the env isn't configured.
export function priceIdFor(plan: PaidPlan): string {
  const id =
    plan === "growth"
      ? serverEnv.STRIPE_PRICE_ID_GROWTH
      : serverEnv.STRIPE_PRICE_ID_AGENCY;
  if (!id) {
    throw new Error(
      `Stripe Price ID for plan "${plan}" is not configured. Set STRIPE_PRICE_ID_${plan.toUpperCase()} in .env.local.`
    );
  }
  return id;
}

// Resolve Stripe Price ID -> plan id. Used by the webhook to translate a
// subscription event back to a plan tier we store on profiles.plan.
export function planFromPriceId(priceId: string | null | undefined): PaidPlan | null {
  if (!priceId) return null;
  if (priceId === serverEnv.STRIPE_PRICE_ID_GROWTH) return "growth";
  if (priceId === serverEnv.STRIPE_PRICE_ID_AGENCY) return "agency";
  return null;
}
