-- Migration 009: Create team_members table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.team_members (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            TEXT          NOT NULL,
  role            TEXT          NOT NULL,
  photo_url       TEXT          NULL DEFAULT NULL,
  linkedin_url    TEXT          NULL DEFAULT NULL,
  bio             TEXT          NULL DEFAULT NULL,
  display_order   INT           NOT NULL DEFAULT 0,
  is_published    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tm_order ON public.team_members(display_order);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team public read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team admin write" ON public.team_members FOR ALL USING (is_admin());
