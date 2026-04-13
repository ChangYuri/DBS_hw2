# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Keep this file up to date.** Whenever you make a major code change — new page, new API route, new dependency, architecture shift — update the relevant section of this file before finishing the task.

## Important: Read the Next.js docs first

This project uses **Next.js 16.2.2** — APIs, caching behavior, and conventions differ significantly from versions in your training data. Before writing any route handler, Server Component, or fetch call, read the relevant guide in `node_modules/next/dist/docs/`. Key areas that differ:

- **Fetch caching**: Default behavior is `auto no cache` (not cached). Use `{ next: { revalidate: N } }` for server-side caching. `Cache-Control` headers alone do not cache on the server.
- **`'use client'` directive**: Only needed at the boundary file, not every client component. Components that use `useState`, `useEffect`, or browser APIs must be client components.
- **`params` in dynamic routes**: `params` is a `Promise` in App Router — use `use(params)` or `await params` to unwrap it.
- **Fonts**: Load via `next/font/google` with `variable` option, then reference in CSS with `var(--font-name)`. Italic variants must be explicitly requested with `style: ["normal", "italic"]`.
- **Middleware**: The `middleware.ts` convention is deprecated in Next.js 16 — use `src/proxy.ts` instead.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs TypeScript check)
npx tsc --noEmit # Type check without building
```

No test runner is configured. Deployed at: https://dbs-hw2.vercel.app

## Architecture

**Diary data is stored in Supabase (Postgres).** All reads/writes go through Next.js API routes that verify the user's identity via Clerk before touching the database. The browser never calls Supabase directly.

```
Browser → Next.js API Route → Clerk (auth check) → Supabase (read/write)
```

### Auth: Clerk

- Provider: Clerk v7 (`@clerk/nextjs`)
- `src/proxy.ts` — middleware (Next.js 16 convention); protects all routes except `/sign-in`, `/sign-up`, `/api/on-this-day`, `/api/news`
- `ClerkProvider` wraps the app in `src/app/layout.tsx`
- Server-side identity: `auth()` from `@clerk/nextjs/server` inside API routes
- Client-side UI: `<Show when="signed-in">` / `<Show when="signed-out">`, `SignInButton`, `UserButton`
- Env vars needed: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

### Database: Supabase

- `src/lib/supabase.ts` — creates server-only Supabase client using service role key; exports `rowToEntry()` helper
- Env vars needed: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

**Tables:**

| Table | Key columns |
|---|---|
| `diary_entries` | `id`, `user_id` (Clerk ID), `date` (YYYY-MM-DD), `content`, `mood`, `is_shared`, `created_at`, `updated_at` |
| `entry_likes` | `id`, `entry_id`, `user_id`, `created_at` |
| `entry_comments` | `id`, `entry_id`, `user_id`, `body` (max 140 chars), `created_at` |

RPC: `get_shared_entries(viewer_id, row_limit)` — returns shared entries in random order.

### Data layer

```
src/types/diary.ts        → DiaryEntry, Mood, CommunityEntry, CommunityComment types
src/lib/db.ts             → async client: getEntry / saveEntry / saveMood / getAllEntries /
                            deleteAllEntries / setShared / getCommunityEntries /
                            toggleLike / postComment
src/lib/supabase.ts       → server-only Supabase client + rowToEntry()
src/lib/dates.ts          → date key helpers (uses date-fns)
src/hooks/useDiaryEntry.ts → autosave hook (800ms debounce) + saveNow for manual save
src/hooks/useLastYear.ts  → fetches 3 days around this date last year via getEntry()
```

### API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/diary` | GET | All entries for current user |
| `/api/diary` | DELETE | Delete all entries for current user |
| `/api/diary/[date]` | GET | Single entry by date |
| `/api/diary/[date]` | PUT | Upsert entry (content, mood, is_shared) |
| `/api/on-this-day` | GET | Wikipedia REST API proxy, cached 24h |
| `/api/news` | GET | NewsAPI.org proxy, cached 30min, requires `NEWS_API_KEY` |
| `/api/community` | GET | Random shared entries with like counts + comments |
| `/api/community/likes` | POST | Toggle like on an entry |
| `/api/community/comments` | POST | Add a comment (max 140 chars) |

### Pages

All pages use `'use client'` because they fetch data via `db.ts` in `useEffect`.

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Editor + mood picker + share toggle + sidebar panels |
| `/archive` | `src/app/archive/page.tsx` | List of all entries |
| `/archive/[date]` | `src/app/archive/[date]/page.tsx` | Single entry view |
| `/analysis` | `src/app/analysis/page.tsx` | 14-day mood chart, stats |
| `/search` | `src/app/search/page.tsx` | Live full-text search (loads all entries, filters client-side) |
| `/mood` | `src/app/mood/page.tsx` | Monthly mood calendar |
| `/settings` | `src/app/settings/page.tsx` | Export JSON/text, clear all data |
| `/community` | `src/app/community/page.tsx` | Anonymous shared entries, likes, comments |
| `/sign-in` | Clerk hosted | |
| `/sign-up` | Clerk hosted | |

### Styling

Tailwind v4 (`@import "tailwindcss"` in `globals.css`). Font tokens are mapped in `@theme inline`:

```css
--font-serif: var(--font-lora), Georgia, serif;
--font-sans:  var(--font-inter), system-ui, sans-serif;
```

Design accent color is `#C96A50` (coral). The `.panel` CSS class is the shared sidebar card style. Mood color mapping lives in `src/app/analysis/page.tsx` and `src/app/mood/page.tsx` — keep them in sync if moods change.

### Mood system

`Mood` is a union type in `src/types/diary.ts`. Moods are stored inside the `DiaryEntry` blob. `saveMood()` in `db.ts` reads the existing entry, patches the `mood` field, and writes back — it preserves `content` and `createdAt`.
