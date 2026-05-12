-- =============================================================================
-- REPLIQO — Database Schema
-- Postgres / Supabase
-- =============================================================================
-- Run order:
--   1. schema.sql      (this file — tables, indexes, triggers)
--   2. policies.sql    (Row Level Security)
--   3. functions.sql   (helper RPCs — rate limit, atomic counters)
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------
-- utility: updated_at trigger
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles  (mirrors auth.users — one row per Repliqo user)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text,
  avatar_url      text,
  plan            text not null default 'free' check (plan in ('free','starter','growth','agency')),
  onboarded_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles(email);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile when an auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- instagram_accounts  (one IG Business account connected to a Repliqo user)
-- -----------------------------------------------------------------------------
-- access_token_encrypted: AES-256-GCM ciphertext (we never store the plaintext).
-- token_expires_at: long-lived IG tokens are good for ~60 days; refresh job
--   should bump this before expiry.
create table if not exists public.instagram_accounts (
  id                     uuid primary key default uuid_generate_v4(),
  user_id                uuid not null references public.profiles(id) on delete cascade,
  ig_user_id             text not null,              -- numeric IG user ID (string for safety)
  username               text not null,
  account_type           text,                       -- BUSINESS | CREATOR
  profile_picture_url    text,
  followers_count        integer default 0,
  follows_count          integer default 0,
  media_count            integer default 0,
  access_token_encrypted text not null,              -- encrypted long-lived token
  token_expires_at       timestamptz,
  scopes                 text[] not null default '{}',
  status                 text not null default 'active' check (status in ('active','expired','revoked','error')),
  last_synced_at         timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique(user_id, ig_user_id)
);

create index if not exists ig_accounts_user_idx     on public.instagram_accounts(user_id);
create index if not exists ig_accounts_ig_user_idx  on public.instagram_accounts(ig_user_id);
create index if not exists ig_accounts_status_idx   on public.instagram_accounts(status);

