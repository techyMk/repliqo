"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/brand/logo";
import { HeroPreview } from "./hero-preview";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      {/* Layered atmospheric background:
          1. line grid (faint)
          2. aurora (slow rotating conic gradient, heavy blur)
          3. top spotlight
          4. radial vignette mask softens edges */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-line-grid opacity-40 mask-radial" />
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="aurora h-[1200px] w-[1200px] animate-aurora-rotate opacity-60" />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[700px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]"
      />

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <Link href="#how" className="inline-block group">
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 hover:bg-white/[0.05] transition-colors">
              <LogoMark className="h-3.5 w-3.5" aria-hidden />
              <span className="text-[11px] tracking-wider">Now on the Instagram Login flow</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Badge>
          </Link>

          <h1 className="mt-7 text-display gradient-text font-semibold text-balance">
            Turn Instagram comments into
            <span className="font-display italic font-normal text-brand-gradient"> automated </span>
            sales.
          </h1>

          <p className="mt-7 text-[15px] sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance">
            Repliqo replies to comments and slides links into DMs the moment your audience asks.
            Reply once. Automate forever.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button asChild size="lg" className="group min-w-[160px]">
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="min-w-[160px]">
              <Link href="#how">See how it works</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse-soft" />
              Live in under 5 minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3" /> Sub-second response
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3" /> Official Instagram API
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 md:mt-24"
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}
