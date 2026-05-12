"use client";

import { motion } from "framer-motion";
import { Link2, Wand2, Sparkles } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Link2,
    title: "Connect Instagram",
    body: "Sign in with Instagram Login. Repliqo only reads what it needs and stores tokens encrypted at rest.",
  },
  {
    n: "02",
    icon: Wand2,
    title: "Build an automation",
    body: "Pick a post, add keywords, write the public reply and the DM. Optional follow gate in one click.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Watch it convert",
    body: "Every comment triggers a personalized DM in real-time. Track which keywords drive sales.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-28 md:py-36 border-b border-white/[0.05] relative">
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid mask-radial opacity-40" />
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— How it works</p>
          <h2 className="mt-4 text-display-sm gradient-text font-semibold text-balance">
            Live in
            <span className="font-display italic font-normal text-brand-gradient"> three </span>
            steps.
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-4 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 surface-hover overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
                  <s.icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] tabular-nums tracking-widest text-muted-foreground/70">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-7 text-base font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
