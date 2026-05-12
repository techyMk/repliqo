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
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Overview",    href: "/dashboard",            icon: LayoutDashboard },
  { label: "Automations", href: "/dashboard/automations", icon: Zap },
  { label: "Inbox",       href: "/dashboard/inbox",      icon: Inbox },
  { label: "Analytics",   href: "/dashboard/analytics",  icon: BarChart3 },
];

const settingsNav = [
  { label: "Accounts", href: "/dashboard/accounts", icon: PlugZap },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({
  className,
  igAccounts,
  onNavigate,
}: {
  className?: string;
  igAccounts: { id: string; username: string; profile_picture_url: string | null; status: string }[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-white/[0.06] bg-[#070707]",
        className
      )}
    >
      <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="inline-flex items-center" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
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
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
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
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 shrink-0" />
                <span className="truncate flex-1">@{a.username}</span>
                {a.status === "active" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                )}
              </Link>
            ))}
            <Link
              href="/dashboard/accounts"
              onClick={onNavigate}
              className="mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
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
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <Badge variant="muted" className="rounded-full text-[10px]">FREE PLAN</Badge>
          <div className="mt-2 text-xs text-muted-foreground">
            312 / 500 DMs used this month
          </div>
          <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-[62%] bg-white" />
          </div>
          <Link
            href="/dashboard/settings/billing"
            onClick={onNavigate}
            className="mt-3 inline-flex text-xs font-medium hover:underline underline-offset-2"
          >
            Upgrade →
          </Link>
        </div>
      </div>
    </aside>
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
        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
        active
          ? "bg-white/[0.08] text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2.5 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground/70">
      {children}
    </div>
  );
}
