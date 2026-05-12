// =============================================================================
// POST   /api/demo/seed   — populate the user's workspace with realistic demo data
// DELETE /api/demo/seed   — remove the demo IG account and cascading rows
//
// Use case: portfolio reviewers signing up to explore the product without
// connecting a real Instagram account.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { seedDemoData, resetDemoData } from "@/lib/demo/seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await seedDemoData(userData.user.id);
  if (!result.seeded) {
    return NextResponse.json(result, { status: 409 });
  }
  return NextResponse.json(result);
}

export async function DELETE(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const result = await resetDemoData(userData.user.id);
  return NextResponse.json(result);
}
