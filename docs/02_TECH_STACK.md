# Tech Stack & Architecture Document
# StratMen Foundation Website + StratChat (Supabase + Cloudinary)
**Version**: 2.0.0
**Last Updated**: 2026-08-10

---

## 1. Architecture Overview

```
+===========================================+     +==========================================+
|              FRONTEND                     |     |           BACKEND & DATABASE             |
|  stratmen-frontend/                       |     |                                          |
|  React 19 + Vite 8 + TailwindCSS 4       |  ←→ |  SUPABASE (PostgreSQL + RLS + Auth)     |
|  shadcn/ui + Framer Motion               |     |  - Supabase Auth (Email + Google OAuth)  |
|  React Router DOM 7 + Redux Toolkit      |     |  - Supabase Database (PostgreSQL + RLS)  |
|  @supabase/supabase-js Client SDK        |     |  - Supabase Realtime (WebSockets)        |
+===========================================+     +==========================================+
                     |                                              |
                     v                                              v
          +====================+                         +===================+
          |     HOSTING        |                         |   IMAGE STORAGE   |
          |  Vercel / Netlify  |                         |    Cloudinary     |
          |  (Frontend SPA)    |                         |  (CDN + WebP Comp)|
          +====================+                         +===================+
```

---

## 2. Complete Tech Stack

| Layer | Technology | Version | Purpose | Cost |
|:---|:---|:---|:---|:---|
| **Database & Auth** | Supabase (PostgreSQL) | Latest | Managed Postgres DB, RLS, Auth, Realtime | Free tier |
| **Authentication** | Supabase Auth | Latest | Email/password + Google OAuth 2.0 | Free |
| **Access Control** | PostgreSQL RLS Policies | Latest | Row-Level Security on all tables | Free |
| **Realtime Engine** | Supabase Realtime | Latest | WebSockets for feed updates & group chat | Free |
| **Image CDN** | Cloudinary | Latest | Image upload, CDN, WebP compression | Free (25GB) |
| **Frontend Framework** | React | 19.x | Component-based UI | Free |
| **Build Tool** | Vite | 8.x | Fast dev server and production builds | Free |
| **CSS Framework** | TailwindCSS | 4.x | Utility-first CSS | Free |
| **UI Components** | shadcn/ui | Latest | Pre-built accessible components | Free |
| **Animation** | Framer Motion | 12.x | Page transitions, micro-animations | Free |
| **State Management** | Redux Toolkit + React-Redux | Latest | Global state (auth, UI) | Free |
| **Routing** | React Router DOM | 7.x | Client-side SPA routing | Free |
| **HTTP Client / SDK** | `@supabase/supabase-js` | Latest | Direct DB queries & Auth calls | Free |
| **Forms** | React Hook Form + Zod | Latest | Form state + schema validation | Free |
| **Icons** | Lucide React + Tabler Icons | Latest | Clean icon sets | Free |
| **Fonts** | Google Fonts (Inter) | Latest | Premium typography | Free |
| **Toast Notifications** | Sonner | Latest | Toast notification system | Free |
| **Theming** | next-themes | Latest | Dark/Light mode toggle | Free |
| **Hosting (Frontend)** | Vercel | Latest | Static + SPA hosting | Free |
| **Version Control** | Git + GitHub | Latest | Source code management | Free |

---

## 3. Modular Architecture (Supabase Services Pattern)

Even though Supabase handles backend infrastructure, the frontend codebase maintains a clean, modular structure mirroring the Green Saviours modular pattern:

```
src/
├── config/
│   ├── supabaseClient.js       # Initialized Supabase client SDK
│   └── cloudinary.js           # Cloudinary upload configuration
│
├── services/                   # Modular service layer wrapping Supabase calls
│   ├── authService.js          # login, register, googleOAuth, logout, getSession
│   ├── allowlistService.js     # checkAllowlist, addMember, revokeMember, getAllowlist
│   ├── joinRequestService.js   # submitApplication, getRequests, updateStatus
│   ├── postService.js          # getFeedPosts, createPost, deletePost, toggleLike, toggleBookmark
│   ├── commentService.js       # getComments, addComment, deleteComment
│   ├── chatService.js          # getMessages, sendMessage, deleteMessage, subscribeChat
│   ├── adminService.js         # getStats, getLogs, logAction, manageUsers
│   └── contentService.js       # getActivities, getJourney, getTeam, getFootprints
│
├── hooks/                      # Custom hooks wrapping services & Realtime
│   ├── useAuth.js              # Auth state + session listener
│   ├── useAllowlist.js         # Allowlist check state
│   ├── usePosts.js             # Posts fetch + Supabase Realtime subscription
│   └── useChat.js              # Group chat messages + Supabase Realtime subscription
```

---

## 4. Environment Variables

### Frontend `.env.example`
```env
# ── Supabase Credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# ── Cloudinary (Image Uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=stratmen_posts
```

### Supabase Dashboard Configuration
```env
# ── App URL (Redirect URLs for Google OAuth)
SITE_URL=http://localhost:3000
ADDITIONAL_REDIRECT_URLS=https://stratmen.vercel.app/auth/callback
```
