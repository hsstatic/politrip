-- Run in Supabase SQL editor or via `supabase db push` after linking the project.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_key unique (email)
);

alter table public.newsletter_subscribers enable row level security;

-- Idempotent: safe if you re-run this script in the SQL editor
drop policy if exists "Allow anon insert newsletter" on public.newsletter_subscribers;

-- Allow anonymous inserts from the Next.js app (anon key)
create policy "Allow anon insert newsletter"
  on public.newsletter_subscribers
  for insert
  to anon
  with check (true);

-- No public reads (omit select policy for anon = deny)
