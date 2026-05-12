import { Suspense } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/page-header";
import { BillingSection } from "@/components/dashboard/billing-section";
import type { PlanTier } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user!.id)
    .single();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your account, workspace, and billing."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full name</Label>
            <Input defaultValue={profile?.full_name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input defaultValue={profile?.email ?? ""} disabled />
            <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
          </div>
          <div className="pt-2">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={null}>
        <BillingSection
          plan={(profile?.plan as PlanTier) ?? "free"}
          status={profile?.subscription_status ?? null}
          currentPeriodEnd={profile?.current_period_end ?? null}
          hasCustomer={Boolean(profile?.stripe_customer_id)}
        />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-300">Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Permanently delete your workspace, automations, and connected accounts. This cannot be undone.
          </p>
          <Button variant="destructive">Delete account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
