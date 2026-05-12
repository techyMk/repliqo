// =============================================================================
// Plan definitions — client-safe. Only static config lives here so any UI
// (including the dashboard sidebar) can import this file without dragging
// server env validation into the client bundle.
//
// Server-only helpers (priceIdFor, planFromPriceId) live in ./billing.ts.
// =============================================================================

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
