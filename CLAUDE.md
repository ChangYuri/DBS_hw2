# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Read the Next.js docs first

This project uses **Next.js 16.2.2** — APIs, caching behavior, and conventions differ significantly from versions in your training data. Before writing any route handler, Server Component, or fetch call, read the relevant guide in `node_modules/next/dist/docs/`. Key areas that differ:

- **Fetch caching**: Default behavior is `auto no cache` (not cached). Use `{ next: { revalidate: N } }` for server-side caching. `Cache-Control` headers alone do not cache on the server.
- **`'use client'` directive**: Only needed at the boundary file, not every client component. Components that use `localStorage`, `useState`, `useEffect`, or browser APIs must be client components.
- **`params` in dynamic routes**: `params` is a `Promise` in App Router — use `use(params)` or `await params` to unwrap it.
- **Fonts**: Load via `next/font/google` with `variable` option, then reference in CSS with `var(--font-name)`. Italic variants must be explicitly requested with `style: ["normal", "italic"]`.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (also runs TypeScript check)
npx tsc --noEmit # Type check without building
```

No test runner is configured.

## Architecture

**All diary data is stored in `localStorage` only — there is no database.** The server never sees user entries. Key format: `diary-YYYY-MM-DD`. Value: JSON-serialized `DiaryEntry` (see `src/types/diary.ts`).

### Data flow

```
src/types/diary.ts          → shared types (DiaryEntry, Mood, API response shapes)
src/lib/localStorage.ts     → getEntry / saveEntry / saveMood / getAllEntries
src/lib/dates.ts            → date key helpers (uses date-fns)
src/hooks/useDiaryEntry.ts  → autosave hook (800ms debounce) + saveNow for manual save
src/hooks/useLastYear.ts    → reads localStorage for 3 days around this date last year
```

### External APIs (proxied through Next.js API routes)

Both routes use `{ next: { revalidate } }` on the fetch call for server-side caching:

- `/api/on-this-day` — Wikipedia REST API, no key needed, cached 24h
- `/api/news` — NewsAPI.org, requires `NEWS_API_KEY` in `.env.local`, cached 30min

"Last year this time" reads localStorage client-side — no API route.

### Pages (all 7 use `'use client'` because they read localStorage)

| Route | File |
|---|---|
| `/` | `src/app/page.tsx` — editor + mood picker + sidebar panels |
| `/archive` | `src/app/archive/page.tsx` |
| `/archive/[date]` | `src/app/archive/[date]/page.tsx` |
| `/analysis` | `src/app/analysis/page.tsx` — 14-day mood chart, stats |
| `/search` | `src/app/search/page.tsx` — live full-text search |
| `/mood` | `src/app/mood/page.tsx` — monthly mood calendar |
| `/settings` | `src/app/settings/page.tsx` — export JSON/text, clear data |

### Styling

Tailwind v4 (`@import "tailwindcss"` in `globals.css`). Font tokens are mapped in `@theme inline`:

```css
--font-serif: var(--font-lora), Georgia, serif;
--font-sans:  var(--font-inter), system-ui, sans-serif;
```

Design accent color is `#C96A50` (coral). The `.panel` CSS class is the shared sidebar card style. Mood color mapping lives in `src/app/analysis/page.tsx` and `src/app/mood/page.tsx` — keep them in sync if moods change.

### Mood system

`Mood` is a union type in `src/types/diary.ts`. Moods are stored inside the `DiaryEntry` blob (not a separate key). `saveMood()` reads the existing entry, patches the `mood` field, and writes back — it preserves `content` and `createdAt`.
