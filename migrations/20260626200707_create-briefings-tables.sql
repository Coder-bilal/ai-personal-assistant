create table if not exists public.briefing_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  apps text[] not null default '{}',
  categories text[] not null default '{}',
  scheduled_time text not null,
  frequency text not null default 'daily',
  priority_level text not null default 'medium',
  next_run_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_briefings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  schedule_id uuid references public.briefing_schedules(id) on delete set null,
  title text not null,
  summary text not null default '',
  stats jsonb not null default '{}'::jsonb,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists briefing_schedules_user_created_idx
  on public.briefing_schedules (user_id, created_at desc);

create index if not exists briefing_schedules_next_run_idx
  on public.briefing_schedules (next_run_at);

create index if not exists generated_briefings_user_created_idx
  on public.generated_briefings (user_id, created_at desc);

alter table public.briefing_schedules enable row level security;
alter table public.generated_briefings enable row level security;

grant select, insert, update, delete on public.briefing_schedules to authenticated;
grant select, insert, update, delete on public.generated_briefings to authenticated;

do $$
begin
  -- Briefing Schedules Policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'briefing_schedules' and policyname = 'Users can read own briefing schedules'
  ) then
    create policy "Users can read own briefing schedules"
      on public.briefing_schedules for select to authenticated
      using (auth.uid()::text = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'briefing_schedules' and policyname = 'Users can insert own briefing schedules'
  ) then
    create policy "Users can insert own briefing schedules"
      on public.briefing_schedules for insert to authenticated
      with check (auth.uid()::text = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'briefing_schedules' and policyname = 'Users can update own briefing schedules'
  ) then
    create policy "Users can update own briefing schedules"
      on public.briefing_schedules for update to authenticated
      using (auth.uid()::text = user_id)
      with check (auth.uid()::text = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'briefing_schedules' and policyname = 'Users can delete own briefing schedules'
  ) then
    create policy "Users can delete own briefing schedules"
      on public.briefing_schedules for delete to authenticated
      using (auth.uid()::text = user_id);
  end if;

  -- Generated Briefings Policies
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'generated_briefings' and policyname = 'Users can read own generated briefings'
  ) then
    create policy "Users can read own generated briefings"
      on public.generated_briefings for select to authenticated
      using (auth.uid()::text = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'generated_briefings' and policyname = 'Users can insert own generated briefings'
  ) then
    create policy "Users can insert own generated briefings"
      on public.generated_briefings for insert to authenticated
      with check (auth.uid()::text = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'generated_briefings' and policyname = 'Users can update own generated briefings'
  ) then
    create policy "Users can update own generated briefings"
      on public.generated_briefings for update to authenticated
      using (auth.uid()::text = user_id)
      with check (auth.uid()::text = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'generated_briefings' and policyname = 'Users can delete own generated briefings'
  ) then
    create policy "Users can delete own generated briefings"
      on public.generated_briefings for delete to authenticated
      using (auth.uid()::text = user_id);
  end if;
end $$;
