"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[13.5px] font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        // Primary — luminous white with refined inner highlight + drop shadow
        default:
          "bg-white text-black hover:bg-white/95 active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_-1px_0_rgba(0,0,0,0.08)_inset,0_8px_24px_-8px_rgba(255,255,255,0.20)]",
        // Secondary — glass surface with subtle inner highlight
        secondary:
          "bg-white/[0.06] text-foreground border border-white/10 hover:bg-white/[0.10] hover:border-white/15 active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]",
        ghost: "hover:bg-white/[0.06] text-foreground/90 hover:text-foreground active:scale-[0.98]",
        outline:
          "border border-white/15 bg-transparent text-foreground hover:bg-white/[0.05] hover:border-white/25 active:scale-[0.98]",
        destructive:
          "bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]",
        link: "text-foreground underline-offset-4 hover:underline rounded-md",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3.5 text-[12.5px]",
        lg: "h-12 px-7 text-[14px]",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
