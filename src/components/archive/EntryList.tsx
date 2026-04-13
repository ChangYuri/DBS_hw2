'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry } from '@/types/diary';
import { getAllEntries } from '@/lib/db';
import { EntryCard } from './EntryCard';

export function EntryList() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then(setEntries);
  }, []);

  if (entries.length === 0) {
    return <p className="text-stone-400 italic text-sm mt-8">No entries yet. Start writing today.</p>;
  }

  return (
    <div className="mt-4">
      {entries.map((entry) => (
        <EntryCard key={entry.date} entry={entry} />
      ))}
    </div>
  );
}
