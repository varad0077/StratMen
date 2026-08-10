# StratMen Foundation — MASTER BUILD PROMPT (Supabase + Cloudinary)
# Feed this entire document to your AI coding model

---

## YOUR TASK

You are building a full-stack, industry-grade website for **StratMen Foundation** — an organization that builds strategic leaders through weekly meetings, industry visits, and community activities.

The project consists of two unified layers:
1. **Public Marketing Website** — Professional landing site with Home, Activities, Journey, About Us pages.
2. **StratChat (Member & Admin Portal)** — The community hub. When users open StratChat (`/stratchat`), they land on an entry gate containing **Log In** at top, and an embedded **Join Us / Register Application** section right below it. Once authenticated and approved:
   - **Members** access the private social feed, post daily updates, interact, and participate in real-time group chat.
   - **Admins** access all member features PLUS the integrated **Admin Portal** directly inside StratChat navigation (`/stratchat/admin`).

---

## ARCHITECTURE & TECH STACK (Mandatory)

### Backend & Infrastructure: Supabase + Cloudinary
- **Database**: Managed PostgreSQL on **Supabase**
- **Security & Authorization**: PostgreSQL **Row-Level Security (RLS)** policies on all tables
- **Authentication**: **Supabase Auth** (Email/Password + Google OAuth 2.0)
- **Realtime**: **Supabase Realtime** (WebSockets for feed updates & group chat)
- **Image Storage & CDN**: **Cloudinary** (direct unsigned upload, client-side WebP compression)

### Frontend: React 19 + Vite 8 SPA (`stratmen-frontend/`)
- **SDK**: `@supabase/supabase-js` (Supabase Client)
- **Styling**: TailwindCSS 4 + shadcn/ui components
- **State Management**: Redux Toolkit + React-Redux
- **Routing**: React Router DOM 7
- **Forms & Validation**: React Hook Form + Zod schema validation
- **Animations**: Framer Motion (page transitions, scroll reveals, micro-animations)
- **Icons**: Lucide React + Tabler Icons
- **Typography**: Inter (Google Fonts)
- **Toast Notifications**: Sonner

---

## NAVIGATION & ROUTING MODEL

### Public Marketing Pages:
- `/` — **Home** (Hero, Mission/Vision, Footprint stats, Splash screen animation)
- `/activities` — **Activities** (Sunday Meetings, Industry Visits, Talks cards)
- `/journey` — **Journey** (Vertical timeline milestone view)
- `/about` — **About Us** (Background story & team profile cards)

### StratChat Entry Gate & Auth:
- `/stratchat` — **StratChat Landing Gate**: Log In at top (Google OAuth / Email) + Embedded "Apply to Join" Form right below.
- `/auth/callback` — **Google OAuth Callback** handler.
- `/access-pending` — **Access Pending Screen** shown to authenticated users awaiting admin allowlist approval.

### StratChat Portal Pages (Protected — Auth + Allowlist Guard):
- `/stratchat/feed` — **Social Feed** (PostCreator, FilterBar, PostCard list, comments, likes, bookmarks).
- `/stratchat/profile` — **Member Profile** (Stats, My Posts).
- `/stratchat/chat` — **Realtime Group Chat** (WebSocket CDC subscription).
- `/stratchat/admin` — **Integrated Admin Portal** (Admin Only — Join Requests Review, Allowlist Mgmt, User Mgmt, Content Mgmt, Audit Logs).

---

## DATABASE SCHEMA (Supabase PostgreSQL + RLS)

Execute the following SQL migrations in Supabase SQL Editor:

### 1. Helper Security Functions (Allowlist & Admin Check)
```sql
CREATE OR REPLACE FUNCTION public.is_allowlisted()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowlist
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
```

### 2. Core Tables with RLS

```sql
-- Profiles table (synced 1:1 with auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self update profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Allowlist table (Access Gate for StratChat)
CREATE TABLE public.allowlist (
  email TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'StratMen Member',
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  added_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.allowlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allowlist viewable by self or admin" ON public.allowlist FOR SELECT USING (is_admin() OR LOWER(email) = LOWER(auth.jwt()->>'email'));
CREATE POLICY "Allowlist manageable by admin" ON public.allowlist FOR ALL USING (is_admin());

-- StratChat Feed Posts
CREATE TABLE public.posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read posts" ON public.posts FOR SELECT USING (is_allowlisted());
CREATE POLICY "Insert posts" ON public.posts FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());
CREATE POLICY "Delete posts" ON public.posts FOR DELETE USING (author_id = auth.uid() OR is_admin());
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;

-- StratChat Comments, Likes, Bookmarks, Group Chat Messages, Join Requests
-- (Complete SQL in database/migrations/ folder)
```

---

## FRONTEND STRUCTURE & SERVICES

```
src/
├── config/
│   ├── supabaseClient.js             # createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
│   └── cloudinary.js                 # Cloudinary upload helper
│
├── services/
│   ├── authService.js                # login, register, googleOAuth, logout, getSession
│   ├── allowlistService.js           # checkAllowlist, addMember, revokeMember
│   ├── postService.js                # getFeedPosts, createPost, deletePost, toggleLike, toggleBookmark
│   ├── commentService.js             # getComments, addComment, deleteComment
│   ├── chatService.js                # getMessages, sendMessage, deleteMessage
│   ├── joinRequestService.js         # submitApplication, reviewApplication
│   └── adminService.js               # getStats, getLogs, logAction
│
├── hooks/
│   ├── useAuth.js                    # Auth listener with supabase.auth.onAuthStateChange
│   ├── usePosts.js                   # Fetch posts + Supabase Realtime subscription
│   └── useChat.js                    # Fetch messages + Supabase Realtime subscription
│
├── views/
│   ├── landing/ (Home, Activities, Journey, About Us)
│   └── pages/
│       └── stratchat/
│           ├── StratChatLanding.jsx  # Combined Gate (Log In + Embedded Join Us Application)
│           ├── Feed.jsx
│           ├── Profile.jsx
│           ├── GroupChat.jsx
│           └── AdminPortal.jsx       # Integrated Admin Portal (Admin Only)
```

---

## CRITICAL IMPLEMENTATION RULES

1. **No standalone `/join` route**: All membership applications are submitted via the embedded "Apply to Join" form inside the StratChat Entry Gate (`/stratchat`).
2. **Integrated Admin Portal**: The Admin Portal (`/stratchat/admin`) is accessed directly inside StratChat navigation for Admin users.
3. **All database writes and reads for StratChat MUST pass RLS `is_allowlisted()` checks.**
4. **All administrative functions MUST pass RLS `is_admin()` checks.**
5. **Use Supabase Realtime Channels (`supabase.channel()`)** for live social feed updates and instant group chat messages.
6. **Compress images to WebP on client** before uploading directly to Cloudinary via unsigned upload preset.
7. **Form Validation**: Validate all forms with Zod schemas and React Hook Form.
8. **Aesthetics**: Dark-mode-first, smooth Framer Motion animations, glassmorphism cards, Inter typography.

---

## FILES TO REFERENCE

The complete PostgreSQL migrations with RLS policies are provided in `database/migrations/` (001 to 019).
The seed data is in `database/seeds/seed_data.sql`.
The Supabase client setup & security specs are in `docs/06_SECURITY.md`.
The realtime spec is in `docs/08_STRATCHAT_REALTIME.md`.

Build the ENTIRE project following these specifications.
