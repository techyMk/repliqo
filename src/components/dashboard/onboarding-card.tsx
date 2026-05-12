"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Instagram, Sparkles, Zap, ArrowRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoMark } from "@/components/brand/logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function OnboardingCard({
  hasAccount,
  hasAutomation,
  hasFiredAutomation,
  dismissed,
}: {
  hasAccount: boolean;
  hasAutomation: boolean;
  hasFiredAutomation: boolean;
  dismissed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [hidden, setHidden] = useState(dismissed);

  const allDone = hasAccount && hasAutomation && hasFiredAutomation;

  // When the user completes all three steps, persist onboarded_at automatically
  // so the card stays gone on the next visit. Guarded with a ref so it only
  // fires once per mount.
  const marked = useRef(false);
  useEffect(() => {
    if (!allDone || dismissed || marked.current) return;
    marked.current = true;
    (async () => {
      const sb = createSupabaseBrowserClient();
      const { data } = await sb.auth.getUser();
      if (!data.user) return;
      await sb
        .from("profiles")
        .update({ onboarded_at: new Date().toISOString() })
        .eq("id", data.user.id);
    })();
  }, [allDone, dismissed]);

  if (hidden || allDone) return null;

  const completed = [hasAccount, hasAutomation, hasFiredAutomation].filter(Boolean).length;
  const pct = Math.round((completed / 3) * 100);

  const dismiss = () => {
    setHidden(true);
    startTransition(async () => {
      const sb = createSupabaseBrowserClient();
      const { data } = await sb.auth.getUser();
      if (data.user) {
        await sb
          .from("profiles")
          .update({ onboarded_at: new Date().toISOString() })
          .eq("id", data.user.id);
        router.refresh();
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden p-0">
        <div
          aria-hidden
          className="absolute inset-0 bg-line-grid opacity-30 mask-radial pointer-events-none"
        />
        <div className="relative p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="outline" className="gap-1.5 rounded-full">
                <LogoMark className="h-4 w-4" aria-hidden /> Get started
              </Badge>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">
                Welcome to Repliqo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground max-w-md">
                Three steps to your first automated DM. Most teams finish in under 5 minutes.
              </p>
            </div>
            <button
              onClick={dismiss}
              disabled={pending}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
              aria-label="Dismiss onboarding"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {completed} / 3
            </span>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <Step
              done={hasAccount}
              icon={Instagram}
              label="Connect Instagram"
              hint="Sign in with your Business/Creator account"
              href="/api/auth/instagram?return_to=/dashboard"
              cta="Connect"
            />
            <Step
              done={hasAutomation}
              icon={Zap}
              label="Create an automation"
              hint="Pick a template or start blank"
              href="/dashboard/automations/new"
              cta="Create"
              disabled={!hasAccount}
            />
            <Step
              done={hasFiredAutomation}
              icon={Sparkles}
              label="Test your first trigger"
              hint="Comment your keyword from another account"
              href="/dashboard/inbox"
              cta="See live events"
              disabled={!hasAutomation}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Step({
  done,
  icon: Icon,
  label,
  hint,
  href,
  cta,
  disabled,
}: {
  done: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
  href: string;
  cta: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        done
          ? "border-emerald-500/30 bg-emerald-500/[0.04]"
          : disabled
            ? "border-white/[0.06] bg-white/[0.01] opacity-60"
            : "border-white/[0.1] bg-white/[0.03]"
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-8 w-8 rounded-lg border inline-flex items-center justify-center",
            done
              ? "border-emerald-500/40 bg-emerald-500/[0.1] text-emerald-300"
              : "border-white/10 bg-white/[0.04]"
          )}
        >
          {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </div>
        <div className="text-sm font-medium">{label}</div>
      </div>
      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{hint}</p>
      {!done && (
        <Button
          asChild
          variant={disabled ? "ghost" : "secondary"}
          size="sm"
          className="mt-3"
          disabled={disabled}
        >
          <Link href={disabled ? "#" : href} aria-disabled={disabled}>
            {cta} <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      )}
    </div>
  );
}
