"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const examples = [
  {
    tag: "Creator",
    title: "Drop a link without scrolling DMs",
    keyword: "link",
    reply: "Sent! Check your DMs 📩",
    dm: "Hey {username}, here's the link you asked for — limited stock.",
  },
  {
    tag: "Course creator",
    title: "Capture leads from every post",
    keyword: "course",
    reply: "Just DM'd you the syllabus ✨",
    dm: "Welcome! Free 7-day preview inside — drop your email and you're in.",
  },
  {
    tag: "Agency",
    title: "Qualify followers before they DM",
    keyword: "info",
    reply: "DM incoming!",
    dm: "Quick question — what platform are you building on? Pick one to see pricing.",
  },
];

export function AutomationExamples() {
  return (
    <section className="py-28 md:py-36 border-b border-white/[0.05]">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— Use cases</p>
          <h2 className="mt-4 text-display-sm gradient-text font-semibold text-balance">
            Built for the way creators
            <span className="font-display italic font-normal"> actually </span>
            sell.
          </h2>
        </div>

        <div className="mt-14 grid lg:grid-cols-3 gap-4">
          {examples.map((e, i) => (
            <motion.div
              key={e.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden"
            >
              <div className="p-6 border-b border-white/[0.06]">
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {e.tag}
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{e.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Trigger
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    <span className="text-xs text-muted-foreground">comment contains</span>
                    <span className="text-sm font-mono">{e.keyword}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    Public reply
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm">
                    {e.reply}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
                    DM
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm">
                    {e.dm}
                  </div>
                </div>
                <div className="pt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Steal this template</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
