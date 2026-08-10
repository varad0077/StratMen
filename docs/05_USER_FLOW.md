# User Flow Document
# StratMen Foundation + StratChat
**Version**: 1.0.0
**Last Updated**: 2026-08-10

---

## 1. User Personas

### Persona 1: Website Visitor (Guest)
- **Who**: A student, entrepreneur, or professional who discovered StratMen.
- **Goal**: Learn about StratMen Foundation and apply to join.
- **Access Level**: Public pages only (Home, Activities, Journey, About, Join Us, StratChat landing).

### Persona 2: StratMen Member (Authenticated + Allowlisted User)
- **Who**: An admin-approved member of the StratMen community.
- **Goal**: Read updates, post daily work done, comment, like, and chat with peers.
- **Access Level**: Full StratChat access (Feed, Profile, Group Chat).

### Persona 3: Admin
- **Who**: A core StratMen leader who manages the community.
- **Goal**: Control who joins StratChat, manage content, moderate posts/chat, manage public site content.
- **Access Level**: All Member access + Admin Dashboard + Content Management.

---

## 2. Guest User Journey

### Step 1: Discovery
1. Visitor lands on `stratmen.org/` (Home Page).
2. Splash screen plays (2s seed → tree animation).
3. Reads **Mission & Vision** sections.
4. Views animated **Footprint** stats (e.g., "12+ Months | 40+ Members | 30+ Sunday Meetings").

### Step 2: Exploration
1. Clicks navbar → **Activities** page.
   - Views cards: Sunday Meetings, Industry Visits, Talks & Meets.
   - Each card has photo, title, description, frequency.
2. Clicks navbar → **Journey** page.
   - Scrolls vertical timeline from founding to present.
   - Each milestone fades in on scroll.
3. Clicks navbar → **About Us** page.
   - Reads background story of StratMen Foundation.
   - Sees team member cards (name, role, photo, LinkedIn).

### Step 3: Decision to Join
1. Clicks **"Join Us"** in navbar or CTA button on Home page.
2. Fills out form:
   - Full Name (required, max 100 chars)
   - Email Address (required, valid email format)
   - Phone (required, 10 digits)
   - LinkedIn Profile URL (optional)
   - "Why do you want to join?" (required, 50-500 characters)
3. Clicks **"Submit Application"**.
4. Client-side validation runs first. If errors → inline error messages shown.
5. On success → POST to /api/join-requests → Server validates → Stores in DB.
6. Sees success toast: *"Your application has been received! Our admin team will review it."*
7. Admin receives notification email with the applicant's details.

### Step 4: Accessing StratChat (After Approval)
1. Admin approves the join request → Adds email to allowlist.
2. Guest receives approval email: *"Welcome to StratMen! You can now access StratChat."*
3. Returns to site → clicks **StratChat** in navbar.
4. Clicks **"Login to StratChat"** → Google OAuth popup.
5. Successfully authenticated + in allowlist → Redirected to Feed.

---

## 3. Member User Journey

### Step 1: Login
1. Opens website → clicks **StratChat** in navbar.
2. Sees StratChat landing page with Login button.
3. Clicks **"Login to StratChat"** → Google OAuth popup → selects their Google account.
4. Allowlist check passes → arrives at **Feed**.

### Step 2: Reading the Feed
1. Sees posts from all members, newest first.
2. Left sidebar shows their profile card (avatar, name, role, stats).
3. Right sidebar shows list of verified members and community stats.
4. Scrolls through posts.
5. Uses FilterBar: **All Posts** (default) / **Saved** (bookmarked) / **My Posts** (own posts).

### Step 3: Creating a Post
1. Clicks on **PostCreator** ("What's on your mind?").
2. Types text content (required).
3. (Optional) Clicks image icon → selects file from device.
   - File validated: Must be JPEG/PNG/GIF/WebP, max 10MB.
   - Preview shown in the creator.
4. Clicks **"Post"** → Button shows loading spinner.
5. Image (if any) compressed to WebP → uploaded to Cloudinary → URL returned.
6. POST /api/posts → Server validates → Inserts → Returns new post.
7. New post appears at top of feed instantly.
8. Success toast: *"Post published!"*

### Step 4: Interacting with Posts
1. **Like**: Clicks heart icon → toggles like (optimistic UI update, icon fills red, count changes).
2. **Comment**: Clicks comment icon → expands comment section → types comment → clicks send.
3. **Bookmark**: Clicks bookmark icon → saves post for later (icon fills accent color).
4. **Copy Link**: Clicks copy icon → link copied to clipboard → toast: *"Link copied!"*
5. **Delete** (own post): Clicks ⋮ menu → "Delete" → Confirmation dialog → Deletes.

