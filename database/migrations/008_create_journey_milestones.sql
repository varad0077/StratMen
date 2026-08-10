-- Migration 008: Create journey_milestones table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           TEXT          NOT NULL,
  description     TEXT          NOT NULL,
  milestone_date  DATE          NOT NULL,
  image_url       TEXT          NULL DEFAULT NULL,
  display_order   INT           NOT NULL DEFAULT 0,
  is_published    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jm_date ON public.journey_milestones(milestone_date);
CREATE INDEX IF NOT EXISTS idx_jm_order ON public.journey_milestones(display_order);

ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journey public read" ON public.journey_milestones FOR SELECT USING (true);
CREATE POLICY "Journey admin write" ON public.journey_milestones FOR ALL USING (is_admin());
