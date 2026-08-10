-- Migration 017: Create chat_messages table (PostgreSQL / Supabase)
-- Group chat messages for StratChat

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id   UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  is_pinned   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_chat_author ON public.chat_messages(author_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON public.chat_messages(created_at ASC);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Chat messages readable by allowlisted members" ON public.chat_messages
  FOR SELECT USING (is_allowlisted());

CREATE POLICY "Chat messages insertable by allowlisted members" ON public.chat_messages
  FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());

CREATE POLICY "Chat messages deletable by author or admin" ON public.chat_messages
  FOR DELETE USING (author_id = auth.uid() OR is_admin());

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
