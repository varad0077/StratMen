-- Migration 014: Create comments table (PostgreSQL / Supabase)
CREATE TABLE IF NOT EXISTS public.comments (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id     BIGINT        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id   UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON public.comments(created_at ASC);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments readable by allowlisted" ON public.comments FOR SELECT USING (is_allowlisted());
CREATE POLICY "Comments insertable by allowlisted" ON public.comments FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());
CREATE POLICY "Comments deletable by author or admin" ON public.comments FOR DELETE USING (author_id = auth.uid() OR is_admin());
