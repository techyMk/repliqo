"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  Inbox,
  BarChart3,
  PlugZap,
  Settings,
  Plus,
  HelpCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-xl overflow-hidden">
        {/* sr-only — Radix requires a title for accessibility but we don't show one */}
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Search the app or run a command. Use the arrow keys to navigate, Enter to select.
        </DialogDescription>
        <Command label="Command Palette" className="bg-transparent">
          <Command.Input
            placeholder="Search or type a command…"
            className="w-full px-5 py-4 bg-transparent text-sm placeholder:text-muted-foreground/60 outline-none border-b border-white/[0.08]"
          />
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results.
            </Command.Empty>

            <Command.Group heading="Navigate" className="text-[10px] uppercase tracking-widest text-muted-foreground/70 px-2 pb-1 pt-2">
              <Item onSelect={() => go("/dashboard")} icon={LayoutDashboard} label="Overview" />
              <Item onSelect={() => go("/dashboard/automations")} icon={Zap} label="Automations" shortcut="A" />
              <Item onSelect={() => go("/dashboard/inbox")} icon={Inbox} label="Inbox" shortcut="I" />
              <Item onSelect={() => go("/dashboard/analytics")} icon={BarChart3} label="Analytics" />
              <Item onSelect={() => go("/dashboard/accounts")} icon={PlugZap} label="Connected accounts" />
              <Item onSelect={() => go("/dashboard/settings")} icon={Settings} label="Settings" />
            </Command.Group>

            <Command.Group heading="Actions" className="text-[10px] uppercase tracking-widest text-muted-foreground/70 px-2 pb-1 pt-3">
              <Item onSelect={() => go("/dashboard/automations/new")} icon={Plus} label="New automation" shortcut="N" />
              <Item onSelect={() => go("/dashboard/accounts")} icon={PlugZap} label="Connect Instagram account" />
              <Item onSelect={() => go("/dashboard/help")} icon={HelpCircle} label="Help & docs" shortcut="?" />
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function Item({
  icon: Icon,
  label,
  shortcut,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut?: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer aria-selected:bg-white/[0.06] aria-selected:text-foreground transition-colors"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="flex-1">{label}</span>
      {shortcut && (
        <kbd className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
          {shortcut}
        </kbd>
      )}
    </Command.Item>
  );
}
