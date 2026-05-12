import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PageHeader } from "@/components/dashboard/page-header";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const [{ data: all }, { data: failed }, { data: gates }] = await Promise.all([
    supabase
      .from("automation_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("automation_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "failed")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("automation_logs")
      .select("*")
      .eq("user_id", userId)
      .in("event_type", ["follow_gate_sent", "follow_gate_passed"])
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Activity"
        title="Inbox"
        description="Every trigger, reply, DM, and failure — searchable timeline."
        actions={
          <Badge variant="muted" className="rounded-full">
            {all?.length ?? 0} events
          </Badge>
        }
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="gates">Follow gates</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="p-4">
            <ActivityFeed logs={all ?? []} />
          </Card>
        </TabsContent>
        <TabsContent value="gates">
          <Card className="p-4">
            <ActivityFeed logs={gates ?? []} />
          </Card>
        </TabsContent>
        <TabsContent value="failed">
          <Card className="p-4">
            <ActivityFeed logs={failed ?? []} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
