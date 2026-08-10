-- Migration 002: Create email_verifications table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT          NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ev_user_id ON public.email_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_ev_expires ON public.email_verifications(expires_at);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "EV admin manage" ON public.email_verifications FOR ALL USING (is_admin());
