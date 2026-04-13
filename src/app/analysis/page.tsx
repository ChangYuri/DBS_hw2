'use client';

import { useEffect, useState } from 'react';
import { subDays } from 'date-fns';
import { DiaryEntry, Mood } from '@/types/diary';
import { getAllEntries } from '@/lib/db';
import { toDateKey } from '@/lib/dates';

const MOOD_CONFIG: Record<Mood, { label: string; emoji: string; color: string; bg: string }> = {
  happy:   { label: 'Happy',   emoji: '😊', color: 'bg-amber-400',  bg: 'bg-amber-50'  },
  excited: { label: 'Excited', emoji: '🤩', color: 'bg-yellow-400', bg: 'bg-yellow-50' },
  content: { label: 'Content', emoji: '😌', color: 'bg-green-400',  bg: 'bg-green-50'  },
  neutral: { label: 'Neutral', emoji: '😐', color: 'bg-stone-400',  bg: 'bg-stone-50'  },
  anxious: { label: 'Anxious', emoji: '😰', color: 'bg-purple-400', bg: 'bg-purple-50' },
  sad:     { label: 'Sad',     emoji: '😢', color: 'bg-blue-400',   bg: 'bg-blue-50'   },
  angry:   { label: 'Angry',   emoji: '😠', color: 'bg-red-400',    bg: 'bg-red-50'    },
};

export default function AnalysisPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllEntries().then(setEntries);
  }, []);

  const today = new Date();
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(today, 13 - i);
    return toDateKey(d);
  });

  const entryMap = Object.fromEntries(entries.map((e) => [e.date, e]));

  // Stats
  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, e) => sum + e.content.split(/\s+/).filter(Boolean).length, 0);
  const avgWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

  // Streak
  let streak = 0;
  let cursor = new Date();
  const dateSet = new Set(entries.map((e) => e.date));
  while (dateSet.has(toDateKey(cursor))) { streak++; cursor = subDays(cursor, 1); }

  // Mood distribution over last 14 days
  const moodCounts: Partial<Record<Mood, number>> = {};
  last14.forEach((date) => {
    const mood = entryMap[date]?.mood;
    if (mood) moodCounts[mood] = (moodCounts[mood] ?? 0) + 1;
  });
  const moodedDays = Object.values(moodCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-8">
      <h1 className="font-serif text-3xl text-stone-800 mb-1">Analysis</h1>
      <p className="text-sm text-stone-400 font-sans mb-8">Your past 14 days at a glance.</p>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total entries', value: totalEntries },
          { label: 'Total words', value: totalWords.toLocaleString() },
          { label: 'Avg words/entry', value: avgWords },
          { label: 'Current streak', value: `${streak}d` },
        ].map(({ label, value }) => (
          <div key={label} className="panel text-center">
            <p className="font-serif text-2xl text-stone-800">{value}</p>
            <p className="text-xs text-stone-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* 14-day mood chart */}
      <div className="mb-10">
        <p className="panel-label mb-4">Mood — last 14 days</p>
        <div className="flex gap-1 items-end">
          {last14.map((date) => {
            const entry = entryMap[date];
            const mood = entry?.mood;
            const d = new Date(date + 'T00:00:00');
            const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  title={mood ? MOOD_CONFIG[mood].label : 'No mood logged'}
                  className={`w-full h-8 rounded-sm ${mood ? MOOD_CONFIG[mood].color : 'bg-stone-100'} transition-colors`}
                />
                <span className="text-[9px] text-stone-400 leading-none" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 36 }}>
                  {dayLabel}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 flex-wrap mt-4">
          {(Object.keys(MOOD_CONFIG) as Mood[]).map((mood) => (
            <span key={mood} className="flex items-center gap-1 text-xs text-stone-500">
              <span className={`inline-block w-2.5 h-2.5 rounded-sm ${MOOD_CONFIG[mood].color}`} />
              {MOOD_CONFIG[mood].label}
            </span>
          ))}
        </div>
      </div>

      {/* Mood distribution */}
      {moodedDays > 0 && (
        <div>
          <p className="panel-label mb-4">Mood distribution</p>
          <div className="space-y-2">
            {(Object.keys(MOOD_CONFIG) as Mood[])
              .filter((m) => moodCounts[m])
              .sort((a, b) => (moodCounts[b] ?? 0) - (moodCounts[a] ?? 0))
              .map((mood) => {
                const count = moodCounts[mood] ?? 0;
                const pct = Math.round((count / moodedDays) * 100);
                return (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-lg">{MOOD_CONFIG[mood].emoji}</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${MOOD_CONFIG[mood].color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-500 w-16 text-right">{count}d ({pct}%)</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {moodedDays === 0 && (
        <p className="text-stone-400 italic text-sm">No moods logged in the last 14 days. Start by picking a mood on the main page.</p>
      )}
    </div>
  );
}
