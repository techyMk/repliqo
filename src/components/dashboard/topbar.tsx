"use client";

import { Menu, Search, LogOut, User, Settings as Cog, Plus } from "lucide-react";
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
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/75 backdrop-blur-xl">
      <div className="container h-16 flex items-center gap-3">
        <button
          className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={onOpenPalette}
          className="group flex-1 max-w-md flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/[0.14] transition-all px-3 py-2 text-[13px] text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search or run a command</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-foreground/85">
            <span>⌘</span>K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" className="hidden sm:inline-flex" asChild>
            <a href="/dashboard/automations/new">
              <Plus className="h-3.5 w-3.5" />
              New automation
            </a>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                <Avatar>
                  {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <div className="text-[13px] font-medium text-foreground">{profile?.full_name || "Account"}</div>
                <div className="text-[11px] text-muted-foreground truncate mt-0.5">{profile?.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings">
                  <User className="h-4 w-4" /> Profile
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings">
                  <Cog className="h-4 w-4" /> Settings
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
