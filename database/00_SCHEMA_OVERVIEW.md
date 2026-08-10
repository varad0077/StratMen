# Database Schema Overview (Supabase PostgreSQL + RLS)
# StratMen Foundation
**Version**: 2.0.0

---

## Entity Relationship Diagram (PostgreSQL)

```
                       ┌─────────────────────────┐
                       │    auth.users           │
                       │    (Managed by Supabase)│
                       └────────────┬────────────┘
                                    │ 1:1
                                    ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    profiles      │       │    allowlist     │       │  join_requests   │
│──────────────────│       │──────────────────│       │──────────────────│
│ PK id (UUID)     │       │ PK email (TEXT)  │       │ PK id (BIGINT)   │
│    full_name     │  ←──  │    name          │       │    full_name     │
│    phone         │  ref  │    role          │       │    email         │
│    email (UQ)    │  ───  │    is_admin      │       │    phone         │
│    avatar_url    │       │    created_at    │       │    linkedin_url  │
│    role          │       └──────────────────┘       │    reason        │
│    is_suspended  │                                  │    status        │
│    created_at    │                                  │    admin_notes   │
│    updated_at    │                                  │    reviewed_by   │──→ profiles.id
└────────┬─────────┘                                  │    reviewed_at   │
         │                                            └──────────────────┘
         │ 1:N
    ┌────┴────────────────────────────────────────────┐
    │            │            │            │           │
    ▼            ▼            ▼            ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
│  posts  │ │comments │ │  likes  │ │bookmarks│ │chat_msgs │
│─────────│ │─────────│ │─────────│ │─────────│ │──────────│
│PK id    │ │PK id    │ │PK(post, │ │PK(post, │ │PK id     │
│ author_id│→│ post_id │→│   user) │ │   user) │ │ author_id│
│ content │ │ author_id│ │         │ │         │ │ content  │
│ image_url│ │ content │ └─────────┘ └─────────┘ │ is_pinned│
│ is_pinned│ │created_at│                          │created_at│
│created_at│ └─────────┘                          └──────────┘
└─────────┘

    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │   activities     │  │journey_milestones│  │  team_members    │
    │──────────────────│  │──────────────────│  │──────────────────│
    │ PK id (BIGINT)   │  │ PK id (BIGINT)   │  │ PK id (BIGINT)   │
    │    title         │  │    title         │  │    name          │
    │    description   │  │    description   │  │    role          │
    │    image_url     │  │    milestone_date│  │    photo_url     │
    │    frequency     │  │    image_url     │  │    linkedin_url  │
    │    is_published  │  │    display_order │  │    display_order │
    │    created_by    │  │    is_published  │  │    is_published  │
    └──────────────────┘  └──────────────────┘  └──────────────────┘

    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │   footprints     │  │ homepage_content │  │contact_submissions│
    │──────────────────│  │──────────────────│  │──────────────────│
    │ PK id (BIGINT)   │  │ PK id (BIGINT)   │  │ PK id (BIGINT)   │
    │    stat_key      │  │    section_key   │  │    name          │
    │    stat_value    │  │    title         │  │    email         │
    │    stat_label    │  │    content       │  │    subject       │
    │    display_order │  │    image_url     │  │    message       │
    └──────────────────┘  └──────────────────┘  └──────────────────┘

    ┌──────────────────────┐  ┌──────────────────────────┐
    │ admin_action_logs    │  │ email_notification_logs   │
    │──────────────────────│  │──────────────────────────│
    │ PK id (BIGINT)       │  │ PK id (BIGINT)           │
    │    admin_id          │  │    type                  │
    │    action            │  │    recipient_email       │
    │    target_table      │  │    status                │
    │    details (JSONB)   │  │    error_message         │
    └──────────────────────┘  └──────────────────────────┘
```

---

## Key PostgreSQL + Supabase Features Enforced

1. **Auto Profile Sync Trigger**: On user sign up in `auth.users`, a database trigger automatically inserts a record into `public.profiles`.
2. **Supabase Row Level Security (RLS)**: Active on all tables with custom policy functions (`is_allowlisted()`, `is_admin()`).
3. **Supabase Realtime**: Enabled on `posts` and `chat_messages` tables for WebSockets.
