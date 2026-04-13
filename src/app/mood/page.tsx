'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiaryEntry, Mood } from '@/types/diary';
import { getAllEntries } from '@/lib/db';
import { toDateKey } from '@/lib/dates';

const MOOD_COLOR: Record<Mood, string> = {
  happy:   'bg-amber-300',
  excited: 'bg-yellow-300',
  content: 'bg-green-300',
  neutral: 'bg-stone-300',
  anxious: 'bg-purple-300',
  sad:     'bg-blue-300',
  angry:   'bg-red-300',
};

const MOOD_EMOJI: Record<Mood, string> = {
  happy: '😊', excited: '🤩', content: '😌', neutral: '😐', anxious: '😰', sad: '😢', angry: '😠',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MoodPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth()); // 0-indexed

  useEffect(() => {
    getAllEntries().then(setEntries);
  }, []);

  const entryMap = Object.fromEntries(entries.map((e) => [e.date, e]));

  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay(); // 0=Sun

  const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const today = toDateKey(new Date());

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-8">
      <h1 className="font-serif text-3xl text-stone-800 mb-1">Mood Calendar</h1>
      <p className="text-sm text-stone-400 font-sans mb-8">Your emotional landscape, day by day.</p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="text-stone-400 hover:text-stone-600 transition-colors px-2 py-1">←</button>
        <p className="font-serif text-lg text-stone-800">{monthLabel}</p>
        <button onClick={nextMonth} className="text-stone-400 hover:text-stone-600 transition-colors px-2 py-1">→</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-stone-400 font-sans uppercase tracking-widest py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const entry = entryMap[dateStr];
          const mood = entry?.mood;
          const isToday = dateStr === today;
          return (
            <Link key={dateStr} href={`/archive/${dateStr}`}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all hover:opacity-80 ${
                mood ? MOOD_COLOR[mood] : 'bg-stone-100'
              } ${isToday ? 'ring-2 ring-stone-800 ring-offset-1' : ''}`}
              title={mood ? MOOD_EMOJI[mood] + ' ' + mood : 'No entry'}>
              <span className="text-xs font-sans text-stone-700 font-medium">{dayNum}</span>
              {mood && <span className="text-[10px] leading-none">{MOOD_EMOJI[mood]}</span>}
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-6">
        {(Object.keys(MOOD_COLOR) as Mood[]).map((mood) => (
          <span key={mood} className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className={`w-3 h-3 rounded-sm ${MOOD_COLOR[mood]}`} />
            {mood}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-xs text-stone-400">
          <span className="w-3 h-3 rounded-sm bg-stone-100" />
          no entry
        </span>
      </div>
    </div>
  );
}
