"use client";

import { Menu, Search, LogOut, User, Settings as Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Topbar({
  profile,
  onOpenMenu,
  onOpenPalette,
}: {
  profile: any;
  onOpenMenu: () => void;
  onOpenPalette: () => void;
}) {
  const router = useRouter();
  const initials =
    profile?.full_name
      ?.split(" ")
      .map((s: string) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
    profile?.email?.[0]?.toUpperCase() ||
    "R";

  const signOut = async () => {
    const sb = createSupabaseBrowserClient();
    await sb.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
      <div className="container h-16 flex items-center gap-3">
        <button
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={onOpenPalette}
          className="flex-1 max-w-md flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors px-3 py-2 text-sm text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search or run a command</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono">
            <span>⌘</span>K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex" asChild>
            <a href="/dashboard/automations/new">New automation</a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-white/30">
                <Avatar>
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-sm font-medium text-foreground">{profile?.full_name || "Account"}</div>
                <div className="text-xs text-muted-foreground truncate">{profile?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings">
                  <User className="h-4 w-4" /> Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings/billing">
                  <Cog className="h-4 w-4" /> Billing
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
