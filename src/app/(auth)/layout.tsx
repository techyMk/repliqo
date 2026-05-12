import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side — form */}
      <div className="flex flex-col">
        <header className="container py-6">
          <Link href="/" className="inline-flex items-center">
            <Logo />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <footer className="container py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Repliqo</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </footer>
      </div>

      {/* Right side — visual */}
      <div className="hidden lg:flex relative bg-[#0a0a0a] border-l border-white/[0.06] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-line-grid mask-radial opacity-50" />
        <div className="relative max-w-md text-center px-10 z-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] mb-6">
            <Logo showWordmark={false} />
          </div>
          <blockquote className="text-2xl font-medium tracking-tight gradient-text text-balance leading-snug">
            "Repliqo replaced three full-time DM responders. The ROI was obvious within a week."
          </blockquote>
          <div className="mt-6">
            <div className="text-sm font-medium">Iris Tan</div>
            <div className="text-xs text-muted-foreground">Founder, Northwave</div>
          </div>
        </div>
      </div>
    </div>
  );
}
