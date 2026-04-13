'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiaryEntry } from '@/types/diary';
import { getAllEntries } from '@/lib/db';

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200 text-stone-800">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [allEntries, setAllEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then(setAllEntries);
  }, []);

  const results = query.trim()
    ? allEntries.filter((e) => e.content.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-8">
      <h1 className="font-serif text-3xl text-stone-800 mb-6">Search</h1>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search your entries..."
        className="w-full font-sans text-sm bg-[#F5F0E8] border border-stone-200 rounded-lg px-4 py-3 focus:outline-none focus:border-stone-400 placeholder:text-stone-300 text-stone-800 mb-6"
        autoFocus
      />

      {query.trim() && results.length === 0 && (
        <p className="text-stone-400 italic text-sm">No entries match your search.</p>
      )}

      {results.map((entry) => {
        const d = new Date(entry.date + 'T00:00:00');
        const displayDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const excerpt = entry.content.slice(0, 200);
        return (
          <Link key={entry.date} href={`/archive/${entry.date}`}
            className="block py-4 border-b border-stone-200 hover:bg-stone-50 transition-colors px-2 -mx-2">
            <p className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1">{displayDate}</p>
            <p className="font-serif text-sm text-stone-700 leading-relaxed">
              {highlight(excerpt, query)}
              {entry.content.length > 200 && '…'}
            </p>
          </Link>
        );
      })}

      {!query.trim() && (
        <p className="text-stone-300 italic text-sm text-center mt-12">Type to search across all your entries.</p>
      )}
    </div>
  );
}
