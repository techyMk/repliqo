"use client";

import { CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DMPreview({
  message,
  buttonLabel,
  buttonUrl,
  followGate,
  gateMessage,
  gateCTA,
  username,
}: {
  message?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  followGate?: boolean;
  gateMessage?: string;
  gateCTA?: string;
  username: string;
}) {
  const personalized = (message || "").replace(/\{username\}/g, "marisa.k");
  const gatePersonal = (gateMessage || "").replace(/\{username\}/g, username || "you");

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
        <div className="text-sm font-medium">@marisa.k</div>
        <div className="ml-auto text-[11px] text-muted-foreground">Preview</div>
      </div>
      <div className="p-4 space-y-3 min-h-[420px] bg-[#080808]">
        <div className="self-end ml-auto max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-white text-black text-sm">
          link
        </div>

        {followGate ? (
          <div className="max-w-[85%] space-y-2">
            <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-white/[0.06] border border-white/10 text-sm leading-relaxed">
              {gatePersonal || "Almost there! Follow first, then tap to unlock."}
            </div>
            <button
              type="button"
              className="rounded-xl border border-white/15 bg-white/[0.04] w-full text-left px-3.5 py-2.5"
            >
              <div className="text-sm font-medium">{gateCTA || "I'm following!"}</div>
            </button>
          </div>
        ) : (
          <div className="max-w-[85%] space-y-2">
            <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-white/[0.06] border border-white/10 text-sm leading-relaxed">
              {personalized || (
                <span className="text-muted-foreground">Your DM will appear here</span>
              )}
            </div>
            {buttonLabel && (
              <button
                type="button"
                className="rounded-xl border border-white/15 bg-white/[0.04] w-full text-left px-3.5 py-2.5"
              >
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Repliqo · Smart link
                </div>
                <div className="text-sm font-medium mt-0.5">{buttonLabel}</div>
                {buttonUrl && (
                  <div className="text-[11px] text-muted-foreground truncate">
                    {buttonUrl}
                  </div>
                )}
              </button>
            )}
          </div>
        )}

        <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
          <CheckCheck className="h-3 w-3" /> Delivered
        </div>
      </div>
    </Card>
  );
}
