-- Seed Data for StratMen Foundation (PostgreSQL / Supabase)
-- Run this AFTER executing all 19 migration scripts in Supabase SQL Editor

-- ═══════════════════════════════════════════════════════════
-- 1. Add admin to allowlist
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.allowlist (email, name, role, is_admin)
VALUES (
  'admin@stratmen.org',
  'StratMen Admin',
  'Founder',
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- 2. Seed homepage content
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.homepage_content (section_key, title, content) VALUES
('hero_title', 'Building Tomorrow''s Strategic Leaders', 'A community of founders, leads, and thinkers dedicated to strategic growth and professional excellence.'),
('mission', 'Our Mission', 'To create a collaborative environment where aspiring leaders develop strategic thinking, industry awareness, and professional skills through weekly sessions, industry visits, and peer-to-peer learning.'),
('vision', 'Our Vision', 'To build a network of 1000+ strategic leaders who drive positive change in their industries and communities, fostering innovation and ethical leadership across all sectors.')
ON CONFLICT (section_key) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content;

-- ═══════════════════════════════════════════════════════════
-- 3. Seed footprint stats
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.footprints (stat_key, stat_value, stat_label, icon, display_order) VALUES
('months', '12+', 'Months Active', 'calendar', 1),
('members', '40+', 'Members', 'users', 2),
('meetings', '30+', 'Sunday Meetings', 'message-circle', 3),
('visits', '5+', 'Industry Visits', 'building', 4)
ON CONFLICT (stat_key) DO UPDATE SET stat_value = EXCLUDED.stat_value, stat_label = EXCLUDED.stat_label;

-- ═══════════════════════════════════════════════════════════
-- 4. Seed activities
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.activities (title, description, frequency, is_published, display_order) VALUES
('Sunday Meetings', 'Weekly strategic thinking sessions where members discuss industry trends, case studies, and personal development goals. Each session is led by a different member to build leadership skills.', 'Every Sunday', TRUE, 1),
('Industry Visits', 'On-site visits to leading companies and startups to understand real-world business operations, culture, and strategic decision-making processes.', 'Monthly', TRUE, 2),
('Talks & Meets', 'Guest speaker events featuring industry leaders, entrepreneurs, and professionals who share their experiences and insights on strategy, leadership, and innovation.', 'Bi-monthly', TRUE, 3);

-- ═══════════════════════════════════════════════════════════
-- 5. Seed journey milestones
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.journey_milestones (title, description, milestone_date, display_order, is_published) VALUES
('StratMen Founded', 'The idea of StratMen was born — a community for strategic thinkers and future leaders.', '2025-01-15', 1, TRUE),
('First Sunday Meeting', 'Our inaugural Sunday meeting with 5 founding members discussing the vision and roadmap.', '2025-01-22', 2, TRUE),
('10th Member Joined', 'Our community reached double digits — a milestone that validated our vision.', '2025-03-10', 3, TRUE),
('First Industry Visit', 'Members visited a leading tech company to understand corporate strategy firsthand.', '2025-04-20', 4, TRUE),
('StratChat Launched', 'Our private community portal went live, enabling members to connect digitally.', '2025-06-01', 5, TRUE),
('40+ Members', 'StratMen grew to over 40 active members across multiple cities.', '2025-12-15', 6, TRUE);

-- ═══════════════════════════════════════════════════════════
-- 6. Seed team members
-- ═══════════════════════════════════════════════════════════
INSERT INTO public.team_members (name, role, bio, display_order, is_published) VALUES
('Varad Pimpalkhare', 'Founder & Lead', 'Visionary behind StratMen Foundation. Passionate about building strategic leaders and fostering community-driven growth.', 1, TRUE),
('Nikhil Sharma', 'Co-Lead', 'Strategic thinker and operations expert. Drives the weekly meeting agenda and industry visit planning.', 2, TRUE),
('Tejasvi Intern', 'Tech Lead', 'Full-stack developer responsible for building and maintaining the StratMen digital platform.', 3, TRUE);
