# Design & Layout Document
# StratMen Foundation + StratChat
**Version**: 2.1.0
**Last Updated**: 2026-08-10

---

## 1. Design Philosophy

- **Premium & Modern**: Clean, dark-mode-first design with strong typography, lime-green accent (`#A8E63D`), and subtle glassmorphism.
- **Unified Gateway**: The public website focuses on marketing (Home, Activities, Journey, About Us). All authentication, membership application, and admin management are consolidated inside **StratChat**.
- **Responsive**: Mobile-first design that adapts cleanly across screen sizes.

---

## 2. Public Website Navigation Bar

```
+-----------------------------------------------------------------------+
| [StratMen Logo]   Home    Activities    Journey    About Us | [StratChat] |
+-----------------------------------------------------------------------+
```
- Fixed/sticky top navbar with backdrop blur.
- No standalone Join Us page in the navbar. Clicking **StratChat** opens the StratChat Entry Gate (`/stratchat`).

---

## 3. StratChat Entry Gate Layout (`/stratchat`)

```
+-----------------------------------------------------------------------+
|  [Gradient/Blurred background with glassmorphism container]           |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |  [StratMen Logo]                                                |  |
|  |  "Welcome to StratChat"                                         |  |
|  |  "The private community hub for StratMen leaders"              |  |
|  |                                                                 |  |
|  |  ┌───────────────────────────────────────────────────────────┐  |  |
|  |  │ 🔑 LOG IN TO STRATCHAT                                    │  |  |
|  |  │ [ Continue with Google ] (Button with Google logo)        │  |  |
|  |  │ ── OR ──                                                  │  |  |
|  |  │ Email:    [__________________________________________]    │  |  |
|  |  │ Password: [__________________________________________]    │  |  |
|  |  │           [ Log In ] (Lime green CTA)                     │  |  |
|  |  └───────────────────────────────────────────────────────────┘  |  |
|  |                                                                 |  |
|  |  ────────────────────── NEW TO STRATCHAT? ────────────────────  |  |
|  |                                                                 |  |
|  |  ┌───────────────────────────────────────────────────────────┐  |  |
|  |  │ 📝 APPLY TO JOIN STRATCHAT                                │  |  |
|  |  │ Full Name:   [__________________________________________] │  |  |
|  |  │ Email:       [__________________________________________] │  |  |
|  |  │ Phone:       [__________________________________________] │  |  |
|  |  │ LinkedIn:    [__________________________________________] │  |  |
|  |  │ Why Join?:   [__________________________________________] │  |  |
|  |  │              [__________________________________________] │  |  |
|  |  │              [ Submit Application ] (Outline button)      │  |  |
|  |  └───────────────────────────────────────────────────────────┘  |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 4. StratChat Feed Layout (With Integrated Admin Portal)

```
+------------------+---------------------------+------------------+
|   LEFT SIDEBAR   |       CENTER FEED         |  RIGHT SIDEBAR   |
|   (280px fixed)  |     (flex-1, scrollable)  |  (280px fixed)   |
|                  |                           |                  |
| [Avatar]         | [PostCreator]             | Verified Members |
| [Name]           | "What's on your mind?"    | [Avatar + Name]  |
| [Role Badge]     | [Add Image] [Post]        | [Avatar + Name]  |
|                  |                           |                  |
| ── Navigation ── | [FilterBar]               | ── Stats ──      |
| [🏠 Feed]        | [All] [Saved] [My Posts]  | Total Posts: 124 |
| [💬 Group Chat]  |                           | Members: 40      |
| [👤 Profile]     | [PostCard]                |                  |
|                  | [PostCard]                |                  |
| ── ADMIN ONLY ── | [PostCard]                |                  |
| [⚙️ Admin Portal]| ...                       |                  |
+------------------+---------------------------+------------------+
```

When an Admin clicks **`⚙️ Admin Portal`**, the center content view switches to the Admin Portal tabs:
- **Join Requests Tab**: View pending applications → Click `Approve` (auto-adds to allowlist) or `Reject`.
- **Allowlist Management Tab**: View approved emails, add new email, revoke access, promote to admin.
- **User Management Tab**: Search users, suspend, unsuspend, delete.
- **Website Content Management Tab**: Edit homepage text, activities, journey milestones, team members, footprint counters.
- **Audit Logs Tab**: View real-time log of administrative actions.
