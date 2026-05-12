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
    <section id="pricing" className="py-24 md:py-32 border-b border-white/[0.05]">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Pricing</p>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance gradient-text">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-muted-foreground text-balance">
            Start free. Upgrade when you outgrow it. Cancel any time.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={cn(
                "relative rounded-2xl border p-7 flex flex-col",
                t.featured
                  ? "border-white/20 bg-gradient-to-b from-white/[0.06] to-transparent glow-ring"
                  : "border-white/[0.08] bg-white/[0.02]"
              )}
            >
              {t.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white text-black text-[10px] font-semibold uppercase tracking-widest px-3 py-1">
                  Most popular
                </div>
              )}
              <div className="text-sm font-medium">{t.name}</div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <div className="text-4xl font-semibold tracking-tight">{t.price}</div>
                <div className="text-sm text-muted-foreground">{t.period}</div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t.description}
              </p>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-foreground/70 mt-0.5 shrink-0" />
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
