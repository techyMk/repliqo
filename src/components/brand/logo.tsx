import Image from "next/image";
import { cn } from "@/lib/utils";

// Repliqo brand mark.
//   <Logo />                          → wordmark (icon + "Repliqo" text)
//   <Logo showWordmark={false} />     → icon-only
//
// Both are PNGs in /public, served via next/image with explicit dims so they
// don't shift layout. The wordmark image is wide (~2.4:1); the icon is square.
export function Logo({
  className,
  showWordmark = true,
  iconClassName,
}: {
  className?: string;
  showWordmark?: boolean;
  iconClassName?: string;
}) {
  if (!showWordmark) {
    return <LogoMark className={cn("h-7 w-7", iconClassName, className)} />;
  }
  return (
    <Image
      src="/replico-logo.png"
      alt="Repliqo"
      width={420}
      height={180}
      priority
      className={cn("h-7 w-auto select-none", className)}
    />
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/replico-icon.png"
      alt="Repliqo"
      width={120}
      height={120}
      priority
      className={cn("h-7 w-7 select-none", className)}
    />
  );
}
