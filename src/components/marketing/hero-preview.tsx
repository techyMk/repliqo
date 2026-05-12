"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, CheckCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";

// An animated, hand-rolled product preview. No screenshots needed — this is the
// hero centerpiece that shows the comment → auto-reply → DM cycle in motion.
export function HeroPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* outer glow frame */}
      <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-white/10 to-transparent" />
      <div className="relative rounded-[2rem] border border-white/10 bg-[#080808] p-3 sm:p-4 glow-ring">
        <div className="rounded-[1.6rem] border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
          {/* faux toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            </div>
            <Logo showWordmark={false} className="h-6 w-6 opacity-70" />
            <div className="text-[11px] text-muted-foreground tabular-nums">
              app.repliqo.io
            </div>
          </div>

          {/* split layout: IG post on the left, DM thread on the right */}
          <div className="grid lg:grid-cols-2 gap-px bg-white/[0.04]">
            <PostPanel />
            <DmPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostPanel() {
  return (
    <div className="bg-[#0a0a0a] p-6">
      <div className="text-xs text-muted-foreground mb-4 inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
        Live comment trigger
      </div>

      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
          <div className="text-sm font-medium">demo.creator</div>
          <div className="ml-auto text-[11px] text-muted-foreground">2m</div>
        </div>
        <div className="aspect-[4/5] bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-semibold tracking-tight gradient-text">
              The Drop
            </div>
            <div className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">
              Comment "link" to get it
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 px-3 py-2.5 text-foreground/80 border-b border-white/[0.06]">
          <Heart className="h-4 w-4" />
          <MessageCircle className="h-4 w-4" />
          <Send className="h-4 w-4" />
          <span className="ml-auto text-xs text-muted-foreground tabular-nums">
            1,284 likes
          </span>
        </div>

        <div className="p-3 space-y-2">
          {comments.map((c, i) => (
            <motion.div
              key={c.user + i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.5, duration: 0.4 }}
              className="text-xs flex gap-2"
            >
              <div className="h-5 w-5 rounded-full bg-zinc-800 border border-white/10 shrink-0" />
              <div>
                <span className="font-medium text-foreground/90">{c.user}</span>{" "}
                <span className="text-foreground/70">{c.text}</span>
                {c.replied && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.4 }}
                    className="mt-1 ml-3 pl-3 border-l border-white/10 text-foreground/60"
                  >
                    <span className="font-medium text-foreground/80">demo.creator</span>{" "}
                    <span>Sent! Check your DMs 📩</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DmPanel() {
  return (
    <div className="bg-[#0a0a0a] p-6">
      <div className="text-xs text-muted-foreground mb-4 inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        DM auto-sent
      </div>

      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
          <div className="text-sm font-medium">marisa.k</div>
          <div className="ml-auto text-[11px] text-muted-foreground">Now</div>
        </div>
        <div className="p-4 space-y-3 min-h-[440px] flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="self-end max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2 bg-white text-black text-sm"
          >
            link
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.4 }}
            className="self-start max-w-[85%] space-y-2"
          >
            <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-white/[0.06] border border-white/10 text-sm leading-relaxed">
              Hey marisa.k 👋 here's the drop you asked for — early access, limited stock.
            </div>
            <button className="rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] transition-colors w-full text-left px-3.5 py-2.5">
              <div className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Repliqo · Smart link
              </div>
              <div className="text-sm font-medium mt-0.5">Shop The Drop →</div>
              <div className="text-[11px] text-muted-foreground mt-1 truncate">
                shop.creator.com/the-drop
              </div>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="text-[10px] text-muted-foreground inline-flex items-center gap-1 self-start mt-1"
          >
            <CheckCheck className="h-3 w-3" /> Delivered · 0.4s
          </motion.div>

          <div className="mt-auto pt-4 grid grid-cols-3 gap-2">
            <StatTile label="Triggers" value="2,481" />
            <StatTile label="DMs sent" value="2,478" />
            <StatTile label="Reply rate" value="99.8%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
      </div>
      <div className="text-sm font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

const comments = [
  { user: "jay.designs", text: "looks 🔥" },
  { user: "marisa.k", text: "LINK please!", replied: true },
  { user: "ali_runs", text: "where's it from?" },
];
