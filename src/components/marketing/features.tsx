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
    <section id="features" className="py-24 md:py-32 border-b border-white/[0.05]">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Features</p>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance gradient-text">
            Everything you need to ship Instagram automations.
          </h2>
          <p className="mt-4 text-muted-foreground text-balance">
            Built for creators selling drops, course creators capturing leads, and agencies running
            dozens of accounts at once.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden border border-white/[0.08]">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group bg-[#0a0a0a] p-6 hover:bg-[#0d0d0d] transition-colors"
            >
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center mb-5 group-hover:bg-white/[0.08] transition-colors">
                <f.icon className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
