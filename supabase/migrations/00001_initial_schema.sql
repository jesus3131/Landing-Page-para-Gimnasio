-- ZONAFIT Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- CONTACT MESSAGES
-- ============================================
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact messages"
  on public.contact_messages for insert
  to anon
  with check (true);

create policy "Only authenticated users can view messages"
  on public.contact_messages for select
  to authenticated
  using (true);

-- ============================================
-- PLANS
-- ============================================
create table if not exists public.plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  price decimal(10,2) not null,
  currency text not null default 'USD',
  period text not null default 'month',
  description text,
  featured boolean not null default false,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Anyone can view active plans"
  on public.plans for select
  to anon, authenticated
  using (active = true);

-- Plan features
create table if not exists public.plan_features (
  id uuid primary key default uuid_generate_v4(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  label text not null,
  included boolean not null default true,
  sort_order int not null default 0
);

alter table public.plan_features enable row level security;

create policy "Anyone can view plan features"
  on public.plan_features for select
  to anon, authenticated
  using (true);

-- ============================================
-- TESTIMONIALS
-- ============================================
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author text not null,
  role text,
  initials text not null,
  quote text not null,
  rating int not null default 5 check (rating >= 1 and rating <= 5),
  avatar_url text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Anyone can view active testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (active = true);

-- ============================================
-- SERVICES / CLASSES
-- ============================================
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  icon text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Anyone can view active services"
  on public.services for select
  to anon, authenticated
  using (active = true);

-- ============================================
-- BENEFITS
-- ============================================
create table if not exists public.benefits (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.benefits enable row level security;

create policy "Anyone can view active benefits"
  on public.benefits for select
  to anon, authenticated
  using (active = true);

-- ============================================
-- GALLERY
-- ============================================
create table if not exists public.gallery (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  alt text,
  span text default 'lg:col-span-1 lg:row-span-1',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

create policy "Anyone can view active gallery images"
  on public.gallery for select
  to anon, authenticated
  using (active = true);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  subscribed boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  to anon
  with check (true);

-- ============================================
-- SEED DATA
-- ============================================
insert into public.benefits (title, description, icon, sort_order) values
  ('GYM PAS', 'Acceso completo a nuestras instalaciones con equipamiento de última generación.', 'fitness_center', 1),
  ('HORARIO', 'Abierto de 6am a 11pm todos los días para que entrenes a tu ritmo.', 'schedule', 2),
  ('ENTRENADOR', 'Planes personalizados con seguimiento continuo de profesionales certificados.', 'personal_injury', 3)
on conflict do nothing;

insert into public.services (title, slug, description, icon, sort_order) values
  ('CrossFit', 'crossfit', 'Entrenamiento funcional de alta intensidad que combina levantamiento olímpico, gimnástica y cardio.', 'fitness_center', 1),
  ('Yoga', 'yoga', 'Fluidez y respiración consciente para conectar cuerpo y mente mientras desarrollas flexibilidad.', 'self_improvement', 2),
  ('Spinning', 'spinning', 'Ciclismo indoor al ritmo de la música. Quema hasta 600 calorías por sesión.', 'directions_bike', 3),
  ('Box', 'box', 'Técnica de boxeo con acondicionamiento físico para un entrenamiento completo de cuerpo total.', 'sports_kabaddi', 4),
  ('Funcional', 'funcional', 'Ejercicios que imitan movimientos cotidianos para mejorar tu rendimiento en la vida diaria.', 'monitoring', 5),
  ('Pilates', 'pilates', 'Fortalece tu core, mejora tu postura y gana flexibilidad con ejercicios de control y precisión.', 'accessibility_new', 6)
on conflict (slug) do nothing;

insert into public.testimonials (author, role, initials, quote, rating, sort_order) values
  ('María Pérez', 'Miembro desde 2023', 'MP', 'Desde que entreno en ZONAFIT mi vida cambió por completo. Bajé 15 kilos en 6 meses y gané una confianza que nunca había tenido.', 5, 1),
  ('Jorge López', 'Miembro desde 2024', 'JL', 'Las clases de CrossFit son increíbles. Los entrenadores siempre están pendientes de tu técnica y te motivan a dar lo mejor.', 5, 2),
  ('Andrea García', 'Miembro desde 2022', 'AG', 'El ambiente es espectacular. Todos son bienvenidos sin importar tu nivel. ZONAFIT no es solo un gimnasio, es una familia.', 5, 3)
on conflict do nothing;

insert into public.plans (name, slug, price, description, featured, sort_order) values
  ('Básico', 'basico', 29.00, 'Acceso al gym 6am-10pm, 5 clases grupales, vestidores', false, 1),
  ('Profesional', 'profesional', 49.00, 'Acceso ilimitado, clases ilimitadas, piscina & spa', true, 2),
  ('Premium', 'premium', 79.00, 'Acceso 24/7, clases ilimitadas, 12 sesiones de entrenador personal', false, 3)
on conflict (slug) do nothing;
