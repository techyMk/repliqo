"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Sparkles, Zap, Loader2, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Two-track empty state: a recruiter / portfolio viewer can seed demo data
// in one click. A real user can connect their Instagram via OAuth.
export function DashboardEmptyState() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);

  const onSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/demo/seed", { method: "POST" });
      const body = await res.json();
      if (!res.ok || !body.seeded) {
        throw new Error(body?.reason || "Could not seed demo data");
      }
      toast.success("Demo data ready");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="aurora h-[600px] w-[600px] animate-aurora-rotate opacity-50" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid mask-radial opacity-30" />

      <div className="w-full max-w-3xl">
        <div className="text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] mb-6 glow-ring">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-display-sm font-semibold gradient-text text-balance">
            Welcome to
            <span className="font-display italic font-normal"> Repliqo</span>
          </h2>
          <p className="mt-3 text-[13px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            Pick a path below. Either way you'll be inside the product in a few
            seconds.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {/* Card 1 — Demo data */}
          <Card className="relative overflow-hidden p-6 border-white/[0.12] bg-gradient-to-b from-white/[0.06] to-transparent">
            <div className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-foreground/80">
              <Sparkles className="h-3 w-3" />
              Recommended
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight">
              Try the demo
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Populate your workspace with a fake Instagram account, three live
              automations, and 30 days of activity. Explore every screen without
              connecting a real account.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <li>• Live charts, inbox, follow gate flow</li>
              <li>• Removable any time from settings</li>
              <li>• Doesn't call Meta or send any real DMs</li>
            </ul>
            <Button
              className="mt-6 w-full"
              onClick={onSeed}
              disabled={seeding}
            >
              {seeding && <Loader2 className="h-4 w-4 animate-spin" />}
              Load demo data <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Card 2 — Real Instagram */}
          <Card className="p-6">
            <div className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-muted-foreground">
              <Instagram className="h-3 w-3" />
              The real thing
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight">
              Connect Instagram
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Sign in with your Instagram Business or Creator account to start
              automating comments and DMs for real.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
              <li>• Personal accounts not supported</li>
              <li>• Read profile, send DMs, reply to comments</li>
              <li>• Tokens encrypted at rest</li>
            </ul>
            <Button variant="secondary" className="mt-6 w-full" asChild>
              <Link href="/api/auth/instagram?return_to=/dashboard">
                <Instagram className="h-4 w-4" /> Connect Instagram
              </Link>
            </Button>
          </Card>
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          You can switch between demo data and a real account any time from{" "}
          <Link href="/dashboard/accounts" className="underline underline-offset-2 hover:text-foreground">
            Connected accounts
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
