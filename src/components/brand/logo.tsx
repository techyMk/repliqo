import Image from "next/image";
import { cn } from "@/lib/utils";

// Repliqo brand mark.
//   <Logo />                          → wordmark (icon + "Repliqo" text)
//   <Logo showWordmark={false} />     → icon-only
//
// Both are WebP files in /public, served via next/image with explicit dims so
// they don't shift layout. The wordmark image is wide (~2.4:1); the icon is square.
type CommonProps = {
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
};

export function Logo({
  className,
  showWordmark = true,
  iconClassName,
  ...rest
}: CommonProps & {
  showWordmark?: boolean;
  iconClassName?: string;
}) {
  if (!showWordmark) {
    return <LogoMark className={cn("h-7 w-7", iconClassName, className)} {...rest} />;
  }
  return (
    <Image
      src="/repliqo-logo.webp"
      alt="Repliqo"
      width={420}
      height={180}
      priority
      className={cn("h-7 w-auto select-none", className)}
      {...rest}
    />
  );
}

export function LogoMark({ className, ...rest }: CommonProps) {
  return (
    <Image
      src="/repliqo-icon.webp"
      alt="Repliqo"
      width={120}
      height={120}
      priority
      className={cn("h-7 w-7 select-none", className)}
      {...rest}
    />
  );
}
