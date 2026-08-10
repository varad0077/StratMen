# API Contract Document
# StratMen Foundation Backend API
**Version**: 1.0.0
**Base URL**: `http://localhost:5000/api`

---

## Response Format

All endpoints return responses in this format:

**Success:**
```json
{ "success": true, "message": "...", "data": { ... } }
```

**Error:**
```json
{ "success": false, "message": "...", "errors": [ ... ] }
```

---

## 1. Authentication (`/api/auth`)

### POST `/api/auth/register` — Register new user
**Access**: Public | **Rate Limited**: Yes (10/15min)
```
Body: { full_name, phone, email, password, city?, gender?, interests? }
Response 201: { userId, email }
Errors: 409 (email exists), 422 (validation)
Side Effects: Sends verification email
```

### GET `/api/auth/verify-email?token=xxx` — Verify email
**Access**: Public
```
Query: token (UUID)
Response 200: "Email verified successfully"
Errors: 400 (invalid/expired token)
```

### POST `/api/auth/resend-verification` — Resend verification email
**Access**: Public | **Rate Limited**: Yes
```
Body: { email }
Response 200: "If registered and unverified, a new verification link has been sent"
```

### POST `/api/auth/login` — Login with email/password
**Access**: Public | **Rate Limited**: Yes
```
Body: { email, password }
Response 200: { accessToken, user: { id, full_name, email, phone, role, city, gender, profile_photo_url } }
Cookie Set: refreshToken (HttpOnly, Secure, SameSite=Strict, 30d)
Errors: 401 (invalid credentials), 403 (suspended/unverified)
```

### POST `/api/auth/refresh` — Refresh access token
**Access**: Public (requires valid refresh token)
```
Cookie: refreshToken OR Body: { refreshToken }
Response 200: { accessToken }
Cookie Set: New refreshToken (rotated)
Errors: 401 (invalid/expired refresh token)
```

### POST `/api/auth/logout` — Logout
**Access**: Public
```
Cookie: refreshToken OR Body: { refreshToken }
Response 200: "Logged out successfully"
Cookie Cleared: refreshToken
```

### POST `/api/auth/forgot-password` — Request password reset
**Access**: Public | **Rate Limited**: Yes
```
Body: { email }
Response 200: "If registered, a password reset link has been sent"
Side Effects: Sends reset email (if user exists)
```

### POST `/api/auth/reset-password` — Reset password with token
**Access**: Public | **Rate Limited**: Yes
```
Body: { token, password }
Response 200: "Password reset successfully"
Side Effects: Revokes all refresh tokens, sends password changed email
Errors: 400 (invalid/expired token), 422 (validation)
```

### POST `/api/auth/change-password` — Change password (authenticated)
**Access**: Authenticated
```
Headers: Authorization: Bearer <accessToken>
Body: { current_password, new_password }
Response 200: "Password changed successfully"
Side Effects: Revokes all refresh tokens, clears cookie, sends email
Errors: 400 (wrong current password), 422 (validation)
```

### GET `/api/auth/me` — Get current user profile
**Access**: Authenticated
```
Headers: Authorization: Bearer <accessToken>
Response 200: { id, full_name, phone, email, email_verified_at, city, gender, interests, profile_photo_url, role, is_suspended, created_at }
Errors: 404 (user not found)
```

---

## 2. Google OAuth (`/api/auth/google`)

### GET `/api/auth/google` — Initiate Google OAuth
**Access**: Public
```
Redirects to: Google consent screen
```

### GET `/api/auth/google/callback` — Google OAuth callback
**Access**: Public (called by Google)
```
On Success: Redirects to FRONTEND_URL/auth/google/success?token=<accessToken>
On Failure: Redirects to FRONTEND_URL/sign-in?error=google_auth_failed
Cookie Set: refreshToken
```

---

## 3. Allowlist (`/api/allowlist`)

### GET `/api/allowlist` — List all allowlisted members
**Access**: Authenticated + Admin
```
Query: ?search=email&page=1&limit=20
Response 200: { members: [...], pagination: { total, page, limit, total_pages } }
```

### GET `/api/allowlist/check` — Check if current user is allowlisted
**Access**: Authenticated
```
Response 200: { is_allowed: true, is_admin: false }
Response 200: { is_allowed: false }
```

