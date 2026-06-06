-- Fix RLS policies: split SELECT policies so authenticated users see ALL rows
-- (needed for admin panel) while anon users only see active=true rows.
-- Without this fix, updating active from true to false is rejected by
-- PostgreSQL because the new row wouldn't satisfy the anon-level SELECT policy.

-- ============================================
-- SERVICES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all services" ON public.services
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert services" ON public.services
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')));

CREATE POLICY "Admins can update services" ON public.services
  FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')));

CREATE POLICY "Admins can delete services" ON public.services
  FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')));

-- ============================================
-- BENEFITS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active benefits" ON public.benefits;

CREATE POLICY "Anyone can view active benefits" ON public.benefits
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all benefits" ON public.benefits
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can insert benefits" ON public.benefits
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')));

CREATE POLICY "Admins can update benefits" ON public.benefits
  FOR UPDATE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')));

CREATE POLICY "Admins can delete benefits" ON public.benefits
  FOR DELETE TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'secretaria')));

-- ============================================
-- GALLERY
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active gallery images" ON public.gallery;

CREATE POLICY "Anyone can view active gallery images" ON public.gallery
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all gallery" ON public.gallery
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- PLANS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active plans" ON public.plans;

CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all plans" ON public.plans
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- COACHES
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active coaches" ON public.coaches;

CREATE POLICY "Anyone can view active coaches" ON public.coaches
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all coaches" ON public.coaches
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- TEAM
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active team members" ON public.team;

CREATE POLICY "Anyone can view active team members" ON public.team
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all team members" ON public.team
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- EVENTS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;

CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- NEWS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active news" ON public.news;

CREATE POLICY "Anyone can view active news" ON public.news
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all news" ON public.news
  FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- TESTIMONIALS
-- ============================================
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;

CREATE POLICY "Anyone can view active testimonials" ON public.testimonials
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Admins can view all testimonials" ON public.testimonials
  FOR SELECT TO authenticated
  USING (true);
