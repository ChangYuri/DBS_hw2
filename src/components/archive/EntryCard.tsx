import Link from 'next/link';
import { DiaryEntry } from '@/types/diary';

export function EntryCard({ entry }: { entry: DiaryEntry }) {
  const d = new Date(entry.date + 'T00:00:00');
  const displayDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const excerpt = entry.content.slice(0, 120).trim();
  const wordCount = entry.content.split(/\s+/).filter(Boolean).length;

  return (
    <Link href={`/archive/${entry.date}`}
      className="flex gap-6 py-5 border-b border-stone-200 hover:bg-stone-50 transition-colors px-2 -mx-2 group">
      <div className="w-36 shrink-0">
        <p className="font-serif text-lg text-stone-800">{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        <p className="text-xs text-stone-400">{d.getFullYear()}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-700 leading-relaxed line-clamp-2">{excerpt || <em className="text-stone-400">Empty entry</em>}</p>
        <p className="text-xs text-stone-400 mt-1">{wordCount} {wordCount === 1 ? 'word' : 'words'}</p>
      </div>
    </Link>
  );
}
