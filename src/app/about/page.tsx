import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "Why we built Repliqo and where we're going.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <section className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">About</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text text-balance">
            Reply once. Automate forever.
          </h1>

          <div className="mt-10 space-y-6 text-foreground/85 leading-relaxed">
            <p>
              Repliqo started because every creator we know has the same problem.
              A post goes viral, the comments fill up with "link?" — and the
              creator spends three days copy-pasting the same DM. The good ones
              hire an assistant. Everyone else loses the moment.
            </p>
            <p>
              Existing tools either felt like 2014 (clunky, ugly, built around
              Facebook Pages no one uses) or used grey-area APIs that get
              accounts banned. We wanted a third option: a modern, minimal,
              official-API-only tool that creators could trust with their
              audience.
            </p>
            <p>
              So we built one. The whole product runs on the new Instagram
              Login flow — no Facebook Page required. Webhooks for sub-second
              response. AES-256 encryption for every token. The kind of
              foundation we'd want if it were our own follower base.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            <Stat label="Creators using Repliqo" value="12,000+" />
            <Stat label="DMs delivered" value="42M" />
            <Stat label="Uptime · 90 days" value="99.97%" />
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/#pricing">See pricing</Link>
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
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
