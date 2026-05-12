import type { Metadata } from "next";
import { Mail, MessageCircle, Shield, Building2 } from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Repliqo team.",
};

const channels = [
  {
    icon: MessageCircle,
    title: "Support",
    body: "Stuck on a setup step or seeing weird behavior? We answer every email in under 24 hours.",
    email: "hello@repliqo.app",
  },
  {
    icon: Shield,
    title: "Security",
    body: "Found a vulnerability or have a question about how we handle tokens? Mail us — we respond within 1 business day.",
    email: "security@repliqo.app",
  },
  {
    icon: Building2,
    title: "Sales",
    body: "Running 5+ accounts or need a custom plan? We'll set up a demo.",
    email: "sales@repliqo.app",
  },
  {
    icon: Mail,
    title: "Privacy",
    body: "Data deletion, export, or anything covered by our privacy policy.",
    email: "privacy@repliqo.app",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <MarketingNav />
      <section className="pt-32 pb-20">
        <div className="container max-w-3xl">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Contact</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight gradient-text">
            Talk to a human.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl">
            No chatbot, no support tickets. Pick the right inbox below and a
            real teammate will reply.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {channels.map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all p-6"
              >
                <div className="h-9 w-9 rounded-xl border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
                  <c.icon className="h-4 w-4" />
                </div>
                <h2 className="mt-4 text-base font-semibold tracking-tight">{c.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                <div className="mt-4 text-sm font-mono text-foreground/85 group-hover:text-foreground transition-colors">
                  {c.email}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </main>
  );
}
