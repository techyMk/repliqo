"use client";

import { motion } from "framer-motion";
import {
  MessageSquareReply,
  Lock,
  Zap,
  LineChart,
  Shield,
  Workflow,
  Inbox,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: MessageSquareReply,
    title: "Keyword triggers",
    body: "Reply publicly and DM privately the instant someone comments your keyword. Exact, contains, or starts-with match modes.",
  },
  {
    icon: Lock,
    title: "Follow gate",
    body: "Release the link only if the commenter follows you. A single-tap button unlocks the DM.",
  },
  {
    icon: Workflow,
    title: "Workflow builder",
    body: "Stack delays, conditions, fallback messages — without writing a line of code.",
  },
  {
    icon: LineChart,
    title: "Conversion analytics",
    body: "Track reply rate, DM open rate, follower lift, and which keywords convert the best.",
  },
  {
    icon: Inbox,
    title: "Unified inbox",
    body: "Every triggered DM, reply, and failed attempt — in one searchable, exportable timeline.",
  },
  {
    icon: Zap,
    title: "Sub-second response",
    body: "Webhook-driven. Most DMs go out in under 500 ms of the comment being posted.",
  },
  {
    icon: Shield,
    title: "Spam-safe by default",
    body: "Per-automation rate caps, opt-out language, and dedup logic to stay on Meta's good side.",
  },
  {
    icon: Bot,
    title: "Official API",
    body: "Built on the Instagram API with Instagram Login. No grey-area scraping or session tokens.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-28 md:py-36 border-b border-white/[0.05] relative">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— Features</p>
          <h2 className="mt-4 text-display-sm gradient-text font-semibold text-balance">
            Everything you need to ship
            <span className="font-display italic font-normal text-brand-gradient"> Instagram </span>
            automations.
          </h2>
          <p className="mt-5 text-muted-foreground text-balance leading-relaxed">
            Built for creators selling drops, course creators capturing leads, and agencies running
            dozens of accounts at once.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.08]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group relative bg-background p-7 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between mb-7">
                <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center group-hover:bg-white/[0.08] group-hover:border-white/20 transition-all">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] tabular-nums tracking-widest text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
