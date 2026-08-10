-- Migration 018: Create admin_action_logs table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.admin_action_logs (
  id            BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id      UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  action        TEXT          NOT NULL,
  target_table  TEXT          NULL DEFAULT NULL,
  target_id     TEXT          NULL DEFAULT NULL,
  details       JSONB         NULL DEFAULT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aal_admin ON public.admin_action_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_aal_created ON public.admin_action_logs(created_at DESC);

ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin logs manageable by admin" ON public.admin_action_logs FOR ALL USING (is_admin());
