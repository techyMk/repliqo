import Link from "next/link";
import { notFound } from "next/navigation";
import { Zap, ArrowLeft } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/dashboard/stat-tile";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { AutomationDetailActions } from "@/components/automation/detail-actions";
import { formatCompact, relativeTime } from "@/lib/utils";
import { MessageSquare, Send, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AutomationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  const { data: automation } = await supabase
    .from("automations")
    .select("*, automation_keywords(keyword)")
    .eq("id", id)
    .eq("user_id", userData.user!.id)
    .single();

  if (!automation) notFound();

  const { data: logs } = await supabase
    .from("automation_logs")
    .select("*")
    .eq("automation_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const keywords = automation.automation_keywords.map((k: any) => k.keyword);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/automations" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> Back to automations
        </Link>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{automation.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <StatusPill status={automation.status} />
              <span>·</span>
              <span>Updated {relativeTime(automation.updated_at)}</span>
            </div>
          </div>
          <AutomationDetailActions id={automation.id} status={automation.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Triggers" value={automation.triggers_count} icon={MessageSquare} />
        <StatTile label="Replies sent" value={automation.replies_sent_count} icon={Zap} />
        <StatTile label="DMs sent" value={automation.dms_sent_count} icon={Send} />
        <StatTile
          label="Conversion"
          value={
            automation.triggers_count > 0
              ? `${((automation.dms_sent_count / automation.triggers_count) * 100).toFixed(1)}%`
              : "—"
          }
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Mode">
              <code className="text-foreground/85 font-mono">{automation.match_mode}</code>
            </Row>
            <Row label="Case sensitive">
              {automation.case_sensitive ? "Yes" : "No"}
            </Row>
            <Row label="Keywords">
              <div className="flex flex-wrap gap-1.5 justify-end">
                {keywords.map((k: string) => (
                  <Badge key={k}>{k}</Badge>
                ))}
              </div>
            </Row>
            <Row label="Post">
              {automation.post_id || <span className="text-muted-foreground">Any post</span>}
            </Row>
            <Row label="Rate limit">
              {formatCompact(automation.rate_limit_per_hour)} / hour
            </Row>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Comment reply</div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2">
                {automation.comment_reply || <span className="text-muted-foreground">—</span>}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">DM message</div>
              <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 whitespace-pre-wrap">
                {automation.dm_message}
              </div>
            </div>
            {automation.follow_gate_enabled && (
              <Row label="Follow gate"><Badge variant="success">Enabled</Badge></Row>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed logs={logs ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "active") return <Badge variant="success">● Active</Badge>;
  if (status === "paused") return <Badge variant="warning">Paused</Badge>;
  if (status === "archived") return <Badge variant="muted">Archived</Badge>;
  return <Badge variant="muted">Draft</Badge>;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.04] pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}
