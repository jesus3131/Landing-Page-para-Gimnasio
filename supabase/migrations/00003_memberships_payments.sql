-- Membership plans (Mensual, Quincenal, Trimestral, etc.)
create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_days int not null,
  price decimal(10,2) not null,
  description text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Gym members
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  document_type text not null default 'CC',
  document_number text,
  address text,
  notes text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Member subscriptions (one active per member)
create table if not exists public.member_subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid not null references public.membership_plans(id),
  start_date date not null,
  end_date date not null,
  price decimal(10,2) not null,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.member_subscriptions(id) on delete cascade,
  member_id uuid not null references public.members(id),
  amount decimal(10,2) not null,
  payment_date date not null default current_date,
  payment_method text not null default 'cash',
  reference text,
  notes text,
  period_start date,
  period_end date,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.membership_plans enable row level security;
alter table public.members enable row level security;
alter table public.member_subscriptions enable row level security;
alter table public.payments enable row level security;

-- Membership plans: anyone can view active, admins view all
create policy "Anyone can view active membership plans"
  on public.membership_plans for select
  to anon
  using (active = true);

create policy "Admins can view all membership plans"
  on public.membership_plans for select
  to authenticated
  using (true);

create policy "Admins can insert membership plans"
  on public.membership_plans for insert
  to authenticated
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can update membership plans"
  on public.membership_plans for update
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')))
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can delete membership plans"
  on public.membership_plans for delete
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

-- Members: anyone can view active, admins view all
create policy "Anyone can view active members"
  on public.members for select
  to anon
  using (active = true);

create policy "Admins can view all members"
  on public.members for select
  to authenticated
  using (true);

create policy "Admins can insert members"
  on public.members for insert
  to authenticated
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can update members"
  on public.members for update
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')))
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can delete members"
  on public.members for delete
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

-- Subscriptions: admins only
create policy "Admins can view all subscriptions"
  on public.member_subscriptions for select
  to authenticated
  using (true);

create policy "Admins can insert subscriptions"
  on public.member_subscriptions for insert
  to authenticated
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can update subscriptions"
  on public.member_subscriptions for update
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')))
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can delete subscriptions"
  on public.member_subscriptions for delete
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

-- Payments: admins only
create policy "Admins can view all payments"
  on public.payments for select
  to authenticated
  using (true);

create policy "Admins can insert payments"
  on public.payments for insert
  to authenticated
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can update payments"
  on public.payments for update
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')))
  with check (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

create policy "Admins can delete payments"
  on public.payments for delete
  to authenticated
  using (auth.uid() in (select id from public.profiles where role in ('admin', 'secretaria')));

-- Seed default membership plans
insert into public.membership_plans (name, duration_days, price, description, sort_order) values
  ('Mensual', 30, 79000, 'Acceso completo al gimnasio por 30 días', 1),
  ('Quincenal', 15, 45000, 'Acceso completo al gimnasio por 15 días', 2),
  ('Trimestral', 90, 199000, 'Acceso completo al gimnasio por 3 meses (ahorras $38,000)', 3),
  ('Anual', 365, 699000, 'Acceso completo al gimnasio por 1 año (ahorras $249,000)', 4)
on conflict do nothing;
