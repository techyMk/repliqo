import Link from "next/link";
import { ArrowRight, Zap, MessageSquare, TrendingUp, Activity } from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/dashboard/stat-tile";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { OnboardingCard } from "@/components/dashboard/onboarding-card";
import { DashboardEmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  // Headline counters — done as parallel queries.
  const [
    { count: activeAutomations },
    { count: dmsSent7d },
    { count: triggers7d },
    { data: recentLogs },
    { data: igAccounts },
    { count: automationsCount },
    { count: firedCount },
    { data: profile },
  ] = await Promise.all([
    supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "active"),
    supabase
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "dm_sent")
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
    supabase
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "comment_received")
      .gte("created_at", new Date(Date.now() - 7 * 86400_000).toISOString()),
    supabase
      .from("automation_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("instagram_accounts").select("*").eq("user_id", userId),
    supabase
      .from("automations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .neq("status", "archived"),
    supabase
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "dm_sent")
      .eq("status", "success"),
    supabase.from("profiles").select("onboarded_at").eq("id", userId).single(),
  ]);

  const conversionRate =
    (triggers7d || 0) > 0 ? ((dmsSent7d || 0) / (triggers7d || 1)) * 100 : 0;

  // No accounts connected → show the demo/real-IG empty state
  if (!igAccounts || igAccounts.length === 0) {
    return <DashboardEmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* Onboarding nudge — auto-hides once dismissed or all 3 steps done */}
      <OnboardingCard
        hasAccount={true}
        hasAutomation={(automationsCount ?? 0) > 0}
        hasFiredAutomation={(firedCount ?? 0) > 0}
        dismissed={Boolean(profile?.onboarded_at)}
      />

      <PageHeader
        eyebrow="Dashboard"
        title="Overview"
        description="Performance across all your connected Instagram accounts."
        actions={
          <Button asChild>
            <Link href="/dashboard/automations/new">
              New automation <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Active automations"
          value={activeAutomations ?? 0}
          icon={Zap}
          hint="across all accounts"
        />
        <StatTile
          label="DMs sent · 7d"
          value={dmsSent7d ?? 0}
          icon={MessageSquare}
          delta="+12.4%"
        />
        <StatTile
          label="Triggers · 7d"
          value={triggers7d ?? 0}
          icon={Activity}
          delta="+8.7%"
        />
        <StatTile
          label="DM conversion"
          value={`${conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          delta="+1.2pt"
        />
      </div>

      {/* Chart + activity */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Trigger performance</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Comments captured vs. DMs delivered, last 14 days.
              </p>
            </div>
            <Badge variant="muted" className="rounded-full">14 days</Badge>
          </CardHeader>
          <CardContent>
            <OverviewChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Latest comment triggers and DMs.</p>
          </CardHeader>
          <CardContent>
            <ActivityFeed logs={recentLogs ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

