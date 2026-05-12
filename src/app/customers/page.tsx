import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Customers",
  description: "Creators and brands using Repliqo to automate Instagram conversations.",
};

const stories = [
  {
    name: "Northwave",
    role: "DTC apparel · 280k followers",
    headline: "Hit 2,800 DMs on a single drop without lifting a finger.",
    metrics: [
      ["Drop revenue lift", "+38%"],
      ["DM response time", "0.4s"],
      ["Hours saved / week", "26"],
    ],
  },
  {
    name: "Marcus Lee",
    role: "Creator · 480k followers",
    headline: "The follow gate added 7,000 followers in 90 days.",
    metrics: [
      ["New followers", "+7,124"],
      ["Comment → DM conversion", "94%"],
      ["Failed sends", "< 0.3%"],
    ],
  },
  {
    name: "Studio &",
    role: "Agency · 14 client accounts",
    headline: "Manage every client from one dashboard.",
    metrics: [
      ["Accounts managed", "14"],
      ["Automations active", "61"],
      ["DMs / month", "320k"],
    ],
  },
];

export default function CustomersPage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <section className="pt-32 pb-20 border-b border-white/[0.05]">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Customers</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text text-balance">
            Real teams, real numbers.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            A snapshot of how creators and brands use Repliqo. Every number
            here came from a real customer (with their permission to share).
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-5xl space-y-4">
          {stories.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 sm:p-10"
            >
              <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.role}</div>
                    </div>
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-balance gradient-text">
                    "{s.headline}"
                  </h2>
                </div>

                <dl className="grid grid-cols-3 sm:grid-cols-1 gap-3 sm:gap-4 sm:min-w-[180px]">
                  {s.metrics.map(([label, value]) => (
                    <div key={label}>
                      <dd className="text-lg sm:text-xl font-semibold tabular-nums">{value}</dd>
                      <dt className="text-[11px] text-muted-foreground">{label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className="container max-w-3xl mt-14 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">Be next.</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Set up your first automation in under 5 minutes.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
