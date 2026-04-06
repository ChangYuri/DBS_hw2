'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { DiaryEntry } from '@/types/diary';
import { getEntry } from '@/lib/localStorage';
import { DateHeader } from '@/components/diary/DateHeader';

export default function EntryPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const [entry, setEntry] = useState<DiaryEntry | null | undefined>(undefined);

  useEffect(() => {
    setEntry(getEntry(`diary-${date}`));
  }, [date]);

  if (entry === undefined) return null;

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-8">
      <DateHeader date={date} />
      {entry ? (
        <div className="font-serif text-lg leading-8 text-stone-800 whitespace-pre-wrap">
          {entry.content}
        </div>
      ) : (
        <p className="text-stone-400 italic">No entry found for this date.</p>
      )}
      <Link href="/archive"
        className="mt-10 inline-block text-xs font-sans text-stone-400 uppercase tracking-widest hover:text-stone-600 transition-colors">
        ← Back to Archive
      </Link>
    </div>
  );
}
