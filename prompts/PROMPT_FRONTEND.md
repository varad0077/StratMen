# StratMen Foundation — FRONTEND-ONLY BUILD PROMPT

---

## YOUR TASK

Build the complete React frontend for **StratMen Foundation** using React 19 + Vite 8, TailwindCSS 4, shadcn/ui, Framer Motion, `@supabase/supabase-js`, and Cloudinary.

---

## NAVIGATION & PAGES TO BUILD

### 1. Public Marketing Pages (PublicLayout):
- `/` — **Home**: Hero ("Building Tomorrow's Strategic Leaders"), Mission/Vision cards, Footprint animated counters, Seed→Tree splash screen animation on initial load.
- `/activities` — **Activities**: Cards for Sunday Meetings, Industry Visits, Talks & Meets.
- `/journey` — **Journey**: Vertical timeline view with scroll-reveal milestone cards.
- `/about` — **About Us**: Background story & Team member cards.

### 2. StratChat Entry Gate & Auth (Unauthenticated / Guest):
- `/stratchat` — **StratChat Landing Gate**: Combined glassmorphism card:
  - Top Box: **Log In to StratChat** (Google OAuth button + Email/Password form).
  - Below Box: **New to StratChat? Apply to Join** (Embedded Join Us form: Full Name, Email, Phone, LinkedIn URL, Why Join textarea).
- `/auth/callback` — **Google OAuth Callback**: Token handler.
- `/access-pending` — **Access Pending Screen**: Shown to authenticated users who are awaiting admin allowlist approval.

### 3. StratChat Portal Pages (Protected — StratChatLayout with Auth + Allowlist Guard):
- `/stratchat/feed` — **Social Feed**: PostCreator (text + Cloudinary WebP image upload), FilterBar (All / Saved / My Posts), PostCard list (like, comment, bookmark, copy link, delete).
- `/stratchat/profile` — **Member Profile**: Member avatar, role, stats cards (Posts, Likes, Bookmarks), My Posts list.
- `/stratchat/chat` — **Realtime Group Chat**: Instant chat window powered by Supabase Realtime CDC channels.
- `/stratchat/admin` — **Integrated Admin Portal** (Admin Only):
  - Join Requests Review Tab (Approve → auto-adds to allowlist & emails user, or Reject).
  - Allowlist Management Tab (View members, add member, revoke access, promote to admin).
  - User Management Tab (Search users, suspend, unsuspend, delete).
  - Content Management Tab (Edit homepage text, footprint stats, activities, milestones, team).
  - Audit Logs Tab (View admin action log).

---

## LAYOUT & SIDEBAR NAVIGATION

### StratChat Left Sidebar (After Auth & Allowlist Check):
```
[Avatar] Member Name [Role Badge]

NAVIGATION:
🏠 Feed
💬 Group Chat
👤 Profile

ADMIN ONLY:
⚙️ Admin Portal  (Visible only if user.role === 'admin' or user.is_admin === true)
```

---

## FORM VALIDATION & IMAGE UPLOADS

- **Form Validation**: All forms (Log In, Join Us Application, Post Creator, Admin Forms) validated using React Hook Form + Zod schemas.
- **Image Uploads**: Compress images to WebP on client side before uploading directly to Cloudinary unsigned upload preset. Pass Cloudinary URL to database.

---

## DESIGN SYSTEM

- **Theme**: Dark-mode-first, premium, modern (`#0F0F0F` bg, `#1A1A1A` surface, `#A8E63D` lime-green accent).
- **Typography**: Inter (Google Fonts).
- **Animations**: Framer Motion for page transitions, scroll-reveals, hover lifts, toast notifications.
- **Toast Notifications**: Sonner.
