'use client';

import { useMemo, useState } from 'react';
import { toDateKey } from '@/lib/dates';
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
import { setShared } from '@/lib/db';

export default function HomePage() {
  const today = useMemo(() => new Date(), []);
  const dateKey = toDateKey(today);

  const { content, setContent, saveNow, saveStatus, entry } = useDiaryEntry(dateKey);
  const [currentMood, setCurrentMood] = useState<Mood | undefined>(entry?.mood);
  const [isShared, setIsShared] = useState(false);
  const lastYearEntries = useLastYear(today);

  useMemo(() => {
    if (entry?.mood) setCurrentMood(entry.mood);
    if (entry?.isShared !== undefined) setIsShared(entry.isShared);
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
          date={dateKey}
          currentMood={currentMood}
          onMoodChange={(m) => setCurrentMood(m ?? undefined)}
        />
        <Editor content={content} onChange={setContent} />
        <div className="mt-4 flex items-center gap-3">
          <button
            role="switch"
            aria-checked={isShared}
            onClick={async () => {
              const next = !isShared;
              setIsShared(next);
              await setShared(dateKey, next);
            }}
            className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${isShared ? '' : 'bg-stone-200'}`}
            style={isShared ? { background: '#C96A50' } : {}}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isShared ? 'left-4' : 'left-0.5'}`} />
          </button>
          <span className="font-sans text-xs text-stone-400">Share today&apos;s entry</span>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <button
            onClick={() => saveNow(content)}
            className="px-4 py-1.5 rounded-full text-xs font-sans border transition-all text-white"
            style={{ background: '#C96A50', borderColor: '#C96A50' }}
          >
            Save
          </button>
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
