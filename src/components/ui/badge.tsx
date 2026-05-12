import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-white/[0.06] text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/[0.12] text-emerald-300",
        warning: "border-amber-500/30 bg-amber-500/[0.12] text-amber-300",
        danger: "border-red-500/30 bg-red-500/[0.12] text-red-300",
        muted: "border-white/10 bg-white/[0.03] text-muted-foreground",
        outline: "border-white/20 bg-transparent text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
