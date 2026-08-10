-- Migration 019: Create email_notification_logs table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.email_notification_logs (
  id                BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type              TEXT          NOT NULL,
  recipient_email   TEXT          NOT NULL,
  status            TEXT          NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error_message     TEXT          NULL DEFAULT NULL,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enl_created ON public.email_notification_logs(created_at DESC);

ALTER TABLE public.email_notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Email logs manageable by admin" ON public.email_notification_logs FOR ALL USING (is_admin());
