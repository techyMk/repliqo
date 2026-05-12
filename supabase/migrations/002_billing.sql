-- =============================================================================
-- 002_billing.sql — Stripe billing fields
-- Run AFTER schema.sql / policies.sql / functions.sql.
-- Adds subscription tracking to the profiles table. The `plan` column already
-- exists from schema.sql (free/starter/growth/agency); we only need the
-- Stripe-specific fields and an index on customer id.
-- =============================================================================

alter table public.profiles
  add column if not exists stripe_customer_id     text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status    text,    -- active | trialing | past_due | canceled | incomplete
  add column if not exists current_period_end     timestamptz;

create unique index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

create        index if not exists profiles_subscription_idx
  on public.profiles (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- Allow the webhook (service_role) to find a user by customer id without
-- having to query auth.users. The unique index above already enforces 1:1.
