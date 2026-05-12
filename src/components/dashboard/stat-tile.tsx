import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCompact, cn } from "@/lib/utils";

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
  const formatted = typeof value === "number" ? formatCompact(value) : value;
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
