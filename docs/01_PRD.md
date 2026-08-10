# Product Requirement Document (PRD)
# StratMen Foundation Website + StratChat (Supabase + Cloudinary)
**Version**: 2.1.0
**Last Updated**: 2026-08-10

---

## 1. Product Overview

**StratMen Foundation** is an organization dedicated to building tomorrow's strategic leaders. The platform consists of two unified layers:

1. **Public Marketing Website** — A professional landing site presenting StratMen's mission, activities, journey timeline, team, and community impact to the world (Home, Activities, Journey, About Us).
2. **StratChat (Member & Admin Portal)** — The gateway to the StratMen community. When users open StratChat, they land on a unified entry gate with **Log In** and an embedded **Join Us / Register Application** section right below. Once authenticated and approved:
   - **Members** access the private social feed, post daily updates, interact, and participate in real-time group chat.
   - **Admins** access all member features PLUS the integrated **Admin Portal** directly inside StratChat (Dashboard, Join Requests Review, Allowlist Management, User Suspension, and Public Content Management).

---

## 2. Navigation & User Access Model

### 2.1 Navigation Structure

#### Public Marketing Website Header:
- **Logo**: StratMen Foundation Logo
- **Nav Links**: `Home` | `Activities` | `Journey` | `About Us`
- **CTA Button**: `StratChat` (Lime green pill button → opens `/stratchat`)

#### StratChat Entry Gate (`/stratchat`):
- **Primary Section**: Log In (Google OAuth / Email)
- **Secondary Section (Below Log In)**: "New to StratMen? Apply to Join" (Embedded application form: Full Name, Email, Phone, LinkedIn, Reason for joining).

#### StratChat Interior Navigation (After Auth & Allowlist Check):
- **Members**: `🏠 Feed` | `💬 Group Chat` | `👤 Profile`
- **Admins**: `🏠 Feed` | `💬 Group Chat` | `👤 Profile` | `⚙️ Admin Portal` *(Integrated inside StratChat)*

---

## 3. Users & Roles

### 3.1 Website Visitors (Public / Guest)
- Can browse the public marketing site (`Home`, `Activities`, `Journey`, `About Us`).
- Can click `StratChat` to open the entry gate and fill out the embedded Join Us application.

### 3.2 StratMen Members (Authenticated + Allowlisted)
- Can log in via Google OAuth or Email/Password on the StratChat landing page.
- Allowed access to StratChat Feed, Profile, and Realtime Group Chat.
- Can create posts with text & Cloudinary compressed WebP images.
- Can like, comment, bookmark, and delete own posts/comments.

### 3.3 Admins (Integrated Admin Portal inside StratChat)
- Access all member features plus the **Admin Portal** tab in StratChat navigation:
- **Join Requests**: Review, approve (adds to allowlist & emails applicant), or reject applications.
- **Allowlist Management**: Add, remove, or promote members to Admin.
- **User Management**: Search, suspend, unsuspend, or delete users.
- **Content Moderation**: Delete any post, comment, or chat message; pin announcements.
- **Audit Logs**: View real-time log of administrative actions.
- **Public Content Management**: Edit homepage text, footprint counters, activities, timeline milestones, and team members directly inside the Admin Portal.
