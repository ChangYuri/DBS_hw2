import { DiaryEntry, Mood } from '@/types/diary';

const ENTRY_PATTERN = /^diary-\d{4}-\d{2}-\d{2}$/;

export function getEntry(storageKey: string): DiaryEntry | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as DiaryEntry;
  } catch {
    return null;
  }
}

export function saveEntry(storageKey: string, content: string): DiaryEntry {
  const existing = getEntry(storageKey);
  const now = new Date().toISOString();
  const date = storageKey.replace('diary-', '');
  const entry: DiaryEntry = {
    date,
    content,
    mood: existing?.mood,  // preserve existing mood
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  localStorage.setItem(storageKey, JSON.stringify(entry));
  return entry;
}

export function saveMood(storageKey: string, mood: Mood | null): DiaryEntry {
  const existing = getEntry(storageKey);
  const now = new Date().toISOString();
  const date = storageKey.replace('diary-', '');
  const entry: DiaryEntry = {
    date,
    content: existing?.content ?? '',
    mood: mood ?? undefined,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  localStorage.setItem(storageKey, JSON.stringify(entry));
  return entry;
}

export function getAllEntries(): DiaryEntry[] {
  const entries: DiaryEntry[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && ENTRY_PATTERN.test(key)) {
      const entry = getEntry(key);
      if (entry) entries.push(entry);
    }
  }
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}