### Step 5: Using Group Chat
1. Clicks **"Group Chat"** in left sidebar navigation.
2. Chat page loads last 100 messages.
3. Messages displayed: others' on left, own on right.
4. Types message in input → hits Enter or Send button.
5. Message appears instantly in chat.
6. New messages from others appear via polling/realtime.

### Step 6: Viewing Profile
1. Clicks **"Profile"** in left sidebar.
2. Sees: Avatar (Google), Name, Role badge, Member since date.
3. Stats: Total Posts, Total Likes Received, Total Bookmarks.
4. Tab: "My Posts" → list of all posts they've made.

### Step 7: Logout
1. Clicks Logout in header/sidebar.
2. Session cleared, tokens removed.
3. Redirected to Home page.

---

## 4. Admin User Journey

### Step 1: Login
1. Admin logs in via Google OAuth or Email/Password.
2. Role check → `is_admin = true` → sees admin navigation in sidebar.

### Step 2: Admin Dashboard
1. Navigates to `/admin/dashboard`.
2. Sees stat cards: Total Members, Total Posts, Pending Join Requests, Active Chat Users.
3. Sees recent activity logs table: who did what, when.

### Step 3: Managing Join Requests
1. Navigates to **Join Requests** page.
2. Sees list of pending applications (name, email, LinkedIn, reason, submitted date).
3. Can filter: Pending / Approved / Rejected.
4. For each request:
   - **Approve**: Adds email to allowlist → sends approval email → status changes to "approved".
   - **Reject**: Sends rejection email → status changes to "rejected".

### Step 4: Managing the Allowlist
1. Navigates to **Allowlist Management** page.
2. Sees all approved member emails with name, role, is_admin status.
3. Can **Add Member** manually (email, name, role, is_admin toggle).
4. Can **Revoke Access** → removes from allowlist → member kicked on next request.
5. Can **Toggle Admin** → promote/demote member.

### Step 5: Content Management
1. **Activities**: CRUD operations on activity cards (title, description, photo, frequency).
2. **Journey Milestones**: CRUD operations on timeline milestones (date, title, description, photo).
3. **Team Members**: CRUD operations on team member cards (name, role, photo, LinkedIn).
4. **Footprints**: Edit impact stats (months, members, meetings, visits).
5. **Homepage Content**: Edit hero text, mission, vision sections.

### Step 6: Content Moderation (StratChat)
1. As admin, can **delete any post** (not just own) in the feed.
2. Can **delete any comment** in any post.
3. Can **pin a post** to the top of the feed (announcement).
4. Can **delete any chat message** in Group Chat.

### Step 7: User Management
1. Navigates to **User Management** page.
2. Sees all users with search and filter (active/suspended).
3. Can **Suspend** a user → blocks login.
4. Can **Unsuspend** a user → restores access.
5. Can **Delete** a user → permanent removal.
6. All actions logged in admin_action_logs.

---

## 5. Error Handling User Experience

| Scenario | UX Behavior |
|:---|:---|
| Form validation fails | Inline red error message below each invalid field. Submit button stays enabled. |
| API returns 401 (token expired) | Automatic token refresh in background. If refresh fails → redirect to login. |
| API returns 403 (not in allowlist) | "Access Pending" screen with message to contact admin. |
| API returns 404 | "Page Not Found" with link back to home. |
| API returns 422 (validation error) | Toast notification with specific error message. |
| API returns 429 (rate limited) | Toast: "Too many requests. Please try again in 15 minutes." |
| API returns 500 | Toast: "Something went wrong. Please try again later." |
| Network error | Toast: "No internet connection. Check your network." |
| Image upload fails | Toast: "Upload failed. Please try again." + Remove preview. |
| Google OAuth popup blocked | Message: "Please allow popups for this site to login with Google." |

---

## 6. Session Management

| Behavior | Implementation |
|:---|:---|
| Access Token Lifetime | 1 hour |
| Refresh Token Lifetime | 30 days |
| Refresh Token Storage | HttpOnly, Secure, SameSite=Strict cookie |
| Access Token Storage | localStorage (frontend) |
| Token Rotation | Old refresh token deleted on each refresh |
| Logout | Deletes refresh token from DB + clears cookie + clears localStorage |
| Concurrent Sessions | Multiple devices allowed (each has own refresh token) |
| Password Change | Revokes ALL refresh tokens (force re-login on all devices) |
