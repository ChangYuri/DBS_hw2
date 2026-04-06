'use client';

import { useMemo, useState } from 'react';
import { toStorageKey, getLastYearKeys } from '@/lib/dates';
import { useDiaryEntry } from '@/hooks/useDiaryEntry';
import { useLastYear } from '@/hooks/useLastYear';
import { Editor } from '@/components/diary/Editor';
import { SaveStatus } from '@/components/diary/SaveStatus';
import { DateHeader } from '@/components/diary/DateHeader';
import { MoodPicker } from '@/components/diary/MoodPicker';
import { StreakBadge } from '@/components/diary/StreakBadge';
import { LastYearPanel } from '@/components/panels/LastYearPanel';
import { OnThisDayPanel } from '@/components/panels/OnThisDayPanel';
import { NewsPanel } from '@/components/panels/NewsPanel';
import { Mood } from '@/types/diary';

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const storageKey = toStorageKey(today);

  const { content, setContent, saveStatus, entry } = useDiaryEntry(storageKey);
  const [currentMood, setCurrentMood] = useState<Mood | undefined>(entry?.mood);
  const lastYearEntries = useLastYear(today);

  // Sync mood from loaded entry
  useMemo(() => {
    if (entry?.mood) setCurrentMood(entry.mood);
  }, [entry]);

  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return (
    <div className="flex flex-1 max-w-7xl mx-auto w-full px-6 py-8 gap-10">
      {/* Editor area */}
      <section className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 mb-6">
          <DateHeader date={today} />
          <StreakBadge />
        </div>
        <MoodPicker
          storageKey={storageKey}
          currentMood={currentMood}
          onMoodChange={(m) => setCurrentMood(m ?? undefined)}
        />
        <Editor content={content} onChange={setContent} />
        <div className="mt-3 h-5">
          <SaveStatus status={saveStatus} />
        </div>
      </section>

      {/* Sidebar */}
      <aside className="w-80 shrink-0 flex flex-col gap-4">
        <LastYearPanel entries={lastYearEntries} today={today} />
        <OnThisDayPanel month={month} day={day} />
        <NewsPanel />
      </aside>
    </div>
  );
}
