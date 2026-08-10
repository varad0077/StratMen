# StratMen Foundation — SUPABASE & BACKEND SERVICES PROMPT

---

## YOUR TASK

Build the complete backend service layer for **StratMen Foundation** using **Supabase** (`@supabase/supabase-js`) and **Cloudinary**.

---

## ARCHITECTURE & SERVICES

Instead of a traditional standalone Express server, the backend infrastructure is powered by **Supabase** (PostgreSQL, Auth, RLS, Realtime) and **Cloudinary** (Images).

Build modular frontend services in `src/services/` wrapping Supabase SDK calls:

```
src/
├── config/
│   ├── supabaseClient.js             # Initialized Supabase client
│   └── cloudinary.js                 # Cloudinary upload configuration
│
├── services/
│   ├── authService.js                # login, register, googleOAuth, logout, getSession
│   ├── allowlistService.js           # checkAllowlist, addMember, revokeMember, getAllowlist
│   ├── postService.js                # getFeedPosts, createPost, deletePost, toggleLike, toggleBookmark
│   ├── commentService.js             # getComments, addComment, deleteComment
│   ├── chatService.js                # getMessages, sendMessage, deleteMessage
│   ├── joinRequestService.js         # submitApplication, getRequests, updateStatus
│   ├── adminService.js               # getStats, getLogs, logAction
│   └── contentService.js       # getActivities, getJourney, getTeam, getFootprints
```

---

## KEY SERVICES SPECIFICATION

### 1. `authService.js`
- `login(email, password)`: `supabase.auth.signInWithPassword({ email, password })`
- `register(email, password, fullName)`: `supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })`
- `loginWithGoogle()`: `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })`
- `logout()`: `supabase.auth.signOut()`
- `getSession()`: `supabase.auth.getSession()`

### 2. `allowlistService.js`
- `checkAllowlist(email)`: Queries `allowlist` table for email → returns `{ is_allowed: boolean, is_admin: boolean }`
- `addMember(email, name, role, isAdmin)`: Inserts into `allowlist` (admin only via RLS)
- `revokeMember(email)`: Deletes from `allowlist` (admin only via RLS)

### 3. `postService.js`
- `getFeedPosts(filter)`: Queries `posts` with author, likes, comments count (allowlisted users only)
- `createPost(content, imageUrl)`: Inserts post record
- `deletePost(postId)`: Deletes post (author or admin)
- `toggleLike(postId)`: Inserts/Deletes from `likes` table
- `toggleBookmark(postId)`: Inserts/Deletes from `bookmarks` table

### 4. `chatService.js`
- `getMessages()`: Selects from `chat_messages` with author profile (limit 100)
- `sendMessage(content)`: Inserts into `chat_messages`
- `deleteMessage(messageId)`: Deletes message (author or admin)

---

## SECURITY & RLS

All database queries automatically pass through Supabase Row-Level Security (RLS) policies. No unauthorized user can read or write data without satisfying the RLS `is_allowlisted()` or `is_admin()` policy conditions.
