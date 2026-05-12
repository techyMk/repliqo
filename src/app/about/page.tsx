import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Why this project exists and how it's built.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <section className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">— About</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tightest gradient-text text-balance">
            Reply once.
            <span className="font-display italic font-normal text-brand-gradient"> Automate </span>
            forever.
          </h1>

          <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
            <p>
              Repliqo is a portfolio project — a production-grade SaaS that turns
              Instagram comments into automated DMs, built end-to-end against
              Meta's real APIs. Not a mockup, not a clone, not a clever landing
              page with broken buttons underneath.
            </p>
            <p>
              The motivation was simple. Existing comment-to-DM tools fall into
              two camps: clunky and dated, or grey-area scrapers that get
              accounts banned. I wanted to demonstrate a third option — a
              modern, minimal, official-API-only product designed the way a
              well-funded SaaS would design it, with the architecture to match.
            </p>
            <p>
              Under the hood: Next.js 15 App Router, Supabase with row-level
              security, AES-256-GCM token encryption, HMAC-verified webhooks,
              and an atomic counter scheme so two parallel comments never lose
              an increment. Every gotcha in Meta's documentation — the OAuth
              token base-URL flakiness, the 7-day private-reply window, the
              propagation race on comment replies — is handled in the code with
              comments at the call site explaining why.
            </p>
            <p>
              The marketing site uses Geist + Instrument Serif, fluid
              type-clamps, a hand-rolled aurora system tinted with the brand
              gradient, and zero copy-pasted shadcn CLI components. Every
              primitive (Button, Card, Dialog, …) is committed source under{" "}
              <code className="font-mono text-foreground/90">src/components/ui</code>.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            <Stat label="Production routes" value="27" />
            <Stat label="Postgres tables" value="8" />
            <Stat label="Encryption at rest" value="AES-256" />
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#features">See features</Link>
            </Button>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 surface-hover">
      <div className="text-2xl font-semibold tracking-tightest tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
