-- Migration 007: Create activities table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.activities (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           TEXT          NOT NULL,
  description     TEXT          NOT NULL,
  image_url       TEXT          NULL DEFAULT NULL,
  frequency       TEXT          NULL DEFAULT NULL,
  impact_summary  TEXT          NULL DEFAULT NULL,
  is_published    BOOLEAN       NOT NULL DEFAULT FALSE,
  display_order   INT           NOT NULL DEFAULT 0,
  created_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_act_published ON public.activities(is_published);
CREATE INDEX IF NOT EXISTS idx_act_order ON public.activities(display_order);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities public read" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Activities admin write" ON public.activities FOR ALL USING (is_admin());
