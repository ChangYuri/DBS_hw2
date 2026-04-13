'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry } from '@/types/diary';
import { getEntry } from '@/lib/db';
import { toDateKey } from '@/lib/dates';
import { subYears, subDays } from 'date-fns';

export function useLastYear(today: Date): DiaryEntry[] {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const dates = [0, 1, 2].map((offset) =>
      toDateKey(subYears(subDays(today, offset), 1))
    );
    Promise.all(dates.map(getEntry)).then((results) => {
      setEntries(results.filter((e): e is DiaryEntry => e !== null));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return entries;
}
