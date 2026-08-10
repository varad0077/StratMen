# StratMen Foundation — DATABASE & SUPABASE SETUP PROMPT

---

## YOUR TASK

Set up the complete Supabase PostgreSQL database for the **StratMen Foundation** project. This includes creating all tables, applying Row Level Security (RLS) policies, database triggers, security helper functions, enabling Supabase Realtime, and seeding initial data.

---

## INFRASTRUCTURE

- **Database**: Supabase PostgreSQL
- **Security**: Row Level Security (RLS) on ALL tables
- **Auth Sync**: Database trigger automatically populating `public.profiles` from `auth.users`
- **Realtime**: WebSockets enabled for `public.posts` and `public.chat_messages`

---

## STEP 1: Execute Migration Scripts in Supabase SQL Editor

Run all 19 PostgreSQL migration files located in `database/migrations/` in numerical order:

| # | File | Table | Purpose |
|:--|:-----|:------|:--------|
| 1 | `001_create_users.sql` | `profiles` | Auth sync trigger + user profiles |
| 5 | `005_create_allowlist.sql` | `allowlist` | RLS helper functions (`is_allowlisted()`, `is_admin()`) & member gate |
| 6 | `006_create_join_requests.sql` | `join_requests` | Public application form submissions |
| 7 | `007_create_activities.sql` | `activities` | Public activity cards |
| 8 | `008_create_journey_milestones.sql` | `journey_milestones` | Timeline events |
| 9 | `009_create_team_members.sql` | `team_members` | Team member cards |
| 10 | `010_create_homepage_content.sql` | `homepage_content` | Hero/Mission/Vision content |
| 11 | `011_create_footprints.sql` | `footprints` | Impact counters |
| 12 | `012_create_contact_submissions.sql` | `contact_submissions` | Contact form data |
| 13 | `013_create_posts.sql` | `posts` | StratChat feed + Realtime publication |
| 14 | `014_create_comments.sql` | `comments` | Post comments |
| 15 | `015_create_likes.sql` | `likes` | Post likes (composite PK) |
| 16 | `016_create_bookmarks.sql` | `bookmarks` | Post bookmarks (composite PK) |
| 17 | `017_create_chat_messages.sql` | `chat_messages` | Group chat + Realtime publication |
| 18 | `018_create_admin_action_logs.sql` | `admin_action_logs` | Admin audit log |
| 19 | `019_create_email_notification_logs.sql` | `email_notification_logs` | Email log |

---

## STEP 2: Enable Realtime

Run the following SQL in Supabase SQL Editor:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
```

---

## STEP 3: Seed Initial Data

Run `database/seeds/seed_data.sql` in Supabase SQL Editor to populate:
- Default admin email in `allowlist` with `is_admin = TRUE`
- Homepage content (hero, mission, vision)
- Footprint counters (12+ Months, 40+ Members, 30+ Meetings, 5+ Visits)
- Sample activities and journey milestones
