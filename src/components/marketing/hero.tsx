"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* background grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-line-grid mask-radial opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]"
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <Link href="#how" className="inline-block">
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 hover:bg-white/[0.04] transition-colors">
              <Sparkles className="h-3 w-3" />
              <span className="text-[11px] tracking-wide">New · Instagram Login flow</span>
              <ArrowRight className="h-3 w-3" />
            </Badge>
          </Link>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance gradient-text leading-[1.05]">
            Turn Instagram comments into automated sales.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Repliqo replies to comments and slides links into DMs the moment your audience asks.
            Reply once. Automate forever.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="group">
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#how">See how it works</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3" /> Live in under 5 minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3" /> Official Instagram API
            </span>
            <span>No credit card required</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 md:mt-20"
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}
