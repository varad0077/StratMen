-- Migration 004: Create refresh_tokens table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT          NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ   NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rt_user_id ON public.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_rt_expires ON public.refresh_tokens(expires_at);

ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RT admin manage" ON public.refresh_tokens FOR ALL USING (is_admin());
