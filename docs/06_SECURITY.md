# Security & Rules Document (Supabase RLS & Cloudinary)
# StratMen Foundation + StratChat
**Version**: 2.0.0
**Last Updated**: 2026-08-10

---

## 1. Security Architecture

1. **Supabase Auth**: Authentication managed via Supabase Auth (`auth.users`), handling email/password and Google OAuth 2.0.
2. **Row-Level Security (RLS)**: Access control enforced at the database level using PostgreSQL RLS policies on ALL tables.
3. **Allowlist Gatekeeper**: Function & trigger check if an authenticated user's email exists in the `allowlist` table. Unapproved users are blocked from inserting/reading StratChat data via RLS.
4. **Cloudinary WebP Compression**: Images uploaded directly to Cloudinary via unsigned upload preset after client-side compression to WebP.
5. **No Exposure of Service Role Key**: Only `VITE_SUPABASE_ANON_KEY` is exposed in frontend. Administrative write operations restricted via RLS policies checking user role.
6. **Audit Trail**: Admin actions logged to `admin_action_logs` table via RPC functions.

---

## 2. Supabase RLS Policies & Functions

### 2.1 Allowlist Helper Functions

```sql
-- Helper function: Check if current user is allowlisted
CREATE OR REPLACE FUNCTION public.is_allowlisted()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowlist
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowlist
    WHERE LOWER(email) = LOWER(auth.jwt() ->> 'email')
      AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 2.2 Table-by-Table RLS Specifications

#### Table: `allowlist`
- **SELECT**: Accessible by Admins only (`is_admin() = true`). Also accessible by own user to check status (`LOWER(email) = LOWER(auth.jwt()->>'email')`).
- **INSERT / UPDATE / DELETE**: Accessible by Admins only (`is_admin() = true`).

```sql
ALTER TABLE public.allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allowlist readable by admin or self" ON public.allowlist
  FOR SELECT USING (is_admin() OR LOWER(email) = LOWER(auth.jwt() ->> 'email'));

CREATE POLICY "Allowlist manageable by admin" ON public.allowlist
  FOR ALL USING (is_admin());
```

#### Table: `posts`
- **SELECT**: Accessible by allowlisted members (`is_allowlisted() = true`).
- **INSERT**: Accessible by allowlisted members (`is_allowlisted() = true` AND `author_id = auth.uid()`).
- **UPDATE / DELETE**: Author (`author_id = auth.uid()`) OR Admin (`is_admin() = true`).

```sql
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts readable by allowlisted members" ON public.posts
  FOR SELECT USING (is_allowlisted());

CREATE POLICY "Posts insertable by allowlisted members" ON public.posts
  FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());

CREATE POLICY "Posts deletable by author or admin" ON public.posts
  FOR DELETE USING (author_id = auth.uid() OR is_admin());
```

#### Table: `comments`
- **SELECT**: Allowlisted members (`is_allowlisted() = true`).
- **INSERT**: Allowlisted members (`is_allowlisted() = true` AND `author_id = auth.uid()`).
- **DELETE**: Author (`author_id = auth.uid()`) OR Admin (`is_admin() = true`).

```sql
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments readable by allowlisted" ON public.comments
  FOR SELECT USING (is_allowlisted());

CREATE POLICY "Comments insertable by allowlisted" ON public.comments
  FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());

CREATE POLICY "Comments deletable by author or admin" ON public.comments
  FOR DELETE USING (author_id = auth.uid() OR is_admin());
```

#### Table: `likes` & `bookmarks`
- **SELECT**: Allowlisted members (`is_allowlisted() = true`).
- **INSERT / DELETE**: Own user (`user_id = auth.uid()` AND `is_allowlisted() = true`).

```sql
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes manageable by owner" ON public.likes
  FOR ALL USING (user_id = auth.uid() AND is_allowlisted());

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookmarks manageable by owner" ON public.bookmarks
  FOR ALL USING (user_id = auth.uid() AND is_allowlisted());
```

#### Table: `chat_messages`
- **SELECT**: Allowlisted members (`is_allowlisted() = true`).
- **INSERT**: Allowlisted members (`is_allowlisted() = true` AND `author_id = auth.uid()`).
- **DELETE**: Author (`author_id = auth.uid()`) OR Admin (`is_admin() = true`).

```sql
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat readable by allowlisted" ON public.chat_messages
  FOR SELECT USING (is_allowlisted());

CREATE POLICY "Chat insertable by allowlisted" ON public.chat_messages
  FOR INSERT WITH CHECK (is_allowlisted() AND author_id = auth.uid());

CREATE POLICY "Chat deletable by author or admin" ON public.chat_messages
  FOR DELETE USING (author_id = auth.uid() OR is_admin());
```

#### Public Website Tables (`activities`, `journey_milestones`, `team_members`, `footprints`, `homepage_content`)
- **SELECT**: Publicly readable by anyone (`true`).
- **INSERT / UPDATE / DELETE**: Accessible by Admins only (`is_admin() = true`).

```sql
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Activities public read" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Activities admin write" ON public.activities FOR ALL USING (is_admin());

ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journey public read" ON public.journey_milestones FOR SELECT USING (true);
CREATE POLICY "Journey admin write" ON public.journey_milestones FOR ALL USING (is_admin());

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team public read" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team admin write" ON public.team_members FOR ALL USING (is_admin());

ALTER TABLE public.footprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Footprints public read" ON public.footprints FOR SELECT USING (true);
CREATE POLICY "Footprints admin write" ON public.footprints FOR ALL USING (is_admin());

ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Homepage public read" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Homepage admin write" ON public.homepage_content FOR ALL USING (is_admin());
```

#### Table: `join_requests`
- **INSERT**: Publicly insertable (`true`) — validation via client & Zod schema.
- **SELECT / UPDATE**: Admins only (`is_admin() = true`).

```sql
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Join request public submit" ON public.join_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Join request admin manage" ON public.join_requests FOR ALL USING (is_admin());
```

---

## 3. Client-Side Security & Cloudinary Upload

```javascript
// Validation before upload to Cloudinary
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const validateAndUploadImage = async (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, GIF, and WebP formats are accepted.');
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    throw new Error('File size exceeds maximum limit of 10MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return data.secure_url;
};
```
