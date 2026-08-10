# Deployment & Pre-Launch Checklist
**Version**: 1.0.0

---

## 1. Development Environment Setup

### Prerequisites
- [ ] Node.js 20.x LTS installed
- [ ] MySQL 8.x installed and running
- [ ] Git installed
- [ ] VS Code or preferred editor

### Backend Setup
```bash
cd stratmen-backend
cp .env.example .env          # Fill in all values
npm install
node run_migration.js         # Run all database migrations
npm run dev                   # Start with nodemon on port 5000
```

### Frontend Setup
```bash
cd stratmen-frontend
cp .env.example .env          # Fill in VITE_API_URL
npm install
npm run dev                   # Start Vite dev server on port 3000
```

---

## 2. Third-Party Service Setup

### MySQL Database
- [ ] Create database `stratmen_foundation`
- [ ] Run all migration scripts in order (001 → 019)
- [ ] Run seed data for initial admin user
- [ ] Verify all tables created with `SHOW TABLES`

### Google OAuth Setup
- [ ] Go to console.cloud.google.com
- [ ] Create a new project (or use existing)
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
- [ ] Copy Client ID → `GOOGLE_CLIENT_ID` in backend .env
- [ ] Copy Client Secret → `GOOGLE_CLIENT_SECRET` in backend .env
- [ ] For production: Add production callback URL

### Cloudinary Setup
- [ ] Create free account at cloudinary.com
- [ ] Go to Settings → Upload → Upload Presets
- [ ] Create an Unsigned Upload Preset named `stratmen_posts`
- [ ] Set folder to `stratmen/posts`
- [ ] Copy Cloud Name → `CLOUDINARY_CLOUD_NAME` in backend .env
- [ ] Copy API Key → `CLOUDINARY_API_KEY` in backend .env
- [ ] Copy API Secret → `CLOUDINARY_API_SECRET` in backend .env
- [ ] Copy Cloud Name → `VITE_CLOUDINARY_CLOUD_NAME` in frontend .env

### SMTP Email Setup (Gmail)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password: Google Account → Security → App Passwords
- [ ] Copy App Password → `SMTP_PASS` in backend .env
- [ ] Set `SMTP_USER` to your Gmail address

---

## 3. Security Checklist

### Authentication
- [ ] JWT Access Secret is a random 32+ character string
- [ ] JWT Refresh Secret is DIFFERENT from access secret
- [ ] Refresh tokens stored in HttpOnly cookies
- [ ] Token rotation implemented (old token deleted on refresh)
- [ ] Password hashing uses bcryptjs with 12 rounds

### Authorization
- [ ] `authenticate` middleware on all protected routes
- [ ] `authorize('admin')` on all admin-only routes
- [ ] `checkAllowlist` on all StratChat routes
- [ ] Protected route guards in frontend

### Input Security
- [ ] express-validator on ALL endpoints with user input
- [ ] Parameterized SQL queries everywhere (no string concatenation)
- [ ] Image file type + size validation (client + server)
- [ ] Rate limiting on auth endpoints (10 per 15 min per IP)
- [ ] Rate limiting on API endpoints (100 per 15 min per IP)

### Secrets
- [ ] `.env` in `.gitignore`
- [ ] No secrets in frontend code
- [ ] No `console.log` of sensitive data in production
- [ ] CORS configured with specific origins (not `*`)

---

## 4. Production Deployment

### Backend (Railway / Render)
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Railway/Render
- [ ] Set all environment variables (from .env.example)
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your production frontend URL
- [ ] Update `GOOGLE_CALLBACK_URL` to production URL
- [ ] Deploy and verify health check: `GET /health`

### Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables: `VITE_API_URL`, `VITE_CLOUDINARY_*`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Deploy and verify all pages load

### Database (PlanetScale / Railway MySQL)
- [ ] Create production MySQL instance
- [ ] Run all migrations
- [ ] Run seed data (admin user)
- [ ] Update `DB_*` env vars in backend
- [ ] Test connection

---

## 5. Post-Deployment Verification

### Public Website
- [ ] Home page loads with hero, mission, vision, footprint stats
- [ ] Activities page shows activity cards
- [ ] Journey page shows timeline
- [ ] About Us page shows team members
- [ ] Join Us form submits successfully
- [ ] StratChat landing page loads

### Authentication
- [ ] Email/password registration works
- [ ] Verification email received and link works
- [ ] Login with email/password works
- [ ] Google OAuth login works
- [ ] Token refresh works (wait 1 hour or manually expire)
- [ ] Logout works (tokens cleared)
- [ ] Forgot/reset password flow works

### StratChat
- [ ] Allowlisted user can access feed
- [ ] Non-allowlisted user sees "Access Pending"
- [ ] Post creation works (text only)
- [ ] Post creation works (text + image)
- [ ] Like toggle works
- [ ] Comment add/delete works
- [ ] Bookmark toggle works
- [ ] Copy link works
- [ ] Post delete works (author)
- [ ] Group chat messages send/receive
- [ ] Profile page shows stats

### Admin
- [ ] Admin dashboard shows stats
- [ ] Join request review works (approve/reject)
- [ ] Allowlist management (add/remove/toggle admin)
- [ ] User management (suspend/unsuspend/delete)
- [ ] Admin can delete any post/comment
- [ ] Activity logs display correctly
- [ ] Content management (activities, journey, team, footprints)

### Responsive
- [ ] All pages work on mobile (< 768px)
- [ ] All pages work on tablet (768-1024px)
- [ ] All pages work on desktop (> 1024px)
- [ ] Hamburger menu works on mobile
- [ ] StratChat sidebars collapse properly on mobile

---

## 6. Performance Checklist

- [ ] Images compressed to WebP before upload
- [ ] Lazy loading for page components (React.lazy + Suspense)
- [ ] Database queries use proper indexes
- [ ] API pagination on all list endpoints
- [ ] Frontend build optimized (Vite production build)
- [ ] Feed loads in < 2 seconds
- [ ] No memory leaks (intervals cleared on unmount)
