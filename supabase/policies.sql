-- =============================================================================
-- REPLIQO — Row Level Security policies
-- Run AFTER schema.sql.
-- =============================================================================
-- The principle: a logged-in user can see and mutate only their own data.
-- The service role (used by webhook + cron workers) bypasses RLS and is the
-- only path through which inbound Meta data is written.
-- =============================================================================

alter table public.profiles            enable row level security;
alter table public.instagram_accounts  enable row level security;
alter table public.automations         enable row level security;
alter table public.automation_keywords enable row level security;
alter table public.automation_logs     enable row level security;
alter table public.dm_templates        enable row level security;
alter table public.webhook_events      enable row level security;
alter table public.analytics_events    enable row level security;

-- ---- profiles ----
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- ---- instagram_accounts ----
create policy "ig_accounts: select own"
  on public.instagram_accounts for select
  using (auth.uid() = user_id);

create policy "ig_accounts: insert own"
  on public.instagram_accounts for insert
  with check (auth.uid() = user_id);

create policy "ig_accounts: update own"
  on public.instagram_accounts for update
  using (auth.uid() = user_id);

create policy "ig_accounts: delete own"
  on public.instagram_accounts for delete
  using (auth.uid() = user_id);

-- ---- automations ----
create policy "automations: select own"
  on public.automations for select
  using (auth.uid() = user_id);

create policy "automations: insert own"
  on public.automations for insert
  with check (auth.uid() = user_id);

create policy "automations: update own"
  on public.automations for update
  using (auth.uid() = user_id);

create policy "automations: delete own"
  on public.automations for delete
  using (auth.uid() = user_id);

-- ---- automation_keywords (scoped via parent automation) ----
create policy "kw: select via parent"
  on public.automation_keywords for select
  using (exists (
    select 1 from public.automations a
    where a.id = automation_id and a.user_id = auth.uid()
  ));

create policy "kw: write via parent"
  on public.automation_keywords for all
  using (exists (
    select 1 from public.automations a
    where a.id = automation_id and a.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.automations a
    where a.id = automation_id and a.user_id = auth.uid()
  ));

-- ---- automation_logs (read-only for end users) ----
create policy "logs: select own"
  on public.automation_logs for select
  using (auth.uid() = user_id);

-- ---- dm_templates ----
create policy "templates: select own"
  on public.dm_templates for select
  using (auth.uid() = user_id);

create policy "templates: write own"
  on public.dm_templates for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---- webhook_events: no client access at all ----
-- (no policies = nothing visible to anon/auth roles; service_role bypasses RLS)

-- ---- analytics_events: insert-only from auth client; reads via service_role ----
create policy "analytics: insert own"
  on public.analytics_events for insert
  with check (auth.uid() = user_id);
