-- Migration 003: Create password_resets table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.password_resets (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       TEXT          NOT NULL,
  token       TEXT          NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pr_email ON public.password_resets(email);
CREATE INDEX IF NOT EXISTS idx_pr_expires ON public.password_resets(expires_at);

ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "PR admin manage" ON public.password_resets FOR ALL USING (is_admin());
