'use client';

import { DiaryEntry } from '@/types/diary';
import { getLastYearKeys } from '@/lib/dates';

interface LastYearPanelProps {
  entries: DiaryEntry[];
  today: Date;
}

export function LastYearPanel({ entries, today }: LastYearPanelProps) {
  const keys = getLastYearKeys(today);
  const entryMap = Object.fromEntries(entries.map((e) => [`diary-${e.date}`, e]));

  return (
    <div className="panel">
      <p className="panel-label">Last Year</p>
      <div className="space-y-4">
        {keys.map((key) => {
          const entry = entryMap[key];
          const dateStr = key.replace('diary-', '');
          const d = new Date(dateStr + 'T00:00:00');
          const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return (
            <div key={key}>
              <p className="text-xs font-semibold text-stone-400 mb-1">{label}</p>
              {entry ? (
                <p className="text-sm text-stone-700 leading-relaxed line-clamp-3">{entry.content}</p>
              ) : (
                <p className="text-xs text-stone-300 italic">Nothing written.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
