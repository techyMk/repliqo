"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

export function FinalCTA() {
  return (
    <section className="py-28 md:py-40 border-b border-white/[0.05] relative overflow-hidden">
      {/* Aurora behind the CTA card for atmospheric depth */}
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="aurora h-[700px] w-[700px] animate-aurora-rotate opacity-50" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-line-grid mask-radial opacity-25" />

      <div className="container">
        <div className="relative max-w-4xl mx-auto rounded-[2.5rem] border border-white/[0.1] bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent p-10 md:p-20 text-center glow-ring">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] tracking-wider text-foreground/85">
            <LogoMark className="h-4 w-4" aria-hidden />
            <span>Live in under 5 minutes</span>
          </div>

          <h2 className="mt-7 text-display-sm gradient-text font-semibold text-balance">
            Reply once.
            <span className="font-display italic font-normal"> Automate </span>
            forever.
          </h2>
          <p className="mt-5 text-muted-foreground text-balance max-w-xl mx-auto leading-relaxed">
            Join 12,000+ creators automating their Instagram inbox. Free forever on the starter plan — no credit card.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Button asChild size="lg" className="min-w-[160px]">
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="min-w-[160px]">
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
