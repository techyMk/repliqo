"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center -ml-1">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-1.5">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
        <button
          className="md:hidden p-2 -m-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      <div
        className={cn(
          "md:hidden border-t border-white/[0.05] overflow-hidden transition-[max-height,opacity] duration-300",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="secondary" size="sm" className="flex-1">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
