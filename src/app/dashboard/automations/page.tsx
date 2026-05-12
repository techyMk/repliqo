import Link from "next/link";
import { Plus, Zap, Pause, Play, MoreHorizontal } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Automation } from "@/lib/types";
import { formatCompact, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AutomationsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const { data } = await supabase
    .from("automations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const automations = (data ?? []) as Automation[];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Workspace"
        title="Automations"
        description="Every comment-triggered DM you've configured."
        actions={
          <Button asChild>
            <Link href="/dashboard/automations/new">
              <Plus className="h-4 w-4" /> New automation
            </Link>
          </Button>
        }
      />

      {automations.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">No automations yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Create your first comment-to-DM automation in under a minute.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/dashboard/automations/new">
                <Plus className="h-4 w-4" /> Create automation
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="grid grid-cols-12 px-6 py-3 text-[11px] uppercase tracking-widest text-muted-foreground border-b border-white/[0.06]">
            <div className="col-span-5">Automation</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Triggers</div>
            <div className="col-span-2 text-right">DMs sent</div>
            <div className="col-span-1 text-right">Updated</div>
          </div>
          {automations.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/automations/${a.id}`}
              className="grid grid-cols-12 items-center px-6 py-4 border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <div className="col-span-5 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg border border-white/10 bg-white/[0.04] inline-flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {a.description || "No description"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <StatusBadge status={a.status} />
              </div>
              <div className="col-span-2 text-right text-sm tabular-nums">{formatCompact(a.triggers_count)}</div>
              <div className="col-span-2 text-right text-sm tabular-nums">{formatCompact(a.dms_sent_count)}</div>
              <div className="col-span-1 text-right text-xs text-muted-foreground tabular-nums">
                {relativeTime(a.updated_at)}
              </div>
            </Link>
          ))}
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Automation["status"] }) {
  if (status === "active") return <Badge variant="success">● Active</Badge>;
  if (status === "paused") return <Badge variant="warning">Paused</Badge>;
  if (status === "archived") return <Badge variant="muted">Archived</Badge>;
  return <Badge variant="muted">Draft</Badge>;
}
