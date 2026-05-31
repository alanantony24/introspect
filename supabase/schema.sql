create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  responses jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_name text not null default 'Reflection Pattern Assessment',
  answers jsonb not null default '{}'::jsonb,
  scores jsonb not null default '{}'::jsonb,
  top_dimension text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt text not null,
  mood text,
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_responses_user_id_idx
  on public.onboarding_responses(user_id);

create index if not exists assessment_results_user_id_idx
  on public.assessment_results(user_id);

create index if not exists journal_entries_user_id_created_at_idx
  on public.journal_entries(user_id, created_at desc);

create index if not exists insights_user_id_created_at_idx
  on public.insights(user_id, created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_onboarding_responses_updated_at on public.onboarding_responses;
create trigger set_onboarding_responses_updated_at
before update on public.onboarding_responses
for each row execute function public.set_updated_at();

drop trigger if exists set_assessment_results_updated_at on public.assessment_results;
create trigger set_assessment_results_updated_at
before update on public.assessment_results
for each row execute function public.set_updated_at();

drop trigger if exists set_journal_entries_updated_at on public.journal_entries;
create trigger set_journal_entries_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_insights_updated_at on public.insights;
create trigger set_insights_updated_at
before update on public.insights
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.assessment_results enable row level security;
alter table public.journal_entries enable row level security;
alter table public.insights enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

drop policy if exists "Users can insert their profile" on public.profiles;
create policy "Users can insert their profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users can delete their profile" on public.profiles;
create policy "Users can delete their profile"
on public.profiles for delete
to authenticated
using (id = auth.uid());

drop policy if exists "Users can read onboarding responses" on public.onboarding_responses;
create policy "Users can read onboarding responses"
on public.onboarding_responses for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert onboarding responses" on public.onboarding_responses;
create policy "Users can insert onboarding responses"
on public.onboarding_responses for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update onboarding responses" on public.onboarding_responses;
create policy "Users can update onboarding responses"
on public.onboarding_responses for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete onboarding responses" on public.onboarding_responses;
create policy "Users can delete onboarding responses"
on public.onboarding_responses for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read assessment results" on public.assessment_results;
create policy "Users can read assessment results"
on public.assessment_results for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert assessment results" on public.assessment_results;
create policy "Users can insert assessment results"
on public.assessment_results for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update assessment results" on public.assessment_results;
create policy "Users can update assessment results"
on public.assessment_results for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete assessment results" on public.assessment_results;
create policy "Users can delete assessment results"
on public.assessment_results for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read journal entries" on public.journal_entries;
create policy "Users can read journal entries"
on public.journal_entries for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert journal entries" on public.journal_entries;
create policy "Users can insert journal entries"
on public.journal_entries for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update journal entries" on public.journal_entries;
create policy "Users can update journal entries"
on public.journal_entries for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete journal entries" on public.journal_entries;
create policy "Users can delete journal entries"
on public.journal_entries for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read insights" on public.insights;
create policy "Users can read insights"
on public.insights for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert insights" on public.insights;
create policy "Users can insert insights"
on public.insights for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update insights" on public.insights;
create policy "Users can update insights"
on public.insights for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete insights" on public.insights;
create policy "Users can delete insights"
on public.insights for delete
to authenticated
using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
