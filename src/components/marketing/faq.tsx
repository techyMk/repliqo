"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is this allowed by Instagram?",
    a: "Yes — Repliqo is built entirely on Meta's official Instagram API with Instagram Login. Your account stays in full compliance and we never use unofficial scraping or session cookies.",
  },
  {
    q: "Do I need a Facebook Page?",
    a: "No. We use the newer Instagram Login flow, which works directly with your Instagram Business or Creator account — no Facebook Page setup required.",
  },
  {
    q: "How fast does the DM go out?",
    a: "Sub-second. Most DMs are delivered under 500 ms of the comment being posted, thanks to webhooks and our queued processor.",
  },
  {
    q: "What about the 7-day private reply window?",
    a: "Repliqo handles it automatically. We track every comment-trigger window so we never send a DM after the 7-day Meta limit has passed.",
  },
  {
    q: "Will I get my account flagged for spam?",
    a: "Repliqo ships with per-automation rate caps, automatic opt-out language, and dedup logic — designed from day one to stay below Meta's spam thresholds.",
  },
  {
    q: "Can I cancel any time?",
    a: "Absolutely. No contracts, no annual lock-in. Cancel from your dashboard in one click.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-28 md:py-36 border-b border-white/[0.05]">
      <div className="container max-w-3xl">
        <div className="text-center">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— FAQ</p>
          <h2 className="mt-4 text-display-sm gradient-text font-semibold text-balance">
            Questions,
            <span className="font-display italic font-normal"> answered.</span>
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="px-6">
                <button
                  className="w-full flex items-center justify-between py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-base font-medium">{f.q}</span>
                  <Plus
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-45"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm text-muted-foreground leading-relaxed text-pretty">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
