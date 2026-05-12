"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  BarChart3,
  Inbox,
  Settings,
  PlugZap,
  Instagram,
  Plus,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { cn, formatCompact } from "@/lib/utils";
import { PLANS } from "@/lib/stripe/plans";
import type { PlanTier } from "@/lib/types";

const nav = [
  { label: "Overview",    href: "/dashboard",             icon: LayoutDashboard },
  { label: "Automations", href: "/dashboard/automations", icon: Zap },
  { label: "Inbox",       href: "/dashboard/inbox",       icon: Inbox },
  { label: "Analytics",   href: "/dashboard/analytics",   icon: BarChart3 },
];

const settingsNav = [
  { label: "Accounts", href: "/dashboard/accounts", icon: PlugZap },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({
  className,
  igAccounts,
  plan,
  dmsThisMonth,
  onNavigate,
}: {
  className?: string;
  igAccounts: { id: string; username: string; profile_picture_url: string | null; status: string }[];
  plan: PlanTier;
  dmsThisMonth: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/[0.06] bg-[#070708]",
        className
      )}
    >
      <div className="h-20 flex items-center px-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="inline-flex items-center" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-7">
        <div>
          <SidebarSectionLabel>Workspace</SidebarSectionLabel>
          <div className="space-y-0.5">
            {nav.map((item) => (
              <SidebarLink
                key={item.href}
                {...item}
                active={
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                }
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <div>
          <SidebarSectionLabel>Connected accounts</SidebarSectionLabel>
          <div className="space-y-0.5">
            {igAccounts.length === 0 && (
              <Link
                href="/dashboard/accounts"
                onClick={onNavigate}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <span>Connect Instagram</span>
              </Link>
            )}
            {igAccounts.map((a) => (
              <Link
                key={a.id}
                href={`/dashboard/accounts`}
                onClick={onNavigate}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 shrink-0" />
                <span className="truncate flex-1 text-foreground/85">@{a.username}</span>
                {a.status === "active" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
                )}
              </Link>
            ))}
            <Link
              href="/dashboard/accounts"
              onClick={onNavigate}
              className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground/80 hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add account
            </Link>
          </div>
        </div>

        <div>
          <SidebarSectionLabel>Settings</SidebarSectionLabel>
          <div className="space-y-0.5">
            {settingsNav.map((item) => (
              <SidebarLink
                key={item.href}
                {...item}
                active={pathname.startsWith(item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <PlanTile plan={plan} dmsThisMonth={dmsThisMonth} onNavigate={onNavigate} />
      </div>
    </aside>
  );
}

function PlanTile({
  plan,
  dmsThisMonth,
  onNavigate,
}: {
  plan: PlanTier;
  dmsThisMonth: number;
  onNavigate?: () => void;
}) {
  const def = PLANS[plan];
  const cap = def.limits.dms_per_month;
  const pct = Math.min(100, Math.round((dmsThisMonth / cap) * 100));
  const isFreeOrStarter = plan === "free" || plan === "starter";

  return (
    <div className="relative rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.05] to-transparent p-4 overflow-hidden">
      <LogoMark
        className="absolute -right-4 -top-4 h-24 w-24 opacity-25 pointer-events-none"
        aria-hidden
      />
      <div className="relative flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-foreground/80">
        {def.name} plan
      </div>
      <div className="mt-3 text-[13px] text-foreground/85 leading-tight">
        <span className="font-semibold tabular-nums">{formatCompact(dmsThisMonth)}</span>
        <span className="text-muted-foreground"> / {formatCompact(cap)} DMs this month</span>
      </div>
      <div className="mt-2.5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[hsl(var(--brand-pink))] via-[hsl(var(--brand-purple))] to-[hsl(var(--brand-blue))] shadow-[0_0_12px_hsl(var(--brand-purple)/0.5)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Link
        href="/dashboard/settings"
        onClick={onNavigate}
        className="mt-3 inline-flex text-[12px] font-medium text-foreground hover:underline underline-offset-4"
      >
        {isFreeOrStarter ? "Upgrade →" : "Manage plan →"}
      </Link>
    </div>
  );
}

function SidebarLink({
  label,
  href,
  icon: Icon,
  active,
  onNavigate,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
        active
          ? "bg-white/[0.07] text-foreground shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
      )}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-white"
        />
      )}
      <Icon className={cn("h-4 w-4", active ? "text-foreground" : "text-foreground/70")} />
      <span>{label}</span>
    </Link>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-2 text-[10px] tracking-[0.18em] uppercase text-muted-foreground/60 font-medium">
      {children}
    </div>
  );
}
