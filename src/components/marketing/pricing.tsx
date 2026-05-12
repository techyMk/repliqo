"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  planId: "free" | "growth" | "agency";
  price: string;
  period: string;
  description: string;
  featured: boolean;
  features: string[];
};

const tiers: Tier[] = [
  {
    name: "Free",
    planId: "free",
    price: "$0",
    period: "forever",
    description: "Try the full product on one account.",
    featured: false,
    features: [
      "1 Instagram account",
      "2 active automations",
      "500 DMs / month",
      "Comment + DM analytics",
      "Email support",
    ],
  },
  {
    name: "Growth",
    planId: "growth",
    price: "$29",
    period: "/ month",
    description: "For creators and small brands ready to scale.",
    featured: true,
    features: [
      "3 Instagram accounts",
      "Unlimited automations",
      "20,000 DMs / month",
      "Follow gate + smart links",
      "Workflow templates",
      "Priority support",
    ],
  },
  {
    name: "Agency",
    planId: "agency",
    price: "$99",
    period: "/ month",
    description: "For agencies managing multiple clients.",
    featured: false,
    features: [
      "15 Instagram accounts",
      "Team seats + roles",
      "100,000 DMs / month",
      "White-label option",
      "API access",
      "Dedicated CSM",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36 border-b border-white/[0.05] relative">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— Pricing</p>
          <h2 className="mt-4 text-display-sm gradient-text font-semibold text-balance">
            Simple pricing.
            <span className="font-display italic font-normal text-brand-gradient"> No </span>
            surprises.
          </h2>
          <p className="mt-5 text-muted-foreground text-balance">
            Start free. Upgrade when you outgrow it. Cancel any time.
          </p>
          <p className="mt-2 text-[11px] text-muted-foreground/70">
            Stripe is in test mode — use card{" "}
            <code className="font-mono">4242 4242 4242 4242</code> with any future date + CVC.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-4 max-w-5xl mx-auto items-start">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className={cn(
                "relative rounded-2xl p-7 flex flex-col",
                t.featured
                  ? "border border-white/[0.15] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent glow-ring md:-translate-y-3"
                  : "border border-white/[0.08] bg-white/[0.02] surface-hover"
              )}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[hsl(var(--brand-pink))] via-[hsl(var(--brand-purple))] to-[hsl(var(--brand-blue))] text-white text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 shadow-[0_4px_16px_-4px_hsl(var(--brand-purple)/0.6)]">
                  Most popular
                </div>
              )}
              <div className="text-[13px] font-medium tracking-wide text-foreground/85">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <div className="text-[2.75rem] leading-none font-semibold tracking-tightest">{t.price}</div>
                <div className="text-sm text-muted-foreground">{t.period}</div>
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">{t.description}</p>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px]">
                    <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] shrink-0">
                      <Check className="h-2.5 w-2.5 text-foreground/85" />
                    </span>
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 pt-1">
                <PricingCta tier={t} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA renders one of three behaviors based on the tier:
//   Free  → link to /signup
//   Paid  → if logged in, POST /api/billing/checkout and redirect
//           if logged out, route to /signup?plan=<id> and pick up post-signup
function PricingCta({ tier }: { tier: Tier }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (tier.planId === "free") {
    return (
      <Button asChild className="w-full" variant="secondary">
        <Link href="/signup">Sign up free</Link>
      </Button>
    );
  }

  const onUpgrade = async () => {
    setBusy(true);
    try {
      const sb = createSupabaseBrowserClient();
      const { data } = await sb.auth.getUser();
      if (!data.user) {
        // Not signed in — route through signup; can re-upgrade after auth.
        router.push(`/signup?plan=${tier.planId}`);
        return;
      }
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: tier.planId }),
      });
      const body = await res.json();
      if (!res.ok || !body.url) {
        throw new Error(body?.error || "Could not start checkout");
      }
      window.location.href = body.url;
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
      setBusy(false);
    }
  };

  return (
    <Button
      onClick={onUpgrade}
      disabled={busy}
      className="w-full"
      variant={tier.featured ? "default" : "secondary"}
    >
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}
      {tier.featured ? "Upgrade now" : "Choose Agency"}
    </Button>
  );
}
