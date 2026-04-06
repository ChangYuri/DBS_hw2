'use client';

import { useMemo } from 'react';
import { DiaryEntry } from '@/types/diary';
import { getEntry } from '@/lib/localStorage';
import { getLastYearKeys } from '@/lib/dates';

export function useLastYear(today: Date): DiaryEntry[] {
  return useMemo(() => {
    return getLastYearKeys(today)
      .map((key) => getEntry(key))
      .filter((e): e is DiaryEntry => e !== null);
  }, [today]);
}
