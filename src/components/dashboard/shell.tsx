"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";
import type { PlanTier } from "@/lib/types";

export function DashboardShell({
  children,
  profile,
  igAccounts,
  plan,
  dmsThisMonth,
}: {
  children: React.ReactNode;
  profile: any;
  igAccounts: { id: string; username: string; profile_picture_url: string | null; status: string }[];
  plan: PlanTier;
  dmsThisMonth: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Cmd/Ctrl+K to open the palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <Sidebar
        igAccounts={igAccounts}
        plan={plan}
        dmsThisMonth={dmsThisMonth}
        className="hidden lg:flex"
      />

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-72 transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar
            igAccounts={igAccounts}
            plan={plan}
            dmsThisMonth={dmsThisMonth}
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      </div>

      {/* Main */}
      <div className="lg:pl-64">
        <Topbar
          profile={profile}
          onOpenMenu={() => setMobileOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
        />
        <main className="container py-8">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
}
