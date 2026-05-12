import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AutomationBuilder, type BuilderInitial } from "@/components/automation/builder";

export const dynamic = "force-dynamic";

export default async function EditAutomationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const [{ data: automation }, { data: accounts }] = await Promise.all([
    supabase
      .from("automations")
      .select("*, automation_keywords(keyword)")
      .eq("id", id)
      .eq("user_id", userData.user.id)
      .single(),
    supabase
      .from("instagram_accounts")
      .select("id,username,profile_picture_url,ig_user_id")
      .eq("user_id", userData.user.id)
      .eq("status", "active"),
  ]);

  if (!automation) notFound();
  if (!accounts || accounts.length === 0) redirect("/dashboard/accounts?required=true");

  const initial: BuilderInitial = {
    id: automation.id,
    keywords: (automation.automation_keywords as { keyword: string }[]).map((k) => k.keyword),
    post: {
      id: automation.post_id,
      thumbnail_url: automation.post_thumbnail_url,
      caption: automation.post_caption,
    },
    values: {
      name: automation.name,
      description: automation.description ?? "",
      ig_account_id: automation.ig_account_id,
      match_mode: automation.match_mode,
      case_sensitive: automation.case_sensitive,
      comment_reply: automation.comment_reply ?? "",
      dm_message: automation.dm_message,
      dm_button_label: automation.dm_button_label ?? "",
      dm_button_url: automation.dm_button_url ?? "",
      follow_gate_enabled: automation.follow_gate_enabled,
      follow_gate_message: automation.follow_gate_message ?? "",
      follow_gate_cta: automation.follow_gate_cta ?? "I'm following!",
      rate_limit_per_hour: automation.rate_limit_per_hour,
    },
  };

  return <AutomationBuilder accounts={accounts} initial={initial} />;
}
