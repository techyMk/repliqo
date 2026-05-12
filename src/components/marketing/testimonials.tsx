"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    body: "We hit 2,800 DMs in a single drop without lifting a finger. Repliqo replaced our ops intern.",
    author: "Iris Tan",
    role: "Founder, Northwave",
  },
  {
    body: "The follow gate alone added 7,000 followers in 90 days. Best DM tool we've used, and we've tried all of them.",
    author: "Marcus Lee",
    role: "Creator · 480k followers",
  },
  {
    body: "I manage 14 client accounts on Repliqo Agency and the dashboard is the only thing that stops me losing my mind.",
    author: "Sasha Vela",
    role: "Founder, Studio &",
  },
  {
    body: "Clean, fast, and the analytics actually answer the question 'which keyword sold the most product?'",
    author: "Jordan Kim",
    role: "DTC ops lead, Frame",
  },
];

export function Testimonials() {
  return (
    <section className="py-28 md:py-36 border-b border-white/[0.05]">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— Testimonials</p>
          <h2 className="mt-4 text-display-sm gradient-text font-semibold text-balance">
            Built for
            <span className="font-display italic font-normal"> serious </span>
            sellers.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-4">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.author}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7"
            >
              <blockquote className="text-base text-foreground/90 leading-relaxed text-balance">
                "{q.body}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
                <div>
                  <div className="text-sm font-medium">{q.author}</div>
                  <div className="text-xs text-muted-foreground">{q.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
