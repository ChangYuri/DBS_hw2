# Submission: Code Path Trace — `/analysis`

## Route

**URL:** `/analysis`
**File:** `src/app/analysis/page.tsx`

---

## How the page renders

The file starts with `'use client'`, which means Next.js renders it entirely in the browser — no server-side rendering, no API calls.

When the component mounts, a `useEffect` fires once and calls `getAllEntries()`:

```typescript
useEffect(() => {
  setEntries(getAllEntries());
}, []);
```

This populates the `entries` state array, which drives every number, chart, and bar on the page.

---

## Where the data comes from

**Function:** `getAllEntries()` in `src/lib/localStorage.ts`

```typescript
export function getAllEntries(): DiaryEntry[] {
  const entries: DiaryEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && ENTRY_PATTERN.test(key)) {  // /^diary-\d{4}-\d{2}-\d{2}$/
      const entry = getEntry(key);
      if (entry) entries.push(entry);
    }
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}
```

It scans every key in the browser's `localStorage`, keeps the ones that match the pattern `diary-YYYY-MM-DD`, parses each as a `DiaryEntry` JSON object, and returns them sorted newest-first. Nothing is fetched from a server — all data lives in the user's own browser storage.

---

## Data type

**File:** `src/types/diary.ts`

```typescript
export type Mood = 'happy' | 'excited' | 'content' | 'neutral' | 'anxious' | 'sad' | 'angry';

export interface DiaryEntry {
  date: string;       // "YYYY-MM-DD"
  content: string;
  mood?: Mood;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}
```

Each entry is a flat JSON object stored under the key `diary-YYYY-MM-DD`.

---

## How the 14-day window is computed

**File:** `src/app/analysis/page.tsx` (inline, no separate component)
**Dependency:** `subDays` from `date-fns`, `toDateKey` from `src/lib/dates.ts`

```typescript
const today = new Date();
const last14 = Array.from({ length: 14 }, (_, i) => {
  const d = subDays(today, 13 - i);
  return toDateKey(d);   // → "YYYY-MM-DD"
});
```

This builds an array of 14 date strings ending on today, oldest first. `toDateKey` calls `date-fns/format(date, 'yyyy-MM-dd')`.

An `entryMap` is then built for O(1) lookup:

```typescript
const entryMap = Object.fromEntries(entries.map((e) => [e.date, e]));
```

---

## What gets rendered

Everything on the page is computed directly from `entries` and `last14` — no child components are imported. The page renders three sections:

### 1. Stats row (4 cards)
- **Total entries** — `entries.length`
- **Total words** — sum of `entry.content.split(/\s+/).filter(Boolean).length` across all entries
- **Avg words/entry** — `totalWords / totalEntries`, rounded
- **Current streak** — walks backward from today using `subDays`, counting consecutive days that have an entry in `dateSet`

### 2. 14-day mood chart
One column per day in `last14`. Each column's color comes from `MOOD_CONFIG[mood].color` (a Tailwind class). If no mood was logged that day, the bar is `bg-stone-100` (light grey). A color legend is rendered below.

`MOOD_CONFIG` is defined at the top of the page file and maps each `Mood` to a label, emoji, and two Tailwind color classes:

```typescript
const MOOD_CONFIG: Record<Mood, { label: string; emoji: string; color: string; bg: string }> = {
  happy:   { label: 'Happy',   emoji: '😊', color: 'bg-amber-400',  bg: 'bg-amber-50'  },
  excited: { label: 'Excited', emoji: '🤩', color: 'bg-yellow-400', bg: 'bg-yellow-50' },
  content: { label: 'Content', emoji: '😌', color: 'bg-green-400',  bg: 'bg-green-50'  },
  neutral: { label: 'Neutral', emoji: '😐', color: 'bg-stone-400',  bg: 'bg-stone-50'  },
  anxious: { label: 'Anxious', emoji: '😰', color: 'bg-purple-400', bg: 'bg-purple-50' },
  sad:     { label: 'Sad',     emoji: '😢', color: 'bg-blue-400',   bg: 'bg-blue-50'   },
  angry:   { label: 'Angry',   emoji: '😠', color: 'bg-red-400',    bg: 'bg-red-50'    },
};
```

### 3. Mood distribution bars
Counts how many of the last 14 days had each mood, then renders a horizontal progress bar per mood (sorted by frequency, descending). Width is `(count / moodedDays) * 100`%. Hidden entirely if no moods were logged.

---

## Full dependency chain

```
/analysis  (URL)
  └── src/app/analysis/page.tsx          ('use client', single file, no child components)
        ├── getAllEntries()
        │     └── src/lib/localStorage.ts
        │           └── browser localStorage  ← actual data source
        ├── toDateKey()
        │     └── src/lib/dates.ts
        │           └── date-fns format()
        ├── subDays()
        │     └── date-fns
        └── DiaryEntry, Mood
              └── src/types/diary.ts
```

No API routes are involved. No network requests are made. The page is entirely self-contained: it reads from the local browser, computes everything inline, and renders pure CSS charts with Tailwind classes.
