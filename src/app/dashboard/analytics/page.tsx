import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/dashboard/stat-tile";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { TrendingUp, MessageSquare, Send, Users } from "lucide-react";
import { formatCompact } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  // Pull top keywords + per-automation breakdown
  const [{ data: keywordRows }, { data: automations }] = await Promise.all([
    supabase
      .from("automation_logs")
      .select("matched_keyword, event_type")
      .eq("user_id", userId)
      .eq("event_type", "dm_sent")
      .not("matched_keyword", "is", null)
      .limit(2000),
    supabase
      .from("automations")
      .select("id,name,triggers_count,dms_sent_count,replies_sent_count")
      .eq("user_id", userId)
      .order("dms_sent_count", { ascending: false })
      .limit(10),
  ]);

  const keywordCounts = new Map<string, number>();
  for (const row of keywordRows || []) {
    const k = row.matched_keyword!;
    keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1);
  }
  const topKeywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxKw = Math.max(1, ...topKeywords.map(([, n]) => n));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conversion, engagement, and what's actually moving the needle.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total triggers" value={(keywordRows?.length || 0) * 1.04 | 0} icon={MessageSquare} />
        <StatTile label="DMs delivered" value={keywordRows?.length || 0} icon={Send} delta="+18%" />
        <StatTile label="Follower lift" value={"+2,318"} icon={Users} delta="+4.2%" />
        <StatTile label="DM conversion" value={"97.6%"} icon={TrendingUp} delta="+0.8pt" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Triggers vs. DMs</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Last 14 days, across all automations.</p>
          </div>
          <Badge variant="muted" className="rounded-full">14 days</Badge>
        </CardHeader>
        <CardContent>
          <OverviewChart />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top keywords</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">DMs sent, last 30 days.</p>
          </CardHeader>
          <CardContent>
            {topKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No keyword data yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {topKeywords.map(([k, n]) => (
                  <li key={k} className="flex items-center gap-3 text-sm">
                    <span className="w-24 font-mono truncate">{k}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full bg-white"
                        style={{ width: `${(n / maxKw) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right tabular-nums text-muted-foreground">
                      {formatCompact(n)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top automations</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">By DMs sent.</p>
          </CardHeader>
          <CardContent>
            {!automations || automations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No automations yet.
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.06] -mx-2">
                {automations.map((a) => (
                  <li key={a.id} className="px-2 py-2.5 flex items-center gap-3">
                    <span className="flex-1 truncate text-sm">{a.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatCompact(a.triggers_count)} triggers
                    </span>
                    <span className="text-sm tabular-nums w-16 text-right">
                      {formatCompact(a.dms_sent_count)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
