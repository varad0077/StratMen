-- Migration 010: Create homepage_content table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id            BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section_key   TEXT          NOT NULL UNIQUE,
  title         TEXT          NULL DEFAULT NULL,
  content       TEXT          NULL DEFAULT NULL,
  image_url     TEXT          NULL DEFAULT NULL,
  updated_by    UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage public read" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Homepage admin write" ON public.homepage_content FOR ALL USING (is_admin());