create trigger ig_accounts_set_updated_at
  before update on public.instagram_accounts
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- automations
-- -----------------------------------------------------------------------------
-- Each automation is bound to one IG account and (optionally) one specific post.
-- post_id NULL means "match on any post".
create table if not exists public.automations (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  ig_account_id       uuid not null references public.instagram_accounts(id) on delete cascade,
  name                text not null,
  description         text,
  post_id             text,                            -- IG media id (null = all posts)
  post_thumbnail_url  text,
  post_caption        text,
  status              text not null default 'draft' check (status in ('draft','active','paused','archived')),

  -- trigger config
  match_mode          text not null default 'contains' check (match_mode in ('contains','exact','starts_with')),
  case_sensitive      boolean not null default false,

  -- response config
  comment_reply       text,                            -- public reply text
  dm_message          text not null,                   -- DM body
  dm_button_label     text,                            -- optional CTA button label
  dm_button_url       text,                            -- optional CTA button URL

  -- follow gate
  follow_gate_enabled boolean not null default false,
  follow_gate_message text,                            -- DM body when not following
  follow_gate_cta     text default 'I''m following!', -- button label

  -- limits / safety
  rate_limit_per_hour integer not null default 200,
  total_sends_limit   integer,                         -- null = unlimited
  send_count          integer not null default 0,

  -- counters (denormalized for fast dashboard reads)
  triggers_count      integer not null default 0,
  dms_sent_count      integer not null default 0,
  replies_sent_count  integer not null default 0,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists automations_user_idx       on public.automations(user_id);
create index if not exists automations_ig_acc_idx     on public.automations(ig_account_id);
create index if not exists automations_post_idx       on public.automations(post_id);
create index if not exists automations_status_idx     on public.automations(status);
create index if not exists automations_active_post_idx
  on public.automations(ig_account_id, post_id)
  where status = 'active';

create trigger automations_set_updated_at
  before update on public.automations
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- automation_keywords
-- -----------------------------------------------------------------------------
create table if not exists public.automation_keywords (
  id            uuid primary key default uuid_generate_v4(),
  automation_id uuid not null references public.automations(id) on delete cascade,
  keyword       text not null,
  created_at    timestamptz not null default now()
);

create index if not exists kw_automation_idx on public.automation_keywords(automation_id);
create index if not exists kw_keyword_idx    on public.automation_keywords(lower(keyword));

-- -----------------------------------------------------------------------------
-- automation_logs  (every trigger, attempt, success, failure)
-- -----------------------------------------------------------------------------
-- (automation_id, comment_id) is unique → dedup guarantee.
create table if not exists public.automation_logs (
  id                    uuid primary key default uuid_generate_v4(),
  automation_id         uuid not null references public.automations(id) on delete cascade,
  ig_account_id         uuid not null references public.instagram_accounts(id) on delete cascade,
  user_id               uuid not null references public.profiles(id) on delete cascade,

  -- event source
  event_type            text not null check (event_type in (
    'comment_received','reply_sent','dm_sent','follow_gate_sent',
    'follow_gate_passed','rate_limited','error','duplicate_skipped'
  )),
  comment_id            text,
  commenter_ig_id       text,
  commenter_username    text,
  matched_keyword       text,
  raw_comment_text      text,

  -- outcomes
  comment_reply_id      text,
  dm_message_id         text,
  status                text not null default 'success' check (status in ('success','failed','pending','skipped')),
  error_code            text,
  error_message         text,

  created_at            timestamptz not null default now(),

  unique(automation_id, comment_id, event_type)
);

create index if not exists logs_automation_idx   on public.automation_logs(automation_id, created_at desc);
create index if not exists logs_user_recent_idx  on public.automation_logs(user_id, created_at desc);
create index if not exists logs_ig_account_idx   on public.automation_logs(ig_account_id);
create index if not exists logs_commenter_idx    on public.automation_logs(commenter_ig_id);
create index if not exists logs_status_idx       on public.automation_logs(status);

-- -----------------------------------------------------------------------------
-- dm_templates  (reusable DM/comment-reply snippets — saved by the user)
-- -----------------------------------------------------------------------------
create table if not exists public.dm_templates (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  name       text not null,
  body       text not null,
  kind       text not null check (kind in ('comment_reply','dm','follow_gate')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_user_idx on public.dm_templates(user_id);

create trigger templates_set_updated_at
  before update on public.dm_templates
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- webhook_events  (raw inbound from Meta — we ack 200 then process from here)
-- -----------------------------------------------------------------------------
create table if not exists public.webhook_events (
  id                  uuid primary key default uuid_generate_v4(),
  source              text not null default 'instagram',
  ig_account_id       uuid references public.instagram_accounts(id) on delete set null,
  ig_user_id          text,
  event_type          text,                              -- comments, messages, mentions...
  signature_valid     boolean not null default false,
  payload             jsonb not null,
  -- Meta sometimes redelivers the same event. We dedupe on the entry IDs.
  external_id         text,
  processing_status   text not null default 'pending' check (processing_status in ('pending','processing','processed','failed','skipped')),
  attempts            integer not null default 0,
  last_error          text,
  received_at         timestamptz not null default now(),
  processed_at        timestamptz,
  unique(source, external_id)
);

create index if not exists wh_events_status_idx    on public.webhook_events(processing_status, received_at);
create index if not exists wh_events_ig_acc_idx    on public.webhook_events(ig_account_id);
create index if not exists wh_events_payload_gin   on public.webhook_events using gin (payload jsonb_path_ops);

-- -----------------------------------------------------------------------------
-- analytics_events  (lightweight product analytics)
-- -----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id         bigserial primary key,
  user_id    uuid references public.profiles(id) on delete set null,
  event      text not null,                              -- e.g. 'automation_created'
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_user_idx  on public.analytics_events(user_id, created_at desc);
create index if not exists analytics_event_idx on public.analytics_events(event, created_at desc);

-- -----------------------------------------------------------------------------
-- Materialized helper view: daily automation stats (last 30 days)
-- -----------------------------------------------------------------------------
create or replace view public.automation_daily_stats as
select
  l.automation_id,
  date_trunc('day', l.created_at) as day,
  count(*) filter (where l.event_type = 'comment_received') as comments,
  count(*) filter (where l.event_type = 'reply_sent' and l.status = 'success') as replies,
  count(*) filter (where l.event_type = 'dm_sent' and l.status = 'success') as dms,
  count(*) filter (where l.event_type = 'follow_gate_passed') as gate_passed,
  count(*) filter (where l.status = 'failed') as failures
from public.automation_logs l
where l.created_at > now() - interval '30 days'
group by l.automation_id, date_trunc('day', l.created_at);
