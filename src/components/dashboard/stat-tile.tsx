"use client";

import { useEffect, useRef, useState } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCompact, cn } from "@/lib/utils";

// Eased count-up — interpolates from 0 to target over ~900 ms with an
// ease-out cubic. Reaches the exact target value on the final frame.
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const startTs = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(target) || target === 0) {
      setValue(target);
      return;
    }
    startTs.current = null;
    const tick = (now: number) => {
      if (startTs.current == null) startTs.current = now;
      const t = Math.min(1, (now - startTs.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(t === 1 ? target : target * eased);
      if (t < 1) rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return value;
}

export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
  delta,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  delta?: string;
}) {
  const isNumeric = typeof value === "number";
  const counted = useCountUp(isNumeric ? value : 0);
  const formatted = isNumeric ? formatCompact(Math.round(counted)) : value;

  const deltaPositive = delta && !delta.trim().startsWith("-");
  const DeltaIcon = deltaPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="relative overflow-hidden p-5 surface-hover">
      <div className="flex items-start justify-between">
        <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground">{label}</div>
        <div className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <div className="text-3xl font-semibold tracking-tightest tabular-nums">{formatted}</div>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] tabular-nums font-medium",
              deltaPositive ? "text-emerald-400" : "text-red-400"
            )}
          >
            <DeltaIcon className="h-2.5 w-2.5" />
            {delta}
          </span>
        )}
      </div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </Card>
  );
}
