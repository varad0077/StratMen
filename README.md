<div align="center">

# 🏛️ StratMen Foundation

**Building Tomorrow's Strategic Leaders**

An enterprise-grade, full-stack community platform and private digital ecosystem for ambitious founders, executives, and leaders.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20%26%20RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

</div>

---

## 🌟 Overview

**StratMen Foundation** is dedicated to bridging the gap between theoretical knowledge and real-world strategic decision-making. The platform comprises:

1. **Public Foundation Website** — Showcasing mission, weekly Sunday sessions, monthly industry visits, foundation journey milestones, and leadership profiles.
2. **StratChat Member Portal** — A gated, allowlist-only private social feed with media uploads, optimistic likes, bookmarks, and threaded discussions.
3. **Realtime Group Chat** — Instant WebSocket communication channel for active members and administrators.
4. **Integrated Admin Control Center** — Comprehensive admin portal to review join applications, manage membership allowlists, moderate users, and edit public website content in real time.

---

## 🎨 Visual Identity — Strategic Editorial Theme

The platform features an intentional **Strategic Editorial Design System** built for professional credibility:

| Token | Hex Value | Role & Usage |
|---|---|---|
| **Warm Canvas** | `#F7F7F2` | Primary page background; warm off-white |
| **Pure White** | `#FFFFFF` | Card surfaces, modals, navbars, and sidebar panels |
| **Dark Charcoal** | `#202420` | Primary headings, wordmark, and high-contrast body text |
| **Mid Neutral** | `#68706A` | Secondary text, captions, metadata labels |
| **Deep Green** | `#315B45` | Primary action color for buttons, CTAs, icons, and active indicators |
| **Mint Highlight** | `#63D9A3` | **Signature emphasis** — reserved strictly for key words in editorial headings |
| **Soft Green** | `#E4F1E8` | Selected state backgrounds, icon containers, and status badges |
| **Subtle Border** | `#E1E5DF` | Card borders, dividers, input borders |

### Typography Hierarchy
- **Headings:** `Manrope` (font-extrabold 800 & font-bold 700)
- **Body & UI:** `Inter` (weights 300 to 700)

---

## 📂 Repository Structure

```
StratMen_Foundation_Prompt_Package/
│
├── stratmen-frontend/                  ← Full React 19 SPA Application
│   ├── src/
│   │   ├── components/                 ← UI Primitives (Button, Card, Badge, Input, etc.)
│   │   │   ├── feed/                   ← Feed PostCreator, PostCard, CommentSection, FilterBar
│   │   │   └── chat/                   ← ChatMessage & group chat components
│   │   ├── config/                     ← Supabase & Cloudinary client configurations
│   │   ├── hooks/                      ← Custom hooks (useAuth, usePosts, useChat)
│   │   ├── layout/                     ← PublicLayout & StratChatLayout with Sidebars
│   │   ├── routes/                     ← AppRouter, ProtectedMemberRoute, AdminGuard
│   │   ├── services/                   ← Supabase API & content services
│   │   ├── store/                      ← Redux Toolkit auth & UI slices
│   │   └── views/                      ← Landing pages, Public pages, StratChat views
│   ├── tailwind.config.js              ← Custom theme design tokens
│   └── package.json
│
├── database/                           ← SQL Migrations, RLS policies, seed data
├── docs/                               ← Architecture specs, PRD, security rules
├── backend_structure/                  ← Backend reference & service schemas
├── prompts/                            ← AI prompt build blueprints
└── PROJECT_CHANGE_LOG.txt              ← Comprehensive version & change log
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**
- **Supabase Project** (URL & Anon Key)
- **Cloudinary Account** (Cloud name & Upload preset for media uploads)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/varad0077/StratMen.git
cd StratMen/stratmen-frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in `stratmen-frontend/`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
```

---

## 🔒 Security & Access Control

- **Allowlist Gatekeeper:** Unregistered users who authenticate via OAuth/email are routed to `/access-pending` until approved by an administrator.
- **Row Level Security (RLS):** Supabase PostgreSQL policies enforce data isolation for posts, comments, likes, and audit trails.
- **Role-Based Routing:** Protected routes verify member allowlist status and admin privileges before granting access to `/stratchat/*` and `/stratchat/admin`.

---

## 📄 License & Attribution

© 2026 StratMen Foundation. All rights reserved. Built with precision for tomorrow's strategic leaders.
