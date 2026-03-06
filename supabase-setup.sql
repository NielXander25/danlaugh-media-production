-- ============================================================
-- DANLAUGH MEDIA PRODUCTION — SUPABASE DATABASE SETUP
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- 1. PROJECTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  video_id    TEXT NOT NULL,
  thumbnail_url TEXT,
  category    TEXT NOT NULL DEFAULT 'Commercial',
  featured    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. TESTIMONIALS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  company     TEXT NOT NULL DEFAULT '',
  message     TEXT NOT NULL,
  avatar_url  TEXT,
  featured    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. ABOUT TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.about (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. CONTACT MESSAGES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;

-- ---- PROJECTS ----
-- Public can read
CREATE POLICY "Public can view projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated can insert/update/delete
CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- ---- TESTIMONIALS ----
CREATE POLICY "Public can view testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (true);

-- ---- ABOUT ----
CREATE POLICY "Public can view about"
  ON public.about FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert about"
  ON public.about FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update about"
  ON public.about FOR UPDATE
  TO authenticated
  USING (true);

-- ---- CONTACT MESSAGES ----
-- Anyone can insert (submit form), only authenticated can read
CREATE POLICY "Anyone can insert messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- SEED DATA (Optional — remove if not needed)
-- ============================================================

-- Sample project
INSERT INTO public.projects (title, video_id, category, featured)
VALUES ('Brand Commercial — Demo Reel', 'dQw4w9WgXcQ', 'Commercial', true)
ON CONFLICT DO NOTHING;

-- Sample testimonial
INSERT INTO public.testimonials (name, role, company, message, featured)
VALUES (
  'Emeka Obi',
  'Marketing Director',
  'Zenith Foods',
  'Danlaugh Media transformed our brand video into something truly cinematic. The attention to detail and storytelling ability is unmatched. Highly recommend!',
  true
)
ON CONFLICT DO NOTHING;

-- Initial about image (update URL to your actual image)
INSERT INTO public.about (image_url)
VALUES ('https://images.unsplash.com/photo-1608562719218-920013a7a249?w=800')
ON CONFLICT DO NOTHING;
