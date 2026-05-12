import Link from "next/link";
import { Instagram, Plus, AlertCircle, Check } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { formatCompact, relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ ig_error?: string; required?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user!.id;

  const { data: accounts } = await supabase
    .from("instagram_accounts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Connected accounts"
        description="Instagram Business or Creator accounts authorized to use Repliqo."
        actions={
          <Button asChild>
            <Link href="/api/auth/instagram?return_to=/dashboard/accounts">
              <Plus className="h-4 w-4" /> Connect Instagram
            </Link>
          </Button>
        }
      />

      {params.required && (
        <Card className="p-4 flex items-start gap-3 border-amber-500/30 bg-amber-500/[0.06]">
          <AlertCircle className="h-4 w-4 text-amber-300 mt-0.5" />
          <div className="text-sm">
            Connect an Instagram account before creating automations.
          </div>
        </Card>
      )}

      {params.ig_error && (
        <Card className="p-4 flex items-start gap-3 border-red-500/30 bg-red-500/[0.06]">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5" />
          <div className="text-sm">{params.ig_error}</div>
        </Card>
      )}

      {!accounts || accounts.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] mb-4">
            <Instagram className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium">No accounts yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Connect your Instagram Business or Creator account. Personal accounts are not supported.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/api/auth/instagram?return_to=/dashboard/accounts">
                <Instagram className="h-4 w-4" /> Connect with Instagram
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((a) => (
            <Card key={a.id} className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-medium">@{a.username}</div>
                  {a.status === "active" ? (
                    <Badge variant="success" className="gap-1">
                      <Check className="h-3 w-3" /> Active
                    </Badge>
                  ) : (
                    <Badge variant="warning">{a.status}</Badge>
                  )}
                  {a.account_type && (
                    <Badge variant="muted">{a.account_type}</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCompact(a.followers_count)} followers · {formatCompact(a.media_count)} posts · synced {a.last_synced_at ? relativeTime(a.last_synced_at) : "—"}
                </div>
              </div>
              <Button variant="secondary" size="sm">Manage</Button>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-5">
        <h3 className="text-sm font-medium">Required Instagram scopes</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Repliqo requests only what's needed for comment-to-DM automation.
        </p>
        <ul className="mt-3 space-y-2 text-xs">
          {[
            "instagram_business_basic — read profile and media",
            "instagram_business_manage_messages — send DMs",
            "instagram_business_manage_comments — reply to comments",
          ].map((s) => (
            <li key={s} className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-3 w-3 text-emerald-400" />
              <code className="text-foreground/85 font-mono">{s}</code>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
