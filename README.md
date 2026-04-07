# My Diary

A personal diary app that gives you a quiet space to write every day, with a little context from the world around you.

## What it does

**Write** — Open the app and start writing. Your entry saves automatically as you type, and there's a Save button if you want to be sure. Pick a mood for the day from the feeling buttons above the editor.

**Remember** — The sidebar shows what you wrote on this same date last year (and the two days before it), so you can see how things have changed.

**Discover** — While you write, the sidebar also shows a few things that happened in history on today's date, and today's top news headlines for context.

**Look back** — Browse every past entry in the Archive, search across all your writing, or view your mood history as a monthly calendar.

**Understand yourself** — The Analysis page shows a 14-day mood chart and writing stats like your current streak and average words per entry.

## Pages

| Page | What's there |
|---|---|
| `/` | Today's diary entry |
| `/archive` | All past entries, newest first |
| `/archive/[date]` | A single past entry |
| `/analysis` | Mood chart + writing stats |
| `/search` | Search across all entries |
| `/mood` | Monthly mood calendar |
| `/settings` | Export or delete your data |

## Your data

Everything you write is stored locally in your browser — nothing is sent to any server. This means your diary is private to your device. You can export all your entries as JSON or plain text from the Settings page.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To enable the news headlines sidebar, create a `.env.local` file:

```
NEWS_API_KEY=your_key_from_newsapi.org
```

The "Today in History" sidebar uses the Wikipedia API and works without any setup.
