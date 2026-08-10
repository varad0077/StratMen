# Application Flow Document
# StratMen Foundation + StratChat
**Version**: 2.1.0
**Last Updated**: 2026-08-10

---

## 1. Overall App Navigation Flow

```
                    [ Visitor opens website ]
                                |
                                v
                    ==================
                    | PUBLIC WEBSITE |
                    ==================
                            |
           +----------------+----------------+
           |                |                |
           v                v                v
        [Home]        [Activities]       [Journey]       [About Us]
           |                                             |
           +--------------------+------------------------+
                                |
                                v
                    [ Click "StratChat" CTA ]
                                |
                                v
                   ==========================
                   | STRATCHAT ENTRY GATE   |
                   | (/stratchat)           |
                   ==========================
                   | [1] Log In Box         |
                   | (Google OAuth / Email) |
                   |                        |
                   | [2] Join Us / Register |
                   |     Application Form   |
                   | (Embedded right below) |
                   ==========================
                                |
                           [ LOG IN ]
                                |
                                v
                     [ Supabase Allowlist Check ]
                        /                \
                   APPROVED             NOT APPROVED
                      |                       |
                      v                       v
               ==================    [ Access Pending Screen ]
               | STRATCHAT PORTAL |   (Instructions to await approval)
               ==================
                      |
        +-------------+-------------+-------------------------+
        |                           |                         |
        v                           v                         v
     [ Feed ]                 [ Group Chat ]             [ Profile ]
  (Social feed,               (Realtime CDC               (My stats &
   posts, comments)            chat window)                post history)
                                                              |
                                                    (If User is Admin)
                                                              |
                                                              v
                                                   ======================
                                                   | ⚙️ ADMIN PORTAL     |
                                                   | (Inside StratChat) |
                                                   ======================
                                                   │ • Dashboard Stats  │
                                                   │ • Join Requests    │
                                                   │ • Allowlist Mgmt   │
                                                   │ • User Mgmt        │
                                                   │ • Content Mgmt     │
                                                   │ • Audit Logs       │
                                                   ======================
```

---

## 2. StratChat Entry Gate Flow (`/stratchat`)

```
[ Visitor opens /stratchat ]
        |
        v
+-------------------------------------------------------+
|                 WELCOME TO STRATCHAT                  |
|          The Private Community Hub for StratMen       |
|                                                       |
|   ┌───────────────────────────────────────────────┐   |
|   │ 🔐 LOG IN TO STRATCHAT                        │   |
|   │ [ Continue with Google ]                      │   |
|   │ Or Email: [_______] Password: [_______]       │   |
|   │ [ Log In Button ]                             │   |
|   └───────────────────────────────────────────────┘   |
|                                                       |
|   ┌───────────────────────────────────────────────┐   |
|   │ 📝 NEW TO STRATCHAT? APPLY TO JOIN            │   |
|   │ Full Name:   [___________________________]    │   |
|   │ Email:       [___________________________]    │   |
|   │ Phone:       [___________________________]    │   |
|   │ LinkedIn:    [___________________________]    │   |
|   │ Why Join?:   [___________________________]    │   |
|   │ [ Submit Application Button ]                 │   |
|   └───────────────────────────────────────────────┘   |
+-------------------------------------------------------+
```

### Path A: User logs in
1. Clicks "Continue with Google" or submits email/password.
2. Supabase Auth authenticates user.
3. System checks `public.allowlist` for user's email:
   - **Allowed**: User redirected to `/stratchat/feed`.
   - **Not Allowed**: User sees "Access Pending — Your email is not yet approved by an admin."

### Path B: User fills out Join Us form
1. Fills full name, email, phone, LinkedIn, and reason for joining.
2. Form validates client-side via Zod schema.
3. Submits → Inserts row into `public.join_requests` table with status `pending`.
4. Success toast: *"Application submitted! An admin will review your request."*
5. Admin gets notified and can approve from the integrated **Admin Portal** inside StratChat.

---

## 3. StratChat Navigation & Admin Portal Integration

When logged in as an **Admin**, the left navigation sidebar inside StratChat automatically displays the **Admin Portal** link:

```
+------------------------------------+
|  STRATCHAT NAVIGATION              |
|                                    |
|  🏠  Feed                          |
|  💬  Group Chat                    |
|  👤  Profile                       |
|                                    |
|  ── ADMIN ONLY ─────────────────── |
|  ⚙️  Admin Portal                  |
|      ├── Dashboard & Stats         |
|      ├── Join Requests (Approve)   |
|      ├── Allowlist Management      |
|      ├── User Management           |
|      └── Website Content Editor   |
+------------------------------------+
```
