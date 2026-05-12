import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
            — {eyebrow}
          </div>
        )}
        <h1 className="text-3xl font-semibold tracking-tightest gradient-text leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
