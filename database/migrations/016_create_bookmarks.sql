-- Migration 016: Create bookmarks table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  post_id     BIGINT        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id     UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bookmarks readable by owner" ON public.bookmarks FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Bookmarks manageable by owner" ON public.bookmarks FOR ALL USING (user_id = auth.uid() AND is_allowlisted());
