# StratMen Foundation — Prompt-Ready Build Package
## Version 1.0.0 | Last Updated: 2026-08-10

---

## 📋 What Is This?

This folder contains **all documentation, database schemas, project structures, API contracts, and AI-ready prompts** needed to build the full **StratMen Foundation** website from scratch — modeled after the industry-grade patterns used in the **Green Saviours** project.

This is NOT the actual codebase. This is the **complete blueprint** designed to be fed into an AI coding model (Claude, GPT, etc.) to generate the actual implementation.

---

## 📁 Folder Structure

```
StratMen_Foundation_Prompt_Package/
│
├── README.md                          ← You are here
│
├── docs/
│   ├── 01_PRD.md                      ← Product Requirement Document
│   ├── 02_TECH_STACK.md               ← Complete tech stack & architecture
│   ├── 03_APP_FLOW.md                 ← Full application flow diagrams
│   ├── 04_DESIGN_LAYOUT.md            ← Design system, layouts, UI specs
│   ├── 05_USER_FLOW.md                ← User journeys for all personas
│   ├── 06_SECURITY.md                 ← Security rules, RLS, middleware
│   ├── 07_API_CONTRACT.md             ← Full REST API endpoint spec
│   ├── 08_STRATCHAT_REALTIME.md       ← StratChat + Group Chat realtime spec
│   └── 09_DEPLOYMENT_CHECKLIST.md     ← Pre-launch & deployment checklist
│
├── database/
│   ├── 00_SCHEMA_OVERVIEW.md          ← Visual schema overview & relationships
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_email_verifications.sql
│   │   ├── 003_create_password_resets.sql
│   │   ├── 004_create_refresh_tokens.sql
│   │   ├── 005_create_allowlist.sql
│   │   ├── 006_create_join_requests.sql
│   │   ├── 007_create_activities.sql
│   │   ├── 008_create_journey_milestones.sql
│   │   ├── 009_create_team_members.sql
│   │   ├── 010_create_homepage_content.sql
│   │   ├── 011_create_footprints.sql
│   │   ├── 012_create_contact_submissions.sql
│   │   ├── 013_create_posts.sql
│   │   ├── 014_create_comments.sql
│   │   ├── 015_create_likes.sql
│   │   ├── 016_create_bookmarks.sql
│   │   ├── 017_create_chat_messages.sql
│   │   ├── 018_create_admin_action_logs.sql
│   │   └── 019_create_email_notification_logs.sql
│   └── seeds/
│       └── seed_data.sql
│
├── backend_structure/
│   ├── BACKEND_ARCHITECTURE.md        ← Full backend folder/file map
│   ├── MODULE_PATTERN.md              ← Controller → Service → Model pattern
│   └── ENV_TEMPLATE.md                ← .env.example with all variables
│
├── frontend_structure/
│   ├── FRONTEND_ARCHITECTURE.md       ← Full frontend folder/file map
│   ├── COMPONENT_HIERARCHY.md         ← Component tree & relationships
│   └── ROUTING_MAP.md                 ← All routes, guards, layouts
│
└── prompts/
    ├── MASTER_PROMPT.md               ← THE main prompt to build the entire project
    ├── PROMPT_BACKEND.md              ← Backend-only build prompt
    ├── PROMPT_FRONTEND.md             ← Frontend-only build prompt
    └── PROMPT_DATABASE.md             ← Database setup prompt
```

---

## 🚀 How to Use

### Option 1: Build Everything at Once
Feed `prompts/MASTER_PROMPT.md` into your AI model. It references all other docs.

### Option 2: Build in Phases
1. Feed `prompts/PROMPT_DATABASE.md` → Set up database
2. Feed `prompts/PROMPT_BACKEND.md` → Build backend API
3. Feed `prompts/PROMPT_FRONTEND.md` → Build frontend

---

## 🏗️ Based On

This package is architecturally modeled after the **Green Saviours** project:
- **Backend**: Express.js + MySQL with modular Controller → Service → Model pattern
- **Frontend**: React + Vite with Redux, shadcn/ui, Tailwind, Framer Motion
- **Security**: JWT auth, Google OAuth, rate limiting, role-based access
- **Quality**: Input validation, error handling, audit logging, email notifications
