'use client';

import useSWR from 'swr';
import { OnThisDayEvent } from '@/types/diary';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface OnThisDayPanelProps {
  month: string;
  day: string;
}

export function OnThisDayPanel({ month, day }: OnThisDayPanelProps) {
  const { data, error, isLoading } = useSWR<{ events: OnThisDayEvent[] }>(
    `/api/on-this-day?month=${month}&day=${day}`,
    fetcher
  );

  return (
    <div className="panel">
      <p className="panel-label">Today in History</p>
      {isLoading && <p className="text-sm text-stone-400 italic">Loading...</p>}
      {error && <p className="text-sm text-stone-400 italic">Couldn&apos;t load history.</p>}
      {data?.events && (
        <ul className="space-y-3 max-h-40 overflow-y-auto pr-1">
          {data.events.slice(0, 3).map((e, i) => (
            <li key={i} className="text-sm text-stone-700 leading-relaxed">
              <span className="font-semibold text-stone-500">{e.year}</span> — {e.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
