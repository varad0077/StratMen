# Backend Architecture Reference
# StratMen Foundation

---

## Full File Map

```
stratmen-backend/
├── .env                              # Environment variables (NEVER commit)
├── .env.example                      # Template with all required vars
├── .gitignore                        # Ignore node_modules, .env, uploads/
├── package.json                      # Dependencies + scripts
├── server.js                         # Entry: creates HTTP server, PORT
├── run_migration.js                  # Runs all SQL migrations in order
│
├── database/
│   ├── migrations/                   # 19 numbered SQL files
│   │   ├── 001_create_users.sql
│   │   ├── ... (002-019)
│   │   └── 019_create_email_notification_logs.sql
│   └── seeds/
│       └── seed_data.sql             # Initial admin, content, stats
│
├── uploads/                          # Temporary file uploads (gitignored)
│
├── tests/                            # Jest test files
│   ├── auth.test.js
│   ├── posts.test.js
│   └── ...
│
└── src/
    ├── app.js                        # Express app: middleware, routes, error handler
    │
    ├── config/
    │   ├── db.js                     # MySQL connection pool (mysql2/promise)
    │   ├── env.js                    # Env var validation on startup
    │   ├── mailer.js                 # Nodemailer transporter (Gmail SMTP)
    │   ├── passport.js               # Google OAuth strategy
    │   └── cloudStorage.js           # Cloudinary config
    │
    ├── middlewares/
    │   ├── authenticate.js           # JWT Bearer verification → req.user
    │   ├── authorize.js              # Role check: authorize('admin')
    │   ├── checkAllowlist.js         # Email in allowlist? → req.user.isAllowlisted
    │   ├── errorHandler.js           # Global 500 handler
    │   ├── rateLimiter.js            # authLimiter + apiLimiter
    │   ├── uploadHandler.js          # Multer config
    │   └── auditLogger.js            # Auto-log admin actions
    │
    ├── services/                     # Cross-cutting services
    │   ├── tokenService.js           # JWT generate/verify/save/revoke/rotate
    │   ├── emailService.js           # Email templates + send + log
    │   └── fileUploadService.js      # Cloudinary upload helper
    │
    ├── utils/
    │   ├── apiResponse.js            # { success(), error() } helpers
    │   ├── constants.js              # App constants
    │   ├── logger.js                 # Logging utility
    │   └── pagination.js             # Pagination helper
    │
    └── modules/                      # Feature modules (16 total)
        ├── auth/                     # 8 files (includes Google OAuth)
        ├── users/                    # 4 files
        ├── admin/                    # 4 files
        ├── allowlist/                # 5 files
        ├── join-requests/            # 5 files
        ├── activities/               # 4 files
        ├── journey/                  # 4 files
        ├── team/                     # 4 files
        ├── footprints/               # 4 files
        ├── homepage/                 # 4 files
        ├── posts/                    # 5 files
        ├── comments/                 # 4 files
        ├── likes/                    # 4 files
        ├── bookmarks/                # 4 files
        └── chat/                     # 4 files
```

---

## app.js Route Registration

```javascript
// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Core middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth',           require('./modules/auth/auth.routes'));
app.use('/api/auth',           require('./modules/auth/auth.google.routes'));
app.use('/api/users',          require('./modules/users/users.routes'));
app.use('/api/admin',          require('./modules/admin/admin.routes'));
app.use('/api/allowlist',      require('./modules/allowlist/allowlist.routes'));
app.use('/api/join-requests',  require('./modules/join-requests/joinRequests.routes'));
app.use('/api/activities',     require('./modules/activities/activities.routes'));
app.use('/api/journey',        require('./modules/journey/journey.routes'));
app.use('/api/team',           require('./modules/team/team.routes'));
app.use('/api/footprints',     require('./modules/footprints/footprints.routes'));
app.use('/api/homepage',       require('./modules/homepage/homepage.routes'));
app.use('/api/posts',          require('./modules/posts/posts.routes'));
app.use('/api/comments',       require('./modules/comments/comments.routes'));
app.use('/api/likes',          require('./modules/likes/likes.routes'));
app.use('/api/bookmarks',      require('./modules/bookmarks/bookmarks.routes'));
app.use('/api/chat',           require('./modules/chat/chat.routes'));

// Serve uploads
app.use('/uploads', express.static(require('path').join(__dirname, '../uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
```
