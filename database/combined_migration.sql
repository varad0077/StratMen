-- ================================================================================
-- STRATMEN FOUNDATION — CONSOLIDATED SUPABASE POSTGRESQL MIGRATION & SEED SCRIPT
-- Copy and paste this ENTIRE file into your Supabase Dashboard -> SQL Editor -> Run
-- ================================================================================

-- --------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Synced 1:1 with auth.users)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name           TEXT          NOT NULL,
  phone               TEXT          NULL,
  email               TEXT          NOT NULL UNIQUE,
  avatar_url          TEXT          NULL,
  role                TEXT          NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_suspended        BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by anyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------------------
-- 2. ALLOWLIST TABLE & HELPER SECURITY FUNCTIONS
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.allowlist (
  email       TEXT          PRIMARY KEY,
  name        TEXT          NOT NULL,
  role        TEXT          NOT NULL DEFAULT 'StratMen Member',
  is_admin    BOOLEAN       NOT NULL DEFAULT FALSE,
  added_by    UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_allowlist_is_admin ON public.allowlist(is_admin);
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

CREATE POLICY "Allowlist viewable by self or admin" ON public.allowlist
  FOR SELECT USING (is_admin() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'));

CREATE POLICY "Allowlist manageable by admin" ON public.allowlist
  FOR ALL USING (is_admin());

-- --------------------------------------------------------------------------------
-- 3. JOIN REQUESTS TABLE
-- --------------------------------------------------------------------------------
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
CREATE POLICY "Join requests public insert" ON public.join_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Join requests admin manage" ON public.join_requests FOR ALL USING (is_admin());

-- --------------------------------------------------------------------------------
-- 4. STRATCHAT POSTS TABLE (Realtime CDC Enabled)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id   UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  image_url   TEXT          NULL DEFAULT NULL,
  is_pinned   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.posts(is_pinned);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts readable by allowlisted members" ON public.posts FOR SELECT USING (is_allowlisted());
CREATE POLICY "Posts insertable by allowlisted members" ON public.posts FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());
CREATE POLICY "Posts updates by author or admin" ON public.posts FOR UPDATE USING (author_id = auth.uid() OR is_admin());
CREATE POLICY "Posts deletable by author or admin" ON public.posts FOR DELETE USING (author_id = auth.uid() OR is_admin());

-- --------------------------------------------------------------------------------
-- 5. COMMENTS TABLE
-- --------------------------------------------------------------------------------
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

-- --------------------------------------------------------------------------------
-- 6. LIKES TABLE
-- --------------------------------------------------------------------------------
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

-- --------------------------------------------------------------------------------
-- 7. BOOKMARKS TABLE
-- --------------------------------------------------------------------------------
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

-- --------------------------------------------------------------------------------
-- 8. CHAT MESSAGES TABLE (Realtime CDC Enabled)
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id          BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id   UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content     TEXT          NOT NULL,
  image_url   TEXT          NULL DEFAULT NULL,
  is_pinned   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_author ON public.chat_messages(author_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON public.chat_messages(created_at ASC);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Chat messages readable by allowlisted members" ON public.chat_messages FOR SELECT USING (is_allowlisted());
CREATE POLICY "Chat messages insertable by allowlisted members" ON public.chat_messages FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());
CREATE POLICY "Chat messages deletable by author or admin" ON public.chat_messages FOR DELETE USING (author_id = auth.uid() OR is_admin());

-- --------------------------------------------------------------------------------
-- 9. PUBLIC WEBSITE CONTENT TABLES
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activities (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           TEXT          NOT NULL,
  description     TEXT          NOT NULL,
  image_url       TEXT          NULL DEFAULT NULL,
  frequency       TEXT          NULL DEFAULT NULL,
  impact_summary  TEXT          NULL DEFAULT NULL,
  is_published    BOOLEAN       NOT NULL DEFAULT FALSE,
  display_order   INT           NOT NULL DEFAULT 0,
  created_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities public read" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Activities admin write" ON public.activities FOR ALL USING (is_admin());

CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           TEXT          NOT NULL,
  description     TEXT          NOT NULL,
  milestone_date  DATE          NOT NULL,
  image_url       TEXT          NULL DEFAULT NULL,
  display_order   INT           NOT NULL DEFAULT 0,
  is_published    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journey public read" ON public.journey_milestones FOR SELECT USING (true);
CREATE POLICY "Journey admin write" ON public.journey_milestones FOR ALL USING (is_admin());

CREATE TABLE IF NOT EXISTS public.team_members (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            TEXT          NOT NULL,
  role            TEXT          NOT NULL,
  photo_url       TEXT          NULL DEFAULT NULL,
  linkedin_url    TEXT          NULL DEFAULT NULL,
  bio             TEXT          NULL DEFAULT NULL,
  display_order   INT           NOT NULL DEFAULT 0,
  is_published    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team public read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team admin write" ON public.team_members FOR ALL USING (is_admin());

CREATE TABLE IF NOT EXISTS public.homepage_content (
  id            BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section_key   TEXT          NOT NULL UNIQUE,
  title         TEXT          NULL DEFAULT NULL,
  content       TEXT          NULL DEFAULT NULL,
  image_url     TEXT          NULL DEFAULT NULL,
  updated_by    UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage public read" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Homepage admin write" ON public.homepage_content FOR ALL USING (is_admin());

CREATE TABLE IF NOT EXISTS public.footprints (
  id              BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  stat_key        TEXT          NOT NULL UNIQUE,
  stat_value      TEXT          NOT NULL,
  stat_label      TEXT          NOT NULL,
  icon            TEXT          NULL DEFAULT NULL,
  display_order   INT           NOT NULL DEFAULT 0,
  updated_by      UUID          NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE public.footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Footprints public read" ON public.footprints FOR SELECT USING (true);
CREATE POLICY "Footprints admin write" ON public.footprints FOR ALL USING (is_admin());

-- --------------------------------------------------------------------------------
-- 10. ADMIN LOGS & NOTIFICATION LOGS
-- --------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_action_logs (
  id            BIGINT        GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id      UUID          NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  action        TEXT          NOT NULL,
  target_table  TEXT          NULL DEFAULT NULL,
  target_id     TEXT          NULL DEFAULT NULL,
  details       JSONB         NULL DEFAULT NULL,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
ALTER TABLE public.admin_action_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin logs manageable by admin" ON public.admin_action_logs FOR ALL USING (is_admin());

-- --------------------------------------------------------------------------------
-- 11. ENABLE REALTIME REPLICATION FOR POSTS AND CHAT
-- --------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- --------------------------------------------------------------------------------
-- 12. SEED STARTER DATA
-- --------------------------------------------------------------------------------
INSERT INTO public.homepage_content (section_key, title, content) VALUES
('hero_title', 'Building Tomorrow''s Strategic Leaders', 'A community of founders, leads, and thinkers dedicated to strategic growth and professional excellence.'),
('mission', 'Our Mission', 'To create a collaborative environment where aspiring leaders develop strategic thinking, industry awareness, and professional skills through weekly sessions, industry visits, and peer-to-peer learning.'),
('vision', 'Our Vision', 'To build a network of 1000+ strategic leaders who drive positive change in their industries and communities.')
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;

INSERT INTO public.footprints (stat_key, stat_value, stat_label, icon, display_order) VALUES
('months', '12+', 'Months Active', 'calendar', 1),
('members', '40+', 'Active Members', 'users', 2),
('meetings', '30+', 'Sunday Meetings', 'message-circle', 3),
('visits', '5+', 'Industry Visits', 'building', 4)
ON CONFLICT (stat_key) DO UPDATE SET stat_value = EXCLUDED.stat_value, stat_label = EXCLUDED.stat_label;

INSERT INTO public.activities (title, description, frequency, is_published, display_order) VALUES
('Sunday Meetings', 'Weekly strategic thinking sessions where members discuss industry trends, case studies, and personal development goals.', 'Every Sunday', TRUE, 1),
('Industry Visits', 'On-site visits to leading companies and startups to understand real-world business operations and culture.', 'Monthly', TRUE, 2),
('Talks & Meets', 'Guest speaker events featuring industry leaders, entrepreneurs, and strategic professionals.', 'Bi-monthly', TRUE, 3);

INSERT INTO public.journey_milestones (title, description, milestone_date, display_order, is_published) VALUES
('StratMen Founded', 'The idea of StratMen was born — a community for strategic thinkers.', '2025-01-15', 1, TRUE),
('First Sunday Meeting', 'Inaugural Sunday meeting with founding members discussing vision.', '2025-01-22', 2, TRUE),
('10th Member Joined', 'Our community reached double digits, validating our mission.', '2025-03-10', 3, TRUE),
('First Industry Visit', 'Members visited a leading tech enterprise for strategic exposure.', '2025-04-20', 4, TRUE),
('StratChat Launched', 'Our private community portal went live.', '2025-06-01', 5, TRUE),
('40+ Active Members', 'StratMen grew to over 40 active leaders across multiple domains.', '2025-12-15', 6, TRUE);

INSERT INTO public.team_members (name, role, bio, display_order, is_published) VALUES
('Varad Pimpalkhare', 'Founder & Lead', 'Visionary behind StratMen Foundation. Passionate about building strategic leaders.', 1, TRUE),
('Nikhil Sharma', 'Co-Lead', 'Strategic thinker and operations expert.', 2, TRUE),
('Tejasvi Intern', 'Tech Lead', 'Full-stack developer building the digital platform.', 3, TRUE);
