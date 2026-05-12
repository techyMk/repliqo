// =============================================================================
// Plan definitions — single source of truth shared by the pricing page,
// checkout endpoint, webhook, and any future feature-gating logic.
// =============================================================================

import { serverEnv } from "../env";
import type { PlanTier } from "../types";

export type PaidPlan = "growth" | "agency";

export type PlanDefinition = {
  id: PlanTier;
  name: string;
  monthlyUsd: number;
  // Per-plan limits surfaced in the UI and (in a future round) enforced by
  // the webhook / automation processor.
  limits: {
    ig_accounts: number;
    automations: number | "unlimited";
    dms_per_month: number;
  };
};

export const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    monthlyUsd: 0,
    limits: { ig_accounts: 1, automations: 2, dms_per_month: 500 },
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyUsd: 9,
    limits: { ig_accounts: 1, automations: 5, dms_per_month: 5_000 },
  },
  growth: {
    id: "growth",
    name: "Growth",
    monthlyUsd: 29,
    limits: { ig_accounts: 3, automations: "unlimited", dms_per_month: 20_000 },
  },
  agency: {
    id: "agency",
    name: "Agency",
    monthlyUsd: 99,
    limits: { ig_accounts: 15, automations: "unlimited", dms_per_month: 100_000 },
  },
};

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
