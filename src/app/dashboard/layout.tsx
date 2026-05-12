import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";
import type { PlanTier } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  // Start of the current calendar month — used for the DMs-this-month sidebar counter.
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [{ data: profile }, { data: igAccounts }, { count: dmsThisMonth }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase
      .from("instagram_accounts")
      .select("id,username,profile_picture_url,status")
      .eq("user_id", data.user.id),
    supabase
      .from("automation_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", data.user.id)
      .eq("event_type", "dm_sent")
      .eq("status", "success")
      .gte("created_at", startOfMonth.toISOString()),
  ]);

  return (
    <DashboardShell
      profile={profile ?? null}
      igAccounts={igAccounts ?? []}
      plan={((profile?.plan as PlanTier) ?? "free")}
      dmsThisMonth={dmsThisMonth ?? 0}
    >
      {children}
    </DashboardShell>
  );
}
