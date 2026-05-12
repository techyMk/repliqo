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
        <div aria-hidden className="absolute inset-0 bg-line-grid mask-radial opacity-40" />
        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
          <div className="aurora h-[600px] w-[600px] animate-aurora-rotate opacity-40" />
        </div>
        <div className="relative max-w-md text-center px-10 z-10">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] mb-7 glow-ring">
            <Logo showWordmark={false} className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-semibold tracking-tightest gradient-text text-balance leading-tight">
            Reply once.
            <span className="font-display italic font-normal text-brand-gradient"> Automate </span>
            forever.
          </h2>
          <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed text-balance">
            Instagram DM automation built on the official API. Sub-second response, encrypted tokens, real webhooks.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {[
              "Sub-second webhook → DM delivery",
              "AES-256-GCM token storage at rest",
              "Built on the official Instagram API",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[13px] text-foreground/85">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-blue))] shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
