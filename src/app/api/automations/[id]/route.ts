// =============================================================================
// /api/automations/[id]
//   PATCH  — update mutable fields (status, name, copy, keywords, …)
//   DELETE — soft-archive (status='archived')
//
// Auth: relies on Supabase RLS — the user can only touch their own rows.
// Keywords are replaced atomically: delete-all + bulk-insert.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const patchSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["draft", "active", "paused", "archived"]).optional(),
  match_mode: z.enum(["contains", "exact", "starts_with"]).optional(),
  case_sensitive: z.boolean().optional(),
  comment_reply: z.string().nullable().optional(),
  dm_message: z.string().min(1).optional(),
  dm_button_label: z.string().nullable().optional(),
  dm_button_url: z.string().url().nullable().optional().or(z.literal("")),
  follow_gate_enabled: z.boolean().optional(),
  follow_gate_message: z.string().nullable().optional(),
  follow_gate_cta: z.string().optional(),
  rate_limit_per_hour: z.number().int().min(1).max(2000).optional(),
  post_id: z.string().nullable().optional(),
  keywords: z.array(z.string().min(1)).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { keywords, ...fields } = parsed.data;
  // Normalize empty string to null for URL field
  if (fields.dm_button_url === "") fields.dm_button_url = null;

  if (Object.keys(fields).length > 0) {
    const { error } = await supabase
      .from("automations")
      .update(fields)
      .eq("id", id)
      .eq("user_id", userData.user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (keywords) {
    // Atomic-ish replace: delete then insert. RLS gates writes via parent automation.
    await supabase.from("automation_keywords").delete().eq("automation_id", id);
    if (keywords.length > 0) {
      const dedup = Array.from(new Set(keywords.map((k) => k.trim().toLowerCase()))).filter(Boolean);
      const { error } = await supabase
        .from("automation_keywords")
        .insert(dedup.map((k) => ({ automation_id: id, keyword: k })));
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Soft delete via status — preserves logs for analytics.
  const { error } = await supabase
    .from("automations")
    .update({ status: "archived" })
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
