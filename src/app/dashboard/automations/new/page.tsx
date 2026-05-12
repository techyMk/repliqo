import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AutomationBuilder, type BuilderPrefill } from "@/components/automation/builder";
import { TemplateGallery } from "@/components/automation/template-gallery";
import { findTemplate } from "@/lib/automation/templates";

export const dynamic = "force-dynamic";

export default async function NewAutomationPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: accounts } = await supabase
    .from("instagram_accounts")
    .select("id,username,profile_picture_url,ig_user_id")
    .eq("user_id", userData.user.id)
    .eq("status", "active");

  if (!accounts || accounts.length === 0) {
    redirect("/dashboard/accounts?required=true");
  }

  // No template picked yet → show the gallery.
  const template = findTemplate(t);
  if (!template) {
    return <TemplateGallery />;
  }

  // Pre-fill the builder from the chosen template (create mode, not edit).
  const prefill: BuilderPrefill | undefined =
    template.id === "blank"
      ? undefined
      : {
          keywords: template.keywords,
          values: {
            name: template.defaults.name,
            comment_reply: template.defaults.comment_reply ?? "",
            dm_message: template.defaults.dm_message,
            dm_button_label: template.defaults.dm_button_label ?? "",
            dm_button_url: template.defaults.dm_button_url ?? "",
            follow_gate_enabled: template.defaults.follow_gate_enabled,
            follow_gate_message: template.defaults.follow_gate_message ?? "",
            follow_gate_cta: template.defaults.follow_gate_cta,
            match_mode: template.defaults.match_mode,
            rate_limit_per_hour: template.defaults.rate_limit_per_hour,
          },
        };

  return <AutomationBuilder accounts={accounts} prefill={prefill} />;
}