### POST `/api/allowlist` — Add member to allowlist
**Access**: Authenticated + Admin
```
Body: { email, name, role?, is_admin? }
Response 201: { email, name, role, is_admin, created_at }
Errors: 409 (already exists), 422 (validation)
Side Effects: Sends approval email, logs admin action
```

### PATCH `/api/allowlist/:email` — Update member in allowlist
**Access**: Authenticated + Admin
```
Body: { role?, is_admin? }
Response 200: Updated member object
Side Effects: Logs admin action
```

### DELETE `/api/allowlist/:email` — Remove member from allowlist
**Access**: Authenticated + Admin
```
Response 200: "Member access revoked"
Side Effects: Logs admin action
```

---

## 4. Join Requests (`/api/join-requests`)

### POST `/api/join-requests` — Submit a join request (public)
**Access**: Public | **Rate Limited**: Yes
```
Body: { full_name, email, phone, linkedin_url?, reason }
Response 201: "Application submitted successfully"
Errors: 409 (email already submitted), 422 (validation)
Side Effects: Sends notification email to admin
```

### GET `/api/join-requests` — List all join requests
**Access**: Authenticated + Admin
```
Query: ?status=pending|approved|rejected&page=1&limit=20
Response 200: { requests: [...], pagination: { ... } }
```

### PATCH `/api/join-requests/:id` — Update request status
**Access**: Authenticated + Admin
```
Body: { status: "approved" | "rejected", admin_notes? }
Response 200: Updated request object
Side Effects:
  - If approved: Auto-creates allowlist entry, sends approval email
  - If rejected: Sends rejection email
  - Logs admin action
```

---

## 5. Users (`/api/users`)

### GET `/api/users/profile` — Get own profile
**Access**: Authenticated
```
Response 200: Full user object
```

### PATCH `/api/users/profile` — Update own profile
**Access**: Authenticated
```
Body: { full_name?, phone?, city?, gender? }
Response 200: Updated user object
```

### PATCH `/api/users/profile-photo` — Update profile photo
**Access**: Authenticated
```
Body: FormData with 'photo' file
Response 200: { profile_photo_url }
```

---

## 6. Posts (`/api/posts`) — StratChat Feed

### GET `/api/posts` — List posts (feed)
**Access**: Authenticated + Allowlisted
```
Query: ?page=1&limit=20&filter=all|saved|mine
Response 200: {
  posts: [{
    id, author_id, content, image_url, is_pinned, created_at,
    author: { id, full_name, avatar, role },
    like_count, comment_count, is_liked, is_bookmarked
  }],
  pagination: { ... }
}
```

### POST `/api/posts` — Create a post
**Access**: Authenticated + Allowlisted
```
Body: { content, image_url? }
Response 201: New post object with author details
Errors: 422 (content required)
```

### PATCH `/api/posts/:id` — Update a post
**Access**: Authenticated + Allowlisted (author only, or admin)
```
Body: { content?, image_url?, is_pinned? }
Response 200: Updated post object
Errors: 403 (not author/admin), 404 (not found)
```

### DELETE `/api/posts/:id` — Delete a post
**Access**: Authenticated + Allowlisted (author or admin)
```
Response 200: "Post deleted"
Side Effects: Cascading delete of comments, likes, bookmarks
Errors: 403 (not author/admin), 404 (not found)
```

---

## 7. Comments (`/api/comments`)

### GET `/api/comments?post_id=xxx` — Get comments for a post
**Access**: Authenticated + Allowlisted
```
Query: post_id (required)
Response 200: [{
  id, post_id, author_id, content, created_at,
  author: { id, full_name, avatar }
}]
```

### POST `/api/comments` — Add a comment
**Access**: Authenticated + Allowlisted
```
Body: { post_id, content }
Response 201: New comment with author details
Errors: 422 (validation)
```

### DELETE `/api/comments/:id` — Delete a comment
**Access**: Authenticated + Allowlisted (author or admin)
```
Response 200: "Comment deleted"
Errors: 403, 404
```

---

## 8. Likes (`/api/likes`)

### POST `/api/likes/toggle` — Toggle like on a post
**Access**: Authenticated + Allowlisted
```
Body: { post_id }
Response 200: { liked: true|false, like_count: number }
```

---

## 9. Bookmarks (`/api/bookmarks`)

### POST `/api/bookmarks/toggle` — Toggle bookmark on a post
**Access**: Authenticated + Allowlisted
```
Body: { post_id }
Response 200: { bookmarked: true|false }
```

