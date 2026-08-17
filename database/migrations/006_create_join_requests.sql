-- Migration 006: Create join_requests table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.join_requests (
  id            BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name     TEXT          NOT NULL,
  email         TEXT          NOT NULL UNIQUE,
  phone         TEXT          NOT NULL,
  linkedin_url  TEXT          NULL DEFAULT NULL,
  reason        TEXT          NOT NULL,
  status        TEXT          NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes   TEXT          NULL DEFAULT NULL,
  reviewed_by   UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at   TIMESTAMPTZ   NULL DEFAULT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jr_status ON public.join_requests(status);
CREATE INDEX IF NOT EXISTS idx_jr_created ON public.join_requests(created_at DESC);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Join requests public insert" ON public.join_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Join requests admin manage" ON public.join_requests FOR ALL TO authenticated USING (is_admin());
