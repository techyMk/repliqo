-- =============================================================================
-- REPLIQO — Teardown
-- Drops every object created by schema.sql / policies.sql / functions.sql.
-- After running this, re-run the three setup files in order for a fresh start.
--
-- Does NOT touch auth.users — your test signups stay alive. If you also want
-- to wipe those, see the note at the bottom.
-- =============================================================================

-- 1. Drop the trigger on auth.users first (it depends on the function below).
drop trigger if exists on_auth_user_created on auth.users;

-- 2. Drop the view (depends on automation_logs).
drop view if exists public.automation_daily_stats;

-- 3. Drop all our tables. CASCADE also drops their RLS policies, indexes,
--    foreign keys, and per-table triggers.
drop table if exists public.analytics_events     cascade;
drop table if exists public.webhook_events       cascade;
drop table if exists public.dm_templates         cascade;
drop table if exists public.automation_logs      cascade;
drop table if exists public.automation_keywords  cascade;
drop table if exists public.automations          cascade;
drop table if exists public.instagram_accounts   cascade;
drop table if exists public.profiles             cascade;

-- 4. Drop helper functions.
drop function if exists public.set_updated_at();
drop function if exists public.handle_new_user();
drop function if exists public.count_recent_dms_for_automation(uuid, int);
drop function if exists public.increment_automation_counters(uuid, int, int, int, int);

-- =============================================================================
-- Optional: also wipe test auth users
-- =============================================================================
-- Uncomment the line below to delete every user account from auth.users.
-- This logs everyone out and removes their Supabase Auth records.
-- (Skip this if you want to keep your Google/email signups.)
--
-- delete from auth.users;
