"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Two aurora layers — back one rotates slowly, front one pulses.
          Combined they read as living atmosphere, not graphics. */}
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="aurora h-[820px] w-[820px] animate-aurora-rotate opacity-60" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="aurora h-[520px] w-[520px] animate-halo-pulse opacity-80" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-dot-grid mask-radial opacity-30" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Soft brand halo behind the icon — pulses */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 m-auto h-44 w-44 rounded-[2.5rem] blur-2xl animate-halo-pulse"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, hsl(var(--brand-purple) / 0.55), hsl(var(--brand-pink) / 0.30), transparent 70%)",
          }}
        />
        {/* Floating frame containing the icon — bobs up/down on a 4.5s loop */}
        <div className="inline-flex h-44 w-44 items-center justify-center rounded-[2.25rem] border border-white/10 bg-white/[0.03] backdrop-blur-sm glow-ring animate-float">
          <LogoMark className="h-32 w-32 drop-shadow-[0_0_28px_hsl(var(--brand-purple)/0.5)]" />
        </div>
      </motion.div>

      {/* 404 digits — gradient pans horizontally for a "living text" effect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 text-[6.5rem] sm:text-[9rem] leading-none font-semibold tracking-tightest tabular-nums"
        style={{
          backgroundImage:
            "linear-gradient(90deg, hsl(var(--brand-pink)), hsl(var(--brand-purple)) 40%, hsl(var(--brand-blue)) 70%, hsl(var(--brand-purple)) 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          animation: "gradient-pan 6s ease-in-out infinite",
        }}
      >
        404
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tightest text-balance"
      >
        Page
        <span className="font-display italic font-normal text-brand-gradient"> not </span>
        found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-3 text-[13px] text-muted-foreground max-w-sm leading-relaxed"
      >
        The page you're looking for has moved or doesn't exist. Let's get you back somewhere useful.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex items-center gap-2"
      >
        <Button asChild className="group">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </motion.div>
    </main>
  );
}
