import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCompact } from "@/lib/utils";

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
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="h-7 w-7 rounded-lg border border-white/10 bg-white/[0.04] inline-flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{formatted}</div>
        {delta && (
          <span className="text-xs text-emerald-400 tabular-nums">{delta}</span>
        )}
      </div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </Card>
  );
}
