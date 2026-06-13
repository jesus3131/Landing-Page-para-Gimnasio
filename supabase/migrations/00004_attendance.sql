create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  check_in timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.attendance enable row level security;

create policy "authenticated can select attendance"
  on public.attendance for select
  to authenticated
  using (true);

create policy "authenticated can insert attendance"
  on public.attendance for insert
  to authenticated
  with check (true);

create policy "authenticated can delete attendance"
  on public.attendance for delete
  to authenticated
  using (true);
