"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try the full product on one account.",
    cta: "Start free",
    href: "/signup",
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
    price: "$29",
    period: "/ month",
    description: "For creators and small brands ready to scale.",
    cta: "Start 14-day trial",
    href: "/signup?plan=growth",
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
    price: "$99",
    period: "/ month",
    description: "For agencies managing multiple clients.",
    cta: "Book a demo",
    href: "/signup?plan=agency",
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
              <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">
                {t.description}
              </p>
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
                <Button
                  asChild
                  className="w-full"
                  variant={t.featured ? "default" : "secondary"}
                >
                  <Link href={t.href}>{t.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
