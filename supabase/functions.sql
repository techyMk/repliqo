-- =============================================================================
-- REPLIQO — Postgres helper functions
-- Run AFTER schema.sql and policies.sql.
-- =============================================================================
-- These are cheap server-side helpers the app calls via RPC. Marked STABLE
-- where possible so the planner can cache/inline them.
-- =============================================================================

-- ---- count_recent_dms_for_automation ----
-- Counts successful 'dm_sent' events for an automation within a window.
-- The composite index logs_automation_idx (automation_id, created_at desc)
-- is what makes this O(log n) instead of O(n).
create or replace function public.count_recent_dms_for_automation(
  p_automation_id uuid,
  p_window_minutes int default 60
)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
  from public.automation_logs
  where automation_id = p_automation_id
    and event_type = 'dm_sent'
    and status = 'success'
    and created_at > now() - make_interval(mins => p_window_minutes);
$$;

revoke all on function public.count_recent_dms_for_automation(uuid, int) from public;
grant execute on function public.count_recent_dms_for_automation(uuid, int) to service_role;
grant execute on function public.count_recent_dms_for_automation(uuid, int) to authenticated;

-- ---- increment_automation_counter ----
-- Atomic update for the dashboard counters. Avoids the read-modify-write race
-- where two webhook events arriving simultaneously could lose an increment.
create or replace function public.increment_automation_counters(
  p_automation_id uuid,
  p_triggers int default 0,
  p_replies  int default 0,
  p_dms      int default 0,
  p_sends    int default 0
)
returns void
language sql
volatile
security definer
set search_path = public
as $$
  update public.automations
  set
    triggers_count     = triggers_count     + p_triggers,
    replies_sent_count = replies_sent_count + p_replies,
    dms_sent_count     = dms_sent_count     + p_dms,
    send_count         = send_count         + p_sends,
    updated_at         = now()
  where id = p_automation_id;
$$;

revoke all on function public.increment_automation_counters(uuid, int, int, int, int) from public;
grant execute on function public.increment_automation_counters(uuid, int, int, int, int) to service_role;
