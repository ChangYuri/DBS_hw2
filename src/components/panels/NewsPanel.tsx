'use client';

import useSWR from 'swr';
import { NewsArticle } from '@/types/diary';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface NewsResponse {
  articles?: NewsArticle[];
  error?: string;
}

export function NewsPanel() {
  const { data, error, isLoading } = useSWR<NewsResponse>(
    '/api/news',
    fetcher
  );

  return (
    <div className="panel">
      <p className="panel-label">Today&apos;s News</p>
      {isLoading && <p className="text-sm text-stone-400 italic">Loading...</p>}
      {error && <p className="text-sm text-stone-400 italic">Couldn&apos;t load news.</p>}
      {data?.error && <p className="text-sm text-stone-400 italic">News API key not configured.</p>}
      {data?.articles && (
        <ul className="space-y-3">
          {data.articles.map((a, i) => (
            <li key={i}>
              <a href={a.url} target="_blank" rel="noopener noreferrer"
                className="text-sm text-stone-700 leading-relaxed hover:opacity-60 transition-opacity">
                {a.title}
              </a>
              <p className="text-xs text-stone-400 mt-0.5">{a.source}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
