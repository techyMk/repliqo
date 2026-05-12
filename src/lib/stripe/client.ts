// Server-only Stripe SDK wrapper. Throws on first use if STRIPE_SECRET_KEY is
// missing — fine for build, surfaces the misconfig at request time.

import Stripe from "stripe";
import { serverEnv } from "../env";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  if (!serverEnv.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. See .env.example for how to obtain test-mode keys."
    );
  }
  cached = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
    appInfo: { name: "Repliqo", version: "0.7.0" },
  });
  return cached;
}
