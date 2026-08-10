-- Migration 013: Create posts table (PostgreSQL / Supabase)
-- StratChat social feed posts

CREATE TABLE IF NOT EXISTS public.posts (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id   UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  image_url   TEXT          NULL DEFAULT NULL,
  is_pinned   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Posts readable by allowlisted members" ON public.posts
  FOR SELECT USING (is_allowlisted());

CREATE POLICY "Posts insertable by allowlisted members" ON public.posts
  FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());

CREATE POLICY "Posts updates by author or admin" ON public.posts
  FOR UPDATE USING (author_id = auth.uid() OR is_admin());

CREATE POLICY "Posts deletable by author or admin" ON public.posts
  FOR DELETE USING (author_id = auth.uid() OR is_admin());

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
