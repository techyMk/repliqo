"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Why don't I see real DMs being sent in demo mode?",
    a: "Demo mode populates your workspace with realistic data but never touches Meta. The fake Instagram account is flagged internally (its id starts with `demo_`), so the media-picker, token refresh job, and message dispatcher all short-circuit for it. To send real DMs, connect a real Instagram account from the Accounts page.",
  },
  {
    q: "What happens when I click 'Upgrade'?",
    a: "You're sent to a real Stripe Checkout page. Stripe is in TEST mode — use card `4242 4242 4242 4242` with any future expiry and any CVC. After subscribing, a webhook fires and your plan flips from Free to Growth (or Agency). No real charges are made. Manage your subscription any time from Settings → Plan & billing.",
  },
  {
    q: "Why am I rate-limited?",
    a: "Each automation has a per-hour DM cap (default 200/hr) to stay below Meta's spam thresholds. When the cap is reached, new triggers log a `rate_limited` event and are skipped until the window resets. Adjust the cap in your automation's settings.",
  },
  {
    q: "How do I switch from demo data back to a real Instagram account?",
    a: "Go to Accounts, find the demo account, click Manage → Disconnect. That removes the demo IG row and all its associated automations and logs (cascade delete). Then click Connect Instagram to start fresh.",
  },
  {
    q: "What's the difference between an automation being 'paused' vs 'archived'?",
    a: "Paused means it's temporarily off — counters and history are preserved, and you can re-activate any time. Archived is a soft-delete — the automation stops firing and is hidden from the main list, but its logs and analytics remain intact for reporting. You can't currently un-archive from the UI; do it via SQL if you really need to.",
  },
  {
    q: "Where do I see what triggered each DM?",
    a: "Inbox shows every event — comment received, reply sent, DM sent, follow gate sent/passed, errors, and rate-limited skips. Filter by Failed or Follow gates with the tabs at the top. Each row links back to the source automation.",
  },
  {
    q: "What scopes does Repliqo request from Instagram?",
    a: "Three: `instagram_business_basic` (read profile + media), `instagram_business_manage_messages` (send DMs), `instagram_business_manage_comments` (reply to comments). Repliqo never sees your password — auth runs through Meta's official OAuth flow.",
  },
  {
    q: "How are my Instagram tokens stored?",
    a: "Every long-lived token is AES-256-GCM encrypted before being written to Postgres. The encryption key lives in server env vars only — never bundled, never logged. Tokens auto-refresh via a daily cron job before they expire (60-day lifetime).",
  },
];

export function HelpFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="px-5">
            <button
              className="w-full flex items-center justify-between py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="text-[14px] font-medium pr-3">{f.q}</span>
              <Plus
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform shrink-0",
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
                  <p className="pb-4 text-[13px] text-muted-foreground leading-relaxed text-pretty">
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
