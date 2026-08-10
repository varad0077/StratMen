# .env.example Template
# StratMen Foundation Backend

```env
# ══════════════════════════════════════════════
# SERVER
# ══════════════════════════════════════════════
PORT=5000
NODE_ENV=development

# ══════════════════════════════════════════════
# DATABASE (MySQL 8.x)
# ══════════════════════════════════════════════
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=stratmen_foundation

# ══════════════════════════════════════════════
# JWT AUTHENTICATION
# Generate: openssl rand -base64 32
# Windows:  [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
# ══════════════════════════════════════════════
JWT_ACCESS_SECRET=your_random_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_different_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=30d

# ══════════════════════════════════════════════
# GOOGLE OAUTH 2.0
# Setup at: https://console.cloud.google.com
# ══════════════════════════════════════════════
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ══════════════════════════════════════════════
# EMAIL / SMTP (Gmail)
# Use App Password: Google Account → Security → 2FA → App Passwords
# ══════════════════════════════════════════════
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
MAIL_FROM_NAME=StratMen Foundation
MAIL_FROM_ADDRESS=no-reply@stratmen.org

# ══════════════════════════════════════════════
# APP URLS
# ══════════════════════════════════════════════
APP_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# ══════════════════════════════════════════════
# TOKEN TTL (minutes)
# ══════════════════════════════════════════════
EMAIL_VERIFY_TTL_MINUTES=60
PASSWORD_RESET_TTL_MINUTES=15

# ══════════════════════════════════════════════
# CLOUDINARY (Image CDN)
# Setup at: https://cloudinary.com
# ══════════════════════════════════════════════
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=stratmen_posts
```
