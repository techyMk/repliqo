import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every release, shipped publicly.",
};

const releases = [
  {
    version: "0.6",
    date: "2026-05-08",
    tag: "Feature",
    title: "Post picker in the builder",
    body: "Pick any post on your connected Instagram account from a thumbnail grid. The automation only fires on comments under that post.",
  },
  {
    version: "0.5",
    date: "2026-04-22",
    tag: "Feature",
    title: "Template gallery",
    body: "Six curated starting points — Product drop, Follow gate, Course signup, Free guide, Link in bio, Qualify a lead — that pre-fill the builder.",
  },
  {
    version: "0.4",
    date: "2026-04-11",
    tag: "Reliability",
    title: "Atomic counter updates",
    body: "Dashboard counters now use a Postgres function to avoid lost increments when two webhook events arrive simultaneously.",
  },
  {
    version: "0.3",
    date: "2026-03-30",
    tag: "Security",
    title: "Token refresh cron + key rotation path",
    body: "Long-lived Instagram tokens are now refreshed automatically every 24h. The same endpoint doubles as the path for rotating the encryption key.",
  },
  {
    version: "0.2",
    date: "2026-03-18",
    tag: "Feature",
    title: "Follow gate",
    body: "Send the link only if the commenter follows you. The follow check uses Meta's messaging-context API and falls back gracefully when the IGSID isn't yet in a conversation.",
  },
  {
    version: "0.1",
    date: "2026-03-04",
    tag: "Launch",
    title: "Repliqo is live",
    body: "First public release — Instagram Login OAuth, webhook-driven comment-to-DM automations, public reply, analytics, and inbox.",
  },
];

const tagVariant: Record<string, "default" | "success" | "warning" | "muted"> = {
  Feature: "default",
  Reliability: "muted",
  Security: "warning",
  Launch: "success",
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <section className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Changelog</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text">
            Every release, shipped publicly.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            We ship every week. Big features, small fixes — all of it lives here.
          </p>

          <div className="mt-14 relative">
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/[0.06]" aria-hidden />
            {releases.map((r) => (
              <article key={r.version} className="relative pl-10 pb-12 last:pb-0">
                <span
                  className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full border border-white/20 bg-background"
                  aria-hidden
                />
                <div className="flex items-center gap-2">
                  <Badge variant={tagVariant[r.tag] ?? "default"}>{r.tag}</Badge>
                  <span className="text-xs text-muted-foreground tabular-nums">v{r.version}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <time className="text-xs text-muted-foreground tabular-nums">{r.date}</time>
                </div>
                <h2 className="mt-2 text-lg font-semibold tracking-tight">{r.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {r.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
