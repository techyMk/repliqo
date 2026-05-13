import Link from "next/link";
import type { Metadata } from "next";
import {
  Sparkles,
  Instagram,
  Zap,
  ArrowRight,
  Mail,
  Github,
  ExternalLink,
  Command,
  Keyboard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { HelpFAQ } from "@/components/dashboard/help-faq";

export const metadata: Metadata = { title: "Help & docs" };

export default function HelpPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      <PageHeader
        eyebrow="Resources"
        title="Help & docs"
        description="Quick answers, keyboard shortcuts, and how to get in touch."
      />

      {/* Quick-start cards */}
      <section>
        <SectionLabel>Get started</SectionLabel>
        <div className="grid sm:grid-cols-3 gap-4">
          <StartCard
            icon={Sparkles}
            title="Load demo data"
            body="One-click seed populates your workspace with 3 automations and 30 days of activity. No Meta credentials needed."
            href="/dashboard"
            cta="Open dashboard"
          />
          <StartCard
            icon={Instagram}
            title="Connect Instagram"
            body="Sign in with your Business or Creator account to start automating real comments and DMs."
            href="/dashboard/accounts"
            cta="Connect account"
          />
          <StartCard
            icon={Zap}
            title="Build your first automation"
            body="Pick a template, add a keyword, write your DM. Live in under 2 minutes."
            href="/dashboard/automations/new"
            cta="Create automation"
          />
        </div>
      </section>

      {/* FAQ */}
      <section>
        <SectionLabel>Frequently asked</SectionLabel>
        <HelpFAQ />
      </section>

      {/* Keyboard shortcuts */}
      <section>
        <SectionLabel>Keyboard shortcuts</SectionLabel>
        <Card>
          <CardContent className="p-0 divide-y divide-white/[0.06]">
            {shortcuts.map((s) => (
              <div key={s.label} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{s.label}</span>
                </div>
                <Kbd>{s.keys}</Kbd>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Contact + external links */}
      <section>
        <SectionLabel>Need a human?</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Email support</CardTitle>
            </CardHeader>
            <CardContent className="text-[13px] text-muted-foreground leading-relaxed">
              Hit a bug, want a feature, or just stuck on setup — drop a line.
              Real human replies, usually within 24 hours.
              <div className="mt-3">
                <a
                  href="mailto:techymk.dev@gmail.com"
                  className="font-mono text-[13px] text-foreground/90 hover:text-brand-gradient transition-colors"
                >
                  techymk.dev@gmail.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Github className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Architecture & source</CardTitle>
            </CardHeader>
            <CardContent className="text-[13px] text-muted-foreground leading-relaxed">
              Repliqo is a portfolio project — the full source, schema, and
              deployment guide are open for reading.
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-1 text-[13px] text-foreground/85 hover:text-foreground"
                >
                  Changelog <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/security"
                  className="inline-flex items-center gap-1 text-[13px] text-foreground/85 hover:text-foreground"
                >
                  Security <ArrowRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/#faq"
                  className="inline-flex items-center gap-1 text-[13px] text-foreground/85 hover:text-foreground"
                >
                  Public FAQ <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Portfolio disclaimer */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-[12px] text-muted-foreground leading-relaxed">
        <div className="flex items-center gap-1.5 text-foreground/85">
          <Badge variant="muted" className="text-[10px] uppercase tracking-[0.18em]">
            Portfolio piece
          </Badge>
        </div>
        <p className="mt-3">
          Repliqo is built as a portfolio demonstration. Stripe runs in test mode (no real
          charges), and Meta App Review is not submitted — only test users you add in the Meta
          App Dashboard can connect real Instagram accounts. The whole stack is functional;
          just be aware that "going live" with paying customers requires standard Meta /
          Stripe activation work.
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-4">
      — {children}
    </h2>
  );
}

function StartCard({
  icon: Icon,
  title,
  body,
  href,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all p-5 flex flex-col"
    >
      <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center group-hover:border-[hsl(var(--brand-purple)/0.45)] transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed flex-1">{body}</p>
      <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-foreground/85 group-hover:text-foreground">
        {cta} <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-mono text-foreground/85">
      {children}
    </kbd>
  );
}

const shortcuts = [
  { icon: Command,  label: "Open command palette",        keys: "⌘K" },
  { icon: Keyboard, label: "Search across the app",       keys: "/" },
  { icon: Keyboard, label: "New automation",              keys: "N" },
  { icon: Keyboard, label: "Jump to Inbox",               keys: "I" },
  { icon: Keyboard, label: "Open this help page",         keys: "?" },
  { icon: Keyboard, label: "Sign out (from avatar menu)", keys: "—" },
];
