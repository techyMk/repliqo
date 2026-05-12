import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Atmospheric brand aurora */}
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="aurora h-[700px] w-[700px] animate-aurora-rotate opacity-50" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid mask-radial opacity-30" />

      <div className="relative">
        {/* Floating Repliqo icon as the visual anchor */}
        <div className="inline-flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] glow-ring">
          <LogoMark className="h-20 w-20" />
        </div>
      </div>

      <div className="mt-10 text-[7rem] sm:text-[9rem] leading-none font-semibold tracking-tightest gradient-text">
        404
      </div>
      <h1 className="mt-2 text-2xl font-semibold tracking-tightest text-balance">
        Page
        <span className="font-display italic font-normal text-brand-gradient"> not </span>
        found
      </h1>
      <p className="mt-3 text-[13px] text-muted-foreground max-w-sm leading-relaxed">
        The page you're looking for has moved or doesn't exist. Let's get you back somewhere useful.
      </p>
      <div className="mt-8 flex items-center gap-2">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
