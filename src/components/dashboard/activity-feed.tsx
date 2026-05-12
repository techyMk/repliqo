import {
  MessageSquare,
  Send,
  Lock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import type { AutomationLog } from "@/lib/types";
import { relativeTime, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ActivityFeed({ logs }: { logs: AutomationLog[] }) {
  if (logs.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No activity yet. Once your first automation triggers, you'll see it here.
      </div>
    );
  }
  return (
    <ul className="space-y-1">
      {logs.map((l) => (
        <li
          key={l.id}
          className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03] transition-colors"
        >
          <div className={cn("h-8 w-8 shrink-0 rounded-lg border bg-white/[0.04] inline-flex items-center justify-center", iconBorder(l.event_type))}>
            {renderIcon(l.event_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm leading-tight">
              <span className="text-foreground/90">{label(l.event_type)}</span>
              {l.commenter_username && (
                <>
                  {" "}
                  <span className="text-muted-foreground">to</span>{" "}
                  <span className="font-medium">@{l.commenter_username}</span>
                </>
              )}
              {l.matched_keyword && (
                <>
                  {" "}
                  <span className="text-muted-foreground">·</span>{" "}
                  <span className="font-mono text-xs">{l.matched_keyword}</span>
                </>
              )}
            </div>
            {l.raw_comment_text && (
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                "{truncate(l.raw_comment_text, 80)}"
              </p>
            )}
            {l.error_message && (
              <p className="mt-0.5 text-xs text-red-400 truncate">
                {truncate(l.error_message, 80)}
              </p>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground tabular-nums shrink-0">
            {relativeTime(l.created_at)}
          </div>
        </li>
      ))}
    </ul>
  );
}

function label(event: AutomationLog["event_type"]) {
  switch (event) {
    case "comment_received":  return "New comment";
    case "reply_sent":        return "Replied";
    case "dm_sent":           return "DM sent";
    case "follow_gate_sent":  return "Follow gate sent";
    case "follow_gate_passed":return "Follow gate passed";
    case "rate_limited":      return "Rate limited";
    case "duplicate_skipped": return "Duplicate skipped";
    case "error":             return "Error";
  }
}

function renderIcon(event: AutomationLog["event_type"]) {
  switch (event) {
    case "comment_received":  return <MessageSquare className="h-3.5 w-3.5" />;
    case "reply_sent":        return <RefreshCw className="h-3.5 w-3.5" />;
    case "dm_sent":           return <Send className="h-3.5 w-3.5" />;
    case "follow_gate_sent":
    case "follow_gate_passed":return <Lock className="h-3.5 w-3.5" />;
    case "rate_limited":
    case "duplicate_skipped": return <RefreshCw className="h-3.5 w-3.5 text-amber-300" />;
    case "error":             return <AlertCircle className="h-3.5 w-3.5 text-red-400" />;
  }
}

function iconBorder(event: AutomationLog["event_type"]) {
  if (event === "error") return "border-red-500/30";
  if (event === "rate_limited" || event === "duplicate_skipped") return "border-amber-500/30";
  if (event === "dm_sent" || event === "follow_gate_passed") return "border-emerald-500/30";
  return "border-white/10";
}
