"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 border-b border-white/[0.05] relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-line-grid mask-radial opacity-30"
      />
      <div className="container">
        <div className="relative max-w-4xl mx-auto rounded-[2rem] border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-transparent p-10 md:p-16 text-center glow-ring">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance gradient-text">
            Reply once. Automate forever.
          </h2>
          <p className="mt-4 text-muted-foreground text-balance max-w-xl mx-auto">
            Join 12,000+ creators automating their Instagram inbox. Live in under 5 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
