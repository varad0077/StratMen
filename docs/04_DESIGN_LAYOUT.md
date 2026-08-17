# Design & Layout Document
# StratMen Foundation + StratChat
**Version**: 3.0.0 (Strategic Editorial Theme)
**Last Updated**: 2026-08-17

---

## 1. Design Philosophy

- **Strategic & Editorial**: Clean, warm-neutral canvas (`#F7F7F2`) with crisp white card surfaces (`#FFFFFF`), authoritative charcoal typography (`#202420`), deep green primary accents (`#315B45`), and mint highlights (`#63D9A3`) applied strictly for selective heading emphasis.
- **Unified Gateway**: The public website focuses on marketing (Home, Activities, Journey, About Us). All authentication, membership application, and admin management are consolidated inside **StratChat**.
- **No Image Dependency**: The layout is engineered to look complete and high-end through typography, spacing, subtle border framing, and CSS dot-grid patterns without requiring photographic hero banners.
- **Responsive**: Mobile-first design that adapts cleanly across phone, tablet, and desktop viewports.

---

## 2. Color Palette & Token System

| Token | Hex | Usage |
|---|---|---|
| `bg-warm` | `#F7F7F2` | Primary page background |
| `bg-white` | `#FFFFFF` | Card surfaces, navbars, modals, and sidebars |
| `text-dark` | `#202420` | Headings, brand wordmark, high-contrast text |
| `text-mid` | `#68706A` | Subtitles, body text, form labels, metadata |
| `text-muted` | `#9BA89D` | Placeholders, captions, timestamps |
| `green-deep` | `#315B45` | Primary buttons, active markers, brand accents |
| `green-mint` | `#63D9A3` | Selective keyword highlights in editorial headings |
| `green-soft` | `#E4F1E8` | Selected tabs, icon backgrounds, tag pills |
| `border-subtle` | `#E1E5DF` | Card borders, dividers, input borders |
| `border-mid` | `#C8D0C8` | Stronger borders and scrollbar thumb |

---

## 3. Public Website Navigation Bar

```
+-----------------------------------------------------------------------+
| [StratMen Logo]   Home    Activities    Journey    About Us | [StratChat] |
+-----------------------------------------------------------------------+
```
- Fixed/sticky top navbar with crisp white background and subtle bottom border (`#E1E5DF`).
- Active link marked with deep green text and a 2px solid bottom bar.
- No standalone Join Us page in the navbar. Clicking **StratChat** opens the StratChat Entry Gate (`/stratchat`).

---

## 4. StratChat Entry Gate Layout (`/stratchat`)

```
+-----------------------------------------------------------------------+
|  [Warm canvas with clean centered card container]                     |
|                                                                       |
|  +-----------------------------------------------------------------+  |
|  |  [StratMen Shield Logo]                                         |  |
|  |  "Welcome to StratChat"                                         |  |
|  |  "The private community hub for StratMen leaders"              |  |
|  |                                                                 |  |
|  |  ┌───────────────────────────────────────────────────────────┐  |  |
|  |  │ 🔑 LOG IN TO STRATCHAT                                    │  |  |
|  |  │ [ Continue with Google ] (Light outline button)           │  |  |
|  |  │ ── OR EMAIL ──                                            │  |  |
|  |  │ Email:    [__________________________________________]    │  |  |
|  |  │ Password: [__________________________________________]    │  |  |
|  |  │           [ Log In ] (Deep green #315B45 CTA)             │  |  |
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
|  |  │              [ Submit Application ] (Deep green CTA)      │  |  |
|  |  └───────────────────────────────────────────────────────────┘  |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 5. StratChat Authenticated Layout (`/stratchat/*`)

```
+-----------------------------------------------------------------------+
|  HEADER: [StratMen Logo]                   [Admin Badge] [User Avatar]|
+-----------------------------------------------------------------------+
|  LEFT SIDEBAR  |  MAIN CONTENT AREA            |  RIGHT SIDEBAR       |
|  (256px)       |  (Flex-1)                     |  (256px, xl-only)    |
|                |                               |                      |
|  [Profile Card]|  Feed / Group Chat / Profile  |  [Verified Members]  |
|  - Feed        |  Admin Portal                 |  - Member list       |
|  - Group Chat  |                               |                      |
|  - Profile     |                               |  [Community Stats]   |
|  - Admin Portal|                               |  - Posts / Members   |
+-----------------------------------------------------------------------+
```

---

## 6. Typography Specs

- **Heading Font**: `Manrope` (Weights: 600, 700, 800)
- **Body Font**: `Inter` (Weights: 300, 400, 500, 600, 700)
- **Heading Split Principle**:
  - `Line 1 (Neutral)`: "Building Tomorrow's" (Color: `#202420`)
  - `Line 2 (Mint Accent)`: "Strategic Leaders." (Color: `#63D9A3`)
