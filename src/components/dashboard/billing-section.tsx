"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowUpRight, ExternalLink, Loader2, CreditCard, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PlanTier } from "@/lib/types";
import { PLANS } from "@/lib/stripe/plans";
import { useEffect } from "react";

export function BillingSection({
  plan,
  status,
  currentPeriodEnd,
  hasCustomer,
}: {
  plan: PlanTier;
  status: string | null;
  currentPeriodEnd: string | null;
  hasCustomer: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [busy, setBusy] = useState<"upgrade" | "portal" | null>(null);

  // Toast on return from Checkout
  useEffect(() => {
    const flag = params.get("billing");
    if (flag === "success") {
      toast.success("Subscription active. Welcome aboard.");
      router.replace("/dashboard/settings");
    } else if (flag === "cancelled") {
      toast.info("Checkout cancelled. No changes made.");
      router.replace("/dashboard/settings");
    }
  }, [params, router]);

  const planDef = PLANS[plan];
  const isPaid = plan === "growth" || plan === "agency";
  const periodEnd = currentPeriodEnd ? new Date(currentPeriodEnd) : null;

  const startCheckout = async (target: "growth" | "agency") => {
    setBusy("upgrade");
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: target }),
      });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) throw new Error(body?.error || `Checkout failed (${res.status})`);
      window.location.href = body.url;
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
      setBusy(null);
    }
  };

  const openPortal = async () => {
    setBusy("portal");
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !body.url) throw new Error(body?.error || `Could not open billing portal (${res.status})`);
      window.location.href = body.url;
    } catch (err: any) {
      toast.error(err.message || "Failed to open portal");
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Plan &amp; billing</CardTitle>
        <Badge variant="muted" className="uppercase tracking-widest text-[10px]">
          {plan}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground">
                Current plan
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-semibold tracking-tight">{planDef.name}</span>
                <span className="text-sm text-muted-foreground">
                  ${planDef.monthlyUsd}/mo
                </span>
              </div>
            </div>
            {status && status !== "active" && (
              <Badge variant={status === "past_due" ? "warning" : "muted"}>
                {status.replace(/_/g, " ")}
              </Badge>
            )}
            {status === "active" && <Badge variant="success">● Active</Badge>}
          </div>
          {periodEnd && isPaid && (
            <div className="mt-3 text-[11px] text-muted-foreground">
              Renews{" "}
              <time className="text-foreground/85">
                {periodEnd.toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
            <Limit label="Accounts" value={planDef.limits.ig_accounts} />
            <Limit label="Automations" value={planDef.limits.automations} />
            <Limit label="DMs / month" value={planDef.limits.dms_per_month} />
          </div>
        </div>

        {isPaid ? (
          <Button onClick={openPortal} disabled={busy !== null} variant="secondary" className="w-full sm:w-auto">
            {busy === "portal" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            Manage billing in Stripe
            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-[12px] text-muted-foreground">
              Upgrade to unlock unlimited automations, follow gates, and higher monthly DM caps.
              Stripe is in test mode — use card <code className="font-mono">4242 4242 4242 4242</code>.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => startCheckout("growth")} disabled={busy !== null}>
                {busy === "upgrade" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Upgrade to Growth · $29
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
              <Button onClick={() => startCheckout("agency")} disabled={busy !== null} variant="secondary">
                Agency · $99
              </Button>
            </div>
            {hasCustomer && (
              <Button onClick={openPortal} disabled={busy !== null} variant="ghost" size="sm">
                View invoices
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Limit({ label, value }: { label: string; value: number | "unlimited" }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
      <div className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums">
        {value === "unlimited" ? "∞" : Intl.NumberFormat("en").format(value)}
      </div>
    </div>
  );
}
