-- Migration 011: Create footprints table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.footprints (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stat_key        TEXT          NOT NULL UNIQUE,
  stat_value      TEXT          NOT NULL,
  stat_label      TEXT          NOT NULL,
  icon            TEXT          NULL DEFAULT NULL,
  display_order   INT           NOT NULL DEFAULT 0,
  updated_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fp_order ON public.footprints(display_order);

ALTER TABLE public.footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Footprints public read" ON public.footprints FOR SELECT USING (true);
CREATE POLICY "Footprints admin write" ON public.footprints FOR ALL USING (is_admin());
