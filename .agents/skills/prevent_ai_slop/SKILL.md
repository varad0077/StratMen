---
name: prevent_ai_slop
description: Enforces strict coding, architectural, and design quality standards to prevent AI code slop, truncated code snippets, missing error handling, and generic UI defaults for StratMen Foundation.
---

# Anti-Slop & Quality Enforcement Skill — StratMen Foundation

## 1. Zero Placeholder Code Policy
- **No Truncation**: Never use placeholders such as `// TODO`, `// ... existing code`, `// implement later`, or `// insert logic here`.
- **Complete Outputs**: Every created or updated file must contain complete, production-ready, drop-in replacement code.

## 2. Design System & Aesthetics Compliance
- **Strict Theme Tokens**:
  - Background: `#0F0F0F` (Dark) / `#F7F7F7` (Light)
  - Surface: `#1A1A1A` (Dark) / `#FFFFFF` (Light)
  - Accent: `#A8E63D` (Lime Green brand color)
  - Typography: `Inter` (Google Fonts)
- **No Generic Tailwind Colors**: Never default to generic Tailwind colors (e.g., `bg-blue-500` or plain red/green buttons) unless explicitly requested.
- **Rich Motion**: Incorporate Framer Motion animations (page transitions, hover lifts, micro-interactions) for all interactive UI elements.

## 3. Architecture & Data Integrity
- **Database-Level RLS Verification**: Verify that every Supabase PostgreSQL query enforces Row-Level Security (RLS) via policy functions (`is_allowlisted()`, `is_admin()`).
- **Exact Schema Types**: Verify database column names (`avatar_url`, `author_id`, `created_at`) before consuming them in services or hooks to prevent `undefined` crashes.

## 4. Error Handling & User Feedback
- **No Silent Error Swallowing**: Never write empty `catch (err) {}` blocks or return empty fallback arrays without logging or surfacing the error.
- **User Feedback**: Surface all API/operation errors via Sonner toast notifications or inline field error states.
