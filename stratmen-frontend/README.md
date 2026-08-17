# ⚡ StratMen Frontend Application

The modern Single Page Application (SPA) powering the **StratMen Foundation** public presence and the **StratChat** private leadership community.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 + Vite 6 | Lightning-fast rendering and Hot Module Replacement (HMR) |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS configured with custom Strategic Editorial tokens |
| **Typography** | Manrope & Inter | Google Fonts preloaded for editorial hierarchy |
| **State Management** | Redux Toolkit | Centralized auth state, persistent sessions, and UI drawer states |
| **Forms & Validation** | React Hook Form + Zod | Schema-based client validation with instant error surfacing |
| **Animations** | Framer Motion | Smooth transitions, modal entrances, and layout animations |
| **Toasts / Notifications** | Sonner | Clean, light-themed notification system |
| **Icons** | Lucide React | Consistent, scalable vector icons |
| **Backend / BaaS** | Supabase JS Client | Authentication, PostgreSQL queries, and Realtime WebSocket events |
| **Media Hosting** | Cloudinary API | Client-side compression and WebP conversion for fast image feeds |

---

## 📐 Architecture & Folder Organization

```
stratmen-frontend/
├── src/
│   ├── assets/              ← Static media, SVG icons, logos
│   ├── components/          ← Reusable UI blocks
│   │   ├── ui/              ← Atomic primitives (Button, Card, Badge, Input, Avatar, Tabs)
│   │   ├── feed/            ← PostCreator, PostCard, CommentSection, FilterBar
│   │   └── chat/            ← ChatMessage and realtime indicators
│   ├── config/              ← Cloudinary & Supabase SDK setups
│   ├── hooks/               ← Custom lifecycle hooks (useAuth, usePosts, useChat)
│   ├── layout/              ← Public & StratChat Layout wrappers with Navbars/Sidebars
│   ├── lib/                 ← Utility functions (formatting, class mergers)
│   ├── routes/              ← Route definition, Auth guards, and Protected gates
│   ├── services/            ← Modular API service layer (auth, posts, comments, admin, content)
│   ├── store/               ← Redux slices (`authSlice.js`, `uiSlice.js`)
│   └── views/               ← Page-level components
│       ├── landing/         ← Home, HeroSection, MissionVision, FootprintStats
│       └── pages/           ← Activities, Journey, AboutUs, StratChat views
├── index.html               ← Entry HTML with preconnected Google Fonts
├── tailwind.config.js       ← Theme tokens (colors, radii, shadows)
└── vite.config.js           ← Vite build config with path aliases (`@/`)
```

---

## 🎨 Color System Tokens

```css
/* Page & Surface */
--bg-warm: #F7F7F2;         /* Primary warm off-white canvas */
--bg-white: #FFFFFF;        /* Crisp card surfaces and sidebars */

/* Text Hierarchy */
--text-dark: #202420;       /* High-contrast charcoal headings */
--text-mid: #68706A;        /* Balanced neutral body & secondary text */
--text-muted: #9BA89D;      /* Metadata, timestamps, placeholders */

/* Green Accents */
--green-deep: #315B45;      /* Primary interactive elements & buttons */
--green-mint: #63D9A3;      /* Strategic heading highlight (two-color principle) */
--green-soft: #E4F1E8;      /* Active tabs, tag pills, icon backdrops */

/* Borders */
--border-subtle: #E1E5DF;   /* Standard card & input borders */
--border-mid: #C8D0C8;      /* Contrast borders & dividers */
```

---

## 🧪 Available Scripts

In the `stratmen-frontend/` directory, you can run:

### `npm run dev`
Starts the local development server at `http://localhost:5173`.

### `npm run build`
Compiles and bundles the application for production inside the `dist/` directory.

### `npm run preview`
Locally previews the production build before deployment.

### `npm run lint`
Runs ESLint across all `.jsx` and `.js` files to ensure code quality.

---

## 🛡️ Production Deployment Guidelines

1. Ensure all environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`) are configured in your hosting platform (Vercel, Netlify, Cloudflare Pages).
2. Configure SPA rewrite rules (`/*` → `/index.html`) to support client-side routing.
3. Validate that Supabase Site URL and Redirect URLs match your production domain.
