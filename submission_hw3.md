# HW3 Submission

## Q1. When a user searches, saves, and views on their profile — what systems are involved?

### Save (writing a diary entry)

**Flow:** Browser → Next.js API Route (`/api/diary/[date]`) → Clerk (auth check) → Supabase (upsert row)

1. User types → 800ms debounce fires in `useDiaryEntry.ts`
2. Hook calls `db.ts → saveEntry()` → `PUT /api/diary/2026-04-13`
3. API route calls `auth()` from Clerk — confirms who the user is
4. Writes to Supabase `diary_entries` table with that user's `user_id`

### Search

**Flow:** Browser → Next.js API Route (`/api/diary`) → Clerk → Supabase → back to browser (filtered client-side)

1. On page load, `search/page.tsx` calls `getAllEntries()` from `db.ts` → `GET /api/diary`
2. API route checks Clerk auth, queries Supabase for all rows where `user_id` = yours
3. Results returned to browser, then filtered in JS as you type (no extra server calls per keystroke)

### View on profile (Archive)

**Flow:** Browser → Next.js API Route (`/api/diary` or `/api/diary/[date]`) → Clerk → Supabase

1. Archive page calls `getAllEntries()` → `GET /api/diary` — same as search
2. Individual entry (`/archive/2026-04-13`) calls `getEntry(date)` → `GET /api/diary/2026-04-13`
3. Clerk always gates the API — you only ever get back your own rows

---

## Q2. Why should your app call the external API from the server (API route) instead of directly from the browser?

Three reasons:

1. **Secret keys stay secret** — API keys (like `NEWS_API_KEY`) can't be in browser code or anyone can steal them from DevTools.

2. **CORS** — many APIs block direct browser requests but allow server-to-server calls.

3. **Caching** — the server can cache responses so we don't have to re-hit so many times when more users are hitting the endpoint. For example, 100 users hitting the same news endpoint only triggers one real API call, not 100.

## Q3. What data do clerk and supabase store

Clerk offers the authorization service and stores the log in information. Supabase is a postgre SQL database that saves the diary information and user information. In this app, supabase doesn't know clerk, the next.js API get the unique id from Clerk and save it in supabase.

## Q4. Describe your database

The database is hosted on Supabase (PostgreSQL) and has 3 tables:

**`diary_entries`** — the core table. Each row is one diary entry written by one user.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key, auto-generated |
| `user_id` | text | Clerk user ID (e.g. `user_3CJYk...`) — ties the entry to an account |
| `date` | text | The entry date in `YYYY-MM-DD` format |
| `content` | text | The diary text |
| `mood` | text | One of: happy, excited, content, neutral, anxious, sad, angry |
| `is_shared` | boolean | Whether the entry appears in the Community feed (default: false) |
| `created_at` | timestamptz | When first saved |
| `updated_at` | timestamptz | Last save time (updated on every autosave) |

A unique constraint on `(user_id, date)` ensures one entry per user per day.

**`entry_likes`** — tracks who liked which shared entry.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `entry_id` | uuid | References `diary_entries.id` |
| `user_id` | text | Clerk user ID of the person who liked it |
| `created_at` | timestamptz | When the like was made |

**`entry_comments`** — short anonymous comments on shared entries.

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Primary key |
| `entry_id` | uuid | References `diary_entries.id` |
| `user_id` | text | Clerk user ID of the commenter |
| `body` | text | Comment text (max 140 characters) |
| `created_at` | timestamptz | When the comment was posted |

There is also a PostgreSQL function `get_shared_entries(viewer_id, row_limit)` that returns shared entries in random order, used by the Community feed.

**Current data:** 4 diary entries, 2 likes, 2 comments across all users.

My reflection: yes it basically matches what I imagined. Plus, it also created entry likes table, which i probably would intergrate in the old one. It also adds a constraint that ensures one entry per user per day.