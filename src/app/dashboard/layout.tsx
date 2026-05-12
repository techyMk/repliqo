import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  // Pull profile + connected IG accounts in one go.
  const [{ data: profile }, { data: igAccounts }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    supabase
      .from("instagram_accounts")
      .select("id,username,profile_picture_url,status")
      .eq("user_id", data.user.id),
  ]);

  return (
    <DashboardShell profile={profile ?? null} igAccounts={igAccounts ?? []}>
      {children}
    </DashboardShell>
  );
}