---

## 10. Chat Messages (`/api/chat`)

### GET `/api/chat/messages` — Get recent chat messages
**Access**: Authenticated + Allowlisted
```
Query: ?limit=100&before_id=xxx (for pagination/load older)
Response 200: [{
  id, author_id, content, is_pinned, created_at,
  author: { id, full_name, avatar }
}]
```

### POST `/api/chat/messages` — Send a chat message
**Access**: Authenticated + Allowlisted
```
Body: { content }
Response 201: New message with author details
Errors: 422 (empty content)
```

### DELETE `/api/chat/messages/:id` — Delete a chat message
**Access**: Authenticated + Allowlisted (author or admin)
```
Response 200: "Message deleted"
Errors: 403, 404
```

---

## 11. Admin (`/api/admin`)

### GET `/api/admin/stats` — Dashboard statistics
**Access**: Authenticated + Admin
```
Response 200: {
  total_users, total_posts, total_allowlisted, total_pending_requests,
  total_chat_messages, total_activities
}
```

### GET `/api/admin/logs` — Activity audit logs
**Access**: Authenticated + Admin
```
Query: ?page=1&limit=20
Response 200: {
  logs: [{ id, admin_id, admin_name, admin_email, action, target_table, target_id, details, created_at }],
  pagination: { ... }
}
```

### GET `/api/admin/users` — User management list
**Access**: Authenticated + Admin
```
Query: ?id=1&search=name&status=active|suspended&page=1&limit=20
Response 200: { users: [...], pagination: { ... } }
```

### PATCH `/api/admin/users?id=1&action=suspend` — Suspend/unsuspend user
**Access**: Authenticated + Admin
```
Response 200: Updated user object
Side Effects: Logs admin action
```

### DELETE `/api/admin/users?id=1` — Delete user
**Access**: Authenticated + Admin
```
Response 200: "User deleted"
Side Effects: Logs admin action
```

---

## 12. Public Content APIs

### GET `/api/activities` — List published activities
**Access**: Public
```
Response 200: [{ id, title, description, image_url, impact_summary, created_at }]
```

### GET `/api/journey` — List journey milestones
**Access**: Public
```
Response 200: [{ id, title, description, milestone_date, image_url, display_order }]
```

### GET `/api/team` — List team members
**Access**: Public
```
Response 200: [{ id, name, role, photo_url, linkedin_url, display_order }]
```

### GET `/api/footprints` — Get impact statistics
**Access**: Public
```
Response 200: { months: 12, members: 40, meetings: 30, industry_visits: 5 }
```

### GET `/api/homepage` — Get homepage content
**Access**: Public
```
Response 200: { hero_title, hero_subtitle, mission_text, vision_text }
```

### POST `/api/contact` — Submit contact form
**Access**: Public | **Rate Limited**: Yes
```
Body: { name, email, subject, message }
Response 201: "Message sent successfully"
Side Effects: Sends email notification to admin
```

---

## 13. Admin Content Management APIs

### Activities CRUD
```
POST   /api/activities          → Create (Admin, with image upload)
PATCH  /api/activities/:id      → Update (Admin)
DELETE /api/activities/:id      → Delete (Admin)
```

### Journey Milestones CRUD
```
POST   /api/journey             → Create (Admin)
PATCH  /api/journey/:id         → Update (Admin)
DELETE /api/journey/:id         → Delete (Admin)
```

### Team Members CRUD
```
POST   /api/team                → Create (Admin, with photo upload)
PATCH  /api/team/:id            → Update (Admin)
DELETE /api/team/:id            → Delete (Admin)
```

### Footprints
```
PATCH  /api/footprints          → Update stats (Admin)
```

### Homepage Content
```
PATCH  /api/homepage            → Update content (Admin)
```

---

## Middleware Chain Examples

| Endpoint Pattern | Middleware Chain |
|:---|:---|
| Public GET | `apiLimiter → controller` |
| Public POST (form) | `authLimiter → validationRules → validate → controller` |
| Auth endpoint | `authLimiter → validationRules → validate → controller` |
| Member endpoint | `apiLimiter → authenticate → checkAllowlist → controller` |
| Admin endpoint | `apiLimiter → authenticate → authorize('admin') → controller` |
| Admin + Allowlist | `apiLimiter → authenticate → authorize('admin') → checkAllowlist → controller` |
