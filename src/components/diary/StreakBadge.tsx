'use client';

import { useEffect, useState } from 'react';
import { getAllEntries } from '@/lib/localStorage';
import { toDateKey } from '@/lib/dates';
import { subDays } from 'date-fns';

export function StreakBadge() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const entries = getAllEntries();
    const dateSet = new Set(entries.map((e) => e.date));
    let count = 0;
    let cursor = new Date();
    while (dateSet.has(toDateKey(cursor))) {
      count++;
      cursor = subDays(cursor, 1);
    }
    setStreak(count);
  }, []);

  if (streak === 0) return null;

  return (
    <span className="font-sans text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      {streak}-day streak
    </span>
  );
}
