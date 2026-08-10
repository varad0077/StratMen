-- Migration 015: Create likes table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.likes (
  post_id     BIGINT        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user ON public.likes(user_id);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes readable by allowlisted" ON public.likes FOR SELECT USING (is_allowlisted());
CREATE POLICY "Likes manageable by owner" ON public.likes FOR ALL USING (user_id = auth.uid() AND is_allowlisted());
