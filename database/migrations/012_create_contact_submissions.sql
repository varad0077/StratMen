-- Migration 012: Create contact_submissions table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT          NOT NULL,
  email       TEXT          NOT NULL,
  subject     TEXT          NULL DEFAULT NULL,
  message     TEXT          NOT NULL,
  is_read     BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cs_created ON public.contact_submissions(created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact public insert" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact admin manage" ON public.contact_submissions FOR ALL USING (is_admin());
