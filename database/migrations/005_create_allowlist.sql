-- Migration 005: Create allowlist table & security functions (PostgreSQL / Supabase)
-- Core access control table for StratChat

CREATE TABLE IF NOT EXISTS public.allowlist (
  email       TEXT          PRIMARY KEY,
  name        TEXT          NOT NULL,
  role        TEXT          NOT NULL DEFAULT 'StratMen Member',
  is_admin    BOOLEAN       NOT NULL DEFAULT FALSE,
  added_by    UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_allowlist_is_admin ON public.allowlist(is_admin);

-- Enable RLS
ALTER TABLE public.allowlist ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if current authenticated user is allowlisted
CREATE OR REPLACE FUNCTION public.is_allowlisted()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowlist
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper Function: Check if current authenticated user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowlist
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
      AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
CREATE POLICY "Allowlist viewable by self or admin" ON public.allowlist
  FOR SELECT USING (is_admin() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'));

CREATE POLICY "Allowlist manageable by admin" ON public.allowlist
  FOR ALL USING (is_admin());
